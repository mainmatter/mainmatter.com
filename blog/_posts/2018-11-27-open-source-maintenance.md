---
layout: article
section: Blog
title: "Open Source Maintenance"
author: "Tobias Bieniek"
github-handle: Turbo87
twitter-handle: tobiasbieniek
---

People often ask us how we can handle maintaining a large number of open-source
projects. In this blog post we will introduce you to some of the techniques we
have developed or discovered to simplify and speed up working on open-source
(and other) projects.

<!--break-->

<style>
code {
  white-space: nowrap;
}
</style>

#### Git

Version control systems have always been an important part of professional
software development, but the development of [git] over a decade ago and a
short while later [GitHub] has made version control mainstream for open source
projects.

While a lot of tutorials focus on using git from the command line, we have found
that using a graphical user interface to visualize the history graph can make
it quite a bit easier for beginners to understand what is going on. One good
example of such a tool is [Fork], which is freely available for Windows and Mac:

![Screenshot of Fork](/images/posts/2018-11-27-open-source-maintenance/git-fork.png)

When working on multiple different projects it is very useful to rely on similar
conventions, for example when naming things. In the context of git this is most
relevant when naming [remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
and branches.

For branches we use the default `master` branch as our main development branch.
Feature branches are named after the thing that they are implementing or fixing
and ideally only contain isolated, focused changes. If we publish new releases
we "tag" the release commits with a tag name like `v1.2.3`, corresponding to
the new version. Similar to that we sometimes keep version branches around to
support older releases with names like `v1.x` or `v2.3.x`.

For remotes we use `upstream`, `origin` and for all other remotes the GitHub
(or GitLab, BitBucket, etc.) username of the remote owner. `upstream` means the
main project on GitHub and `origin` is my personal fork where I push feature
branches, which will turn into PRs against the `upstream` repository. Here is an 
example for our `qunit-dom` project on my machine:

| `upstream` | `git@github.com:simplabs/qunit-dom.git` |
| `origin` | `git@github.com:Turbo87/qunit-dom.git` |
| `lukemelia` | `git@github.com:lukemelia/qunit-dom.git` |
| `jackbeegan` | `git@github.com:jackbeegan/qunit-dom.git` |

Why is this useful? Because it allows us to define [shell aliases](https://shapeshed.com/unix-alias/)
for some of the most commonly used git commands for which we don't use a
graphical user interface. Here are a few examples of things we regularly use:

| `cl` | `git clone` | Clones a repository |
| `clu` | `git clone --origin=upstream` | Clones a repository, and uses `upstream` as the default remote name |
| `ao` | `git remote add origin` | Adds a new remote called `origin` |
| `gfu` | `git fetch upstream` | Updates the local copies of the `upstream` remote branches | 
| `gfo` | `git fetch origin` | Updates the local copies of the `origin` remote branches | 
| `gp` | `git push` | Pushes the current branch to the corresponding remote |
| `gph` | `git push -u origin HEAD` | Pushes the current branch as a new branch to the `origin` remote |
| `gpf` | `git push --force-with-lease` | Pushes the current branch to the corresponding remote, overwriting the existing history of the branch |

With these commands we can already speed up our workflow quite significantly.
Here is an example for working on `qunit-dom` from zero to open pull request:

```bash
clu git@github.com:simplabs/qunit-dom.git
cd qunit-dom
ao git@github.com:Turbo87/qunit-dom.git
# create a new git branch in the GUI
# work on things and create commits
gph
# click on the link in the console output to open a new GitHub PR for the branch
```

[git]: https://git-scm.com/
[GitHub]: https://github.com/
[Fork]: https://git-fork.com/

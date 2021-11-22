---
title: 'Open Source Maintenance'
authorHandle: tobiasbieniek
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek introduces best practices for simplifying and speeding up his
  work on open-source and other projects.'
tags: misc
tagline: |
  <p>People often ask us how we can handle maintaining a large number of open-source projects. In this blog post we will introduce you to some of out internal best practices we have developed or discovered to simplify and speed up working on open-source and other projects.</p>
---

## Git

Version control systems have always been an important part of professional
software development, but the development of [git] over a decade ago and the
subsequent development of [GitHub] has made version control mainstream for open
source projects.

While many tutorials focus on using Git from the command line, we have found
that using a graphical user interface to visualize the history graph can make it
quite a bit easier for beginners to understand what is going on. One good
example of such a tool is [Fork], which is freely available for Windows and
macOS:

![Screenshot of Fork](/assets/images/posts/2018-11-27-open-source-maintenance/git-fork.png#@1173-2346)

When working on multiple different projects, it is useful to rely on similar
conventions, for example, when naming things. In the context of Git this is most
relevant when naming
[remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes), tags
and branches.

When we publish new releases we "tag" the release commits with a tag name like
`v1.2.3`, corresponding to the new version. When working in the JavaScript
ecosystem we use `yarn version` (or `npm version`) to automatically adjust the
`version` field in the `package.json` file, commit the change and finally create
a tag on the new commit.

For branches we use the default `master` branch as our main development branch.
Feature branches are named after the thing that they are implementing or fixing
and ideally only contain isolated, focused changes. Similar to the tag names we
sometimes keep version branches around to support older releases with names like
`v1.x` or `v2.3.x`.

For remotes we use `upstream`, `origin` and for all other remotes the GitHub (or
GitLab, BitBucket, etc.) username of the remote owner. `upstream` means the main
project on GitHub and `origin` is my personal fork where I push feature
branches, which will turn into PRs against the `upstream` repository. Here is an
example for our `qunit-dom` project on my machine:

| Name         | URL                                       |
| ------------ | ----------------------------------------- |
| `upstream`   | `git@github.com:simplabs/qunit-dom.git`   |
| `origin`     | `git@github.com:Turbo87/qunit-dom.git`    |
| `lukemelia`  | `git@github.com:lukemelia/qunit-dom.git`  |
| `jackbeegan` | `git@github.com:jackbeegan/qunit-dom.git` |

Why is this useful? Because it allows us to define
[shell aliases](https://shapeshed.com/unix-alias/) for some of the most commonly
used git commands for which we don't use a graphical user interface. Here are a
few examples of things we regularly use:

| Alias | Command                       | Description                                                                                           |
| ----- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `cl`  | `git clone`                   | Clones a repository                                                                                   |
| `clu` | `git clone --origin=upstream` | Clones a repository, and uses `upstream` as the default remote name                                   |
| `ao`  | `git remote add origin`       | Adds a new remote called `origin`                                                                     |
| `gfu` | `git fetch upstream`          | Updates the local copies of the `upstream` remote branches                                            |
| `gfo` | `git fetch origin`            | Updates the local copies of the `origin` remote branches                                              |
| `gp`  | `git push`                    | Pushes the current branch to the corresponding remote                                                 |
| `gph` | `git push -u origin HEAD`     | Pushes the current branch as a new branch to the `origin` remote                                      |
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

## Tests

Having a good test suite is very important to be able to change code and be
confident that the change is not breaking anything. This is one of the major
reasons why we love [Ember.js], because it comes with a great testing system
out-of-the-box and allows us to write tests for all of the critical parts of the
apps that we develop.

You can find more information on testing in Ember.js on the official
[guides](https://guides.emberjs.com/release/testing/).

But this topic not limited to just Ember.js, other ecosystems have similar
tools. For Node.js the most popular testing solutions these days are [Jest] and
[Mocha]. In the [Rust] ecosystem testing is already built into their package
manager [cargo], but there are
[plenty of crates](https://github.com/rust-unofficial/awesome-rust#testing) to
make testing even more pleasant, including the very valuable [proptest] crate.

## Linting

Similar to testing frameworks, a lot of ecosystems have tools to run "static
analysis" on your code to find bugs before you even run the applications. These
tools are often called "Linters".

A very popular linter in the JavaScript world is [ESLint], which we often run in
combination with [Prettier], to also ensure that our code is formatted in a
consistent way.

Again, similar tools also exist in other ecosystems like Rust ([clippy] and
[rustfmt]), Python ([pyflakes] and [black]) or Elixir (`mix format`).

## Continuous Integration

The above points about testing and linting are nice to have, but if nobody runs
your tests then they don't provide any value. This is where continuous
integration (or short "CI") systems come into play. These kinds of systems are
coupled to your version control servers and automatically run linting checks and
tests whenever you upload new commits to the server.

Most of the time we use [TravisCI] for this purpose, which is coupled to GitHub,
free for open source projects, and supports running your tests on Linux and
macOS, and will soon support Windows too. Alternatives include the CI service
that is integrated into [GitLab], [CircleCI] (based on Docker images) and
[AppVeyor], which we currently use to test Windows support on projects where
this is relevant.

One important thing to mention here is that CI can not only run your test suite
but can often also do other things like publishing new versions of your
projects. On most of our projects we have configured TravisCI to automatically
publish new releases to [npm] whenever we push a new Git tag to the server. You
can find instruction on how to configure this in their official
[documentation](https://docs.travis-ci.com/user/deployment/npm/).

## Semantic Versioning

Semantic Versioning (or short "semver") is a way to assign meaning to version
numbers, and specifically to version number changes. The official
[specification](https://semver.org/) is a little longer, but there are five
important rules:

1. version numbers have three main parts called major, minor and patch version
   (Example: `v3.0.1`, major is `3`, minor is `0` and patch version is `1`)
2. when your release includes any changes that might break the apps of existing
   users you should increase the **major** version
3. when your release includes only bug fixes you should increase the **patch**
   version
4. for all other changes you should increase the **minor** version
5. if your version is below `v1.0.0` (e.g. `v0.4.3`) you can release breaking
   changes without increasing the major version because the project is
   considered "unstable"

Since the majority of package managers including [yarn], [cargo], [hex] and
[bundler] follow these semantics when resolving dependencies, it is very
important to comply with these rules. But they are also useful in order for your
users to get a sense of what they can expect from a new release.

While this can be controversial, we consider dropping support for older Node.js,
Elixir, Ruby, Rust, or other language releases a breaking change. This means
that if your package
[declares](https://docs.npmjs.com/files/package.json#engines) that it works with
Node.js 4, and you release a new version that needs at least Node.js 6, then you
should increase the **major** version.

## Dependency Update Services

Any sufficiently large open source project has at least a few dependencies that
it is built upon, and even smaller projects typically have at least a dependency
on a test framework. While keeping the dependencies of a single project
up-to-date is a manageable task, it is becoming a full-time job once you
maintain a larger number of separate projects.

Fortunately for us this is a task that can be automated quite well, at least if
you have a good test suite and continuous integration set up. While we first
used [Greenkeeper] for this task, we have lately transitioned to using
[dependabot], which supports not only npm, but all sorts of different package
managers, language ecosystems, and even monorepos.

Dependabot will automatically open Pull Requests on your projects whenever one
of your dependencies has published a new version. This will cause your CI
service to run the test suite against that new dependency version and tell you
whether it is compatible with your code or not. If configured, dependabot can
also automatically merge those Pull Requests once CI has finished and the test
suite passed.

## Changelogs

While Semantic Versioning helps your users to know if they need to expect
breaking changes from a release, it is much better to have a human-readable list
of changes that went into a release. This is what a "Changelog" is for.
Typically this is a `CHANGELOG.md` file in the root folder of your project that
lists all your released versions including the changes that went into each
release.

It can be quite tedious to write these things by hand, but fortunately there are
generators that can do most of the work for us. These generators can be divided
into two groups:

1. the first group is based on
   [semantic commit messages](https://seesparkbox.com/foundry/semantic_commit_messages)
   and lists all of the commits that are part of a certain release
2. the second group is based upon GitHub Pull Requests (or similar) and uses
   issue/PR labels to categorize changes

While "semantic commit messages" seem to be quite popular we prefer the second
group of changelog generators, as listing each commit often results in a long
list of very fine-grained changes that are not directly helpful to the user.

Instead we use [lerna-changelog] to generate our changelogs from all of the
merged pull requests that went into each of the releases. To make this work
properly it is important to focus each pull request on only one single, logical
change, and label it properly as either `enhancement`, `bug`, `breaking`, or any
of the other supported/configured labels. To ensure that all of our projects use
the same set of labels we use [github-label-sync].

An
[example changelog](https://github.com/simplabs/qunit-dom/blob/master/CHANGELOG.md)
can be seen on our qunit-dom project.

## Summary

We hope that this blog post helped you improve your processes and speed up your
own development. If you need help with any of these topics or if you have
questions we encourage you to [contact us](/contact/)!

[git]: https://git-scm.com/
[github]: https://github.com/
[fork]: https://git-fork.com/
[ember.js]: https://emberjs.com/
[jest]: https://jestjs.io/
[mocha]: https://mochajs.org/
[rust]: https://www.rust-lang.org/
[cargo]: https://doc.rust-lang.org/cargo/
[proptest]: https://github.com/altsysrq/proptest/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[clippy]: https://github.com/rust-lang/rust-clippy
[rustfmt]: https://github.com/rust-lang/rustfmt
[pyflakes]: https://github.com/PyCQA/pyflakes
[black]: https://github.com/ambv/black
[travisci]: https://travis-ci.com/
[gitlab]: https://gitlab.com/
[circleci]: https://circleci.com/
[appveyor]: https://www.appveyor.com/
[npm]: https://npmjs.com/
[yarn]: https://yarnpkg.com/
[hex]: https://hex.pm/
[bundler]: https://bundler.io/
[greenkeeper]: https://greenkeeper.io/
[dependabot]: https://dependabot.com/
[lerna-changelog]: https://github.com/lerna/lerna-changelog/
[github-label-sync]: https://github.com/Financial-Times/github-label-sync/

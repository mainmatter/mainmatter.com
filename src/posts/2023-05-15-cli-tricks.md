---
title: "CLI Tricks for Git with FZF"
authorHandle: BobrImperator
tags: [misc]
bio: "Bartłomiej Dudzik"
description:
  "Bartłomiej Dudzik shows a trick to checkout a Git branch faster in the
  CLI."
og:
  image:
tagline: |
  <p>Are you looking to be more efficient with Git while working with the CLI? There is an easy way to make checking out branches a one-step process.</p>

image: ""
imageAlt: ""
---

Does your current process to checkout a GitHub branch look something like this?

- `git branch` or `git branch --list`
- outputs a non-interactive list of branches
- Double-click an entry
- do `CTRL-C` or right click and copy
- close the list
- paste the entry to the terminal
- prepend entry with `git checkout`

Going through these many steps decreases productivity and makes working with
GitHub a real struggle. The good news is, there is a way to work around this and
make the whole process much leaner!

Using FZF, the seven steps listed above become a one-liner:
`git branch | fzf | xargs git checkout` . This opens up an interactive dropdown
that you can now easily navigate with arrows and the search input.

The last step to make this even easier to use would be to create an alias for
the command, as follows:

`~/.bashrc`

`alias gb="git branch | fzf | xargs git checkout"`

You should now be able to use this with a `gb` shorthand, making your experience
smoother. Happy coding!

If you are looking for a guide on using Fork to manage your Git actions, check
out this blog post by Chris Manson:
https://mainmatter.com/blog/2021/05/26/keeping-a-clean-git-history/

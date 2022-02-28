---
title: 'Better code with lint-to-the-future'
author: 'Chris Manson'
github: mansona
twitter: real_ate
topic: misc
bio: 'Senior Software Engineer, Ember Learning Core Team member'
description:
  'Chris Manson walks you through his new project "lint-to-the-future",
  demonstrating how to easily add and update lint rules with the help of the
  tool.'
og:
  image: /assets/images/posts/2022-03-03-better-code-with-lint-to-the-future/og-image.png
---

Have you ever wanted to add a new lint rule to your project but didn’t have time
to fix a thousand files at once just to get your ci passing again? In this blog
post, I’m going to show you a nifty new project called lint-to-the-future, that
is going to make that process a breeze.

<!--break-->

Having lint rules implemented from the beginning of your project is a great way
to make sure that your codebase stays neat. However, adding a new lint rule or
even updating your framework-specific lint rules can be quite challenging: this
is exactly what lint-to-the-future is designed to help you with. It is not a
tool to replace eslint or any of your linting tools, but rather a handy helper
that integrates with your existing workflow to help you progressively update
large codebases.

In the following video, I'll demonstrate how to make use of lint-to-the-future’s
command-line tool to help you enable a new lint rule while overcoming the
problem of "lint rule explosion".

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/watch?v=bsDFXjDKjPc" title="Embedded video of the introduction to lint-to-the-future" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

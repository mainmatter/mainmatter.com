---
title: 'This week in Open Source at simplabs #1'
author: "Emma Dell'Acqua"
github: emma_dellacqua
twitter: emma_dellacqua
topic: insidesimplabs
bio: 'Marketing Assistant'
description:
  'A collection of work that our engineers have been carrying out in open-source
  in the past few weeks.'
og:
  image: /assets/images/posts/2021-11-26-publish-on-npm/og-image.png
---

Our software engineers are all active members of the open-source community and
enjoy collaborating on various projects. In this blog post, we have collected
some of the work they have done these past weeks!

<!--break-->

## Highlight

This week our senior software engineer [Tobias Bieniek] did a little bit of
design work on [crates.io], the [Rust] package registry. The website now has a
[new page footer](https://github.com/rust-lang/crates.io/pull/4158) and a
[cute little 404 page](https://github.com/rust-lang/crates.io/pull/4154):

![](https://user-images.githubusercontent.com/141300/141307167-e3fd2914-064f-4076-b415-fc12a8f8bcbe.png)

![](https://user-images.githubusercontent.com/141300/141186277-0706150c-86ca-4fa1-8114-03f9bd900df7.png)

## Rust

### [hyperium/http](https://github.com/hyperium/http)

- Cargo: Add `rust-version` field
  [#513](https://github.com/hyperium/http/pull/513) ([@Turbo87])
- README: Remove obsolete extern crate http instructions
  [#512](https://github.com/hyperium/http/pull/512) ([@Turbo87])

## crates.io

### [rust-lang/crates.io](https://github.com/rust-lang/crates.io)

- worker::git: Read `yanked` status from database
  [#4175](https://github.com/rust-lang/crates.io/pull/4175) ([@Turbo87])
- TestApp: Simplify `crates_from_index_head()` method
  [#4173](https://github.com/rust-lang/crates.io/pull/4173) ([@Turbo87])
- Improve Avatar styling
  [#4171](https://github.com/rust-lang/crates.io/pull/4171) ([@Turbo87])
- Header: Add drop shadows to main elements
  [#4170](https://github.com/rust-lang/crates.io/pull/4170) ([@Turbo87])
- bin/server: Print HTTP server URL on startup
  [#4166](https://github.com/rust-lang/crates.io/pull/4166) ([@Turbo87])
- bin/server: Simplify assignments via `match`
  [#4165](https://github.com/rust-lang/crates.io/pull/4165) ([@Turbo87])
- OwnersList: Fall back to login if name is not filled
  [#4162](https://github.com/rust-lang/crates.io/pull/4162) ([@Turbo87])
- Redesign Footer component
  [#4158](https://github.com/rust-lang/crates.io/pull/4158) ([@Turbo87])
- Show 404 pages for unknown crates/versions
  [#4156](https://github.com/rust-lang/crates.io/pull/4156) ([@Turbo87])
- Redesign 404 page [#4154](https://github.com/rust-lang/crates.io/pull/4154)
  ([@Turbo87])
- CrateSidebar: Show detailed list for small number of owners
  [#4152](https://github.com/rust-lang/crates.io/pull/4152) ([@Turbo87])
- renovate: Adjust `node` package grouping
  [#4151](https://github.com/rust-lang/crates.io/pull/4151) ([@Turbo87])
- renovate: Convert to JSON5 file
  [#4150](https://github.com/rust-lang/crates.io/pull/4150) ([@Turbo87])
- Pin Node.js version [#4148](https://github.com/rust-lang/crates.io/pull/4148)
  ([@Turbo87])

### [conduit-rust/conduit-hyper](https://github.com/conduit-rust/conduit-hyper)

- ConduitRequest: Inline `parts()` method
  [#34](https://github.com/conduit-rust/conduit-hyper/pull/34) ([@Turbo87])
- RequestInfo: Replace custom struct with `Request<Bytes>`
  [#33](https://github.com/conduit-rust/conduit-hyper/pull/33) ([@Turbo87])

## Ember.js

### [emberjs/data](https://github.com/emberjs/data)

- reference: Fix broken `meta()` snippet
  [#7750](https://github.com/emberjs/data/pull/7750) ([@Turbo87])

### [ember-cli/ember-cli](https://github.com/ember-cli/ember-cli)

- commands/init: Fix `--yarn` usage
  [#9696](https://github.com/ember-cli/ember-cli/pull/9696) ([@Turbo87])

### [buschtoens/ember-link](https://github.com/buschtoens/ember-link)

- Adjust @glimmer/tracking dependency to use semver
  [#678](https://github.com/buschtoens/ember-link/pull/678) ([@Turbo87])
- Use pnpm package manager
  [#675](https://github.com/buschtoens/ember-link/pull/675) ([@Turbo87])
- Release via CI [#674](https://github.com/buschtoens/ember-link/pull/674)
  ([@Turbo87])
- chore(deps): update @types dependencies
  [#672](https://github.com/buschtoens/ember-link/pull/672) ([@Turbo87])

[hyperium/http]: https://github.com/hyperium/http/
[rust-lang/crates.io]: https://github.com/rust-lang/crates.io/
[conduit-rust/conduit-hyper]: https://github.com/conduit-rust/conduit-hyper/
[emberjs/data]: https://github.com/emberjs/data/
[ember-cli/ember-cli]: https://github.com/ember-cli/ember-cli/
[tobias bieniek]: https://github.com/Turbo87/
[crates.io]: https://crates.io/
[rust]: https://rust-lang.org/
[@turbo87]: https://github.com/Turbo87/
[contact]: https://simplabs.com/contact/

## ember-simple-auth

### [simplabs/ember-simple-auth](https://github.com/simplabs/ember-simple-auth)

ESA 4.0: Refactored internals of the addon to use Ember’s dependency injection,
making things simpler and easier to test. Successfully removed a lot of code,
and simplified tests setup.

- [2302] put internal-session into DI system
  [#2315](https://github.com/simplabs/ember-simple-auth/pull/2315)
  ([@BobrImperator])
- [2308] Refactor Adaptive store to use DI
  [#2312](https://github.com/simplabs/ember-simple-auth/pull/2312)
  ([@BobrImperator])

ESA 4.1: implemented a session #setup method. The methos represents a first step
to migrating from custom initializers, it excludes the application route that
ESA adds automatically and that is causing build issues for embroider and
typescript users.

- Add #setup method to session service
  [#2314](https://github.com/simplabs/ember-simple-auth/issues/2314)
  ([@BobrImperator])

## JavaScript

### [remy/nodemon](https://github.com/remy/nodemon)

Added a setup node and merged cache:

- ci(node.js): workflow uses 'npm' cache
  [#1934](https://github.com/remy/nodemon/pull/1934) ([@oscard0m])
- ci(release): workflow uses 'npm' cache
  [#1933](https://github.com/remy/nodemon/pull/1933) ([@oscard0m])

### [strapi/strapi](https://github.com/strapi/strapi)

Merged PR:

- Add cache to node workflows
  [#11531](https://github.com/strapi/strapi/pull/11531) ([@oscard0m])

## storybookjs

### [storybookjs/storybook] (https://github.com/storybookjs/storybook)

- Core: Add 'staticDirs' config option
  [#15969](https://github.com/storybookjs/storybook/pull/15969) ([@oscard0m])

### [storybookjs/eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)

- ESLint error: TypeError: Cannot read property 'properties' of undefined
  [issue:](https://github.com/storybookjs/eslint-plugin-storybook/issues/5)
  ([@oscard0m])
- ESLint error: TypeError: Cannot read property 'name' of undefined
  [issue:](https://github.com/storybookjs/eslint-plugin-storybook/issues/7)
  ([@oscard0m])

## simplabs's playbook

### [simplabs/playbook](https://github.com/simplabs/playbook)

Added more detailed information regarding issue preparation.

- Add more information about issue preparation
  [171](https://github.com/simplabs/playbook/pull/171) ([@marcoow])

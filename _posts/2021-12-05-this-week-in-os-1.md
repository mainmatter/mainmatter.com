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

- [hyperium/http] [#513] Cargo: Add `rust-version` field
  (https://github.com/hyperium/http/pull/513) ([@Turbo87])
- [hyperium/http] [#512] README: Remove obsolete extern crate http instructions
  (https://github.com/hyperium/http/pull/512) ([@Turbo87])

## crates.io

- [rust-lang/crates.io] [#4175] worker::git: Read `yanked` status from database
  (https://github.com/rust-lang/crates.io/pull/4175) ([@Turbo87])
- [rust-lang/crates.io] [#4173] TestApp: Simplify `crates_from_index_head()`
  method (https://github.com/rust-lang/crates.io/pull/4173) ([@Turbo87])
- [rust-lang/crates.io] [#4171] Improve Avatar styling
  (https://github.com/rust-lang/crates.io/pull/4171) ([@Turbo87])
- [rust-lang/crates.io] [#4170] Header: Add drop shadows to main elements
  (https://github.com/rust-lang/crates.io/pull/4170) ([@Turbo87])
- [rust-lang/crates.io] [#4166] bin/server: Print HTTP server URL on startup
  (https://github.com/rust-lang/crates.io/pull/4166) ([@Turbo87])
- [rust-lang/crates.io] [#4165] bin/server: Simplify assignments via `match`
  (https://github.com/rust-lang/crates.io/pull/4165) ([@Turbo87])
- [rust-lang/crates.io] [#4162] OwnersList: Fall back to login if name is not
  filled (https://github.com/rust-lang/crates.io/pull/4162) ([@Turbo87])
- [rust-lang/crates.io] [#4158] Redesign Footer component
  (https://github.com/rust-lang/crates.io/pull/4158) ([@Turbo87])
- [rust-lang/crates.io] [#4156] Show 404 pages for unknown crates/versions
  (https://github.com/rust-lang/crates.io/pull/4156) ([@Turbo87])
- [rust-lang/crates.io] [#4154] Redesign 404 page
  (https://github.com/rust-lang/crates.io/pull/4154) ([@Turbo87])
- [rust-lang/crates.io] [#4152] CrateSidebar: Show detailed list for small
  number of owners (https://github.com/rust-lang/crates.io/pull/4152)
  ([@Turbo87])
- [rust-lang/crates.io] [#4151] renovate: Adjust `node` package grouping
  (https://github.com/rust-lang/crates.io/pull/4151) ([@Turbo87])
- [rust-lang/crates.io] [#4150] renovate: Convert to JSON5 file
  (https://github.com/rust-lang/crates.io/pull/4150) ([@Turbo87])
- [rust-lang/crates.io] [#4148] Pin Node.js version
  (https://github.com/rust-lang/crates.io/pull/4148) ([@Turbo87])

- [conduit-rust/conduit-hyper] [#34] ConduitRequest: Inline `parts()` method
  (https://github.com/conduit-rust/conduit-hyper/pull/34) ([@Turbo87])
- [conduit-rust/conduit-hyper] [#33] RequestInfo: Replace custom struct with
  `Request<Bytes>` (https://github.com/conduit-rust/conduit-hyper/pull/33)
  ([@Turbo87])

## Ember.js

- [emberjs/data] [#7750] reference: Fix broken `meta()` snippet
  (https://github.com/emberjs/data/pull/7750) ([@Turbo87])

- [ember-cli/ember-cli] [#9696] commands/init: Fix `--yarn` usage
  (https://github.com/ember-cli/ember-cli/pull/9696) ([@Turbo87])

- [buschtoens/ember-link] [#678] Adjust @glimmer/tracking dependency to use
  semver (https://github.com/buschtoens/ember-link/pull/678) ([@Turbo87])
- [buschtoens/ember-link] [#675] Use pnpm package manager
  (https://github.com/buschtoens/ember-link/pull/675) ([@Turbo87])
- [buschtoens/ember-link] [#674] Release via CI
  (https://github.com/buschtoens/ember-link/pull/674) ([@Turbo87])
- [buschtoens/ember-link] [#672] chore(deps): update @types dependencies
  (https://github.com/buschtoens/ember-link/pull/672) ([@Turbo87])

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

ESA 4.0: Refactored internals of the addon to use Ember’s dependency injection,
making things simpler and easier to test. Successfully removed a lot of code,
and simplified tests setup.

- [simplabs/ember-simple-auth] [#2315] [2302] put internal-session into DI
  system (https://github.com/simplabs/ember-simple-auth/pull/2315)
  ([@BobrImperator])
- [simplabs/ember-simple-auth] [#2312] [2308] Refactor Adaptive store to use DI
  (https://github.com/simplabs/ember-simple-auth/pull/2312) ([@BobrImperator])

ESA 4.1: implemented a session #setup method. The methos represents a first step
to migrating from custom initializers, it excludes the application route that
ESA adds automatically and that is causing build issues for embroider and
typescript users.

- [simplabs/ember-simple-auth] [#2314] Add #setup method to session service
  (https://github.com/simplabs/ember-simple-auth/issues/2314) ([@BobrImperator])

## JavaScript

Added a setup node and merged cache:

- [remy/nodemon] [#1934] ci(node.js): workflow uses 'npm' cache
  (https://github.com/remy/nodemon/pull/1934) ([@oscard0m])
- [remy/nodemon] [#1933] ci(release): workflow uses 'npm' cache
  (https://github.com/remy/nodemon/pull/1933) ([@oscard0m])

Merged PR:

- [strapi/strapi] [#11531] Add cache to node workflows
  (https://github.com/strapi/strapi/pull/11531) ([@oscard0m])

- [storybookjs/storybook] [#15969] Core: Add 'staticDirs' config option
  (https://github.com/storybookjs/storybook/pull/15969) ([@oscard0m])

- [storybookjs/eslint-plugin-storybook] [issue:] ESLint error: TypeError: Cannot
  read property 'properties' of undefined
  (https://github.com/storybookjs/eslint-plugin-storybook/issues/5)
  ([@oscard0m])
- [storybookjs/eslint-plugin-storybook] [issue:] ESLint error: TypeError: Cannot
  read property 'name' of undefined
  (https://github.com/storybookjs/eslint-plugin-storybook/issues/7)
  ([@oscard0m])

## simplabs's playbook

Added more detailed information regarding issue preparation.

- [simplabs/playbook] [171] Add more information about issue preparation
  (https://github.com/simplabs/playbook/pull/171) ([@marcoow])

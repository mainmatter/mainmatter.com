---
title: "This week in Open Source at simplabs #1"
authorHandle: simplabs
tags: open-source
bio: "The simplabs team"
description:
  "A collection of work that our engineers have been carrying out in open-source
  in the past few weeks."
og:
  image: /assets/images/posts/2021-12-10-this-week-in-os-1/og-image.png
tagline: |
  <p>Our software engineers are all active members of the open-source community and enjoy collaborating on various projects. In this blog post, we have collected some of the work they have done these past weeks!</p>
image: "/assets/images/photos/ember-simple-auth.jpg"
imageAlt: "Screenshot of Ember simple auth"
---

## Highlight

This week our senior software engineer [Tobias Bieniek] did a little bit of
design work on [crates.io], the [Rust] package registry. The website now has a
[new page footer](https://github.com/rust-lang/crates.io/pull/4158) and a
[cute little 404 page](https://github.com/rust-lang/crates.io/pull/4154):

![](https://user-images.githubusercontent.com/141300/141307167-e3fd2914-064f-4076-b415-fc12a8f8bcbe.png)

![](https://user-images.githubusercontent.com/141300/141186277-0706150c-86ca-4fa1-8114-03f9bd900df7.png)

## Rust

- [hyperium/http] [#513](https://github.com/hyperium/http/pull/513) Cargo: Add
  `rust-version` field ([@Turbo87])
- [hyperium/http] [#512](https://github.com/hyperium/http/pull/512) README:
  Remove obsolete extern crate http instructions ([@Turbo87])

## crates.io

- [rust-lang/crates.io]
  [#4175](https://github.com/rust-lang/crates.io/pull/4175) worker::git: Read
  `yanked` status from database ([@Turbo87])
- [rust-lang/crates.io]
  [#4173](https://github.com/rust-lang/crates.io/pull/4173) TestApp: Simplify
  `crates_from_index_head()` method ([@Turbo87])
- [rust-lang/crates.io]
  [#4171](https://github.com/rust-lang/crates.io/pull/4171) Improve Avatar
  styling ([@Turbo87])
- [rust-lang/crates.io]
  [#4170](https://github.com/rust-lang/crates.io/pull/4170) Header: Add drop
  shadows to main elements ([@Turbo87])
- [rust-lang/crates.io]
  [#4166](https://github.com/rust-lang/crates.io/pull/4166) bin/server: Print
  HTTP server URL on startup ([@Turbo87])
- [rust-lang/crates.io]
  [#4165](https://github.com/rust-lang/crates.io/pull/4165) bin/server: Simplify
  assignments via `match` ([@Turbo87])
- [rust-lang/crates.io]
  [#4162](https://github.com/rust-lang/crates.io/pull/4162) OwnersList: Fall
  back to login if name is not filled ([@Turbo87])
- [rust-lang/crates.io]
  [#4158](https://github.com/rust-lang/crates.io/pull/4158) Redesign Footer
  component ([@Turbo87])
- [rust-lang/crates.io]
  [#4156](https://github.com/rust-lang/crates.io/pull/4156) Show 404 pages for
  unknown crates/versions ([@Turbo87])
- [rust-lang/crates.io]
  [#4154](https://github.com/rust-lang/crates.io/pull/4154) Redesign 404 page
  ([@Turbo87])
- [rust-lang/crates.io]
  [#4152](https://github.com/rust-lang/crates.io/pull/4152) CrateSidebar: Show
  detailed list for small number of owners ([@Turbo87])
- [rust-lang/crates.io]
  [#4151](https://github.com/rust-lang/crates.io/pull/4151) renovate: Adjust
  `node` package grouping ([@Turbo87])
- [rust-lang/crates.io]
  [#4150](https://github.com/rust-lang/crates.io/pull/4150) renovate: Convert to
  JSON5 file ([@Turbo87])
- [rust-lang/crates.io]
  [#4148](https://github.com/rust-lang/crates.io/pull/4148) Pin Node.js version
  ([@Turbo87])

- [conduit-rust/conduit-hyper]
  [#34](https://github.com/conduit-rust/conduit-hyper/pull/34) ConduitRequest:
  Inline `parts()` method ([@Turbo87])
- [conduit-rust/conduit-hyper]
  [#33](https://github.com/conduit-rust/conduit-hyper/pull/33) RequestInfo:
  Replace custom struct with `Request<Bytes>` ([@Turbo87])

## Ember.js

- [emberjs/data] [#7750](https://github.com/emberjs/data/pull/7750) reference:
  Fix broken `meta()` snippet ([@Turbo87])

- [ember-cli/ember-cli]
  [#9696](https://github.com/ember-cli/ember-cli/pull/9696) commands/init: Fix
  `--yarn` usage ([@Turbo87])

- [buschtoens/ember-link]
  [#678](https://github.com/buschtoens/ember-link/pull/678) Adjust
  @glimmer/tracking dependency to use semver ([@Turbo87])
- [buschtoens/ember-link]
  [#675](https://github.com/buschtoens/ember-link/pull/675) Use pnpm package
  manager ([@Turbo87])
- [buschtoens/ember-link]
  [#674](https://github.com/buschtoens/ember-link/pull/674) Release via CI
  ([@Turbo87])
- [buschtoens/ember-link]
  [#672](https://github.com/buschtoens/ember-link/pull/672) chore(deps): update
  @types dependencies ([@Turbo87])

ESA 4.0: Refactored internals of the addon to use Ember’s dependency injection,
making things simpler and easier to test. Successfully removed a lot of code,
and simplified tests setup.

- [simplabs/ember-simple-auth]
  [#2315](https://github.com/simplabs/ember-simple-auth/pull/2315) put
  internal-session into DI system ([@BobrImperator])
- [simplabs/ember-simple-auth]
  [#2312](https://github.com/simplabs/ember-simple-auth/pull/2312) Refactor
  Adaptive store to use DI ([@BobrImperator])

ESA 4.1: implemented a session #setup method. The methos represents a first step
to migrating from custom initializers, it excludes the application route that
ESA adds automatically and that is causing build issues for embroider and
typescript users.

- [simplabs/ember-simple-auth]
  [#2314](https://github.com/simplabs/ember-simple-auth/issues/2314) Add #setup
  method to session service ([@BobrImperator])

## JavaScript

- [remy/nodemon] [#1934](https://github.com/remy/nodemon/pull/1934) ci(node.js):
  workflow uses 'npm' cache ([@oscard0m])
- [remy/nodemon] [#1933](https://github.com/remy/nodemon/pull/1933) ci(release):
  workflow uses 'npm' cache ([@oscard0m])

- [strapi/strapi] [#11531](https://github.com/strapi/strapi/pull/11531) Add
  cache to node workflows ([@oscard0m])

- [storybookjs/storybook]
  [#15969](https://github.com/storybookjs/storybook/pull/15969) Core: Add
  'staticDirs' config option ([@oscard0m])
- [storybookjs/eslint-plugin-storybook]
  [#5](https://github.com/storybookjs/eslint-plugin-storybook/issues/5) ESLint
  error: TypeError: Cannot read property 'properties' of undefined ([@oscard0m])
- [storybookjs/eslint-plugin-storybook]
  [#7](https://github.com/storybookjs/eslint-plugin-storybook/issues/7) ESLint
  error: TypeError: Cannot read property 'name' of undefined ([@oscard0m])

## simplabs's playbook

Added more detailed information regarding issue preparation.

- [simplabs/playbook] [#171](https://github.com/simplabs/playbook/pull/171) Add
  more information about issue preparation ([@marcoow])

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
[simplabs/ember-simple-auth]: https://github.com/simplabs/ember-simple-auth/
[buschtoens/ember-link]: https://github.com/buschtoens/ember-link/
[remy/nodemon]: https://github.com/remy/nodemon/
[strapi/strapi]: https://github.com/strapi/strapi/
[storybookjs/storybook]: https://github.com/storybookjs/storybook/
[storybookjs/eslint-plugin-storybook]: https://github.com/storybookjs/eslint-plugin-storybook/
[@marcoow]: https://github.com/marcoow/
[@bobrimperator]: https://github.com/BobrImperator/
[@oscard0m]: https://github.com/oscard0m/
[simplabs/playbook]: https://github.com/simplabs/playbook/

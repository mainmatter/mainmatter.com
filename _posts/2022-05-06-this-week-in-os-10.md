---
title: 'This week in Open Source at simplabs #10'
author: 'simplabs'
github: simplabs
twitter: simplabs
topic: open-source
bio: 'The simplabs team'
description:
  'A collection of work that our engineers have been carrying out in open-source
  in the past few weeks.'
og:
  image: /assets/images/posts/2022-05-06-this-week-in-os-10/og-image.png
---

Our software engineers are all active members of the open-source community and
enjoy collaborating on various projects. In this blog post, we have collected
some of the work they have done the past weeks!

<!--break-->

## Highlight

Tobias Bieniek has been contributing to
[RenovateBot](https://github.com/renovatebot/renovate), a bot for automated
dependency updates.

His PR [15214](https://github.com/renovatebot/renovate/pull/15214) added
changelogs to Rust crate update PRs by downloading #crate metadata
from [crates.io](http://crates.io/). It also uses a fast path on
the [crates.io](http://crates.io/) server to avoid unnecessary database requests.

## Ember.js

- [Turbo87/intellij-emberjs]
  [#440](https://github.com/Turbo87/intellij-emberjs/pull/440) Fix
  `LineMarkerInfo` deprecation error ([@Turbo87])
- [ember-learn/ember-styleguide]
  [#418](https://github.com/ember-learn/ember-styleguide/pull/418) update
  lint-to-the-future dashboard workflow ([@mansona])
- [ember-learn/guides-source]
  [#1814](https://github.com/ember-learn/guides-source/pull/1814) Fix typo in
  linking-between-routes.md ([@locks])
- [empress/ember-showdown-prism]
  [#25](https://github.com/empress/ember-showdown-prism/pull/25) add typescript
  and diff components ([@mansona])
- [empress/empress-blog]
  [#159](https://github.com/empress/empress-blog/pull/159) update lttf dashboard
  workflow ([@mansona])
- [empress/rfc-process] [#10](https://github.com/empress/rfc-process/pull/10)
  Update to 3.28 with ember-cli-update ([@mansona])
- [empress/rfc-process] [#9](https://github.com/empress/rfc-process/pull/9) fix
  prember urls ([@mansona])
- [empress/rfc-process] [#8](https://github.com/empress/rfc-process/pull/8) Add
  stages and teams models and data processing ([@mansona])
- [empress/rfc-process-mdbook-template]
  [#7](https://github.com/empress/rfc-process-mdbook-template/pull/7) Add
  frontmatter implementation ([@mansona])
- [mansona/ember-get-config]
  [#41](https://github.com/mansona/ember-get-config/pull/41) breaking: re-export
  configModule to reduce duplication and fix dynamic config ([@mansona])
- [offirgolan/ember-cp-validations]
  [#705](https://github.com/offirgolan/ember-cp-validations/pull/705) Add
  missing changelog entries ([@zeppelin])
- [qonto/ember-cp-validations]
  [#18](https://github.com/qonto/ember-cp-validations/pull/18) Remove volatile
  support & enable Ember 4 tests ([@zeppelin])
- [qonto/ember-cp-validations]
  [#17](https://github.com/qonto/ember-cp-validations/pull/17) Remove support
  for Ember < 3.28 ([@zeppelin])
- [qonto/ember-cp-validations]
  [#16](https://github.com/qonto/ember-cp-validations/pull/16) Add missing
  changelog entries ([@zeppelin])
- [simplabs/ember-cookies]
  [#742](https://github.com/simplabs/ember-cookies/pull/742) ci(renovate): use
  renovate's json5 preset ([@oscard0m])
- [simplabs/ember-cookies]
  [#739](https://github.com/simplabs/ember-cookies/pull/739) ci(renovate): add
  renovate config ([@oscard0m])
- [simplabs/ember-hotspots]
  [#27](https://github.com/simplabs/ember-hotspots/pull/27) Bring back
  `ember-get-config` ([@pichfl])
- [simplabs/ember-hotspots]
  [#26](https://github.com/simplabs/ember-hotspots/pull/26) Remove
  ember-get-config ([@pichfl])
- [simplabs/ember-hotspots]
  [#24](https://github.com/simplabs/ember-hotspots/pull/24) Ensure hostspots are
  loaded from the right URL ([@pichfl])
- [simplabs/ember-hotspots]
  [#23](https://github.com/simplabs/ember-hotspots/pull/23) Remove duplicated
  `ember-fetch` dependency ([@pichfl])
- [simplabs/ember-hotspots]
  [#17](https://github.com/simplabs/ember-hotspots/pull/17) Update addon
  blueprint and dependencies ([@pichfl])
- [simplabs/ember-hotspots]
  [#11](https://github.com/simplabs/ember-hotspots/pull/11) Setup Renovatebot
  ([@pichfl])
- [simplabs/ember-hotspots]
  [#10](https://github.com/simplabs/ember-hotspots/pull/10) Replace Yarn with
  pnpm ([@pichfl])
- [simplabs/ember-simple-auth]
  [#2379](https://github.com/simplabs/ember-simple-auth/pull/2379) disable
  dependabot ([@marcoow])
- [simplabs/ember-simple-auth]
  [#2369](https://github.com/simplabs/ember-simple-auth/pull/2369) Add cache to
  node workflows ([@marcoow])
- [simplabs/ember-simple-auth]
  [#2368](https://github.com/simplabs/ember-simple-auth/pull/2368) Upgrade
  ESLint configuration ([@pichfl])
- [simplabs/ember-simple-auth]
  [#2409](https://github.com/simplabs/ember-simple-auth/pull/2409) ci(renovate):
  use renovate's json5 preset ([@oscard0m])
- [simplabs/ember-simple-auth]
  [#2370](https://github.com/simplabs/ember-simple-auth/pull/2370) ci(renovate):
  add renovate configuration ([@oscard0m])

## Internal

- [simplabs/renovate-config]
  [#8](https://github.com/simplabs/renovate-config/pull/8) chore(default.json):
  remove default.json ([@oscard0m])
- [simplabs/renovate-config]
  [#4](https://github.com/simplabs/renovate-config/pull/4) refactor(renovate):
  restore .json5 configuration ([@oscard0m])
- [simplabs/renovate-config]
  [#3](https://github.com/simplabs/renovate-config/pull/3) feat(renovate): add
  ':preserveSemverRanges' ([@oscard0m])
- [simplabs/renovate-config]
  [#2](https://github.com/simplabs/renovate-config/pull/2) refactor(renovate):
  use .json instead of .json5 format for config ([@oscard0m])

## JavaScript

- [showdownjs/showdown] [#918](https://github.com/showdownjs/showdown/pull/918)
  Add updated CommonMark Tests ([@mansona])

## Rust

- [Turbo87/united-flarmnet]
  [#78](https://github.com/Turbo87/united-flarmnet/pull/78) Inline unnecessary
  functions ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#76](https://github.com/Turbo87/united-flarmnet/pull/76) Extract `merge()`
  function ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#75](https://github.com/Turbo87/united-flarmnet/pull/75) Run HTTP requests in
  parallel ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#74](https://github.com/Turbo87/united-flarmnet/pull/74) Use `reqwest_retry`
  to retry failed requests ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#73](https://github.com/Turbo87/united-flarmnet/pull/73) Replace custom cache
  with `http_cache_reqwest` middleware ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#72](https://github.com/Turbo87/united-flarmnet/pull/72) Use
  `reqwest-tracing` for additional debug output ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#71](https://github.com/Turbo87/united-flarmnet/pull/71) Use async/await for
  HTTP reqwests ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#70](https://github.com/Turbo87/united-flarmnet/pull/70) Migrate from `ureq`
  to `reqwest` ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#69](https://github.com/Turbo87/united-flarmnet/pull/69) Use WeGlide devices
  API ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#68](https://github.com/Turbo87/united-flarmnet/pull/68) Deploy built binary
  to GitHub Pages ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#67](https://github.com/Turbo87/united-flarmnet/pull/67) Simplify unnecessary
  closure functions ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#66](https://github.com/Turbo87/united-flarmnet/pull/66) clippy: Adjust
  deprecated rule name ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#65](https://github.com/Turbo87/united-flarmnet/pull/65) sanitize: Use `char`
  instead of `&str` for single character search strings ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#62](https://github.com/Turbo87/united-flarmnet/pull/62) Add
  `rust-toolchain.toml` file ([@Turbo87])
- [ferrous-systems/teaching-material]
  [#106](https://github.com/ferrous-systems/teaching-material/pull/106)
  installation: Adjust `IntelliJ` link ([@Turbo87])
- [ferrous-systems/teaching-material]
  [#103](https://github.com/ferrous-systems/teaching-material/pull/103)
  Partially revert "remove `extern crate`" ([@Turbo87])
- [ferrous-systems/teaching-material]
  [#102](https://github.com/ferrous-systems/teaching-material/pull/102)
  presentations/imports-modules-and-visibility: Add missing `struct` keyword
  ([@Turbo87])
- [ferrous-systems/teaching-material]
  [#101](https://github.com/ferrous-systems/teaching-material/pull/101)
  presentations/cargo: Fix dependency category name ([@Turbo87])

## TypeScript

- [renovatebot/renovate]
  [#15214](https://github.com/renovatebot/renovate/pull/15214)
  feat(datasource/crate): fetch crate metadata from crates.io ([@Turbo87])
- [renovatebot/renovate]
  [#15377](https://github.com/renovatebot/renovate/pull/15377) feat(presets):
  add support to presets ending with `.json5` or `.json` ([@oscard0m])

## crates.io

- [rust-lang/crates.io]
  [#4788](https://github.com/rust-lang/crates.io/pull/4788) Sentry: Set
  transaction name instead of custom `routeName` tag ([@Turbo87])
- [rust-lang/crates.io]
  [#4781](https://github.com/rust-lang/crates.io/pull/4781) Disable in-browser
  translation ([@Turbo87])

## Unknown

- [percy/percy-storybook]
  [#558](https://github.com/percy/percy-storybook/pull/558) docs(README):
  improve documentation for Puppeteer options ([@oscard0m])

[@turbo87]: https://github.com/Turbo87
[@locks]: https://github.com/locks
[@mansona]: https://github.com/mansona
[@marcoow]: https://github.com/marcoow
[@oscard0m]: https://github.com/oscard0m
[@pichfl]: https://github.com/pichfl
[@zeppelin]: https://github.com/zeppelin
[turbo87/intellij-emberjs]: https://github.com/Turbo87/intellij-emberjs
[turbo87/united-flarmnet]: https://github.com/Turbo87/united-flarmnet
[ember-learn/ember-styleguide]: https://github.com/ember-learn/ember-styleguide
[ember-learn/guides-source]: https://github.com/ember-learn/guides-source
[empress/ember-showdown-prism]: https://github.com/empress/ember-showdown-prism
[empress/empress-blog]: https://github.com/empress/empress-blog
[empress/rfc-process-mdbook-template]:
  https://github.com/empress/rfc-process-mdbook-template
[empress/rfc-process]: https://github.com/empress/rfc-process
[ferrous-systems/teaching-material]:
  https://github.com/ferrous-systems/teaching-material
[mansona/ember-get-config]: https://github.com/mansona/ember-get-config
[offirgolan/ember-cp-validations]:
  https://github.com/offirgolan/ember-cp-validations
[percy/percy-storybook]: https://github.com/percy/percy-storybook
[qonto/ember-cp-validations]: https://github.com/qonto/ember-cp-validations
[renovatebot/renovate]: https://github.com/renovatebot/renovate
[rust-lang/crates.io]: https://github.com/rust-lang/crates.io
[showdownjs/showdown]: https://github.com/showdownjs/showdown
[simplabs/ember-cookies]: https://github.com/simplabs/ember-cookies
[simplabs/ember-hotspots]: https://github.com/simplabs/ember-hotspots
[simplabs/ember-simple-auth]: https://github.com/simplabs/ember-simple-auth
[simplabs/renovate-config]: https://github.com/simplabs/renovate-config

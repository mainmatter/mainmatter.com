---
title: "This week in Open Source at simplabs #3"
authorHandle: simplabs
tags: open-source
bio: "The simplabs team"
description:
  "A collection of work that our engineers have been carrying out in open-source
  in the past few weeks."
og:
  image: /assets/images/posts/2022-01-24-this-week-in-os-3/og-image.png
tagline: |
  <p>Our software engineers are all active members of the open-source community and enjoy collaborating on various projects. In this blog post, we have collected some of the work they have done the past week!</p>
image: "/assets/images/photos/ember-simple-auth.jpg"
imageAlt: "Screenshot of Ember simple auth"
---

## Rust

- [aprs-parser-rs] [#21](https://github.com/Turbo87/aprs-parser-rs/pull/21) CI:
  Enable colored cargo output ([@turbo87])
- [aprs-parser-rs] [#20](https://github.com/Turbo87/aprs-parser-rs/pull/20)
  lonlat: Extract Latitude and Longitude structs ([@turbo87])
- [aprs-parser-rs] [#15](https://github.com/Turbo87/aprs-parser-rs/pull/15) Add
  Cargo.lock file ([@turbo87])
- [aprs-parser-rs] [#14](https://github.com/Turbo87/aprs-parser-rs/pull/14)
  Decrease MSRV to v1.38.0 ([@turbo87])
- [aprs-parser-rs] [#13](https://github.com/Turbo87/aprs-parser-rs/pull/13)
  Replace failure with thiserror ([@turbo87])
- [aprs-parser-rs] [#12](https://github.com/Turbo87/aprs-parser-rs/pull/12)
  cargo clippy ([@turbo87])
- [aprs-parser-rs] [#11](https://github.com/Turbo87/aprs-parser-rs/pull/11)
  cargo fmt ([@turbo87])
- [aprs-parser-rs] [#10](https://github.com/Turbo87/aprs-parser-rs/pull/10)
  Improve CI config ([@turbo87])
- [aprs-parser-rs] [#9](https://github.com/Turbo87/aprs-parser-rs/pull/9)
  Migrate from TravisCI to GitHub Actions ([@turbo87])

- [rust-lang/cargo] [#10239](https://github.com/rust-lang/cargo/pull/10239)
  timings: Fix tick mark alignment ([@turbo87])

## crates.io

- [rust-lang/crates.io]
  [#4465](https://github.com/rust-lang/crates.io/pull/4465) Use embroider build
  system by default ([@turbo87])
- [rust-lang/crates.io]
  [#4464](https://github.com/rust-lang/crates.io/pull/4464) embroider: Remove
  obsolete ember-get-config workaround ([@turbo87])
- [rust-lang/crates.io]
  [#4460](https://github.com/rust-lang/crates.io/pull/4460) Use Volta to pin
  Node.js and yarn versions ([@turbo87])
- [rust-lang/crates.io]
  [#4440](https://github.com/rust-lang/crates.io/pull/4440) Use format arguments
  capture feature ([@turbo87])
- [rust-lang/crates.io]
  [#4398](https://github.com/rust-lang/crates.io/pull/4398) Replace timekeeper
  with @sinonjs/fake-timers ([@turbo87])
- [rust-lang/crates.io]
  [#4397](https://github.com/rust-lang/crates.io/pull/4397) Remove obsolete
  /authorize/github route ([@turbo87])
- [rust-lang/crates.io]
  [#4396](https://github.com/rust-lang/crates.io/pull/4396) Extract
  cargo-registry-index package ([@turbo87])
- [rust-lang/crates.io]
  [#4384](https://github.com/rust-lang/crates.io/pull/4384) tests: Extract
  UpstreamIndex struct ([@turbo87])
- [rust-lang/crates.io]
  [#4382](https://github.com/rust-lang/crates.io/pull/4382) Add support for
  keyword:cli and category:no-std search filters ([@turbo87])
- [rust-lang/crates.io]
  [#4381](https://github.com/rust-lang/crates.io/pull/4381) tests/search: Add
  test case for query parameter forwarding ([@turbo87])
- [rust-lang/crates.io]
  [#4380](https://github.com/rust-lang/crates.io/pull/4380) mirage: Replace
  withMeta() utility function with object spread operator ([@turbo87])
- [rust-lang/crates.io]
  [#4379](https://github.com/rust-lang/crates.io/pull/4379) search: Show "Exact
  Match" as regular search result ([@turbo87])
- [rust-lang/crates.io]
  [#4377](https://github.com/rust-lang/crates.io/pull/4377) DownloadGraph: Fix
  extra property access ([@turbo87])
- [rust-lang/crates.io]
  [#4368](https://github.com/rust-lang/crates.io/pull/4368) Replace "Toggle
  Design" button with new /settings/appearance route ([@turbo87])
- [rust-lang/crates.io]
  [#4367](https://github.com/rust-lang/crates.io/pull/4367) Replace
  ember-set-body-class addon ([@turbo87])
- [rust-lang/crates.io]
  [#4366](https://github.com/rust-lang/crates.io/pull/4366) Repository: Use
  anyhow errors as return types ([@turbo87])
- [rust-lang/crates.io]
  [#4365](https://github.com/rust-lang/crates.io/pull/4365) Repository: Extract
  run_command() function ([@turbo87])
- [rust-lang/crates.io]
  [#4364](https://github.com/rust-lang/crates.io/pull/4364) Repository: Add doc
  comments ([@turbo87])
- [rust-lang/crates.io]
  [#4363](https://github.com/rust-lang/crates.io/pull/4363) Repository: Extract
  write_temporary_ssh_key() function ([@turbo87])
- [rust-lang/crates.io]
  [#4362](https://github.com/rust-lang/crates.io/pull/4362) Header: Remove
  obsolete "Docs" dropdown ([@turbo87])
- [rust-lang/crates.io]
  [#4361](https://github.com/rust-lang/crates.io/pull/4361) Use
  postcss-custom-media plugin for breakpoints ([@turbo87])
- [rust-lang/crates.io]
  [#4360](https://github.com/rust-lang/crates.io/pull/4360) Remove "Filter by
  letter" feature ([@turbo87])
- [rust-lang/crates.io]
  [#4359](https://github.com/rust-lang/crates.io/pull/4359) Improve search bar
  styling ([@turbo87])
- [rust-lang/crates.io]
  [#4357](https://github.com/rust-lang/crates.io/pull/4357) Improve "API Tokens"
  settings page ([@turbo87])
- [rust-lang/crates.io]
  [#4356](https://github.com/rust-lang/crates.io/pull/4356) Remove duplicate
  GitHub logo SVG ([@turbo87])
- [rust-lang/crates.io]
  [#4351](https://github.com/rust-lang/crates.io/pull/4351) renovate: Disable
  dependencyDashboardApproval option ([@turbo87])
- [rust-lang/crates.io]
  [#4316](https://github.com/rust-lang/crates.io/pull/4316) Improve database
  fallbacks ([@turbo87])
- [rust-lang/crates.io]
  [#4315](https://github.com/rust-lang/crates.io/pull/4315) Show "This page
  requires authentication" page for protected routes if unauthenticated
  ([@turbo87])
- [rust-lang/crates.io]
  [#4314](https://github.com/rust-lang/crates.io/pull/4314) catch-all: Fix
  broken "Go back" and "Reload" links ([@turbo87])
- [rust-lang/crates.io]
  [#4311](https://github.com/rust-lang/crates.io/pull/4311) Adjust /me
  redirection to /settings/tokens ([@turbo87])

## Ruby

- [rubyforgood/Flaredown]
  [#571](https://github.com/rubyforgood/Flaredown/pull/571) fix race condition
  on android with google recapcha ([@mansona])

## Ember.js

- [simplabs/ember-error-route]
  [#66](https://github.com/simplabs/ember-error-route/pull/66) Add GitHub
  project links ([@turbo87])
- [simplabs/ember-error-route]
  [#65](https://github.com/simplabs/ember-error-route/pull/65) README: Add basic
  documentation ([@turbo87])
- [simplabs/ember-error-route]
  [#64](https://github.com/simplabs/ember-error-route/pull/64) Improved styling
  ([@turbo87])
- [simplabs/ember-error-route]
  [#62](https://github.com/simplabs/ember-error-route/pull/62) Remove broken
  colors@1.4.2 subdependency ([@turbo87])

- [ember-learn/ember-website]
  [#887](https://github.com/ember-learn/ember-website/pull/887) Add Ember Europe
  Tomster ([@marcoow])
- [ember-learn/ember-website]
  [#886](https://github.com/ember-learn/ember-website/pull/886) v4.1.0 release
  ([@locks])

- [emberjs/core-notes] [#437](https://github.com/emberjs/core-notes/pull/437)
  [Learning] January 27th, 2022 ([@locks])
- [emberjs/core-notes] [#432](https://github.com/emberjs/core-notes/pull/432)
  [Learning] December 23 meeting ([@locks])

- [emberjs/ember-ordered-set]
  [#46](https://github.com/emberjs/ember-ordered-set/pull/46) Update license
  file with copyright holders ([@locks])

- [ember-learn/guides-source]
  [#1766](https://github.com/ember-learn/guides-source/pull/1766) Use service
  named import instead of inject ([@locks])
- [ember-learn/guides-source]
  [#1764](https://github.com/ember-learn/guides-source/pull/1764) v4.1.0
  ([@locks])

- [ember-learn/ember-blog]
  [#1084](https://github.com/ember-learn/ember-blog/pull/1084) Delete
  .node-version ([@mansona])
- [ember-learn/ember-blog]
  [#1082](https://github.com/ember-learn/ember-blog/pull/1082) Update
  empress-blog template to fix build ([@mansona])
- [ember-learn/ember-blog]
  [#1081](https://github.com/ember-learn/ember-blog/pull/1081) Update Github CI
  ([@mansona])

- [ember-learn/empress-blog-ember-template]
  [#118](https://github.com/ember-learn/empress-blog-ember-template/pull/118)
  simplify github ci ([@mansona])
- [ember-learn/empress-blog-ember-template]
  [#117](https://github.com/ember-learn/empress-blog-ember-template/pull/117)
  Breaking: Drop Node 10 and upgrade Ember ([@mansona])

- [ember-learn/ember-styleguide]
  [#412](https://github.com/ember-learn/ember-styleguide/pull/412) Breaking:
  drop support for Node 10, update ember to 3.28, and remove deprecations
  ([@mansona])

- [empress/field-guide] [#53](https://github.com/empress/field-guide/pull/53)
  Support Embroider ([@mansona])
- [empress/field-guide] [#52](https://github.com/empress/field-guide/pull/52)
  Support Ember 4 ([@mansona])
- [empress/field-guide] [#51](https://github.com/empress/field-guide/pull/51)
  bring github ci workflow in line with blueprint and update some dependencies
  ([@mansona])

- [empress/ember-showdown-prism]
  [#20](https://github.com/empress/ember-showdown-prism/pull/20) update with
  ember-cli-update to 3.28 ([@mansona])
- [empress/ember-showdown-prism]
  [#19](https://github.com/empress/ember-showdown-prism/pull/19) add a basic
  test ([@mansona])
- [empress/ember-showdown-prism]
  [#18](https://github.com/empress/ember-showdown-prism/pull/18) Breaking: drop
  Node 10 and unify github ci workflow with blueprint ([@mansona])

- [emberjs/ember.js] [#19883](https://github.com/emberjs/ember.js/pull/19883)
  [BUGFIX beta] Fix URL for deprecation deprecate-auto-location ([@locks])

- [Authmaker/authmaker-ember-simple-auth]
  [#33](https://github.com/Authmaker/authmaker-ember-simple-auth/pull/33) Update
  Ember to 3.20 ([@mansona])
- [Authmaker/authmaker-ember-simple-auth]
  [#32](https://github.com/Authmaker/authmaker-ember-simple-auth/pull/32)
  Breaking: drop support for Node < 12 and move from Travis to Github CI
  ([@mansona])
- [Authmaker/authmaker-ember-simple-auth]
  [#31](https://github.com/Authmaker/authmaker-ember-simple-auth/pull/31) Add
  tests ([@mansona])

- [ember-cli/ember-cli]
  [#9760](https://github.com/ember-cli/ember-cli/pull/9760) Add timeout-minutes
  to github CI jobs ([@mansona])

## JavaScript

- [mansona/lint-to-the-future-eslint]
  [#3](https://github.com/mansona/lint-to-the-future-eslint/pull/3) Fix issue
  with caret dependency of eslint and add a test to verify ignore works
  ([@mansona])
- [TelemetryDeck/JavaScriptSDK]
  [#2](https://github.com/TelemetryDeck/JavaScriptSDK/pull/2) Allow loading of
  script to be deferred ([@pichfl])
- [TelemetryDeck/JavaScriptSDK]
  [#1](https://github.com/TelemetryDeck/JavaScriptSDK/pull/1) Initial release
  ([@pichfl])

[rust-lang/crates.io]: https://github.com/rust-lang/crates.io/
[rust-lang/crates.io]: https://github.com/rust-lang/crates.io/
[rubyforgood/flaredown]: https://github.com/rubyforgood/Flaredown/
[mansona/lint-to-the-future-eslint]: https://github.com/mansona/lint-to-the-future-eslint/
[telemetrydeck/javascriptsdk]: https://github.com/TelemetryDeck/JavaScriptSDK/
[rust-lang/cargo]: https://github.com/rust-lang/cargo/
[ember-learn/ember-website]: https://github.com/ember-learn/ember-website/
[emberjs/core-notes]: https://github.com/emberjs/core-notes/
[emberjs/ember-ordered-set]: https://github.com/emberjs/ember-ordered-set/
[ember-learn/ember-blog]: https://github.com/ember-learn/ember-blog/
[ember-learn/empress-blog-ember-template]: https://github.com/ember-learn/empress-blog-ember-template/
[ember-learn/ember-styleguide]: https://github.com/ember-learn/ember-styleguide/
[empress/ember-showdown-prism]: https://github.com/empress/ember-showdown-prism/
[empress/field-guide]: https://github.com/empress/field-guide/
[emberjs/ember.js]: https://github.com/emberjs/ember.js/
[authmaker/authmaker-ember-simple-auth]: https://github.com/Authmaker/authmaker-ember-simple-auth/
[aprs-parser-rs]: https://github.com/aprs-parser-rs/
[simplabs/ember-simple-auth]: https://github.com/simplabs/ember-simple-auth/
[simplabs/playbook]: https://github.com/simplabs/playbook/
[ember-cli/ember-exam]: https://github.com/ember-cli/ember-exam/
[simplabs/ember-error-route]: https://github.com/simplabs/ember-error-route/
[emberjs/ember-string]: https://github.com/emberjs/ember-string/
[ember-learn/guides-source]: https://github.com/ember-learn/guides-source/
[mansona/ember-body-class]: https://github.com/mansona/ember-body-class/
[empress/broccoli-static-site-json]: https://github.com/empress/broccoli-static-site-json/
[empress/empress-blog]: https://github.com/empress/empress-blog/
[empress/empress-blog-casper-template]: https://github.com/empress/empress-blog-casper-template/
[empress/ember-cli-showdown]: https://github.com/empress/ember-cli-showdown
[mansona/ember-cli-notifications]: https://github.com/mansona/ember-cli-notifications
[simplabs/ember-intl-analyzer]: https://github.com/simplabs/ember-intl-analyzer
[nickschot/ember-mobile-menu]: https://github.com/nickschot/ember-mobile-menu
[simplabs/ember-promise-modals]: https://github.com/simplabs/ember-promise-modals
[oscard0m/npm-snapshot]: https://github.com/oscard0m/npm-snapshot
[commitizen/cz-conventional-changelog]: https://github.com/commitizen/cz-conventional-changelog
[mansona/chris.manson.ie]: https://github.com/mansona/chris.manson.ie
[@turbo87]: https://github.com/Turbo87/
[@pichfl]: https://github.com/pichfl/
[@mansona]: https://github.com/mansona/
[@mikek2252]: https://github.com/Mikek2252/
[@candunaj]: https://github.com/Candunaj/
[@locks]: https://github.com/locks/
[@marcoow]: https://github.com/marcoow/
[@nickschot]: https://github.com/nickschot
[@bobrimperator]: https://github.com/BobrImperator/
[@oscard0m]: https://github.com/oscard0m/
[contact]: https://simplabs.com/contact/

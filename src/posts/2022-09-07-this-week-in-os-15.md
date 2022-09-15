---
title: "This week in Open Source at Mainmatter #15"
authorHandle: mainmatter
tags: open-source
bio: "The Mainmatter team"
description:
  "A collection of work that our engineers have been carrying out in open-source
  in the past few weeks."
og:
  image: /assets/images/posts/2022-09-07-this-week-in-os-15/og-image.png
tagline: |
  <p>Our software engineers are all active members of the open-source community and
  enjoy collaborating on various projects. In this blog post, we have collected
  some of the work they have done the past week!</p>
---

## Rust

- [LukeMathWalker/tracing-bunyan-formatter]
  [#20](https://github.com/LukeMathWalker/tracing-bunyan-formatter/pull/20)
  Migrate from `claim` to `claims` ([@Turbo87])
- [Turbo87/segelflug-classifieds]
  [#350](https://github.com/Turbo87/segelflug-classifieds/pull/350) Fix "byte
  index is not a char boundary" crash ([@Turbo87])

## crates.io

- [rust-lang/crates.io]
  [#5170](https://github.com/rust-lang/crates.io/pull/5170) Remove icons from
  page headers ([@Turbo87])
- [rust-lang/crates.io]
  [#5167](https://github.com/rust-lang/crates.io/pull/5167) PageHeader: Remove
  margins on `.heading` element ([@Turbo87])
- [rust-lang/crates.io]
  [#5166](https://github.com/rust-lang/crates.io/pull/5166) tests/record: Fix
  server bind IP address ([@Turbo87])
- [rust-lang/crates.io]
  [#5165](https://github.com/rust-lang/crates.io/pull/5165) Migrate from `claim`
  to `claims` ([@Turbo87])
- [rust-lang/crates.io]
  [#5164](https://github.com/rust-lang/crates.io/pull/5164) accept-invite: Use
  `<LinkTo>` instead of raw `<a>` ([@Turbo87])
- [rust-lang/crates.io]
  [#5155](https://github.com/rust-lang/crates.io/pull/5155) Use slightly darker
  background color for header and footer ([@Turbo87])
- [rust-lang/crates.io]
  [#5150](https://github.com/rust-lang/crates.io/pull/5150) renovate: Group
  `diesel` packages in one pull request ([@Turbo87])
- [rust-lang/crates.io]
  [#5149](https://github.com/rust-lang/crates.io/pull/5149) Adjust header
  foreground colors ([@Turbo87])
- [rust-lang/crates.io]
  [#5148](https://github.com/rust-lang/crates.io/pull/5148) RenderedHtml: Fix
  inline code styling in lists ([@Turbo87])
- [rust-lang/crates.io]
  [#5146](https://github.com/rust-lang/crates.io/pull/5146) Use snapshot testing
  for `category` API tests ([@Turbo87])
- [rust-lang/crates.io]
  [#5145](https://github.com/rust-lang/crates.io/pull/5145) EncodableVersion:
  Expose new `checksum` field on the API ([@Turbo87])
- [rust-lang/crates.io]
  [#5144](https://github.com/rust-lang/crates.io/pull/5144) Fix rustdoc link
  rendering in READMEs ([@Turbo87])
- [rust-lang/crates.io]
  [#5135](https://github.com/rust-lang/crates.io/pull/5135) versions: Adjust
  `checksum` column to be `NOT NULL` ([@Turbo87])
- [rust-lang/crates.io]
  [#5134](https://github.com/rust-lang/crates.io/pull/5134) Docker: Fix pnpm
  usage ([@Turbo87])
- [rust-lang/crates.io]
  [#5133](https://github.com/rust-lang/crates.io/pull/5133) tests: Use `insta`
  to assert on full version API responses ([@Turbo87])
- [rust-lang/crates.io]
  [#5132](https://github.com/rust-lang/crates.io/pull/5132) CI: Run `percy exec`
  with `pnpm` instead of `pnpx` ([@Turbo87])
- [rust-lang/crates.io]
  [#5126](https://github.com/rust-lang/crates.io/pull/5126) Replace
  `ember-api-actions` dependency with `customAction()` function ([@Turbo87])
- [rust-lang/crates.io]
  [#5125](https://github.com/rust-lang/crates.io/pull/5125) ember-data: Silence
  `model-save-promise` deprecation ([@Turbo87])
- [rust-lang/crates.io]
  [#5123](https://github.com/rust-lang/crates.io/pull/5123) ember-data: Replace
  `store.find()` calls with `store.findRecord()` ([@Turbo87])
- [rust-lang/crates.io]
  [#5122](https://github.com/rust-lang/crates.io/pull/5122) admin::git_import:
  Improve error reporting ([@Turbo87])
- [rust-lang/crates.io]
  [#5118](https://github.com/rust-lang/crates.io/pull/5118) ESLint: Add missing
  `@babel/plugin-proposal-decorators` dependency ([@Turbo87])
- [rust-lang/crates.io]
  [#5115](https://github.com/rust-lang/crates.io/pull/5115) ember-concurrency:
  Migrate to new task syntax API ([@Turbo87])
- [rust-lang/crates.io]
  [#5101](https://github.com/rust-lang/crates.io/pull/5101) pnpm: Fix more peer
  dependency issues ([@Turbo87])
- [rust-lang/crates.io]
  [#5100](https://github.com/rust-lang/crates.io/pull/5100) pnpm: Ignore
  `postcss` peer dependency warnings ([@Turbo87])
- [rust-lang/crates.io]
  [#5091](https://github.com/rust-lang/crates.io/pull/5091) database: Add
  `explicit_name` column to `dependencies` table ([@Turbo87])
- [rust-lang/crates.io]
  [#5089](https://github.com/rust-lang/crates.io/pull/5089) index: Use/Allow
  alphabetic ordering of features and dependencies ([@Turbo87])
- [rust-lang/crates.io]
  [#5084](https://github.com/rust-lang/crates.io/pull/5084) Migrate from yarn
  1.x to pnpm ([@Turbo87])
- [rust-lang/crates.io]
  [#5077](https://github.com/rust-lang/crates.io/pull/5077) database: Add
  `checksum` field ([@Turbo87])
- [rust-lang/crates.io]
  [#5074](https://github.com/rust-lang/crates.io/pull/5074) Stop saving badges
  in the database ([@Turbo87])
- [rust-lang/crates.io]
  [#5071](https://github.com/rust-lang/crates.io/pull/5071) Stop returning
  deprecated badges from API ([@Turbo87])
- [rust-lang/crates.io]
  [#5070](https://github.com/rust-lang/crates.io/pull/5070) Remove unnecessary
  derefs ([@Turbo87])

## Octoherd

- [octoherd/.github] [#5](https://github.com/octoherd/.github/pull/5)
  feat(default.json): remove 'helpers:pinGitHubActionDigests' ([@oscard0m])

## Ember.js

- [ef4/ember-auto-import]
  [#533](https://github.com/ef4/ember-auto-import/pull/533) update
  package-lock.json version of htmlbars ([@mansona])
- [ember-learn/ember-blog]
  [#1201](https://github.com/ember-learn/ember-blog/pull/1201) update
  empress-blog ([@mansona])
- [ember-learn/ember-styleguide]
  [#431](https://github.com/ember-learn/ember-styleguide/pull/431) fix issues
  with ember-try release scenarios ([@mansona])
- [ember-learn/guidemaker-ember-template]
  [#115](https://github.com/ember-learn/guidemaker-ember-template/pull/115) add
  website-redesign branch to builds ([@mansona])
- [ember-learn/guidemaker-ember-template]
  [#114](https://github.com/ember-learn/guidemaker-ember-template/pull/114) add
  deprecations scenarios to ember-try ([@mansona])
- [ember-learn/guidemaker-ember-template]
  [#113](https://github.com/ember-learn/guidemaker-ember-template/pull/113) run
  angle-brackets-codemod ([@mansona])
- [ember-learn/guidemaker-ember-template]
  [#112](https://github.com/ember-learn/guidemaker-ember-template/pull/112)
  remove the use of implicit-this ([@mansona])
- [ember-learn/guidemaker-ember-template]
  [#111](https://github.com/ember-learn/guidemaker-ember-template/pull/111) fix
  ember-try for Ember release, beta, and alpha ([@mansona])
- [ember-learn/guidemaker-ember-template]
  [#110](https://github.com/ember-learn/guidemaker-ember-template/pull/110)
  Update dependencies to fix CI ([@mansona])
- [ember-template-lint/ember-template-lint]
  [#2584](https://github.com/ember-template-lint/ember-template-lint/pull/2584)
  Add autofixer to `linebreak-style` rule ([@locks])
- [ember-template-lint/ember-template-lint]
  [#2583](https://github.com/ember-template-lint/ember-template-lint/pull/2583)
  Add autofixer to `self-closing-void-elements` rule ([@locks])
- [ember-template-lint/ember-template-lint]
  [#2582](https://github.com/ember-template-lint/ember-template-lint/pull/2582)
  Add autofixer to `no-quoteless-attributes` rule ([@locks])
- [ember-template-lint/ember-template-lint]
  [#2581](https://github.com/ember-template-lint/ember-template-lint/pull/2581)
  Add autofixer to `no-html-comments` rule ([@locks])
- [ember-template-lint/ember-template-lint]
  [#2580](https://github.com/ember-template-lint/ember-template-lint/pull/2580)
  Add autofixer to `no-unused-block-params` rule ([@locks])
- [empress/guidemaker] [#76](https://github.com/empress/guidemaker/pull/76) fix
  transitionTo deprecations ([@mansona])
- [empress/guidemaker] [#75](https://github.com/empress/guidemaker/pull/75) fix
  ember-try for pre-releases ([@mansona])
- [empress/guidemaker] [#74](https://github.com/empress/guidemaker/pull/74)
  update dependencies to fix CI ([@mansona])
- [empress/guidemaker-default-template]
  [#28](https://github.com/empress/guidemaker-default-template/pull/28) remove
  link-to override ([@mansona])
- [empress/guidemaker-default-template]
  [#27](https://github.com/empress/guidemaker-default-template/pull/27) fix
  no-implicit-this and template deprecations ([@mansona])
- [empress/guidemaker-default-template]
  [#26](https://github.com/empress/guidemaker-default-template/pull/26) remove
  ember-cli-google-fonts ([@mansona])
- [empress/guidemaker-default-template]
  [#25](https://github.com/empress/guidemaker-default-template/pull/25) fix the
  contains helper that never worked ([@mansona])

## Lint to the future

- [mansona/lint-to-the-future-stylelint]
  [#6](https://github.com/mansona/lint-to-the-future-stylelint/pull/6) Add a
  basic testing system ([@mansona])

## JavaScript

- [volta-cli/action] [#100](https://github.com/volta-cli/action/pull/100) Fix
  changelog heading ([@Turbo87])

## Octokit

- [octokit/auth-oauth-device.js]
  [#74](https://github.com/octokit/auth-oauth-device.js/pull/74) fix(test):
  force test failure ([@oscard0m])
- [octokit/auth-oauth-device.js]
  [#72](https://github.com/octokit/auth-oauth-device.js/pull/72) revert(deps):
  lock file maintenance ([@oscard0m])
- [octokit/oauth-app.js]
  [#331](https://github.com/octokit/oauth-app.js/pull/331) fix(bundlesize): move
  'aws-lambda' as devDependency ([@oscard0m])
- [oscard0m/octoherd-script-fix-test-workflow-octokit]
  [#1](https://github.com/oscard0m/octoherd-script-fix-test-workflow-octokit/pull/1)
  feat: Initial version ([@oscard0m])
- [oscard0m/octoherd-script-remove-renovate-package.json]
  [#1](https://github.com/oscard0m/octoherd-script-remove-renovate-package.json/pull/1)
  feat: Initial version ([@oscard0m])

## Probot

- [probot/example-vercel]
  [#50](https://github.com/probot/example-vercel/pull/50) docs(README): add
  section for 'Other examples' ([@oscard0m])
- [probot/example-vercel]
  [#49](https://github.com/probot/example-vercel/pull/49) docs(readme): add
  considerations for deploying with vercel ([@oscard0m])
- [probot/probot] [#1724](https://github.com/probot/probot/pull/1724)
  build(deps): upgrade octokit/types to v7.1.1 ([@oscard0m])

[@turbo87]: https://github.com/Turbo87
[@candunaj]: https://github.com/candunaj
[@locks]: https://github.com/locks
[@mansona]: https://github.com/mansona
[@oscard0m]: https://github.com/oscard0m
[lukemathwalker/tracing-bunyan-formatter]:
  https://github.com/LukeMathWalker/tracing-bunyan-formatter
[turbo87/segelflug-classifieds]:
  https://github.com/Turbo87/segelflug-classifieds
[ef4/ember-auto-import]: https://github.com/ef4/ember-auto-import
[ember-codemods/ember-angle-brackets-codemod]:
  https://github.com/ember-codemods/ember-angle-brackets-codemod
[ember-learn/ember-blog]: https://github.com/ember-learn/ember-blog
[ember-learn/ember-styleguide]: https://github.com/ember-learn/ember-styleguide
[ember-learn/guidemaker-ember-template]:
  https://github.com/ember-learn/guidemaker-ember-template
[ember-template-lint/ember-template-lint]:
  https://github.com/ember-template-lint/ember-template-lint
[empress/guidemaker-default-template]:
  https://github.com/empress/guidemaker-default-template
[empress/guidemaker]: https://github.com/empress/guidemaker
[mansona/lint-to-the-future-stylelint]:
  https://github.com/mansona/lint-to-the-future-stylelint
[octoherd/.github]: https://github.com/octoherd/.github
[octoherd/create-octoherd-script]:
  https://github.com/octoherd/create-octoherd-script
[octoherd/script-setup-renovate]:
  https://github.com/octoherd/script-setup-renovate
[octokit/auth-oauth-device.js]: https://github.com/octokit/auth-oauth-device.js
[octokit/oauth-app.js]: https://github.com/octokit/oauth-app.js
[oscard0m/example-vercel-ts]: https://github.com/oscard0m/example-vercel-ts
[oscard0m/gravity_dummy]: https://github.com/oscard0m/gravity_dummy
[oscard0m/octoherd-script-fix-test-workflow-octokit]:
  https://github.com/oscard0m/octoherd-script-fix-test-workflow-octokit
[oscard0m/octoherd-script-remove-renovate-package.json]:
  https://github.com/oscard0m/octoherd-script-remove-renovate-package.json
[probot/example-vercel]: https://github.com/probot/example-vercel
[probot/probot]: https://github.com/probot/probot
[rust-lang/crates.io]: https://github.com/rust-lang/crates.io
[soxhub/formatjs]: https://github.com/soxhub/formatjs
[volta-cli/action]: https://github.com/volta-cli/action

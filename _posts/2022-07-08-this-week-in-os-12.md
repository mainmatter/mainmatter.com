---
title: 'This week in Open Source at simplabs #12'
author: 'simplabs'
github: simplabs
twitter: simplabs
topic: open-source
bio: 'The simplabs team'
description:
  'A collection of work that our engineers have been carrying out in open-source
  in the past few weeks.'
og:
  image: /assets/images/posts/2022-07-08-this-week-in-os-12/og-image.png
---

Our software engineers are all active members of the open-source community and
enjoy collaborating on various projects. In this blog post, we have collected
some of the work they have done the past weeks!

<!--break-->

## Rust

- [Turbo87/sentry-conduit]
  [#80](https://github.com/Turbo87/sentry-conduit/pull/80) Update minimum Rust
  version to v1.57.0 ([@Turbo87])
- [Turbo87/sentry-conduit]
  [#79](https://github.com/Turbo87/sentry-conduit/pull/79) Improve HTTP status
  code mapping ([@Turbo87])
- [Turbo87/sentry-conduit]
  [#76](https://github.com/Turbo87/sentry-conduit/pull/76) Implement performance
  tracing support ([@Turbo87])
- [Turbo87/sentry-conduit]
  [#75](https://github.com/Turbo87/sentry-conduit/pull/75) examples: Add two
  more routes ([@Turbo87])

## crates.io

- [rust-lang/crates.io]
  [#4921](https://github.com/rust-lang/crates.io/pull/4921) version::downloads:
  Simplify `add_custom_metadata()` usage ([@Turbo87])
- [rust-lang/crates.io]
  [#4884](https://github.com/rust-lang/crates.io/pull/4884) sentry: Enable
  performance tracing via `SENTRY_TRACES_SAMPLE_RATE` env var ([@Turbo87])

## Mock Service Worker

- [mswjs/cookies] [#22](https://github.com/mswjs/cookies/pull/22) ci(ci.yml):
  remove unused matrix of versions ([@oscard0m])
- [mswjs/cookies] [#21](https://github.com/mswjs/cookies/pull/21) ci(release):
  use node-version 16 ([@oscard0m])
- [mswjs/cookies] [#20](https://github.com/mswjs/cookies/pull/20) ci(ci.yml):
  use node-version 16 ([@oscard0m])
- [mswjs/gh-issue-forms] [#3](https://github.com/mswjs/gh-issue-forms/pull/3)
  chore(push.sh): remove 'push.sh' file ([@oscard0m])
- [mswjs/interceptors] [#271](https://github.com/mswjs/interceptors/pull/271)
  ci(release): use node-version 16 ([@oscard0m])
- [mswjs/msw-storybook-addon]
  [#86](https://github.com/mswjs/msw-storybook-addon/pull/86) ci(release): use
  node-version 16 ([@oscard0m])
- [mswjs/msw] [#1303](https://github.com/mswjs/msw/pull/1303) ci(smoke): use
  node-version 16 ([@oscard0m])

## Octoherd

- [octoherd/.github] [#4](https://github.com/octoherd/.github/pull/4)
  ci(renovate): configure renovate to pin GitHub Actions digests ([@oscard0m])
- [octoherd/.github] [#3](https://github.com/octoherd/.github/pull/3)
  ci(renovate): rename the config file to default.json ([@oscard0m])

## Ember.js

- [babel/ember-cli-babel]
  [#451](https://github.com/babel/ember-cli-babel/pull/451) unpin @babel/runtime
  to see what tests fail ([@mansona])
- [ef4/ember-auto-import]
  [#528](https://github.com/ef4/ember-auto-import/pull/528) WIP trying to turn a
  build error into a runtime error ([@mansona])
- [ember-learn/ember-blog]
  [#1163](https://github.com/ember-learn/ember-blog/pull/1163) add a blurb for
  Lint to the Future ([@mansona])
- [ember-learn/ember-help-wanted-server]
  [#50](https://github.com/ember-learn/ember-help-wanted-server/pull/50) update
  stack used for preview apps ([@mansona])
- [ember-learn/ember-styleguide]
  [#424](https://github.com/ember-learn/ember-styleguide/pull/424) update
  lint-to-the-future dependencies ([@mansona])
- [ember-learn/empress-blog-ember-template]
  [#122](https://github.com/ember-learn/empress-blog-ember-template/pull/122)
  Replace custom TagPostList styles with Styleguide ([@mansona])
- [ember-learn/rfcs-app] [#7](https://github.com/ember-learn/rfcs-app/pull/7)
  update mdbook template ([@mansona])
- [ember-learn/rfcs-app] [#6](https://github.com/ember-learn/rfcs-app/pull/6)
  use github compatible header ids ([@mansona])
- [ember-learn/rfcs-app] [#4](https://github.com/ember-learn/rfcs-app/pull/4)
  Include images in the output build ([@mansona])
- [emberjs/ember.js] [#20120](https://github.com/emberjs/ember.js/pull/20120)
  [BUGFIX LTS] unique-id: Ensure return value starts with a letter to avoid
  invalid selectors starting with numeric digits ([@Turbo87])
- [emberjs/rfcs] [#828](https://github.com/emberjs/rfcs/pull/828) fix image urls
  in embedded images ([@mansona])
- [emberjs/rfcs] [#826](https://github.com/emberjs/rfcs/pull/826) disable mdbook
  builds ([@mansona])
- [emberjs/rfcs] [#825](https://github.com/emberjs/rfcs/pull/825) Add redirects
  for all the github.io links to the new RFCs app ([@mansona])
- [empress/field-guide] [#59](https://github.com/empress/field-guide/pull/59)
  Implement indexes ([@mansona])
- [empress/rfc-process-mdbook-template]
  [#14](https://github.com/empress/rfc-process-mdbook-template/pull/14) remove
  index number from table of contents ([@mansona])
- [mansona/ember-body-class]
  [#59](https://github.com/mansona/ember-body-class/pull/59) update
  ember-auto-import to support Ember 4.x ([@mansona])
- [mansona/ember-body-class]
  [#58](https://github.com/mansona/ember-body-class/pull/58) Breaking: drop
  support for Ember < 3.8 ([@mansona])
- [mansona/ember-body-class]
  [#57](https://github.com/mansona/ember-body-class/pull/57) remove router
  deprecation ([@mansona])
- [mansona/ember-body-class]
  [#52](https://github.com/mansona/ember-body-class/pull/52) Breaking: drop
  support for node < 14 ([@mansona])
- [mansona/ember-body-class]
  [#51](https://github.com/mansona/ember-body-class/pull/51) Update Ember to
  3.28 with ember-cli-update ([@mansona])
- [mansona/ember-cli-babel]
  [#1](https://github.com/mansona/ember-cli-babel/pull/1) Unpin babel runtime
  ([@mansona])
- [mansona/ember-cli-notifications]
  [#342](https://github.com/mansona/ember-cli-notifications/pull/342) Refactor:
  Handle notification htmlContent in backing class ([@pichfl])
- [mansona/ember-cli-notifications]
  [#341](https://github.com/mansona/ember-cli-notifications/pull/341) Fix
  ember-try scenarios ([@mansona])
- [mansona/ember-get-config]
  [#46](https://github.com/mansona/ember-get-config/pull/46) Fix ember-try
  issues ([@mansona])
- [simplabs/ember-intl-analyzer]
  [#528](https://github.com/simplabs/ember-intl-analyzer/pull/528) Add custom
  plugin/extension support ([@Mikek2252])
- [zeppelin/ember-click-outside]
  [#246](https://github.com/zeppelin/ember-click-outside/pull/246) Prettify +
  replace ancient syntax in tests & dummy app ([@zeppelin])
- [zeppelin/ember-click-outside]
  [#245](https://github.com/zeppelin/ember-click-outside/pull/245) Deprecate
  ClickOutside component ([@zeppelin])
- [zeppelin/ember-click-outside]
  [#244](https://github.com/zeppelin/ember-click-outside/pull/244) Remove
  deprecated ClickOutsideMixin ([@zeppelin])
- [zeppelin/ember-click-outside]
  [#243](https://github.com/zeppelin/ember-click-outside/pull/243) Remove
  component template containing a single yield ([@zeppelin])
- [zeppelin/ember-click-outside]
  [#242](https://github.com/zeppelin/ember-click-outside/pull/242) Drop
  ember-modifier < 3.2.0 & resolve deprecations ([@nickschot])

## Lint to the future

- [mansona/lint-to-the-future-eslint]
  [#8](https://github.com/mansona/lint-to-the-future-eslint/pull/8) fix typo in
  README.md ([@locks])
- [mansona/lint-to-the-future-eslint]
  [#6](https://github.com/mansona/lint-to-the-future-eslint/pull/6) Make regular
  expression resilient to // eslint-disable-next-line declarations ([@locks])
- [mansona/lint-to-the-future-eslint]
  [#7](https://github.com/mansona/lint-to-the-future-eslint/pull/7) add a test
  for list function ([@mansona])
- [mansona/lint-to-the-future-stylelint]
  [#3](https://github.com/mansona/lint-to-the-future-stylelint/pull/3) update
  stylelint peerDependency to accept stylelint 13 and 14 ([@Mikek2252])

## JavaScript

- [cookpete/auto-changelog]
  [#237](https://github.com/cookpete/auto-changelog/pull/237) Add a Plugin
  system ([@mansona])
- [sinonjs/fake-timers] [#433](https://github.com/sinonjs/fake-timers/pull/433)
  add failing test for issue 432 ([@mansona])
- [sinonjs/fake-timers] [#431](https://github.com/sinonjs/fake-timers/pull/431)
  Add a bit more structure to the tests ([@mansona])
- [squash-commit-app/squash-commit-app]
  [#19](https://github.com/squash-commit-app/squash-commit-app/pull/19)
  fix(release): use node-version 14 ([@oscard0m])
- [squash-commit-app/squash-commit-app]
  [#18](https://github.com/squash-commit-app/squash-commit-app/pull/18)
  docs(README): add context and news about this GitHub App ([@oscard0m])

## Octokit

- [octokit/.github] [#8](https://github.com/octokit/.github/pull/8)
  feat(default.json): use 'chore' as default semantic commit type ([@oscard0m])
- [octokit/action.js] [#394](https://github.com/octokit/action.js/pull/394)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/app.js] [#291](https://github.com/octokit/app.js/pull/291)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-action.js]
  [#217](https://github.com/octokit/auth-action.js/pull/217) build(npm): replace
  'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-app.js] [#352](https://github.com/octokit/auth-app.js/pull/352)
  ci(test): downgrade sinonjs/faker-timers to v8 to 'test' checkrun
  ([@oscard0m])
- [octokit/auth-app.js] [#350](https://github.com/octokit/auth-app.js/pull/350)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-callback.js]
  [#57](https://github.com/octokit/auth-callback.js/pull/57) build(npm): replace
  'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-oauth-app.js]
  [#234](https://github.com/octokit/auth-oauth-app.js/pull/234) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-oauth-device.js]
  [#57](https://github.com/octokit/auth-oauth-device.js/pull/57) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-oauth-user.js]
  [#55](https://github.com/octokit/auth-oauth-user.js/pull/55) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-token.js]
  [#230](https://github.com/octokit/auth-token.js/pull/230) build(npm): replace
  'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/auth-unauthenticated.js]
  [#126](https://github.com/octokit/auth-unauthenticated.js/pull/126)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/auth-unauthenticated.js]
  [#125](https://github.com/octokit/auth-unauthenticated.js/pull/125)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/auth-unauthenticated.js]
  [#124](https://github.com/octokit/auth-unauthenticated.js/pull/124)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/core.js] [#484](https://github.com/octokit/core.js/pull/484)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/endpoint.js] [#322](https://github.com/octokit/endpoint.js/pull/322)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/endpoint.js] [#321](https://github.com/octokit/endpoint.js/pull/321)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/graphql.js] [#363](https://github.com/octokit/graphql.js/pull/363)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/graphql.js] [#362](https://github.com/octokit/graphql.js/pull/362)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/oauth-app.js]
  [#298](https://github.com/octokit/oauth-app.js/pull/298) build(npm): replace
  'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/oauth-authorization-url.js]
  [#182](https://github.com/octokit/oauth-authorization-url.js/pull/182)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/oauth-methods.js]
  [#59](https://github.com/octokit/oauth-methods.js/pull/59) build(npm): replace
  'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/octokit.js] [#2248](https://github.com/octokit/octokit.js/pull/2248)
  fix(deps): update dependency @octokit/core to v4 ([@oscard0m])
- [octokit/octokit.js] [#2235](https://github.com/octokit/octokit.js/pull/2235)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-create-or-update-text-file.js]
  [#59](https://github.com/octokit/plugin-create-or-update-text-file.js/pull/59)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-enterprise-cloud.js]
  [#351](https://github.com/octokit/plugin-enterprise-cloud.js/pull/351)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-enterprise-compatibility.js]
  [#290](https://github.com/octokit/plugin-enterprise-compatibility.js/pull/290)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-enterprise-server.js]
  [#438](https://github.com/octokit/plugin-enterprise-server.js/pull/438)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-paginate-rest.js]
  [#396](https://github.com/octokit/plugin-paginate-rest.js/pull/396)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-request-log.js]
  [#231](https://github.com/octokit/plugin-request-log.js/pull/231) ci(codeql):
  ignore on push events for dependabot branches ([@oscard0m])
- [octokit/plugin-request-log.js]
  [#230](https://github.com/octokit/plugin-request-log.js/pull/230) ci(codeql):
  ignore on push events for dependabot branches ([@oscard0m])
- [octokit/plugin-request-log.js]
  [#229](https://github.com/octokit/plugin-request-log.js/pull/229) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-rest-endpoint-methods.js]
  [#490](https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/490)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-retry.js]
  [#322](https://github.com/octokit/plugin-retry.js/pull/322) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/plugin-throttling.js]
  [#468](https://github.com/octokit/plugin-throttling.js/pull/468) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/request-error.js]
  [#233](https://github.com/octokit/request-error.js/pull/233) ci(codeql):
  ignore on push events for dependabot branches ([@oscard0m])
- [octokit/request-error.js]
  [#232](https://github.com/octokit/request-error.js/pull/232) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/request.js] [#473](https://github.com/octokit/request.js/pull/473)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/request.js] [#472](https://github.com/octokit/request.js/pull/472)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/request.js] [#471](https://github.com/octokit/request.js/pull/471)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/request.js] [#466](https://github.com/octokit/request.js/pull/466)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/rest.js] [#154](https://github.com/octokit/rest.js/pull/154)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/rest.js] [#153](https://github.com/octokit/rest.js/pull/153)
  ci(codeql): ignore on push events for dependabot branches ([@oscard0m])
- [octokit/rest.js] [#152](https://github.com/octokit/rest.js/pull/152)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/webhooks-methods.js]
  [#55](https://github.com/octokit/webhooks-methods.js/pull/55) build(npm):
  replace 'pika' command with 'pika-pack' ([@oscard0m])
- [octokit/webhooks.js] [#692](https://github.com/octokit/webhooks.js/pull/692)
  build(npm): replace 'pika' command with 'pika-pack' ([@oscard0m])

## Internal

- [simplabs/renovate-config]
  [#10](https://github.com/simplabs/renovate-config/pull/10) feat(renovate):
  configure renovate to pin GitHub Actions digests ([@oscard0m])

[@mikek2252]: https://github.com/Mikek2252
[@turbo87]: https://github.com/Turbo87
[@locks]: https://github.com/locks
[@mansona]: https://github.com/mansona
[@nickschot]: https://github.com/nickschot
[@oscard0m]: https://github.com/oscard0m
[@pichfl]: https://github.com/pichfl
[@zeppelin]: https://github.com/zeppelin
[turbo87/sentry-conduit]: https://github.com/Turbo87/sentry-conduit
[babel/ember-cli-babel]: https://github.com/babel/ember-cli-babel
[cookpete/auto-changelog]: https://github.com/cookpete/auto-changelog
[ef4/ember-auto-import]: https://github.com/ef4/ember-auto-import
[ember-learn/ember-blog]: https://github.com/ember-learn/ember-blog
[ember-learn/ember-help-wanted-server]:
  https://github.com/ember-learn/ember-help-wanted-server
[ember-learn/ember-styleguide]: https://github.com/ember-learn/ember-styleguide
[ember-learn/empress-blog-ember-template]:
  https://github.com/ember-learn/empress-blog-ember-template
[ember-learn/rfcs-app]: https://github.com/ember-learn/rfcs-app
[emberjs/ember.js]: https://github.com/emberjs/ember.js
[emberjs/rfcs]: https://github.com/emberjs/rfcs
[empress/field-guide-addon-docs-template]:
  https://github.com/empress/field-guide-addon-docs-template
[empress/field-guide]: https://github.com/empress/field-guide
[empress/rfc-process-mdbook-template]:
  https://github.com/empress/rfc-process-mdbook-template
[mansona/ember-body-class]: https://github.com/mansona/ember-body-class
[mansona/ember-cli-babel]: https://github.com/mansona/ember-cli-babel
[mansona/ember-cli-notifications]:
  https://github.com/mansona/ember-cli-notifications
[mansona/ember-get-config]: https://github.com/mansona/ember-get-config
[mansona/lint-to-the-future-eslint]:
  https://github.com/mansona/lint-to-the-future-eslint
[mansona/lint-to-the-future-stylelint]:
  https://github.com/mansona/lint-to-the-future-stylelint
[mswjs/cookies]: https://github.com/mswjs/cookies
[mswjs/gh-issue-forms]: https://github.com/mswjs/gh-issue-forms
[mswjs/interceptors]: https://github.com/mswjs/interceptors
[mswjs/msw-storybook-addon]: https://github.com/mswjs/msw-storybook-addon
[mswjs/msw]: https://github.com/mswjs/msw
[octoherd/.github]: https://github.com/octoherd/.github
[octokit/.github]: https://github.com/octokit/.github
[octokit/action.js]: https://github.com/octokit/action.js
[octokit/app.js]: https://github.com/octokit/app.js
[octokit/auth-action.js]: https://github.com/octokit/auth-action.js
[octokit/auth-app.js]: https://github.com/octokit/auth-app.js
[octokit/auth-callback.js]: https://github.com/octokit/auth-callback.js
[octokit/auth-oauth-app.js]: https://github.com/octokit/auth-oauth-app.js
[octokit/auth-oauth-device.js]: https://github.com/octokit/auth-oauth-device.js
[octokit/auth-oauth-user.js]: https://github.com/octokit/auth-oauth-user.js
[octokit/auth-token.js]: https://github.com/octokit/auth-token.js
[octokit/auth-unauthenticated.js]:
  https://github.com/octokit/auth-unauthenticated.js
[octokit/core.js]: https://github.com/octokit/core.js
[octokit/endpoint.js]: https://github.com/octokit/endpoint.js
[octokit/graphql.js]: https://github.com/octokit/graphql.js
[octokit/oauth-app.js]: https://github.com/octokit/oauth-app.js
[octokit/oauth-authorization-url.js]:
  https://github.com/octokit/oauth-authorization-url.js
[octokit/oauth-methods.js]: https://github.com/octokit/oauth-methods.js
[octokit/octokit.js]: https://github.com/octokit/octokit.js
[octokit/plugin-create-or-update-text-file.js]:
  https://github.com/octokit/plugin-create-or-update-text-file.js
[octokit/plugin-enterprise-cloud.js]:
  https://github.com/octokit/plugin-enterprise-cloud.js
[octokit/plugin-enterprise-compatibility.js]:
  https://github.com/octokit/plugin-enterprise-compatibility.js
[octokit/plugin-enterprise-server.js]:
  https://github.com/octokit/plugin-enterprise-server.js
[octokit/plugin-paginate-rest.js]:
  https://github.com/octokit/plugin-paginate-rest.js
[octokit/plugin-request-log.js]:
  https://github.com/octokit/plugin-request-log.js
[octokit/plugin-rest-endpoint-methods.js]:
  https://github.com/octokit/plugin-rest-endpoint-methods.js
[octokit/plugin-retry.js]: https://github.com/octokit/plugin-retry.js
[octokit/plugin-throttling.js]: https://github.com/octokit/plugin-throttling.js
[octokit/request-error.js]: https://github.com/octokit/request-error.js
[octokit/request.js]: https://github.com/octokit/request.js
[octokit/rest.js]: https://github.com/octokit/rest.js
[octokit/webhooks-methods.js]: https://github.com/octokit/webhooks-methods.js
[octokit/webhooks.js]: https://github.com/octokit/webhooks.js
[rust-lang/crates.io]: https://github.com/rust-lang/crates.io
[simplabs/ember-intl-analyzer]: https://github.com/simplabs/ember-intl-analyzer
[simplabs/renovate-config]: https://github.com/simplabs/renovate-config
[sinonjs/fake-timers]: https://github.com/sinonjs/fake-timers
[squash-commit-app/squash-commit-app]:
  https://github.com/squash-commit-app/squash-commit-app
[zeppelin/ember-click-outside]: https://github.com/zeppelin/ember-click-outside

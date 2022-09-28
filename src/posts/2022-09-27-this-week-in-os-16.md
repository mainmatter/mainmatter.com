---
title: "This week in Open Source at Mainmatter #16"
authorHandle: mainmatter
tags: open-source
bio: "The Mainmatter team"
description:
  "A collection of work that our engineers have been carrying out in open-source
  in the past few weeks."
og:
  image: /assets/images/posts/2022-09-27-this-week-in-os-16/og-image.jpg
tagline: |
  <p>Our software engineers are all active members of the open-source community and
  enjoy collaborating on various projects. In this blog post, we have collected
  some of the work they have done the past week!</p>
---

## Rust

- [Turbo87/united-flarmnet]
  [#162](https://github.com/Turbo87/united-flarmnet/pull/162) workflows/run:
  Deploy to GitHub Pages directly ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#157](https://github.com/Turbo87/united-flarmnet/pull/157) CI: Simplify `CI`
  workflow ([@Turbo87])
- [Turbo87/united-flarmnet]
  [#156](https://github.com/Turbo87/united-flarmnet/pull/156) CI: Simplify and
  improve `Run` workflow ([@Turbo87])

## crates.io

- [rust-lang/crates.io]
  [#5262](https://github.com/rust-lang/crates.io/pull/5262) CI: Replace
  `volta-cli/action` with builtin functionality from `actions/setup-node`
  ([@Turbo87])
- [rust-lang/crates.io]
  [#5244](https://github.com/rust-lang/crates.io/pull/5244) Use slightly darker
  background color for header and footer ([@Turbo87])
- [rust-lang/crates.io]
  [#5243](https://github.com/rust-lang/crates.io/pull/5243) CrateHeader: Fix
  narrow screen layout ([@Turbo87])
- [rust-lang/crates.io]
  [#5238](https://github.com/rust-lang/crates.io/pull/5238) ember-get-config:
  Use override to update to v2.1.1 ([@Turbo87])
- [rust-lang/crates.io]
  [#5233](https://github.com/rust-lang/crates.io/pull/5233) ember-data: Enable
  `crypto.randomUUID()` polyfill ([@Turbo87])
- [rust-lang/crates.io]
  [#5180](https://github.com/rust-lang/crates.io/pull/5180) services/session:
  Clear in-memory data when logging out ([@Turbo87])

## Octoherd

- [octoherd/.github] [#7](https://github.com/octoherd/.github/pull/7)
  feat(renovate): extend octokit/.github preset ([@oscard0m])
- [octoherd/create-octoherd-script]
  [#72](https://github.com/octoherd/create-octoherd-script/pull/72)
  ci(release.yml): revert delition v3 to actions/setup-node by octoherd script
  ([@oscard0m])
- [octoherd/create-octoherd-script]
  [#68](https://github.com/octoherd/create-octoherd-script/pull/68) build(deps):
  remove semantic-release dependencies ([@oscard0m])
- [octoherd/create-octoherd-script]
  [#66](https://github.com/octoherd/create-octoherd-script/pull/66)
  feat(script): scaffold renovate config for octoherd repos ([@oscard0m])
- [octoherd/create-octoherd-script]
  [#65](https://github.com/octoherd/create-octoherd-script/pull/65)
  style(renovate): apply Prettier indentation ([@oscard0m])
- [octoherd/script-setup-renovate]
  [#35](https://github.com/octoherd/script-setup-renovate/pull/35) feat(script):
  skip repositories named '.github' ([@oscard0m])

## Ember.js

- [ember-cli/ember-cli-htmlbars]
  [#755](https://github.com/ember-cli/ember-cli-htmlbars/pull/755) Add a test
  that covers addon templates and fix ember-try to include correct ember-cli
  versions ([@mansona])
- [ember-learn/ember-release-bot]
  [#25](https://github.com/ember-learn/ember-release-bot/pull/25) Update
  postgres keyv dependencies ([@mansona])
- [ember-learn/guides-source]
  [#1846](https://github.com/ember-learn/guides-source/pull/1846) v4.7.0
  ([@locks])
- [emberjs/rfcs-tooling] [#12](https://github.com/emberjs/rfcs-tooling/pull/12)
  lint releaseDate properly ([@mansona])
- [mainmatter/ember-workshop]
  [#646](https://github.com/mainmatter/ember-workshop/pull/646) Ignore all
  node_modules, not just direct child ([@locks])
- [mainmatter/ember2-x-codemods]
  [#5](https://github.com/mainmatter/ember2-x-codemods/pull/5) update ci
  workflow to publish on tag creation ([@Mikek2252])
- [mainmatter/ember2-x-codemods]
  [#4](https://github.com/mainmatter/ember2-x-codemods/pull/4) add
  lerna-changelog and release it ([@Mikek2252])
- [mainmatter/ember2-x-codemods]
  [#3](https://github.com/mainmatter/ember2-x-codemods/pull/3) add
  remove-binding codemod with tests and documentation ([@Mikek2252])
- [mainmatter/ember2-x-codemods]
  [#2](https://github.com/mainmatter/ember2-x-codemods/pull/2) Add the codemod
  contains to includes. ([@Mikek2252])
- [mainmatter/ember2-x-codemods]
- [mainmatter/qunit-dom]
  [#1696](https://github.com/mainmatter/qunit-dom/pull/1696) chore: downgrade
  documentation@13.2.5 to 13.2.4 ([@BobrImperator])
- [mainmatter/qunit-dom]
- [nickschot/ember-gesture-modifiers]
  [#325](https://github.com/nickschot/ember-gesture-modifiers/pull/325) Require
  ember-modifier v3.2.0+ to make sure the new modifier syntax is available
  ([@nickschot])
- [nickschot/ember-gesture-modifiers]
  [#323](https://github.com/nickschot/ember-gesture-modifiers/pull/323) Upgrade
  to new ember-modifiers syntax ([@nickschot])
- [nickschot/ember-gesture-modifiers]
  [#322](https://github.com/nickschot/ember-gesture-modifiers/pull/322) Update
  to ember-cli 4.7.0 blueprint ([@nickschot])
- [nickschot/ember-gesture-modifiers]
  [#321](https://github.com/nickschot/ember-gesture-modifiers/pull/321) Pin yarn
  version with Volta ([@nickschot])
- [nickschot/ember-gesture-modifiers]
  [#320](https://github.com/nickschot/ember-gesture-modifiers/pull/320) Drop
  node v12 ([@nickschot])
- [nickschot/ember-mobile-menu]
  [#429](https://github.com/nickschot/ember-mobile-menu/pull/429) Fix fastboot
  compatibility and add smoke test ([@nickschot])

## Empress

- [empress/bottled-ember] [#3](https://github.com/empress/bottled-ember/pull/3)
  add a way to override ember-cli-build config ([@mansona])
- [empress/bottled-ember] [#2](https://github.com/empress/bottled-ember/pull/2)
  pass --environment on to ember exec ([@mansona])
- [empress/bottled-ember] [#1](https://github.com/empress/bottled-ember/pull/1)
  Implement basic cach-folder version of bottled ember ([@mansona])

## Lint to the future

- [mansona/lint-to-the-future-eslint]
  [#11](https://github.com/mansona/lint-to-the-future-eslint/pull/11) stop
  ignoring eslint warnings ([@mansona])
- [mansona/lint-to-the-future-eslint]
  [#10](https://github.com/mansona/lint-to-the-future-eslint/pull/10) Add eslint
  versions to a test matrix ([@mansona])

## Octokit

- [octoherd/cli] [#83](https://github.com/octoherd/cli/pull/83) ci(release): fix
  dependency name ([@oscard0m])
- [octoherd/cli] [#82](https://github.com/octoherd/cli/pull/82) build(deps):
  remove semantic-release dependencies ([@oscard0m])
- [octoherd/octokit] [#25](https://github.com/octoherd/octokit/pull/25)
  ci(release.yml): fix dependency name ([@oscard0m])
- [octoherd/octokit] [#24](https://github.com/octoherd/octokit/pull/24)
  build(deps): remove semantic-release dependencies ([@oscard0m])
- [octokit/auth-oauth-user.js]
  [#90](https://github.com/octokit/auth-oauth-user.js/pull/90) WIP feat(auth):
  add onTokenCreated option ([@oscard0m])
- [octokit/create-octokit-project.js]
  [#193](https://github.com/octokit/create-octokit-project.js/pull/193)
  feat(renovate): add Renovate configuration if owner is 'octokit' ([@oscard0m])
- [oscard0m/octoherd-script-remove-renovate-package.json]
  [#4](https://github.com/oscard0m/octoherd-script-remove-renovate-package.json/pull/4)
  fix(deps): move @octokit/plugin-create-or-update-text-file as production
  'dependency' ([@oscard0m])
- [oscard0m/octoherd-script-update-action-version-in-workflows]
  [#4](https://github.com/oscard0m/octoherd-script-update-action-version-in-workflows/pull/4)
  feat(script): use RegEx instead of js-yaml ([@oscard0m])
- [oscard0m/octoherd-script-update-action-version-in-workflows]
  [#1](https://github.com/oscard0m/octoherd-script-update-action-version-in-workflows/pull/1)
  feat: Initial version ([@oscard0m])

## Rollup

- [ezolenko/rollup-plugin-typescript2]
  [#420](https://github.com/ezolenko/rollup-plugin-typescript2/pull/420)
  fix(cache): default `clean: true` when necessary, add `extraCacheKeys` option
  ([@oscard0m])

## Elixir

- [rrrene/credo] [#996](https://github.com/rrrene/credo/pull/996) feat: Add
  Ignore option for Credo.Check.Readability.ModuleNames ([@BobrImperator])

## Clojure

- [mtgred/netrunner] [#6605](https://github.com/mtgred/netrunner/pull/6605)
  Implement default game format account setting ([@locks])
- [mtgred/netrunner] [#6592](https://github.com/mtgred/netrunner/pull/6592)
  Rename brain damage to core damage, Part I ([@locks])

## Probot

- [probot/.github] [#4](https://github.com/probot/.github/pull/4)
  chore(renovate): remove .github/renovate.json ([@oscard0m])
- [probot/talks] [#2](https://github.com/probot/talks/pull/2) chore(.github):
  remove unused Renovate configuration ([@oscard0m])
- [probot/twitter] [#27](https://github.com/probot/twitter/pull/27)
  chore(.github): remove unused Renovate configuration ([@oscard0m])

## Mainmatter's playbook

- [mainmatter/playbook] [#180](https://github.com/mainmatter/playbook/pull/180)
  Mainmatter ([@marcoow])

## Gliding

- [weglide/GliderList] [#42](https://github.com/weglide/GliderList/pull/42) Add
  2023 handicaps ([@Turbo87])

[@bobrimperator]: https://github.com/BobrImperator
[@mikek2252]: https://github.com/Mikek2252
[@turbo87]: https://github.com/Turbo87
[@locks]: https://github.com/locks
[@mansona]: https://github.com/mansona
[@marcoow]: https://github.com/marcoow
[@nickschot]: https://github.com/nickschot
[@oscard0m]: https://github.com/oscard0m
[@pichfl]: https://github.com/pichfl
[turbo87/united-flarmnet]: https://github.com/Turbo87/united-flarmnet
[ember-cli/ember-cli-htmlbars]: https://github.com/ember-cli/ember-cli-htmlbars
[ember-learn/ember-release-bot]:
  https://github.com/ember-learn/ember-release-bot
[ember-learn/ember-website]: https://github.com/ember-learn/ember-website
[ember-learn/guides-source]: https://github.com/ember-learn/guides-source
[emberjs/rfcs-tooling]: https://github.com/emberjs/rfcs-tooling
[empress/bottled-ember]: https://github.com/empress/bottled-ember
[erlef/website]: https://github.com/erlef/website
[ezolenko/rollup-plugin-typescript2]:
  https://github.com/ezolenko/rollup-plugin-typescript2
[mainmatter/ast-workshop]: https://github.com/mainmatter/ast-workshop
[mainmatter/breethe-client]: https://github.com/mainmatter/breethe-client
[mainmatter/breethe-server]: https://github.com/mainmatter/breethe-server
[mainmatter/ember-error-route]: https://github.com/mainmatter/ember-error-route
[mainmatter/ember-hbs-minifier]:
  https://github.com/mainmatter/ember-hbs-minifier
[mainmatter/ember-hotspots]: https://github.com/mainmatter/ember-hotspots
[mainmatter/ember-intl-analyzer]:
  https://github.com/mainmatter/ember-intl-analyzer
[mainmatter/ember-promise-modals]:
  https://github.com/mainmatter/ember-promise-modals
[mainmatter/ember-simple-auth]: https://github.com/mainmatter/ember-simple-auth
[mainmatter/ember-test-selectors]:
  https://github.com/mainmatter/ember-test-selectors
[mainmatter/ember-workshop]: https://github.com/mainmatter/ember-workshop
[mainmatter/ember2-x-codemods]: https://github.com/mainmatter/ember2-x-codemods
[mainmatter/eslint-plugin-ember-concurrency]:
  https://github.com/mainmatter/eslint-plugin-ember-concurrency
[mainmatter/eslint-plugin-qunit-dom]:
  https://github.com/mainmatter/eslint-plugin-qunit-dom
[mainmatter/playbook]: https://github.com/mainmatter/playbook
[mainmatter/qunit-dom-codemod]: https://github.com/mainmatter/qunit-dom-codemod
[mainmatter/qunit-dom]: https://github.com/mainmatter/qunit-dom
[mainmatter/renovate-config]: https://github.com/mainmatter/renovate-config
[mainmatter/testem-gitlab-reporter]:
  https://github.com/mainmatter/testem-gitlab-reporter
[mainmatter/who-ran-me]: https://github.com/mainmatter/who-ran-me
[mansona/chris.manson.ie]: https://github.com/mansona/chris.manson.ie
[mansona/lint-to-the-future-eslint]:
  https://github.com/mansona/lint-to-the-future-eslint
[mtgred/netrunner]: https://github.com/mtgred/netrunner
[nickschot/ember-gesture-modifiers]:
  https://github.com/nickschot/ember-gesture-modifiers
[nickschot/ember-mobile-menu]: https://github.com/nickschot/ember-mobile-menu
[octoherd/.github]: https://github.com/octoherd/.github
[octoherd/cli]: https://github.com/octoherd/cli
[octoherd/create-octoherd-script]:
  https://github.com/octoherd/create-octoherd-script
[octoherd/octokit]: https://github.com/octoherd/octokit
[octoherd/script-setup-renovate]:
  https://github.com/octoherd/script-setup-renovate
[octokit/auth-oauth-user.js]: https://github.com/octokit/auth-oauth-user.js
[octokit/create-octokit-project.js]:
  https://github.com/octokit/create-octokit-project.js
[oscard0m/octoherd-script-remove-renovate-package.json]:
  https://github.com/oscard0m/octoherd-script-remove-renovate-package.json
[oscard0m/octoherd-script-update-action-version-in-workflows]:
  https://github.com/oscard0m/octoherd-script-update-action-version-in-workflows
[probot/.github]: https://github.com/probot/.github
[probot/talks]: https://github.com/probot/talks
[probot/twitter]: https://github.com/probot/twitter
[rrrene/credo]: https://github.com/rrrene/credo
[rust-lang/crates.io]: https://github.com/rust-lang/crates.io
[starbelly/erlang-companies]: https://github.com/starbelly/erlang-companies
[weglide/gliderlist]: https://github.com/weglide/GliderList

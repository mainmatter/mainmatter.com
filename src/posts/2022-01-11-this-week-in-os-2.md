---
title: "This week in Open Source at simplabs #2"
authorHandle: simplabs
tags: open-source
bio: "The simplabs team"
description:
  "A collection of work that our engineers have been carrying out in open-source
  in the past few weeks."
og:
  image: /assets/images/posts/2022-01-11-this-week-in-os-2/og-image.png
tagline: |
  <p>Our software engineers are all active members of the open-source community and enjoy collaborating on various projects. In this blog post, we have collected some of the work they have done the past week!</p>
image: "/assets/images/photos/ember-simple-auth.jpg"
imageAlt: "Screenshot of Ember simple auth"
---

## JavaScript

- [commitizen/cz-conventional-changelog]
  [#181](https://github.com/commitizen/cz-conventional-changelog/pull/181)
  feat(config): add 'extends' configuration option ([@oscard0m])
- [oscard0m/npm-snapshot]
  [#12](https://github.com/oscard0m/npm-snapshot/pull/12) fix(npm-snapshot):
  exit execution if stringified semver 'version' is undefined ([@oscard0m])
- [oscard0m/npm-snapshot]
  [#11](https://github.com/oscard0m/npm-snapshot/pull/11) docs(readme): format
  README.md ([@oscard0m])
- [oscard0m/npm-snapshot]
  [#10](https://github.com/oscard0m/npm-snapshot/pull/10) style(npm-snapshot):
  applied style (prettier) changes ([@oscard0m])
- [oscard0m/npm-snapshot] [#9](https://github.com/oscard0m/npm-snapshot/pull/9)
  ci(release): remove non-existing 'npm run build' step from release workflow
  ([@oscard0m])
- [oscard0m/npm-snapshot] [#8](https://github.com/oscard0m/npm-snapshot/pull/8)
  ci(package-lock): add missing package-lock ([@oscard0m])
- [oscard0m/npm-snapshot] [#7](https://github.com/oscard0m/npm-snapshot/pull/7)
  ci(release): add Release workflow via Github Action with Semantic Release
  ([@oscard0m])
- [oscard0m/npm-snapshot] [#6](https://github.com/oscard0m/npm-snapshot/pull/6)
  chore(package.json): update author of the project ([@oscard0m])
- [oscard0m/npm-snapshot] [#5](https://github.com/oscard0m/npm-snapshot/pull/5)
  chore(.gitignore): ignore .vscode folder ([@oscard0m])

## Ember.js

- [simplabs/ember-promise-modals]
  [#500](https://github.com/simplabs/ember-promise-modals/pull/500) Specify
  octane edition in package.json & add missing optional features ([@nickschot])
- [simplabs/ember-promise-modals]
  [#499](https://github.com/simplabs/ember-promise-modals/pull/499) Update
  ember-release scenario to use auto-import v2 ([@nickschot])

- [nickschot/ember-mobile-menu]
  [#216](https://github.com/nickschot/ember-mobile-menu/pull/216) add
  ember-keyboard v7 resolution to fix ember 4+ CI ([@nickschot])

- [simplabs/ember-intl-analyzer]
  [#447](https://github.com/simplabs/ember-intl-analyzer/pull/447) Add
  additional guard to check if at the top of the parent tree and tests
  ([@mikek2252])

- [mansona/ember-cli-notifications]
  [#328](https://github.com/mansona/ember-cli-notifications/pull/328) Breaking:
  Update container component ([@pichfl])
- [mansona/ember-cli-notifications]
  [#326](https://github.com/mansona/ember-cli-notifications/pull/326) BREAKING:
  Remove obsolete equals helper ([@pichfl])
- [mansona/ember-cli-notifications]
  [#325](https://github.com/mansona/ember-cli-notifications/pull/325) Breaking:
  Modernize and improve notification message component ([@pichfl])
- [mansona/ember-cli-notifications]
  [#324](https://github.com/mansona/ember-cli-notifications/pull/324) Replace
  overridable icon paths with overridable icon components ([@pichfl])
- [mansona/ember-cli-notifications]
  [#327](https://github.com/mansona/ember-cli-notifications/pull/327) move to
  field-guide ([@mansona])

- [empress/ember-cli-showdown]
  [#109](https://github.com/empress/ember-cli-showdown/pull/109) Add some basic
  Fastboot testing ([@mansona])
- [empress/ember-cli-showdown]
  [#108](https://github.com/empress/ember-cli-showdown/pull/108) feat: Import
  htmlSafe from @ember/template, not @ember/string. ([@mansona])

- [simplabs/ember-simple-auth]
  [#2350](https://github.com/simplabs/ember-simple-auth/pull/2350) Upgrade to
  qunit 5 ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2349](https://github.com/simplabs/ember-simple-auth/pull/2349) Fixed failing
  unit test - invalidate call revoke endpoint twice. Unit test did not validate
  it correctly. ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2348](https://github.com/simplabs/ember-simple-auth/pull/2348) Fixed quietly
  failing unit test because server returned nothing ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2345](https://github.com/simplabs/ember-simple-auth/pull/2345) Fixed failing
  unit test - ember/object get function was removed from source code so I have
  changed unit test accordingly ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2344](https://github.com/simplabs/ember-simple-auth/pull/2344) In some tests
  was thrown undefined. ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2343](https://github.com/simplabs/ember-simple-auth/pull/2343) Allow
  ember-release to fail ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2342](https://github.com/simplabs/ember-simple-auth/pull/2342) Fixed 3
  readonly tests. ([@candunaj])
- [simplabs/ember-simple-auth]
  [#2353](https://github.com/simplabs/ember-simple-auth/pull/2353) Fix
  ember-release + ember-beta build ([@marcoow])

- [empress/empress-blog-casper-template]
  [#50](https://github.com/empress/empress-blog-casper-template/pull/50) remove
  {{link-to}} calls using positional arguments ([@mansona])
- [empress/empress-blog]
  [#150](https://github.com/empress/empress-blog/pull/150) update
  ember-body-class ([@mansona])
- [empress/broccoli-static-site-json]
  [#64](https://github.com/empress/broccoli-static-site-json/pull/64) Support
  toc yaml ([@mansona])

- [mansona/ember-body-class]
  [#45](https://github.com/mansona/ember-body-class/pull/45) fix
  ember-body-class for fastboot initial render ([@mansona])

- [ember-learn/guides-source]
  [#1758](https://github.com/ember-learn/guides-source/pull/1758) Replaces
  EmberArray with tracked property in "Looping through lists" ([@locks])
- [ember-learn/guides-source]
  [#1753](https://github.com/ember-learn/guides-source/pull/1753) Ember 4.0
  preparation ([@locks])

- [emberjs/ember-string]
  [#309](https://github.com/emberjs/ember-string/pull/309) Fix deprecated import
  path ([@turbo87])
- [emberjs/ember-string]
  [#308](https://github.com/emberjs/ember-string/pull/308) Backport TravisCI to
  GitHub Actions migration ([@turbo87])
- [emberjs/ember-string]
  [#310](https://github.com/emberjs/ember-string/pull/310) Backport release-it
  integration ([@turbo87])

- [simplabs/ember-error-route]
  [#27](https://github.com/simplabs/ember-error-route/pull/27) Add support for
  custom rootURL values ([@turbo87])
- [simplabs/ember-error-route]
  [#26](https://github.com/simplabs/ember-error-route/pull/26) CI: Add deploy
  job ([@turbo87])
- [simplabs/ember-error-route]
  [#29](https://github.com/simplabs/ember-error-route/pull/29) package.json:
  Declare demoURL for EmberObserver ([@turbo87])
- [simplabs/ember-error-route]
  [#28](https://github.com/simplabs/ember-error-route/pull/29) GitHub Pages:
  Migrate to locationType: history ([@turbo87])

- [ember-cli/ember-exam]
  [#787](https://github.com/ember-cli/ember-exam/pull/787) ember-try: Fix mocha
  scenarios ([@turbo87])
- [ember-cli/ember-exam]
  [#775](https://github.com/ember-cli/ember-exam/pull/775) Delete unused
  herp-derp component ([@turbo87])
- [ember-cli/ember-exam]
  [#774](https://github.com/ember-cli/ember-exam/pull/774) Migrate dummy app
  templates to use angle bracket invocation syntax ([@turbo87])
- [ember-cli/ember-exam]
  [#769](https://github.com/ember-cli/ember-exam/pull/769) Drop support for
  Ember 3.19 and below ([@turbo87])
- [ember-cli/ember-exam]
  [#768](https://github.com/ember-cli/ember-exam/pull/768) Upgrade
  ember-cli-addon-docs dependency ([@turbo87])
- [ember-cli/ember-exam]
  [#766](https://github.com/ember-cli/ember-exam/pull/766) CI: Disable failing
  ember-release scenario ([@turbo87])
- [ember-cli/ember-exam]
  [#813](https://github.com/ember-cli/ember-exam/pull/813) Use
  assert.strictEqual() instead of assert.equal() ([@turbo87])

## crates.io

- [rust-lang/crates.io]
  [#4284](https://github.com/rust-lang/crates.io/pull/4284) crate.version: Fix
  downloads alias ([@turbo87])
- [rust-lang/crates.io]
  [#4276](https://github.com/rust-lang/crates.io/pull/4276) renovate: Adjust
  node package handling config ([@turbo87])
- [rust-lang/crates.io]
  [#4268](https://github.com/rust-lang/crates.io/pull/4268) Update
  ember-cli-fastboot to v3.2.0-beta.5 ([@turbo87])
- [rust-lang/crates.io]
  [#4267](https://github.com/rust-lang/crates.io/pull/4267) Update Node.js to
  v16.13.1 ([@turbo87])
- [rust-lang/crates.io]
  [#4266](https://github.com/rust-lang/crates.io/pull/4266) CrateSidebar: Fix
  class name ([@turbo87])
- [rust-lang/crates.io]
  [#4265](https://github.com/rust-lang/crates.io/pull/4265) models/version: Add
  missing fetch import ([@turbo87])
- [rust-lang/crates.io]
  [#4264](https://github.com/rust-lang/crates.io/pull/4264) controllers/index:
  Fix fetchData() return value ([@turbo87])
- [rust-lang/crates.io]
  [#4261](https://github.com/rust-lang/crates.io/pull/4261) Unpin and update
  transitive @ember/string dependency ([@turbo87])
- [rust-lang/crates.io]
  [#4257](https://github.com/rust-lang/crates.io/pull/4257) utils/license: Add
  support for parentheses ([@turbo87])
- [rust-lang/crates.io]
  [#4256](https://github.com/rust-lang/crates.io/pull/4256) Pin @ember/string
  dependency to v3.0.0 ([@turbo87])

## simplabs playbook

- [simplabs/playbook] [#173](https://github.com/simplabs/playbook/pull/173) add
  metric systems to the list of engineering tools ([@oscard0m])

[rust-lang/crates.io]: https://github.com/rust-lang/crates.io/
[ember-cli/ember-cli]: https://github.com/ember-cli/ember-cli/
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

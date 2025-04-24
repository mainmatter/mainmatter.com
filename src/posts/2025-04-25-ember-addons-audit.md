---
title: "Getting ready for Vite! The status of the top 100 Ember addons"
authorHandle: academierenards
tags: [ember, embroider, vite]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "Introducing the summary of the top 100 addons audit"
autoOg: true
tagline: |
  <p>
  Ember apps from version 3.28 to the latest can now build with Vite. Community addons must get ready for the change. How many of them are already V2? How many are still V1 but should be compatible with your Vite app? How many still require some work? And which ones rely too much on classic-build semantics and should be replaced with a different Vite-compatible solution? As part of the Mainmatter <a href="/ember-initiative/">Ember Initiative</a>, our team performed an audit of the most popular community addons to get a picture of where the community currently stands.
  </p>
---

Mainmatter started the [Ember Initiative](/ember-initiative/) and made Vite support our team's first goal. We released [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod) to help you get your app ready for Vite as easily as possible. One blocker you may encounter, though, relates to the addons you use. If your app depends on a classic addon incompatible with Vite, you will be stuck in the classic-build world.

To get an overview of how important the risk is for Ember developers to be blocked by classic addons, we audited all the top 100 addons on [Ember Observer](https://emberobserver.com/), and started to sort them out: Which ones are already v2 and fully compatible? Which classic ones should be compatible with Vite? Which ones need rework? And last but not least, which ones rely too much on classic-build semantics and should be abandoned in favor of a different solution?

This blog post presents the result of this audit, and we must say it is... very promising! 🎉

## We are halfway there

At the time of writing, about 56% of the most popular community addons provide a V2 format or a basic npm package solution. The community did a fantastic job bringing the whole ecosystem to the modern world! If your app depends on popular addons like `ember-concurrency`, `ember-page-title`, `ember-power-select`... fear no more, all these addons provide a V2 format and should continue to work the same way once you start building with Vite.

You can view the exhaustive list of the top-100 Ember addons that provided a V2 format or became basic npm packages last time the audit script was run (April 17th) on the GitHub issue [embroider-build/embroider#2288](https://github.com/embroider-build/embroider/issues/2288#issuecomment-2713639700).

💡 **Tip**: More community addons that don't belong to the top-100 may also have been converted to V2. If you want to check an addon metadata with only one command instead of searching for the repository, run `npm view <your-addon-name>@latest ember-addon` in a terminal. V2 addons have the metadata `version: 2`. If the command doesn't return anything, it might have been converted to a basic Vite-compatible npm package and is not an Ember-specific addon any more, or there might be a subtlety with the repository structure; double-check on GitHub.

## V1 addons may just work

Just because your app depends on a V1 addon doesn't mean you'll necessarily have a problem once you start building with Vite. This is because Embroider does its best to maintain compatibility under the hood. When your app builds, `@embroider/compat` tries to rewrite the V1 addons into Vite-compatible static packages, and unless something in your addon deeply relies on Ember classic semantics, it should work.

There is a bunch of V1 addons in the top 100 we don't particularly worry about, because they are used in the Vite app blueprint, or they have passing `embroider-optimized` tests, or we received positive feedback from developers saying they could get them to work with Vite. Some other addons are more uncertain because their CI doesn't run `embroider-optimized` or they seem to rely at least partially on Ember classic semantics. In any case, we will need help from the community to check if all these addons can be used seamlessly once you build with Vite.

That being said, the fewer v1 addons you have, the faster your initial build and rebuilds will be.

## The case of ember-test-selectors

[ember-test-selectors](https://github.com/mainmatter/ember-test-selectors) is an interesting example of how a classic addon can evolve. Its structure has been reworked to a monorepo that now provides two public packages:

- `ember-test-selectors` will remain a classic addon. Embroider rewrites it correctly, and it keeps working once you start building with Vite, so you don't need to care about it before your migration.

- `strip-test-selectors` is a new basic npm package that provides the two AST transforms `ember-test-selectors` relies on. If you want to start using `data-test-*` in your Ember Vite app or if you want to get rid of the compat step for performance, you can configure `strip-test-selectors` directly in your Babel config, and you no longer need `ember-test-selectors`.

## The case of FastBoot

FastBoot brings Server Side Rendering (SSR) to your Ember apps using the addon `ember-cli-fastboot`. When `ember-cli-fastboot` is installed in your Classic Ember app, it integrates with the express server that ember-cli provides and ships a SSR (server side rendered) version of your app during local development. The SSR build of your app can be very slightly different since it needs to run in a NodeJS environment, and ember-cli and fastboot manage those differences for you. Once you are ready to deploy your app you can use `fastboot-app-server` on the server side to host your app or prember to output a SSG (server side generated) version of your app.

To make a long story short: today, you can't migrate your FastBoot app to Embroider+Vite; the work needed to integrate fastboot with the modern build system hasn't been completed yet.

[Vite has its own way of bringing SSR to apps](https://vite.dev/guide/ssr.html#server-side-rendering-ssr), which modern apps should rely on. In the migration path considered by the [Ember Core Tooling Team](https://emberjs.com/teams/#the-ember-tooling-core-team), `ember-cli-fastboot` and `fastboot-app-server` would be deprecated in favour of using Vite SSR directly and there is a plan to generate a build that can be correctly consumed by `fastboot-app-server` for any team that wants to move to Vite but can't transition to Vite SRR yet. There are still blockers to set this migration path ready, though. For instance, one relates to module resolution in the Node environment; another relates to the local development part that depends entirely on the Ember-CLI Express server, which disappears completely with Vite because the dev server is the Vite dev server.

FastBoot migration path is currently not included in the Ember Initiative because other issues have a higher priority. However, we could include it if the Initiative receives enough support to make it possible. [Get in touch with Mainmatter](/contact/) if your company is highly interested in this issue.

## The case of Webpack

Webpack and Vite are both bundlers that web apps can rely on for similar purposes. If your app is a classic Ember app building with ember-cli and using ember-auto-import, or if it uses the previous version of Embroider (`@embroider/webpack`), then at least part of your build is being done by Webpack. That's why ember-auto-import and `@embroider/webpack` allowed you to customize the Webpack options (but didn’t give you full control).

The Ember community chose Vite as the default for new modern Ember apps, and running ember-vite-codemod to migrate to Vite will automatically remove `webpack` from your dependencies. If you were using a custom Webpack config through Embroider build options or ember-auto-import to perform actions on your build pipeline, you must rethink these functionalities. In general, there shouldn't be anything you do with Webpack that you can't achieve with Vite.

For instance, if you used Webpack to configure some CSS processing, you can refer to Vite documentation to [reimplement something equivalent](https://vite.dev/config/shared-options.html#css-postcss); or if you used Webpack to include Node.js polyfills browser-side as documented in [ember-auto-import README](https://github.com/embroider-build/ember-auto-import/tree/main/packages/ember-auto-import#global-is-undefined-or-cant-find-module-path-or-cant-find-module-fs), you'll need to rework this part, or look into new ways to add them via the Vite config. Though this is technically possible, note that [Vite's official documentation discourages this practice](https://vite.dev/guide/troubleshooting#module-externalized-for-browser-compatibility) because of the impact it has on the bundle size.

## Addons to remove and migration paths

`broccoli-asset-rev`, `loader.js`, `ember-cli-app-version`, `ember-cli-clean-css`, `ember-cli-dependency-checker`, `ember-cli-inject-live-reload`, `ember-cli-sri`, `ember-cli-terser`, `ember-template-imports`, and `webpack` are dependencies included in the classic app blueprint that are no longer used in Vite. If you use `ember-vite-codemod` to partially automate your migration, these dependencies will be automatically removed.

Additionally, a few classic addons rely too much on classic-build semantics and should be replaced with a different Vite-compatible solution. For each of these addons, our team made sure there is a migration path to point you at:

- `ember-fetch` behaves in a way that is incompatible with modern JavaScript tooling, including building with Vite. To remove ember-fetch dependency, check out the [Deprecate and Remove ember-fetch RFC](https://rfcs.emberjs.com/id/1065-remove-ember-fetch) and see recommended alternatives.

- `ember-composable-helpers` contains a "won't fix" Babel issue that makes it incompatible with Vite. The current way to solve this problem is to move from the original `ember-composable-helpers` to `@nullvoxpopuli/ember-composable-helpers`. Check out the first section of the repository's README: https://github.com/NullVoxPopuli/ember-composable-helpers.

- `ember-cli-mirage` doesn't work correctly with Vite. The recommendation is to move to `ember-mirage`. For guidance, check out https://github.com/bgantzler/ember-mirage/blob/main/docs/migration.md.

- `ember-css-modules` behavior is incompatible with Vite; you should migrate to a different solution to manage your CSS modules. The Mainmatter team worked out a recommended migration path that you can follow for a file-by-file migration to ember-scoped-css, which is compatible with Vite. Check out our [dedicated blog post](https://mainmatter.com/blog/2025/03/28/migrate-from-ember-css-modules/) on the migration path for more info.

- `ember-cli-typescript` is deprecated. The app blueprints combined with the `ember-cli-babel` configuration include everything you need to use TypeScript in your application. See [ember-cli-typescript README](https://github.com/typed-ember/ember-cli-typescript) to read about the migration path.

## Conclusion

Thanks to the Ember community's enthusiasm and hard work, most popular Ember addons are V2, or at the very least Vite-compatible once rewritten by Embroider: the path to Vite is wide open. As part of the Ember Initiative, our team provided you with many tools and migration guides you can rely on to bring your app to the modern world.

Do you rely on v1 addons that don't belong to the top 100? Would you like guidance on how to make them compatible with Vite or find a migration path like the one we built for ember-css-modules? If you'd like to help us help you, and improve Ember for the entire web, [support the Ember Initiative](/contact/), spread the word, and follow our progress on this blog.

---
title: "Migrating to ember-mirage: Modern MirageJS for Vite and Embroider"
authorHandle: nickschot
tags: [ember, mirage, mainmatter]
bio: "Nick Schot"
description: "Nick Schot explains how to migrate from ember-cli-mirage to a miragejs + ember-mirage setup supported by Vite"
tagline: "If you've been developing Ember applications with API mocking, you're likely familiar with ember-cli-mirage. ember-cli-mirage has been a corner-stone for writing representative tests that rely on a backend API. It allows you to create focused test scenarios with exactly the data you need for that test. Additionally it can be used to develop frontend features before the API even exists. But there's a problem: ember-cli-mirage doesn't work with Vite! As the Ember ecosystem continues to move toward modern build tooling with Embroider and Vite, we need a solution that brings MirageJS along for the journey. This blog post outlines a path forward to keep your MirageJS setup working in modern Ember applications."
autoOg: true
---

# MirageJS & ember-mirage

[MirageJS](https://miragejs.com) is the core library. At some point in the past this was extracted from ember-cli-mirage to its own library for framework independent use. [ember-mirage](https://github.com/bgantzler/ember-mirage) is a set of utilities that brings some of the benefits ember-cli-mirage provided. This means that for basic setup, you may not actually need it, but it provides some features that ember-cli-mirage used to provide that might make migrating a little easier.

## Prerequisites
This blog post is intended to be a step during a migration to Vite since we'll make use of `import.meta.glob`. This is a feature provided by Vite to allow glob imports of files. The steps can be taken at any point after, for example, running the [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod), or after migrating to Vite manually.

The blog post is written from a fresh-app perspective to make it clear what each part of the config does. Most of your actual Mirage related files can stay where they are and like they are. We're mostly going to rewrite the configuration.

If you're still on a Webpack/ember-auto-import based setup, there is an alternative migration path you could take. This, however, does require you to move all mirage files into the `app` folder, rather than the location in `/mirage` where it used to be with ember-cli-mirage. Webpack also does not support `import.meta.glob`, you can use Webpack's [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) combined with [ember-auto-import's `allowAppImports`](https://github.com/embroider-build/ember-auto-import?tab=readme-ov-file#app-imports) feature instead. If your goal is to migrate to a Vite app, this could be a way to get your updated configuration done and in place before the Vite migration, but know that you do need to at least replace all `require.context` statements with `import.meta.glob` instead.

## Let's get going

The first thing we'll do is add MirageJS and ember-mirage as dependencies.

```
pnpm install -D miragejs ember-mirage
```

With ember-cli-mirage, all mirage related files lived in a top-level `/mirage` folder. This is still where we'll keep our MirageJS configuration, factories, models and other modules.

In order to start our new setup we'll create a default server configuration which will serve as the entry point.

```javascript
// mirage/servers/default.js
import { createServer } from "miragejs";

export async function makeServer(config) {
  return createServer({
    ...config,
  });
}
```

One of the features in which ember-cli-mirage followed ember.js is a lot of files were placed in certain spots by convention. In order to provide a similar setup, we can use the `createConfig` utility provided by ember-mirage to load all our Mirage factories, fixtures, models, serializers and identity managers. We can use Vite's `import.meta.glob` to import all of them at once from their folders. The generated config can then be splatted into the config passed to the `createServer` call.

```javascript
// mirage/servers/default.js
import { createConfig } from "ember-mirage";

const mirageConfig = await createConfig({
  factories: import.meta.glob("../factories/*"),
  fixtures: import.meta.glob("../fixtures/*"),
  models: import.meta.glob("../models/*"),
  serializers: import.meta.glob("../serializers/*"),
  identityManagers: import.meta.glob("../identity-managers/*"),
});

export async function makeServer(config) {
  return createServer({
    ...mirageConfig,
    ...config,
  });
}
```

## Loading ember-data models

Another feature ember-cli-mirage provided was automatically inferring Mirage models from ember-data models, meaning MirageJS will infer model names and their relationships from the ember-data models. The configuration roughly matches the previous one. Note that `makeServer` accepts an optional `store` parameter to pass an ember-data store instance. When called from the application route during development, we pass the store directly. In tests, the store is looked up automatically from the test context.

```javascript
// mirage/servers/default.js
import { importEmberDataModels } from "ember-mirage/ember-data";
const emberDataModels = import.meta.glob("../../app/models/**/*");

export async function makeServer(config, _store) {
  // Look up the store from the test context if not provided
  let store =
    _store ??
    (await import("@ember/test-helpers"))
      .getContext()
      .owner.lookup("service:store");

  return createServer({
    /* ... */

    models: {
      ...importEmberDataModels(store, emberDataModels),
      ...config.models,
    },
  });
}
```

If you want the ability to pass custom models, be sure to also splat `config.models` in the way the above config does.

## Defining Mirage routes

Defining routes hasn't really changed. This happens within the `routes() { … }` function part of the `createServer` configuration object. In practice you'll likely want to define your routes in some folder structure for better manageability.

```javascript
// mirage/servers/default.js
import { createServer } from "miragejs";

export async function makeServer(config) {
  /* ... */

  return createServer({
    /* ... */
    routes() {
      this.get("users", function (schema) {
        return schema.users.all();
      });
    },
  });
}
```

## Integrating with the test setup

We've added a lot of configuration, but we don't actually boot MirageJS anywhere. Let's add a test helper that uses our previously created `makeServer` function. We'll also set the `environment` to `test`. This [configuration option](https://miragejs.com/docs/testing/application-tests/#the-test-environment) defaults to `development` which adds a default delay of 50ms to every request. Not something we want for tests! The config is also written in a way that allows you to pass a custom `makeServer` when setting up Mirage in a test.

```javascript
// /tests/helpers/setup-mirage.js
import { setupMirage as upstreamSetupMirage } from "ember-mirage/test-support";
import { makeServer } from "my-app/mirage/servers/default";
export function setupMirage(hooks, options) {
  options = options || {};
  options.createServer = options.makeServer || makeServer;
  upstreamSetupMirage(hooks, {
    ...options,
    config: {
      ...options.config,
      environment: "test",
    },
  });
}
```

## Trying it out!

We have everything we need to test the basics. Below is a quick unit test to verify that everything is working as intended.

```javascript
// tests/unit/example-test.js
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "../helpers/setup-mirage";

module("Unit | Mirage | example tests", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);
  test("it works!", async function (assert) {
    let mirageUser = this.server.create("user", { name: "Chris" });
    let store = this.owner.lookup("service:store");
    let emberDataUser = await store.findRecord("user", mirageUser.id);
    assert.strictEqual(mirageUser.name, emberDataUser.name);
  });
});
```

## What about using it in the app itself?

You may also want to use Mirage during development, for example to work on a feature before the backend API is ready. We can use `@embroider/macros` to conditionally start the Mirage server in a way that ensures it is completely excluded from production builds.

```javascript
// app/routes/application.js
import Route from "@ember/routing/route";
import { isDevelopingApp, isTesting, macroCondition } from "@embroider/macros";
import { service } from "@ember/service";
import config from "../config/environment";

export default class ApplicationRoute extends Route {
  @service store;

  async beforeModel() {
    if (macroCondition(isDevelopingApp() && !isTesting()) && config.useMirage) {
      let { makeServer } = await import("../mirage/servers/default");
      let server = await makeServer(
        {
          environment: "development",
          scenarios: await import("../mirage/scenarios"),
        },
        this.store
      );
      server.logging = true;
    }
  }
}
```

The `macroCondition` with `isDevelopingApp() && !isTesting()` ensures the entire block is tree-shaken from the production build. The dynamic `await import()` of the server configuration means none of your Mirage code will be bundled in production either. The additional `config.useMirage` flag gives you a way to toggle Mirage on and off during development via your environment configuration.

We pass the ember-data `store` to `makeServer` so that Mirage can generate its models from your ember-data models. We also import a scenarios module, which is simply a function that seeds the Mirage database with development data. Finally, enabling `server.logging` will log all intercepted requests and responses to the browser console, which is useful for debugging.

## Wrapping up

Migrating from ember-cli-mirage to ember-mirage requires a bit more manual setup, but the result is a Vite and Embroider compatible MirageJS configuration that stays close to the native MirageJS experience, with ember-mirage providing utilities to make migration easier for situations where there was a reliance on ember-cli-mirage.

It's worth stepping back and noticing what's happening here: we're using standard JavaScript features like dynamic `await import()`, top-level `await`, and Vite's `import.meta.glob` instead of legacy Ember-specific magic. The old ember-cli-mirage relied heavily on Ember conventions and build pipeline hooks to auto-discover files. The new setup replaces those "Emberisms" with vanilla JS and standard build tool features. This is only possible thanks to the significant progress the Ember ecosystem has made over the last couple of years with Embroider and the move to Vite. Modern Ember applications are much more aligned with the broader JavaScript ecosystem, making it easier to leverage standard tooling and reducing the framework-specific knowledge needed to be productive.

For more details, check out the [ember-mirage repository](https://github.com/bgantzler/ember-mirage).

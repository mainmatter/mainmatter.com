---
title: "From EmberData to WarpDrive (2/2): Using WarpDrive in Super Rentals Tutorial"
authorHandle: academierenards
tags: [ember, embroider, vite]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "The second post of the From EmberData to WarpDrive series, describing how SuperRentals tutorial was migrated to WarpDrive."
autoOg: true
customCta: "global/ember-cta.njk"
tagline: |
  <p>
  Managing data coming from the backend is a common challenge for any modern web app, regardless of the underlying technology. The Ember framework has long relied on EmberData, whose efficiency enables the development of ambitious apps. However, for some time now, the Ember community has been hearing about WarpDrive as "the new data management layer that will replace EmberData—for the better.
  <br>
  This blog post is the second one of the "Ember Data to WarpDrive" series. It aims to present how Super Rentals tutorial moved to WarpDrive LegacyMode.
  </p>
---

Ember 6.10 has been out for a couple of weeks now! The documentation for this version has one particularity: it's the first time the tutorial relies on `@warp-drive` packages to implement Super Rentals' data layer. To be more specific, Super Rentals now relies on WarpDrive "LegacyMode". In simple words, WarpDrive LegacyMode allows you to _use WarpDrive the way you used EmberData_. For instance, you can still have your `Model` classes as they used to be—only the import changes—, and WarpDrive is able to handle them correctly. This is why this is a very interesting step to reach to move from EmberData to WarpDrive.

Some of the changes between 6.9 and 6.10 tutorials are hidden in the new 6.10 blueprint though, so to be sure you don't miss anything and know how to perform this update in your own application, this blog post will guide you through updating Super Rentals to WarpDrive LegacyMode.

## Before starting, a few assumptions

To make this blog post a bit more generic and usable as a resource to help people, we won't start from [Super Rentals for 6.9](https://guides.emberjs.com/v6.9.0/tutorial/part-2/ember-data/) _exactly_. We will rather assume an older fictive Super Rentals:

- Currently using `ember-data 5.3`,
- That we would like to move to `@warp-drive 5.8`,
- Currently fetching data with `store.findAll` and `store.findRecord`, using the `JSONAPIAdapter`.

🐹 If your Store already relies on a `RequestManager` rather than `Adapter` (similar to what is showed in Super Rentals 6.9), then this blog post is still usable, but read (🐹 the hamsters) in the sections below.

## `ember-data` 5.3

EmberData 5.3 is the latest EmberData LTS in which the code has nothing to do with WarpDrive. If we look closely at our `.pnpm`folder, we notice the presence of `warp-drive+build-config` and `warp-drive+core-types`, but there's nothing in the code that uses something called "warp-drive".

Since we have managed our deprecations correctly, then we have an explicit `Store` service in the application, whose minimal possible implementation is just `export { default } from 'ember-data/store';`—but you may have something more complex in your own app.

## 1. Setup WarpDrive

When updating from `ember-data 5.3` to `ember-data 5.8`, EmberData internals now rely on WarpDrive packages, and a bunch of new deprecations appear. This one was introduced in EmberData 5.5:

```
⚠️ Using WarpDrive with EmberJS requires configuring it to use Ember's reactivity system. (...)
```

It essentially asks us to setup WarpDrive. To do so, we need to install new dependencies and change two files:

```sh
pnpm add -D @warp-drive/ember@5.8 @warp-drive/build-config@5.8
```

At the top of `app.js`:

```diff
+ import '@warp-drive/ember/install';
```

In `ember-cli-build.js`:

```diff
- module.exports = function(defaults) {
+ module.exports = async function(defaults) {
    const app = new EmberApp(defaults, {...});

+   const { setConfig } = await import("@warp-drive/build-config");
+   setConfig(app, __dirname, {
+     deprecations: {
+       DEPRECATE_TRACKING_PACKAGE: false,
+     },
+   });

    // ...
  };
```

## 2. Introduce the Legacy Store

Another type of deprecation was introduced in EmberData 5.7. This one is about the store APIs:

```
⚠️ store.[findAll|adapterFor|serializerFor...] is deprecated. Use store.request instead. (...) See https://docs.warp-drive.io/api/@warp-drive/core/build-config/deprecations/variables/ENABLE_LEGACY_REQUEST_METHODS for more details.
```

The right way to fix this deprecation is to replace the old store APIs with the new API `store.request`, as described in the following [cheat sheet](https://request-service-cheat-sheet.netlify.app/).

There are different approaches to implement `store.request` more or less progressively. One approach that was implemented in the official [Super Rentals for 6.9](https://guides.emberjs.com/v6.9.0/tutorial/part-2/ember-data/) relies on `@ember-data` packages and enables a progressive migration.

However, nowadays, my recommendation for an app like Super Rentals is to introduce the "legacy store" right away. Without going into the internals, the legacy store handles correctly both old APIs and the `request` API, so we can introduce the legacy store and keep our requests exactly as they are. This approach get us closer to a proper WarpDrive legacy mode with less intermediate steps.

In `app/services/store.js`:

```diff
- export { default } from 'ember-data/store';
+ import { useLegacyStore } from '@warp-drive/legacy';
+ import { JSONAPICache } from '@warp-drive/json-api';

+ export default useLegacyStore({
+   linksMode: false,
+   cache: JSONAPICache,
+   handlers: [],
+   schemas: [],
+ });
```

This relies on two more dependencies:

```sh
pnpm add -D @warp-drive/legacy@5.8 @warp-drive/json-api@5.8
```

(🐹 If your own app doesn't have the `[findAll|adapterFor|serializerFor...]` deprecation because it already uses the `store.request` API, you should still introduce the legacy store 👆 to properly enable WarpDrive legacy mode. Read the next section to understand what to do if you use a `RequestManager`.)

## 3. Use `store.request` API

Now that we have introduced our legacy store, we can progressively replace the old store API to fix the deprecations. Let's start with the `index.js` route in `app/routes/rental.js` that shows the list of available rentals.

In `app/routes/index.js`:

```diff
  import Route from '@ember/routing/route';
  import { service } from '@ember/service';
+ import { query } from '@warp-drive/utilities/json-api';

  export default class IndexRoute extends Route {
    @service store;

    async model() {
-     return this.store.findAll('rental');
+     const { content } = await this.store.request(query('rental'));
+     return content.data;
    }
  }
```

Which requires:

```sh
pnpm add -D @warp-drive/utilities@5.8
```

When we do this change, the app crashes. It returns a 404 on `GET http://localhost:4200/rentals` when trying to fetch the list of rentals— which sounds reasonable. Our resources are not at `[host]/rentals`, they are at `[host]/api/rentals.json`! WarpDrive no longer fetches resources at the right place, we are missing `api/` and `.json`. And these terms were added by... the adapter (`app/adapters/application.js`):

```js
import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = "api";
  buildURL(...args) {
    return `${super.buildURL(...args)}.json`;
  }
}
```

It's just that with the new `request` API, the adapter no longer works. We need a different way to configure the API namespace, and we also need to implement a request handler to define how requests are handled. ⚠️ This applies to the `request` API whatever you import it from `@warp-drive/utilities/json-api` or `@ember-data/json-api/request`. At some point you will face this through any migration path you follow.

(🐹 If you imported from `@ember-data/json-api/request`, it's time to move to `@warp-drive/utilities/json-api`. Same for all the imports coming next.)

### 3.1 Configure the API namespace

The API namespace can be configured in `app.js`:

```diff
  export default class App extends Application { ... }
  import '@warp-drive/ember/install';
+ import { setBuildURLConfig } from '@warp-drive/utilities/json-api';

  loadInitializers(App, config.modulePrefix);

+ setBuildURLConfig({
+   namespace: 'api',
+ });
```

Now, our 404 comes from `[host]/api/rentals`, we got our `api/` back!

### 3.2 Implement a request Handler

To get the `.json` extension back, we need a request handler; literally something that modifies _how the request should be handled_.

First, we need to implement a handler that adds the `.json` extension before passing over to the next handler—which will be the default request behavior in that case.

Second, we need to make our store use that custom handler properly. The legacy store's options include a `handlers` array that we can use for that purpose.

In `app/services/store.js`:

```diff
  import { useLegacyStore } from '@warp-drive/legacy';
  import { JSONAPICache } from '@warp-drive/json-api';

+ const JsonSuffixHandler = {
+   request(context, next) {
+     const { request } = context;
+     const updatedRequest = Object.assign({}, request, {
+       url: request.url + '.json',
+     });
+     return next(updatedRequest);
+   },
+ };

  export default useLegacyStore({
    linksMode: false,
    cache: JSONAPICache,
-   handlers: [],
+   handlers: [JsonSuffixHandler],
    schemas: [],
  });
```

Our Super Rentals app is now in a state where the list of rentals is fetched with the new `request` API, and the details of one rental still relies on the old store API. Both approach work together, so we can finish this migration at our own pace.

(🐹 If your own app was already using `store.request` with a `RequestManager` service, then the service loses the responsibility of the handlers since they are passed to the legacy store. In other words, to move from [Super Rentals for 6.9](https://guides.emberjs.com/v6.9.0/tutorial/part-2/ember-data/) to [Super Rentals for 6.10](https://guides.emberjs.com/v6.10.0/tutorial/part-2/ember-data/), we remove completely the `RequestManager` and we pass `JsonSuffixHandler` to the legacy store handlers directly.)

### 3.3 Finish the `store.request` migration

The Rentals route that displays the details of one rental now looks like this:

```diff
  import Route from '@ember/routing/route';
  import { service } from '@ember/service';
+ import { findRecord } from '@warp-drive/utilities/json-api';

  export default class RentalRoute extends Route {
    @service store;

    async model(params) {
-     return this.store.findRecord('rental', params.rental_id);
+     const { content } = await this.store.request(
+       findRecord('rental', params.rental_id)
+     );
+     return content.data;
    }
  }
```

And we can delete `app/adapters/applications.js`.

## 4. Import `Model` from `@warp-drive` packages

The last thing to do to claim we use WarpDrive LegacyMode is to replace the imports in our `Model` class:

```diff
- import Model, { attr, belongsTo } from '@ember-data/model';
+ import Model, { attr, belongsTo } from '@warp-drive/legacy/model';

  const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

  export default class RentalModel extends Model {
    @attr title;
    // ...
  }
```

Now all our legacy features are imported from `@warp-drive/legacy` rather that `@ember-data`. We can remove `ember-data` from the `package.json`. We now use WarpDrive LegacyMode 🎉

## Next steps & codemod

Relying entirely on WarpDrive with all the deprecation fixed is a great migration step to move from EmberData to WarpDrive.

To go further and implement WarpDrive LegacyMode in the strictest sense, we could replace our `Model` classes with new WarpDrive `Schema`, relying on `@warp-drive/legacy/model/migration-support`.

A codemod is currently under development to migrate Ember applications to legacy mode. This codemod is expected to include adding WarpDrive packages, configuring them for use, and migrating `Model` classes to `Schema`.

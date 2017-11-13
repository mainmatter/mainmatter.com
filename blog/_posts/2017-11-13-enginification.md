---
layout: article
section: Blog
title: Enginification
author: "Clemens Müller"
github-handle: pangratz
twitter-handle: pangratz
---

We recently improved the initial load time of an Ember.js app for mobile
clients, by using [Ember Engines](http://ember-engines.com/) and extracting
functionality out of the app. In this blog post we're going to show how we
extracted an engine out of an existing app and discuss some smaller issues we
ran into along the way and how we solved them. So let's dive right in!

<!--break-->

### Attack plan

Ember.js v2.14, 39 routes, 28 services, 77 components

The generated assets have the following sizes and time to first render is Xs.

|-------------|--------------------------------|
| Asset       | Size                           |
|-------------|--------------------------------|
| `app.js`    | 627.03 KB (117.22 KB gzipped)  |
| `vendor.js` | 1.51 MB (342.87 KB gzipped)    |
| `app.css`   | 104.31 KB (19.25 KB gzipped)   |
|-------------|--------------------------------|

The app itself contains a flow, where the user enters origin and arrival
stations, selects departure and return dates and defines passengers. After
search is hit, the results are shown, a specific connection is chosen, details
like seating preference are entered and passenegr details are entered, the
payment is processed and at the end, the details of the booked trip are shown
and the purchased tickets can be downloaded.

When a user loads the app, the first thing is to specify the search parameters.
There is no need for loading everything after the search screens. That's why we
started to optimize the initial load times by extracting all of the not
initially needed functionality - from now on called booking flow - into an
engine.


### Extract common stuff used in app and the engine

Since the main app and booking flow will have some overlap, an in-repo addon
with common components and styles is created:

```sh
ember generate in-repo-addon common
```

After the addon is created, we want to move common components and helpers into
the addon. Let's look at the `loading-indicator` component: it shows a loading
animation of 3 dots, which will definitely be used in the host app and the
engine:

```sh
ember generate component loading-indicator --in-repo common

# move existing component definitions to common in-repo addon
git mv app/components/loading-indicator.js \
       lib/common/addon/components/

git mv app/templates/components/loading-indicator.hbs \
       lib/common/addon/templates/components/

# add re-export of the addons' component so it is added to the app directory
git add lib/common/app/components/loading-indicator.js
```

Since the component is now located within the `addon` folder, we need to modify
`lib/common/addon/components/loading-indicator.js` so the correct layout is used:

```js
import layout from '../templates/components/loading-indicator';

export default Component.extend({

  // this is needed so the template within addon/templates/components is used
  layout,

  // previous code of the component

});
```

Apart from common components and helpers,
[`ember-cli-sass`](https://github.com/aexmachina/ember-cli-sass) is used for
styling: there are some common definitions for colors, font sizes and so on, as
well as mixins and also the style definitions for the common components
themselves.

So the corresponding files are moved to the in-repo addon as well. Why we're
putting them within `lib/common/app/styles/common/...` will be more clear once
we import them in the engine:


```sh
git mv app/styles/vars.scss \
       lib/common/app/styles/common/

git mv app/styles/colors.scss \
       lib/common/app/styles/common/

git mv app/styles/mixins/button.scss \
       lib/common/app/styles/common/

git mv app/styles/components/loading-indicator.scss \
       lib/common/app/styles/common/components/
```

Apart from this, we also need to create a file which includes all the styles
from the common components and helpers. By this all the styles from the
`common` addon are included in the hosting app:

```scss
// lib/common/app/styles/common.scss

@import "common/components/loading-indicator";
```

Within the app we import the style definitions for the common addon, so all the
styles for the components are included.

```scss
// app/styles/app.scss

@import "common";
```

After all that is done, we now have all common components and helpers, as well
as common style definitions moved into the addon. The next step is to finally
create the engine, which will contain most of the application code.


### Move stuff into engine

An engine is basically an Ember.js addon, so there is no restriction of using
it as an in-repo addon as well:

```sh
ember generate in-repo-addon booking-flow
```

After that, setting up the in-repo engine according to [the guides](http://ember-engines.com/guide/creating-an-engine)
is pretty straight forward. At the end of that we have an engine, located at
`lib/booking-flow`, so now it's time to move stuff out of `app/` into it.

The first thing we want to do is to depend on the `common` in-repo addon, so we
can re-use the common stuff within the engine. Let's take a look at
`lib/booking-flow/package.json`:

```json
{
  "name": "booking-flow",

  "dependencies": {
    "ember-cli-htmlbars": "*",
    "ember-cli-babel": "*"
  },

  "ember-addon": {
    "paths": [
      "../common"
    ]
  }
}
```

After that we can start to move all the routes, components, services which are
only used within the booking-flow engine into the corresponding folders within
`lib/booking-flow/addon/`. The nice thing about ember engines is that they
don't introduce any new concepts in terms of location of the files. So a simple
`git mv` does the trick.

Within the app we are using some npm dependencies via
[ember-browserify](https://github.com/ef4/ember-browserify). Since those
dependencies are not used in the app but within the engine now, we had to
mitigate this as described [in ember-browserify's README](https://github.com/ef4/ember-browserify#using-ember-browserify-in-addons).
So the dependencies are included properly, we need to import them in the engine
from somwhere within `lib/booking-flow/app/`:

```js
// lib/booking-flow/app/index.js

import mailcheck from 'npm:mailcheck';
import creditCardType from 'npm:credit-card-type';
```

The booking-flow addon should use the same style definitions as the hosting
app, so we'd like to import the common style definitions within the
booking-flow engines styles. For the imports to work properly, we need to
add the path to the `common` addon to the `sassOptions` of the engine:

```js
// lib/booking-flow/index.js
const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
  name: 'booking-flow',

  lazy: {
    enabled: false
  },

  sassOptions: {
    includePaths: ['lib/common/app/styles']
  }
}
```

By this we can import the variables, colors and mixins in the engines' style
defitions. And since we namespaced the files in the `common` addon under the
`common/` folder, we get distinct import paths:

```scss
// lib/booking-flow/addon/styles/components/booking-button.scss

@import "common/colors";
@import "common/mixins/button";

.booking-button {
  @include button-rounded-mixin;

  color: $color-primary;
  border-color: $color-secondary;
}
```

So now we have moved all the non-essential logic not needed at the beginning of
the app into an in-repo engine. As a next optimization, let's make use of a
nifty feature of ember engines…

### Make it lazy

After we extracted the `common` addon and the `booking-flow` engine, we'e ready
to specify the engine as lazy. This is as hard work as switching a boolean:

```js
// lib/booking-flow/index.js
const EngineAddon = require('ember-engines/lib/engine-addon');

module.exports = EngineAddon.extend({
  name: 'booking-flow',

  lazy: {
    // that was easy
    enabled: true
  },

  sassOptions: {
    includePaths: ['lib/common/app/styles']
  }
}
```

And é voila: we now have 3 more separate assets, which are loaded on demand
once we navigate into a route within the engine. Since the original assets only
contain the crucial logic, they have shrunken in size as well:

|--------------------------|--------------------------------|------------------------------|
| Asset                    | Before                         | After                        |
|--------------------------|--------------------------------|------------------------------|
| `app.js`                 | 627.03 KB (117.22 KB gzipped)  | 364.78 KB (76.98 KB gzipped) |
| `vendor.js`              | 1.51 MB (342.87 KB gzipped)    | 1.32 MB (317.71 KB gzipped)  |
| `app.css`                | 104.31 KB (19.25 KB gzipped)   | 42.8 KB (8.94 KB gzipped)    |
|--------------------------|--------------------------------|------------------------------|
| `booking-flow.js`        |                                | 309.18 KB (52.5 KB gzipped)  |
| `booking-flow-vendor.js` |                                | 285.58 KB (46.87 KB gzipped) |
| `booking-flow.css`       |                                | 46.36 KB (8.13 KB gzipped)   |
|--------------------------|--------------------------------|------------------------------|

### Conclusion

- in-repo addon for common styles/components/helpers
- in-repo engine for non-critical stuff
- app/ containing everything crucial for landing page
- reduced initial asset sizes

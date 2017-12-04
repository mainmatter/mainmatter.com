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

### Status quo

The Ember.js app is a mobile client for searching and booking train tickets
with multiple carriers in Europe. The basic flow through the app is as follows:
a user enters an origin and arrival station and specifies the dates and
companions of the journey. After a search is initiated the results are shown, a
specific trip is chosen, details like seating preference and passenger details
are entered, the payment is processed and at the end, the details of the booked
trip are shown and the purchased tickets can be downloaded.

At the moment Ember.js v2.14 is used and the app has 39 routes, 28 services, 77
components, 24 models which result in the following asset sizes:

|-------------|--------------------------------|
| Asset       | Size                           |
|-------------|--------------------------------|
| `app.js`    | 627.03 KB (117.22 KB gzipped)  |
| `vendor.js` | 1.51 MB (342.87 KB gzipped)    |
| `app.css`   | 104.31 KB (19.25 KB gzipped)   |
|-------------|--------------------------------|

Taken from the [Ember Engine RFC](https://github.com/emberjs/rfcs/blob/master/text/0010-engines.md):

> Engines allow multiple logical applications to be composed together into a
> single application from the user's perspective.

When a user loads the app, the first thing is to specify the search parameters.
There is no need for all the functionality after a search is initiated. That's
why we started to optimize the load times by extracting all of the not
initially needed functionality into an Ember Engine, resulting in a reduced
bundle size of the initially needed assets.

### Extract common stuff used in app into an addon

One fundamental design of engines is that they are isolated from the hosting
app. It is possible to pass in services but apart from that, engines don't have
acces to the hosting app.
In order for components, helpers and styles to be reused, those common
functionality needs to be put into an addon, which then the app and the engine
depend on.

We're using an in repo addon for that:

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
we `@import` them in the engines' style definitions:


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

An engine is basically an Ember.js addon. Since the engine won't be reused
within another application, we decided to go with the in-repo solution for the
engine as well:

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
`lib/booking-flow/addon/`. The nice thing about Ember Engines is that they
don't introduce any new concepts in terms of location of the files. So a simple
`git mv` does the trick.

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
nifty feature of Ember Engines…

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

And et voilà: we now have 3 more separate assets, which are loaded on demand
once we navigate into a route within the engine. Since the initial assets only
contain the essential logic needed for the search, they have shrunken in size
as well:

|--------------------------|--------------------------------|------------------------------|
| Asset                    | Before                         | After                        |
|--------------------------|--------------------------------|------------------------------|
| `app.js`                 | 627.03 KB (117.22 KB gzipped)  | 375.01 KB (78.23 KB gzipped) |
| `vendor.js`              | 1.51 MB (342.87 KB gzipped)    | 1.6 MB (364.5 KB gzipped)    |
| `app.css`                | 104.31 KB (19.25 KB gzipped)   | 58.65 KB (12.17 KB gzipped)  |
|--------------------------|--------------------------------|------------------------------|
| `booking-flow.js`        |                                | 290.47 KB (48.48 KB gzipped) |
| `booking-flow-vendor.js` |                                | 117 B (127 B gzipped)        |
| `booking-flow.css`       |                                | 45.24 KB (7.97 KB gzipped)   |
|--------------------------|--------------------------------|------------------------------|

### Conclusion

We created an in-repo addon for commonly used components, helpers and style
definitions. After that, everything which is not needed for the initial search
screen has been moved into an in-repo engine. This helped us reduce the size of
the initially served assets.

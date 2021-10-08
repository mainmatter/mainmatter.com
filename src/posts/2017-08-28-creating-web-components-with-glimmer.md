---
title: Creating Web Components with Glimmer
authorHandle: jjordan_dev
bio: "Senior Frontend Engineer, Ember Learning core team member"
description:
  "Jessica Jordan explains what web components (aka custom elements) are and
  shows how they can be built using Glimmer.js."
tags: ember
---

At
[this year's EmberConf the Ember core team officially announced](https://youtu.be/TEuY4GqwrUE?t=58m43s)
the release of [Glimmer](https://glimmerjs.com/) - a light-weight JavaScript
library aimed to provide a useful toolset for **creating fast and reusable UI
components**. Powered by the already battle-tested Ember-CLI, developers can
build their Glimmer apps in an easy and efficient manner as they already came to
love building applications in Ember.js before.

<!--break-->

In addition to building standalone Glimmer applications, the library allows the
creation of components **according to the Custom Elements v1 specification**,
making it possible to build native web components which can be reused across all
kinds of front end stacks.

## What's in the Custom Elements v1 specification

The **Custom Elements spec** describes a technology which is - alongside of HTML
templates, Shadow DOM and HTML imports - an integral part of the
[current Web Component specification](https://www.w3.org/wiki/WebComponents/).
The Custom Elements spec describes capabilities for creating custom HTML
elements which can be used just like native HTML elements: `<my-customelement>`.

The
[current version of this specification](https://www.w3.org/TR/custom-elements/)
defines a `CustomElementRegistry` interface global which is available as the
`customElements` global in the browser. Custom elements are based on extensions
of the native `HTMLElement` base class:

```js
class CustomElementClass extends HTMLElement {
  // ...
}
```

The `CustomElementRegistry`'s `define` method can subsequently be used to
register custom elements, e.g. a custom element named `my-customelement`, would
be registered as follows:

```js
class CustomElementClass extends HTMLElement {
  // ...
}

customElements.define("my-customelement", CustomElementClass);
```

Finally, a custom element that has been registered via the
`CustomElementRegistry` can simply be used anywhere in HTML like any other tag:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Custom Element Demo</title>
  </head>
  <body>
    <my-customelement></my-customelement>
    <script src="/path/to/script/registering/custom-element.js"></script>
  </body>
</html>
```

Being able to encapsulate functionality this way and to be able to reuse it via
HTML markup is powerful for several reasons:

First, it enables usage of these components **beyond the boundaries of a single
front-end tech stack**, including the diverse set of client-side JavaScript
frameworks out there. Imagine being able to develop a menu header once and to
reuse it across all the different applications that are built in the scope of
your project, no matter if these applications were built upon React or Ember.
This also furthers even greater efforts to create well-maintained and highly
flexible widgets, not only on a project's or company's scale, but also in terms
of open-source as an even greater community of developers will be interested in
creating and using that e.g. one well-built `date-picker` component. Imagine if
the community behind the `ember-power-datepicker`, `react-datepicker`,
`angular-datepicker` and others could funnel their work into creating one
component that is of great benefit to all of these JavaScript communities at
once.

Second, the **standalone and self-contained** nature of web components creates
an API, that is not only straight-forward to use, but is also easy to reason
about; a well-structured web component will bring in all the dependencies needed
for its core functionality and will be configured - if needed at all - with
string based HTML attributes alone - making the final **mark up** very
**descriptive**. Advanced users will still be able to configure additional, more
specific functionality, as e.g. event listeners, via JavaScript themselves on
top of that.

Third, using web components is very easy as only **knowledge of the HTML markup
language is required** to do so. Using the basic and likely most well-known
language of the web alone, it **empowers an even larger community of
developers** to build their websites and web apps with and upon web components.

Let’s now dive into how we can create our own custom elements using Glimmer.

## Glimmer Web Component Example: A Reusable Open Street Map

A common use case for a reusable component is the interactive view of a street
map which usually can be embedded into websites and apps quickly with some
configuration using services like the Google Maps API or Leaflet. What if we
could create our own custom element that can simply be shared and reused using
HTML alone?

In the following we will **create a simple street map** based on
[Leaflet.js](http://leafletjs.com/) which can be re-used as such a custom
element in any other application or static website:

![Screenshot of Final Glimmer Map Component Example - Open Street Map View Centered on Munich](/assets/images/posts/2017-08-30-creating-web-components-with-glimmer/glimmer-map-screenshot-final.jpg#@1200-2400)

You can also check out the project on
[Github](https://github.com/jessica-jordan/glimmer-map).

### Starting a new Glimmer Web Component Project

To get started with an initial, running project setup, we will be using
[Ember CLI](https://ember-cli.com/) for scaffolding and configuration of our
Glimmer app. From `ember-cli@2.14.0` onwards, we can get started to create a
Glimmer-backed web component by using the `ember new` generator, the
[respective glimmer blueprint](https://github.com/glimmerjs/glimmer-blueprint)
and the `--web-component` flag:

```bash
ember new glimmer-map -b @glimmer/blueprint --web-component
```

generating the needed scaffolding for our first Glimmer app. As soon as the
Glimmer app is booted up via a simple `ember serve` and we navigate to the
typical `http://localhost:4200`, we will find that our first component project
is already rendered with a "Welcome to Glimmer!" headline:

![Screenshot of First Page of a New Glimmer App - Headline: Hello Glimmer!](/assets/images/posts/2017-08-30-creating-web-components-with-glimmer/glimmer-map-startup.png#@1200-2400)

Let's have a look at our project's file structure as well; following the new
folder structure planned out in the
[module unification RFC](https://github.com/emberjs/rfcs/pull/143) we can
already find our `component.ts` and `template.hbs` files for creating our
component co-located in the same directory below the `src` directory:

```
src
├── index.ts
├── main.ts
├── ui
│  ├── components
│  │   └── glimmer-map
│  │       ├── component-test.ts
│  │       ├── component.ts
│  │       └── template.hbs
│  ├── index.html
│  └── styles
│    └── app.scss
└── utils
  └── test-helpers
    └── test-helper.ts
```

Having a closer look at the app setup in
`glimmer-web-component/src/initialize-custom-elements.ts`, we can see how the
Glimmer app is started up and rendered as a custom element. Under the hood,
Glimmer’s `renderComponent` API is taking care of initial setup and rendering of
the component into the aforementioned placeholder in the DOM and the
`initializeCustomElements` API for registering the component as a native custom
element:

```ts
function initializeCustomElement(app: Application, name: string): void {
  // ...
  GlimmerElement.prototype = Object.create(HTMLElement.prototype, {
    // ...
    connectedCallback: {
      value: function connectedCallback(): void {
        // ...

        app.renderComponent(name, parent, placeholder);

        whenRendered(app, () => {
          let customElement = this as Element;
          let glimmerElement = placeholder.previousElementSibling;

          // ...
          assignAttributes(customElement, glimmerElement);
        });
      },
    },
  });

  window.customElements.define(name, GlimmerElement);
}
```

The final line makes use of the `CustomElementRegistry`'s `define` method to
register the `GlimmerElement` class as a custom element, just as we expect it
from the Custom Elements specification. Interesting to note here as well is the
call to the `assignAttributes` method, ensuring that any top-level attributes
defined on our custom element are later on also mapped to attributes on our
rendered Glimmer component.

So, after having that quick dive into how our component is spun up in Glimmer,
let’s get started developing it:

### Developing a Web Component with Glimmer's API

So far the blueprint for our main component module has already been setup by
Ember CLI's generator. The class used for generating our `glimmer-map` component
is now defined in `src/ui/components/glimmer-map/component.ts`:

```ts
// src/ui/components/glimmer-map/component.ts
import Component from "@glimmer/component";

export default class GlimmerMap extends Component {}
```

As we would like to create a map based on `Leaflet.js`, let's also get that
dependency installed in our project:

```bash
yarn add --dev leaflet
```

Similar to many other npm packages that you will find out there, the Leaflet
dependency exports its internals via **the CommonJS module** syntax. Since the
[glimmer-application-pipeline](https://github.com/glimmerjs/glimmer-application-pipeline)
only supports the import of modules following the ES6 syntax out of the box, we
can make ends meet by configuring rollup in our `ember-cli-build.js` as
[also seen in the glimmer-application-pipeline documentation](https://github.com/glimmerjs/glimmer-application-pipeline#importing-commonjs-modules)
and install the `rollup-plugin-node-resolve` and `rollup-plugin-commonjs`
dependencies:

```bash
yarn add --dev rollup-plugin-node-resolve
yarn add --dev rollup-plugin-commonjs
```

```js
// ember-cli-build.js

"use strict";

const GlimmerApp = require("@glimmer/application-pipeline").GlimmerApp;
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

module.exports = function (defaults) {
  let app = new GlimmerApp(defaults, {
    rollup: {
      plugins: [
        resolve({ jsnext: true, module: true, main: true }),
        commonjs(),
      ],
    },
  });

  return app.toTree();
};
```

This finally allows us to import our `leaflet` dependency like so:

```ts
// src/ui/components/glimmer-map/component.ts
import Component from "@glimmer/component";
import L from "leaflet";

export default class GlimmerMap extends Component {}
```

Now for creating and rendering the map, let's use the component's
`didInsertElement` lifecycle hook to ensure that the Glimmer component has been
inserted into the DOM already before the map instance is created and rendered:

```ts
// src/ui/components/glimmer-map/component.ts
import Component, { tracked } from "@glimmer/component";
import L from 'leaflet';

export default class GlimmerMap extends Component {
  didInsertElement() {
    this.createMapInstance();
    this.renderMap();
  }

  createMapInstance()
    const element = this.element.querySelector('#map');
    const map = L.map(element).setView([41.08, 11.068], 12);;
    this.map = map;
  }

  renderMap() {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(this.map);
  }
}
```

Also, let's add the needed markup into our component's template:

```hbs
{% raw %}
// src/ui/components/glimmer-map/template.hbs
<div class="glimmer-map">
  <div id="map"></div>
</div>
{% endraw %}
```

With this setup, our map already renders for the map points set intially:

![Screenshot of Open Street Map View of First Pass on the Glimmer Map Component](/assets/images/posts/2017-08-30-creating-web-components-with-glimmer/glimmer-map-screenshot.jpg#@1200-2400)

We also aim to make our map respond to user input. Specifically, we would like
to be able to set the marker to different locations on the map using a property
for the longitude (`lon`) and the latitude (`lat`) easily. To allow any property
changes to be reflected in the component's DOM, we can make use of the
`@tracked` decorator:

```ts
// src/ui/components/glimmer-map/component.ts
export default class GlimmerMap extends Component {
  @tracked
  lon: number = 11.602;

  @tracked
  lat: number = 48.1351;
  // ...
}
```

Anytime there is a change to one of the tracked properties' values, a re-render
of the component with a newly updated DOM will follow. And promote the changes
to these properties via actions by updating our template

```hbs
{% raw %}
<!-- src/ui/components/glimmer-map/template.hbs -->
<div class="glimmer-map">
  <div id="map"></div>
  E: <input class="x-coord" type="number" step="0.0001" value={{lon}} oninput={{action setView}}/>
  N: <input class="y-coord" type="number" step="0.0001" value={{lat}} oninput={{action setView}} />
</div>
{% endraw %}
```

and the respective `component.ts` file:

```ts
// src/ui/components/glimmer-map/component.ts
export default class GlimmerMap extends Component {
  @tracked
  lon: number = 11.602;

  @tracked
  lat: number = 48.1351;

  //...
  setView() {
    this.lon = this.element.getElementsByClassName("x-coord")[0].value;
    this.lat = this.element.getElementsByClassName("y-coord")[0].value;
    this.map.setView([this.lat, this.lon], 12);
  }
}
```

With this we are already done and can get started with distributing our
component.

## Reusing Glimmer components as custom elements

As mentioned in the beginning of this article, the current blueprint for Glimmer
web components comes with a wrapper for being able to package and reuse our
Glimmer components as custom elements. To **create the assets** needed for
reusage, let’s build those like we are already used to when building Ember apps:

```bash
ember build --production
```

This will store all the assets needed for reusing our custom element in the
`/dist` directory of the project. For our example, only the `app.js` file has to
be copied to be reused in our target app where we would like to use the
`glimmer-map` web component. Adding in the external stylesheet for the styles of
our map, as well as a
[polyfill for ensuring cross-browser support for all custom element features](https://github.com/webcomponents/webcomponentsjs)
finalizes our example:

```html
// your/other/app/template/or/plain/html/page.html
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
      integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
      crossorigin=""
    />
    <script src="/assets/webcomponentsjs/webcomponents-lite.js"></script>
  </head>
  <body>
    <glimmer-map></glimmer-map>
    <script src="app.js"></script>
  </body>
</html>
```

And finally, we can see our Glimmer-based street map being rendered just as seen
below:

<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.8/webcomponents-lite.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
  integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ==" crossorigin=""/>
<glimmer-map height="300"></glimmer-map>
<script src="/assets/posts/2017-08-30-creating-web-components-with-glimmer/glimmer-map.js"></script>

## And the Glimmer Component story is not over yet

Many more interesting developments are upcoming around Glimmer and the
[glimmer-component](https://github.com/glimmerjs/glimmer-component) and
[glimmer-web-component](https://github.com/glimmerjs/glimmer-web-component)
modules specifically. For further reading, please check out another great
discussion about the implementation of upcoming APIs according to the web
component specification on
[here](https://github.com/glimmerjs/glimmer-web-component/issues/19), check out
[my talk on current state of web components and Glimmer’s place in it](https://www.youtube.com/watch?v=OzFgDBJcWuU)
and stay tuned for our future blog post on testing Glimmer components.

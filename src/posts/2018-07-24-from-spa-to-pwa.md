---
title: "From SPA to PWA"
authorHandle: marcoow
bio: "Founding Director of simplabs, author of Ember Simple Auth"
description:
  "Marco Otte-Witte goes over the characteristics of progressive web apps and
  shows how to make the next step from a SPA to a PWA."
tags: javascript
og:
  image: /assets/images/posts/2018-07-24-from-spa-to-pwa/og-image.png
---

Progressive Web Apps are the next level of browser based applications. While
Single Page Apps (SPAs) have already meant a giant leap forward, PWAs are taking
things even one step further. They offer a rich user experience that parallels
what users know and expect from native apps and combine that with the benefits
that browser based applications provide. In this post, we'll look at how to turn
a Single Page App into a Progressive Web App.

<!--break-->

## Breethe

Throughout this post, we will use [Breethe](https://breethe.app) as an example.
Breethe is a Progressive Web App that gives users quick and easy access to air
quality data for locations around the world. Pollution and global warming are
getting worse rather than better and having access to data that shows the depth
of the situation is the first step for everyone to question their decisions and
maybe change a few things in their daily lives.

![Video of the Breethe PWA](/assets/images/posts/2018-07-24-from-spa-to-pwa/breethe-video.gif)

The application is [open source](https://github.com/simplabs/breethe-client) and
we encourage everyone interested to look through the source for reference. To
learn more about how we built Breethe with [Glimmer.js](http://glimmerjs.com),
refer to the
[previous post in this series](/blog/2018/07/03/building-a-pwa-with-glimmer-js).
None of the contents in this post are specific to Glimmer.js in any way though,
but all generally applicable to all frontend stacks.

## Progressive Web Apps

In short, Progressive Web Apps are **web apps that look and behave like native
apps**. While the idea of building apps with web technologies has been around
for a long time, it never really took off until recently. In fact, Steve Jobs
himself introduced the idea at WWDC 2007, just shortly after the unveiling of
the orignal iPhone:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/y1B2c3ZD9fk?start=4451" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Unfortunately that idea was one of the few of Jobs' that never really took off.
In fact, Apple released the first native SDK for the iPhone in 2008. That change
in strategy lead to a huge market for native mobile apps and played a
significant role in mobile devices becoming ever more ubiquitous over the past
decade.

While native apps enable great things and previously unforeseen use cases, they
come with some drawbacks. They generally
[show high conversion rates](https://jmango360.com/wiki/mobile-app-vs-mobile-website-statistics/)
which is the main reason why marketing departments keep pushing for them. On the
downside though, they have some significant drawbacks, the main one being that
apps have to be downloaded and installed which can be a significant effort for
users for several reasons (ultimately leading to the question of how many
potential users are lost before they even install the app where they then
**could** have been successfully converted):

- users that are on the mobile website already, when asked to install the app,
  need to leave that website, go to the app store, download the app and continue
  through the installation process
- once the app is installed, all input that potentially was made on the website
  before is lost and needs to be restored besides users potentially needing to
  login in the app again
- native apps are
  [relatively large on average](https://sweetpricing.com/blog/2017/02/average-app-file-size/),
  leading to long download times which are particularly painful on less reliable
  mobile connections

In contrast, **web apps are easily accessible via the browser** without forcing
users to go through an app store and installation process and load almost
instantaneously - if done right, even on unreliable mobile connections.

Another advantage of native apps is mostly a historic one now. Historically,
native apps were able to offer a better user experience both in terms of the
purely visual experience and also in terms of features. With the quickly
evolving web platform and capabilities of modern browsers, this is no longer the
case though and **web apps are now capable of offering equal if not better user
experiences compared to native apps**. Combined with almost instantaneous load
times and superior discoverability, Progressive Web Apps are clearly the better
choice than native apps in a large number of scenarios now –
[Appscope](https://appsco.pe) is a great resource for discovering PWAs of all
kinds.

This has only been the case relatively recently though. While Chrome and Firefox
supported Service Workers (which are the main building block for PWAs) for quite
some time, two major browsers were falling behind - namely Safari and Internet
Explorer. These two (actually not Internet Explorer but its successor
[Edge](https://www.microsoft.com/de-de/windows/microsoft-edge)) have finally
caught up recently and
[Service Workers are now supported by all major browsers](https://caniuse.com/#feat=serviceworkers),
making Progressive Web Apps a viable alternative to native apps for most
businesses with approximately 84% of the global user base on browsers and OSes
capable of running PWAs as of July 2018.

A decade after the introduction of the original iPhone (and a detour via the
[multi-billion native app economy](https://www.appannie.com/en/insights/market-data/predictions-app-economy-2018/)),
Progressive Web Apps are ready to be used and they are here to stay. And we are
only getting started - as Progressive Web Apps have only recently really took
off, **it's fair to expect massive improvements in terms of what's possible over
the next coming years**.

## What are PWAs?

Progressive Web Apps have some distinct characteristics, the main ones being:

- **Progressiveness**: they work for every user, regardless of their device or
  browser of choice; depending on the capabilities of that environment, they
  will enable more or less of their functionality
- **Responsiveness**: they fit any form factor and screen sizes
- **Connectivity Independence**: they work on low quality networks or without
  any network at all (and thus fully offline)
- **App-likeliness**: they offer the rich user experience that users know and
  love from native apps
- **Installability**: they can be installed on the user's home screen without
  having to go through an app store

We will be focussing on two of these characteristics in this article -
Installability and Connectivity Independence.

## Installability

Progressive Web apps can be installed on the user's home screen and thus _"taken
out of the browser"_ so that they mingle with the user's native apps without the
user noticing a difference. That characteristic is enabled by the
[_"App Manifest"_](https://developers.google.com/web/fundamentals/web-app-manifest/)
that describes how an app is supposed to behave when run _"outside"_ of the
browser. The App Manifest is a simple JSON file with key/value pairs that
configure the main aspects of the app.

The
[App Manifest for Breethe](https://github.com/simplabs/breethe-client/blob/master/public/manifest.webmanifest)
looks like this:

```json
{
  "name": "Breethe",
  "short_name": "Breethe",
  "description": "Air Quality Data for Locations around the World",
  "theme_color": "#002eb8",
  "background_color": "#002eb8",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    {
      "src": "images/app-images/192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/app-images/512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "splash_pages": null
}
```

The manifest is presented to the browser via a `meta` tag:

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

The main keys in the manifest are `name`, `icons`, `background_color`,
`start_url`, `display` and `orientation`:

- `name`: the name of the app that will be shown on the user's home screen once
  the app is installed
- `icons`: icons in various sizes to use for the app on the home screen, the
  task switcher and elsewhere
- `background_color`: sets the color for the splash screen that is shown when
  the app is started from the home screen
- `start_url`: the URL to load when the app is started from the home screen
- `display`: tells the browser how to display the app when started from the home
  screen; this should usually be `"standalone"`
- `orientation`: the orientation to launch the app with if only one orientation
  is supported

Breethe, when installed to the user's home screen on iOS shows up like this:

![The Breethe app icon on the home screen](/assets/images/posts/2018-07-24-from-spa-to-pwa/breethe-app-icon.png)

When launched from the home screen, it starts up like a native app, without any
browser UI:

![The Breethe PWA starting up standalone](/assets/images/posts/2018-07-24-from-spa-to-pwa/breethe-startup-standalone.gif)

## Connectivity Independence

The main requirement for any web application to be able to work independently of
the network is that it **must be able to start up while there is no network at
all** and the device is offline. For a browser-based application designed to
load all required assets remotely, that is no easy task. One of the first
approaches for achieving this was
[Google Gears](<https://en.wikipedia.org/wiki/Gears_(software)>). Gears was
released as early as 2007 as a proprietary extension for Chrome and allowed
offline usage of e.g. Gmail. Gears never really took off in the broader
ecosystem and was discontinued in 2010.

Many of the original ideas behind Gears found their way into the HTML5 spec
though, in particular the idea of Gear's `LocalServer` module that allowed
running a local server inside of the browser. That server would be able to
handle any requests made by the browser instead of actually sending the request
over the network. This is essentially (besides some other features) what service
workers offer. They are standalone pieces of JavaScript code that get installed
into the users browser and are subsequently able to intercept any request that
the browser makes and serve the response from their internal cache instead of
relying on the remote server's response.

Installing a service worker is as simple as running a little script:

```html
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(function () {
      // handle errors
    });
  }
</script>
```

This calls the navigator's `serviceWorker` API's `register` method (if the
browser supports that API), passing the name of the JavaScript file with the
service worker code as an argument. The `register` method returns a promise that
rejects if the service worker could not be registered successfully.

Once the service worker is registered, it will start receiving various events
during the
[service worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Basic_architecture).
The first event in that lifecycle is the _"install"_ event which is typically
used to pre-cache resources and thus make them available for later offline use.
In the Breethe PWA, we use that event to preload all of the app's essential
resources:

<!-- prettier-ignore -->
```js
const CACHE_NAME = 'breethe-cache-v1';
const PRE_CACHED_ASSETS = [
  '/app.js',
  '/app.css',
  '/index.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      let cachePromises = PRE_CACHED_ASSETS.map(function(asset) {
        var url = new URL(asset, location.href);
        var request = new Request(url);
        return fetch(request).then(function(response) {
          return cache.put(asset, response);
        });
      });

      return Promise.all(cachePromises);
    }),
  );
});
```

Here, when the _"install"_ event is fired, we open the service worker cache,
request the critical assets and store them in the service worker's cache.

The next event in the lifecycle is the _"activate"_ event that is typically used
to delete old caches so that when the service worker is updated, no stale data
is left on the user's device. In the Breethe PWA, we only use one cache and when
the service worker is activated, simply delete all caches that are not that
current one:

```js
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // delete old caches
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

After the service worker is installed and activated, it starts receiving
_"fetch"_ events whenever the browser makes a request for any remote resource.
This is the relevant event that we need to listen for in order to make sure the
PWA can start up successfully if the device is offline. In the case of an SPA
where there only is one HTML document (which is `index.html`), this is as easy
as always serving that from the service worker's cache when the original request
fails:

```js
self.addEventListener("fetch", function (event) {
  if (event.request.headers.get("accept").startsWith("text/html")) {
    event.respondWith(
      fetch(event.request).catch((error) => {
        return caches.match("index.html");
      })
    );
  }
});
```

Here, we first check whether the request is asking for an HTML document (in
reality in Breethe,
[we check a few other things as well](https://github.com/simplabs/breethe-client/blob/master/lib/service-worker/workers/service-worker.js#L88))
and if that is the case, try making the request and loading the resource from
the network first. If that fails and the promise returned from `fetch` rejects
(one possible reason for that being that the device is offline), we simply serve
the `index.html` from the service worker's cache so that the app can start up
successfully in the browser. All of the application's assets that are referenced
in `index.html` are cached to and served from the service worker's cache as well
in a
[separate event handler](https://github.com/simplabs/breethe-client/blob/master/lib/service-worker/workers/service-worker.js#L65).

Allowing apps to start up offline with Service Workers is very straight forward
and does not even require implementing a whole lot of logic -
[Breethe's service worker](https://github.com/simplabs/breethe-client/blob/master/lib/service-worker/workers/service-worker.js)
does not even have 100 lines of code. Of course being able to start up the app
while the device is offline only solves half of the problem though when all of
the app's data is loaded from a remote API and thus would be unavailable when
offline.

## Offline Data

The web platform provides a number of APIs for storing data in the browser and
thus making it available for offline use. The
[WebStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
defines `localStorage` and `sessionStorage` which can be used for storing
key/value pairs. Cookies have been around for quite some time and not only can
they be used for tracking users or keeping their sessions alive when the browser
is closed but also for storing simple data. When dealing with bigger, structured
datasets though, the storage API of choice is generally
[`IndexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

`IndexedDB` is a transactional database system, similar to SQL-based RDBMS:

```js
let openRequest = window.indexedDB.open("MyTestDatabase");
openRequest.onsuccess = function (event) {
  let db = event.target.result;
  var transaction = db.transaction(["locations"]);
  var objectStore = transaction.objectStore("locations");
  var request = objectStore.get("1");
  request.onsuccess = function () {
    let location = request.result;
    alert(`Loaded location ${location.name}`);
  };
};
```

`IndexedDB`'s API can be a bit cumbersome to use though which is why instead of
interfacing with it directly, developers typically leverage libraries that
abstract its complexity behind more convenient APIs. For Breethe, we used
[Orbit.js](http://orbitjs.com) but there are other libraries like
[PouchDB](https://pouchdb.com) or
[localForage](https://localforage.github.io/localForage/).

Orbit.js works based on a schema definition that defines the models it operates
on, their attributes and relationships. In the case of Breethe which works with
measurement locations and data points,
[the schema](https://github.com/simplabs/breethe-client/blob/master/src/utils/data/schema.ts)
looks like this:

```typescript
import { SchemaSettings } from "@orbit/data";
import { ModelDefinition } from "@orbit/data";

export const location: ModelDefinition = {
  attributes: {
    label: { type: "string" },
    coordinates: { type: "string" },
  },
  relationships: {
    measurements: {
      type: "hasMany",
      model: "measurement",
      inverse: "location",
    },
  },
};

export const measurement: ModelDefinition = {
  attributes: {
    parameter: { type: "string" },
    measuredAt: { type: "string" },
    unit: { type: "string" },
    value: { type: "string" },
    qualityIndex: { type: "string" },
  },
  relationships: {
    location: { type: "hasOne", model: "location", inverse: "measurements" },
  },
};

export const schema: SchemaSettings = {
  models: {
    location,
    measurement,
  },
};
```

The `location` model represents a measurement location that air quality data has
been recorded for. Each location has a number of `measurements` that represent
individual data points for particular parameters, e.g. 42.38 µg/m³ for Ozone
(O₃). With that schema, a store can be instantiated:

```typescript
import Store from "@orbit/store";
import schema from "./schema";

const store = new Store({ schema });
```

Stores in Orbit.js are backed by sources. In the case of Breethe, we use a
[json:api](http://jsonapi.org) source for loading data from a
[server API](https://github.com/simplabs/breethe-server):

```typescript
import JSONAPISource from "@orbit/jsonapi";

const remote = new JSONAPISource({
  schema,
  name: "remote",
  host: "https://api.breethe.app",
});
```

In order to be able to use the data loaded from the remote store when the app is
offline, Breethe defines a second source that is backed by `IndexedDB` and that
all data that enters the store via the remote source is synced into:

```typescript
import IndexedDBSource from "@orbit/indexeddb";

const backup = new IndexedDBSource({
  schema,
  name: "backup",
});

// when the store changes, sync the changes into the backup source
store.on("transform", (transform) => {
  backup.sync(transform);
});
```

With this setup, all data that gets loaded by the app while the device is online
is available for later offline use, where it will be read from `IndexedDB`
instead. This mechanism works the other way round as well of course, such that
the app could buffer any modifications to data in the store in `IndexedDB` while
offline and then sync these changes back to the remote API once the device comes
back online - refer to the [Orbit.js docs](http://orbitjs.com/v0.15/guide/) for
more information about advanced mechanics like this.

With the combination of service workers and `IndexedDB`, PWAs are fully
independent of the network status and offer the same experience as native apps
when the device is offline. Modern libraries like Orbit.js make it easy to
manage data independently of the network condition and abstract most of the
details behind convenient APIs.

## Testing

Testing is an essential part of modern software engineering and we at simplabs
(and I'm sure this is true for anyone reading this as well) would **never ship
code that is not fully tested** - as we could not know whether the code actually
works or whether we subsequently break it when making changes. The first thing
that comes to mind when thinking about tests are typically unit tests that test
a small part of an app (a unit) in isolation. Depending on the framework of
choice and its testing philosophy and tools, there might also be means of
[higher level test](https://guides.emberjs.com/release/testing/testing-components/)
that test larger subsets of an app (and we have
[quite](https://github.com/simplabs/breethe-client/blob/master/src/ui/components/MeasurementRow/component-test.ts)
[a lot](https://github.com/simplabs/breethe-client/blob/master/src/ui/components/SearchForm/component-test.ts)
of these for Breethe).

Testing PWAs, in particular their offline behavior, is slightly different though
as it requires the correct interplay of various parts that cannot be isolated
well - namely the app itself, the service worker, storage APIs like `IndexedDB`
and the browser. A proper PWA test suite needs to take all of these parts into
account and have a higher level perspective on the system under test than is the
case in a unit test. A great tool for tests like these is Google's
[puppeteer](https://pptr.dev) that allows running and controlling a headless
instance of Chrome.

Combining puppeteer with mocha allows for writing high level test cases that
test a PWA in its entirety:

```js
describe("when offline", function () {
  async function visit(route, callback) {
    let browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    let page = await browser.newPage();
    await page.goto(route);

    try {
      await callback(page);
    } finally {
      await browser.close();
    }
  }

  it("works offline", async function () {
    await visit("/", async (page) => {
      // go through the flow online first so we populate IndexedDB
      await page.type("[data-test-search-input]", "Salzburg");
      await page.click("[data-test-search-submit]");
      await page.waitForSelector('[data-test-search-result="Salzburg"]');
      await page.click('[data-test-search-result="Salzburg"] a');
      await page.waitForSelector(
        '[data-test-measurement="PM10"] [data-test-measurement-value="15"]'
      );
      await page.click("[data-test-home-link]");
      await page.waitForSelector("[data-test-search]");

      await page.setOfflineMode(true); // simulate the browser being offline
      await page.reload();

      // click the recent location
      await page.waitForSelector('[data-test-search-result="Salzburg"]');
      await page.click('[data-test-search-result="Salzburg"] a');
      // check the correct data is still present
      let element = await page.waitForSelector(
        '[data-test-measurement="PM10"] [data-test-measurement-value="15"]'
      );
      expect(page.url()).to.match(/\/location\/2$/);

      expect(element).to.be.ok;
    });
  });
});
```

This test uses
[puppeteer's API](https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md)
to create a new browser object (which will start an actual instance of Chrome in
the background), open a page, interact with DOM elements and assert on their
presence and state. It starts by going through the app's main flow once so data
is loaded from the API and `IndexedDB` is populated. It then disables the
network (`page.setOfflineMode(true)`), reloads the page (which is then served
from the service worker that was registered during first load) and asserts on
the DOM correctly being generated from the data read from `IndexedDB`.

A testing setup like this makes it easy to achieve decent test coverage for
PWAs, testing all of the parts involved - the app itself but also the service
worker and storage APIs like `IndexedDB`. These test are even reasonably fast to
execute -
[Breethe's suite of puppeteer tests](https://github.com/simplabs/breethe-client/tree/master/integration-tests)
completes in
[around 1min](https://travis-ci.org/simplabs/breethe-client/jobs/403597086#L683).

## Outlook

This post and the
[previous one](/blog/2018/07/03/building-a-pwa-with-glimmer-js) have given an
overview of how to write an SPA (in this case with Glimmer.js) and then turning
that into a [Progressive Web App](http://breethe.app). With Breethe, we haven't
stopped there though but employed server side rendering to combine the
advantages of a PWA with those of classic server rendered websites. In the next
post in this series, we will have a detailed look at what specifically those
advantages are and how we were able to achieve them.

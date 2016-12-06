---
layout: article
section: Blog
title: Out-of-the-box FastBoot support in Ember Simple Auth
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

Since FastBoot was first announced earlier this year it was clear to us that we wanted to have out-of-the-box support for it in Ember Simple Auth. We wanted to make sure that Ember Simple Auth did not keep anyone from adopting FastBoot and adopting FastBoot did not mean people would have to figure out their own authentication and authorization solutions. Today we're happy to announce the availability of Ember Simple Auth 1.2.0-beta.1, the first release with out-of-the-box (and of course fully backwards compatible) support for FastBoot.

<!--break-->

#### Seamless authentication/authorization handling

Ember Simple Auth 1.2 seamlessly synchronizes the session state between the browser and server. When a user logs in to an application and refeshes the page, triggering a request that's handled by the FastBoot server, Ember Simple Auth will send the session state along with that request, pick it up in the app instance that's running in the FastBoot server and make sure the Ember route is being executed in the correct session context. If the session turns out to be invalid for some reason the user will be redirected to the login page via a proper HTTP redirect.

#### How does this work?

Ember Simple Auth has always had the concept of session stores that persist the session state so that it survives page reloads. One of these already existing session stores turned out to be the perfect fit for the aforementioned session syncing mechanism and that's the cookie session store. A cookie for a particular origin will be sent along with all requests to that origin and can be modified by the server in the response. The latter characteristic is necessary in order for the server to be able to invalidate the session if it turns out to be invalid. Cookies also have another important characteristic which is the fact that they will be sent by the browser automatically which is important as we need to make sure that the session cookies is also sent along with the initial request when the Ember is not running yet and no JS can be used to inject any session information into the request.

One challenge with making the cookies session store both in the browser as well as in Node though was that the API for cookies is obviously totally different in both environments. In the browser you'd rely on `document.cookie` while in the server side cookies are being read and written via the `Cookie` and `Set-Cookie` headers. That meant we had to come up with a way to read and write cookies via a common interface that abstracts these environment specific APIs (much like what ember-network does for the fetch API). Therefore we created ember-cookies which is a cookies abstraction that works in the browser as well as in Node and that's now being used internally by the cookie session store.

ember-cookies exposes a cookies service that provides read, write and clear methods:

```js
// app/controllers/application.js
import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  cookies: service(),
  intl: service(),

  beforeModel() {
    let locale = this.get('cookies').read('locale');
    this.get('intl').set('locale', locale);
  }
});
```

#### Using Ember Simple Auth with FastBoot

As most of Ember Simple Auth's support for FastBoot is based on the cookie session store, applications aiming to use ESA with FastBoot have to use that store. In order to do so, simply define the application session store as

```js
// app/session-stores/application.js
import Cookie from 'ember-simple-auth/session-stores/cookie';

export default Cookie.extend();
```

Everything else will continue to work as it did before. Ember Simple Auth 1.2 is a completely backwards compatible update that does not introduce any breaking changes. Applications that already use the cookie session store will automatically be ready for FastBoot while applications using the `localStorage` or adaptive session stores will only have to switch to the cookie session store to just work(™) with FastBoot.

If you're interested in knowing more about the underlying concepts check out my talk about Auth* handling with FastBoot that I gave at EmberCamp in London in June.

As this is a beta release and there are probably some rough edges we'd ask everyone to try it, regardless of whether they're using FastBoot already or not and report bugs, outdated or bad documentation etc. on github.

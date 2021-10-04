---
title: Out-of-the-box FastBoot support in Ember Simple Auth
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces out-of-the-box support for FastBoot in Ember
  Simple Auth and explains how it works using ember-cookies.'
topic: ember
---

Ever since <a href="https://www.youtube.com/watch?v=o12-90Dm-Qs">FastBoot was
first announced at EmberConf 2015</a> it was clear to us that we wanted to have
out-of-the-box support for it in Ember Simple Auth. Our goal was to make sure
that Ember Simple Auth did not keep anyone from adopting FastBoot and adopting
FastBoot would not result in people having to figure out their own
authentication and authorization solutions. Today we're happy to announce the
availability of
<a href="https://github.com/simplabs/ember-simple-auth/releases/tag/1.2.0-beta.1">Ember
Simple Auth 1.2.0-beta.1</a>, the <strong>first release with out-of-the-box
support for FastBoot</strong>.

<!--break-->

## Seamless Session Synchronization

Ember Simple Auth 1.2 seamlessly <strong>synchronizes the session state between
the browser and FastBoot server</strong>. When a user logs in to an Ember.js
application and refreshes the page or comes back to the app later - triggering a
request that's handled by the FastBoot server - Ember Simple Auth will send the
session state along with that request, pick it up in the app instance that's
running in the FastBoot server and <strong>make sure the Ember route is being
loaded and rendered in the correct session context</strong>. If the session
turns out to be invalid for some reason, the server will invalidate it and the
user will be redirected to the login page via a proper HTTP redirect.

## Under the hood

Ember Simple Auth has always had the concept of session stores that persist the
session state so that it survives page reloads (or users leaving the app and
coming back later). <strong>One of these session stores turned out to be the
perfect fit for the aforementioned session syncing mechanism – the cookie
session store</strong>. Browsers will automatically send cookies for a
particular origin along with any request to that origin. Also, servers can
modify cookies sent by the browser and include updates in the response that the
browser will automatically pick up - effectively enabling bidirectional state
synchronization.

The main challenge with enabling the cookie session store to run both in the
browser as well as in Node though was that the APIs for cookie handling are
obviously totally different in both environments. In the browser there is
`document.cookie` while in server apps running in Node, cookies are being read
and written via the `Cookie` and `Set-Cookie` headers. That meant we had to come
up with a way to read and write cookies via a common interface that we could
rely on in the cookie session store and that abstracted these environment
specific APIs under the hood (much like what
<a href="https://github.com/tomdale/ember-network">ember-network</a> does for
the <a href="https://github.com/tomdale/ember-network">fetch API</a>). Therefore
we created
<strong><a href="https://github.com/simplabs/ember-cookies">ember-cookies</a>
which is a cookies abstraction that works in the browser as well as in
Node</strong> and that's now being used internally by the cookie session store.

ember-cookies exposes a cookies service with
<a href="https://github.com/simplabs/ember-cookies#api">`read`, `write` and
`clear` methods</a>:

<!-- prettier-ignore -->
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
  },
});
```

## Using Ember Simple Auth with FastBoot

As most of Ember Simple Auth's support for FastBoot is based on the cookie
session store, <strong>enabling FastBoot support is as easy as defining the
application session store</strong> as:

```js
// app/session-stores/application.js
import Cookie from 'ember-simple-auth/session-stores/cookie';

export default Cookie.extend();
```

If you're interested in learning more about the underlying concepts check out
the
<a href="https://www.youtube.com/watch?v=jcAgi7fpTw8&index=6&list=PL4eq2DPpyBbmrPasP06vK7cUkPUCNn_rW">talk
about Authentication and Session Management in FastBoot</a> that I gave at
<a href="http://embercamp.com">EmberCamp</a> in London in June.

## Other Changes and Fixes

Out-of-the-box support for FastBoot is likely the most prominent addition in
this release but there are <strong>quite some other changes</strong> as well,
including:

- The default cookie names that the cookie session store uses are now compliant
  with RFC 2616, see
  <a href="https://github.com/simplabs/ember-simple-auth/pull/978">#978</a>
- Server responses are now validated in authenticators, preventing successful
  logins when required data is actually missing, see
  <a href="https://github.com/simplabs/ember-simple-auth/pull/957">#957</a>
- The OAuth 2.0 Password Grant authenticator can now send custom headers along
  with authentication requests, see
  <a href="https://github.com/simplabs/ember-simple-auth/pull/1018">#1018</a>

In addition to these changes, fixed issues include:

- Routes like the login route can now be configured inline in routes using the
  respective mixins as opposed to `config/environment.js`, see
  <a href="https://github.com/simplabs/ember-simple-auth/pull/1041">#1041</a>
- The cookie session store will now rewrite its cookies when any of its
  configurable properties (like cookie name) change, see
  <a href="https://github.com/simplabs/ember-simple-auth/pull/1056">#1056</a>

## A Community Effort

This certainly is one of the larger releases in Ember Simple Auth's history and
<strong>a lot of people have helped to make it happen</strong>. We'd like to
thank all of our (at the time of this writing)
<a href="https://github.com/simplabs/ember-simple-auth/graphs/contributors">141
contributors</a>, with particular mention to
<a href="https://github.com/stevenwu">Steven Wu</a>,
<a href="https://github.com/kylemellander">Kyle Mellander</a>,
<a href="https://github.com/arjansingh">Arjan Singh</a> and
<a href="https://github.com/josemarluedke">Josemar Luedke</a> for awesome
contributions to the Fastboot effort and ember-cookies.

## Try it!

As this is a beta release, <strong>there are probably some rough edges</strong>.
We'd like everyone to try it, regardless of whether they're using Fastboot
already or not and <strong>report bugs, outdated or bad documentation etc. on
<a href="https://github.com/simplabs/ember-simple-auth/releases">github</a></strong>.

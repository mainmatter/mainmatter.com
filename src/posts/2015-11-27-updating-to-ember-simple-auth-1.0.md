---
title: "Updating to Ember Simple Auth 1.0"
authorHandle: marcoow
bio: "Founding Director of simplabs, author of Ember Simple Auth"
description:
  "Marco Otte-Witte gives an update on the upcoming Ember Simple Auth 1.0
  release and shows how to use it in Ember CLI applications."
tags: ember
---

With Ember Simple Auth 1.0.0 having been
[released a few days ago](https://github.com/simplabs/ember-simple-auth/releases/tag/1.0.0),
a lot of people will want to upgrade their applications to it so they can
finally make the switch to Ember.js 2.0\. While quite a big part of the
[public API](http://ember-simple-auth.com/api/) has been changed in 1.0.0,
**updating an application from Ember Simple Auth 0.8.0 or earlier versions is
actually not as hard as it might appear** at first glance. This post explains
the steps that are necessary to bring an application to 1.0.0.

<!--break-->

As 1.0.0 marks the first stable release of Ember Simple Auth, upcoming versions
will adhere to the [Semantic Versioning](http://semver.org) rule of not
including breaking changes in patch level or minor releases. In fact, **Ember
Simple Auth will follow Ember’s example and only make additive, backwards
compatible changes in all 1.x releases** and only remove deprecated parts of the
library in the next major release.

## Uninstall previous versions

**Ember Simple Auth 1.0.0 is only distributed as an Ember CLI Addon** and drops
the previous bower distribution as well as the individual
`ember-cli-simple-auth-*` packages. The first step when upgrading to 1.0.0 is to
uninstall these packages from the application. To do that simply remove the
`ember-simple-auth` package from `bower.json` as well as all
`ember-cli-simple-auth-*` packages from `packages.json`.

## Install 1.0.0

Once the previous versions are uninstalled, install the 1.0.0 release:

```bash
ember install ember-simple-auth
```

## Fix the imports

With 1.0.0 all modules that it defines now live in the `ember-simple-auth`
namespace as opposed to the `simple-auth` namespace of previous versions. All
the `import` statements that import code from Ember Simple Auth need to be
updated accordingly, e.g.

```js
import ApplicationRouteMixin from "simple-auth/mixins/application-route-mixin";
```

becomes

```js
import ApplicationRouteMixin from "ember-simple-auth/mixins/application-route-mixin";
```

Also the modules for the OAuth 2.0 authenticator and authorizer have been
renamed from just `oauth2` to `oauth2-password-grant` and `oauth2-bearer`
respectively so that `'simple-auth/authenticators/oauth2'` is now
`'ember-simple-auth/authenticators/oauth2-password-grant'` and
`'simple-auth/authorizers/oauth2'` is now
`'ember-simple-auth/authorizers/oauth2-bearer'`.

## Inject the session service

With Ember Simple Auth 1.0.0 the **session is no longer automatically injected
into all routes, controllers and components** but instead is **now available as
an [Ember.Service](http://emberjs.com/api/classes/Ember.Service.html)** so in
all routes, controllers and components that use the session (or back a template
that uses it), that session service needs to be injected, e.g.:

```js
import Ember from "ember";

export default Ember.Controller.extend({
  session: Ember.inject.service(),
});
```

## Define Authenticators and Authorizers

Ember Simple Auth 1.0.0 does not automatically merge all the predefined
authenticators and authorizers into the application anymore but instead
**requires authenticators and authorizers the application actually uses to be
defined explicitly**. So if you e.g. were previously using the OAuth 2.0
authenticator simply define an authenticator that extends the OAuth 2.0
authenticator in `app/authenticators`:

```js
// app/authenticators/oauth2.js
import OAuth2PasswordGrant from "ember-simple-auth/authenticators/oauth2-password-grant";

export default OAuth2PasswordGrant.extend({
  serverTokenRevocationEndpoint: "/revoke",
});
```

In addition to the renamed module, the signature of the OAuth 2.0 authenticator
has changed as well so that it now expects dedicated arguments for the user’s
identification and password instead of one object containing both values, so

```js
const credentials = this.getProperties("identification", "password");
this.get("session").authenticate("authenticator:oauth2", credentials);
```

becomes

```js
const { identification, password } = this.getProperties(
  "identification",
  "password"
);
this.get("session").authenticate(
  "authenticator:oauth2",
  identification,
  password
);
```

Also authenticators and authorizers are not configured via
`config/environment.js` anymore but instead the respective properties are simply
overridden in the extended classes as for the `serverTokenRevocationEndpoint`
property in the example above.

## Setup authorization

Ember Simple Auth’s **old auto-authorization mechanism** was complex (especially
when working with cross origin requests where configuring the
`crossOriginWhitelist` was causing big problems for many people) and **has been
removed in 1.0.0**. Instead authorization is now explicit. To authorize a block
of code use the
[session service’s `authorize` method](http://ember-simple-auth.com/api/classes/SessionService.html#method_authorize),
e.g.:

```js
this.get("session").authorize(
  "authorizer:oauth2-bearer",
  (headerName, headerValue) => {
    xhr.setRequestHeader(headerName, headerValue);
  }
);
```

If the application uses Ember Data, you can authorize all of the requests it
sends to the API by using the new
[`DataAdapterMixin`](http://ember-simple-auth.com/api/classes/DataAdapterMixin.html),
e.g.:

```js
// app/adapters/application.js
import DS from "ember-data";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: "authorizer:application",
});
```

## Migrating custom sessions

While previous versions of Ember Simple Auth allowed to configure a custom
session class in order to add properties and methods to the session, Ember
Simple Auth 1.0.0 makes the session private and only exposes the session
service. In order to migrate a custom session class to work with the service
there are 2 options.

### Extend the session service

You can simply extend the session service and add custom properties and methods
in the subclass, e.g.:

```js
// app/services/session.js
import Ember from "ember";
import DS from "ember-data";
import SessionService from "ember-simple-auth/services/session";

export default SessionService.extend({
  store: Ember.inject.service(),

  account: Ember.computed("data.authenticated.account_id", function () {
    const accountId = this.get("data.authenticated.account_id");
    if (!Ember.isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.get("store").find("account", accountId),
      });
    }
  }),
});
```

### Create dedicated services

You can also create dedicated services that use the session service internally,
e.g.:

```js
import Ember from "ember";
import DS from "ember-data";

export default Ember.Service.extend({
  session: Ember.inject.service("session"),
  store: Ember.inject.service(),

  account: Ember.computed("session.data.authenticated.account_id", function () {
    const accountId = this.get("session.data.authenticated.account_id");
    if (!Ember.isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.get("store").find("account", accountId),
      });
    }
  }),
});
```

In this case the session service remains unchanged and whenever you need the
currently authenticated account you’d use the `session-account` service to get
that.

Both solutions work fine but **the latter results in cleaner code and better
separation of concerns.**

## Session Stores

Previous versions of Ember Simple Auth allowed the session store to be
configured in `config/environment.js`. **Ember Simple Auth 1.0.0 removes that
configuration setting and will always use the `'application'` session store**.
If not overridden by the application that session store will be an instance of
the new
[`AdaptiveStore`](http://ember-simple-auth.com/api/classes/AdaptiveStore.html)
that internally uses the
[`LocalStorageStore`](http://ember-simple-auth.com/api/classes/LocalStorageStore.html)
if `localStorage` storage is available and the
[`CookieStore`](http://ember-simple-auth.com/api/classes/CookieStore.html) if it
is not. To customize the application store, define it in
`app/session-stores/application.js`, extend a predefined session store and
customize properties (as done for authenticators and authorizers as described
above) or implement a fully custom store, e.g.:

```js
// app/session-store/application.js
import CookieStore from "ember-simple-auth/session-stores/cookie";

export default CookieStore.extend({
  cookieName: "my_custom_cookie_name",
});
```

**Ember Simple Auth 1.0.0 will also automatically use the
[`EphemeralStore`](http://ember-simple-auth.com/api/classes/EphemeralStore.html)
when running tests** so there is no need anymore to configure that for the test
environment (in fact the configuration setting has been removed).

## Update acceptance tests

While previous versions of Ember Simple Auth automatically injected the test
helpers, version 1.0.0 requires them to be imported in the respective acceptance
tests, e.g.:

```js
import {
  invalidateSession,
  authenticateSession,
  currentSession,
} from "../helpers/ember-simple-auth";
```

Also they now take the application instance as a first argument so instead of

```js
authenticateSession();
```

one would now write

```js
authenticateSession(App);
```

## Update the application route if necessary

The
[`ApplicationRouteMixin`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html)
in Ember Simple Auth 1.0.0 now only defines the two methods
[`sessionAuthenticated`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html#method_sessionAuthenticated)
and
[`sessionInvalidated`](http://ember-simple-auth.com/api/classes/ApplicationRouteMixin.html#method_sessionInvalidated)
as opposed to the previous four actions. If the application overrides any of
these actions it would now have to override these methods.

## Wrapping up

I hope this gives a good overview of how upgrading an Ember application to Ember
Simple Auth 1.0.0 works. **There is lots of documentation available** in the
[README](https://github.com/simplabs/ember-simple-auth#readme) and the
[API Docs](http://ember-simple-auth.com/api/index.html). You might also want to
check out the
[dummy application](https://github.com/simplabs/ember-simple-auth/tree/master/tests/dummy)
in the github repo and the
[intro video on the website](http://ember-simple-auth.com).

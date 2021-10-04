---
title: 'Ember.SimpleAuth implements RFC 6749 (OAuth 2.0)'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces support for OAuth 2.0 in Ember.SimpleAuth, the
  addon for implementing a session and authentication/authorization for
  Ember.js.'
topic: ember
---

**Update:
[Ember.SimpleAuth 0.1.0 has been released!](/blog/2014/01/20/embersimpleauth-010)**
The information in this is (partially) outdated.

With the
[release of Ember.SimpleAuth 0.0.4](https://github.com/simplabs/ember-simple-auth/releases/tag/0.0.4)
**the library is compliant with OAuth 2.0** - specifically it implements the
_"Resource Owner Password Credentials Grant Type"_ as defined in
[RFC 6749](http://tools.ietf.org/html/rfc6749) (thanks
[adamlc](https://github.com/adamlc) for the suggestion). While this is only a
minor change in terms of functionality and data flow, used headers etc. it makes
everyone’s life a lot easier as instead of implementing your own server
endpoints you can now utilize
[one of several OAuth 2.0 middlewares that already implement the spec](https://github.com/search?q=oauth%20middleware).

<!--break-->

With the OAuth 2.0 support also comes **support for access token expiration and
[refresh tokens](http://tools.ietf.org/html/rfc6749#section-6)**. Using expiring
access tokens improves overall security as replay attacks are less likely while
with refresh tokens **Ember.SimpleAuth can automatically obtain new access
tokens** before they expire so that the user doesn’t recognize the token
actually changes.

## Other changes

Other smaller additions include **support for
[external OAuth/OpenID providers](https://github.com/simplabs/ember-simple-auth#external-oauthopenid-providers)**
and
[manipulation of the request used to obtain the access token](https://github.com/simplabs/ember-simple-auth#custom-server-protocols).
Also the API was simplified and the `login` and `logout` actions were moved to
the `ApplicationControllerMixin` and the `/logout` route has been removed. The
new API now looks like this:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function (container, application) {
    Ember.SimpleAuth.setup(container, application);
  },
});

App.Router.map(function () {
  this.route('login');
  this.route('protected');
});

App.ApplicationRoute = Ember.Route.extend(
  Ember.SimpleAuth.ApplicationRouteMixin,
);
App.LoginController = Ember.Controller.extend(
  Ember.SimpleAuth.LoginControllerMixin,
);
```

## Future plans

Currently I’m working on adding API documentation within the source together
with a means of generating some nice HTML out of that. I don’t currently see
that there is much else missing in the library so **I’d like to release a 1.0.0
version soon**. Of course I’d like to make sure that Ember.SimpleAuth is
actually being used and working so
[please submit bug reports, patches etc.](https://github.com/simplabs/ember-simple-auth)
or **provide general feedback/ideas!**

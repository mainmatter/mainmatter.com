---
title: 'Ember.SimpleAuth implements RFC 6749 (OAuth 2.0)'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces support for OAuth 2.0 in Ember.SimpleAuth, the
  addon for implementing a session and authentication/authorization for
  Ember.js.'
tags: ember
tagline: |
  <p><strong>Update: <a href="/blog/2014/01/20/embersimpleauth-010">Ember.SimpleAuth 0.1.0 has been released!</a></strong> The information in this is (partially) outdated.</p> <p>With the <a href="https://github.com/simplabs/ember-simple-auth/releases/tag/0.0.4">release of Ember.SimpleAuth 0.0.4</a> <strong>the library is compliant with OAuth 2.0</strong> - specifically it implements the <em>&quot;Resource Owner Password Credentials Grant Type&quot;</em> as defined in <a href="http://tools.ietf.org/html/rfc6749">RFC 6749</a> (thanks <a href="https://github.com/adamlc">adamlc</a> for the suggestion). While this is only a minor change in terms of functionality and data flow, used headers etc. it makes everyone’s life a lot easier as instead of implementing your own server endpoints you can now utilize <a href="https://github.com/search?q=oauth%20middleware">one of several OAuth 2.0 middlewares that already implement the spec</a>.</p>
---

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
{% raw %}
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
{% endraw %}
```

## Future plans

Currently I’m working on adding API documentation within the source together
with a means of generating some nice HTML out of that. I don’t currently see
that there is much else missing in the library so **I’d like to release a 1.0.0
version soon**. Of course I’d like to make sure that Ember.SimpleAuth is
actually being used and working so
[please submit bug reports, patches etc.](https://github.com/simplabs/ember-simple-auth)
or **provide general feedback/ideas!**

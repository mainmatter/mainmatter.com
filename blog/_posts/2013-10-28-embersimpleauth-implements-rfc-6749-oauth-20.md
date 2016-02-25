---
layout: article
section: Blog
title: "Ember.SimpleAuth implements RFC 6749 (OAuth 2.0)"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

**Update: [Ember.SimpleAuth 0.1.0 has been released!](http://log.simplabs.com/post/73940085063/ember-simpleauth-0-1-0)** The information in this is (partially) outdated.

With the [release of Ember.SimpleAuth 0.0.4](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth%2Freleases%2Ftag%2F0.0.4&t=NThiNmU5MDcyMzM2ODlhNGUyMGEyNDU2YTVkYzMzYzEzZGQxNTg1OSxKek05TGNnVw%3D%3D "the release @ github") **the library is compliant with OAuth 2.0** - specifically it implements the _“Resource Owner Password Credentials Grant Type”_ as defined in [RFC 6749](http://t.umblr.com/redirect?z=http%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc6749&t=ZjlmMTkyMGRiMTQyYzczY2E5NGQyNmRkOGQzNmUwZDIzMTM1NzEzZSxKek05TGNnVw%3D%3D "RFC 6749") (thanks [adamlc](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fadamlc&t=ODU3NDc5OTRiZGQ3YjM0MmI0OWFlNWQ1MDc3OGY4N2Y1MmE3MmYzMSxKek05TGNnVw%3D%3D "adamlc @ github") for the suggestion). While this is only a minor change in terms of functionality and data flow, used headers etc. it makes everyone’s life a lot easier as instead of implementing your own server endpoints you can now utilize [one of several OAuth 2.0 middlewares that already implement the spec](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Doauth+middleware&t=ZTgyODY1MWZjOGUxNDQ5MWQ2ZTA1NDViMmUyOGU2MmYxNDI2ZmY1NSxKek05TGNnVw%3D%3D).
<!--break-->

With the OAuth 2.0 support also comes **support for access token expiration and [refresh tokens](http://t.umblr.com/redirect?z=http%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc6749%23section-6&t=YTU0ZThjNjQyNWYyMzE5YmYyOTQwM2I0YmFiODk0MDhhZGIyMWRkOCxKek05TGNnVw%3D%3D "RFC 6749 - Refreshing an Access Token")**. Using expiring access tokens improves overall security as replay attacks are less likely while with refresh tokens **Ember.SimpleAuth can automatically obtain new access tokens** before they expire so that the user doesn’t recognize the token actually changes.

#### Other changes

Other smaller additions include **support for [external OAuth/OpenID providers](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth%23external-oauthopenid-providers&t=YTViMjE1YTJlMzRmNGQyZTJiYmY3MmFmNDFlYzc0MTRmMGQ0YzM5ZCxKek05TGNnVw%3D%3D "External OAuth/OpenID Providers in the README")** and [manipulation of the request used to obtain the access token](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth%23custom-server-protocols&t=YjA4N2I1OTlmYmE0OTdkZWY1YzBjMjVlNDkzZTY4ZmMzYzJmMWIzMSxKek05TGNnVw%3D%3D "Custom Server Protocols in the README"). Also the API was simplified and the `login` and `logout` actions were moved to the `ApplicationControllerMixin` and the `/logout` route has been removed. The new API now looks like this:



```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application);
  }
});

App.Router.map(function() {
  this.route('login');
  this.route('protected');
});

App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);
App.LoginController  = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin);

```



#### Future plans

Currently I’m working on adding API documentation within the source together with a means of generating some nice HTML out of that. I don’t currently see that there is much else missing in the library so **I’d like to release a 1.0.0 version soon**. Of course I’d like to make sure that Ember.SimpleAuth is actually being used and working so [please submit bug reports, patches etc.](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth&t=ZmQ0ZTFhODk0ODIzNzZhNjU1NGFkMTQxOGFjMGJiNGY2ZDVhMGQ2MyxKek05TGNnVw%3D%3D "the repository @ github") or **provide general feedback/ideas!**
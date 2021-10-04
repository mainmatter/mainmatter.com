---
title: 'Ember.SimpleAuth 0.3.0'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces Ember.SimpleAuth 0.3.0, splitting the addon into a
  core and extensions for specific authentication/authorization mechanisms.'
topic: ember
---

Ember.SimpleAuth 0.3.0 was just released. The **main change in this release is
the split of Ember.SimpleAuth into one core library and a set of extension
libraries**. These extension libraries include everything that’s not mandatorily
required for Ember.SimpleAuth like authenticators, stores etc. so that every
application would only have to load whatever it needs.

<!--break-->

These extension libraries are:

- **ember-simple-auth-oauth2**: includes the OAuth 2.0 authenticator and
  authorizer which are just one option out of many and probably not needed in
  many projects (e.g. when using a custom authenticator)
- **ember-simple-auth-devise**: new authenticator/authorizer package that is
  compatible with the Ruby gem
  [devise](https://github.com/plataformatec/devise).
- **ember-simple-auth-cookie-store**: The cookie store which is probably only
  used in few projects.

There are hopefully more extension libraries to come as people start to provide
more authenticators, authorizers and other components and now there’s a (more or
less, pre 1.0) stable API for these libraries as well as a set of tasks to build
and test them

Another bigger change in this release is that **having an authorizer is now
optional**. As there are applications that are purely client side and don’t use
a server backend expecting every application to use an authorizer was probably
not so great in the first place. However, applications that do use an authorizer
can simply configure one in Ember.SimpleAuth’s setup method and everything will
behave as before:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function (container, application) {
    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:oauth2-bearer',
    });
  },
});
```

For more information about this release see the release notes at:
[https://github.com/simplabs/ember-simple-auth/releases/tag/0.3.0](https://github.com/simplabs/ember-simple-auth/releases/tag/0.3.0)

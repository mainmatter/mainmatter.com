---
title: 'Ember.SimpleAuth 0.1.0'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces Ember.SimpleAuth 0.1.0 with an improved
  architecture that allows for arbitrary authentication and authorization
  strategies.'
tags: ember
tagline: |
  <p>Since <a href="https://github.com/simplabs/ember-simple-auth">Ember.SimpleAuth</a> was released in October 2013, there were lots of issues reported, pull requests submitted and merged etc. <strong>Now all this feedback together with some fundamental design improvements results in the <a href="https://github.com/simplabs/ember-simple-auth/releases/tag/0.1.0">release of the 0.1.0 version of Ember.SimpleAuth</a>.</strong> This is hopefully paving the way for a soon-to-be-released version 1.0.</p>
---

## What changed?

The most significant change is the **extraction of everything specific to
specific authentication/authorization mechanisms (e.g. the default OAuth 2.0
implementation) into strategy classes** which significantly improves
customizability and extensibility. Instead of having to override parts of the
library, using e.g. a custom authentication method is now as simple as
specifying the class in the respective controller:

```js
{% raw %}
App.LoginController = Ember.Controller.extend(
  Ember.SimpleAuth.LoginControllerMixin,
  {
    authenticator: App.CustomAuthenticator,
  },
);
{% endraw %}
```

This **makes implementations cleaner and also helps defining the public API that
Ember.SimpleAuth** will settle on in the long term.

Other changes include the introduction of store strategies (Ember.SimpleAuth
comes with a cookie store that is equivalent to the old store, a store that uses
the browser’s localStorage API and which is the new default as well as an
in-memory store which is mainly useful for testing) as well as error
handling/token invalidation, added callback actions like
`sessionInvalidationSucceeded` etc. See the
[README](https://github.com/simplabs/ember-simple-auth#readme) and the
[API docs](http://ember-simple-auth.com/api/) for complete documentation.

## Upgrading

Upgrading will be pretty straight forward in most cases. The main change that
could bite you is probably the change in `Ember.SimpleAuth.setup`’s signature.
While it used to expect the `container` as well as the application instance,
**the `container` argument was dropped** as it wasn’t actually needed. So in the
initializer, change this:

```js
{% raw %}
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application);
  });
});
{% endraw %}
```

to this:

```js
{% raw %}
Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(application);
  });
});
{% endraw %}
```

Also, as the **`login` and `logout` actions in `ApplicationRouteMixin` were
renamed to `authenticateSession` and `invalidateSession`**, in your templates
change this:

```hbs
{% raw %}
{{#if session.isAuthenticated}}
  <a {{ action="logout" }}>Logout</a>
{{else}}
  <a {{ action="login" }}>Login</a>
{{/if}}
{% endraw %}
```

to this:

```hbs
{% raw %}
{{#if session.isAuthenticated}}
  <a {{ action="invalidateSession" }}>Logout</a>
{{else}}
  <a {{ action="authenticateSession" }}>Login</a>
{{/if}}
{% endraw %}
```

Also the **`LoginControllerMixin`’s `login` action was renamed to
`authenticate`** so in your login template change this:

```hbs
{% raw %}
<form {{action login on='submit'}}>
{% endraw %}
```

to this:

```hbs
{% raw %}
<form {{action authenticate on='submit'}}>
{% endraw %}
```

These are really the only changes needed if your application is using
Ember.SimpleAuth’s default settings, the default OAuth 2.0 mechanism etc. For
other scenarios, see the
[README](https://github.com/simplabs/ember-simple-auth#readme),
[API docs](http://ember-simple-auth.com/api/) and also the examples provided in
the repository.

## Outlook

**I hope that this release can pave the way towards a stable API for
Ember.SimpleAuth.** It would also be great of course if many people came up with
authenticator and authorizer implementations for all kinds of backends to prove
the design of Ember.SimpleAuth’s strategy approach as well as to build a library
of ready-to-use strategies for the most common setups.

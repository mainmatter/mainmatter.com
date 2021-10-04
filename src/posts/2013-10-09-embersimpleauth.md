---
title: 'Ember.SimpleAuth'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces Ember.SimpleAuth, an addon for implementing a
  session mechanism, authentication and authorization for Ember.js applications.'
topic: ember
---

**Update:
[Ember.SimpleAuth 0.1.0 has been released!](/blog/2014/01/20/embersimpleauth-010)**
The information in this is (partially) outdated.

After I wrote 2
[blog](/blog/2013/06/15/authentication-in-emberjs 'the initial post')
[posts](/blog/2013/08/08/better-authentication-in-emberjs 'the second post with a refined implementation')
on implementing token based authentication in [Ember.js](http://emberjs.com)
applications and got quite some feedback, good suggestions etc., I thought it
**would be nice to pack all these ideas in an Ember.js plugin** so everybody
could easily integrate that into their applications. Now **I finally managed to
release version 0.0.1 of that plugin**:
[Ember.SimpleAuth](https://github.com/simplabs/ember-simple-auth).

<!--break-->

Instead of providing a heavyweight out-of-the-box solution with predefined
routes, controllers etc., Ember.SimpleAuth defines lightweight mixins that the
application code implements. It also **does not dictate anything with respect to
application structure, routing etc**. However, setting up Ember.SimpleAuth is
**very straight forward** and it can be **completely customized**. The
requirements on the server interface are minimal
([see the README for more information on the server side](https://github.com/simplabs/ember-simple-auth#the-server-side)).

## Using Ember.SimpleAuth

Using Ember.SimpleAuth in an application only requires a few simple steps.
First, it must be enabled which is best done in a custom initializer:

```js
Ember.Application.initializer({
  name: 'authentication',
  initialize: function (container, application) {
    Ember.SimpleAuth.setup(application);
  },
});
```

The second step is to setup the routes for logging in and out:

```js
App.Router.map(function () {
  this.route('login');
  this.route('logout');
});
```

Then, the generated **controller and route must implement the mixins provided by
Ember.SimpleAuth**:

```js
App.LoginController = Ember.Controller.extend(
  Ember.SimpleAuth.LoginControllerMixin,
);
App.LogoutRoute = Ember.Route.extend(Ember.SimpleAuth.LogoutRouteMixin);
```

Of course the application also needs a template that renders the login form:

```hbs
{% raw %}
<form {{action login on='submit'}}>
  <label for="identification">Login</label>
  {{view Ember.TextField id='identification' valueBinding='identification' placeholder='Enter Login'}}
  <label for="password">Password</label>
  {{view Ember.TextField id='password' type='password' valueBinding='password' placeholder='Enter Password'}}
  <button type="submit">Login</button>
</form>
{% endraw %}
```

At this point, everything that’s necessary for users to log in and out is set
up. Also, every AJAX request (unless it’s a cross domain request) that the
application makes will send the authentication token that is obtained when the
user logs in. **To actually protect routes so that they are only accessible for
authenticated users, simply implement the respective Ember.SimpleAuth mixin** in
the route classes:

```js
App.ProtectedRoute = Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin,
);
```

## More

There is more documentation as well as examples in the
[repository on github](https://github.com/simplabs/ember-simple-auth). Also the
**code base is quite small so I suggest to read through it** to better
understand what’s going on internally.

Patches, bug reports etc. are highly appreciated of course -
[get started by forking the project on github](https://github.com/simplabs/ember-simple-auth)!

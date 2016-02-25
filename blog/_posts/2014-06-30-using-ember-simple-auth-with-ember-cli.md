---
layout: article
section: Blog
title: "Using Ember Simple Auth with ember-cli"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

With the latest release of [Ember Simple Auth](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth&t=YzZkOWJhZGFhNjcxODNmYTAwMGY4Y2Q5YjUyOTc3YTFiNGMzMjE2NSxkVjZXdHB1dQ%3D%3D "Ember Simple Auth @ github"), using the library with [ember-cli](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fstefanpenner%2Fember-cli&t=OTJiOTE1NTNlNDFmNmFkY2UyYzJkYzAwYThhNzdjYjBhNDdkOWNhYixkVjZXdHB1dQ%3D%3D "ember-cli @ github") has become much simpler. As ember-cli in general is still pretty new to many people though, **this post describes how to setup a project using Ember Simple Auth with ember-cli**.
<!--break-->

#### Setting up the basic project

First of all you need to install [PhantomJS](http://t.umblr.com/redirect?z=http%3A%2F%2Fphantomjs.org&t=ODYyNGFhNDNiMzJmNTE1MGFmNDQ4ZjA0OTBhNmMzZmNjYWU5MGNkZCxkVjZXdHB1dQ%3D%3D), [bower](http://t.umblr.com/redirect?z=http%3A%2F%2Fbower.io&t=NGMzODhhOTVkNmM5OGZlZjc5MzM4YWViYTU1NDFlYTY1MDYzNzFiOSxkVjZXdHB1dQ%3D%3D) and of course ember-cli (Ember Simple Auth requires **at least Ember CLI 0.0.44**):

```
npm install -g phantomjs
npm install -g bower
npm install -g ember-cli
```

Then use ember-cli to create the new project:

```
ember new my-auth-app
```

At this point the basic project is set up and ready to run:

```
cd my-auth-app
ember server
```

#### Installing Ember Simple Auth

Installing Ember Simple Auth in an ember-cli project is really easy now. All you have to do is install [the ember-cli addon from npm](http://t.umblr.com/redirect?z=https%3A%2F%2Fwww.npmjs.org%2Fpackage%2Fember-cli-simple-auth&t=OWMzNDI3YTFjZTRmNWJhNTJiYjYzNGY5ZGY2ODc0Yzc5NDljMTRiNyxkVjZXdHB1dQ%3D%3D "Ember CLI Simple Auth @npm"):

```
npm install --save-dev ember-cli-simple-auth
ember generate ember-cli-simple-auth
```

This will install Ember Simple Auth’s [AMD](http://t.umblr.com/redirect?z=http%3A%2F%2Frequirejs.org%2Fdocs%2Fwhyamd.html&t=OGUxZjYyZDc0Y2FkNDliYWJhNzRiMmMzYTg1Mjg3MjEzMTBmZDFmYSxkVjZXdHB1dQ%3D%3D) distribution into the project, register the initializer so Ember Simple Auth automatically sets itself up and add itself as a dependency to the project’s `package.json`.

You can add a login route and login/logout links to verify it all actually works:

```js
// app/router.js
…
Router.map(function() {
  this.route('login');
});
…
```

```
// app/templates/application.hbs
…
{% raw  %}
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
{% endraw %}
…
```

Also implement the `ApplicationRouteMixin` in the project’s application route:

```
// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin);
```

#### Setting up authentication

To actually give the user the option to login, we need to add an authentication package for Ember Simple Auth. Let’s assume you have an OAuth 2.0 compatible server running at `http://localhost:3000`. To use that, install the [OAuth 2.0 extension library](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth%2Ftree%2Fmaster%2Fpackages%2Fember-simple-auth-oauth2&t=MTI2ODQ3OTI4MjljOWY0ODRiYjM4MTE3MzVkNTE2Njc1ZmFmZWFlYixkVjZXdHB1dQ%3D%3D "Ember Simple Auth OAuth 2.0 @ github") which again is as easy as installing the [package from npm](http://t.umblr.com/redirect?z=https%3A%2F%2Fwww.npmjs.org%2Fpackage%2Fember-cli-simple-auth-oauth2&t=NzFlZjAzMWJjNGY1NWQ1OWQzZjg4MWJjMDQ3ZTliMmQ2YmI5M2E2MCxkVjZXdHB1dQ%3D%3D "Ember CLI Simple Auth OAuth 2.0 @ npm"):

```
npm install --save-dev ember-cli-simple-auth-oauth2
ember generate ember-cli-simple-auth-oauth2
```

Like the ember-cli-simple-auth package this will setup itself so that nothing else has to be done in order to use the OAuth 2.0 functionality.

The OAuth 2.0 authentication mechanism needs a login form, so let’s create that:

```
// app/templates/login.hbs
<form {{action 'authenticate' on='submit'}}>
  <label for="identification">Login</label>
  {{input id='identification' placeholder='Enter Login' value=identification}}
  <label for="password">Password</label>
  {{input id='password' placeholder='Enter Password' type='password' value=password}}
  <button type="submit">Login</button>
</form>
```

Then implement the `LoginControllerMixin` in the login controller and make that use the OAuth 2.0 authenticator to perform the actual authentication:

```
// app/controllers/login.js
import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'simple-auth-authenticator:oauth2-password-grant'
});
```

As the OAuth 2.0 authenticator would by default use the same domain and port to send the authentication requests to that the Ember.js is loaded from you need to configure it to use `http://localhost:3000` instead:

```
// config/environment.js
if (environment === 'development') {
  …
  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: 'http://localhost:3000/token'
  }
  …
```

You also need to make sure that your server allows cross origin requests by [enabling CORS](http://t.umblr.com/redirect?z=http%3A%2F%2Fenable-cors.org&t=Y2UwM2ExYmU5YjA0NTliMGNjMzE5MjQxNGQ4ODExMWE5OWYyMTEzOCxkVjZXdHB1dQ%3D%3D) (e.g. with [rack-cors](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fcyu%2Frack-cors&t=ZmVhODhlOWZlYzNiMTkyYmFhNDc0M2M4NTZkMjA4NjdjNjg2Y2M4MSxkVjZXdHB1dQ%3D%3D "rack-cord @ github") if you’re using a rack based server).

#### Conclusion

This is how you set up an ember-cli project with Ember Simple Auth. For further documentation and examples see the [github repository](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth&t=YzZkOWJhZGFhNjcxODNmYTAwMGY4Y2Q5YjUyOTc3YTFiNGMzMjE2NSxkVjZXdHB1dQ%3D%3D "Ember Simple Auth @ github") and the [API docs for Ember Simple Auth](http://t.umblr.com/redirect?z=http%3A%2F%2Fember-simple-auth.simplabs.com%2Fember-simple-auth-api-docs.html&t=ZTAxYjhmZjU2MzFhM2VkNTRhZWE2M2I4NjM3MzczNmIyNzNlYzliYyxkVjZXdHB1dQ%3D%3D) and the [OAuth 2.0 extension library](http://t.umblr.com/redirect?z=http%3A%2F%2Fember-simple-auth.simplabs.com%2Fember-simple-auth-oauth2-api-docs.html&t=ZTIxNmU0M2I3Y2RjMTQ1NTdmN2MxMzJjNGRhMWE3ZWUzYWY1ZDRiMixkVjZXdHB1dQ%3D%3D).
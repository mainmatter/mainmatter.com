---
title: 'Using Ember Simple Auth with ember-cli'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces the release of ember-cli-simple-auth as an Ember
  CLI addon.'
topic: ember
---

With the latest release of
[Ember Simple Auth](https://github.com/simplabs/ember-simple-auth), using the
library with [ember-cli](https://github.com/ember-cli/ember-cli) has become much
simpler. As ember-cli in general is still pretty new to many people though,
**this post describes how to setup a project using Ember Simple Auth with
ember-cli**.

<!--break-->

## Setting up the basic project

First of all you need to install [PhantomJS](http://phantomjs.org),
[bower](http://bower.io) and of course ember-cli (Ember Simple Auth requires
**at least Ember CLI 0.0.44**):

```bash
npm install -g phantomjs
npm install -g bower
npm install -g ember-cli
```

Then use ember-cli to create the new project:

```bash
ember new my-auth-app
```

At this point the basic project is set up and ready to run:

```bash
cd my-auth-app
ember server
```

## Installing Ember Simple Auth

Installing Ember Simple Auth in an ember-cli project is really easy now. All you
have to do is install
[the ember-cli addon from npm](https://www.npmjs.com/package/ember-cli-simple-auth):

```bash
npm install --save-dev ember-cli-simple-auth
ember generate ember-cli-simple-auth
```

This will install Ember Simple Auth’s
[AMD](http://requirejs.org/docs/whyamd.html) distribution into the project,
register the initializer so Ember Simple Auth automatically sets itself up and
add itself as a dependency to the project’s `package.json`.

You can add a login route and login/logout links to verify it all actually
works:

```js
// app/router.js
…
Router.map(function() {
  this.route('login');
});
…
```

```hbs
{% raw %}
// app/templates/application.hbs
…
{{#if session.isAuthenticated}}
  <a {{ action 'invalidateSession' }}>Logout</a>
{{else}}
  {{#link-to 'login'}}Login{{/link-to}}
{{/if}}
…
{% endraw %}
```

Also implement the `ApplicationRouteMixin` in the project’s application route:

```js
// app/routes/application.js
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin);
```

## Setting up authentication

To actually give the user the option to login, we need to add an authentication
package for Ember Simple Auth. Let’s assume you have an OAuth 2.0 compatible
server running at `http://localhost:3000`. To use that, install the
[OAuth 2.0 extension library](https://github.com/simplabs/ember-simple-auth/blob/master/addon/authenticators/oauth2-password-grant.js)
which again is as easy as installing the
[package from npm](https://www.npmjs.com/package/ember-cli-simple-auth-oauth2):

```bash
npm install --save-dev ember-cli-simple-auth-oauth2
ember generate ember-cli-simple-auth-oauth2
```

Like the ember-cli-simple-auth package this will setup itself so that nothing
else has to be done in order to use the OAuth 2.0 functionality.

The OAuth 2.0 authentication mechanism needs a login form, so let’s create that:

```hbs
{% raw %}
// app/templates/login.hbs
<form {{action 'authenticate' on='submit'}}>
  <label for="identification">Login</label>
  {{input id='identification' placeholder='Enter Login' value=identification}}
  <label for="password">Password</label>
  {{input id='password' placeholder='Enter Password' type='password' value=password}}
  <button type="submit">Login</button>
</form>
{% endraw %}
```

Then implement the `LoginControllerMixin` in the login controller and make that
use the OAuth 2.0 authenticator to perform the actual authentication:

```js
// app/controllers/login.js
import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'simple-auth-authenticator:oauth2-password-grant',
});
```

As the OAuth 2.0 authenticator would by default use the same domain and port to
send the authentication requests to that the Ember.js is loaded from you need to
configure it to use `http://localhost:3000` instead:

```js
// config/environment.js
if (environment === 'development') {
  …
  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: 'http://localhost:3000/token'
  }
  …
```

You also need to make sure that your server allows cross origin requests by
[enabling CORS](http://enable-cors.org) (e.g. with
[rack-cors](https://github.com/cyu/rack-cors) if you’re using a rack based
server).

## Conclusion

This is how you set up an ember-cli project with Ember Simple Auth. For further
documentation and examples see the
[github repository](https://github.com/simplabs/ember-simple-auth) and the
[API docs for Ember Simple Auth](http://ember-simple-auth.com/api/) and the
[OAuth 2.0 extension library](http://ember-simple-auth.com/api/).

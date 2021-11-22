---
title: '(better) Authentication in ember.js'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte introduces an update to the mechanism for implementing a
  session, authentication and authorization in Ember.js applications.'
tags: ember
tagline: |
  <p><strong>Update:</strong><em>I released an Ember.js plugin that makes it very easy to implement an authentication system as described in this post: <a href="/blog/2013/06/15/authentication-in-emberjs">Ember.SimpleAuth</a>.</em></p> <p>When we started our first <a href="http://emberjs.com">ember.js</a> project in June 2013, one of the first things we implemented was authentication. Now, almost 2 months later, <strong>it has become clear that our initial approach was not really the best and had some shortcomings. So I implemented a better authentication</strong> (mostly based on the embercasts on authentication).</p>
---

_I’m using the latest (as of early August 2013) [ember.js](http://emberjs.com)
and [handlebars](http://handlebarsjs.com) releases in this example._

_**Update:**I changed the section on actually using the token to use
[\$.ajaxPrefilter](http://api.jquery.com/jQuery.ajaxPrefilter/) instead of a
custom ember-data adapter_

## The basics

The basic approach is still the same as in our initial implementation - we have
a **`/session` route in our Rails app that the client `POST`s its credentials to
and if those are valid gets back an authentication token** together with an id
that identifies the user’s account on the server side.

This data is stored in a _"session"_ object on the client side (while
technically there is no session in this stateless authentication mechanism, I
still call it session in absence of an idea for a better name). The
**authentication token is then sent in a header** with every request the client
makes.

## The client _"session"_

The _"session"_ object on the client side is a **plain `Ember.Object` that
simply keeps the data that is received from the server** on session creation. It
also stores the authentication token and the user’s account ID in cookies so the
user doesn’t have to login again after a page reload (As Ed points out in a
comment on the old post it’s a security issue to store the authentication token
in a cookie without the user’s permission - I think using a session cookie like
I do should be ok as it’s deleted when the browser window is closed. Of course
you could also use sth. like localStorage like Marc points out. I’m creating
this object in an initializer so I can be sure it exists (of course it might be
empty) when the application starts.

<!-- prettier-ignore -->
```js
{% raw %}
Ember.Application.initializer({
  name: 'session',

  initialize: function(container, application) {
    App.Session = Ember.Object.extend({
      init: function() {
        this._super();
        this.set('authToken', $.cookie('auth_token'));
        this.set('authAccountId', $.cookie('auth_account'));
      },

      authTokenChanged: function() {
        $.cookie('auth_token', this.get('authToken'));
      }.observes('authToken'),

      authAccountIdChanged: function() {
        var authAccountId = this.get('authAccountId');
        $.cookie('auth_account', authAccountId);
        if (!Ember.isEmpty(authAccountId)) {
          this.set('authAccount', App.Account.find(authAccountId));
        }
      }.observes('authAccountId')
    }).create();
  }
});
{% endraw %}
```

When this has run I can always access the current _"session"_ information as
`App.Session`. Notice the `.create()` at the end of the initializer that creates
an instance of the `Ember.Object` right away. When we need to **check whether a
user is authenticated we can simply check for presence of the `authToken`
property**. Of course we could add a `isAuthenticated()` method that could
perform additional checks but we didn’t have the need for that yet.

This _"session"_ object will also load the actual account record from the server
if the `authAccountId` is set
(`this.set('authAccount', App.Account.find(authAccountId));`. This allows us to
e.g. use `App.Session.authAccount.fullName` in our templates to display the
user’s name or similar data.)

To actually use the `authToken` when making server requests, **we register an
[AJAX prefilter](http://api.jquery.com/jQuery.ajaxPrefilter/) that adds the
authentication token in a header as long as the request is sent to our domain**:

```js
{% raw %}
Ember.$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  if (!jqXHR.crossDomain) {
    jqXHR.setRequestHeader(
      'X-AUTHENTICATION-TOKEN',
      App.Session.get('authToken'),
    );
  }
});
{% endraw %}
```

The Rails server can then find the authenticated user by the token in the
header:

```rb
class ApplicationController < ActionController::Base

  def current_user
    @current_user ||= begin
      auth_token = request.env['HTTP_X_AUTHENTICATION_TOKEN']
      Account.find_by(auth_token: auth_token) if !!auth_token
    end
  end

end
```

## Logging in

As described above, the login API is a simple `/session` route on the server
side that accepts the user’s login and password and **responds with either HTTP
status 401 when the credentials are invalid or a session JSON when the
authentication was successful**. On the client side we have routes for creating
and destroying the session:

<!-- prettier-ignore -->
```js
{% raw %}
App.Router.map(function() {
  this.resource('session', function() {
    this.route('new');
    this.route('destroy');
  });
});
{% endraw %}
```

The `SessionNewController` only needs one action `login` that sends the entered
credentials and acts according to the server’s response - if the server responds
successfully **it reads the session data from the response and updates the
`App.Session` object accordingly**. It also checks whether there is an attempted
transition that was intercepted due to missing authentication and retries that
if it exists (This is the case where the user tries to access a certain page
without having authenticated, is redirected to the login form, logs in and is
redirected again to the initially requested page).

<!-- prettier-ignore -->
```js
{% raw %}
App.SessionNewController = Ember.Controller.extend({
  login: function() {
    var self = this;
    var data = this.getProperties('loginOrEmail', 'password');
    if (!Ember.isEmpty(data.loginOrEmail) && !Ember.isEmpty(data.password)) {
      var postData = { session: { login_or_email: data.loginOrEmail, password: data.password } };
      $.post('/session', postData).done(function(response) {
        var sessionData = response.session || {};
        App.Session.setProperties({
          authToken: sessionData.auth_token,
          authAccountId: sessionData.account_id
        });
        var attemptedTransition = App.Session.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          App.Session.set('attemptedTransition', null);
        } else {
          self.transitionToRoute('games');
        }
      });
    }
  }
});
{% endraw %}
```

Notice that we do not handle the error case here. To have a better user
experience you would probably want to define a `.fail` handler as well that
display an error message.

The template is just a simple form (actual elements, classes etc. of course
depend on your specific application):

```hbs
{% raw %}
<form {{action login on='submit'}}>
  {{view
    Ember.TextField
    valueBinding='loginOrEmail'
    placeholder='Login or Email'
  }}
  {{view
    Ember.TextField
    valueBinding='password'
    type='password'
    placeholder='Password'
  }}
  <button class='btn'>Login</button>
</form>
{% endraw %}
```

## Logging out

Logging out is actually pretty simple as well. The **client just sends a
`DELETE` to the same `/session` route** that makes the server reset the
authentication token in the database so that the token on the client side is
invalidated. The client also deletes the saved session information in
`App.Session` so there’s no stale data.

<!-- prettier-ignore -->
```js
{% raw %}
App.SessionDestroyController = Ember.Controller.extend({
  logout: function() {
    var self = this;
    $.ajax({
      url: '/session',
      type: 'DELETE'
    }).always(function(response) {
      App.Session.setProperties({
        authToken: '',
        authAccountId: ''
      });
      self.transitionToRoute('session.new');
    });
  }
});
{% endraw %}
```

As this action should be triggered as soon as the user enters the
`/#/session/destroy` route, we have a simple route implementation that
**triggers the action upon route activation**:

<!-- prettier-ignore -->
```js
{% raw %}
App.SessionDestroyRoute = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    controller.logout();
  }
});
{% endraw %}
```

## Authenticated routes

To easily enable authentication for any route in the application, I created an
**`App.AuthenticatedRoute` that extends `Ember.Route`** and that all routes that
need to enforce user authentication can extend again:

<!-- prettier-ignore -->
```js
{% raw %}
App.AuthenticatedRoute = Ember.Route.extend({
  redirectToLogin: function(transition) {
    App.Session.set('attemptedTransition', transition);
    this.transitionTo('session.new');
  },

  beforeModel: function(transition) {
    if (!App.Session.get('authToken')) {
      this.redirectToLogin(transition);
    }
  }
});
{% endraw %}
```

Notice that `redirectToLogin` sets the `attemptedTransition` of `App.Session` so
that the user will be redirected to the initially requested page after
successfulyl logging in.

This is better authentication with ember.js - enjoy!

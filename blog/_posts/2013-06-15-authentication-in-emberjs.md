---
layout: article
section: Blog
title: "Authentication in ember.js"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

**Update:**_I released an Ember.js plugin that makes it very easy to implement an authentication system as described in this post: [Ember.SimpleAuth](http://log.simplabs.com/post/63565686488/ember-simpleauth>%20title=)._

**Update:** _After I wrote this I found out that it’s actually not the best approach to implement authentication in Ember.js… There are some things missing and some other things can be done in a much simpler way. [I wrote a summary of the (better) authentication mechanism we moved to.](http://log.simplabs.com/post/57702291669/better-authentication-in-ember-js "(better) authnetication with ember.js")_

_I’m using the latest (as of mid June 2013) [ember](https://github.com/emberjs/ember.js)/[ember-data](https://github.com/emberjs/data)/[handlebars](https://github.com/wycats/handlebars.js) code directly from the respective github repositories in this example._

<!--break-->

When we started our first project with [ember.js](http://emberjs.com), **the first thing we came across was how to implement authentication**. While all of us had implemented authentication in "normal" [Rails](http://rubyonrails.org) apps several times we initially weren’t sure how to do it in ember.js. Also information on the internet was scarce and hard to find.

The only more elaborate sample project I found was the [ember-auth](https://github.com/heartsentwined/ember-auth) plugin. While that seemed to be very complete and high quality it is also very heavy weight and I didn’t want to add such a big thing to our codebase only to implement simple authentication into our app. So I rolled my own implementation.

#### The basics

The general route to go with authentication in ember.js is to use **token based authentication** where the client submits the regular username/password credentials to the server once and if those are valid receives an authentication token in response. That token is then sent along with every request the client makes to the server. Having understood this the first thing to do is to implement a regular login form with username and password fields:

<script src="https://gist.github.com/marcoow/5796390.js"></script>

That template is backed by a route that handles the submission event and posts the data to the /session route on the server - which then responds with either status 401 or 200 and a JSON containing the authentication token and the id of the authenticated user:

<script src="https://gist.github.com/marcoow/5796405.js"></script>

I’m using a route instead of a controller here as redirecting should only be done from routes and not controllers. See e.g. [this SO post](http://stackoverflow.com/questions/11552417/emberjs-how-to-transition-to-a-router-from-a-controllers-action/11555014#11555014) for more info.

The response JSON from the server would look somehow like this in the successful login case:

<script src="https://gist.github.com/marcoow/5796414.js"></script>

At this point the client has the authentication data necessary to authenticate itself against the server. As tat authentication data would be lost every time the application on the client reloads and we don’t want to force a new login every time the user reloads the page we can simply **store that data in a cookie (of course you could use local storage etc.)**:

<script src="https://gist.github.com/marcoow/5796434.js"></script>

#### Making authenticated requests

The next step is to actually send the authentication token to the server. As the only point point of interaction between client and server in an ember.js app is **when the store adapter reads or writes data, the token has to be integrated in that adapter somehow**. As there’s not (yet) any out-off-the-box support for authentication in the [DS.RESTAdapter](https://github.com/emberjs/data/blob/master/packages/ember-data/lib/adapters/rest_adapter.js), I simply added it myself:

<script src="https://gist.github.com/marcoow/5796449.js"></script>

Now the adapter will pass along the authentication token with every request to the server. One thing that should be made sure though is that whenever the adapter sees **a [401](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#401) response which would mean that for some reason the authentication token became invalid, the session data on the client is deleted** and we require a fresh login:

<script src="https://gist.github.com/marcoow/5796465.js"></script>

#### Enforcing authentication on the client

Now that the general authentication mechanism is in place it would be cool to have a way of enforcing authentication on the client for specific routes so the user never gets to see any pages that they aren’t allowed to. This can be done by simply **introducing a custom route class that will check for the presence of a session and if none is present redirects to the login screen**. Any other routes that require authentication can then inherit from that one instead if the regular [`Ember.Route`](http://emberjs.com/api/classes/Ember.Route.html)

<script src="https://gist.github.com/marcoow/5796474.js"></script>

This is actually very similar to the concept of an `AuthController` in Rails with a [`before_filter`](http://api.rubyonrails.org/classes/AbstractController/Callbacks/ClassMethods.html#method-i-before_filter) that enforces authentication:

<script src="https://gist.github.com/marcoow/5796491.js"></script>

#### Cleanup

As the code is now spread up into a number of files and classes, I added a `Session` model:

<script src="https://gist.github.com/marcoow/5796500.js"></script>

alongside an `App.AuthManager` accompanied by a custom initializer to clean it up:

<script src="https://gist.github.com/marcoow/5796505.js"></script>

This is simple authentication with ember.js!
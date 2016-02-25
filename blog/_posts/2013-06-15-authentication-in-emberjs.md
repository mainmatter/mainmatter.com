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

_I’m using the latest (as of mid June 2013) [ember](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Femberjs%2Fember.js&t=MGIxNDJkNWYyNTkyMGQ5OWQyNGRiMjZiOTMxYWEzMWU3YmQ4MzE0NSxZY1BZU3h3NA%3D%3D "ember.js @ github")/[ember-data](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Femberjs%2Fdata&t=MWVjMzk5N2QyMTJmOWM4MDRlZDRjZjRiMjQxOWY0NmIwNGJiYzM1NCxZY1BZU3h3NA%3D%3D "ember-data @ github")/[handlebars](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fwycats%2Fhandlebars.js&t=YWNkOTYxYWZhYjQwMDk5N2VmYjZmZTM1NWE3MTI4MWUzNzczYmE1NyxZY1BZU3h3NA%3D%3D "handlebars @ github") code directly from the respective github repositories in this example._

<!--break-->

When we started our first project with [ember.js](http://t.umblr.com/redirect?z=http%3A%2F%2Femberjs.com&t=NTg0YWU2YzJjNGFiODdhZmVjNDQ1N2IyMjRlOTQ2ZGY1NDI3NGUyOSxZY1BZU3h3NA%3D%3D "ember.js"), **the first thing we came across was how to implement authentication**. While all of us had implemented authentication in “normal” [Rails](http://t.umblr.com/redirect?z=http%3A%2F%2Frubyonrails.org&t=OGVkYTZmMzRmNjg5NTQwM2MwMzI3MGYyMjM5ODE4Y2RkOTRiN2M2ZCxZY1BZU3h3NA%3D%3D "Ruby on Rails") apps several times we initially weren’t sure how to do it in ember.js. Also information on the internet was scarce and hard to find.

The only more elaborate sample project I found was the [ember-auth](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fheartsentwined%2Fember-auth&t=MTcxOGI5ZmQyMjE5ZDNlYWVlMWE0MGQzYWRmYzJjMzdkODhmZDNhYSxZY1BZU3h3NA%3D%3D "ember-auth @ github") plugin. While that seemed to be very complete and high quality it is also very heavy weight and I didn’t want to add such a big thing to our codebase only to implement simple authentication into our app. So I rolled my own implementation.

#### The basics

The general route to go with authentication in ember.js is to use **token based authentication** where the client submits the regular username/password credentials to the server once and if those are valid receives an authentication token in response. That token is then sent along with every request the client makes to the server. Having understood this the first thing to do is to implement a regular login form with username and password fields:

<script src="https://gist.github.com/marcoow/5796390.js"></script>

That template is backed by a route that handles the submission event and posts the data to the /session route on the server - which then responds with either status 401 or 200 and a JSON containing the authentication token and the id of the authenticated user:

<script src="https://gist.github.com/marcoow/5796405.js"></script>

I’m using a route instead of a controller here as redirecting should only be done from routes and not controllers. See e.g. [this SO post](http://t.umblr.com/redirect?z=http%3A%2F%2Fstackoverflow.com%2Fa%2F11555014&t=NjIyYTFkZmU4YWVkYTE1YTg3YWZkYjZmMzY4M2U2NTFiOWEzMTI5MixZY1BZU3h3NA%3D%3D "StackOverflow post on redirecting and routes/controllers") for more info.

The response JSON from the server would look somehow like this in the successful login case:

<script src="https://gist.github.com/marcoow/5796414.js"></script>

At this point the client has the authentication data necessary to authenticate itself against the server. As tat authentication data would be lost every time the application on the client reloads and we don’t want to force a new login every time the user reloads the page we can simply **store that data in a cookie (of course you could use local storage etc.)**:

<script src="https://gist.github.com/marcoow/5796434.js"></script>

#### Making authenticated requests

The next step is to actually send the authentication token to the server. As the only point point of interaction between client and server in an ember.js app is **when the store adapter reads or writes data, the token has to be integrated in that adapter somehow**. As there’s not (yet) any out-off-the-box support for authentication in the [DS.RESTAdapter](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Femberjs%2Fdata%2Fblob%2Fmaster%2Fpackages%2Fember-data%2Flib%2Fadapters%2Frest_adapter.js&t=YjljNTJiZWRmODNiODI1NzE2MjcyYWM5M2UyZGIxZTE0MjU2MTRlYSxZY1BZU3h3NA%3D%3D "source code of DS.RESTAdapter @ github"), I simply added it myself:

<script src="https://gist.github.com/marcoow/5796449.js"></script>

Now the adapter will pass along the authentication token with every request to the server. One thing that should be made sure though is that whenever the adapter sees **a [401](http://t.umblr.com/redirect?z=http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FHTTP_status%23401&t=ZDVhMDFkZWZlYzQwZDhmNjI5ZDI5MGZlZWZmYmM0NTg4ZTZhMTJhZSxZY1BZU3h3NA%3D%3D "Wikipedia page on HTTP status codes") response which would mean that for some reason the authentication token became invalid, the session data on the client is deleted** and we require a fresh login:

<script src="https://gist.github.com/marcoow/5796465.js"></script>

#### Enforcing authentication on the client

Now that the general authentication mechanism is in place it would be cool to have a way of enforcing authentication on the client for specific routes so the user never gets to see any pages that they aren’t allowed to. This can be done by simply **introducing a custom route class that will check for the presence of a session and if none is present redirects to the login screen**. Any other routes that require authentication can then inherit from that one instead if the regular [`Ember.Route`](http://t.umblr.com/redirect?z=http%3A%2F%2Femberjs.com%2Fapi%2Fclasses%2FEmber.Route.html&t=OThiOTEyN2Y0NmQ4NjA2MWY1NTBiMDdkMGU5N2QxYmM4ZjkxZTFhZCxZY1BZU3h3NA%3D%3D "API docs for Ember.Route")

<script src="https://gist.github.com/marcoow/5796474.js"></script>

This is actually very similar to the concept of an `AuthController` in Rails with a [`before_filter`](http://t.umblr.com/redirect?z=http%3A%2F%2Fapi.rubyonrails.org%2Fclasses%2FAbstractController%2FCallbacks%2FClassMethods.html%23method-i-before_filter&t=Zjg2ZTBkOWFkYWQyODEwOGI3MTEwMWU5YmE4NWIwOWRkMGNlYmI3NCxZY1BZU3h3NA%3D%3D "API docs for before_filter") that enforces authentication:

<script src="https://gist.github.com/marcoow/5796491.js"></script>

#### Cleanup

As the code is now spread up into a number of files and classes, I added a `Session` model:

<script src="https://gist.github.com/marcoow/5796500.js"></script>

alongside an `App.AuthManager` accompanied by a custom initializer to clean it up:

<script src="https://gist.github.com/marcoow/5796505.js"></script>

This is simple authentication with ember.js!
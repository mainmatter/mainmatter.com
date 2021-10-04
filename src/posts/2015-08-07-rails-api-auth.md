---
title: 'Rails API Auth'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte announces rails_api_auth, a Rails engine that implements the
  "Resource Owner Password Credentials Grant" OAuth 2.0 flow.'
topic: ruby
---

We are happy to announce the first public release of the
[`rails_api_auth` gem](https://github.com/simplabs/rails_api_auth).
`rails_api_auth` is a **lightweight Rails Engine that implements the _"Resource
Owner Password Credentials Grant"_ OAuth 2.0 flow** as well as Facebook
authentication and is **built for usage in API projects**. If you’re building a
client side application with e.g. a browser MVC like
[Ember.js](http://emberjs.com) (where you might be using
[Ember Simple Auth](https://github.com/simplabs/ember-simple-auth) which works
great with rails_api_auth of course), a mobile app or anything else that’s
backed by a Rails-based API, rails_api_auth is for you.

<!--break-->

## Why another Authentication Engine?

Of course there are lots of authentication libraries for Rails already. While
all of them are great and work well especially with traditional server rendered
applications none of them are really lightweight and simple. In fact they are
all pretty massive - all of them provide a lot more functionality than
rails_api_auth does of course though. However, when you’re building an API and
all you want is to provide a mechanism for users to exchange their login
credentials for a token and then validate that incoming requests include a valid
token in the `Authorization` header, you just don’t need most of that
functionality and could use sth. much smaller, easier to understand and debug.
In fact, rails_api_auth is basically just the controller and model plus a few
helper methods that we use in most of our Rails-based API projects. When we
realized we were reimplementing those in most projects we decided to extract
them into an engine so they could be easily reused and also shared with others.

## The _"Resource Owner Password Credentials Grant"_

The _"Resource Owner Password Credentials Grant"_ flow is really **just a
formalization of the process where the users send their login credentials to the
server and in return receive a token** (we’re using random Bearer tokens for now
but will also support JSON Web Tokens (JWTs) soon). That **token will then be
sent in the `Authorization` header** in subsequent requests so that the server
can validate the user’s identity. The engine stores these credentials and tokens
in `Login` models. Storing that data in a separate model instead of the
application’s `User` model keeps the authentication code clearly separated from
user profile data etc. and makes the engine easier to integrate. The `Login`
model can be associated to the application’s `User` model by setting the
`user_model_relation` configuration value
([see the README for more info on configuring the engine).](https://github.com/simplabs/rails_api_auth#configuration)

The _"Resource Owner Password Credentials Grant"_ flow defines 2 endpoints - one
for obtaining a token and one for revoking it (the 2nd one is actually optional
as users can be logged without any server interaction by simply deleting the
token on the client):

```
token  POST /token  oauth2#create
revoke POST /revoke oauth2#destroy
```

Both of these endpoints are already implemented in the engine. To validate that
incoming requests include a valid Bearer token, the library defines the
`authenticate!` method that is easily added as a `before_action` in
authenticated-only controllers:

```ruby
class SecretThingsController < ApplicationController

  include RailsApiAuth::Authentication

  before_filter :authenticate!

end
```

When a valid token is present and a `Login` with that token exists, the method
will save that in the `current_login` attribute so that it can be used in the
controller. If no token is present or no `Login` exists for the token, it will
respond with 401 and prevent the actual controller action from being executed.
The `authenticate!` method can also be called with a block to add custom checks
for the user’s authentication state.

## Facebook Authentication

Another common way of authenticating users that we’re using in many projects is
Facebook authentication. The typical flow for this authentication type in web
applications is opening a popup that displays Facebook’s login page and - after
that - a page where the users grants your application access to their profile
data. Once the user did that, Facebook will redirect to the web app and include
an `auth_code` in the response that the web app then takes and sends to its API
to validate it and exchange it for a Bearer token.

rails_api_auth implements the API part of that in the `POST /token` route as
well -
[see the demo project for an example of how to use it](https://github.com/simplabs/rails_api_auth-demo#facebook-authentication).

## Feedback and contributions welcome!

As rails_api_auth is quite new and not yet widely used we’re happy to get
feedback and suggestions for things we have missed. Also please **try the gem
and report bugs** as you encounter them. **Contributions and pull requests are
also appreciated** of course!

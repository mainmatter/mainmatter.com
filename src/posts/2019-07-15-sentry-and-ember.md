---
title: 'Sentry error reporting for Ember.js'
authorHandle: tobiasbieniek
tags: ember
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek explains how to set up Sentry for Ember.js applications using
  @sentry/browser instead of the now unnecessary ember-cli-sentry.'
og:
  image: /assets/images/posts/2019-07-15-sentry-and-ember/og-image.png
tagline: |
  <p>Are you confident that your apps have no bugs? Do you not need a support team because no user ever complains about something not working? Then this post is not for you!</p> <p>We use a lot of tools at simplabs to ensure reasonably high quality code, but occasionally something slips through. The important thing then is to notice and fix it quickly. This post will focus on the &quot;notice&quot; part by using <a href="https://sentry.io/">Sentry</a> error reporting in <a href="https://emberjs.com/">Ember.js</a> apps.</p>
---

## ember-cli-sentry

The [`ember-cli-sentry`][ember-cli-sentry] addon has been around since 2015 and
nicely integrates the [`raven-js`][raven-js] library with Ember.js. What is
`raven-js`? It is the official browser JavaScript client for Sentry.

Well... it **was** the official browser JavaScript client for Sentry. In 2018 it
has been replaced by [`@sentry/browser`][sentry-browser] with an entirely new
API.

What does that mean for `ember-cli-sentry`? We don't know! We have been
experimenting with `@sentry/browser` though and we are starting to think that a
dedicated Ember.js addon for Sentry might not be needed anymore. In the rest of
this post we will show you how we integrated `@sentry/browser` into one of our
apps and how to migrate from `ember-cli-sentry` to `@sentry/browser`.

## Sourcemaps

<!-- prettier-ignore -->
```
TypeError: Cannot read property 'name' of undefined
  at Object.ie [as get](/assets/vendor-394212fdd48a8a8e9508401b5be54d75.js:1347:16)
  at ? (/assets/vendor-394212fdd48a8a8e9508401b5be54d75.js:9923:46)
  at e(/assets/vendor-394212fdd48a8a8e9508401b5be54d75.js:9947:46)
  at n.filter(/assets/vendor-394212fdd48a8a8e9508401b5be54d75.js:9827:26)
  at n._performFilter(/assets/vendor-394212fdd48a8a8e9508401b5be54d75.js:9834:196)
  at n.search(/assets/vendor-394212fdd48a8a8e9508401b5be54d75.js:9793:162)
```

Sourcemaps allow you to map from compiled and minified code to the original code
you wrote in your editor. That makes it a lot easier to decipher stack traces
like the one above because it will show you the actual file and function names.

By default in Ember.js, sourcemaps are disabled for production builds. In this
case we would like to have them though, so that Sentry has access to them and
can decipher the cryptic stack traces for us. We can enable sourcemap generation
for all environments in the `ember-cli-build.js` file:

<!-- prettier-ignore -->
```js
{% raw %}
let app = new EmberApp(defaults, {
  sourcemaps: {
    enabled: true,
  },
});
{% endraw %}
```

If you now run `ember build --prod` it should generate `.map` files next to the
JavaScript files in the `dist/assets/` folder. Make sure to upload those files
to your server too, so that Sentry can access them.

In case you don't want other people to be able to read your original source code
you can also upload the sourcemaps directly to Sentry. If you use
[`ember-cli-deploy`][ember-cli-deploy] to publish your apps then you can use the
[`ember-cli-deploy-sentry`][ember-cli-deploy-sentry] addon to do this
automatically for each deployment.

## Setting up `@sentry/browser`

`ember-cli-sentry` uses an instance-initializer to automatically configure and
initialize the `raven-js` library. Those initializers are great for certain
cases, but it could happen that a bug in a different initializer is triggered
before the Sentry client was setup to listen for errors. For this reason we will
not use an initializer to setup `@sentry/browser`.

Instead, we will adjust our `app/app.js` file to initialize `@sentry/browser`
right before we start the app:

<!-- prettier-ignore -->
```js
{% raw %}
import { startSentry } from './sentry';

startSentry();

const App = Application.extend({
  // ...
});
{% endraw %}
```

From the above snippet you can see that we chose to put the Sentry-specific
logic into a separate file: `app/sentry.js`. That file looks roughly like this:

<!-- prettier-ignore -->
```js
{% raw %}
import * as Sentry from '@sentry/browser';
import { Ember } from '@sentry/integrations/esm/ember';

import config from './config/environment';

export function startSentry() {
  Sentry.init({
    ...config.sentry,
    integrations: [new Ember()],
  });
}
{% endraw %}
```

First we import the `@sentry/browser` library into the file using a
[wildcard import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Import_an_entire_module's_contents)
and we import their official Ember.js plugin from the `@sentry/integrations`
package:

<!-- prettier-ignore -->
```js
{% raw %}
import * as Sentry from '@sentry/browser';
import { Ember } from '@sentry/integrations/esm/ember';
{% endraw %}
```

We are using `@sentry/integrations/esm/ember` here instead of just
`@sentry/integrations` because we want to make sure that we only bundle the
Ember.js plugin, but not e.g. the Vue plugin too.

At this point you might be wondering: but, we never installed those libraries?!
And you are totally right! At this point we need to install the libraries using
your favorite JavaScript package manager. In this case we'll use `yarn`:

<!-- prettier-ignore -->
```bash
yarn add @sentry/browser @sentry/integrations
```

To make those available in the app we'll also need `ember-auto-import`, which
makes importing from `node_modules` much easier:

<!-- prettier-ignore -->
```bash
yarn add --dev ember-auto-import
```

Now we have everything we need installed and can go on with the snippet above.
You can see that the `Sentry.init()` call uses the `sentry` object from your
application configuration, so let's add that to the `config/environment.js`
file:

<!-- prettier-ignore -->
```js
{% raw %}
module.exports = function(environment) {
  let ENV = {
    sentry: {
      environment,
    }
  };

  if (environment === 'production') {
    ENV.sentry.dsn = 'https://<key>@sentry.io/<project>';
  }

  return ENV;
}
{% endraw %}
```

... and we're done! `@sentry/browser` is now sufficiently set up and will report
any errors on the page to the server configured in the `dsn` property above.

## Filtering Errors

Some errors we just don't care about. One example of that is the
`TransitionAborted` error that the Ember.js router reports when a route
transition was cancelled. We can ignore such errors by implementing the
[`beforeSend()`](https://docs.sentry.io/error-reporting/configuration/filtering/?platform=browsernpm#before-send)
hook of `@sentry/browser`:

<!-- prettier-ignore -->
```js
{% raw %}
Sentry.init({
  // ...

  beforeSend(event, hint) {
    let error = hint.originalException;

    // ignore aborted route transitions from the Ember.js router
    if (error && error.name === 'TransitionAborted') {
      return null;
    }

    return event;
  },
});
{% endraw %}
```

## Manually Reporting Errors

With `ember-cli-sentry` you could use the `raven` service to manually report
messages or exceptions to Sentry. With `@sentry/browser` you can do the same:

<!-- prettier-ignore -->
```js
{% raw %}
import * as Sentry from '@sentry/browser';

Sentry.captureMessage('Something is broken! 😱');

Sentry.captureException(new Error('with stack trace!! ✨'));
{% endraw %}
```

## Adding Additional Context

Sentry, by default, records the IP of the user that has experienced the error.
But when your app has user accounts and an authentication system, it is much
more useful to know which specific user this has happened to. `@sentry/browser`
allows us to add additional context to the events it sends to the server.

We could do that manually in the `beforeSend()` hook, but it is much easier to
use the
[`configureScope()`](https://docs.sentry.io/enriching-error-data/scopes/?platform=browsernpm#configuring-the-scope)
function for this:

<!-- prettier-ignore -->
```js
{% raw %}
Sentry.configureScope(scope => {
  scope.setUser({
    id: 42,
    email: "john.doe@example.com"
  });
});
{% endraw %}
```

This will automatically add the user information for all errors/events that
follow after this call. If you only want to add such information for a single
event you can use the
[`withScope()`](https://docs.sentry.io/enriching-error-data/scopes/?platform=browsernpm#local-scopes)
function instead.

## Testing

We could mock the `raven` service of `ember-cli-sentry` in tests like this:

<!-- prettier-ignore -->
```js
{% raw %}
this.owner.register('service:raven', Service.extend({
  captureException(error) {
    // ...
  }
}));
{% endraw %}
```

But with `@sentry/browser` this becomes a little more complicated since there is
no service anymore that could be mocked like that. We have experimented with
this and found that pushing an additional scope on the stack and configuring a
mock client for that scope seems to result in a useful way to assert whether an
exception was correctly reported.

The details of this require its own blog post though, since they are a little
less straight-forward than what we described above.

If you have questions, want to know more or need help setting all of this up for
your apps please [contact us][contact]. We're happy to help!

[ember-cli-sentry]: https://github.com/ember-cli-sentry/ember-cli-sentry
[raven-js]:
  https://github.com/getsentry/sentry-javascript/tree/master/packages/raven-js
[sentry-browser]:
  https://github.com/getsentry/sentry-javascript/tree/master/packages/browser
[ember-cli-deploy]: https://github.com/ember-cli-deploy/ember-cli-deploy
[ember-cli-deploy-sentry]: https://github.com/dschmidt/ember-cli-deploy-sentry
[ember-simple-auth]: https://github.com/simplabs/ember-simple-auth
[contact]: https://simplabs.com/contact/

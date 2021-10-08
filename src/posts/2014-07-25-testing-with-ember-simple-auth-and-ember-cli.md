---
title: "Testing with Ember Simple Auth and Ember CLI"
authorHandle: marcoow
bio: "Founding Director of simplabs, author of Ember Simple Auth"
description: "Marco Otte-Witte explains how to test Ember CLI applications using
  ember-cli-simple-auth with the testing package ember-cli-simple-auth-testing."
tags: ember
---

[The last blog post](/blog/2014/06/30/using-ember-simple-auth-with-ember-cli "Using Ember Simple Auth with ember-cli")
showed how to use
[Ember Simple Auth](https://github.com/simplabs/ember-simple-auth) with
[Ember CLI](https://github.com/ember-cli/ember-cli) to implement session
handling and authentication. **This post shows how to test that code**.

<!--break-->

## The testing package

First of all **install the new
[ember-cli-simple-auth-testing package](https://www.npmjs.com/package/ember-cli-simple-auth-testing)**:

```bash
npm install --save-dev ember-cli-simple-auth-testing
ember generate ember-cli-simple-auth-testing
```

**This package adds test helpers to the application** (unless it’s running with
the `production` environment) that make it easy to authenticate and invalidate
the session in tests without having to stub server responses etc. To make these
helpers available to all tests, import them in `tests/helpers/start-app.js`:

```js
tests/helpers/start-app.js:
…
import 'simple-auth-testing/test-helpers';

export default function startApp(attrs) {
…
```

## Configuring the `test` environment

The next step is to configure the `test` environment. As the tests should be
isolated and leave no traces of any kind so that subsequent tests don’t have
implicit dependencies on the ones that have run earlier, Ember Simple Auth’s
default `localStorage` store cannot be used as that would leave data in the
`localStorage`. **Instead configure the
[ephemeral store](http://ember-simple-auth.com/api/classes/EphemeralStore.html)
to be used in the `test` environment**:

```js
// config/environment.js
if (environment === "test") {
  ENV["simple-auth"] = {
    store: "simple-auth-session-store:ephemeral",
  };
}
```

The ephemeral store stores data in memory and thus will be completely fresh for
every test so that tests cannot influence each other.

## Adding the Tests

Now everything is set up and a test can be added. To e.g. test that a certain
route can only be accessed when the session is authenticated, add tests like
these (notice the use of the test helpers `authenticateSession` and
`invalidateSession`):

```js
test("a protected route is accessible when the session is authenticated", function () {
  expect(1);
  authenticateSession();
  visit("/protected");

  andThen(function () {
    equal(currentRouteName(), "protected");
  });
});

test("a protected route is not accessible when the session is not authenticated", function () {
  expect(1);
  invalidateSession();
  visit("/protected");

  andThen(function () {
    notEqual(currentRouteName(), "protected");
  });
});
```

This is how easy it is to test session handling and authentication with Ember
Simple Auth and Ember CLI. The full example project can be
[found on github](https://github.com/simplabs/ember-simple-auth-example)

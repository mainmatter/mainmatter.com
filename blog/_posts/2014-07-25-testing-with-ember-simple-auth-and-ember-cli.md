---
layout: article
section: Blog
title: "Testing with Ember Simple Auth and Ember CLI"
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

[The last blog post](http://log.simplabs.com/post/90339547725/using-ember-simple-auth-with-ember-cli "Using Ember Simple Auth with ember-cli") showed how to use [Ember Simple Auth](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-simple-auth&t=ZmM4MGVkMWQxMWVhOTNhYjc3YzkzNzg1MDg5NjBlMzhiNDk0NzFkNSxROWdOazNNeg%3D%3D) with [Ember CLI](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fstefanpenner%2Fember-cli&t=NjM0MGJhMWU0YWE2MjU0OWY2MmIxOTJhN2UzZDk5ZWI1MTM3MTI4MixROWdOazNNeg%3D%3D) to implement session handling and authentication. **This post shows how to test that code**.

<!--break-->

#### The testing package

First of all **install the new [ember-cli-simple-auth-testing package](http://t.umblr.com/redirect?z=https%3A%2F%2Fwww.npmjs.org%2Fpackage%2Fember-cli-simple-auth-testing&t=MDQxZjE0NzQyNDcwNjg4ZjU1OTI0NTUwYWU4YzAzNjk5YTA3MjM5ZCxROWdOazNNeg%3D%3D)**:

```bash
npm install --save-dev ember-cli-simple-auth-testing
ember generate ember-cli-simple-auth-testing
```

**This package adds test helpers to the application** (unless it’s running with the `production` environment) that make it easy to authenticate and invalidate the session in tests without having to stub server responses etc. To make these helpers available to all tests, import them in `tests/helpers/start-app.js`:

```js
tests/helpers/start-app.js:
…
import 'simple-auth-testing/test-helpers';

export default function startApp(attrs) {
…
```

#### Configuring the `test` environment

The next step is to configure the `test` environment. As the tests should be isolated and leave no traces of any kind so that subsequent tests don’t have implicit dependencies on the ones that have run earlier, Ember Simple Auth’s default `localStorage` store cannot be used as that would leave data in the `localStorage`. **Instead configure the [ephemeral store](http://t.umblr.com/redirect?z=http%3A%2F%2Fember-simple-auth.simplabs.com%2Fember-simple-auth-api-docs.html%23SimpleAuth-Stores-Ephemeral&t=NzQ0YTEzNTVhMTMyNmM3ZjQzZmQ5YmI1NDk0ZWMxY2YyNjFhM2Y2OCxROWdOazNNeg%3D%3D) to be used in the `test` environment**:

```js
// config/environment.js
if (environment === 'test') {
  ENV['simple-auth'] = {
    store: 'simple-auth-session-store:ephemeral'
  }
}
```

The ephemeral store stores data in memory and thus will be completely fresh for every test so that tests cannot influence each other.

#### Adding the Tests

Now everything is set up and a test can be added. To e.g. test that a certain route can only be accessed when the session is authenticated, add tests like these (notice the use of the test helpers `authenticateSession` and `invalidateSession`):

```js
test('a protected route is accessible when the session is authenticated', function() {
  expect(1);
  authenticateSession();
  visit('/protected');

  andThen(function() {
    equal(currentRouteName(), 'protected');
  });
});

test('a protected route is not accessible when the session is not authenticated', function() {
  expect(1);
  invalidateSession();
  visit('/protected');

  andThen(function() {
    notEqual(currentRouteName(), 'protected');
  });
});
```

This is how easy it is to test session handling and authentication with Ember Simple Auth and Ember CLI. The full example project can be [found on github](http://t.umblr.com/redirect?z=https%3A%2F%2Fgithub.com%2Fsimplabs%2Fember-cli-simple-auth-example&t=ZjQ0ODFmZDE5ZjFhYjdjMmZkMzVkZDllZTA3MTJkMmNiNzdlZDRlYixROWdOazNNeg%3D%3D)

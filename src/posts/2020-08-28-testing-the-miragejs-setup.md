---
title: 'Testing your Mirage.js setup'
authorHandle: tobiasbieniek
tags: ember
bio: 'Senior Frontend Engineer'
description:
  'Tobias Bieniek explains how to write tests for your Mirage.js mock API setup.'
og:
  image: /assets/images/posts/2020-08-28-testing-the-miragejs-setup/og-image.png
tagline: |
  <p><a href="https://miragejs.com/">Mirage.js</a> is a universal library to mock out HTTP-based APIs. It has proven quite useful to us in several client projects, where it helped us write a lot of acceptance tests in a concise, but flexible manner.</p> <p>The issue with tools like this is that you are not testing &quot;the real API&quot; though. This is where end-to-end tests are useful, but since those kinds of tests are quite slow and complex it would be quite costly to use them for all the kinds of tests in a modern web application.</p> <p>One solution to some of the challenges of using a mock API is to test it and make sure it matches what you would expect from your real API. In this blog post we will show you how we started writing tests for our Mirage.js setup and why it might be useful for you too.</p>
---

![illustration of a camel in front of pyramids](/assets/images/posts/2020-08-28-testing-the-miragejs-setup/illustration.svg#full)

## Where do we put those tests?

Before we start writing tests we need to figure out where to put all those new
tests. In the case of an Ember.js app there is a top-level `tests` folder, where
these new tests would probably feel right at home. But inside of the folder
there are only `acceptance`, `helpers`, `integration`, and `unit` subfolders.
None of that really matches what we're building here so we decided to put all of
our Mirage-related tests into a `tests/mirage/` folder. Note that
"Mirage-related" means the tests that are testing our Mirage.js setup, not the
other tests that are just **using** the setup.

## Testing `GET` Requests

Let's start with a simple example. We have created a `user` model in Mirage.js,
and a corresponding `this.get('/users/:id')` shorthand route handler. Now we
want to check if the serialization layer in Mirage.js works as expected. For
that we will create a new test file `tests/mirage/user/get-test.js`:

```js
{% raw %}
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import fetch from 'fetch';

module('Mirage | User', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  module('GET /users/:id', function () {
    test('returns the requested user', async function (assert) {
      let user = this.server.create('user', {
        email: 'johnny@dee.io',
        firstName: 'John',
        lastName: 'Doe',
      });

      let response = await fetch(`/users/${user.id}`);
      assert.equal(response.status, 200);

      let responsePayload = await response.json();
      assert.deepEqual(responsePayload, {
        user: {
          id: 1,
          email: 'johnny@dee.io',
          first_name: 'John',
          last_name: 'Doe',
        },
      });
    });
  });
});
{% endraw %}
```

You can see here that we are first creating the test resource in the Mirage.js
database (the `server.create()` call), and then we use the regular `fetch()` API
to perform a network request and see what Mirage.js returns. We check if the
correct HTTP status code is returned and then compare the resulting JSON payload
with our expectation.

You may have noticed that we hardcoded the `id` in this example. This works in
simple cases like this, but if, for example, your API is using random UUIDs then
hardcoding things like this just doesn't work. What we could use instead is:
`id: user.id`.

## `matchJson()`

When writing such API tests it can often happen that `assert.deepEqual()` just
does not provide enough flexibility. To resolve this problem we have integrated
the [match-json] JS library into our tests, which makes assertions against
nested values in the JSON payload much easier to write.

[match-json]: https://github.com/ozkxr/match-json

Inside the `tests/test-helper.js` file we added the following snippet:

```js
{% raw %}
/* globals QUnit */

import match from 'match-json';

QUnit.assert.matchJson = function (actual, expected, message) {
  let result = match(actual, expected);
  this.pushResult({ result, actual, expected, message });
};
{% endraw %}
```

This imports the `match-json` library, and introduces a new type of assertion on
the `assert` object that is available in QUnit tests. We can now write
assertions like:

```js
{% raw %}
assert.matchJson(responsePayload, {
  user: {
    id: Number,
    email: (value) => isEmail(value),
    first_name: 'John',
    last_name: 'Doe',
  },
});
{% endraw %}
```

## Testing Edge Cases

One advantage of testing the Mirage.js setup is that we can make sure that edge
cases also work similar to the production API. For example, if we want to ensure
that our Mirage.js setup returns a "404 Not Found" HTTP status if the requested
user does not exist, we can skip the `server.create()` call at the start of the
test, perform the `fetch()` request, and then check for the expected
`response.status` value:

```js
{% raw %}
test('returns HTTP 404 if the requested user does not exist', async function (assert) {
  let response = await fetch('/users/42');
  assert.equal(response.status, 404);
});
{% endraw %}
```

## Testing `PUT` requests

Similar to read-only `GET` requests, we can also test e.g. `PUT` requests, that
mutate the existing resource:

```js
{% raw %}
module('GET /users/:id', function () {
  test('returns the requested user', async function (assert) {
    let user = this.server.create('user', {
      email: 'johnny@dee.io',
      firstName: 'John',
      lastName: 'Doe',
    });

    let response = await fetch(`/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        user: {
          first_name: 'Joe',
        },
      }),
    });
    assert.equal(response.status, 200);

    let responsePayload = await response.json();
    assert.deepEqual(responsePayload, {
      user: {
        id: 1,
        email: 'johnny@dee.io',
        first_name: 'Joe',
        last_name: 'Doe',
      },
    });
  });
});
{% endraw %}
```

You can see that the test looks fairly similar to the `GET` request test, except
that pass an options object to the `fetch()` function, where we specify that
this is a `PUT` request, and what the request payload will be.

Similar strategies can also be applied for `DELETE` and `POST` requests, but we
will leave that as an exercise for our readers... 😉

Finally, if you want more information on how we make sure that our mock APIs
always match the production API or you need more help implementing these things
in your own project, please [contact us]! 👋

[contact us]: https://simplabs.com/contact/

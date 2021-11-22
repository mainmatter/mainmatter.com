---
title: High Level Assertions with qunit-dom
authorHandle: tobiasbieniek
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek introduces qunit-dom, an extension for qunit that allows
  writing more expressive and less complex UI tests using high level DOM
  assertions.'
tags: javascript
tagline: |
  <p>At <a href="https://emberfest.eu/">EmberFest</a> this year we presented and released <a href="https://github.com/simplabs/qunit-dom"><code>qunit-dom</code></a>. A plugin for <a href="https://qunitjs.com/">QUnit</a> providing High Level DOM Assertions with the goal to reduce test complexity for all QUnit users. This blog post will show you how to write simpler tests using <code>async/await</code> and <code>qunit-dom</code>.</p>
---

As an introduction to what this means let's start with an example template for
an Ember app that we will write a test for:

```handlebars
{% raw %}
<h1 class='title {{if username 'has-username'}}'>
  {{#if username}}
    Welcome to Ember,
    <strong>{{username}}</strong>!
  {{else}}
    Welcome to Ember!
  {{/if}}
</h1>
{% endraw %}
```

From the template above you can see that we have essentially two states that we
need to test: one with and one without a `username` property being set.

## Status Quo

An acceptance test for such a template could look roughly like this:

```js
{% raw %}
test('frontpage should be welcoming', function (assert) {
  visit('/');

  andThen(function () {
    assert.equal(find('h1.title').textContent.trim(), 'Welcome to Ember!');
    assert.notOk(find('h1.title').classList.contains('has-username'));
  });

  fillIn('input.username', 'John Doe');

  andThen(function () {
    assert.equal(
      find('h1.title').textContent.trim(),
      'Welcome to Ember,\n    John Doe!',
    );
    assert.ok(find('h1.title').classList.contains('has-username'));
  });
});
{% endraw %}
```

First we will `visit` the index page `andThen` check if the welcome message
matches our expectation. Next we will `fill` an `<input>` field with a custom
`username` like "John Doe" `andThen` finally we will check if the welcome
message was updated correctly.

## Promise chains

If you've used [Ember.js](https://emberjs.com/) for some time you will probably
be used to the `andThen` blocks above. One of the reasons for them to exist is
that Ember.js is older than the `Promise` implementation that came with ES6 and
before that existed there was already a need for handling async behavior in
tests.

Since Ember.js has kept up very well with the latest developments in JavaScript
you can also use a `Promise` chain instead of the `andThen` blocks which would
look like this:

```js
{% raw %}
test('frontpage should be welcoming', function (assert) {
  return visit('/')
    .then(function () {
      assert.equal(find('h1.title').textContent.trim(), 'Welcome to Ember!');
      assert.notOk(find('h1.title').classList.contains('has-username'));

      return fillIn('input.username', 'John Doe');
    })
    .then(function () {
      assert.equal(
        find('h1.title').textContent.trim(),
        'Welcome to Ember,\n    John Doe!',
      );
      assert.ok(find('h1.title').classList.contains('has-username'));
    });
});
{% endraw %}
```

While that code makes it more obvious that we are dealing with asynchronous code
here, it also make the code a little harder to read. Which is one of the reasons
why a lot of Ember developers still prefer the `andThen` blocks over using
`Promise` chains.

## async/await

In one of the recent changes to the JavaScript language (or ECMAScript to be
precise) two new keywords were introduced to simplify dealing with `Promises`:
`async` and `await`.

Whenever you mark a `function` as `async` it will automatically return a
`Promise` and once you `return` something from that function it will `resolve`
that `Promise`. Similarly if you `throw` an error it will `reject` the
`Promise`.

But the real power comes with the `await` keyword that can only be used inside
of `async` functions. Using `await` you can wait on another `Promise` before
resolving or rejecting the `Promise` of your own `async` function.

That description was pretty abstract so let's look at an example using the
`Promise` chain above:

```js
{% raw %}
test('frontpage should be welcoming', async function (assert) {
  await visit('/');

  assert.equal(find('h1.title').textContent.trim(), 'Welcome to Ember!');
  assert.notOk(find('h1.title').classList.contains('has-username'));

  await fillIn('input.username', 'John Doe');

  assert.equal(
    find('h1.title').textContent.trim(),
    'Welcome to Ember,\n    John Doe!',
  );
  assert.ok(find('h1.title').classList.contains('has-username'));
});
{% endraw %}
```

As you can see this looks a lot more readable than what we had before and almost
like the synchronous code we usually write.

The assertions (the lines starting with `assert.`) however are still quite hard
to read, and it takes a short while to figure out what the intent of that
assertion was.

## chai and chai-dom

If you're using [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/) to
write your tests, you are already used to more readable assertions since Chai
emphasizes an "expressive language and readable style" for their assertions.

Fortunately for Chai there is a plugin called
[`chai-dom`](https://github.com/nathanboktae/chai-dom) which provides even
better assertions so that we could rewrite our assertions above to something
like:

```js
{% raw %}
expect(find('h1.title')).to.have.text('Welcome to Ember!');
expect(find('h1.title')).to.have.class('has-username');

// ...

expect(find('h1.title')).to.have.text('Welcome to Ember,\n    John Doe!');
expect(find('h1.title')).to.have.class('has-username');
{% endraw %}
```

`chai-dom` is also supported by default in `ember-cli-chai`, so if you used
`ember-cli-chai` today you only need to `npm install --save-dev chai-dom`,
restart Ember CLI and now you can use the additional assertions that `chai-dom`
provides.

## qunit-dom

While `ember-cli-chai` also works with QUnit it is essentially just a hack and
not really supported properly by QUnit or Chai so be careful if you're using it.

As we were getting more and more annoyed by the hard-to-read assertions when
using QUnit we were starting to wonder if it would be possible to build
something like `chai-dom` but for QUnit instead and how that would look like.
After a bit of brainstorming we figured we would want our assertions to look
roughly like this:

```js
{% raw %}
assert.dom('h1.title').hasText('Welcome to Ember!');
assert.dom('h1.title').doesNotHaveClass('has-username');

// ...

assert.dom('h1.title').hasText('Welcome to Ember, John Doe!');
assert.dom('h1.title').hasClass('has-username');
{% endraw %}
```

Compared to what we started with this:

- automatically finds the correct element on the `document` (or `#ember-testing`
  element) based on the selector passed into the `dom()` function
- collapses whitespace according to the HTML spec to get rid of the irrelevant
  `\n` part of the expected string
- provides readable high level assertions for the most common checks on DOM
  elements

As you might have figured out by now we've not just planned how it could look,
we've also built and released it at <https://github.com/simplabs/qunit-dom>.

One additional advantage for Ember.js users is that it automatically hooks
itself into the build pipeline of your projects, so all you need to do is
`ember install qunit-dom`, and then you can immediately start using it!

You can find examples of what assertions are available in the
[README](https://github.com/simplabs/qunit-dom#qunit-dom) of the project and
even more information in the
[API reference](https://github.com/simplabs/qunit-dom/blob/master/API.md).

## qunit-dom-codemod

During the EmberFest conference we realized that while a lot of people would
probably appreciate what we had built, nobody would go over their thousands of
existing assertions and rewrite them all to use `qunit-dom`. Since a lot of the
existing assertions in our client projects followed similar patterns we figured
it might be possible to build a
[codemod](https://medium.com/airbnb-engineering/turbocharged-javascript-refactoring-with-codemods-b0cae8b326b9)
that did most of the rewriting automatically for us.

After that initial thought we started working and after only a few minutes we
already had a working proof-of-concept including passing tests. Since then we
have put in some more work into the codemod and are happy to share it with you
at <https://github.com/simplabs/qunit-dom-codemod>.

All you need to do is install `jscodeshift` (the thing that runs the codemod):

```
npm install -g jscodeshift
```

and then run the codemod e.g. on your `tests` folder:

```
jscodeshift -t https://raw.githubusercontent.com/simplabs/qunit-dom-codemod/master/qunit-dom-codemod.js ./tests/
```

## Conclusion

Moving the tests to `async/await` and `qunit-dom` makes them a lot more readable
and easier to understand for new developers and is just a few keystrokes away if
you're already using Ember.js for your frontend projects. If you need help
refactoring your tests or even your production code to be more structured and
understandable feel free to [contact us](/contact/).

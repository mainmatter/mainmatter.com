---
title: "Wrapping promises in Ember: an overview"
authorHandle: lolmaus
tags: ember
bio: "Andrey Mikhaylov"
description:
  "There quite a few ways to work with promises in EmberJS, which one is right
  for you?"
og:
  image: /assets/images/posts/2022-10-12-making-a-strategic-bet-on-rust/og-image.jpg
tagline: |
  <p>Every frontend developer has to deal with promises in every app, and the most typical case
  for them is fetching data. It's the date we're interested in, not fetching. Promises are notorious
  for not providing easy access to data and error. There are a number of ways to work around that,
  let's look into them:</p>

  <ul>
    <li><a href="#vanilla-promise">vanilla Promise</a>;
    <li><a href="#promiseproxymixin">PromiseProxyMixin</a>;
    <li><a href="#ember-concurrency">Ember Concurrency</a>;
    <li><a href="#ember-promise-helpers">Ember Promise Helpers</a>;
    <li><a href="#ember-async-data-js">Ember Async Data via JS</a>;
    <li><a href="#ember-async-data-template">Ember Async Data via template helpers</a>;
  </ul>
---

## The most common use case

Typically, we already have some method that returns a promise, so we don't have
to deal with the `new Promise()` constructor:

```js
this.myService.getData(); // => Promise<Data>
```

In its template, the component needs convenient access to the following values:

- the fetched data;
- the error object in case the request fails;
- the state of the promise:
  - is running;
  - has resolved;
  - has errored.

Addtitionally, I want the following functionality in this component:
- the promise should start automatically when the component is rendered;
- the user should be able to restart a promise after it failed.

Here's a boilerplate:

```hbs
{% raw %}{{#if this.PROMISE_IS_PENDING}}
  Loading...
{{else if this.PROMISE_HAS_RESOLVED}}
  {{this.PROMISE_RESOLVED_VALUE.firstName}}
{{else if this.HAS_PROMISE_REJECTED}}
  Something went wrong:
  {{format-error this.PROMISE_ERROR}}.

  <button {{on "click" this.PROMISE_RETRY_ACTION}}>Retry</button>
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

The challenge is that Promises are
a [thing-in-itself](https://en.wikipedia.org/wiki/Thing-in-itself), if you
excuse an improper use of a philosopical term. 😬 Accessing these values is
tricky.

Let's walk through a few ways taht make it possible.



## Criteria

I'm gonna compare promise wrappers using the following criteria:

- **Dependency size**: the size of dependencies you have to pull.
- **Boilerplate**: how much code you need to write to make it work.
- **Autostart**: whether the promise starts automatically when accessed from a
  template.
- **Restart**: how easy it is to restart the promise.
- **Modern**: how soon this approach will be phased out.
- **Hidden complexity**: the amount of black box black magic that you need to be
  aware of to avoid frustration.
- **Auto cleanup**: takes care of cleanup when the parent object is destroyed.
- **Additional**: extra features result in a higher score, extra trouble results in a lower score.



## Vanilla Promise

First, let's see how it's done without any additional tools.

The traditional way of accessing the values is with `.then`:

```js
this.myService.getData().then(data => (this.data = data));
```

The modern way is to use `await`:

```js
this.data = await this.myService.getData();
```

The latter seems much more elegant, but only until we access values other than
data.

Additionally, we have to:

- start the promise;
- make sure that the promise callback is not mutating the component after it is
  destroyed.

The resulting code is rather verbose:

```js
class MyComponent extends Component {
  @service myService;

  @tracked data;
  @tracked error;
  @tracked isPending = false;

  get isComplete() {
    return this.data !== undefined;
  }

  get isError() {
    return this.error !== undefined;
  }

  constructor() {
    super();
    this.getData();
  }

  // Traditional then syntax
  @action
  getData() {
    this.data = undefined;
    this.error = undefined;
    this.isPending = true;

    this.myService.getData()
      .then(data => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.data = data;
        }
      })
      .catch(error => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.error = error;
        }
      .finally(() => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.isPending = false;
        }
      });
  }

  // Modern await syntax
  @action
  async getData() {
    this.data = undefined;
    this.error = undefined;
    this.isPending = true;

    try {
      this.data = await this.myService.getData();
    } catch(error) {
      this.error = error;
    } finally {
      this.isPending = false;
    }
  }
}
```

Finally, we can access promise values in a template:

```hbs
{% raw %}
{{#if this.isPending}}
  Loading...
{{else if this.isComplete}}
  {{this.data.firstName}}
{{else if this.isError}}
  Something went wrong:
  {{format-error this.error}}.

  <button {{on "click" this.getData}}>Retry</button>
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```
The advantages of this approach are:

1. 💚 **Dependency size**: no extra dependencies.
2. 💚 **Modern**: vanilla JS is understandable by any frontend developer and never becomes obsolete.
3. 💚 **Hidden complexity**: no hidden complexity, everything is on the surface.

The vanilla promise approach has a number of bitter disadvantages:

1. 💔 **Boilerplate**: requires a lot of boilerplate code.
2. 💔 **Autostart**: need to start the promise manually.
3. 💛 **Restart**: can be restarted with some extra boilerplate.
4. 💔 **Auto cleanup**: need to manually check for `isDestroying` and `isDestroyed` inside promise callbacks.
5. 💔 **Additional**: When several promises need to be dealt with in one class, the code gets mixed up and hard to maintain.
6. 💔 **Additional**: Need to work around the promise callback mutating the component after it is destroyed.
7. 💔 **Additional**: Prone to bugs, requires tests which may and will get repetitive as you implement more requests.

On top of that, you must be very careful when applying this approach in an older Ember codebase that uses `set`. If the promise resolves when the parent object has been destroyed (for example, a Classic Ember component has been removed from the page or an Ember Data record was unloaded), Ember would throw an assertion error. To work around that, you must do extra checks:

```js
try {
  const data = await this.myService.getData({ shouldFail });

  if (!this.isDestroying && !this.isDestroyed) {
    this.set('data', data);
  }
} catch (error) {
  if (!this.isDestroying && !this.isDestroyed) {
    this.set('error', error);
  }
} finally {
  if (!this.isDestroying && !this.isDestroyed) {
    this.set('isPending', false);
  }
}
```

## PromiseProxyMixin

`PromiseProxyMixin` was a very convenient way of wrapping promises in Classic
Ember.

```js
import EmberObject from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

// An ObjectProxy variant of this is available as `import { PromiseObject } from '@ember-data/store';`
const PromiseProxyObject = EmberObject.extend(PromiseProxyMixin);

class MyComponent extends Component {
  @service myService;

  @cached
  get promiseProxy() {
    const promise = this.myService.getData(); // Sync!
    return PromiseProxyObject.create({ promise });
  }
}
```

To access the values, `PromiseProxyMixin` exposes a number of properties:

```hbs
{% raw %}
{{#if this.promiseProxy.isPending}}
  Loading...
{{else if this.promiseProxy.isFulfilled}}
  {{this.promiseProxy.content.firstName}}
{{else if this.promiseProxy.isRejected}}
  Something went wrong:
  {{format-error this.promiseProxy.reason}}.
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

In order to restart the promise, we create an action that assigns a new promise to a tracked property, then a cached getter wraps it into `PromiseProxyMixin`:

```js
export default class PromiseProxyMixinComponent extends Component {
  @service('my-service') myService;

  @tracked 

  @cached
  get promiseProxy() {
    if (!this._promise) {
      this._promise = this.myService.getData(); // Sync!
    }

    return PromiseProxyObject.create({ promise: this._promise });
  }

  restart = (shouldFail = false) => {
    this._promise = this.myService.getData({ shouldFail }); // Sync!
  };
}
```

Note that the tracked property has an initial value, that's how this property starts when the Glimmer component is inserted.

The advantages of this approach are:

1. 💚 **Dependency size**: `PromiseProxyMixin` is part of Ember, so no extra dependencies.
2. 💚 **Boilerplate**: very concise code, zero boilerplate, declarative code.
3. 💚 **Autostart**: Thanks to a cached getter, the promise starts automatically when the template
   is rendering.
4. 💚 **Hidden complexity**: none.


Disadvantages:

1. 💔 **Modern**: relies on Classic `EmberObject`, which is an outdated pattern in Octane and
   Polaris.
2. 💔 **Restart**: in order to let you restart the promise, the code must get noticeably more
   boilerplatey.
3. 💔 **Auto cleanup**: need to manually check for `isDestroying` and `isDestroyed` inside promise callbacks.

## Ember Concurrency

[ember-concurrency](http://ember-concurrency.com) has become one of the pillars
of Ember infrastructure. It's an extremely powerful addon that lets you manage
async tasks.

On the other hand, many (if not most) projects do not actually require elaborate
concurrency management, and Ember Concurrency is used essentially as a promise
wrapper:

```js
import { task } from "ember-concurrency";

class MyComponent extends Component {
  @service myService;

  constructor() {
    super(...arguments);
    this.dataTask.perform();
  }

  dataTask = task(this, async () => {
    // `return await` is intentional because how Ember Concurrency transpiles async/await into generator/yield
    return await this.myService.getData();
  });
}
```

Here's how values are accessed with Ember Concurrency:

```hbs
{% raw %}
{{#if this.dataTask.isRunning}}
  Loading...
{{else if this.dataTask.last.isSuccessful}}
  {{this.dataTask.last.value.firstName}}
{{else if this.dataTask.last.isError}}
  Something went wrong:
  {{format-error this.dataTask.last.error}}.
{{else}}
  The promise failed to start, this should never happen.

  <button {{on "click" (perform this.dataTask)}}>Retry</button>
{{/if}}
{% endraw %}
```

Note that this example aready allows restarting, via the `(perform)` helper.

Advantages:

1. 💚 **Boilerplate**: concise code, almost no boilerplate, declarative code.
   the promise.
2. 💚 **Modern**: Ember Concurrency is an infrastructural addon that every Ember developer should be familiar with. It's well-supported and not going to become outdated.
3. 💚 **Auto cleanup**: you don't have to care about the parent object being destroyed when the callback runs.
4. 💚 **Additional**: lets you, well, manage the concurrency if you need it.
5. 💚 **Additional**: provides convient access to previous value after restarting.

Disadvantages:

1. 💔 **Autostart**: the promise has to be started manually.
2. 💔 **Dependency size**: a heavy dependency is an overkill for simply wrapping promises.
3. 💔 **Hidden complexity**: Ember Concurrency performs black box black magic under the hood: it
   transpiles async/await code into generator/yield. The implication is that you
   _must_ write `return await promise`. If you simply do `return promise`, your
   code will look correct in IDE, but the transpiled code will be incorrect in
   the browser. All your developers must be aware of this or they will have some
   ~~fun~~ hair-pulling time.

## Ember Promise Helpers

[ember-promise-heplers](https://github.com/fivetanley/ember-promise-helpers) is
an addon that gives you access to promise values via template helpers:

```js
class MyComponent extends Component {
  @service myService;

  @cached
  get promise() {
    return this.myService.getData();
  }
}
```

Note how the code is delightfully concise! This is my one love♥ approach to
promises.

To access the values, `ember-promise-helpers` offers a number of helpers to access the values:

```hbs
{% raw %}
{{#if this.promise}}
  {{#if (is-pending this.promise)}}
    Loading via ember-promise-helper...
  {{else if (is-fulfilled this.promise)}}
    {{get (await this.promise) "firstName"}}
  {{else if (is-rejected this.promise)}}
    {{#let (promise-rejected-reason this.promise) as |error|}}
      {{#if error}}
        Something went wrong:
        {{format-error error}}
      {{/if}}
    {{/let}}
  {{else}}
    The promise failed to start, this should never happen.
  {{/if}}
{{/if}}
{% endraw %}
```

Advantages:

1. 💚 **Boilerplate**: Extremely consise, straightforward, declarative syntax.
2. 💚 **Autostart**: the promise starts automatically.
3. 💚 **Dependency size**: is a tiny addon.
4. 💚 **Hidden complexity**: is very obvious and intuitive, no pitfalls.

Disadvantages:


- 💔 **Restart**: Does not offer a way of restarting promises.
- 💛 **Modern**: though this addon has a score of 9.4, it hasn't been updated in a year.
- 💀 **Additional**: Only lets you access promise values in templates, not in JavaScript. This
  severely limits use cases for this addon.
- 💔 **Additional**: Requires extra boilerplate:
    - A wrapping if clause {% raw %}`{{#if this.promise}}`{% endraw %} is necessary to trigger the promise before reading its state. If the promise is triggered with {% raw %}`{{#if (is-pending this.promise)}}`{% endraw %}, the `is-pending` helper will report that the promise is not pending.
    - The `(promise-rejected-reason)` works asynchronously: it always returns `null` before returning an error object, even if a pre-rejected promise has been passed in to it! Thus, it must be wrapped with a `{{#let}}` and `{{#if}}` as shown in the code sample.
    - Need to use the `get` helper to access properties on the resolved promise, which is inconvenient.

## Ember Async Data

[ember-async-data](https://github.com/NullVoxPopuli/ember-resources) is a modern, Octane-friendly equivalent of the Classic PromiseProxyMixin.

It wraps a promise with an object that exposes its values (state flags, the resolved value or the error). This wrapper is called `TrackedAsyncData`.

"Tracked" means that the values can be transparently used in templates and getters and will automatically recompute/rerender.

In order to make  `TrackedAsyncData` restart automatically, we instantiate it in a getter, while we keep the promise in a normal property that the getter depends on:

```js
import { TrackedAsyncData } from 'ember-async-data';

class Demo extends Component {
  @service myService;

  @tracked promise;

  @cached
  get data() {
    if (!this.promise) {
      this.restart();
    }

    return new TrackedAsyncData(this.promise, this);
  }

  restart = () => {
    this.promise = this.myService.getData(); // Sync!
  };
}
```

The API of `TrackedAsyncData` is documented in the [readme](https://github.com/tracked-tools/ember-async-data#trackedasyncdata) of the `ember-async-data` addon.

```hbs{% raw %}
{{#if this.data.isPending}}
  Loading via ember-async-data with JS...
{{else if this.datah.isResolved}}
  {{this.data.value.firstName}}
{{else if this.data.isRejected}}
  Something went wrong:
  {{format-error this.data.error}}.

  <button {{on "click" this.restart}}>Retry</button>
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

Advantages of `trackedFunction`:

1. 💛 **Boilerplate**: not as concise as .
2. 💛 **Autostart**: does not offer an autostart, but it can effortlessly be implemented with a cached getter.
3. 💚 **Modern**: built for Octane.
4. 💚 **Auto cleanup**: you don't have to care about the parent object being destroyed when the callback runs.

Disadvantages:

2. 💛 **Hidden complexity**: Feels like black magic. Resources are difficult to learn. On the other hand, they are the next big thing in Ember, so they deserve to be learned.


## Comparison

<table id="promise-wrapper-comparison">
  <tr>
    <th></th>
    <th><div>vanilla Promise</div></th>
    <th><div>PromiseProxyMixin<div></th>
    <th><div>ember-concurrency</div></th>
    <th><div>ember-promise-helpers</div></th>
    <th><div>trackedFunction</div></th>
  </tr>

  <tr>
    <td>Dependency size</td>
    <td>💚</td>
    <td>💚</td>
    <td>💔</td>
    <td>💚</td>
    <td>💛</td>
  </tr>

  <tr>
    <td>Previous state</td>
    <td>💛</td>
    <td>💔</td>
    <td>💚</td>
    <td>💔</td>
    <td>💔</td>
  </tr>
  
  <tr>
    <td>Boilerplate</td>
    <td>💔</td>
    <td>💚</td>
    <td>💚</td>
    <td>💚</td>
    <td>💚</td>
  </tr>
  
  <tr>
    <td>Autostart</td>
    <td>💔</td>
    <td>💚</td>
    <td>💔</td>
    <td>💚</td>
    <td>💚</td>
  </tr>
  
  <tr>
    <td>Restart</td>
    <td>💛</td>
    <td>💔</td>
    <td>💚</td>
    <td>💔</td>
    <td>💔</td>
  </tr>
  
  <tr>
    <td>Modern</td>
    <td>💚</td>
    <td>💔</td>
    <td>💚</td>
    <td>💛</td>
    <td>💚</td>
  </tr>
  
  <tr>
    <td>Hidden complexity   </td>
    <td>💚</td>
    <td>💚</td>
    <td>💔</td>
    <td>💚</td>
    <td>💛</td>
  </tr>
  
  <tr>
    <td>Additional</td>
    <td>💔<br>💔<br>💔</td>
    <td></td>
    <td>💚</td>
    <td>💀</td>
    <td></td>
  </tr>
</table>

<style>
  /* https://css-tricks.com/rotated-table-column-headers/ */

  #promise-wrapper-comparison th:nth-child(even), td:nth-child(even) {
    background-color: lightgrey;
  }

  #promise-wrapper-comparison td:not(:first-child) {
    text-align: center;
  }

  #promise-wrapper-comparison th {
    height: 240px;
    white-space: nowrap;
  }

  #promise-wrapper-comparison th div {
    transform: 
      translate(0, 90px) /* Magic number. :( */
      rotate(270deg);

    width: 30px;
  }

  #promise-wrapper-comparison td {
    vertical-align: top;
    line-height: 1.2;
    padding: 0.5em;
  }
</style>

<p> </p>

Explanation of criteria:

- **Dependency size**: the size of dependencies you have to pull.
- **Boilerplate**: how much code you need to write to make it work.
- **Autostart**: whether the promise starts automatically when accessed from a
  template.
- **Restart**: how easy it is to restart the promise.
- **Modern**: how soon this approach will be phased out.
- **Hidden complexity**: the amount of black box black magic that you need to be
  aware of to avoid frustration.
- **Auto cleanup**: takes care of cleanup when the parent object is destroyed.
- **Additional**: extra features result in a higher score, extra trouble results in a lower score.

## Conclusion

You should try
[trackedFunction](https://ember-resources.pages.dev/functions/util_function.trackedFunction)
if you haven't already!

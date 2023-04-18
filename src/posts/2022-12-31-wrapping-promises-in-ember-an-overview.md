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
  for them is fetching data. It's the a we're interested in, not fetching. Promises are notorious
  for not providing easy access to the data and error, as well as promise state. There are a number of ways to work around that,
  let's look into them:</p>

  <ul>
    <li><a href="#vanilla-promise">vanilla Promise</a>;</li>
    <li><a href="#promiseproxymixin">PromiseProxyMixin</a>;</li>
    <li><a href="#ember-concurrency">Ember Concurrency</a>;</li>
    <li><a href="#ember-promise-helpers">Ember Promise Helpers</a>;</li>
    <li><a href="#ember-async-data-js">Ember Async Data via JS</a>;</li>
    <li><a href="#ember-async-data-template">Ember Async Data via template helpers</a>;</li>
    <li><a href="#tracked-function-from-emer-resources">trackedFunction from Ember Resources — the next big thing!</a></li>
  </ul>
---

## The most common use case

Typically, we already have some method that returns a promise, so we are not
going to deal with the `new Promise()` constructor:

```js
this.myService.getData(); // => Promise<Data>
```

In its template, a component needs convenient access to the following values:

- the fetched data;
- the error object in case the request fails;
- the state of the promise:
  - is running;
  - has resolved;
  - has rejected.

I'll be call these "promise values".

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
excuse an improper use of a philosopical term. 😬 Accessing these promise values
is tricky.

Let's walk through a few ways taht make it possible.

## Criteria

I'm gonna compare promise wrappers using the following criteria:

- **Dependency size**: the size of dependencies you have to pull.
- **Boilerplate**: how much code you need to write to make it work.
- **Autostart**: whether the promise starts automatically when accessed from a
  template.
- **Modern**: how soon this approach will be phased out.
- **Hidden complexity**: the amount of black box black magic that you need to be
  aware of to avoid frustration.
- **Auto cleanup**: takes care of cleanup when the parent object is destroyed.
- **Additional**: extra features or trouble.

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

The latter seems much more elegant, but only until we need to access values other than
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

On top of that, you must be very careful when applying this approach in an older
Ember codebase that uses `set`. If the promise resolves when the parent object
has been destroyed (for example, a Classic Ember component has been removed from
the page or an Ember Data record was unloaded), Ember would throw an assertion
error. To work around that, you must do extra checks:

```js
try {
  const data = await this.myService.getData({ shouldFail });

  if (!this.isDestroying && !this.isDestroyed) {
    this.set("data", data);
  }
} catch (error) {
  if (!this.isDestroying && !this.isDestroyed) {
    this.set("error", error);
  }
} finally {
  if (!this.isDestroying && !this.isDestroyed) {
    this.set("isPending", false);
  }
}
```

The advantages of this approach are:

1. 💚 **Dependency size**: no extra dependencies.
2. 💚 **Modern**: vanilla JS is understandable by any frontend developer and
   never becomes obsolete.
3. 💚 **Hidden complexity**: no hidden complexity, everything is on the surface.

The vanilla promise approach has a number of bitter disadvantages:

1. 💔 **Boilerplate**: requires a lot of boilerplate code.
2. 💔 **Autostart**: need to start the promise manually.
3. 💔 **Auto cleanup**: need to manually check for `isDestroying` and
   `isDestroyed` inside promise callbacks.
4. 💔 **Additional**: When several promises need to be dealt with in one class,
   the code gets mixed up and hard to maintain.
5. 💔 **Additional**: Need to work around the promise callback mutating the
   component after it is destroyed.
6. 💔 **Additional**: Prone to bugs, requires tests which may and will get
   repetitive as you implement more requests.

## PromiseProxyMixin

`PromiseProxyMixin` was a very convenient way of wrapping promises in Classic
Ember.

```js
import EmberObject from "@ember/object";
import PromiseProxyMixin from "@ember/object/promise-proxy-mixin";

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

Note that the tracked property has an initial value: that's how this promise
starts when the Glimmer component is inserted.

The advantages of this approach are:

1. 💚 **Dependency size**: `PromiseProxyMixin` is part of Ember, so no extra
   dependencies.
2. 💚 **Boilerplate**: very concise code, zero boilerplate, declarative code.
3. 💚 **Autostart**: Thanks to a cached getter, the promise starts automatically
   when the template is rendering.
4. 💚 **Hidden complexity**: none.

Disadvantages:

1. 💔 **Modern**: relies on Classic `EmberObject`, which is an outdated pattern
   in Octane and Polaris.
2. 💔 **Auto cleanup**: need to manually check for `isDestroying` and
   `isDestroyed` inside promise callbacks.

## Ember Concurrency

[ember-concurrency](http://ember-concurrency.com) has become one of the pillars
of Ember infrastructure. It's an extremely powerful addon that lets you manage
async tasks.

On the other hand, many (if not most) projects do not actually require elaborate
concurrency management, and Ember Concurrency is used as a humble promise
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
    // From the perspective of normal JS code, async/await is redundant here,
    // as simply returning a promise would do just fine. But Ember Concurrency
    // transpiles this code into a generator function, `async` becomes `yield`,
    // and the generator will not work correcly without `yield`.
    // Thus, `return await` is required here.
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

Note that this example allows restarting the promise in case of an error, via the `(perform)` helper.

Advantages:

1. 💚 **Boilerplate**: concise code, almost no boilerplate, declarative code.
   the promise.
2. 💚 **Modern**: Ember Concurrency is an infrastructural addon that every Ember
   developer should be familiar with. It's well-supported and not going to
   become outdated.
3. 💚 **Auto cleanup**: you don't have to care about the parent object being
   destroyed when the callback runs.
4. 💚 **Additional**: lets you, well, manage the concurrency if you need it.
5. 💚 **Additional**: provides convient access to previous value after
   restarting.

Disadvantages:

1. 💔 **Autostart**: the promise has to be started manually. Simply accessing promise values will not start it.
2. 💔 **Dependency size**: a heavy dependency is an overkill for simply wrapping
   promises.
3. 💔 **Hidden complexity**: Ember Concurrency performs black box black magic
   under the hood: it transpiles async/await code into generator/yield. The
   implication is that you _must_ write `return await promise`. If you simply do
   `return promise`, your code will look correct in IDE, but the transpiled code
   will be incorrect in the browser. All your developers must be aware of this
   or they will have some ~~fun~~ hair-pulling time.

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

To access the values, `ember-promise-helpers` offers a number of helpers to
access the values:

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
2. 💚 **Autostart**: the promise starts automatically when its values are first accessed.
3. 💚 **Dependency size**: is a tiny addon.
4. 💚 **Hidden complexity**: is very obvious and intuitive, no pitfalls.

Disadvantages:

1. 💛 **Modern**: though this addon has an EmberObserver score of 9.4, it hasn't been updated in
  a year.
2. 💀 **Additional**: Only lets you access promise values in templates, not in
  JavaScript. This severely limits use cases for this addon.
3. 💔 **Additional**: Requires extra boilerplate:
  - A wrapping if-clause {% raw %}`{{#if this.promise}}`{% endraw %} is
    necessary to trigger the promise before reading its state. If the promise is
    triggered with {% raw %}`{{#if (is-pending this.promise)}}`{% endraw %}, the
    `is-pending` helper will report that the promise is not pending.
  - The `(promise-rejected-reason)` works asynchronously: it always returns
    `null` before returning an error object, even if a pre-rejected promise has
    been passed in to it! Thus, it must be wrapped with a
    {% raw %}`{{#let}}`{% endraw %} and {% raw %}`{{#if}}`{% endraw %} as shown
    in the code sample.
  - Need to use the `get` helper to access properties on the resolved promise,
    which is inconvenient.

## Ember Async Data

[ember-async-data](https://github.com/tracked-tools/ember-async-data) is a
modern, Octane-friendly equivalent of the Classic PromiseProxyMixin.

It wraps a promise with an object that exposes its values (state flags, the
resolved value or the error). This wrapper is called `TrackedAsyncData`.

"Tracked" means that the values can be transparently used in templates and
getters and will automatically recompute/rerender.

```js
import { TrackedAsyncData } from "ember-async-data";

class Demo extends Component {
  @service myService;

  @cached
  get promise() {
    return new TrackedAsyncData(this.promise, this);
  }
}

```

If you happen to use tracked properties in the getter, changing any such property will cause the getter to recalculate and restart the promise.

If you don't use any tracked properties but still want to be able to restart the promise on demand, you can put the promise itself into a tracked property and have `TrackedAsyncData` depend on it:

```js
import { TrackedAsyncData } from "ember-async-data";

class Demo extends Component {
  @service myService;

  @tracked promise = this.myService.getData(); // Sync!

  @cached
  get asyncData() {
    return new TrackedAsyncData(this.promise);
  }

  restart = (shouldFail = false) => {
    this.promise = this.myService.getData({ shouldFail }); // Sync!
  };
}
```

The API of `TrackedAsyncData` is documented in the
[readme](https://github.com/tracked-tools/ember-async-data#trackedasyncdata) of
the `ember-async-data` addon.

```hbs{% raw %}
{{#if this.data.isPending}}
  Loading...
{{else if this.data.isResolved}}
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

`ember-async-data` allows using it in template-only mode, quite similar to `ember-promise-helpers`, sans the extra ifs and lets:


```js
import { TrackedAsyncData } from "ember-async-data";

class Demo extends Component {
  @service myService;

  @tracked promise = this.myService.getData(); // Sync!

  restart = (shouldFail = false) => {
    this.promise = this.myService.getData({ shouldFail }); // Sync!
  };
}
```

The API of `TrackedAsyncData` is documented in the
[readme](https://github.com/tracked-tools/ember-async-data#trackedasyncdata) of
the `ember-async-data` addon.

```hbs{% raw %}
{{#let (load this.promise) as |data|}}
  {{#if data.isPending}}
    Loading...
  {{else if data.isResolved}}
    {{data.value.firstName}}
  {{else if data.isRejected}}
    Something went wrong:
    {{format-error data.error}}.

    <button {{on "click" this.restart}}>Retry</button>
  {{else}}
    The promise failed to start, this should never happen.
  {{/if}}
{{/let}}
{% endraw %}
```

Advantages of `ember-async-data`:

1. 💚 **Boilerplate**: almost perfect, but still bigger than the next contender.
2. 💛 **Dependency size**: is a small addon.
3. 💚 **Modern**: built for Octane.
4. 💚 **Autostart**: the promise starts automatically when its values are accessed.
5. 💚 **Modern**: fully Octane-friendly.
6. 💚 **Additional**: can be used in a template-only mode.

Disadvantages:

1. 💛 **Hidden complexity**: does not allow accessing promise resolve value when the promise it's not resolved. Currently, this produces a harmless warning, but it says that it will crash in the future.

## Ember Resources

[ember-resources](https://github.com/NullVoxPopuli/ember-resources) is an addon that's becoming a pillar of Ember infrastrucure. It offers many approaches that can improve the way Ember apps are written. For exmaple, it offers a way to encapsulate logic into single-purpose entities and avoid having giant multipurpose controllers.

One of the features that `ember-resources` offers is a simple, convenient way of wrapping a promise. It's called `trackedFunction`.

`trackedFunction` depends on `ember-async-data` under the hood, so you get the best of both worlds. `ember-async-data` is a peer dependency, which means that you need to install it alongside `ember-resources`.

The syntax is delightfully short:

```js
import { trackedFunction } from 'ember-resources/util/function';

export default class TrackedFunctionComponent extends Component {
  @service myService;

  resource = trackedFunction(this, () => {
    return this.myService.getData({ shouldFail: this.shouldFail });
  });
}
```

`trackedFunction` is documented on the
[docs site](https://ember-resources.pages.dev/funcs/util_function.trackedFunction) of
the `ember-resources` addon.

When invoked, `trackedFunction` returns a `State` object instance, which is documented [here](https://ember-resources.pages.dev/classes/util_function.State). `State` provides convenient access to promise values:

```hbs{% raw %}
{{#if this.resource.isPending}}
  Loading via trackedFunction...
{{else if this.resource.isResolved}}
  {{this.resource.value.firstName}}
{{else if this.resource.isRejected}}
  Something went wrong:
  {{format-error this.resource.error}}

  <button type='button' {{on 'click' this.resource.retry}}>
    Restart
  </button>
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

`ember-async-data` allows using it in template-only mode, quite similar to `ember-promise-helpers`, sans the extra ifs and lets (you only need one `let`):


```js
import { TrackedAsyncData } from "ember-async-data";

class Demo extends Component {
  @service myService;

  @tracked promise = this.myService.getData(); // Sync!

  restart = (shouldFail = false) => {
    this.promise = this.myService.getData({ shouldFail }); // Sync!
  };
}
```

The API of `TrackedAsyncData` is documented in the
[readme](https://github.com/tracked-tools/ember-async-data#trackedasyncdata) of
the `ember-async-data` addon.

```hbs{% raw %}
{{#let (load this.promise) as |data|}}
  {{#if data.isPending}}
    Loading...
  {{else if data.isResolved}}
    {{data.value.firstName}}
  {{else if data.isRejected}}
    Something went wrong:
    {{format-error data.error}}.

    <button {{on "click" this.restart}}>Retry</button>
  {{else}}
    The promise failed to start, this should never happen.
  {{/if}}
{{/let}}
{% endraw %}
```

Advantages of `ember-async-data`:

1. 💚 **Boilerplate**: almost perfect, but still bigger than the next contender.
2. 💛 **Dependency size**: is a small addon.
3. 💚 **Modern**: built for Octane.
4. 💚 **Autostart**: the promise starts automatically when its values are accessed.
5. 💚 **Modern**: fully Octane-friendly.
6. 💚 **Additional**: can be used in a template-only mode.

Disadvantages:

1. 💛 **Hidden complexity**: does not allow accessing promise resolve value when the promise it's not resolved. Currently, this produces a harmless warning, but it says that it will crash in the future.



## ember-async-data via template helpers

If you happen to have an unwrapped promise in a property or a template variable, `ember-async-data` lets you access its values in the same way as with `ember-promise-modals`:

```hbs{% raw %}
    {{#let (load this.promise) as |result|}}
      {{#if result.isPending}}
        Loading via ember-async-data template helpers...
      {{else if result.isResolved}}
        <User @user={{result.value}}/>
      {{else if result.isRejected}}
        Something went wrong:
        {{format-error result.error}}
      {{else}}
        The promise failed to start, this should never happen.
      {{/if}}
    {{/let}}
{% endraw %}
```



## trackedFunction from ember-resources

`ember-resources` is an addon that implements the resource pattern. A resource is a nice way to abstract portions of code away from your controllers, components and models. This lets you avoid the [god object](https://en.wikipedia.org/wiki/God_object) antipattern, so that each module is responsible for, ideally, one thing. `ember-resources` takes care of the component lifecycle for you, so that when the parent instance (e. g. component) is destroyed, the resource is also automatically destroyed, so that it does not leak and does not interact with the absent parent instance.

`trackedFunction` is an util that wraps a promise using `ember-resources` under the hood. `trackedFunction` uses `ember-async-data` internally in order to access promise values, enriching it with a restart method.

It offers the sortest syntax of all alternatives in this article:

```js
import { trackedFunction } from 'ember-resources/util/function';

export default class TrackedFunctionComponent extends Component {
  @service myService;

  resource = trackedFunction(this, () => {
    return this.myService.getData();
  });
}
```

Here's how you access promise values in the template:

```hbs{% raw %}
    {{#if this.resource.isPending}}
      Loading via trackedFunction...
    {{else if this.resource.isResolved}}
      <User @user={{this.resource.value}}/>
    {{else if this.resource.isRejected}}
      Something went wrong:
      {{format-error this.resource.error}}

      <button {{on 'click' this.resource.retry}}>
        Restart
      </button>
    {{else}}
      The promise failed to start, this should never happen.
    {{/if}}
{% endraw %}
```



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
- **Additional**: extra features result in a higher score, extra trouble results
  in a lower score.

## Conclusion

You should try
[trackedFunction](https://ember-resources.pages.dev/functions/util_function.trackedFunction)
if you haven't already!

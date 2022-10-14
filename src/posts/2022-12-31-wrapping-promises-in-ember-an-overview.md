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
    <li><a href="#trackedfunction-from-ember-resources">trackedFunction from Ember Resources</a> — the next big thing! 🙀
  </ul>
---

## The most common use case

Typically, we already have some method that returns a promise, so we don't have
to deal with the `new Promise()` constructor:

```js
this.myService.getData(); // => Promise<Data>
```

In a template, we need convenient access to the following values:

- the fetched data;
- the error object in case the request fails;
- the state of the promise:
  - is running;
  - has resolved;
  - has errored.

The challenge is that Promises are
a [thing-in-itself](https://en.wikipedia.org/wiki/Thing-in-itself), if you
excuse an improper use of a philosopical term. 😬 Accessing these values is
tricky.

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
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

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
      const data = await this.myService.getData();

      if (!this.isDestroying && !this.isDestroyed) {
        this.data = data;
      }
    } catch(error) {
      if (!this.isDestroying && !this.isDestroyed) {
        this.error = error;
      }
    } finally {
      if (!this.isDestroying && !this.isDestroyed) {
        this.isPending = false;
      }
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

1. No extra dependencies.
2. The code can be customized to retain access the previous state of the promise
   after restart.

The vanilla promise approach has a number of bitter disadvantages:

1. A lot of boilerplate code.
2. Prone to bugs, requires tests which may and will get repetitive as you
   implement more requests.
3. When several promises need to be dealt with in one class, the code gets mixed
   up and hard to maintain.
4. Need to start the promise manually.
5. Need to work around the promise callback mutating the component after it is destroyed.

## PromiseProxyMixin

`PromiseProxyMixin` was a very convenient way of wrapping promises in Classic
Ember.

```js
import ObjectProxy from "@ember/object/proxy";
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
{{else if this.promiseProxy.isSettled}}
  {{this.promiseProxy.content.firstName}}
{{else if this.promiseProxy.isRejected}}
  Something went wrong:
  {{format-error this.promiseProxy.reason}}.
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

The advantages of this approach are:

1. Very concise code, zero boilerplate.
2. Declarative code.
3. Thanks to a cached getter, the promise starts automatically when the template
   is rendering.
4. Does not require checking for destroyed state thanks to not mutating the
   component class.
5. No extra dependencies.

Disadvantages:

1. Relies on Classic `EmberObject`, which is an outdated pattern in Octane and
   Polaris.
2. In order to let you restart the promise, the code must get noticeably more
   boilerplatey.
3. Accessing the previous value after restarting the promise makes the code even
   more complicated.

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
    super();
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
{{else if this.dataTask.last.isSettled}}
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

Advantages:

1. Concise code, almost no boilerplate.
2. Declarative code.
3. Ember Concurrency provides convient access to previous value after restarting
   the promise.
4. Lets you, well, manage the concurrency if you need it.

Disadvantages:

1. The promise has to be started manually.
2. A heavy dependency is an overkill for simply wrapping promises.
3. Ember Concurrency performs black box black magic under the hood: it
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

To access the values, `PromiseProxyMixin` exposes a number of values:

```hbs
{% raw %}
{{#if (is-pending this.promiseProxy)}}
  Loading...
{{else if (is-fulfilled this.promise)}}
  {{get (await this.promise) "firstName"}}
{{else if (is-rejected this.promise)}}
  Something went wrong:
  {{format-error (promise-rejected-reason this.promise)}}.
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

Advantages:

- Extremely consise, straightforward, declarative syntax.
- Promise starts automatically.

Disadvantages:

- Only lets you access promise values in templates, not in JavaScript. This
  severely limits use cases for this addon.
- Does not offer a way of restarting promises.

## trackedFunction from Ember Resources

[ember-resources](https://github.com/NullVoxPopuli/ember-resources) is an addon
that implements the
[Resource pattern](https://www.pzuraq.com/blog/introducing-use) in Ember.

Ember Resources are vast topic that I can't cover within the scope of this
article. Here's a TL/DR version:

- A resource is a subclass of `Resource` that encapsulates your
  single-responsibility logic such as fetching data. By extracting logic into
  resources, you can make your components/controllers/models/services more
  lightweight and easier to maintain.
- Resources bind with the lifecycle of components/controllers/models/services,
  so you don't have to care about working around your promise callback mutating
  a destroyed component.
- Resources bind with tracked/computed propertes, so that they can automatically
  and declaratively restart their logic when relevant properties change.

As of autumn 2022, the readme of `ember-resources` is rather scarce. A lot of
useful documentation is scattered across
[API docs](https://ember-resources.pages.dev): make sure to browse through every
item of every module.

The `Resource` class is a rather low-level approach that does not actually wrap
a promise for you. Fortunately, `ember-resources` provides a number of helpful
higher-level abstractions for all kinds of situations. We're gonna use the
[trackedFunction](https://ember-resources.pages.dev/functions/util_function.trackedFunction)
util which removes all the complexity of resources and can be used inline just
like all other approaches in this artile.

```js
import { trackedFunction } from "ember-resources/util/function";

class Demo extends Component {
  @service myService;

  resource = trackedFunction(this, () => {
    return this.myService.getData();
  });
}
```

Note: if you access any tracked properties from the callback passed into
`trackedFunction` (this includes whatever the service does under the hood!),
then the callback will be automatically restarted every time those properties
change.

Property names for promise values are documented in the
[State](https://ember-resources.pages.dev/classes/util_function.State) class:

```hbs{% raw %}
{{#if this.request.isResolved}}
  Loading...
{{else if this.request.isSettled}}
  {{this.request.value.firstName}}
{{else if this.request.isError}}
  Something went wrong:
  {{format-error this.request.error}}.
{{else}}
  The promise failed to start, this should never happen.
{{/if}}
{% endraw %}
```

Advantages of `trackedFunction`:

1. Concise, declarative syntax.
2. Restarts automatically when dependency properties change.
3. Fancy new technology that the Ember ecosystem is leaning toward.

Disadvantages:

1. Feels like black magic. Resources are difficult to learn.
2. Restarting the promise imperatively is a bit tricky.

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
    <td>💛</td>
    <td>💛</td>
  </tr>

  <tr>
    <td>Previous state</td>
    <td>💛</td>
    <td>💔</td>
    <td>💚</td>
    <td>💔</td>
    <td>💛</td>
  </tr>
  
  <tr>
    <td>Boilerplate</td>
    <td>💔</td>
    <td>💚</td>
    <td>💛</td>
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
    <td>💛</td>
  </tr>
  
  <tr>
    <td>Lifecycle</td>
    <td>💔</td>
    <td>💚</td>
    <td>💚</td>
    <td>💚</td>
    <td>💚</td>
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
    <td>Useable in JS</td>
    <td>💚</td>
    <td>💚</td>
    <td>💚</td>
    <td>💀</td>
    <td>💚</td>
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
</style>

<p> </p>

Explanation of criteria:

- **Dependencies**: the size of dependencies you have to pull.
- **Previous state**: how easy it is to access the previous state of the promise
  after restarting.
- **Boilerplate**: how much code you need to write to make it work.
- **Autostart**: whether the promise starts automatically when accessed from a
  template.
- **Restart**: how easy it is to restart the promise.
- **Lifecycle**: whether you need to care about not mutating our component from
  the promise callback.
- **Modern**: how soon this approach will be phased out.
- **Hidden complexity**: the amount of black box black magic that you need to be
  aware of to avoid frustration.
- **Useable in JS**: whether promise values can be accessed from your
  component's JavaScript code.

## Conclusion

You should try
[trackedFunction](https://ember-resources.pages.dev/functions/util_function.trackedFunction)
if you haven't already!

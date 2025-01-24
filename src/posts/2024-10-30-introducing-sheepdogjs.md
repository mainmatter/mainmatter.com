---
title: "Handling concurrency in Svelte with Sheepdog"
authorHandle: beerinho
tags: ["svelte"]
bio: "Daniel Beer"
description: "Daniel Beer introduces Sheepdog, the newest way to handle asynchronous tasks in your Svelte app"
og:
  image: "/assets/images/posts/2024-10-30-introducing-sheepdogjs/og-image.png"
tagline: |
  <p>
    Sometimes handling async tasks can feel like trying to herd sheep. With Sheepdog, you'll have an expert to help you keep your async flock in order.
  </p>

image: ""
imageAlt: ""
---

## The motivation

Coming from an EmberJS background, one of the utilities I immediately missed in the Svelte ecosystem was a way to handle concurrency the way that [ember-concurrency](https://ember-concurrency.com/) does so well. Assuming this must have been a path that had already been trodden by other bright minds, our team took to Google to see what was already out there. We found two options that could be interesting:

- [svelte-concurrency](https://github.com/machty/svelte-concurrency) - made by the creator of ember-concurrency but unfortunately hasn’t been touched in 5 years
- [effection](https://github.com/thefrontside/effection) - a powerful framework agnostic concurrency library, but it felt a bit too heavy for what we wanted to do. Ideally we’d have something a bit more svelte (geddit)

After spending some time playing around with these two options and deeming them as unsuitable for our use-case, a small team lead by our Svelte expert [Paolo Ricciuti](https://x.com/paoloricciuti) (co-creator of [SvelteLab](https://www.sveltelab.dev/) and Svelte ambassador and maintainer) set out to create a lightweight package that could handle concurrency in Svelte applications.

## Introducing Sheepdog

After weeks of work, we are proud to unveil our creation: [Sheepdog](https://sheepdog.run/)! A lightweight way to herd your asynchronous tasks.

You can learn all about Sheepdog and how it works in [the docs](https://sheepdog.run/getting-started/what-is-it/) so for now, I'll give you a quick rundown of why you'll want to keep it in your Svelte toolbox.

As a very basic example, imagine you want to create a Svelte component that will search while the user types, but to reduce the number of requests sent to your server, you want to wait for the user to stop typing before you send the request. With Sheepdog, it would look like this:

```svelte
{% raw %}
<script>
  import { task, timeout } from '@sheepdog/svelte';

  let searchTask = task.restart(async function(value) {
    await timeout(500);
    let response = await fetch('/search?q=' + value);
    return await response.json();
  });
</script>

<label for="search">Search</label>
<input
  name="search"
  type="text"
  on:input={
    (event) => searchTask.perform(event.target.value)
  }
/>

{#if $searchTask.isRunning}
  Loading...
{:else if $searchTask.lastSuccessful}
  Value: {$searchTask.lastSuccessful.value}
{/if}
{% endraw %}
```

And immediately you have a debounced task that informs the user when the results are loading. To try it for yourself, head over to [https://sheepdog.run/](https://sheepdog.run/) and check out the interactive example.

### Easily get derived state for your tasks

When a user is interacting with your app, it’s vital that they understand what is currently happening, whether they are waiting for something to load or waiting for a response from an input. Using a Sheepdog task gives you several derived properties out of the box so you can hook it into your UI with ease. Properties like `isRunning` can be used to show the current state of the task, while properties like `lastCanceled`, `lastSuccessful` and `lastErrored` help to give a concise view of exactly what has been returned from previous executions of your task.

You can read more about Tasks [here](https://sheepdog.run/getting-started/usage/).

### Different tasks for different needs

With the default task, you unlock the simplicity I mentioned above, but Sheepdog exposes several task types for all different use-cases. Whether you want to debounce your input using a [Restart task](https://sheepdog.run/reference/restart/) or make sure your polling is always up-to-date with a [KeepLatest task](https://sheepdog.run/reference/keep-latest/); Sheepdog has you covered.

You can read about the 5 different types of task [here](https://sheepdog.run/explainers/task-modifiers/).

### Mid-run cancellation

One of the biggest issues with Promises is that they require a lot of boilerplate to have any kind of mid-run cancellation. With Sheepdog, you immediately get that out of the box (when using the [Async Transform](https://sheepdog.run/explainers/async-transform/), without the Async Transform you will need to use generator functions).

For instance, imagine you have a task that makes multiple API calls based on the return value of each previous API call. Then imagine for some reason you want to cancel that task after it’s started, with standard Promises you would have to set and check a bunch of values between each API call to have some semblance of cancellation. And even then, you can’t be sure which API calls have been initiated. With Sheepdog, we do all the heavy lifting for you, so if you cancel a task mid-run, then it’s cancelled - as soon as the current API call is completed, the task will stop executing.

You can read more about Mid-run cancellation [here](https://sheepdog.run/explainers/mid-run-cancellation/).

### No need to clean up after yourself

Sheepdog automatically binds the task to the component it was created in, meaning that it will automatically be cancelled if the component it was instantiated in is unmounted. No more pending code executing after their place in the DOM has been unmounted.

### Bind tasks together

Sometimes you want one task to be entirely dependant on another, meaning that the child task is cancelled when the parent task is cancelled. Using the [Link function](https://sheepdog.run/explainers/linking-tasks/), binding tasks together is as easy as counting sheep.

```svelte
// Child.svelte
<script>
  import { task, timeout } from '@sheepdog/svelte';

  // receive the task from the parent
  export let parentTask;

  let childTask = task.restart(async function(value, { link }) {
    // bind childTask to parentTask and perform parentTask
    let response = await link(parentTask).perform(value)
    return await response.json();
  });
</script>
```

As you can see, we are receiving a task as a prop and then binding the new task to it. This means that if the child or parent component is unmount, both tasks will be cancelled. If they were not linked and the Child component was unmounted after `childTask` was triggered, `parentTask` would still run to completion.

### Write what you know

Under the hood, Sheepdog will turn all of your tasks into a generator function but with the [Async Transform](https://sheepdog.run/explainers/async-transform/), you can keep your async functions and Sheepdog will convert it to a generator function at build time, meaning you don’t have to know how generator functions work to benefit from them. But don't worry, we only ever touch the code that is wrapped in a `task` that is imported from `@sheepdog/svelte`.

So if you wrote the following code:

```svelte
<script>
  import { task } from '@sheepdog/svelte';

  let myTask = task(async () => {
    let response = await fetch(...);
    return await response.json()
  });

  const arrowFunction = async () => {
    await fetch(...)
  }

  async function myFunction() {
    await fetch(...)
  }

  function * myGenerator() {
    yield fetch(...)
  }
</script>
```

The output of the Async Transform would be:

```svelte
<script>
  import { task } from '@sheepdog/svelte';

  let myTask = task(async function* () {
    let response = yield fetch(...);
    return yield response.json()
  });

  const arrowFunction = async () => {
    await fetch(...)
  }

  async function myFunction() {
    await fetch(...)
  }

  function* myGenerator() {
    yield fetch(...)
  }
</script>
```

As you can see, the Async Transform has only touched the single property that was wrapped in the imported `task`, and even then, we touch your code the minimum amount possible to give you all the benefits of Sheepdog.

You can read more about the Async Transform [here](https://sheepdog.run/explainers/async-transform/).

## Branching out

At the moment, we have created this package to work with Svelte, but we have plans to make the core of the package framework-agnostic. If you’re interested in helping maintain the package or fancy porting it to your favourite framework, please reach out!

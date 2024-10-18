---
title: "Handling concurrency in Svelte with Sheepdog"
authorHandle: beerinho
tags: ["svelte"]
bio: "Daniel Beer"
description: "Daniel Beer introduces SheepdogJS, the newest way to handle asynchronous tasks in your Svelte app"
og:
  image: ""
tagline: |
  <p>
    Daniel Beer introduces SheepdogJS, the newest way to handle asynchronous tasks in your Svelte app
  </p>

image: ""
imageAlt: ""
---

## The motivation

Coming from an EmberJS background, one of the utilities I immediately missed in the Svelte ecosystem was a way to handle concurrency the way that ember-concurrency does so well. Assuming this must have been a path that had already been trodden by other bright minds, our team took to google to see what was already out there we found two options that could be interesting:

- [svelte-concurrency](https://github.com/machty/svelte-concurrency) - made by the creator of ember-concurrency but unfortunately hasn’t been touched in 5 years
- [effection](https://github.com/thefrontside/effection) - a powerful framework agnostic currency library but this felt a bit too heavy for what we wanted to do, ideally we’d have something a bit more svelte (geddit)

After spending some time playing around with these two options and deeming them as unsuitable for our use-case, a small team lead by Paolo Ricciuti (co-creator of SvelteLab and Svelte ambassador) set out to create a lightweight package that could handle concurrency in Svelte applications.

## Introducing Sheepdog

After weeks of work, we are proud to unveil our creation: [Sheepdog](https://sheepdogjs.com/)! A lightweight way to herd your asynchronous tasks.

You can learn all about Sheepdog and how it works in [the docs](https://sheepdogjs.com/getting-started/what-is-it/) so for now, I'll give you a quick rundown of why you'll want to keep it in your Svelte toolbox.

### Easily get derived state for your tasks

When a user is interacting with your app, it’s vital that they understand what is currently happening, whether they are waiting for something to load or waiting for a response from an input. Using a Sheepdog task gives you several derived properties out of the box so you can hook it into your UI with ease. Properties like `isRunning` can be used to show the current state of the task, while properties like `lastCanceled`, `lastSuccessful` and `lastErrored` help to give a concise view of exactly what has been returned from previous executions of your task.

You can read more about Tasks [here](https://sheepdogjs.com/getting-started/usage/).

### Different tasks for different needs

With the default task, you unlock the simplicity I mentioned above, but Sheepdog exposes several task types for all different use-cases. Whether you want to debounce your input using a [Restart task](https://sheepdogjs.com/reference/restart/) or make sure your polling is always up-to-date with a [KeepLatest task](https://sheepdogjs.com/reference/keep-latest/); Sheepdog has you covered.

You can read about the 5 different types of task [here](https://sheepdogjs.com/explainers/task-modifiers/)

### Mid-run cancellation

One of the biggest issues with Promises is that it requires a lot of boilerplate to have any kind of mid-run cancellation. With Sheepdog, you immediately get that out of the box.

For instance, imagine you have a task that makes multiple API calls based on the return value of each previous API call. Then imagine for some reason you want to cancel that task after it’s started, with standard Promises you would have to set and check a bunch of values between each API call to have some semblance of cancellation. And even then, you can’t be sure which API calls have been initiated. With Sheepdog, we do all the heavy lifting for you, so if you cancel a task mid-run, then it’s cancelled - as soon as the current API call is completed, the task will stop executing.

You can read more about Mid-run cancellation [here](https://sheepdogjs.com/explainers/mid-run-cancellation/)

### No need to clean up after yourself

Sheepdog automatically binds the task to the context it was created in, meaning that it will automatically be cancelled if the context it was initiated in is destroyed. Of course, you can go the other way here and have long-lived tasks that are available throughout your app by changing the context the task is initiated in.

### Bind tasks together

Sometimes you want one task to be entirely dependant on another, meaning that the child task is cancelled when the parent task is cancelled. Using the [Link function](https://sheepdogjs.com/explainers/linking-tasks/), binding tasks together is as easy as counting sheep.

### Write what you know

Under the hood, Sheepdog will turn all of your tasks into a generator function but with the [Async Transform](https://sheepdogjs.com/explainers/async-transform/), you can keep your async functions and Sheepdog will convert it to a generator function at build time, meaning you don’t have to know how generator functions work to benefit from them.

You can read more about the Async Transform [here](https://sheepdogjs.com/explainers/async-transform/)

## Branching out

At the moment, we have created this package to work with Svelte, but we have plans to make the core of the package framework-agnostic. If you’re interested in helping maintain the package or fancy porting it to your favourite framework, please reach out!

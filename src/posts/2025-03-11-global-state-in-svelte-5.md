---
title: "Runes and Global state: do's and don'ts"
authorHandle: paoloricciuti
tags: [svelte]
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "Paolo Ricciuti (paoloricciuti) shows how (but most importantly how not) handle global state in Svelte 5"
og:
  image: /assets/images/posts/2025-03-11-global-state-in-svelte-5/og-image.jpg
tagline: <p>Global state doesn't have to be scary! Embark in this journey to understand how to deal with it!</p>

image: "/assets/images/posts/2025-03-11-global-state-in-svelte-5/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

# Runes and Global state: do's and don'ts

[On the 20th of September of 2023 Runes were introduced to the Svelte ecosystem](https://svelte.dev/blog/runes). This brand new paradigm was a complete rewrite of the underlying structure of Svelte, moving from a _compile-only_ to a _compile-enhanced_ reactivity system, with a very small and extremely performant runtime footprint.

One of the greatest advantages of this brand new paradigm is what was introduced as ["Universal Reactivity"](https://svelte.dev/tutorial/svelte/universal-reactivity).

## Previously on Svelte 4

Before the release of runes, Svelte lived in two worlds: the magical and fantastical world inside a Svelte component and the harsher reality of a Javascript file. Inside a `.svelte` file, variables were automatically reactive and the [labeled statement](https://svelte.dev/docs/svelte/legacy-reactive-assignments) (`$:`) allowed you to react to changes. In a `.js` file however Svelte had no power and you had to use stores to interact reactively with data.

### Stores

A store in Svelte was an observable: an object with a `subscribe()` method (that returned an `unsubscribe()` function) and potentially a `set()` and an `update()` methods. You could `subscribe()` to a store passing as an argument a callback function that would be invoked whenever a new value was `set()` on the store.

Even stores were enhanced inside a Svelte component: accessing a variable with the `$` prefix would instruct svelte to automatically subscribe to the store and keep the `$`-prefixed variable in sync with the value of the store.

So stores were **THE** way to have global reactive state in your application. You could've just do this

```ts
import { writable } from "svelte";

export const count = writable(0);
```

from a javascript file and use this throughout your application

```svelte
<script>
  import { count } from "./my-count";
</script>

<button on:click={()=>{
	$count++;
}}>{$count}</button>
```

inside a svelte component or

```ts
import { count } from "./my-count";

count.update($count => $count + 1);
```

inside a javascript file.

## What about Svelte 5?

Well, firstly let's make it clear: stores are not deprecated and you continue to use them in Svelte 5 just like we just explained.

That said there's a reason why you are here: you want to know how to do this with the new and performant signal based reactivity system.

### A quick look at runes

Before we begin let's take a brief look at how runes work: runes are magical symbols that instruct the compiler that we want something special. They work inside `.svelte` files but also inside `.svelte.js` files. The simplest rune is `$state` which, as you might have guessed, is used to declare a stateful variable.

```ts
let count = $state(0);

// use the variable in the template

count++; // this will update the template
```

as you can see, you don't need to `import` anything: runes are just part of Svelte, the language.

If you need to derive a value from another value you can use the `$derived` rune (or the functional counterpart `$derived.by`). You just need to pass an expression to it for it to be reactive.

```ts
let count = $state(0);
let double = $derived(count * 2);
let triple = $derived.by(() => count * 3);

count++;
console.log(double, triple); // this will log 2 and 3
```

the third piece of the puzzle is `$effect`...this is used to sync your state with something that is not reactive by nature (Svelte for example uses `effects` to sync your state with the DOM).

**N.b. using `$effect` is considered an escape hatch...most of the time you don't need to use it**

`$effect` automatically tracks every stateful variable read inside the function you pass to it

```ts
let count = $state(0);
$effect(() => {
  console.log(count);
});

count++; // this will log 1 within the effect
```

One very relevant piece of information is how reactivity can cross module or function boundaries. Why? Because for the stateful variable to be "live" and react to changes cross module/function it needs to be enclosed in a closure. I know, these are a lot of complicated words but the gist of it is that if you export a stateful variable as is from a module the value will be "frozen" at the moment you import it.

If you do this

```ts
let count = $state(0);

export { count };
```

the moment you import `count` in another file only the current value of count will be imported (this is a JS limitation unfortunately).

And I'm ready to bet that this is exactly the reason you searched for this article. So let's dive right into it...

## Runic Global State

As I've said

> for the stateful variable to be "live" and react to changes cross module/function it needs to be enclosed in a closure

but what does this mean? It's very simple: you need a function!

```ts
let count = $state(0);

export function get() {
  return count;
}

export function set(new_count) {
  count = new_count;
}
```

just by doing this, our `count` variable will now be fully reactive

```svelte
<script>
  import { get, set } from "./count.svelte.js";
</script>

<button onclick={()=>{
	set(get()+1);
}}>
	{get()}
</button>
```

Here's a [svelte repl](https://svelte.dev/playground/a54adf9ebd2e41eb8e44886d67768077?version=5.19.8) you can play around with. Thanks for reading, bye!

...

I know, I know, this is not the best API. Let's try to do it better: instead of exporting a function that return our `count` we can export an object with a _getter_ and a _setter_!

```ts
let count = $state(0);

export const counter = {
  get value() {
    return count;
  },
  set value(new_count) {
    count = new_count;
  },
};
```

and you can use it like this

```svelte
<script>
  import { counter } from "./count.svelte.js";
</script>

<button onclick={()=>{
	counter.value++;
}}>
	{counter.value}
</button>
```

And here's the obligatory [repl](https://svelte.dev/playground/911996cc305d4794b3e2b2e10e2faa60?version=5.19.8) to play around with.

Much nicer right? We can do even better...when you pass an object to `$state` svelte cleverly wrap that object in a Proxy (you can read more about proxies on the official [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)...they are a fascinating feature of the language). To make it short: with proxies, we wrap every property of the object with a _getter_ and a _setter_ for you. So our declaration file becomes even shorter (relevant [repl](https://svelte.dev/playground/352c991f203d4feebb3c371e6166b9c3?version=5.19.8)).

```ts
export const counter = $state({ value: 0 });
```

With the only gotcha that you can't directly reassign it (basically you can't do `count = { value: 2 })`).

Another interesting way to have global state is with ES6 classes: you can use `$state` on class properties and they are also much more performant than POJOs (`v8`, the Javascript engine that runs your Javascript optimize classes a lot).

Here's a global counter implementation with classes:

```ts
class Counter {
  value = $state(0);
}

export const counter = new Counter();
```

and yes, you can use this in the same way as you can see in [this repl](https://svelte.dev/playground/c3006274ed734e2eadb64b8b2f094717?version=5.19.8).

## The perils of Global State

Ok, you have your answer, and I know you might be tempted to close this page and run to your editor of choice to implement it, but please bear with me just another second because what I'm about to explain is **VERY IMPORTANT**.

Global state in general may seem pretty innocent but it's generally discouraged even for medium sized apps. Things get even more dangerous when your app is what we call an Isomorphic Application. Isomorphic is just a fancy word to say that your app runs in different environments: most apps nowadays run in two phases: a _server-side_ and a _client-side_.

When a request hits our server, a Node process accepts the request and proceeds to render the right page, this means importing svelte components, executing them, agglomerate all the results and craft a valid HTML page that includes a script tag that, when on the client, will "hydrate" our application by attaching listeners, effects and such.

This is very important because our global state is technically alive in both environments. On the server there's a global `count` variable that gets recreated on the client. But both live on two separate computers! The server one lives on our server which serves all our requests. The client one lives in our users' browsers.

What does this mean? It means that if we have an actual global state we need to be very attentive to where we update it: if at any moment we update `count` in an imported JS module or in the `<script>` tag of a rendered component we will increment the value of `count` on the server which means that the subsequent request the value will not be `0` anymore but `1` (and so on for the next requests).

This is probably fine for a counter but imagine if instead this was our user profile?

_"But if i reassign it every time it's fine right?"_

Well, still not: it might be good as long as you don't have asynchronous code, but as soon as you do a `fetch` request (which is almost a guarantee), here's what could happen:

![a diagram showing how multiple async request could mutate global state causing the read of the wrong value](/assets/images/posts/2025-03-11-global-state-in-svelte-5/global-state-diagram.png)

That's obviously wrong and very dangerous! But I would not be here blabbering if I didn't have a solution to this problem!

### The solution

Before we begin diving in the solution a small disclaimer: what I'm about to explain make things way safer (eliminating the problems we talked in the above paragraph) but does make things a bit more complex. But don't worry we will go in details about how it works and everything will be clear by the end of this blog post.

The first thing to know is that if you need to access state inside a `load` function there's a tool appositely made for that: the [`locals`](https://svelte.dev/docs/kit/hooks#Server-hooks-locals) object. Every time a new request is handled by Svelte Kit you can access the `event` which will be unique for the duration of the request. On the `event` you can read or write to `event.locals` to share context throughout the various `load` function.

Let's make an example to make this clearer: let's say you want to have a `user` object that will contain the currently logged in user info. The first thing you would do (if you are using Typescript...but let's be honest who doesn't) is update [`app.d.ts`](https://svelte.dev/docs/kit/types#app.d.ts) which is a global declaration files that Svelte Kit uses to allow you to specify four kind of types: by default it will look like this

```ts
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
```

As you might have guessed the line we are interested in is `interface Locals`...by uncommenting and modifying that line we can specify the shape for `event.locals`

```ts
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: { name: string; last_name: string };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
```

then we can proceed with the second piece of the puzzle: [the hooks file](https://svelte.dev/docs/kit/hooks#Server-hooks).

You can create a file name `hooks.server.ts` in the `src` folder and define a `handle` function there. This will act as a sort of middleware, being invoked on each request. And inside the function we can fetch the current user and update the `locals` object.

```ts
export function handle({ event, resolve }) {
  const user_cookie = event.cookies.get("user");
  if (user_cookie) {
    // update the locals object
    event.locals.user = await fetch_user(user_cookie);
  }
  return resolve(event);
}
```

Now we have our `event.locals.user` everywhere in our `load` functions! But what about the client side?

For that we need a bit more work. We can create a root layout in `/src/routes` and we can return the user from our locals

```ts
export function load({ locals }) {
  return {
    user: locals.user,
  };
}
```

this will make `user` accessible through `page.data`

```svelte
<script>
	import { page } from '$app/state';
</script>
```

and since states from `$app/state` are managed by sveltekit they are already safe against cross request leakage.

But what if you have some stateful variable that is not coming from the server? And maybe you want to be able to also set that and have the new value be reflected in the whole app? We've got a solution for that too!

We can utilize the same technique that Svelte Kit uses to make their state unique per request by making use of another svelte primitive: contexts. If we create a context in the root layout our whole app will have access to that context and since the root layout will be instantiated anew for every request it will also be safe to use. Let's see how we can do it.

### Using contexts

Let's imagine that we want to have a global notifications state so that we can push new notifications to it from everywhere and show all the notifications from the root of our application.

You can technically just use context from the root layout and be done with it but that's error prone and not really type safe so a much better alternative is to create a module where we instantiate out context and export a couple of type-safe functions to access it.

```ts
import { getContext, setContext } from "svelte";

// we can use this as the key of the context to prevent conflicts
const CONTEXT_KEY = Symbol();

type Notifications = string[];

export function set_notifications(notifications: Notifications) {
  return setContext<Notifications>(CONTEXT_KEY, notifications);
}

export function get_notifications() {
  return getContext<Notifications>(CONTEXT_KEY);
}
```

by doing this we can then update our root layout to initialize a new stateful variable and add it to the context.

{% raw %}

```svelte
<script lang="ts">
	import { set_notifications } from '$lib/notification-context.ts';
	const { children } = $props();

	const notifications = $state<string[]>([]);

	set_notifications(notifications);
</script>

{@render children()}

<aside>
	{#each notifications as notification}
		<article>{notification}</article>
	{/each}
</aside>
```

{% endraw %}

now to show a new notification we can just retrieve the notifications and push to the array

```svelte
<script lang="ts">
	import { get_notifications } from '$lib/notification-context.ts';

	const notifications = set_notifications(notifications);
</script>

<button onclick={()=>{
	notifications.push("New notification!");
}}>send notification</button>
```

and voilà! Now we have global state that is safe and easy to use!

## Conclusions

Global state is sometimes un-avoidable but luckily it doesn't have to be scary and svelte provides all the tools to make the job safe and simple...i hope this brief article will help you do the right choices the next time you'll need something like this!

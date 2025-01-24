---
title: "Runes and Global state: do's and don'ts"
authorHandle: paoloricciuti
tags: [svelte]
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "Paolo Ricciuti (paoloricciuti) shows how (but most importantly how not) handle global state in Svelte 5"
og:
  image: /assets/images/posts/2023-11-28-sveltekit-storybook/og-image.jpg
tagline: |
  <p>Are you using SvelteKit? Are you using Storybook with it? Well, i have good news for you because the SvelteKit integration just got a whole lot better!</p>

image: "/assets/images/posts/2025-02-01-global-state-in-svelte-5/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

# Runes and Global state: do's and don'ts

On the 20th of September of 2023 Runes were introduced to the Svelte ecosystem. This brand new paradigm was a complete rewrite of the underlying structure of Svelte, moving from a compile only to a compile enhanced reactivity system, with a very small and extremely performant runtime footprint.

One of the greatest advantages of this brand new paradigm is what was introduced as "Universal Reactivity".

## Previously on Svelte 4

Before the release of runes Svelte lived in two worlds: the magical and fantastical world inside a Svelte component and the harsher reality of a Javascript file. Inside a `.svelte` file variables were automatically reactive and the labeled statement allowed you to react to changes. In a `.js` file however Svelte had no power and you had to use stores to reactively interact with data.

### Stores

A store in Svelte was an observable: an object with a `subscribe` method (that returned an `unsubscribe` function) and potentially a `set` and an `update` methods. You could `subscribe` to a store passing as an argument a function that would be invoked whenever a new value was `set` on the store.

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

Before we begin let's take a brief look at how runes work: runes are magical symbols that instruct the compiler that we want something special. They work inside `.svelte` files but also inside `.svelte.js` files. The simplest runes is `$state` which, as you might have guessed, is used to declare a stateful variable.

```ts
let count = $state(0);

// use the variable in the template

count++; // this will update the template
```

as you can see you don't need to `import` anything: runes are just part of Svelte, the language.

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

And i'm ready to bet that this is exactly the reason you searched for this article. So let's dive right into it...

## Runic Global State

As i've said

> for the stateful variable to be "live" and react to changes cross module/function it needs to be enclosed in a closure

but what does it means? It's very simple: you need a function!

```ts
let count = $state(0);

export function get() {
  return count;
}

export function set(new_count) {
  count = new_count;
}
```

just by doing this our count variable will now be fully reactive

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

Thanks for reading, bye!

...

I know, I know, this is not the best api. Let's try to do better: instead of exporting a function that return our `count` we can export an object with a getter and a setter!

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

Much nicer right? We can do even better...when you pass an object to `$state` svelte cleverly wrap that object in a Proxy (you can read more about proxies on the official [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)...they are a fascinating feature of the language). To make it short: with proxies we wrap every property of the object with a getter and a setter for you. So our declaration file become even shorter.

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

and yes, you can use this in the same way.

## The perils of Global State

Ok, you have your answer and i know you might be tempted to close this page and run to your editor of choice to implement it but please bear with me just another second because what I'm about to explain is **VERY IMPORTANT**.

Global state in general may seem pretty innocent but it's generally discouraged even for medium sized apps. Things get even more dangerous when your app is what we call an Isomorphic Application. Isomorphic is just a fancy word to say that your app runs in different environment: most app nowadays run in two phases: a server side and a client side.

When a request hit our server a Node process accept the request and proceed to render the right page, this means importing svelte components, executing them, agglomerate all the results and craft a valid HTML page that includes a script tag that, when on the client, will "hydrate" our application by attaching listeners, effects and such.

This is very important because our global state is technically alive in both environments. On the server there's a global `count` variable that get's recreated on the client. But the twos lives in two separate computers!! The server one lives on our server which serve all our requests. The client one lives in our users browsers.

What does this means? It means that if we have a true global state we need to be very attentive of where we update it: if in any moment we update `count` in an imported JS module or in the script tag of a rendered component we will increment the value of `count` on the server which means that the next request the value will not be `0` anymore but `1` (and so on for the next requests).

This is probably fine for a counter but imagine if instead this was our user profile?

_"But if i reassign it every time it's fine right?"_

Well, still no: it might be good as long as you don't have asynchronous code but as soon as you do a `fetch` request (which is almost a guarantee) here's what could happen:

![a diagram showing how multiple async request could mutate global state causing the read of the wrong value](/assets/images/posts/2025-02-01-global-state-in-svelte-5/global-state-diagram.png)

That's obviously wrong and very dangerous! But I would not be here blabbering if I didn't have a solution to this problem!

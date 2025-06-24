---
title: "How to build Web Components with Svelte"
authorHandle: paoloricciuti
tags: [svelte]
customCta: "global/svelte-workshops-cta.njk"
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "What is a Web Component, how to build one and, most importantly, how to do it with Svelte for ease of development"
autoOg: true
tagline: <p>Web Components are cool but very difficult to build... can Svelte be of any help here?</p>

image: "/assets/images/posts/2025-06-25-web-components-with-svelte/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

When I started learning HTML, I was quite fascinated by how a simple `<marquee>` tag could magically make the text inside of it start to move.

<marquee>Come on! Isn't this cool?</marquee>

But especially when I started building for the web, there weren't that many cool tags: for instance, `<input type="date" />` was not a thing back then, and the number of people who actually **surfed the web** (gosh, I miss the times when the web had all these cool words... I'll secretly continue to call myself a Web Master until the doom of humanity) explicitly disabling JavaScript was a concern to have.

Over the years, CSS and HTML became more and more powerful, and nowadays we can do things that weren't even imaginable 18 years ago. When I got back into web development from my detour into photography, I started exploring the space again. One of the first things I learned was about this pretty new API available in browsers: the [Web Components API](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)!

## The Web Components API

For those unfamiliar (and who don't want to read the linked MDN article), let's do a quick recap of this API. On the surface, it's absolutely great: you can create your own HTML element! To do so, you just need to create a class that extends `HTMLElement`, define a `connectedCallback` (which is invoked when your component is actually mounted to the DOM), create "the shadow DOM" (which is a way-too-cool name for the invisible root element of your custom element that you can append to), and use the custom element registry to define your very own tag.

```ts
class FancyButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const btn = document.createElement("button");
    btn.textContent = "I'm fancy";
    btn.addEventListener("click", () => {
      alert("I'm super fancy actually! 😎");
    });
    shadow.append(btn);
  }
}

customElements.define("fancy-button", FancyButton);
```

If you paste this code in the script tag of your app, you can then just use `<fancy-button>` as if it were a native element. In this case, it might not be super useful (it's just a button with a fixed `textContent` and event listener), but can you imagine the possibilities? 😍

### The harsh reality

Unfortunately, as reality always does, the truth is a bit less gleaming: the Web Components API starts pretty simple but gets complicated quite quickly:

- Do you want to listen for prop changes? You need to define a static `observedAttributes` array of strings that contains all the attributes you want to listen for and an `attributeChangedCallback` method that will be invoked every time they change.
- Do you want to accept some content inside? You need to learn the intricacies of the `<slot />` element and how it interfaces with the outside world.
- You need to learn about properties vs attributes.
- You need to work with imperative vanilla JavaScript, which can get unwieldy pretty quickly.
- And please, let's not talk about integrating custom elements with forms!

So while initially it might look like a walk in the park, writing good custom elements can get very complex very fast. Let's see an example of a very basic counter component with particular styling.

```ts
class CounterComponent extends HTMLElement {
  #count = 0;
  #preSentence = "";
  #btn;
  #controller;
  static observedAttributes = ["count", "pre-sentence"];

  constructor() {
    super();
  }

  attributeChangedCallback(attribute, old_value, new_value) {
    if (attribute === "count") {
      // attributes are always strings so we need to parse it
      this.#count = parseInt(new_value);
    } else if (attribute === "pre-sentence") {
      // attributes in the DOM can't be camel case so we need to listen for `pre-sentence`
      // even if our variable is camel case
      this.#preSentence = new_value;
    }
    // this callback can be called before the connectedCallback if the attribute
    // is present when it's mounted so we need to check if btn is there before mounting
    if (this.#btn) {
      this.#btn.textContent = `${this.#preSentence} ${this.#count}`;
    }
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    // we use an abort controller to clean up all the event listeners
    // on disconnect
    this.#controller = new AbortController();
    // we need a reference to the button to update its text content when the attribute changes
    this.#btn = document.createElement("button");
    this.#btn.textContent = `${this.#preSentence} ${this.#count}`;
    this.#btn.addEventListener(
      "click",
      () => {
        this.#count++;
        this.#btn.textContent = `${this.#preSentence} ${this.#count}`;
      },
      {
        signal: this.#controller.signal,
      }
    );
    const style = document.createElement("style");
    // we can just reference `button` since all the styles will be "trapped" in the shadow DOM
    style.innerHTML = `button{
	all: unset;
	border-radius: 100vmax;
	background-color: #ff3e00;
	color: #111;
	padding: 0.5rem 1rem;
	cursor: pointer;
  font-family: monospace;
}`;
    shadow.append(style);
    shadow.append(this.#btn);
  }

  disconnectedCallback() {
    // cleanup every event listener
    this.#controller.abort();
  }
}

customElements.define("counter-component", CounterComponent);
```

Once you define it, you can use it like this:

```html
<counter-component count="10" pre-sentence="count"></counter-component>

<button>change counts</button>
<button>change sentence</button>
```

And to interact with it externally:

```js
const [change_count, change_sentence] = document.querySelectorAll("button");
const counter = document.querySelector("counter-component");

change_count.addEventListener("click", () => {
  counter.setAttribute("count", "42");
});

change_sentence.addEventListener("click", () => {
  counter.setAttribute("pre-sentence", "count is");
});
```

You can play around with it on this [CodePen](https://codepen.io/paoloricciuti/pen/azOPZvZ), but as you can see, that's a lot of code for a relatively simple component.

## The better solution

As is often the case whenever there's something pretty cool but pretty complex, engineers do what they do best: **ABSTRACT**!

So when Svelte was released, the Svelte team thought: since Svelte is meant to create components... what if we allow a Svelte component to be compiled to a custom element?

And that's exactly what the `customElement` option in the [Svelte config](https://svelte.dev/docs/svelte/svelte-compiler#CompileOptions) allows you to do!

Once you set that to true, every component in your application will be compiled as usual, but an extra line would be added at the end. This is an "empty" Svelte component compiled with the `customElement` option set to true:

```ts
import "svelte/internal/disclose-version";
import "svelte/internal/flags/legacy";
import * as $ from "svelte/internal/client";

export default function Empty($$anchor) {}

$.create_custom_element(Empty, {}, [], [], true);
```

I bet you can guess which line we are interested in! 😄

The `create_custom_element` function receives the Svelte component as input (and a series of arguments we will explore later) and wraps it with a class that handles all the annoying bits for you. However, it doesn't define a custom element for you unless you specify the tag name with `<svelte:options customElement="my-tag" />` in your component. However, you can find the class on the `element` property of the function, which means that if you want, you can use the Svelte component just as a Svelte component, but if you want to use it as a custom element, you can manually register it as you want like this:

```ts
import Empty from "./Empty.svelte";

customElements.define("empty-component", Empty.element);
```

But an Empty component is quite boring... let's start to fill this component up by recreating our first fancy button example.

```svelte
<svelte:options customElement="fancy-button" />

<button onclick={()=> alert("I'm super fancy actually! 😎")}>I'm fancy</button>
```

This compiles to this JavaScript code:

```ts
import "svelte/internal/disclose-version";
import "svelte/internal/flags/legacy";
import * as $ from "svelte/internal/client";

var on_click = () => alert("I'm super fancy actually! 😎");
var root = $.from_html(`<button>I'm fancy</button>`);

export default function FancyButton($$anchor) {
  var button = root();

  button.__click = [on_click];
  $.append($$anchor, button);
}

$.delegate(["click"]);
customElements.define(
  "fancy-button",
  $.create_custom_element(FancyButton, {}, [], [], true)
);
```

As you can see, since we declared the tag with `svelte:options`, it's automatically defining it, which means that if we want to use it, we just need to do:

```ts
import "./FancyButton.svelte";
```

But where things really shine is when you start to add props to the component... let's rebuild our `counter-component` with Svelte!

{% raw %}

```svelte
<!--we need CSS injected to inject the styles directly into the custom element-->
<svelte:options
	css="injected"
	customElement={{
	tag: "counter-component",
	props: {
		count: {
			type: "Number"
		},
		preSentence: {
			attribute: "pre-sentence",
		}
	}
}} />

<script>
	let { count, preSentence } = $props();
</script>

<button onclick={() => count++}>{preSentence} {count}</button>

<style>
	button{
		all: unset;
		border-radius: 100vmax;
		background-color: #ff3e00;
		color: #111;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-family: monospace;
	}
</style>
```

{% endraw %}

Writing code like this is already much more manageable:

- We don't need to handle registering and canceling event listeners.
- We don't need to update the DOM manually every time.
- In turn, we don't need to keep a reference to the button around.
- We don't need to parse out `count` manually... Svelte is doing that for us when we specify the `props` attribute of `customElement`.
- Similarly, to sync between `preSentence` and `pre-sentence`, we just need to add the `attribute` property.

Svelte also helps us with how we can interact with our custom element from the outside world:

```svelte
<script>
	import "./CounterComponent.svelte";

	let counter;
</script>

<counter-component bind:this={counter} count={10} pre-sentence="count"></counter-component>

<button onclick={()=>counter.count = 42}>change counts</button>
<button onclick={()=>counter.preSentence = "count is"}>change sentence</button>
```

As you can see, Svelte created getters and setters for our props so that we can access them without having to rely on `setAttribute`.

Once again, here's a [Svelte playground](https://svelte.dev/playground/e309ec57a14d4c11aa3edf1934fb3670?version=5.34.7) if you want to play around with it. (Unfortunately, based on how the playground doesn't refresh the page and how you can't redefine the same custom element twice, you'll need to refresh the page if you want to make a change to the code 🤷🏻‍♂️)

## Where do we go from here?

I can already hear a question building up in your mind... what even is the point of all this? Why would I build a Web Component with Svelte if I could just use the Svelte component as a Svelte component? Well, the nice thing about Web Components is that they are effectively framework agnostic... if you build your Svelte project as a library and install it in your React project, you can effectively start using Svelte in your legacy-different-framework project TODAY!

How? Well, this would require far more words than this blog post can contain without it being too long, but I have good news for you: we are organizing [a workshop](https://ti.to/mainmatter/svelte-without-svelte-july-2025) that is fully focused on how to use Svelte in your non-Svelte project... we will go over how to build effective Web Components, how to build a library out of them, but also how to use Svelte next to your React app as is without the need to build a Web Component library first.

# Conclusion

Web Components are a really powerful feature of the Platform™, but they really didn't gain much traction because of how much more maintainable it is to write your components with a framework... but sometimes they can be the right solution, and I absolutely love the fact that Svelte allows you to build them in the same simple way with just a bit of configuration.

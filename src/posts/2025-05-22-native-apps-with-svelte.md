---
title: "Truly Native Apps with Svelte?"
authorHandle: paoloricciuti
tags: [svelte]
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "How we set up to build an integration with Lynx to make truly native apps in Svelte"
autoOg: true
tagline: <p>Is it possible to build a truly native app in Svelte? Soon™ it might be!</p>

image: "/assets/images/posts/2025-05-22-native-apps-with-svelte/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

After the introduction of Svelte version 3 on the 22nd of April 2019, it kind of took the web development world by storm. Since its original release, it has consistently been the most loved and interesting framework in the [State of JS](https://share.stateofjs.com/share/prerendered?localeId=en-US&surveyId=state_of_js&editionId=js2024&blockId=front_end_frameworks_ratios&params=&sectionId=libraries&subSectionId=front_end_frameworks).

![State of JS survey results showing Svelte consistently on top for interest](/assets/images/posts/2025-05-22-native-apps-with-svelte/state-of-js.png)

So, it's no surprise that developers want to use it for work.

However, sometimes the requirements force your project out of your favorite framework. For Svelte, one of the pain points is that there is no way to write a truly native application.

To be completely fair, sometimes this is a non-issue. There are plenty of projects that allow you to write a "native" application with web technologies:

- **[Capacitor](https://capacitorjs.com/)**: Sprouted from a similar project (Ionic), it builds your Svelte app as a static website and serves it directly from your phone while mounting a web view to display it. It has a rich ecosystem and provides bindings to access the native layer.
- **[Tauri](https://v2.tauri.app/start/)**: It also mounts your web application in a web view, providing bindings to access the native layer in Rust. It can also build for Desktop (similar to [Electron](https://www.electronjs.org/)) and promises fast and lightweight apps.
- **[NativeScript](https://nativescript.org/)**: Among the three, NativeScript is effectively the only one that actually results in a truly native application. However, the community is not super great, and it doesn't work with the latest version of Svelte.

## A new player: Lynx

Earlier this year, a new player entered the space: [Lynx](https://lynxjs.org/)!

![Homepage of the Lynx framework asserting the goal is to unlock native for more people](/assets/images/posts/2025-05-22-native-apps-with-svelte/lynx-homepage.png)

Lynx is backed by ByteDance, the company behind the popular app _TikTok_, and they are using it for some subsidiary apps. In their [introductory blog post](https://lynxjs.org/blog/lynx-unlock-native-for-more.html), they claim better performance thanks to a brand-new dual-thread model that separates the rendering of your application from the logic of your application, the capability of rendering your application for native as well as for web and, most importantly for Svelte, an agnostic core.

### The catch

This seems like a dream come true... Can we finally ship native apps written in Svelte to production? Unfortunately, not so fast!

Firstly, the Lynx ecosystem is still very much in the early stages and only work out-of-the-box with React, but most importantly, to really make use of the agnostic core of Lynx, a framework has to have a key feature that Svelte is currently lacking: a custom renderer API!

## What is a custom renderer?

The first thing you think about when you talk about a JS framework like Svelte is something that allows you to create HTML with a declarative method: instead of imperatively adding an event listener and setting the text content of an element, you declare how your UI should look, and the framework executes the JavaScript needed to make that happen. But it doesn't need to be that way. The reason why [React Native](https://reactnative.dev/) can exist is because React didn't concern itself with the DOM. In fact, React is basically just a diffing library. It takes your code, performs the reconciliation on your JSX, and keeps track through the virtual DOM of the current state of the tree.

What actually applies React's state to the DOM is a renderer (most of the time React-DOM). However, since the two pieces are separated, you can actually change the React renderer. This allows you to render a React component to the DOM, to a native interface, [the terminal](https://github.com/vadimdemedes/ink), or even to [a video](https://www.remotion.dev/).

Wouldn't it be cool if we had this in Svelte?

## The mission

Here at Mainmatter, we work with Svelte, and like most of the web development world, we love it. So when Lynx entered the stage and we realized what this could unlock for projects that need a truly native app, we said to ourselves: "Let's do something about it."

So we decided to start from the first building block: the custom renderer API!

### The approach

If you have ever used Svelte, you might be aware of its approach: Svelte is a compiler that takes your `.svelte` files and turns them into highly performant JavaScript. When you compile a Svelte component, you can specify the `generate` option: if the option is `client`, it will generate a function that uses signals under the hood to wire up the reactivity to your DOM; if it is `server`, it will generate a function that will concatenate a string to server-side render your application.

The first problem we faced in building the custom renderer API is that, as of today, a client component kind of assumes that it will be executed in the browser. To quickly and performantly generate the elements that it needs, it uses the [template tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template). It basically does something like this:

```ts
function template(content: string) {
  const template_tag = document.createElement("template");
  template_tag.innerHTML = content;
  return template_tag.content;
}
```

No matter how complex of an HTML string `content` is, this very simple code will just create all the elements with the right nesting, the right namespace (in HTML, you can have SVGs within the HTML, and those need to be created with the right namespace), and it will do so via the browser parser in a very performant way.

But, as you might have guessed, this is a problem if we want to render Svelte to something that is not in a DOM environment since it relies on a DOM API.

So my first step was to create a new option for the compiler that allows you to specify the templating mode. It required some changes to the compiler that, up until that moment, was just concatenating strings, but what I ended up doing allows for the compiler to generate something that looks like this:

```ts
var root = $.template_fn([
  {
    e: "div",
    p: { class: "welcome" },
    c: [{ e: "b", c: ["Hi"] }],
  },
]);
```

Under the hood, this function invokes `document.createElement`, `document.createTextNode`, or `element.setAttribute` to generate the same DOM that a browser would generate using the template tag. At this point, we didn't know how the custom renderer API would look yet, but we knew that this was a necessary step. If you are curious about the changes to Svelte to achieve this, here's [the PR](https://github.com/sveltejs/svelte/pull/15538) where this was implemented.

At this point, I started looking at other frameworks for inspiration. [Vue](https://vuejs.org/) already had a [rough implementation of the Lynx integration](https://github.com/lynx-family/lynx-stack/commit/d4f42f32ac64b47c6f24c31df513e70bb82d5659), so I started looking into that. The idea is that you can provide a series of functions to the framework to create an element or a text node, to insert an element in another, or to set a prop. The framework will call those functions instead of `document.createElement`. However, at least for now, the Vue model is quite different from Svelte. It's still using a virtual DOM, and it does things in a slightly different way. [Solid](https://www.solidjs.com/), on the other hand, is way closer to Svelte, both in terms of the reactivity model and in terms of output (as an example, Solid also uses the same template trick to get all the elements). Funnily enough, Solid's custom render API was inspired by the Vue one.

At this point, I created a project with Solid and started exploring the API and the built output.

One thing that struck me was that the build output from a `universal` rendered application (that's how it's called in Solid) was very different from the normal `client` output. Mostly because all the creations and updates were done inline in the component itself.

For instance, this is a very simple Solid component compiled for the DOM:

```ts
var _tmpl$ = /* @__PURE__ */ template(
  `<div class=styles.App><header class=styles.header><img class=styles.logo alt=logo><p>Edit <code>src/App.tsx</code> and save to reload.</p><a class=styles.link href=https://github.com/solidjs/solid target=_blank rel="noopener noreferrer">Learn Solid`
);
const App = () => {
  return (() => {
    var _el$ = _tmpl$(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild;
    setAttribute(_el$3, "src", logo);
    return _el$;
  })();
};
```

And this is the same component compiled with the `universal` flag:

```ts
const App = () => {
  return (() => {
    var _el$ = createElement("div"),
      _el$2 = createElement("header"),
      _el$3 = createElement("img"),
      _el$4 = createElement("p"),
      _el$5 = createTextNode(`Edit `),
      _el$6 = createElement("code"),
      _el$8 = createTextNode(` and save to reload.`),
      _el$9 = createElement("a");
    insertNode(_el$, _el$2);
    setProp(_el$, "class", "styles.App");
    insertNode(_el$2, _el$3);
    insertNode(_el$2, _el$4);
    insertNode(_el$2, _el$9);
    setProp(_el$2, "class", "styles.header");
    setProp(_el$3, "src", logo);
    setProp(_el$3, "class", "styles.logo");
    setProp(_el$3, "alt", "logo");
    insertNode(_el$4, _el$5);
    insertNode(_el$4, _el$6);
    insertNode(_el$4, _el$8);
    insertNode(_el$6, createTextNode(`src/App.tsx`));
    insertNode(_el$9, createTextNode(`Learn Solid`));
    setProp(_el$9, "class", "styles.link");
    setProp(_el$9, "href", "https://github.com/solidjs/solid");
    setProp(_el$9, "target", "_blank");
    setProp(_el$9, "rel", "noopener noreferrer");
    return _el$;
  })();
};
```

However, we kind of already solved this issue with the function that I showed you above. So after a bit of brainstorming with the other maintainers, we decided that, to keep things as maintainable as possible, we wanted to change the compiler output as little as possible. After all, even if you are creating different elements, the rest of the operations is just JavaScript. The client code is still kind of interacting with the DOM API, however, so...

### Mom, can we have DOM? We have DOM at home!

To solve this problem, the first idea was: what if when you define your elements, we wrap them with an HTML-compatible API before feeding them to the client runtime? So every element would still have a `firstChild` getter that will invoke your custom renderer to get the first child and an `insertBefore` method that invokes your custom renderer `insert` method with the right nodes. If everything goes to plan, we can just reuse the same runtime code and be done with it!

Well... the DOM has a looooot of quirky behaviors, and the Svelte runtime actually makes use of some of them. For example, if you do `div.innerText=''`, it will remove every single element within the div. And obviously, there are a lot of less quirky but complex behaviors... doing `input.value` should also update the value attribute and so on. All in all, I kind of got this working, but it really felt like a hack with a bug hidden around every corner.

So I guess back to the drawing board!

### A simpler runtime

Another problem with this first approach was that when implementing new features for Svelte, we would need to pay close attention to which DOM API we were using because if that DOM API was not implemented in our HTML-compatible API, we would introduce a bug. So to make things clearer when developing Svelte, we decided to go a different route.

Let's look at a very simple Svelte component:

{% raw %}

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={()=>{
	count++;
}}>{count}</button>

{#if count % 2 === 0}
	even
{/if}
```

{% endraw %}

This is compiled to this:

```ts
import "svelte/internal/disclose-version";
import * as $ from "svelte/internal/client";

var on_click = (_, count) => {
  $.update(count);
};

var root = $.template_fn([{ e: "button", c: [" "] }, " ", ,], 1);

export default function App($$anchor) {
  let count = $.state(0);
  var fragment = root();
  var button = $.first_child(fragment);

  button.__click = [on_click, count];

  var text = $.child(button, true);

  $.reset(button);

  var node = $.sibling(button, 2);

  {
    var consequent = $$anchor => {
      var text_1 = $.text("even");

      $.append($$anchor, text_1);
    };

    $.if(node, $$render => {
      if ($.get(count) % 2 === 0) $$render(consequent);
    });
  }

  $.template_effect(() => $.set_text(text, $.get(count)));
  $.append($$anchor, fragment);
}

$.delegate(["click"]);
```

The reactivity part of this (those `$.state`, `$.get`, and `$.update` functions) is just JavaScript, but the rest is reaching for some DOM API under the hood to get the first child, append, set the text value, etc.

Also, the template part (`$.template_fn` and `$.if`) are dealing with hydration, transitions, and animations... all things that only really make sense in a DOM environment (hydration is the idea of attaching listeners to server-side rendered DOM elements, animation and transitions use the web animation API under the hood). So what we could do is just swap the whole runtime for a much simpler one that doesn't need to take care of hydration, animation, transitions, and most importantly, doesn't use DOM quirky behaviors. As mentioned, this will also help with maintainability since the two runtimes are separate, so we don't risk using quirky behaviors in one that break the other.

Here's how a custom renderer compiled component looks like if we set the `customRenderer` compile option to `my-custom-renderer-package`:

```ts
import * as $ from "svelte/internal/custom";
import $renderer from "my-custom-renderer-package";

var root = $.template_fn([{ e: "button", c: [" "] }, " ", ,], 1);

export default function App($$anchor) {
  var $$pop_renderer = $.push_renderer($renderer);
  let count = $.state(0);
  var fragment = root();
  var button = $.first_child(fragment);
  var text = $.child(button, true);

  $.reset(button);

  var node = $.sibling(button, 2);

  {
    var consequent = $$anchor => {
      var text_1 = $.text("even");

      $.append($$anchor, text_1);
    };

    $.if(node, $$render => {
      if ($.get(count) % 2 === 0) $$render(consequent);
    });
  }

  $.template_effect(() => $.set_text(text, $.get(count)));

  $.event("click", button, () => {
    $.update(count);
  });

  $.append($$anchor, fragment);
  $$pop_renderer();
}
```

As you can see, the changes are pretty minimal:

- We don't disclose the version anymore since that is adding the version on the `window`.
- We import from `svelte/internal/custom` rather than `svelte/internal/client`... this is our new minimal runtime.
- We import the renderer from the package that you provide.
- We push the renderer in a global variable at the beginning of the component so that inside every function we can use that.
- The rest basically looks the same except we don't delegate events (since that is assuming a bubbling event system)... luckily some events in DOM also receive this treatment so it's just a flag in the compiler.

## The Lynx experiment

After we got the API mostly nailed down, I went ahead and implemented the initial part of the runtime while also importing the reactivity part directly from the client runtime. Now it was time to test the APIs to figure out if they were flexible enough. I talked with Grischa Erbe (the creator of [Threlte](https://threlte.xyz/), a possible user of the renderer), who gave me some initial feedback (more on that later), and then decided to embark on an experiment to really put the renderer to the test.

Build a POC of an actual renderer for Lynx.

So I built my local version of Svelte and initialized a brand-new Lynx project. And then I was stuck 😅.

Lynx is brand new, and there's not much documentation about it, even less about how to build a framework integration with it. What followed were two days of trial and error, following small breadcrumbs of code in the depths of the Lynx codebase. Joining the [Lynx community on Discord](https://discord.gg/mXk7jqdDXk) helped a lot. By extrapolating code from their Solid example and with a bit more wiring up, I finally had it: a Lynx application built with Svelte right on my phone screen.

I know you are eager to look at it, so here we go: here's a very rough custom renderer for Lynx.

```ts
import { createCustomRenderer } from "svelte/renderer";

let pageId;

const event_reg_xp =
  /^(bind|catch|capture-bind|capture-catch|global-bind)([A-Za-z]+)$/;
const event_type_map = {
  bind: "bindEvent",
  catch: "catchEvent",
  "capture-bind": "capture-bind",
  "capture-catch": "capture-catch",
  "global-bind": "global-bindEvent",
};

const parents = new WeakMap();

export function set_page_id(id) {
  pageId = id;
}

const create_element_map = new Map([
  ["view", __CreateView],
  ["scroll-view", __CreateScrollView],
  ["text", __CreateText],
  ["list", __CreateList],
  ["image", __CreateImage],
]);

export default createCustomRenderer({
  createFragment() {
    return {
      kind: "fragment",
    };
  },
  setAttribute(element, key, value) {
    if (key === "style") {
      __SetInlineStyles(element, value);
    } else if (key === "class") {
      __SetClasses(element, value);
    } else if (key.startsWith("data-")) {
      __AddDataset(element, key.slice(5), value);
    } else {
      __SetAttribute(element, key, value);
    }
    __FlushElementTree(element);
  },
  createElement(name) {
    const args = [pageId];
    if (!create_element_map.has(name)) {
      args.unshift(name);
    }
    if (name === "list") {
      args.push(undefined);
      args.push(undefined);
    }
    return (create_element_map.get(name) ?? __CreateElement)(...args);
  },
  createTextNode(data) {
    return __CreateRawText(data);
  },
  setText(node, text) {
    __SetAttribute(node, "text", text);
    __FlushElementTree(node);
  },
  createComment() {
    return __CreateNonElement(pageId);
  },
  getFirstChild(element) {
    if (element.kind === "fragment") {
      return element.children?.[0];
    }
    return __FirstElement(element);
  },
  getNextSibling(element) {
    const parent = parents.get(element);
    if (parent && "kind" in parent && parent.kind === "fragment") {
      const idx = parent.children.findIndex(el => el === element);
      return parent.children[idx + 1];
    }
    const sibling = __NextElement(element);
    return sibling;
  },
  insert(parent, element, anchor) {
    if (parent?.kind === "fragment") {
      if (parent.children == null) {
        parent.children = [];
      }
      if (element.kind === "fragment") {
        for (let child of element.children) {
          const idx = parent.children.findIndex(el => el === anchor);
          parent.children.splice(
            idx !== -1 ? idx : parent.children.length,
            0,
            child
          );
          parents.set(child, parent);
        }
      } else {
        const idx = parent.children.findIndex(el => el === anchor);
        parent.children.splice(
          idx !== -1 ? idx : parent.children.length,
          0,
          element
        );
        parents.set(element, parent);
      }
    } else {
      for (let child of element.children ?? [element]) {
        __InsertElementBefore(parent, child, anchor);
        parents.set(child, parent);
      }
      __FlushElementTree(parent);
    }
  },
  remove(node) {
    if (!node) return;
    const parent = parents.get(node);
    if (parent.kind === "fragment") {
      parent.children = parent.children.filter(el => el !== node);
    } else {
      __RemoveElement(parent, node);
      __FlushElementTree(parent);
    }
  },
  getParent(element) {
    return parents.get(element) ?? __GetParent(element);
  },
  addEventListener(element, event_name, handler) {
    let match = event_name.match(event_reg_xp);
    const event = event_type_map[match[1]];
    const name = match[2];
    __AddEvent(element, event, name, {
      type: "worklet",
      value: handler,
    });
  },
});
```

There's a lot to unpack here but the gist of it is:

- Those methods will be called by Svelte whenever needed (to create an element, add a listener, update a prop)
- Every method with a double underscore is part of the [Lynx PAPI](https://lynxjs.org/api/engine/element-api.html) and that's what's responsible to create the native elements.
- Since Lynx doesn't have the concept of a fragment I had to implement the same logic by hand.

This is the component that is being rendered

{% raw %}

```svelte
<svelte:options customRenderer="./renderer.js" />

<script>
	import Todo from './Todo.svelte';
	let todo = $state('');
	let todos = $state([]);
</script>

<view class="main">
	{#key todos.length}
		<image
			src="https://github.com/sveltejs/branding/blob/master/svelte-logo-square.png?raw=true"
		></image>
	{/key}
	<view class="add">
		<text class="title">Svelte + Lynx Todo</text>
		<view class="input">
			<input
				onbindinput={(e) => {
					todo = e.detail.value;
				}}
			/>
			<view
				onbindtap={() => {
					if (todo) {
						todos.push({ todo, done: false });
					}
				}}
				class="button"><text>Add</text></view
			>
		</view>
	</view>
	<view class="each">
		{#each todos as todo, index}
			<Todo
				{todo}
				ontoggle={() => {
					todo.done = !todo.done;
				}}
			/>
		{/each}
	</view>
</view>

<style>
	.main {
		display: grid;
		grid-template-rows: auto auto 1fr;
		align-items: center;
		justify-items: center;
		height: 100vh;
		background: linear-gradient(45deg, #ff3e00 0%, white 70%, #ff3e00 100%);
		gap: 40rpx;
		padding-top: 10vh;
	}
	image {
		width: 240rpx;
		height: 240rpx;
		border-radius: 64rpx;
		justify-self: center;
		animation: rotate 500ms;
	}
	.title {
		font-size: 50rpx;
		margin-bottom: 20rpx;
		font-weight: bold;
		font-family: monospace;
		text-align: center;
		align-self: center;
	}
	.input {
		display: grid;
		grid-template-columns: 1fr auto;
		width: 80vw;
	}
	.button {
		background-color: #ff3e00;
		color: white;
		padding: 16rpx;
		border-top-right-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
	input {
		border: 1rpx solid #ccc;
		background-color: white;
		padding-left: 16rpx;
		padding-right: 16rpx;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}
	.each {
		align-self: start;
		display: grid;
		align-items: start;
		justify-items: start;
		width: 80vw;
		gap: 16px;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
```

{% endraw %}

This is the end result:

<div style="display: grid; place-items: center;">

![A video of a basic Todo app built with Lynx and Svelte](/assets/images/posts/2025-05-22-native-apps-with-svelte/todo-lynx.webp)

</div>

You can find the whole project [at this repo](https://github.com/mainmatter/svelte-lynx-integration) and even run the app by installing [Lynx Explorer](https://lynxjs.org/guide/start/quick-start.html#prepare-lynx-explorer) and scanning the following qr code

![A qr code to scan with the Lynx Explorer app](/assets/images/posts/2025-05-22-native-apps-with-svelte/qr.png)

## So...can I ship Lynx to prod? 🚀

You can ship anything to production if you're bold enough!

Jokes aside, absolutely not: this is a POC using an unreleased (and untested, and unreviewed) version of Svelte. There's still quite a bit of work to do before we can call this a wrap.

As I hinted before, I got some feedback from Grischa Erbe, specifically about how to mix and match the custom renderer with the original DOM renderer. This doesn't necessarily apply to Lynx, but for the custom renderer API to be considered complete, we need to make some decisions.

The custom renderer I wrote for Lynx is definitely missing some features, most importantly the ability to run events in the background thread (but to be honest, there's probably much more).

The Svelte codebase will need a decently sized refactor for the custom runtime to be maintainable, and a bunch of tests need to be written to ensure that it works properly.

What can you do? Well, since you're asking...

## The Future

Mainmatter is currently sponsoring my work on Svelte to bring you the custom renderer API. However, as you can see, there's still a lot to do, and even more to make this production-ready. So if you or your company are interested in building truly native apps with Svelte and want to support us getting this ready to use, please [reach out](/contact/)!

## Conclusion

Well... this was a long one. I hope I didn't bore you (I guess if you're still here, maybe I managed to keep you interested enough), and I hope you leave this blog post with the same excitement I have for what this feature will unlock for the future.

Thanks for reading!

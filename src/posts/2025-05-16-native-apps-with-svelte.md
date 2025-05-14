---
title: "Truly Native Apps with svelte?"
authorHandle: paoloricciuti
tags: [svelte]
bio: "Paolo Ricciuti, Senior Software Engineer"
description: "How we set up to build an integration with Lynx to make truly native apps in svelte"
og:
  image: /assets/images/posts/2025-05-16-native-apps-with-svelte/og-image.jpg
tagline: <p>Is it possible to build a truly native app in svelte? Soon™ it might be!</p>

image: "/assets/images/posts/2025-05-16-native-apps-with-svelte/header.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

After the introduction of svelte version 3 the 22nd of April of 2019 it kinda took the web development world by storm; since it's original release it was constantly the most loved and interesting framework in the [State of JS](https://share.stateofjs.com/share/prerendered?localeId=en-US&surveyId=state_of_js&editionId=js2024&blockId=front_end_frameworks_ratios&params=&sectionId=libraries&subSectionId=front_end_frameworks)

![state of js survey results showing svelte constantly on top for interest](/assets/images/posts/2025-05-16-native-apps-with-svelte/state-of-js.png)

so, it's no surprise that developers want to use it for work.

However sometimes the requirements forces your project out of your favorite framework...for svelte one of the pain points is that there is no way to write a truly native application.

To be completely fair sometimes this is a non issue, there's plenty of projects that allow you to write a "native" application with web technologies:

- **[Capacitor](https://capacitorjs.com/)**: sprouted from a similar project (Ionic), builds your svelte app as a static website and serve it directly from your phone while mounting a web view to display it. It has a rich ecosystem and provides bindings to access the native layer.
- **[Tauri](https://v2.tauri.app/start/)**: it also mounts your web application in a web view providing bindings to access the native layer in rust. It can also build for Desktop (similar to [Electron](https://www.electronjs.org/)) and it promises fast and lightweight Apps.
- **[Native Script](https://nativescript.org/)**: Between the three NativeScript is effectively the only one that actually builds on top of a truly native application. However the community is not super great and it doesn't work with the latest version of svelte.

## A new player: Lynx

Earlier this year a new player entered the space: [Lynx](https://lynxjs.org/)!

![homepage of the lynx framework asserting the goal is to unlock native for more people](/assets/images/posts/2025-05-16-native-apps-with-svelte/lynx-homepage.png)

Lynx is backed by ByteDance, the company behind the popular App _TikTok_ and they are using it for some subsidiary app. In their [introductory blog post](https://lynxjs.org/blog/lynx-unlock-native-for-more.html) they claim better performance thanks to a brand new dual thread model that separates the rendering of your application from the logic of your application and most importantly for svelte an agnostic core.

### The catch

This seems like a dream come true...can we finally ship svelte apps in production? Unfortunately not so fast!

Firstly the Lynx ecosystem is still very much in the early stages but most importantly to really make use of the agnostic core of Lynx a framework has to have a key feature that svelte is currently lacking: a custom renderer api!

## What is a custom renderer?

The first think you think about when you talk about a JS framework like svelte is something that allows you to create HTML with a declarative method: instead of imperatively adding an event listener and setting the text content of an element you declare how your UI should look like and the framework execute the Javascript needed to make that happen. But it doesn't need to be that way. The reason why [React Native](https://reactnative.dev/) can exist is because React didn't concern itself with the DOM...in-fact React is basically just a diffing library. It takes your code, perform the reconciliation on your JSX and keeps track through the virtual dom of the current state of the tree.

What actually renders react to the dom is a renderer (most of the time React-DOM). However since the two pieces are separated you can actually change the React renderer: this allows you to render a React component to the DOM, to a Native interface, [the terminal](https://github.com/vadimdemedes/ink) or even to [a video](https://www.remotion.dev/).

Wouldn't be cool if you could write all of this in svelte?

## The mission

Here at Mainmatter we work with svelte and as most of the web development world we love it. So when Lynx entered the stage and we realized what this could unlock for projects that needs a truly native app we said to ourselves: "Let's do something about it"

So we decided to start from the first building block: the custom renderer api!

### The approach

If you ever used svelte you might be aware of it's approach: svelte is a compiler that takes your `.svelte` files and turn them into highly performant Javascript. When you compile a svelte component you can specify the `generate` option: if the option is `client` it will generate a function that uses signals under the hood to wire up the reactivity to your dom, if it is `server` it will generate a function that will concatenate a string to server side rendering your application.

The first problem we faced in building the custom renderer api is that as of today a client component kinda of assume that it will be executed in the browser. To quickly and performant-ly generate the elements that it needs it uses the [template tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template) it basically does something like this

```ts
function template(content: string) {
  const template_tag = document.createElement("template");
  template_tag.innerHTML = content;
  return template_tag.content;
}
```

no matter how complex of an html string `content` is this very simple code will just create all the elements with the right nesting, the right namespace (in html you can have SVGs within the html and those needs to be created with the right namespace) and it will do so via the browser parser so in a very performant way.

But, as you might have guessed, this is a problem if we want to render svelte to something that is not in a DOM environment since it relies on a DOM api.

So my first step was to create a new option for the compiler that allow you to specify the templating mode. It required some change to the compiler that up until that moment was just concatenating strings but what I ended up doing allows for the compiler to generate something that looks like this

```ts
var root = $.template_fn([
  {
    e: "div",
    p: { class: "welcome" },
    c: [{ e: "b", c: ["Hi"] }],
  },
]);
```

under the hood this function invokes `document.createElement` or `document.createTextNode` or `element.setAttribute` to generate the same dom that a browser would generate using the template tag. At this point we didn't know how the custom renderer api would look like yet but we knew that this was a necessary step. If you are curious about the changes to svelte to achieve this here's [the PR](https://github.com/sveltejs/svelte/pull/15538) where this was implemented.

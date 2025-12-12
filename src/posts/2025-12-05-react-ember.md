---
title: "Bridging frameworks: running React in an Ember.JS app"
authorHandle: nickschot
tags: [ember, react, mainmatter]
bio: "Nick Schot"
description: "tbd"
tagline: "Due to Ember.JS being such a long-lived framework, it’s become increasingly common among companies to find a need to integrate or even migrate to a different framework. No matter the reason or direction, there’s a few core concerns that need to be addressed in all cases. Let's take a look at what it takes to make React components work in an Ember.JS app."
autoOg: true
---


### Setting up

Let’s start by setting up the Ember app for React. This post assumes a modern Vite based setup using pnpm for Ember.JS which has recently become the default when generating a new project with `ember-cli`.

{% note "info", "Classic build" %}
This setup can also be made to work with a classic Ember.JS build as long as `ember-auto-import` is present. The Vite plugins need to be replaced with their Webpack equivalents.
{% endnote %}

Let’s add the base dependencies for React as well as the [React Vite plugin](https://github.com/vitejs/vite-plugin-react) by running `pnpm add -D react react-dom @vitejs/plugin-react`. And updating the Vite configuration to add the new plugin.

```javascript
// vite.config.mjs
...
import { ember } from '@embroider/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
	...
  	ember(),
    react(),
  ],
});
```

That’s all that’s necessary for the build to work.

## Bridging the frameworks

In order to be able to render a React component from within an Ember component we need to do a bit more work. We need an element for the React component to render in, a way to pass props, reactivity and finally take care of unmounting and cleaning up when necessary.

The first thing we’ll do is create a fresh GJS template-only component with a `div` element that will serve as the root element for the bridge component. `react-dom` will use this as it's root attachment point for the React components.

```js
// react-bridge.gjs

<template>
  <div></div>
</template>
```

In order to get access to this element we’ll add an inline [modifier](https://github.com/ember-modifier/ember-modifier). We will also pass on the React component reference and props arguments.

```js
{% raw %}
import Modifier from 'ember-modifier';

class ReactModifier extends Modifier {
  root = null;

  modify(element, positional, { component, props }) {

  }
}

<template>
	<div {{ReactModifier component=@compoment props=@props}}></div>
</template>
{% endraw %}
```

`react-dom` provides us with a way to render React components in an element through [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) for which we’ll store a reference in the `root` variable. We need to make sure that `createRoot` is called only once on initialization. The next step is to make the React component renderable with `createElement`. The output of that function can then be passed to `this.root.render`. If we call these functions every time the modifier runs, the arguments/props are already reactive!

```js
class ReactModifier extends Modifier {
  root = null;

  modify(element, positional, { component, props }) {
    if (!this.root) {
      this.root = createRoot(element);
    }

    const wrappedComponent = createElement(component, props);
    this.root.render(wrappedComponent);
  }
}
```

What remains is cleanup. The way to this within Ember is to register a destructor with a function that’s called when the modifier instance is destroyed.

```js
function cleanup(instance) {
  instance.root?.unmount();
}

class ReactModifier extends Modifier {
  root = null;

  modify(element, positional, { component, props }) {
    if (!this.root) {
      this.root = createRoot(element);
      registerDestructor(this, cleanup);
    }

    const wrappedComponent = createElement(component, props);
    this.root.render(wrappedComponent);
  }
}
```

## Reactivity

The implementation we have right now will give us reactivity at the boundary. This means that as long as a change to an argument is consumed by the modifier, it will trigger a re-render of the React component.

In the below example, clicking the button will update the value of `foo` and automatically trigger a re-render of the React component as expected.

```js
{% raw %}
// my-component.gjs
import ReactBridge from './react-bridge.gjs';
import MyReactComponent from './my-react-component.jsx';

class MyComponent extends Component {
  @tracked foo = 'bar';

  @action
  updateFoo() {
    this.foo = 'baz';
  }

  <template>
    <button {{on "click" this.updateFoo}}>Update Foo</button>

    <ReactBridge
      @component={{MyReactComponent}}
      @props={{hash value=this.foo}}
    />
  </template>
{% endraw %}
}
```

This should generally be enough for the use case where you want to embed a size-able component tree or widget. However, when migrating a full app this way, it may become necessary to have a way to share global (or local) state. Think of an Ember.JS service or a context API. Even if made accessible from within React, these will not necessarily be reactive. This keeps the implementation simple while also providing a clear reactive boundary. Integrating fully transparent reactivity dramatically increases complexity and may not be necessary for contained integrations or temporary situations caused by a framework migration.

## Other concerns

Getting a component to render is not all you need to think about. There's various application and maintenance concerns that need to be taken into account as well.

### Routing

One of the trickier things to deal with is routing. The easiest way for now is to keep the Ember.JS app fully in charge of routing. When you start trying to mix routers you’ll find problems around, for example, query parameter management due to Ember’s tight coupling of the router to the URL. In a future version of the Ember.JS router it may become easier to offload certain responsibilities to another router or even use a generic router not bound to a specific framework.

### Testing

When React becomes involved you can't rely on certain paradigms from Ember you're used to out of the box with Ember's testing infrastructure. Some examples: Ember's test-waiter system is not integrated (by default). Combined with React's asynchronous rendering this may mean your tests need to be adjusted to account for this. Similarly, dispatching (simulated) DOM events will also not work out of the box.

## Final thoughts

While it's certainly not impossible to mix frameworks, it's not necessarily trivial. After the initial implementation it's important to keep in mind the other concerns to limit impact on the development experience and velocity as well as the maintainability of the codebase.

Interested to learn more about this topic? Make sure to check out the recording of [Multi-framework mashup - making other frameworks work in Ember](https://www.youtube.com/watch?v=oPOZKeebnDM) from EmberFest 2025!

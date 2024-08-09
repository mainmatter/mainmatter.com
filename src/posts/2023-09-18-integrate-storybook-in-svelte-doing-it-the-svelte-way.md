---
title: "Integrate Storybook in Svelte: Doing it the Svelte-way"
authorHandle: oscard0m_
tags: [svelte, storybook]
bio: "Óscar Domínguez Celada"
description: "Óscar Domínguez Celada explores the transformation of integrating Storybook with Svelte projects, focusing on the addon-svelte-csf for a more native Svelte experience."
og:
  image: /assets/images/posts/2023-09-18-integrate-storybook-in-svelte-doing-it-the-svelte-way/og-image.jpg
tagline: 'Using <a href="https://storybook.js.org/">Storybook</a> in your <a href="https://svelte.dev/">Svelte</a> project? Annoyed by the fact of not being able to write your stories using Svelte syntax out of the box? I have good news for you: it''s possible and it''s easy!'
image: "/assets/images/posts/2023-09-18-integrate-storybook-in-svelte-doing-it-the-svelte-way/header-illustration.jpg"
imageAlt: "The Svelte logo on a gray background picture"
---

In the web development space, [Storybook](https://storybookjs.org) is one of the main choices for developing UI components and pages in isolation, especially within a Design System framework. Out of the box, Storybook expects you to write stories in a JS file. The API is a composition of JS Objects and properties. While this is very versatile and does not fit the syntax used in [Svelte](https://www.filmaffinity.com/es/film562915.html) so the experience of integrating Svelte Components with Storybook feels a bit unnatural.

Fortunately, there's an addon in Storybook's ecosystem to solve this: [addon-svelte-csf](https://github.com/storybookjs/addon-svelte-csf). This addon pivots us from the conventional to a more Svelte-centric way of integrating with Storybook. In this guide, I'll walk you through how this transition can happen in your Svelte/SvelteKit projects.

---

## Prerequisites

- Familiarity with [Svelte](https://svelte.dev).
- An existing Svelte/SvelteKit project.
- Installed versions of [Node](https://nodejs.org) and [npm](https://www.npmjs.com/)/[pnpm](https://pnpm.io/)/[yarn](https://yarnpkg.com/).

---

## Step-by-step Guide

### Integrating Storybook

Initialize Storybook within your Svelte environment using:

```bash
npx storybook@latest init
# or
pnpm dlx storybook@latest init
# or
yarn dlx storybook@latest init
```

This command will set up the initial configuration and dependencies. It should automatically detect Svelte and install the necessary addons. If you find any issues, check [the Storybook docs for troubleshooting](https://storybook.js.org/docs/svelte/get-started/install).

### Integrating the `addon-svelte-csf`

Install the addon with:

```bash
npm install --save-dev @storybook/addon-svelte-csf
# or
pnpm install --save-dev @storybook/addon-svelte-csf
# or
yarn add --dev @storybook/addon-svelte-csf
```

Integrate the addon into your project by updating the `.storybook/main.js` configuration:

```diff-js
module.exports = {
  stories: ["../src/**/*.stories.svelte"],
+ addons: ["@storybook/addon-svelte-csf"],
};
```

### Developing the First Story

Let’s use a foundational `Button.svelte` component in `src/components/` as an example:

```html
<script>
  export let label = "";
  export let type = "submit";
</script>

<button type="{type}">{label}</button>
```

Before using `addon-svelte-csf`, the corresponding Story would have looked something like this:

```js
// Button.stories.js
import Button from "./Button.svelte";
export default { component: Button };

export const Primary = {
  render: args => ({
    Component: Button,
    props: args,
  }),
  args: {
    type: "button",
    label: "Button",
  },
};

export const withEmojis = {
  render: args => ({
    Component: Button,
    props: args,
  }),
  args: {
    type: "button",
    label: "😄👍😍💯",
  },
};

export const withLongText = {
  render: args => ({
    Component: Button,
    props: args,
  }),
  args: {
    type: "button",
    label: "Test Button Label with a very long test and see how it looks",
  },
};
```

But when using `addon-svelte-csf`, the corresponding Story looks something like this:

```jsx
<script>
  import { Meta, Story, Template } from "@storybook/addon-svelte-csf";
  import Button from "./Button.svelte";
</script>

<Meta title="Button" component={Button}/>

<Template let:args>
  <Button type="button" {...args} />
</Template>

<Story name="Primary" args={% raw %}{{{% endraw %} label: "Button", {% raw %}}}{% endraw %}/>

<Story name="withEmojis" args={% raw %}{{{% endraw %} label: "😄👍😍💯", {% raw %}}}{% endraw %}/>

<Story
  name="withLongText"
  args={% raw %}{{{% endraw %}
    label: "Test Button Label with a very long test and see how it looks"
  {% raw %}}}{% endraw %}
/>
```

Isn't it nice to write our component stories directly in Svelte? With `addon-svelte-csf`, we can leverage the full power of Svelte syntax and avoid the need to define stories as JavaScript objects.

### Launching Storybook

To view your newly created story, execute:

```bash
npm run storybook
# or
pnpm run storybook
# or
yarn storybook
```

- Navigate to the provided URL to inspect the Button component in action.

Congratulations! You built your first Story using Svelte syntax! As you continue building more components, you might want to explore:

- Multiple stories for diverse components.
- Leveraging `args` for dynamic prop management.
- Organizing components methodically.
- The usage of Storybook's `context` and `decorators`

I also invite you to take a look into [addon-svelte-csf's source code](https://github.com/storybookjs/addon-svelte-csf) and the story examples in its repository as inspiration.

Lastly, a massive thank you to Jon McClure ([@hobbes7878](https://github.com/hobbes7878)), Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold)), Jérémie ([@j3rem1e](https://github.com/j3rem1e)), Ian VanSchooten ([IanVS](https://github.com/IanVS)), Michael Shilman ([shilman](https://github.com/shilman)), and the entire Storybook team. Their tireless work ensures we benefit from a seamless developer experience. Here's to the collaborative spirit of the open-source community!

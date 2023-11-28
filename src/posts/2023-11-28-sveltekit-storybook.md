---
title: "SvelteKit 🤝 Storybook"
authorHandle: paoloricciuti
tags: [svelte, storybook]
bio: "Paolo Ricciuti, Senior Software Engineer"
description:
  "Paolo Ricciuti (paoloricciuti) shows the newest addition to Storybook that
  allows for a tighter integration between Storybook and SvelteKit"
og:
  image: /assets/images/posts/2023-11-28-sveltekit-storybook/og-image.jpg
tagline: |
  <p>Are you using SvelteKit? Are you using Storybook with it? Well, i have good news for you because the SvelteKit integration just got a whole lot better!</p>

image: "/assets/images/posts/2023-11-28-sveltekit-storybook/header.jpg"
imageAlt: "The Svelte logo on a gray backround picture"
---

# Storybook 🤝 SvelteKit

Here at Mainmatter we're fans of SvelteKit and use it to build ambitious
projects with the teams we work with. Storybook was the obvious choice to make
the onboarding for new devs seamless and allow all project stakeholders to
follow the development of the internal design system. There was just a small
problem...

## The Problem

Storybook has a wonderful Story (pun intended) with Svelte, but the integration
with SvelteKit was a bit more challenging. SvelteKit is a full-stack framework
and provides a lot of virtual exports that give your application the needed
information about its current state. An example of this is the `page` store. It
gives you information about the route you are on, the data you returned from the
server, etc.

But when your component is showcased in Storybook it doesn't actually run in
SvelteKit, which means that the `page` store is empty.

Granted that using SvelteKit-specific stores inside components is generally
considered a bad practice (you could just pass the store value as a prop),
sometimes it is just tedious having to pass a prop every time. For example, if
you are dealing with i18n, you can return the detected locale from the root
layout so that every page has access to it. Can you imagine having to pass the
locale prop to every component when you could just use `$page.data.locale`?

## The Solution

Luckily for us, SvelteKit is just a Vite plugin and Storybook allows you to add
any Vite plugins to the default ones. Writing a Vite is not that complex, and to
make this work we just need to override the `alias` config of Vite to point
every import from `$app/stores` to a file that exports the same functions and
stores. This way, if you are running your component in a SvelteKit application,
Svelte will provide those stores, if you run your component in Storybook, the
file you specify in the `alias` will provide them.

## Unveiling `parameters.sveltekit_experimental`

As we've seen, it's possible to mimic the SvelteKit behavior in user-land. But
if you have to write all of this code every time you want to use Storybook in
your SvelteKit application, wouldn't it be better to have this provided by
Storybook itself? That was exactly my thought. At Mainmatter we love to give
back to the open source that we use every day and we even have a whole day every
week to work on open source projects. So I got in touch with
[JReinhold](https://github.com/JReinhold) and after a quick chat, we decided
that this was a good addition for the `@storybook/sveltekit` and I got to work.

As of Storybook v7.6, if you are using the SvelteKit integration, you can now
specify a new set of parameters for each Story that will allow you to control
the values of those exports. Let's explore how to use this new feature and what
benefits it brings to the table.

P.s. here's the
[link to the PR](https://github.com/storybookjs/storybook/pull/24795) if you are
curious on how all of this was implemented.

### How to Use It

As you may know, in Storybook you can export the default value from
`Button.stories.ts` like this:

```ts
const meta = {
  title: "Example/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<Button>;
```

and then export a Story object like this:

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};
```

Each one of these objects has a `parameters` property that is usually used by
various addons and plugin to customize their behavior. On this object, you can
add a `sveltekit_experimental` property to use this new feature (yes, it's
experimental in v7.6 it will probably be out of experimental by v8 which should
also introduce support for Svelte 5). Let's see how it looks:

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      stores: {
        page: {}, // this mocks the page store
        navigating: {}, // this mocks the navigating store
        update: true, // this mocks the update store
      },
      navigation: {
        goto: () => {}, // this is a callback for the goto method
        invalidate: () => {}, // this is a callback for the invalidate method
        invalidateAll: () => {}, // this is a callback for the invalidateAll method
        afterNavigate: {}, // this will be the object passed to `afterNavigate` on mount
      },
      forms: {
        enhance: () => {}, // this is a callback for enhance
      },
      hrefs: {
        "/test": {
          callback: () => {}, // this is a called when a link to /test is clicked
        },
        "/test/.+": {
          callback: () => {}, // this is a called when a link that match /test/.+ is clicked
          asRegex: true,
        },
      },
    },
  },
};
```

well...this was a lot of information packed into a small snippet of code. The
gist of it is that you have three properties, one for every module exported from
`$app` plus an `href` property. So, for example, to customize the behavior of
the `page` store exported from `$app/stores`, you can set
`sveltekit_experimental.stores.page`, or to customize the behavior of the `goto`
function exported from `$app/navigation`, you can set
`sveltekit_experimental.navigation.goto`.

Let's see what you can customize.

### `stores.page`

The object you assign to this property will be the value of the `page` store.
You are free to assign only a partial (what you need in the story)

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      stores: {
        page: {
          data: {
            locale: "en",
          },
        },
      },
    },
  },
};
```

### `stores.navigating`

The object you assign to this property will be the value of the `navigating`
store. You are free to assign only a partial (what you need in the story).

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      stores: {
        navigating: {
          to: {
            route: {
              id: "/test-route/[id]",
            },
          },
        },
      },
    },
  },
};
```

### `stores.update`

The object you assign to this property will be the value of the `update` store.
The value of the store is a boolean.

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      stores: {
        update: false,
      },
    },
  },
};
```

### `navigation.goto`

The function you assign to this property will be called whenever the Story you
are rendering calls `goto`. You will receive the same parameters passed to the
`goto` function by the component. If you don't pass any function to this,
Storybook will log an action in the actions panel.

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      navigation: {
        goto: (to, options) => {
          console.log("The user tried to navigate to", to);
        },
      },
    },
  },
};
```

### `navigation.invalidate`

The function you assign to this property will be called whenever the Story you
are rendering calls `invalidate`. You will receive the same parameters passed to
the `invalidate` function by the component. If you don't pass any function to
this, Storybook will log an action in the actions panel.

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      navigation: {
        invalidate: (toInvalidate, options) => {
          console.log("The user invalidated", toInvalidate);
        },
      },
    },
  },
};
```

### `navigation.invalidateAll`

The function you assign to this property will be called whenever the Story you
are rendering calls `invalidateAll`. If you don't pass any function to this,
Storybook will log an action in the actions panel.

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      navigation: {
        invalidateAll: () => {
          console.log("The user called invalidatedAll");
        },
      },
    },
  },
};
```

### `navigation.afterNavigate`

Generally, `afterNavigate` is called by SvelteKit after each navigation. This
doesn't really make sense in Storybook since there's no router involved.
Instead, if you call `afterNavigate` in your component, the function you passed
as a parameter will be called on mount. The function you pass takes the
information about the navigation as an argument and you can specify that
argument using `navigation.afterNavigate` (you may also pass a partial).

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      navigation: {
        afterNavigate: {
          from: {
            route: {
              id: "/",
            },
          },
        },
      },
    },
  },
};
```

### `forms.enhance`

If you are using the `enhance` action on a form when inside Storybook, the form
submission will still be prevented and the function you assign to
`forms.enhance` will be called.

```ts
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    sveltekit_experimental: {
      forms: {
        enhance: () => {
          console.log("The user submitted a form");
        },
      },
    },
  },
};
```

### `hrefs`

By default, every link will log an action to the Actions panel, but if you want
you can pass another property to the `sveltekit_experimental` parameter. `hrefs`
is an object where every key is a string that should represent a link inside
your Story, and the value is typed as such:
`{ callback: () => void, asRegex?: boolean }`. As you might have guessed, the
`callback` function will be called whenever the user clicks on an `A` tag that
has a `href` equal to the key. If you specified `asRegex` as true, the function
will be called whenever your regular expression matches the `href` attribute of
the tag.

## Conclusions

And that was it: this was a brief introduction to the new features, and I'm sure
you will find crazy ways to use those functionalities. I'm so happy to have been
able to contribute to such a pivotal project, and more so to be able to use
those features myself! Also, I want to thank Jeppe for helping me become
familiar with this huge codebase.

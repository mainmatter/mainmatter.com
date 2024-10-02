---
title: ":where() & data-selectors - the ultimate way to style base components"
authorHandle: beerinho
tags: [ember, css]
bio: "Daniel Beer"
description:
  "Daniel Beer provides a step-by-step guide for setting up your Ember app to
  allow the simplest way to style base components so that they can be easily
  extended throughout your app."
og:
  image:
tagline: |
  <p>Styling your app can get difficult as the number of components grows and you begin to reuse components in different scenarios. This blog post goes through the ultimate way to style your base components to allow easy extensibility throughout your Ember app.</p>
image:
imageAlt:
---

Foreword: Should out to
[Florian Pichler](https://mainmatter.com/blog/author/pichfl) for introducing me
to this pattern earlier this year.

## What is the issue?

When creating a component library or any kind of UI kit for your Ember app,
you’ll most likely want to have basic components that can then be extended and
styled based on their usage.

The majority of modern JS frameworks come with some flavour of CSS modules,
meaning you can style your component once and reuse that component everywhere
you need it without having the styles leaking across your app. Unfortunately
Ember doesn’t come with this functionality built in, but we do have
[ember-css-modules](https://github.com/salsify/ember-css-modules) that handles
this for us.

The point in which this starts to become tricky is when we start to deeply nest
our components, styling it slightly differently at each level.

For example, we can have a base `Button` component that removes the default
browser styles and sets some very simple styling and functionality that can be
shared across every button in our app. An example of this could be disabling the
button when a “loading” state is truthy. We could then have a `PrimaryButton`
which would extend our base `Button` and give it some styles to reflect the
aesthetic of our app. Finally, we could have a `Card` component that uses this
`PrimaryButton`, but we actually want it to have slightly less padding and
change the `border-radius`.

So in this scenario, it wouldn’t be unlikely to have the padding for a single
element set at three different levels, meaning that we would need to be very
careful about the selectors we are using to make sure we are setting the styles
without doing anything that might be impossible to override if we wanted to
extend our `Card` component later on: I’m looking at you `!important`.

## What is the solution?

**Where** is the solution! Well, to be more specific - **_":where()”_** is the
solution. `:where()` is a CSS pseudo-class function that was widely adopted by
all major browsers in 2021 and allows us to pass in a list of selectors to
attach our styles to, but with one major benefit: the specificity of `:where()`
is always 0,0,0. This means that no matter how many selectors we use with our
`:where()`, the styles will still be super simple to override. This is perfect
for our scenario, where we want to have a simple base component that is easily
overridden elsewhere in our app.

Lets look at how this would work:

### Button component

![Unstyled button components](/assets/images/posts/2023-11-24-the-ultimate-way-to-style-base-components/unstyled-buttons.png)

```html
{% raw %}
// button.hbs
<button
	...attributes
	data-button
	data-loading={{@loading}}
	local-class="button"
	type="button"
	{{on "click" this.onClick}}
>
  {{yield}}
</button>
{% endraw %}
```

Going through this component quickly:

- `...attributes` allows us to add element properties from the consuming
  component,
- `data-button` allows us to drill the CSS regardless of how far away from this
  component we are (more on that later),
- `data-loading` allows us to style the component based on that boolean rather
  than having to add dynamic styles (i.e. {% raw %}
  `local-class=”{{if @loading 'loading'}}”` {% endraw %}), this is a personal
  preference but I much prefer styling state in this way,
- `local-class` comes from
  [ember-css-modules](https://github.com/salsify/ember-css-modules) and allows
  us to scope a class to a component,
- the other two should be fairly self explanatory for anyone with knowledge of
  HTML and [ember-modifier](https://github.com/ember-modifier/ember-modifier)-

```css
// button.css
.button[type="button"] {
  /* styles that we don't want to easily override */
  user-select: none;
  cursor: pointer;
}

.button[data-loading] {
  pointer-events: none;
  background-color: gray;
}

:where(.button) {
  /* remove all browser styling */
  all: unset;

  /* set our own styles that can be easily overriden */
  padding: 5px;
  border-radius: 2px;
}
```

Going through this stylesheet we can see the different styling strategies at
play.

`.button[type="button"]` gives as a specificity of (0,2,0) making it is slightly
more difficult to override elsewhere. This is intentional as we shouldn’t really
be overriding these as they are base styles for the button.

![Button CSS with specificity of (0,2,0)](/assets/images/posts/2023-11-24-the-ultimate-way-to-style-base-components/button-css-specificity-0,2,0.png)

> For anyone that didn’t know, if you open up the Inspector in Safari or Chrome
> and hover over the CSS selector, it will tell you the specificity.
> Unfortunately I couldn’t see how to do this on Firefox.

`.button[data-loading]` has the same specificity as above for the same reasons.
It also showcases how simple it is to pass a state from the `hbs` to the
stylesheet so that you can style the component based on that. In this scenario
we are removing the `pointer-events` and updating the `background-color` .

And then we come to the main event: `:where(.button)` is being used to reset the
browser styles with `all: unset` and then we add our own styles that we want to
be easily overridden. In this scenario we are adding a small `padding` and a
little `border-radius` , this means that anywhere using the `Button` component
will have these styles baked in, but they are very easy to override and that is
because… (drumroll please)

![Button CSS with specificity of (0,0,0)](/assets/images/posts/2023-11-24-the-ultimate-way-to-style-base-components/button-css-specificity-0,0,0.png)

The specificity is (0,0,0)! We don’t need to add any additional classes or jump
through any hoops to override these styles, but these defaults will always be
available if we weren’t to add any additional styles.

### PrimaryButton component

![PrimaryButton component](/assets/images/posts/2023-11-24-the-ultimate-way-to-style-base-components/primary-buttons.png)

```html
{% raw %} // primary-button.hbs
<button
  ...attributes
  local-class="primary-button"
  @onClick={{@onClick}}
  @loading={{@loading}}
>
  {{yield}}
</button>
{% endraw %}
```

Here we are using the base `Button` component from before and updating the
styles to give it more of a theme.

```css
/* styles we want to be harder to override */
.primary-button {
  background-color: lightblue;
}

/* styles we want to be easy to override */
:where(.primary-button) {
  padding: 10px 25px;
}
```

Similarly to before, we’ve split the component styles into two sections:

1. the styles we want to be harder to override,
2. the styles we want to be easy to override.

(Of course, these styles are just an example and not how any app should look).

As you can see we want our `PrimaryButton` to be stronger about wanting to be
`lightblue` and therefore we are adding a specificity of (0,1,0) by adding the
class name here.

On the other hand, we are insinuating that we expect the `padding` to change
more often by the usage of `:where()` .

### Card component

![Card component](/assets/images/posts/2023-11-24-the-ultimate-way-to-style-base-components/card-component.png)

```html
{% raw %}
<section ...attributes local-class="card">
  <div>{{yield to="title"}}</div>
  <div>{{yield to="content"}}</div>
  <div local-class="actions">
    <PrimaryButton local-class="button"> Primary button </PrimaryButton>
    <button>Unstyled button</button>
  </div>
</section>
{% endraw %}
```

Here we have our `Card` component, it has a title, a content section and two
buttons - a `PrimaryButton` and an unstyled `Button`.

```css
.card {
  border-radius: 10px;
  padding: 10px;
  max-width: 400px;
  box-shadow: 1px 1px 5px 0 rgb(0 0 0 / 30%);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card [data-button] {
  border: 1px grey solid;
  border-radius: 5px;
}

.button {
  padding: 5px 10px;
  background-color: purple;
}
```

`.card` simply adds styles to the component as you would expect,

`.card [data-button]` allows us to access and style all of the `Button`
components directly - that is both the `PrimaryButton` and `Button` because they
are both using the same underlying element. This means that we can easily
override the styles of the base component without needing to drill down through
the whole component tree.

`.button` is showcasing the difference between the specificity of the styles
within the `PrimaryButton` component, as the `padding` is getting overridden but
the `background-color` remains unchanged.

As an app begins to grow, and multiple components start to be reused in
different scenarios, minor changes can start to have a big impact across the app
and refactoring can become an arduous task. That’s why it is so important to
have these stable building blocks in place that give us a strong foundation to
confidently build ambitious applications.

If you’re interested in getting help to build a strong and stable foundation for
your application, please get in touch!

If you want to take a closer look or test it out for yourself, feel free check
out the repo [here](https://github.com/mainmatter/ember-where-example)

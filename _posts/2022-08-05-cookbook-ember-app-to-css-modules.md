---
title: 'Cookbook: migrate an existing Ember app to CSS modules'
author: 'Marine Dunstetter'
github: BlueCutOfficial
twitter: academierenards
topic: open-source
bio: 'Senior software engineer'
description:
  'Tutorial to start with ember-css-modules in an existing Ember app. It aims at
  discovering ember-css-module from a practical perspective to get a different
  view on the doc.'
og:
  image: /assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/og-image.png
---

This short tutorial is intended to help Ember developers to migrate an Ember app
using only one global CSS to CSS modules with
[`ember-css-modules`](https://github.com/salsify/ember-css-modules).

<!--break-->

## Introduction & prerequisites

[`ember-css-modules`](https://github.com/salsify/ember-css-modules) is a nice
addon that let developers easily integrate CSS modules to the implementation of
their Ember apps and addon. Installig `ember-css-modules` in an existing Ember
app triggers some breaking changes in the way the integrator should handle the
app style. And if the integrator is not familiar with CSS modules in the first
place, they might spend a hard time figuring out how to set up and start the
migration at their own pace. The present tutorial is intended to be used as a
quick start cookbook to achieve this.

In the next section, we suppose the following:

- You are already comfortable with Ember.
- It is the first time you set up
  [`ember-css-modules`](https://github.com/salsify/ember-css-modules) in an
  existing app that already contains a global CSS.
- You know a bit the theory about what CSS modules are but it might be the first
  time you actually try to work with them.

The usage of [less](https://lesscss.org/) and
[sass](https://sass-lang.com/guide) will not be mentioned, though they are
[compatible with `ember-css-modules`](https://github.com/salsify/ember-css-modules/blob/master/docs/PREPROCESSORS.md).

## Migration tutorial

We'll take
[SuperRentals app](https://guides.emberjs.com/release/tutorial/part-1/) as an
example. SuperRentals is the great tutorial part of the Ember guides to
introduce main Ember features. As the purpose of SuperRentals app is to learn
Ember and writing CSS is unrelevant to the matter, the CSS to style the app is
provided as a single `app.css` free to download (linked somewhere in the first
pages of the Part 1), so newcomers don't have to write it themselves as they
walk through the tutorial.

So let's make SuperRental app ready for a migration to CSS modules.

### Install `ember-css-modules` (and break your app)

Let's suppose we have finished implementing SuperRentals app. The following
screenshot shows the page as it should be in your browser, with the nice styling
provided in SuperRentals tutorial:

![SuperRental with global CSS](/assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/screen-1.png)

In order to use CSS modules, let's install
[`ember-css-modules`](https://github.com/salsify/ember-css-modules):

```
ember install ember-css-modules
```

The addon does not contain any blueprints, the installation command simply adds
the dependency to `package.json` and modifies the lock file.

Let's run the local server again and see how our app is doing:

![SuperRental style is broken](/assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/screen-2.png)

Ouch, all the style is broken. What we see now in the browser is very similar to
a page with no CSS at all. To understand what is going on let's use the
inspector tab of the browser's debugger.

### Understanding CSS classes isolation

If we compare the previously styled app and the version we have now, we notice
that Tomster (the Ember hamster mascot) is missing at the top right of the
screen. Let's find in the DOM the element that should display Tomster image. The
image shows using the following approach:

```html
<!-- app/components/jumbos.hbs -->

<div class="right tomster"></div>
```

```css
/* app/styles/app.css */

.right {
  float: right;
}

.tomster {
  background: url(../assets/images/teaching-tomster.png);
  background-size: contain;
  background-repeat: no-repeat;
  height: 200px;
  width: 200px;

  position: relative;
  top: -25px;
}
```

Now, let's have a look to the CSS applied on the `<div>` element:

![Tomster div highlighted in the DOM](/assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/screen-3.png)

Only two CSS rules apply on the Tomster `<div>`. The first one is a global rule
to reset margins. The second one defines the font family and line height set on
elements as `body`, `h` titles, `p`, `div`, etc... The CSS classes responsible
for showing Tomster are `.right` and `.tomster`, but these classes are no longer
there, that's why the tomster image is no longer visible on screen.

In the section of the inspector dedicated to CSS description, when a style
applies on the selected element, we can see the name of the CSS file this style
comes from. On the screenshot above, it comes from `super-rental-typescript`
(this is because the final "s" on rentals was forgotten ^^' and this demo app
was implemented as a migration test to Typescript). The file name is clickable
and let you see the content of the whole CSS file.

At the top of the file, we read:

```css
* {
  margin: 0;
  padding: 0;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
div,
span,
a,
button {
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', 'Segoe UI', Helvetica,
    Arial, sans-serif;
  line-height: 1.5;
}
```

At the bottom of the file, we read:

```css
._right_1s31t7 {
  float: right;
}

._tomster_1s31t7 {
  background: url(../assets/images/teaching-tomster.png);
  background-size: contain;
  background-repeat: no-repeat;
  height: 200px;
  width: 200px;

  position: relative;
  top: -25px;
}
```

And here is the explanation about our missing Tomster. With `ember-css-modules`
installed, all the class selectors present in `app.css` end with a custom id.
But this custom id is not present in our component's template, we still have
`class="right tomster"`. As result, no CSS style is found for `.right` and
`.tomster` and no style applies. At the contrary, the rules defined for main
elements like `div` don't have any custom id added and keep applying.

`ember-css-modules` relies on class selectors to isolate the CSS and prevent it
to apply globally. The isolation system applies on every CSS files, including
those located in the main `styles` folder rather than alongside a component.

### Fix the set up with `:global`

Before starting to activly use CSS modules accross the app, we would prefer to
fix the style first, and alllow `app.css` to apply globally like it did before.
To do so, we can use the `:global` directive:

```css
/* app/styles/app.css */

:global(.right) {
  float: right;
}

:global(.tomster) {
  background: url(../assets/images/teaching-tomster.png);
  background-size: contain;
  background-repeat: no-repeat;
  height: 200px;
  width: 200px;

  position: relative;
  top: -25px;
}
```

And let's see what happens in the browser:

![Tomster shows again](/assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/screen-4.png)

Tomster is back! If we take a new look at the generated CSS file in the
browser's inspector, we can see this time the classes `.right` and `.tomster`
don't have a custom id. The `:global` directive indicates these classes are
global classes that should apply on the whole page. So we are back to a classic
CSS, with rules defined in `app.css` and applied on the page elements with
`class` attributes. By using `:global` directive on the whole existing CSS, we
can style the whole app exactly as it was before installing `ember-css-modules`,
and from there we can serenely start to use some CSS modules.

### Start using CSS modules

In SuperRentals app, the Tomster `<div>` element is written in the `<Jumbo>`
component's template (this component is instanciated at the top of each page).
So let's create the CSS file alongside the template. In the present example, the
file is `app/components/jumbo.css` as the app has a classic structure with
co-location.

It would probably make sense the `.right` class remains a global class that can
be assigned to different elements of the page. But let's make the `.tomster`
class local:

```css
/* app/styles/app.css */

:global(.right) {
  float: right;
}
```

```css
/* app/components/jumbo.css */

.tomster {
  background: url(../assets/images/teaching-tomster.png);
  background-size: contain;
  background-repeat: no-repeat;
  height: 200px;
  width: 200px;

  position: relative;
  top: -25px;
}
```

```html
<!-- app/components/jumbos.hbs -->

<div class="right" local-class="tomster"></div>
```

Everything should show as before:

![Tomster still shows as expected](/assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/screen-5.png)

If we look one more time at the CSS classes in the inspector, we'll see that
class `.right` is still applied globally, but `.tomster` class now owns a custom
id used to isolate the CSS. The syntaxe
`<div class="right" local-class="tomster"></div>` we used in the template
resulted to `<div class="right _tomster_1myv6d"></div>` in the browser to match
the class selector.

### One last note

As we experienced above, `class` and `local-class` can be used together to apply
global and local styles, everything in `local-class` ending with a different
selector. If it makes sense, in order to ease the migration of your app to CSS
modules, note that the following works:

```html
<div class="right tomster" local-class="tomster"></div>
```

```css
/* app/styles/app.css */

:global(.right) {
  float: right;
}

:global(.tomster) {
  width: 60px;
  height: 60px; /* micro tomster */
}
```

```css
/* app/components/jumbo.css */

.tomster {
  background: url(../assets/images/teaching-tomster.png);
  background-size: contain;
  background-repeat: no-repeat;

  position: relative;
  top: -25px;
}
```

![Small 60px Tomster](/assets/images/posts/2022-08-05-cookbook-ember-app-to-css-modules/screen-6.png)

## Conclusion

I hope this tutorial helped you figure out the big picture about how
`ember-css-modules` isolates CSS. The way custom ids are assigned to selectors
in a given CSS file is key to understand and start working with
`ember-css-modules`. For instance, the `composes` feature is not about
"importing a CSS rule content", it is rather about adding to an element with a
`local-class` an additional `local-class` coming from another file. So by using
`composes` once, many different rules can suddenly apply on the element. With
this in mind, up to you to continue digging and deduce the best way to organize
CSS in your specific project.

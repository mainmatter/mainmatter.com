---
title: "Working Title"
author: "Jessica Jordan"
github: jessica-jordan
twitter: jjordan_dev
topic: javascript
bio: "Senior Frontend Engineer, Ember Learning core team member"
---


some here
<!--break-->

- WHAT IS IT?
- How is it different from other ways of animating?
- What can I do with it (demos)?
-- Basics: animate()
- What's upcoming?
- Sources

What Is the Web Animations API Exactly?
-------------------------------------------------------------------------------

The Web Animations API (WAAPI) is an interface of the web platform allowing for
the synchronisation, playback and timing of presentational changes on a web page.
The API is a description of how cross-browser animations should be implemented and gives
developers access to the browser's rendering and animation engine.

At WAAPI's core, two models - the Timing Model and the Animation Model -
allow for the creation of minutely timed animations.

A set of different interfaces allows the construction of objects that provide playback controls,
options for configuring the timing characteristics of a particular animation.

How Does the Web Animation API Differ From Other Animation Methods on the Web?
-------------------------------------------------------------------------------

WAAPI is distinct from other types of animations we're already using on the web.

Even though the API itself is CSS-like and allows for the definition of animation states
using keyframes in a very similar fashion as
[CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations),
animations created using WAAPI are dynamic and hence can be adapted during run time.
This allows for the creation of animations that change over time depending on, for example,
on user input or application states.

In contrast to the well-matured Synchronised Multimedia Integration Language (SMIL),
which was the first, widely supported animation engine in browsers over ten years ago,
WAAPI is not limited to the animation of scalable vector graphics (SVG) elements,
but also allows for the animation of all types of document object model (DOM) elements.

This makes the WAAPI much more flexible for creating complex and
interactive animations in a way that hasn't been possible before using CSS animations
and SMIL alone.


How to Create Animations Using WAAPI
-------------------------------------------------------------------------------

The WAAPI describes a set of different interfaces for creating and playing back animations.
The probably most straightforward way for creating an animation is by using the shorthand
method `animate`.


### Instant Animation with Element.animate()

WAAPI is a DOM-focussed approach to animation and allows the definition and the
instantaneous playback of animations using the `Element` interface's
[`animate()` method](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate).
You can apply it as follows:


```html
<main class="frame">
  <section class="waapi-demo-panel" role="img" aria-label="A group of sparkles">
    <div id="sparkle" class="waapi-demo-sparkle">✨</div>
  </section>
</main>
```


```js
document.querySelector('#tiger').animate(
  [ /* animation keyframes */ ],
  { /* animation options */ },
);
```

The `animate` method is - once called - creating a new `Animation` and applying it
to the `#tiger` element using the animation states and options passed to it as parameters.
This post will talk about the `Animation` interface itself later on. For now it's interesting
to note, that `animate()` functions as a short hand method for creating, attaching and playing
animations to any DOM element.

### Defining Animation States Using Keyframes

With the WAAPI, animation states are defined as so-called _keyframes_. For example,
the `Element.animate` method accepts keyframes as its first parameter to create the animation
that is attached to that particular element. A set of keyframes might be defined as follows:


```js
let frames = [
  { translateX: 0 },
  { translateX: '50px' },
  { translateX: '120px' },
];
```

Keyframes are provided as an array of objects and each object (keyframe) contains:

- one or several property-value pairs of CSS properties in camelCase
- an `offset` property defining the timing of the state in the context of the full animation (optional)
- an `easing` property defining the timing function between this keyframe and the following one (optional)
- a `composite` property allowing for adding the values of this keyframe onto the values of the previous one (optional)

We'll take another look at the optional keyframe attributes and their effect on an animation later on in this post.

### Defining Animation Timing Using Animation Options

An animation can be configured freely in regards to its length, easing, direction among other parameters.
The animation options object passed to, for example, the `Element.animate` method and other interfaces
of the WAAPI is used to apply this configuration:


```js
let animationOptions = {
  duration: 3000,
  easing: 'ease-in',
  iterations: 3,
};
```

Alternatively, WAAPI interfaces also accept an integer as the sole value for animating options versus an object.
The number will then define the duration (in ms) of the animation. For a full list of animation options,
please review the [API reference on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#Parameters).

### Instant Animation In Action

By declaring an animation in its sequence of states and timing, we can now use `Element.animate` accordingly
to bring the previous demo to life. Check it out:


```html
<main class="frame">
  <section class="waapi-demo-panel" role="img" aria-label="A group of sparkles">
    <div id="sparkle" class="waapi-demo-sparkle">✨</div>
  </section>
</main>
```


```js
let frames = [
  { transform: 'translateX(10vw)' },
  { transform: 'translateX(50vw)' },
  { transform: 'translateX(90vw)' },
];

let animationOptions = {
  duration: 7000,
  easing: 'ease-in',
  iterations: 'Infinity',
  fill: 'both',
  direction: 'alternate',
};

document.querySelector('#sparkle').animate(frames, animationOptions);
```

Which results in:

<div class="waapi-demo">
<iframe height="400" style="width: 100%;" scrolling="no" title="simplabs WAAPI Demo 1" src="//codepen.io/jessicajordan/embed/eqzoja/?height=265&theme-id=light&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
</iframe>
</div>

Creating and Playing Animations Independently
-----------------------------------------------------------------

By means of the `Animation` and the `KeyfameEffect` interfaces, we can also
create animations freely and dynamically attach them onto elements,
as well as time the playback of these animations precisely.


### Animation Creation with `Animation`

A new animation can be created using the `Animation` constructor and
the `KeyframeEffect` constructor in combination as follows:

```js
let frames = new KeyframeEffect(/* element */, [/* keyframes */], { /* animationOptions */ });
let animation = new Animation(frames, document.timeline);

animation.play();
animation.pause();
```

`Animation` allows the creation of animation objects which are dynamically configurable and which can be play backed
and paused freely. Let's see this in action:


```js

```
<div class="waapi-demo">
<iframe height="400" style="width: 100%;" scrolling="no" title="simplabs WAAPI Demo 2" src="//codepen.io/jessicajordan/embed/MNeMmv/?height=265&theme-id=light&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
</iframe>
</div>

If you have questions, want to know more or need help setting all of this up
for your apps please [contact us](https://simplabs.com/contact/). We're happy
to help!



[Sentry]: https://sentry.io/
[Ember.js]: https://emberjs.com/
[`ember-cli-sentry`]: https://github.com/ember-cli-sentry/ember-cli-sentry
[`raven-js`]: https://github.com/getsentry/sentry-javascript/tree/master/packages/raven-js
[`@sentry/browser`]: https://github.com/getsentry/sentry-javascript/tree/master/packages/browser
[`ember-cli-deploy`]: https://github.com/ember-cli-deploy/ember-cli-deploy
[`ember-cli-deploy-sentry`]: https://github.com/dschmidt/ember-cli-deploy-sentry
[`ember-simple-auth`]: https://github.com/simplabs/ember-simple-auth

---
title: 'An intro to animating with the Web Animations API'
authorHandle: nickschot
tags: javascript
bio: 'Senior Software Engineer'
og:
  image: /assets/images/posts/2021-01-29-web-animations-intro/og-image.png
tagline: |
  <p>Animations can be a useful tool to enhance the user experience on the web. Aside from providing an appealing visual experience, animations can aid in the user's understanding of elements appearing, moving and disappearing from a page. This blog post will provide a short overview of the status quo of animating the web and take an initial look at the current capabilities of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API">Web Animations API</a>.</p>
---

![An intro to animating with the Web Animations API](/assets/images/posts/2021-01-29-web-animations-intro/illustration.svg#full)

## The status quo of animating the web

Currently, there are two animation techniques that are commonly used on the web:
CSS transitions/animations and animating through JavaScript by modifying inline
styles.

### CSS transitions and animations

[CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
are a basic but powerful way to define a transition between two CSS states of a
DOM element. They provide limited control, but due to their simplicity it's
often the preferred way to implement basic animations like hover effects on a
button. Transitions happen automatically between values of a CSS attribute with
a given timing function, delay and duration.

```css
.my-button {
  opacity: 0.5;
  transition: opacity 0.3s linear;
}

.my-button:hover {
  opacity: 1;
}
```

[CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
offer more control over timing and easing. They can run for a given duration,
have a delay and an iteration count. The animation itself is specified with
keyframes allowing the creation of more complicated animation effects that are
not possible with CSS transitions. CSS animations are usually triggered by
adding or removing a CSS class to an element with JavaScript.

```css
@keyframes fade-in-keyframes {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.fade-in {
  animation: fade-in-keyframes 0.3s linear;
}
```

Both of these offer JavaScript events like `animationend` which allow you to
react to an animation that finished, though it can still be hard to synchronize
animations with application state due to the way animations have to be started.
They are a powerful, declarative and performant way to do animations on
individual elements.

### Animating with JavaScript

JavaScript based animation loops are the status quo for doing complex
animations. Animation libraries like
[ember-animated](https://ember-animation.github.io/ember-animated/) and
[framer-motion](https://www.framer.com/motion/) or older libraries like
[Velocity.js](http://velocityjs.org/) and
[script.aculo.us](https://github.com/madrobby/scriptaculous) are built around
this technique.

With a JavaScript based animation loop there is full control over timing and
state. This makes it possible to take other elements into account. For example,
you could take measurements of an element A and animate an element B from the
position and size of element A to element B's natural position.

A basic animation loop takes a source and target state and based on a timing
function calculate what the state for the current frame should be.

```javascript
let sourceOpacity = 0;
let targetOpacity = 1;
let duration = 500;

let startTime;
function step(time) {
  if (!startTime) {
    startTime = time;
  }

  let progress = time - startTime;

  // calculate where we are in the animation as a factor between 0 and 1
  let factor = Math.min(progress / duration, 1);

  // multiply the source/target diff with the calculated factor
  let currentOpacity = sourceOpacity + (targetOpacity - sourceOpacity) * factor;

  // apply calculated opacity
  element.style.opacity = currentOpacity;

  // move to the next frame if we haven't reached the target duration yet
  if (progress < duration) {
    window.requestAnimationFrame(step);
  }
}

// start the animation
window.requestAnimationFrame(step);
```

In the past, animation loops with JavaScript had to be done through
`setInterval` to get an approximate 60 frames per second animation. Nowadays the
`requestAnimationFrame` API exists which results in smoother animation as the
browser will call it right before the next repaint. Browsers can also pause
`requestAnimationFrame` when a tab is out of focus to prevent inactive tabs from
running expensive animations at high framerates.

In addition, this animation technique requires the need for manual interpolation
of the values we might want to animate. This can be difficult for complex values
like `color` or `clipPath`, yet also gives opportunity to do different kinds of
interpolation than what the browser does by default, which can be especially
relevant for non-trivial values like a color space.

While this animation technique is very powerful it does result in a lot of
calculations being made every frame for the duration of the animation. This
might result in stutter or delay especially if something else is happening on
the page. Examples are a router transition to another page or some data fetching
and parsing. The browser also has limited ways to optimise such animations as it
only knows about the current frame and cannot completely offload the animation
to the GPU.

## Web Animations API

The [Web Animations API] is a relatively new addition to the browser and is
still very much in development. It promises to combine the benefits of CSS
Transitions/Animations and JavaScript based animations.

All popular browsers have now implemented the minimum features necessary to do
complex animations and a
[polyfill](https://github.com/web-animations/web-animations-js) which adds
support for the Web Animations API to older browsers is available. It's time we
tried it out!

### The basics

The main interface for Web Animations is the `Element.animate` function. It can
be called on a DOM Element, takes an array of keyframes as the first argument
and options as the second argument. On first sight the API is very similar to
CSS animations.

```html
<div id="circle"></div>

<script type="text/javascript">
  let element = document.getElementById('circle');
  let animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 300,
    easing: 'linear',
  });
</script>
```

We'll need only a "from" and a "to" keyframe for now. The easing we set will
define the timing function used to interpolate between the keyframes. For now,
we will use the most basic one: "linear".

In addition to that there's some useful timing related functionality on the
animation instance we can use.

```javascript
// our animation instance
let animation = element.animate(...);

// pause the animation
animation.pause();

// timing information about the current state of the animation
let timing = animation.effect.getComputedTiming();

// progress of the animation between 0 and 1
timing.progress;

// resume the animation
animation.play();

// promise that will resolve when the animation has finished
animation.finished.then(() => { ... });
```

With these building blocks we can start creating more complex animations.

### Moving an element around

Let's create an animation which applies a CSS transform to move the element from
one position to another.

```javascript
element.animate(
  [{ transform: 'translateX(0)' }, { transform: 'translateX(100px)' }],
  {
    duration: 1000,
    easing: 'linear',
  },
);
```

This will transform the element 100 pixels to the right from its original
position in 1 second with a linear timing function. When the animation is done,
its effects on the element are automatically removed.

![Basic move animation](/assets/images/posts/2021-01-29-web-animations-intro/video1.mp4#video)

Like with CSS animations we need to specify a fill option to specify in what way
we want the animation's effects to be retained. We can specify `fill: forwards`
so our final state is retained.

```javascript
element.animate(
  [{ transform: 'translateX(0)' }, { transform: 'translateX(100px)' }],
  {
    duration: 1000,
    easing: 'linear',
    fill: 'forwards',
  },
);
```

Our animation now behaves as we would expect and retains the styles specified in
the final keyframe.

![Basic move animation that retains final state](/assets/images/posts/2021-01-29-web-animations-intro/video2.mp4#video)

Alternatively the `animation.commitStyles()` feature can be used to put the
current animation state in the DOM as inline styles. The animation itself can
then safely be cancelled so the browser can free up the resources it consumes.

### Cancelling and resuming an animation

Cancellation is an important part of real-world animations. Animations take time
to complete and in that time the user might have interacted with the page in a
way where the running animation does not make sense anymore. In most cases when
an animation is interrupted, another animation will be started. This could be
the same animation in reverse or an entirely different one. In any case we will
want to start the animation from the element's current state.

In theory, you only need to specify a "to" keyframe which would make it trivial
to cancel an animation as the browser will calculate the "from" position based
on the current state. Unfortunately not all browsers currently support that
behaviour meaning we'll have to be a little more elaborate for now.

In order to cancel the current animation (if any) we'll need to take a few
steps. Before trying to calculate our starting keyframe we'll need to pause the
currently running animation (if any). Then we'll need to get the current
transform present on our element. Finally, we can start the new animation.

Let's abstract our animation into a `move` function which takes `transformStart`
and `transformEnd` string arguments. We'll also add `animateRight` and
`animateLeft` functions which are hooked up to two buttons, so we can run the
animations by clicking those buttons.

```html
<button onclick="animateLeft()">Left</button>
<button onclick="animateRight()">Right</button>
<div id="circle"></div>

<script>
  const element = document.getElementById('circle');

  let currentAnimation;

  function move(transformStart, transformEnd) {
    currentAnimation = element.animate(
      [{ transform: transformStart }, { transform: transformEnd }],
      {
        duration: 1000,
        easing: 'linear',
        fill: 'forwards',
      },
    );
  }

  function animateRight() {
    move('translateX(0)', 'translateX(100px)');
  }

  function animateLeft() {
    move('translateX(100px)', 'translateX(0)');
  }
</script>
```

Rapidly clicking the buttons interchangeably now shows a pretty jarring
animation!

![Basic move animation](/assets/images/posts/2021-01-29-web-animations-intro/video3.mp4#video)

This is a good time to take a look at the developer tools to find out what's
going on. Note that you will not see the animated styles appear in the DOM as
you might be used to with JavaScript based animation. You can see the effect
they have in the computed styles and animation sections of the browser's
developer tools.

From the "Animations" pane we can slow down the animation to 25% of the original
speed to make it easier to see what is going on. We can also replay previous
animations. When we click the "Left" button while the animation is happening
we'll see that the animation is not starting at the correct point.

![Debugging an animation using developer tools](/assets/images/posts/2021-01-29-web-animations-intro/devtools.mp4#video)

This happens because we explicitly specify a starting keyframe which is
obviously an incorrect starting point if we interrupt the animation in the
middle.

We can fix this by first pausing the animation. Next we can utilise the global
`getComputedStyle(element)` function to retrieve the current styles for our
element. We'll take the computed `transform` style as the starting point for our
keyframe. After doing this we can cancel the current animation to free up
browser resources and start the new animation. Let's modify our functions
accordingly. We also no longer have a need to pass in a `transformStart`
argument, as we will calculate that dynamically from now on.

```javascript
function move(transformEnd) {
  currentAnimation?.pause();
  let transformStart = getComputedStyle(element).transform;
  currentAnimation?.cancel();

  ...
}

function animateRight() {
  move('translateX(100px)');
}

function animateLeft() {
  move('translateX(0)');
}
```

Pressing the left or right button while an animation is running will now
correctly cancel the running animation.

![Cancellable move animation](/assets/images/posts/2021-01-29-web-animations-intro/video4.mp4#video)

There is still a problem though! We have set a fixed duration for our animation.
This means that if we cancel the animation after for example 0.5 seconds it will
still take the full 1 second to revert the animation even though we're only
moving half the distance. Remembering the Web Animations basics mentioned
earlier, there is a way to get timing information from an animation. We can use
that information to correctly calculate the duration for our animation to
achieve a constant velocity.

Let's modify our move function again. We'll need to get the `activeDuration` and
`progress` of the running animation. We can call
`currentAnimation.effect.getComputedTiming()` which will provide us with the
values we need. We can calculate the target duration with the following formula
`duration = duration - (activeDuration - progress * activeDuration)` where
duration is our default duration of 1 second;

```javascript
function move(transformEnd) {
  currentAnimation?.pause();
  let transformStart = getComputedStyle(element).transform;

  let duration = 1000;
  if (currentAnimation) {
    const timing = currentAnimation.effect.getComputedTiming();

    // duration of the running animation
    const activeDuration = timing.activeDuration;

    // progress between 0 and 1 of the running animation
    const activeProgress = timing.progress;

    // calculate duration so that velocity is constant
    duration -= activeDuration - activeProgress * activeDuration;
  }

  currentAnimation?.cancel();

  currentAnimation = element.animate(
    [{ transform: transformStart }, { transform: transformEnd }],
    {
      duration: duration,
      easing: 'linear',
      fill: 'forwards',
    },
  );
}
```

After this change our animations will always run with a constant velocity, no
matter when the running animation is cancelled. The final result can be seen in
this [CodePen](https://codepen.io/nickschot/pen/LYbPBmW).

![Cancellable move animation with constant velocity](/assets/images/posts/2021-01-29-web-animations-intro/video5.mp4#video)

### When an animation finishes

It is likely you need to do something after an animation completes. The Web
Animations API provides a couple of options to do this. Firstly there is the
`Animation.onfinish` handler which runs the given function after the animation
completes.

```javascript
currentAnimation.onfinish = () => console.log('animation finished!');
```

Secondly there is also the `Animation.finished` promise, which resolves when the
animation finishes.

```javascript
currentAnimation.finished.then(() => console.log('animation finished!'));
```

These functions behave a bit differently when an animation is cancelled. The
`onfinish` hook is never called. Fortunately an `oncancel` hook also exists.

```javascript
// handling cancellation with hooks
currentAnimation.onfinish = () => console.log('animation finished!');
currentAnimation.oncancel = () => console.error('animation cancelled.');
```

The `finished` promise will throw an error which we will need to handle. We can
of course also utilize async/await.

```javascript
// handling cancellation with promises
currentAnimation.finished
  .then(() => console.log('animation finished!'))
  .catch((error) => console.error('animation cancelled.', error));

// handling cancellation with async await
try {
  await currentAnimation.finished;
} catch (error) {
  console.error('animation cancelled.', error);
}
```

## Conclusion

With this we now have a basic understanding of the Web Animations API and can
create moderately complex animations for a given element controller from
JavaScript. From this basic understanding we can start thinking about expanding
this to more complex use cases such as animating between elements and pages.
Furthermore, we can think about using more advanced timing functions, their
benefits and implications.

[contact]: https://simplabs.com/contact/

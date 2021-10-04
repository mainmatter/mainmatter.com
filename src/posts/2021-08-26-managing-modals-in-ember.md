---
title: 'Managing modal dialogs in Ember.js with Promises'
authorHandle: pichfl
topic: ember
bio: 'Consultant for Technology and Design at simplabs'
description:
  'Exploring better and easier handling of modal dialogs in Ember.js
  applications'
og:
  image: /assets/images/posts/2021-08-26-managing-modals-in-ember/og-image.png
---

Modal dialogs are about as widespread as they are missunderstood. No matter if
you call them modal windows, popups, popovers, overlays, or dialogs: A thing
that asks a question or presents a subordinate task; a general annoyance to
developers and accessibility experts alike.

Even if you use them rarely, most applications will need modal dialogs at some
point to ask existential questions. The app asks your user and waits to resolve
its uncertainty by their answer.

<!--break-->

Waiting, resolving. JavaScript promises provide an excellent pattern for
managing modals. A rough concept could work like this:

1. Call a method which creates a promise
2. Render a modal into the DOM, pass in a callback to resolve the promise
3. Resolve the promise to unrender the modal and pass back a result

[Tobias](https://github.com/Turbo87) made
[Ember Promise Modals](https://simplabs.github.io/ember-promise-modals/) so we
don't have to implement this on our own. With this addon, can launch any
component as a modal, wait for a result, and continue with our apps workflow.

![Video showing a basic Ember Promise Modals dialog in action](/assets/images/posts/2021-08-26-managing-modals-in-ember/epm.mp4#video)

```js
let result = await this.modals.open('name-of-your-component', {
  /* data passed to the component */
  question: 'Life, the universe and everything?',
});
```

This will trigger a modal dialog, which automatically gains focus for its first
focussable element and keyboard accessibility including support for closing the
dialog with <kbd>ESC</kbd> as required by
[WAI ARIA best practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)
thanks to the included [focus-trap](https://github.com/davidtheclark/focus-trap)
integration. It will dim the underlying content for you with a customizable
backdrop also.

The passed component recieve optional data as `@data` and a `@close` action,
which will close the modal and resolve the promise. Anything passed to the
action will become the value the promise resolves with, making it easy to
communicate data in the preferred Data-Down-Actions-Up pattern of Ember.js.

```hbs
{% raw %}
{{! example modal component using passed data and close action}}
<div>
  <header>
    <button type="button" {{on "click" @close}}>Close</button>
  </header>
  <p>{{@data.question}}</p>
</div>
{% endraw %}
```

### CSS based animations

For the first stable release, [Nick](https://github.com/nickschot) and
[myself](https://github.com/pichfl) added native CSS animations using
`CSS @keyframes`, which allow for full control over how dialogs and the dimming
backdrop appear and disappear on the screen without hogging render performance.
A nice and swift default animation is provided out of the box.

If you don't like the default, how about something a little more menacing?

```css
@keyframes spiral-in {
  0% {
    opacity: 0;
    transform: rotate(540deg) scale(0.01);
  }
  90% {
    opacity: 1;
    transform: rotate(-20deg) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
}

:root {
  --epm-animation-modal-in: var(--epm-animation-modal-in-duration) ease-out var(
      --epm-animation-modal-in-delay
    )
    forwards spiral-in;
  --epm-animation-modal-in-duration: 0.7s;
}
```

![Animation of a modal spiraling in after clicking a button below a picture of a cartoon character asking for pictures of Spider Man. The modal shows an image with Spider Man hiding behind a tree and a bold caption saying "I'm Batman"](/assets/images/posts/2021-08-26-managing-modals-in-ember/spiderman.mp4#video)

Modals can be fun. Promised.

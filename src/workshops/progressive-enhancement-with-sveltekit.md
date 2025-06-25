---
title: "Progressive Enhancement with SvelteKit"
tags: "svelte"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: This 1-day workshop gives a comprehensive introduction to building progressive enhanced applications with SvelteKit, covering the theory, as well as guiding participants through implementing real examples.
introduction: "<p>Progressive enhancement is a technique for providing a baseline experience in terms of content and functionality to everyone and enhancing that to the optimal experience for everyone that's possible for. That allows, in particular for use cases like e-commerce where every lost visitor is potentially a missed sale, to serve each and everyone of your visitors – as opposed to with a classic SPA where people with a spotty network that doesn't load the JavaScript bundle, would only see a blank page.</p><p>SvelteKit has built-in support for progressive enhancement, yet getting the most out of that requires understanding the underlying principles and applying the right techniques. This workshop gives a comprehensive introduction to building progressive enhanced applications with SvelteKit, covering the theory, as well as guiding participants through implementing real examples.</p>"
hero:
  color: purple
  image: "/assets/images/workshops/progressive-enhancement-with-sveltekit/lego-superman.jpg"
  imageAlt: "A Lego superman figure with their cape flying in a wind in front of a dramatic orange/pink sky"
og:
  image: /assets/images/workshops/progressive-enhancement-with-sveltekit/og-image.jpg
topics:
  - title: Progressive Enhancement
    text: >
      We'll start by looking into what progressive enhancement is and why it's relevant. We'll look at network speeds and typical latency numbers, as well as at JavaScript bundle sizes, and their impact on load times.


  - title: Forms in SvelteKit
    text: >
      One of SvelteKit's main mechanisms for supporting progressive enhancment are forms and form actions that can run in Node on the server side. We'll look at data flows, how forms can be enhanced to be handled on the clients side, and a bit at the underlying magic that makes that process seamless for the developer.


  - title: "Example: Autocomplete"
    text: >
      We'll build am input component that starts off as a simple text field without JavaScript and is progressively enhanced into an auto-complete input with JavaScript.


  - title: "Example: Search"
    text: >
      Next, we'll build a search UI that works with and without JavaScript.


  - title: "Testing"
    text: >
      Building progressively enhanced applications requires testing two scenarios for all flows: one with and one without JavaScript. We'll cover the topic by writing Playwright tests for the previously implemented examples.


  - title: CSS & Progressive Enhancement
    text: >
      Some elements of user interfaces can be made functional with CSS alone. We'll look at typical scenarios where that approach works and how UI state can be kept in sync with our Svelte application.


  - title: "Example: Dialog with inline JavaScript"
    text: >
      Finally, we'll build a dialog with a tiny snipped of inline JavaScript that works without the entirety of the Svelte application having started.


leads:
  - handle: paoloricciuti
---

<!--break-->

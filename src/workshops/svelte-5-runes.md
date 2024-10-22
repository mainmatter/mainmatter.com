---
title: "Svelte 5 & Runes"
tags: "svelte"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: "<p>Svelte 5 is a major step forward from version 4 and simplifies how Svelte applications are written. Concepts like snippets and runes, Svelte 5's new set of primitives for controlling reactivity, will replace a number of current concepts that will no longer by required with runes. Yet, as these concept are newly introduced, developers need to learn and them before they can leverage them. This workshop serves as an introduction to Svelte 5's new concepts, as well as a hands-on guide to migrating from old patterns to Svelte 5 and runes.</p>"
hero:
  color: purple
  image: "/assets/images/workshops/svelte-5-runes/runes.jpg"
  imageAlt: "A bunch of white stones with yellow runes written on them lying on a grey surface"
og:
  # TODO: fix og-image
  image: /assets/images/workshops/telemetry-for-rust-apis/og-image.jpg
topics:
  - title: From Svelte 4 to 5
    text: >
      We'll start with reviewing the differences between Svelte 4 and 5 before looking into the main changes in more detail.


  - title: The `$state` rune
    text: >
      The `$state` rune is at the core of Svelte 5's runes system so we start with that. We'll cover it's core behavior and implement some examples together.


  - title: The `$derived` rune
    text: >
      The `$derived` rune replaces Svelte's `$:` syntax. We'll look into how the rune works, subtle differences to `$:`, as well as how to migrate to it for typical scenarios.


  - title: The `$effect` rune
    text: >
      Next, we move to the `$effect` rune. Like for the `$state` rune, we'll implement some examples and talk about typical use cases.


  - title: The `$props` rune
    text: >
      The `$props` rune replaces a number of previous concepts around declaring, and receiving properties in components. We'll look into how the rune works as well as how to migrate to it for typical scenarios.


  - title: Introduction to JavaScript signals
    text: >
      Once we covered runes, we'll briefly look into JavaScript's upcoming [signals primitive](https://github.com/tc39/proposal-signals) which runes are based on. We'll cover the fundamentals of signals and how they might eventually establish a cross-framework reactivity primitive.


  - title: From Slots to Snippets
    text: >
      Snippets are a new concept in Svelte 5 that replace slots which are less powerful and flexible. We'll look into how snippets work, what new patterns they enable, and how to migrate from slots to snippets.


  - title: Automating the Migration
    text: >
      At least parts of the migration from Svelte 4 to 5 can be automated. We'll look into how that works, what to be aware of, and how to resolve situations where automatic migration fails.


leads:
  - name: Paolo Ricciuti
    title: Senior Frontend Engineer
    handle: paoloricciuti
    image: /assets/images/authors/paoloricciuti.jpg
    bio: >
      Paolo is a huge nerd and Svelte maintainer. He's also one of the creators of <a href="https://sveltelab.dev">sveltelab.dev</a> - a REPL for SvelteKit.
---

<!--break-->

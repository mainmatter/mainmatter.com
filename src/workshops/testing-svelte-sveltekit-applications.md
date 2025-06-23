---
title: "Testing Svelte & SvelteKit applications"
tags: "svelte"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: "This 1-day workshop is a complete introduction to testing Svelte and SvelteKit applications. It covers both guidance on what to test and how, as well as concrete techniques for writing tests that are fast, stable, and easy to maintain."
introduction: "<p>Testing is a critical part of building any non-trivial application – without automatic test coverage, you can't really know whether things work as expected or you're breaking things as you continue building out an application. This workshop covers both guidance on what to test and how, as well as concrete techniques for writing tests that are fast, stable, and easy to maintain.</p>"
hero:
  color: purple
  image: "/assets/images/workshops/testing-svelte-sveltekit-applications/classroom.jpg"
  imageAlt: "Photo of a classroom with benches facing a blackboard"
og:
  image: /assets/images/workshops/testing-svelte-sveltekit-applications/og-image.jpg
topics:
  - title: The Testing Pyramid
    text: >
      We'll start off with some basic theory, talking about the testing pyramid. The testing pyramid gives guidance on what kind of test to use for testing what aspect of a system as well as how much coverage is required at what level of the pyramid.


  - title: Unit tests with Vitest
    text: >
      Unit tests are at the lowest level of the testing pyramid so we'll start with those.


  - title: Component tests with Vitest, Testing Library and Storybook
    text: >
      Next, we progress to writing components tests with Vitest and testing library. We'll look into writing functional tests for Svelte components as well as explore techniques like snapshot testing and visual testing with Storybook.


  - title: End-to-end tests with Playwright
    text: >
      End-to-end tests sit at the top of the testing pyramid and we'll end with those. We'll look into writing tests that cover the entirety of our isomorphic SvelteKit application with Playwright.


  - title: Full-stack application testing and data
    text: >
      Tests require a well-known state that the test runs against so we can make assertions on the result. That can be challenging, in particular for end-to-end tests where the state might need to exist outside of the SvelteKit application. We'll look at typical challenges as well as techniques 


leads:
  - handle: paoloricciuti
---

<!--break-->

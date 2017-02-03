---
layout: workshop
title: Ember Intro Quickstart
permalink: "/workshops/2016-12-18-ember-intro-quickstart"
category: Front End Development
description: |-
  In this abbreviated intro course, you'll get a taste for what the Ember.js framework has to offer. We'll focus on two of the most important aspects of building a single page app: **routing and components**.

  By the end of this course, you'll have a sense for what Ember offers, and will understand how it compares & contrasts with React and Angular 2.
stages:
- title: Ember Quickstart
  description: A quick introduction to Ember.js, with a focus on **Routing** and **Components**
  duration: 465
  agenda_items:
  - title: Wrap Up
    description: We've covered a lot today, so we'll end the day with a recap of how
      far we've been able to come in just a few short hours.
    item_type: lecture
    start_time: '16:30'
    duration: 15
  - title: 'Exercise: Saving Comments'
    description: We've got a comment-creation API already stubbed out in our blog
      app example project, and now we're going to add in a feature that lets us create
      and persist comments to our API. Although at least one component needs to know
      about the status of this asynchronous operation, we can't rely on it being on
      the screen for the operation's entire duration. We'll use `ember-concurrency`
      to handle this gracefully, and to implement other common-sense features such
      as preventing double-submits, or modification of in-flight records.
    item_type: exercise
    start_time: '16:00'
    duration: 30
  - title: Managing Concurrency
    description: |-
      It's great that we're using a REST API now, but we've exposed ourselves to a new type of complexity: concurrency. Because we can't know for sure when something asynchronous will complete, we have to handle response logic gracefully.

      We'll take a look at an ember addon called `ember-concurrency` and leverage the power of **ES7 Generator Functions** to ensure that asynchronous processes are abandoned when appropriate.
    item_type: lecture
    start_time: '15:30'
    duration: 30
  - title: 'Exercise: Out with the Fixture Data'
    description: 'So far, our app has been using fixture data, and this exercise is
      all about replacing that with data retrieved from an API. Use either ajax, fetch
      or ember-data to retrieve real blog posts and comments from our workshop API. '
    item_type: exercise
    start_time: '14:30'
    duration: 30
  - title: 'Exercise: A Route Hierarchy & Top-Level Templates'
    description: |-
      We'll build a simple routing structure, including a **master-detail layout** to touch on some important conceptual and technical key ideas that pertain to Ember's routing layer. This exercise will include
      * Child views rendered in a parent's outlet
      * queryParams
      * Transitions between different routes, and within the same route (just changing data)
    item_type: exercise
    start_time: '14:00'
    duration: 30
  - title: Retrieving & Managing Data
    description: |-
      Connecting to real data from an API is something nearly all apps need to worry about, and we'll tackle this concept in three ways.
      * First, we'll use **ajax in a promise-aware router hook** to prove that eventual values (Promises) are handled just as easy as immediate values
      * Next, we'll alter our approach to make it server-side rendering friendly, and use a `fetch` polyfill that'll work equally well in Node.js and in the browser
      * Finally, we'll move away from making explicit requests in our routes, to using **ember-data**, the official emberjs persistence library
    item_type: lecture
    start_time: '15:00'
    duration: 30
  - title: Routing
    description: "So far our app isn't very interesting, because it's just a single
      view. Single-Page App routing allows us to create a multi-page, URL-driven experience,
      without true page load. We'll discuss an effective mental model for **routes
      as a hierarchy** and **the router as a finite-state machine** in order to understand
      how a given URL results in a particular set of templates being shown on the
      screen. \n\nWe'll also talk about the router's **promise-aware hooks**, which
      make it easy to instruct Ember to wait for an asynchronous process to complete
      before proceeding to render something on the screen."
    item_type: lecture
    start_time: '13:20'
    duration: 40
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:20'
    duration: 60
  - title: 'Exercise: Image with Caption Component'
    description: We'll use the **Handlebars helpers** that we made earlier, in the
      context of a slightly more complicated Ember component. This will require use
      of **computed properties** as well, in order to handle some "empty" cases (where
      the component is not given an important value) gracefully.
    item_type: exercise
    start_time: '12:00'
    duration: 20
  - title: Computed Properties
    description: |-
      Computed properties are cached, lazily-evaluated values, which are very often derived from other values. We'll take a quick peek at Ember's internal implementation for computed properties, and build a few different examples together.

      Finally, we'll explore the concept of **computed property macros** -- functions that return a computed property -- which provide an easily testable, reusable and parameterized calculation.
    item_type: lecture
    start_time: '11:35'
    duration: 25
  - title: Components & Actions
    description: Components, or an analogous concept, are at the center of every popular
      single-page application framework. By encapsulating **layout structure (HTML),
      style (CSS) and behavior (JS)** as re-usable building blocks, we free ourselves
      from having to focus on large and small-scale development simultaneously. We'll
      cover the most fundamental aspects of **Ember's component model**, including
      **data binding, lifecycle hooks and actions**.
    item_type: lecture
    start_time: '10:30'
    duration: 45
  - title: 'Exercise: A Simple Component'
    description: 'We''ll build a simple component together: a custom textarea-like
      field with a built-in [markdown](https://en.wikipedia.org/wiki/Markdown) preview
      feature, using action and data binding, '
    item_type: exercise
    start_time: '11:15'
    duration: 20
  - title: 'Exercise: Build a Handlebars Helper'
    description: Simple handlebars helpers are often just a thin wrapper on top of
      a **pure JavaScript function**. We'll build a helper of our own, using both
      **positional and named arguments**, and use it in our **Handlebars templates**.
    item_type: exercise
    start_time: '10:10'
    duration: 20
  - title: Templates & Simple Helpers
    description: If we start to add content to our project's `application.hbs` file,
      we can see that **Handlebars templates** are really just a superset of HTML.
      By combining data binding with **Handlebars helpers** it's easy to see how much
      power there is in the framework's **declarative templating features**.
    item_type: lecture
    start_time: '9:40'
    duration: 30
  - title: Creating an App
    description: We'll go through the quick and easy process of creating an ember
      app with the official build tool, **ember-cli**, and look at the code that's
      generated for us automatically.
    item_type: lecture
    start_time: '9:20'
    duration: 20
  - title: Philosophy of Ember
    description: Ember aims to be a complete and holistic solution to building complex
      single-page web applications. We'll discuss the advantages and challenges of
      working within Ember's opinionated and convention-oriented ecosystem, point
      out where Ember aligns with web standards, and enumerate some of the most recent
      features that have been added to the framework over the past year.
    item_type: lecture
    start_time: '9:00'
    duration: 20
---
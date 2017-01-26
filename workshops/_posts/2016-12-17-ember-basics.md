---
layout: workshop
title: Ember Basics
permalink: "/workshops/2016-12-17-ember-basics"
category: Front End Development
description: "A thorough introduction to this opinionated, productivity-oriented web
  framework, covering all the basics you need to know, in order to get up and running
  successfully!\n\nThis course serves as a solid foundation for a deep understanding
  of emberjs and modern javascript development. "
stages:
- title: Anatomy of an Ember App
  description: In this unit, we'll go through the tools involved in a professional
    Ember.js development environment, including ember-cli, the ember inspector and
    more! Then, we'll take a look at the various parts of an ember-cli project, and
    cover the various micro-libraries that serve as Ember's foundation.
  duration: 120
  agenda_items:
  - title: The Ember Ecosystem
    description: One of the great strengths of ember.js is the surrounding ecosystem
      of official and community libraries, build tools, conferences and resources.
      We'll give you a comprehensive introduction to many aspects of the ember world,
      so you know just where to go for libraries, questions, documentation and events!
    item_type: 30
    start_time: lecture
    duration: 1030
  - title: Structure of an App
    description: We'll create a new ember app using ember-cli, and explore the code
      that's been generated for us. Some of these folders contain **JavaScript**,
      some contain **Handlebars templates** and some contain **CSS**.
    item_type: 45
    start_time: lecture
    duration: 945
  - title: Philosophy of Ember
    description: Ember aims to be a complete and holistic solution to building complex
      single-page web applications. We'll discuss the advantages and challenges of
      working within Ember's opinionated and convention-oriented ecosystem, point
      out where Ember aligns with web standards, and enumerate some of the most recent
      features that have been added to the framework over the past year.
    item_type: 45
    start_time: lecture
    duration: 900
- title: Components
  description: Components play an increasingly central role in modern web app development,
    as a mean for defining encapsulated pieces of UI and having well-defined contracts
    with the outside world.
  duration: 240
  agenda_items:
  - title: 'Exercise: A Simple Component'
    description: |
      We'll build a simple component, whose purpose is to encapsulate a piece of UI, including its:
      * Style (CSS)
      * Behavior (JS)
      * Structure (HTML)

      Through a combination of passing data through the component's interface to the outside world, properties passed to `Ember.Component.extend`, and values set in the component's `init()` method, we'll establish a solid understanding for how a component's state is determined.

      Finally, we'll use a "classic" component action and a *closure action* to allow the outside world to respond to user interactions that began inside our component, and illustrate the differences between best practices for each approach.
    item_type: 45
    start_time: exercise
    duration: 930
  - title: Lunch
    description: Break for lunch
    item_type: 45
    start_time: break
    duration: 1215
  - title: 'Exercise: Customizing the Component Boundary'
    description: "We'll practice our new knowledge of component boundary customization
      by:\n* Adding some classes to a few `{{link-to}}` components in our app\n* Building
      a basic textarea component, with CSS for basic validation styling\n* Adding
      a DOM attribute to the textarea component, with any validation error messages\n*
      Displaying and styling the validation error(s) with CSS \n"
    item_type: 30
    start_time: exercise
    duration: 1145
  - title: Customizing the Component Boundary
    description: |-
      Like W3C Web Components, Ember components are always defined as a **boundary element** with some private structure contained therein. We'll study a few ways of customizing the boundary element, including:
      * Changing its tag
      * Binding CSS classes to properties
      * Binding DOM attributes to properties
      * Adding classes to components on the fly

      We'll also cover component CSS best practices, as they relate to the boundary element.
    item_type: 30
    start_time: lecture
    duration: 1115
  - title: 'Exercise: Complex Components'
    description: |-
      We'll use our knowledge of **yield** to make two new components:
      * One that generates a list of items based on an array
      * One that exposes important values to its **block**
    item_type: 30
    start_time: exercise
    duration: 1045
  - title: Complex Components
    description: |-
      In the real world, we build components up to form larger components, and often need to weave pieces of complex UI together. We'll look at two concepts in particular:
      * The `{{component}}` helper
      * The `{{yield}}` helper, and the concept of exposing component internals to the outside world
    item_type: 30
    start_time: lecture
    duration: 1015
  - title: Component Basics
    description: We'll examine a simple component and clearly define the types of
      things that belong in the **hbs** and **js** files. By passing data through
      the component's interface to the outside world, we can control its initial state,
      and the signals we receive in response to user actions. Finally, we'll study
      the component lifecycle hooks, and provide examples for common uses of each
      one.
    item_type: 30
    start_time: lecture
    duration: 900
- title: Testing
  description: |-
    A great testing story is a critical part of any serious tech stack, and the Ember community has put a lot of time into making this a great strength of the framework. We'll cover examples and best practices in areas of :
    * Unit testing
    * Component integration testing
    * Acceptance testing
    * Mocking data
    * Writing sustainable tests
  duration: 240
  agenda_items:
  - title: 'Exercise: Writing Acceptance Tests'
    description: We'll incrementally write an acceptance test to test one of the critical
      workflows in our app, using Qunit 3's **development mode**, and **Pretender**
      to mock AJAX JSON responses without using our usual REST API.
    item_type: 45
    start_time: exercise
    duration: 1615
  - title: Acceptance Tests
    description: |-
      Acceptance tests are great for ensuring that critical workflows work as expected. They're much slower than unit or component integration tests, since they are run against your app as a whole, but this is a great way to ensure that the whole thing works together as expected. We'll explore topics relevant to acceptance testing like:
      * Async test helpers
      * Maintainable CSS selectors for tests
      * Mocking data with Pretender
    item_type: 30
    start_time: lecture
    duration: 1545
  - title: Component Testing
    description: |-
      Thanks to the ability to write small pieces of **inline handlebars template** to set up test scenarios, component integration testing is easier than ever before! Integration tests are designed to establish that a contract between two things works as expected, so we'll examine different ways of testing the component's contract with the outside world, including:
      * Passing data into the component
      * Receiving calls to actions bound to the component
      * Injecting services into the component, for just for testing
    item_type: 30
    start_time: lecture
    duration: 1430
  - title: 'Exercise: Writing Component Tests'
    description: |-
      We'll write some component tests for our existing components, exploring issues like:
      * Setting up a realistic test scenario
      * Examining changes to bound data
      * Stubbing services
      * Verifying that actions have been fired
    item_type: 45
    start_time: exercise
    duration: 1500
  - title: 'Exercise: Writing Unit Tests'
    description: We'll write some unit tests for the handlebars helpers we wrote earlier,
      and build a computed property marco, complete with unit tests!
    item_type: 30
    start_time: exercise
    duration: 1400
  - title: A Single-Page App Testing Primer
    description: We'll go over the unique challenges and concerns that pertain to
      writing, debugging and maintaining tests for a Single-Page App.
    item_type: 30
    start_time: lecture
    duration: 1300
  - title: Unit Testing
    description: |-
      Unit tests are great for testing algorithmic complexity. In particular, they're the go-to flavor of test for models, handlebars helpers, utility functions, and other common things like computed property macros. We'll cover concepts like:
      * Mocking data
      * Testing setup/teardown hooks
      * The Qunit assertion library
    item_type: 30
    start_time: lecture
    duration: 1330
- title: Routing & Top-Level Templates
  description: One of the important ideas at the core of Ember is URL-driven application
    state. Great state management is what makes the difference between single page
    apps that delight users, and those that frustrate them.
  duration: 225
  agenda_items:
  - title: Handlebars Helpers
    description: Handlebars helpers provide a mean of bringing declarative logic into
      our templates, including iteration through arrays, conditionals and more! We'll
      examine different ways of building helpers, covering use cases for both **bound**
      and **unbound** varieties. Finally, we'll introduce the powerful concept of
      **subexpressions**, which allow helpers to be composed together.
    item_type: 45
    start_time: lecture
    duration: 1230
  - title: 'Exercise: Static Data in Routes & Placeholder Templates'
    description: We'll learn how to **decompose the design of our app into a hierarchy
      of routes and top-level templates**. For now, these templates will return static
      data, but we'll build in a means of navigating between pages, examining the
      types of transitions that take place in a variety of situations.
    item_type: 30
    start_time: exercise
    duration: 1200
  - title: Lunch
    description: Break for lunch
    item_type: 60
    start_time: break
    duration: 1345
  - title: 'Exercise: Bound & Unbound Handlebars Helpers'
    description: We'll build one bound and one unbound handlebars helper, as part
      of our large project.
    item_type: 30
    start_time: exercise
    duration: 1315
  - title: Template Basics
    description: Each route has a **top-level template** paired with it, representing
      part of the **view hierarchy** of a particular "page" in your single-page application.
      For now, we'll treat templates as a superset of HTML. We'll introduce the powerful
      `{{link-to}}` helper as a means of building internal URLs.
    item_type: 15
    start_time: lecture
    duration: 1145
  - title: Router & Routes
    description: We'll study Ember's **Router**, and examine its conceptual foundation
      as a finite state machine, and introduce the concept of **Routes**, a hierarchy
      of objects that perform transitions between router states.
    item_type: 45
    start_time: lecture
    duration: 1100
- title: Objects, Properties & Actions
  description: |-
    Nearly all of Ember's important types extend from a core `Ember.Object` class, which we'll study, and compare to JavaScript's `Object` and `Class` concepts.

    Some types of ember objects, like Routes, Controllers and Components can **handle user interactions by way of actions**. We'll cover strategies and best practices for action handling, including:
    * the `{{action}}` helper
    * closure actions
    * action bubbling
    * the `{{route action}}` helper
    * the `{{mut}}` helper
  duration: 150
  agenda_items:
  - title: Computed Properties
    description: Computed properties are a performant and intuitive way to define
      values that are based on other values. We'll take a short trip through the internal
      implementation of a computed property, and contrast it with the more expensive
      and error-prone concept of **Observers**.
    item_type: 30
    start_time: lecture
    duration: 1645
  - title: 'Exercise: Services'
    description: We'll improve our bound handlebars helper, and take advantage of
      a service, so that we can share the concept of "current time" across many flavors
      of objects, and perform more efficient DOM updates.
    item_type: 30
    start_time: exercise
    duration: 1615
  - title: Services
    description: Services are a means of sharing state & functionality across various
      aspects of an app. We'll explain what makes services a simple, but powerful
      concept, and illustrate service use via `Ember.inject`. Finally, we'll get a
      sneak preview of the important role services play in the upcoming **engines**
      framework feature, and explore the "*do's and don'ts of service design**.
    item_type: 30
    start_time: lecture
    duration: 1545
  - title: Objects
    description: |-
      We'll look at `Ember.Object` in detail, including:
      * using the KVO-compliant **get** and **set** methods
      * adding instance and static methods with `reopen` and `reopenClass`
      * lifecycle hooks
      * events
    item_type: 30
    start_time: lecture
    duration: 1445
  - title: 'Exercise: Extending Object'
    description: |-
      We'll create our own subclass of `Ember.Object` using `extend()`, and incorporate:
      * proper handling of setup and tear-down logic
      * firing events using `Ember.Evented`
      * getting and setting properties
      * reopening
    item_type: 30
    start_time: exercise
    duration: 1515
---
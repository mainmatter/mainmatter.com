---
layout: workshop
title: TypeScript Fundamentals
weight: 3
permalink: "/services/training/2017-05-01-typescript-fundamentals"
redirect_from: "/training/2017-05-01-typescript-fundamentals"
category: Front End
description: Adding strong typing to large JavaScript apps with TypeScript helps reduce
  bugs, and keep developers on the performant and maintainable path. In this course,
  you'll learn everything you need to know to be successful when using TypeScript
  to build web apps with React, Ember.js or Angular 2.
image: "/images/training/2017-05-01-typescript-fundamentals.png"
stages:
- title: Why TypeScript?
  description: 'Adding types to JavaScript in a way that’s convenient requires considerable
    finesse. We’ll walk through how TypeScript’s compiler works, and the benefits
    that teams who use the language will enjoy.

'
  duration: 120
  agenda_items:
  - title: Welcome and Setup
    description: We'll introduce ourselves and meet each other, and ensure everyone
      is properly set up for the course.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Strange JavaScript & The Benefits of Types
    description: JavaScript has some quirky characteristics that can lead to considerable
      confusion, particularly from those who come from a background using a strongly-typed
      language like C++ or Java.
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: Using the TypeScript Compiler
    description: The Typescript compiler is a robust tool for turning your code into
      JavaScript. We’ll look at how the tool is typically used, and the vast array
      of important configuration parameters we can tweak to get just what we need.
    item_type: lecture
    start_time: '9:45'
    duration: 30
  - title: 'EXERCISE: Compiling TypeScript into JavaScript'
    description: We'll use our knowledge of the `tsc` command to compile some TypeScript
      files into appropriate JavaScript code.
    item_type: exercise
    start_time: '10:15'
    duration: 30
  - title: Coffee Break
    description: Coffee Break
    item_type: break
    start_time: '10:45'
    duration: 15
- title: Today's JavaScript is Yesterday's TypeScript
  description: Starting with the ES2015 revision of the JavaScript language standard,
    it has begun to adopt many well-loved features of TypeScript. Because of this,
    it’s common to see some things that the JavaScript community would consider “experimental”
    used widely in TypeScript programs. We’ll look at some of these areas in detail.
  duration: 420
  agenda_items:
  - title: Modules
    description: Modules have been a first class part of TypeScript since before people
      started using them widely in JavaScript. We'll look at how to stitch encapsulated
      and modular pieces of code together, and cover some best practices regarding
      namespaces, named and default exports, and importing.
    item_type: lecture
    start_time: '11:00'
    duration: 30
  - title: 'EXERCISE: Refactor into modules'
    description: Using our best practices for modules, refactor the code for this
      exercise so that it's separated into distinct modules, and more easily unit
      testable.
    item_type: exercise
    start_time: '11:30'
    duration: 30
  - title: Classes and Prototypes
    description: Classes are an important abstraction built on top of JavaScript's
      prototypal inheritance, which reduces the propensity for developers to tread
      into a counterintuitive territory. TypeScript makes heavy use of the concept
      of a JavaScript class and adds some unique features that you won't see in the
      JS world.
    item_type: lecture
    start_time: '12:00'
    duration: 30
  - title: 'EXERCISE: Color picker: class edition'
    description: Implement a color picker using JavaScript classes.
    item_type: exercise
    start_time: '12:30'
    duration: 30
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '13:00'
    duration: 60
  - title: Decorators
    description: 'Decorators allow us to modify and annotate things like classes,
      functions and values in an easy and declarative way. While they''re starting
      to look like promising additions to the JavaScript language spec, you''ll see
      them in TypeScript all the time. '
    item_type: lecture
    start_time: '14:00'
    duration: 30
  - title: 'EXERCISE: Memoized functions'
    description: 'Memoization is a technique that can be used with pure functions,
      where output values are “remembered” for an input argument(s). Thus, re-invoking
      the function with the same arguments will return the same “remembered” result.
      We’ll implement a `@memoize` function decorator so that we can apply this technique
      easily and cleanly in our code. '
    item_type: exercise
    start_time: '14:30'
    duration: 30
  - title: Enhanced Objects & Property Descriptors
    description: Enhanced object literals allow us to do common things like add methods
      and properties more clearly and easily than ever before. We'll look at how object
      literals have evolved since the ES5 JavaScript standard, and then explore additional
      features that TypeScript bring to the party.
    item_type: lecture
    start_time: '15:30'
    duration: 20
  - title: 'EXERCISE: Getter/Setter based properties'
    description: Using a property descriptor, define a property on an object that's
      **derived** from other values. We should be able to get and set this property,
      just as if it was value based. For the getter and setter you define, you should
      take care of keeping all dependencies properly in sync.
    item_type: exercise
    start_time: '15:50'
    duration: 20
  - title: Iterators and Generators
    description: 'Several core JavaScript objects are “Iterables”, meaning they can
      provide an Iterator: special objects that maintain iteration state and can be
      asked for the next item in a sequence. Generator functions are simply functions
      that return iterators. We’ll look at these concepts in depth, and illustrate
      how they serve as the foundation for many higher-level JavaScript language features.'
    item_type: lecture
    start_time: '16:10'
    duration: 40
  - title: Async & Await
    description: 'Async and await are starting to creep into the JavaScript world,
      but these keywords have been broadly used in TypeScript programs for many years.
      We''ll learn about how these new keywords allow us to write async code that
      looks almost like the synchronous (blocking) equivalent!

'
    item_type: lecture
    start_time: '16:50'
    duration: 25
  - title: Recap & Wrap Up
    description: We'll recap what we've covered today, and set our sights on a homework
      assignment and tomorrow's agenda
    item_type: lecture
    start_time: '17:15'
    duration: 15
  - title: 'HOMEWORK: Async Task Runner'
    description: One of the most powerful things we can build on top of generator
      functions is an “async task runner”. You have an “autocomplete” use case already
      set up, that involves running several async operations in sequence.
    item_type: exercise
    start_time: '18:30'
    duration: 60
- title: Applying Types
  description: Now that we've bolstered our knowledge of some less-frequently-used
    areas of JavaScript, we'll start to add types to the mix.
  duration: 315
  agenda_items:
  - title: Welcome & Solution to Homework
    description: We'll go through the agenda for today and the solution to last night's
      homework exercise.
    item_type: lecture
    start_time: '9:00'
    duration: 20
  - title: Type Annotations
    description: Type annotations, which can be used anywhere a value is declared,
      passed or returned, are the basis for some fantastic editor features and static
      code analysis. We'll look at some of the most basic type annotation use cases,
      and demonstrate how those ugly areas of JavaScript quickly begin to go away.
    item_type: lecture
    start_time: '9:20'
    duration: 20
  - title: 'EXERCISE: Typed Color Picker'
    description: Add type annotations to our color picker. Your solution should result
      in no warnings emitted by the TypeScript compiler.
    item_type: exercise
    start_time: '9:40'
    duration: 20
  - title: Ambient Types
    description: Ambient types allow us to provide type information for any JavaScript
      code that's included in our project.
    item_type: lecture
    start_time: '10:00'
    duration: 20
  - title: 'EXERCISE: Adding types for an existing JS library'
    description: 'Use our knowledge of the standard setup for `*.d.ts` files to supply
      type information for our color conversion library.

'
    item_type: exercise
    start_time: '10:20'
    duration: 20
  - title: Coffee Break
    description: Coffee Break
    item_type: break
    start_time: '10:40'
    duration: 10
  - title: Optionals
    description: Adding type annotations to your code can start to apply some unexpected
      constrains -- one of which is that "optional" arguments must be explicitly defined
      as such. We'll look at how this is done in TypeScript, and how to decide between
      "optionals" or arguments with default values when designing functions.
    item_type: lecture
    start_time: '10:50'
    duration: 20
  - title: 'EXERCISE: Making our color picker more robust'
    description: Using our knowledge of optionals and default parameter values, make
      the provided edge and corner test cases pass with no TypeScript compiler warnings.
    item_type: exercise
    start_time: '11:10'
    duration: 20
  - title: Interfaces
    description: Interfaces allow us to go way beyond the default basic types that
      we're provided with, and to define complex types of our own. We'll look at how
      interfaces can be used for "structural typing" and how we can implement multiple
      interfaces in an ES2015 class using the `implements` keyword.
    item_type: lecture
    start_time: '11:30'
    duration: 20
  - title: 'EXERCISE: Structural typing with interfaces'
    description: Use an interface to represent a color as an object with r, g, and
      b channels. Update the rest of your code so that all tests pass with this new
      color representation, with no TypeScript compiler warnings or errors.
    item_type: exercise
    start_time: '11:50'
    duration: 20
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:10'
    duration: 50
  - title: Generics
    description: Generics allow us to define classes or functions in ways that are
      type-agnostic, meaning that they work across a broad range of types, while still
      providing the benefits of type safety. We'll look at how this works, and walk
      through some common use cases.
    item_type: lecture
    start_time: '13:00'
    duration: 20
  - title: 'EXERCISE: Generics'
    description: 'Solve the provided exercise so that all tests pass, and the TypeScript
      compiler emits no warnings or errors.

'
    item_type: exercise
    start_time: '13:20'
    duration: 20
  - title: Type Guards, Coersion, Casting and Assertion
    description: 'There are several ways we can guard against and convert values to
      get the type we need, but these language features are a little different than
      what you may be used to due to TypeScript not having any kind of runtime reflection
      API. We''ll look at the broad range of options available, and then narrow down
      to best practices that will serve you well, even in very complex applications.

'
    item_type: lecture
    start_time: '13:40'
    duration: 20
  - title: Working with TSX
    description: TypeScript can be used with JSX very easily, but there are certain
      types of TypeScript syntax that interfere with JSX parsing. We'll identify these
      issues, and provide some TSX-friendly workarounds that'll let us get the same
      things done, even in React components.
    item_type: lecture
    start_time: '14:00'
    duration: 15
- title: Beyond JavaScript
  description: 'We are essentially using "modern JavaScript with types", and we will
    start adding in other language features that TypeScript brings to the table. '
  duration: 175
  agenda_items:
  - title: Access Modifiers
    description: 'The `public`, `private` and `protected` access modifiers allow us
      to control what our classes expose down their inheritance chain, and out to
      the rest of the world. We''ll study how structural type matching is affected
      by these modifiers, and provide some guidance and best practices to strike the
      appropriate balance between safety and flexibility.

'
    item_type: lecture
    start_time: '14:15'
    duration: 15
  - title: Readonly and Static
    description: The `readonly` and `static` keywords further enhance what we can
      do with JavaScript classes.
    item_type: lecture
    start_time: '14:30'
    duration: 15
  - title: 'EXERCISE: Access modifiers'
    description: Solve the provided exercise, such that all tests pass, and the TypeScript
      compiler emits no warnings or errors
    item_type: exercise
    start_time: '14:45'
    duration: 20
  - title: Enums
    description: Enums allow us to group a collection of related values together.
      TypeScript provides us with a robust and full-featured solution in this area,
      with some options that let us strike the balance between full-featured and lightweight.
    item_type: lecture
    start_time: '15:05'
    duration: 20
  - title: Mixins, Abstract Classes and Interfaces
    description: When it comes to inheritance, we have many options to choose from.
      We'll look at the appropriateness of abstract classes, interfaces, and mixins
      for various use cases, highlighting the pros and cons of each.
    item_type: lecture
    start_time: '15:25'
    duration: 20
  - title: 'EXERCISE: Data Modeling'
    description: Solve the provided exercise, such that all tests pass, and the TypeScript
      compiler emits no warnings or errors
    item_type: exercise
    start_time: '15:45'
    duration: 20
  - title: Code Style
    description: Odds are, you're probably used to writing plain JavaScript. We'll
      go over some code style best practices that you may want to add to your tslint
      typescript linting configuration.
    item_type: lecture
    start_time: '16:05'
    duration: 15
  - title: Using TypeScript with React
    description: 'React components provide us with some excellent opportunities to
      reap the benefits of what we''ve learned so far. We''ll review React''s DefinitelyTyped
      library type descriptions and see how much our editor helps us, compared to
      what we''d see were we using "vanilla JavaScript".

'
    item_type: lecture
    start_time: '16:20'
    duration: 20
  - title: 'EXERCISE: A typed react component'
    description: Rebuild the UI component for our color picker, using interfaces for
      the component state and props.
    item_type: exercise
    start_time: '16:40'
    duration: 30
- title: Migrating to TypeScript
  description: As Typescript works side-by-side with JavaScript easily and conveniently,
    the overhead to start using Typescript is very low. We'll discuss some topics
    related to moving a conventional JavaScript app to TypeScript, while striking
    the balance between capability and productivity.
  duration: 50
  agenda_items:
  - title: Adding Types Incrementally
    description: 'One of the core requirement of TypeScript is that it must be conveniently
      usable side-by-side with regular JavaScript. We''ll look at what it would take
      to add TypeScript to an existing project, and then incrementally add type information
      over time. '
    item_type: lecture
    start_time: '17:10'
    duration: 15
  - title: Using TypeScript with Babel
    description: You will often use TypeScript and Babel together. Because both of
      these libraries are responsible for taking something other than browser-friendly
      JavaScript and transforming it to ES5, there can be some strange behavior depending
      on how things are set up. We'll provide some guidelines for a setup that maximizes
      the benefit you get from both of these tools while minimizing confusion.
    item_type: lecture
    start_time: '17:25'
    duration: 20
  - title: Wrap up and recap
    description: We'll recap everything we've covered today, and provide some recommendations
      for further reading and learning.
    item_type: lecture
    start_time: '17:45'
    duration: 15
---
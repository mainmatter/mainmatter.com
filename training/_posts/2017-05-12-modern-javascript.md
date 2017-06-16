---
layout: workshop
title: Modern JavaScript
weight: 3
permalink: "/training/2017-05-12-modern-javascript"
category: Front End Development
description: JavaScript is flexible enough to do just about anything, and while this
  is one of its great strengths, it's also what makes best practices less clear. This
  deep dive into the fundamentals and latest advances in the language will help you
  learn how to make the most of it!
image: "/images/training/2017-05-12-modern-javascript.png"
stages:
- title: Modules, Functions and Types
  description: Mastering the fundamentals of JavaScript pays huge dividends, as we
    start diving into the language features that are slightly newer and more complex.
  duration: 270
  agenda_items:
  - title: Welcome
    description: 'Get to know each other, and ensure everyone has the course projects
      installed properly.

'
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Types and Operators
    description: At the foundation of JavaScript are a few fundamental types and operators.
      We'll look at each of these in detail, highlighting and clarifying some counterintuitive
      aspects of the language.
    item_type: lecture
    start_time: '9:15'
    duration: 20
  - title: Basic Functions
    description: Functions are first class values in JavaScript, meaning they can
      exist on their own and used wherever any other value can be used. We'll look
      at the basics of how functions are declared, defined and used in JavaScript.
    item_type: lecture
    start_time: '9:35'
    duration: 25
  - title: Basic Objects
    description: Objects serve as the foundation for all mutable data structures in
      JavaScript. They're incredibly flexible, in that they can contain data, value
      based properties, and even getter and setter based properties.
    item_type: lecture
    start_time: '10:00'
    duration: 20
  - title: 'EXERCISE: Two Kinds of Color'
    description: Using a property descriptor, define a property on an object that's
      **derived** from other values. We should be able to get and set this property
      just as if it were value based, and the getter and setter you define should
      keep all of the dependencies in sync properly.
    item_type: exercise
    start_time: '10:20'
    duration: 30
  - title: Modules
    description: Thankfully, the JavaScript ecosystem has standardized around a single
      type of "module". We'll compare this current standard to some widely-adopted
      predecessors (CommonJS and Named AMD modules), highlighting new capabilities
      and future potential. Finally, we'll discuss some topics that are currently
      under discussion in the TC39 working group (the JavaScript standards body).
    item_type: lecture
    start_time: '10:50'
    duration: 20
  - title: 'EXERCISE: Refactoring into Modules'
    description: Take a solution from the previous exercise and refactor it, so that
      the heavy lifting is done by two pure functions in a separate module.
    item_type: exercise
    start_time: '11:10'
    duration: 10
  - title: Coffee Break
    description: Coffee Break
    item_type: break
    start_time: '11:20'
    duration: 10
  - title: Deeper Functions
    description: New advancements in the JavaScript standard have made concepts like
      arrow functions commonplace, and upcoming improvements to modern runtimes will
      give us what we need to treat it like a true functional programming language.
      We'll look at higher order functions, named vs unnamed functions, the concept
      of lexical scope, and different ways we can invoke functions.
    item_type: lecture
    start_time: '11:30'
    duration: 30
  - title: 'EXERCISE: Functional Cart'
    description: Build a shopping cart that takes advantage of a closure's ability
      to hold state (and functions defined within that closure to access that state).
    item_type: exercise
    start_time: '12:00'
    duration: 30
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:30'
    duration: 60
- title: Working with Data
  description: We'll dive deep into JavaScript data structures and control flow, touching
    on some new concepts and some old ones that you probably haven't used in a while.
  duration: 185
  agenda_items:
  - title: Arrays
    description: Like Objects, Arrays are required to get almost anything done in
      JavaScript. We'll look at the Array type in great detail, focusing particular
      how some built-in higher-order functions can make quick work of common jobs.
    item_type: lecture
    start_time: '13:30'
    duration: 30
  - title: 'EXERCISE: Map, Filter, Reduce'
    description: Using our knowledge of how higher order functions on the Array prototype
      work, we'll implement our own map, filter, reduce and forEach functions.
    item_type: exercise
    start_time: '14:00'
    duration: 30
  - title: Control Flow
    description: Control flow statements like `if` and `switch` give us the ability
      to define various paths that our program can take, under different circumstances.
      We'll look at how these work in detail, including some non-traditional (but
      very useful) use cases.
    item_type: lecture
    start_time: '14:30'
    duration: 30
  - title: 'EXERCISE: Versioned Documents'
    description: Progressive Web Apps often need to store data in some durable medium.
      It's a good idea to version long-living data since old data may need to work
      with new versions of the application. We'll use our newfound knowledge of control
      flow statements to "upgrade" a versioned data structure to the current version,
      so that the rest of our app need not worry about it.
    item_type: exercise
    start_time: '15:00'
    duration: 20
  - title: Loops and Iteration
    description: While you're no doubt familiar with a `while` or `for` loop, there
      are other mechanisms in JavaScript for iterating over data (some of which are
      very new). We'll look at the differences between things like `for..in` and `for..of`
      loops, and refresh ourselves with often-forgotten concepts like `do..while`.
    item_type: exercise
    start_time: '15:20'
    duration: 30
  - title: 'EXERCISE: Fibonacci Numbers'
    description: Implement a function that returns a Fibonacci sequence of a specified
      length. Ensure that your solution works for sequences up to 10 million numbers
      long!
    item_type: exercise
    start_time: '15:50'
    duration: 30
  - title: Wrap up and recap
    description: We'll recap all the ground we've covered today, and set our sights
      on tomorrow's agenda.
    item_type: lecture
    start_time: '16:20'
    duration: 15
- title: Handling Asynchrony
  description: JavaScript's internal event loop and the fact that all the code we
    write is "non-blocking" allows it to keep track of tons asynchronous processes
    while still operating on a single thread. We'll look at some low-level patterns
    for managing asynchrony and concurrency, then build all the way up to modern language
    features like async and await.
  duration: 300
  agenda_items:
  - title: Welcome
    description: We'll recap everything we've covered so far, and review today's agenda.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Promises
    description: Promises can be thought of as "eventual values", and are a great
      abstraction of some asynchronous work. We'll review basic promise usage, error
      handling, and techniques for grouping promises together in sequence or in parallel.
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: 'PROJECT: Fetch Coalescing'
    description: Often, when a single page app boots up, requests for remote data
      at various URLs will be sent out as part of the startup process. Occasionally,
      we can see multiple requests going out for the exact same resources. We'll build
      a utility that ensures that request for data that's already on its way are link
      together and resolved by the same promise.
    item_type: exercise
    start_time: '9:45'
    duration: 45
  - title: Break
    description: Coffee break
    item_type: break
    start_time: '10:30'
    duration: 15
  - title: Iterators and Generator Functions
    description: 'Several core JavaScript objects are “Iterables”, meaning they can
      provide an Iterator: special objects that maintain iteration state and can be
      asked for the next item in a sequence. Generator functions are simply functions
      that return iterators. We’ll look at these concepts in depth, and illustrate
      how they serve as the foundations for many higher-level JavaScript language
      features.'
    item_type: lecture
    start_time: '10:45'
    duration: 30
  - title: 'PROJECT: Async Task Runner'
    description: One of the most powerful things we can build on top of generator
      functions is an “async task runner”. You have an “autocomplete” use case already
      set up, that involves running several async operations in sequence.
    item_type: lecture
    start_time: '11:15'
    duration: 45
  - title: Async and Await
    description: 'Now that we’ve done all the work to build a task function, we’re
      in a perfect position to appreciate a new language feature that looks very similar:
      `async` and `await`. The `await` keyword, when used in an `async` function,
      allows us to write asynchronous code in a way that looks and feels very much
      like the synchronous (blocking) equivalent!'
    item_type: lecture
    start_time: '12:00'
    duration: 30
  - title: 'EXERCISE: Write an Integration Test'
    description: Integration tests are a perfect place to use `async` and `await`,
      because we often want to perform a series of simulated user interactions and
      wait for each one to complete, before proceeding further in the test.
    item_type: exercise
    start_time: '12:30'
    duration: 30
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '13:00'
    duration: 60
- title: Advanced Data Structures
  description: With the ES2015 version of the JavaScript specification came several
    new data structures like Map, Set, WeakMap, WeakSet and Proxy. We’ll look at the
    motivations for adding these features to the language and get hands-on experience
    solving some problems that would be much more difficult were it not for these
    new constructs.
  duration: 165
  agenda_items:
  - title: Maps and Sets
    description: "`Map` and `Set` are new data structures that have distinct advantages
      in various use cases. We’ll study both in detail, including their “weak” counterparts:
      `WeakMap` and `WeakSet`."
    item_type: lecture
    start_time: '14:00'
    duration: 30
  - title: 'PROJECT: Spies and Stubs'
    description: Using a `Map`, we’ll build a small “spying” library that we can use
      to monitor function invocations in our tests.
    item_type: exercise
    start_time: '14:30'
    duration: 45
  - title: Proxies
    description: "`Proxy` can “wrap” JavaScript objects or functions, potentially
      intercepting or modifying certain behaviors along the way."
    item_type: lecture
    start_time: '15:15'
    duration: 30
  - title: 'PROJECT: Buffered Proxy'
    description: Although there aren’t many obvious use cases for the `Proxy` type,
      one place where it proves handy is to “stage” proposed modifications to an object,
      without mutating the underlying values directly. We’ll implement a “buffered
      proxy” utility, and use it in an “edit form” context.
    item_type: exercise
    start_time: '15:45'
    duration: 45
  - title: Wrap up and Recap
    description: We'll recap everything we've covered today, and set our sights on
      tomorrow's agenda.
    item_type: lecture
    start_time: '16:30'
    duration: 15
- title: Classes
  description: The controversy around class stems from the illusion of removing prototypal
    inheritance from JavaScript. It is, in fact, just syntactic sugar on top of the
    same prototypes we’ve been using all along. However, in removing some of the noise
    that typically accompanies object-oriented JavaScript, and in making some typical
    traps more difficult to fall into, using classes can result in more readable and
    robust code.
  duration: 275
  agenda_items:
  - title: Welcome
    description: We'll recap everything we've covered so far, and review the day's
      agenda.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Classes in JavaScript
    description: While `class` doesn’t allow us to do anything that wasn’t possible
      with the direct use of prototypes, many things are easier and much cleaner.
      We’ll look at constructors, member and static functions, and the upcoming “member
      and instance field” TC39 proposals.
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: 'EXERCISE: Colors with classes'
    description: We’ll look back at our rgb/hex color exercises, and implement a more
      comprehensive solution using classes.
    item_type: exercise
    start_time: '9:45'
    duration: 30
  - title: Decorators
    description: Decorators allow us to do things at class construction time. Several
      uses of decorators are possible with the current draft spec (or when using Typescript)
      and a variety of proposals for new decorators are already in development!
    item_type: lecture
    start_time: '10:15'
    duration: 30
  - title: 'PROJECT: Memoized functions'
    description: 'Memoization is a technique that can be used with pure functions,
      where output values are “remembered” for an input argument(s). Thus, re-invoking
      the function with the same arguments will return the same “remembered” result.
      We’ll implement a `@memoize` function decorator, so that we can apply this technique
      easily and cleanly in our code. '
    item_type: exercise
    start_time: '10:45'
    duration: 45
  - title: Inheritance Patterns
    description: While it's true that `class` is only syntactic sugar on top of JavaScript’s
      prototypal inheritance, the new syntax makes it easier and cleaner to implement
      things like "mixins". We'll select a few important design patterns from the
      famous ["Gang of Four" design patterns book](https://www.amazon.com/Design-patterns-elements-reusable-object-oriented-x/dp/0201633612)
      and implement them using classes.
    item_type: lecture
    start_time: '11:30'
    duration: 20
  - title: 'PROJECT: Design Patterns w/ Class'
    description: We’ll implement some examples of classical object-oriented design
      patterns using `class`.
    item_type: exercise
    start_time: '11:50'
    duration: 45
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:35'
    duration: 60
- title: Performance & Tooling
  description: Improved performance almost always correlates to improvements in key
    business metrics. We’ll look at JavaScript performance from all angles, including
    shrinking and simplifying your production builds, figuring out when your code
    is de-optimized in modern javascript runtimes and more!
  duration: 205
  agenda_items:
  - title: Advanced Debugging Tools & Techniques
    description: Chrome and Node.js have recently undergone major advancements in
      their debugging tools. We’ll learn how to make the most of these tools, and
      demonstrate how life is now a little easier when it comes to debugging async
      code, or long chains of promises.
    item_type: lecture
    start_time: '13:35'
    duration: 30
  - title: 'EXERCISE: Finding and fixing a few pesky bugs'
    description: We’ll eradicate some bugs that would traditionally be very difficult
      to identify and track down.
    item_type: exercise
    start_time: '14:05'
    duration: 30
  - title: Performance Testing
    description: We’ll learn about the new performance audits, how to read and act
      on the results of a flame chart, and how to instrument a piece of code so that
      you get accurate and consistent results.
    item_type: lecture
    start_time: '14:35'
    duration: 30
  - title: 'EXERCISE: Measure and Improve Key Metrics'
    description: You’ll be given a few functions that can be substantially optimized.
      Measure them, identify the slow parts, and make a quantifiable improvement!
    item_type: exercise
    start_time: '15:05'
    duration: 30
  - title: Break
    description: Coffee break
    item_type: break
    start_time: '15:35'
    duration: 10
  - title: High level architecture of a modern JS runtime
    description: 'We’ll take a quick look at the architecture of the V8 Runtime that
      ships with Google Chrome and Node.js. In understanding how V8 Runtime works
      and how it tries to speed up our code, we’ll learn about patterns we need to
      avoid.

'
    item_type: lecture
    start_time: '15:45'
    duration: 30
  - title: 'EXERCISE: Finding and fixing de-optimizations'
    description: Using the guidelines for writing fast JavaScript, and new techniques
      we’ve learned about when code becomes “hot” or “cold” again, let's identify
      and fix some performance bugs.
    item_type: exercise
    start_time: '16:15'
    duration: 30
  - title: Wrap up and Recap
    description: Our final rap up with a full-course recap, suggested reading and
      learning to take this new knowledge further!
    item_type: lecture
    start_time: '16:45'
    duration: 15
---
---
layout: workshop
title: Sass Fundamentals
permalink: "/workshops/2017-02-16-sass-fundamentals"
category: Front End Development
description: Sass addresses many of the maintainability problems we typically experience
  when writing CSS, and makes writing styles fun again! This basic course will help
  you make the most out of this awesome preprocessor.
image: "/images/workshops/2017-02-16-sass-fundamentals.png"
stages:
- title: Sass Fundamentals
  description: |-
    While there have been recent major advancements in the way we organize the JavaScript in our modern web applications, CSS has comparatively hardly evolved at all. Instead, many teams rely on preprocessors such as Sass, Less, PostCSS, Stylus and others. These are essentially extensions of the foundational CSS concepts, which are compiled into regular CSS at build time.

    In this course, we’ll start with regular CSS, and quickly layer on new capabilities and tools that will change the way you think about your app’s styles. Quickly, after moving on from the basics, we’ll start to see how style can be parameterized and re-used, avoiding repetition and redundancy, while keeping everything readable and maintainable.

    Next, we’ll look at directives that bring imperative code concepts into stylesheets, like looping, conditional blocks and more. Finally, we’ll experiment with building our own Sass extension, where we can add new vocabulary and capabilities to the way we express styles.
  duration: 510
  agenda_items:
  - title: The preprocessor revolution
    description: We'll look at some of the common CSS pitfalls that motivated the
      invention of these technologies, and highlight how much easier things become
      in the Sass world.
    item_type: lecture
    start_time: '9:00'
    duration: 30
  - title: Stylish Tools
    description: When it comes to transforming Sass files to CSS, we have a few options.
      We'll  learn about options you can use from the command line, and in a node
      build tool.
    item_type: lecture
    start_time: '9:30'
    duration: 20
  - title: EXERCISE 1 - Using the Sass CLI
    description: 'Build a shell script that transforms a Scss file into two CSS files:
      one that''s human-friendly for a development environment, and one that''s smaller
      for a production environment.  How much of a file size savings did we get for
      this optimization?  '
    item_type: exercise
    start_time: '9:50'
    duration: 25
  - title: Nested & Modular Styles
    description: Partials and the `@import` directive allow us to write stylesheets
      in a modular and maintainable way. We'll look at the pitfalls of the CSS `@import`at-rule,
      and how Sass provides similar capabilities while addressing some common problems.
    item_type: lecture
    start_time: '10:15'
    duration: 30
  - title: Exercise 2 - DRY Styles
    description: Sticking to "the inception rule", refactor the Scss file you're given
      to take advantage of Sass nesting features
    item_type: exercise
    start_time: '10:45'
    duration: 20
  - title: Exercise 3 - Partials and import
    description: 'The `@import` directive, combined with partials allow us to break
      our stylesheets up into modular units. Make all of your failing tests pass,
      while avoiding any new redundancy. '
    item_type: exercise
    start_time: '11:05'
    duration: 25
  - title: 'SassScript: Variables & Operators'
    description: Being able to store and re-use values is a game-changer, in terms
      of reducing redundancy and improving consistency and maintainability throughout
      your styles. We'll discuss variable best practices, unit conversions and more!
    item_type: lecture
    start_time: '11:30'
    duration: 30
  - title: EXERCISE 4 - Variable Math
    description: Make the failing tests pass, by substituting literal values with
      SassScript expressions. Keep units in mind, and avoid any fudge factors!
    item_type: exercise
    start_time: '12:00'
    duration: 30
  - title: Lunch
    description: Break for lunch.
    item_type: break
    start_time: '12:30'
    duration: 60
  - title: Built-in Functions
    description: Sass has a treasure trove of built-in functions that allow us to
      expressively manipulate colors, numbers, lists, maps and more! We’ll look at
      what’s available, and then learn some best practices for practical and maintainable
      usage.
    item_type: lecture
    start_time: '13:30'
    duration: 30
  - title: Mixins
    description: 'Mixins allow us to re-use basic or parameterized chunks of style,
      via the `@extend` directive, without having to introduce tons of complexity
      into your HTML. '
    item_type: lecture
    start_time: '14:00'
    duration: 30
  - title: EXERCISE 5 - DRY Buttons
    description: The `.button` class in our app is available in a variety of colors,
      but there's a lot of repeated style between them. Using a combination of nested
      styles, color functions and mixins, design a means of generating a button of
      an arbitrary color (or set of colors).
    item_type: exercise
    start_time: '14:30'
    duration: 30
  - title: Extensible Styles
    description: The `@extend` directive is a powerful tool, we can use to "inherit"
      styles, but if over-used it has the potential to increase the size and complexity
      of the compiled CSS. We'll take a look at all this feature of Sass can do, some
      limitations as to where and how it can be applied, and some patterns for responsible
      use.
    item_type: lecture
    start_time: '15:00'
    duration: 30
  - title: EXERCISE 6 - Links as Buttons
    description: Many UI frameworks represent links with a particular class and the
      `<button>` with similar visual styles. Refactor and make use of the `@extend`
      directive to accomplish this. Your change must result in a net reduction in
      LOC of Scss, and no more than a 2% increase in compressed CSS filesize.
    item_type: exercise
    start_time: '15:30'
    duration: 30
  - title: Control Directives
    description: One of the most powerful aspects of Sass is the ability to add control
      flow to our sales. With the `@if`, `@for`, `@each` and `@while` directives,
      we can create powerful, concise and expressive styles, which are far easier
      to maintain and tweak than their CSS counterparts.
    item_type: lecture
    start_time: '16:00'
    duration: 45
  - title: EXERCISE 7 - Grid Generator
    description: Using control directives, build a mixin that generates a grid with
      an arbitrary number of columns. As an extra challenge, try to make the grid
      responsive!
    item_type: exercise
    start_time: '16:45'
    duration: 30
  - title: Wrap Up
    description: We'll recap everything we've learned today
    item_type: lecture
    start_time: '17:15'
    duration: 15
---
---
layout: workshop
title: Ember-CLI Basics
permalink: "/trainings/2016-12-19-ember-cli-basics"
category: Front End Development
description: "Ember-cli is truly a world class build tool, and it's more capable and
  versatile than most people think! \n\nWe need look no further for proof of its impact
  than angular-cli and react-create-app, as continuations of the idea that Single
  Page Apps are deserving of first class tools, optimized for their specific needs."
image: "/images/trainings/2016-12-19-ember-cli-basics.png"
stages:
- title: Broccoli Basics
  description: Broccoli is a fast, robust and portable asset pipeline, built with
    ember-cli in mind. It uses node's `fs` module as it's API, and is deliberately
    designed to steer users away from potential snags.
  duration: 120
  agenda_items:
  - title: Welcome & Kick Off
    description: We'll go through the day's agenda, and highlight some goals for the
      training.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Standalone Use with Broccoli-CLI
    description: 'Broccoli has its own CLI, and although it''s missing some of the
      stuff we take for granted in ember-cli, it can be useful to look at broccoli
      independently, in order to understand where it ends and where there rest of
      ember-cli begins '
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: Debugging & Developing Plugins
    description: Broccoli plugins can be thought of as streams, or lazily evaluated
      pieces in a functional chain. Because of this characteristic of laziness, we
      must take a different approach to debugging, relative to how we treat synchronous
      client-side code. You'll be provided with suggestions for an easy and intuitive
      broccoli plugin development workflow, that will maximize time spent getting
      results, and minimize time spent scratching your head.
    item_type: lecture
    start_time: '9:45'
    duration: 20
  - title: 'EXERCISE: Building your first Broccoli Plugins'
    description: We'll put our newfound skills to use, and build our first two broccoli
      plugins
    item_type: exercise
    start_time: '10:05'
    duration: 55
- title: Apps & Addons
  description: The contents of your `ember-cli-build` file is on center stage when
    consuming ember-cli's asset pipeline features. We'll dive into some features exposed
    by way of the EmberApp and EmberAddon objects, using some familiar tasks as case
    studies.
  duration: 210
  agenda_items:
  - title: Importing Assets
    description: One of the most common things a team needs to do in their `ember-cli-build.js`
      file is import a third party library into their app. We'll look at the the best
      way for getting this done, and provide some tips and tricks for consming as
      many things as possible via ES6 modules instead of globals.
    item_type: lecture
    start_time: '11:00'
    duration: 30
  - title: 'EXERCISE: Globals to ES6'
    description: Consuming as much as possible by way of ES6 modules is the way to
      go, for reasons we've already gone over. Let's take a library that makes its
      self available as a global, and use our knowledge of importing assets to expose
      it to our app or addon with ES6. This will include making things available as
      both named and default imports.
    item_type: exercise
    start_time: '11:30'
    duration: 30
  - title: Trees aplenty
    description: Having worked with broccoli already, we are already familiar with
      the concept of a tree. Ember app builds have several trees, and provide a few
      places to customize them, as files are transformed, combined and prepared for
      production.
    item_type: lecture
    start_time: '12:00'
    duration: 45
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:45'
    duration: 45
  - title: 'EXERCISE: Tweaking trees in the right places'
    description: We've covered the various trees in an ember-cli build, and means
      of customizing them. You'll be provided with some broccoli plugins, which you
      must insert into the build in the right places. Some of these will operate on
      the trees while JS and CSS remain in individual files, and some will need to
      operate on the concatenated and minified production assets.
    item_type: exercise
    start_time: '13:30'
    duration: 30
  - title: Anatomy of EmberApp and EmberAddon
    description: "`ember-cli-build.js` and `index.js` are the main focus of the ember-cli
      public API surface. We'll overview the various hooks, member data and other
      capabilities available to you when working with these files, and the important
      objects contained therein."
    item_type: lecture
    start_time: '14:00'
    duration: 30
- title: Codegen & Commands
  description: |-
    Ember-cli's blueprints and command features are incredibly powerful, and are tremendously under-utilized in the ember community. In this unit, we'll explore:
    * How apps (and addons contained therein)  can extend ember-cli
    * How arguments passed to ember-cli on the command line make it into your blueprint or command
    * Testing on the node.js side
  duration: 165
  agenda_items:
  - title: Adding Commands
    description: |-
      Like many modern tools, much of the amazing stuff we appreciate about ember-cli comes from the ability to extend it by way of libraries. We've already looked at how this can be done with broccoli plugins, but we can also change ember-cli's code generation features, and even add brand new commands!

      We'll first look at an addon that adds new commands to ember-cli, and discuss positional and named options, default values, and automatic `ember help` generation.
    item_type: lecture
    start_time: '14:30'
    duration: 30
  - title: 'EXERCISE: A new command'
    description: Add a new command to ember-cli, to broadcast a slack message to a
      particular channel.
    item_type: exercise
    start_time: '15:00'
    duration: 30
  - title: Beautiful Blueprints
    description: 'We can build our own blueprints for dynamic code generation, and
      study how options and `locals` turn our parameterized code templates into code.
      This underutilized and under-appreciated ember-cli feature has the potential
      to save you and your team loads of time, and to reduce accidental inconsistencies
      as well!

'
    item_type: lecture
    start_time: '15:30'
    duration: 30
  - title: 'EXERCISE: Computed property macro blueprint'
    description: Build a blueprint that makes a new computed property in the `app/cp`
      folder of your app, using command line arguments to dynamically specify local
      names (and number) of arguments passed to the macro.
    item_type: exercise
    start_time: '16:00'
    duration: 30
  - title: Testing Commands and Blueprints
    description: One of the challenges around building ember addons that are more
      tool oriented than client-side oriented, is that the existing testing stories
      that we rely on for our ember app's code won't help us much. We'll outline some
      strategies for asserting that your blueprints and commands do the things they're
      supposed to do, and ensure that these tests (in addition to testing your browser-based
      code) are part of what's run in your CI pipeline.
    item_type: lecture
    start_time: '16:30'
    duration: 30
  - title: Wrap Up & Goodbye
    description: We'll recap the things we've learned today, and discuss resources
      for continued research and practice.
    item_type: lecture
    start_time: '17:00'
    duration: 15
---
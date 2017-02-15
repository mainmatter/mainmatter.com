---
layout: workshop
title: Phoenix for Rubyists
permalink: "/workshops/2017-01-17-phoenix-for-rubyists"
category: Back End Development
description: Phoenix Framework draws heavily upon important foundations in the opinionated
  web frameworks that came before it, like Ruby on Rails.
stages:
- title: The First Sip
  description: Before we jump right into the framework, we need to at least know the
    basics of the programming language we're working with.
  duration: 80
  agenda_items:
  - title: IO & Files
    description: As with most programming languages, it's useful to know how to interact
      with files and humans. We'll take care of this early on, and notice a few things
      that foreshadow some interesting aspects of Elixir's concurrency model.
    item_type: lecture
    start_time: '10:15'
    duration: 30
  - title: Interactive Elixir
    description: |
      Elixir's interactive shell (IEx) is one of the most powerful tools in your toolbox. We'll outline some of the most useful features for beginners, including
      - Running scripts
      - Getting metadata about a value
      - Accessing embedded documentation
      - Inspecting the state of a particular process
    item_type: lecture
    start_time: '9:45'
    duration: 15
  - title: Welcome & Getting Started
    description: We'll go over our agenda, and set our sights on some goals for the
      day.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Origins, Foundations & Core Principles
    description: Elixir is unique, in that it provides us the fantastic ergonomics
      of a modern programming language, while standing on the solid and battle-tested
      foundation of the Erlang ecosystem.
    item_type: lecture
    start_time: '9:15'
    duration: 20
- title: Types, Operators & Control Flow
  description: One must crawl before one walks, and it all starts with basic types
    and procedural logic. Even if you're experienced in a wide range of programming
    languages, there's going to be a lot of stuff -- even at this basic level -- that
    may change the way you look at writing code forever.
  duration: 360
  agenda_items:
  - title: 'EXERCISE: Function Refactoring'
    description: We've got an elixir module that involves some code that could benefit
      from some pattern matching magic. Refactor the monolith function so all use
      of if/else are replaced by creating new functions oriented toward handling that
      specific pattern of arguments.
    item_type: exercise
    start_time: '15:30'
    duration: 30
  - title: 'EXERCISE: More Refactoring'
    description: We'll refactor some more code to leverage the power of pattern matching
      and functional control flow tools.
    item_type: exercise
    start_time: '16:30'
    duration: 30
  - title: Wrap Up
    description: Wrap up for the day
    item_type: lecture
    start_time: '17:00'
    duration: 15
  - title: Conditionals & Guards
    description: It's unusual to use if/else in Elixir, because we have some far more
      powerful approaches to deciding among different branches of code to use. We'll
      look at the `case` control flow structure, where pattern matching really starts
      to shine. We'll also take a look at how **guards** can be added to `case`  clauses
      (and other control flow structures) to form even more specific and targeted
      patterns.
    item_type: lecture
    start_time: '16:00'
    duration: 30
  - title: Tuples and Lists
    description: 'Often times we find ourselves needing to work with several objects
      in a "collection", and will need to choose between Elixir''s **List** and **Tuple**
      types. We''ll compare and contrast tuples and lists, and write a few programs
      highlighting the benefits of each

'
    item_type: lecture
    start_time: '13:30'
    duration: 30
  - title: Pattern Matching & Guards
    description: This modern language feature allows destructed assignment, and is
      often used in order to define several variants of a function, each to handle
      a specific scenario. This application of pattern matching reduces what would
      otherwise be a lot of internal function complexity by huge amounts.
    item_type: lecture
    start_time: '15:00'
    duration: 30
  - title: 'EXERCISE: Building up a List'
    description: Assembling a bunch of items in a list is really fast, as long as
      we do it in a way that doesn't involve moving existing items around in memory.
      We'll write two programs, one which assembles a bunch of dictionary words into
      a tuple, and another that uses a list instead.
    item_type: exercise
    start_time: '14:30'
    duration: 30
  - title: Functions
    description: 'It stands to reason that functions are really important in a functional
      programming language. We''ll build and work with named an anonymous functions,
      combine functions together to form pipelines, and even map out some higher-order
      functions of our own.

'
    item_type: lecture
    start_time: '12:10'
    duration: 35
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:45'
    duration: 45
  - title: Associative Data Structures
    description: 'We have two main associative data structures in Elixir: **keyword
      lists** and **maps**. Let''s learn more about them!'
    item_type: lecture
    start_time: '14:00'
    duration: 30
  - title: 'EXERCISE: Projectile Motion'
    description: We'll create a simple program that calculates and object's projectile
      motion, given a launch angle and initial velocity
    item_type: exercise
    start_time: '11:15'
    duration: 30
  - title: 'EXERCISE: String Acrobatics'
    description: We've got a bunch of functions that do various things to strings,
      but our tests are failing.
    item_type: exercise
    start_time: '11:45'
    duration: 25
  - title: Math & Strings
    description: "There's no getting away from these kinds of things. Eventually you're
      going to need to work with numbers and text, so we'll start with a crash course
      in some core APIs (including a dip in the erlang pool) that will make life easy.
      \n\nThere's a lot of capability here, but we'll stay close to the commonly-useful
      and pragmatic path."
    item_type: lecture
    start_time: '10:45'
    duration: 30
- title: Writing Modular Programs
  description: Elixirs module system allows us to define layers of related functions.
    In this part of the course, we'll explore the concepts of modules, and the ability
    to reference code in one module from another.
  duration: 90
  agenda_items:
  - title: Basic Metaprogramming
    description: 'While the `use` macro is not strictly a directive, it''s of particular
      importance when considering "mixins" for common functionaliy across multiple
      modules.

'
    item_type: lecture
    start_time: '9:35'
    duration: 25
  - title: Modules & Three Important Directives
    description: Modules are just a group of several functions, some of which may
      be private and some of which may be public. Modules give us the ability to define
      named functions using the `def` macro, which offer a few other features that
      were unavailable in the world of anonymous functions
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: 'EXERCISE: Mission Control'
    description: 'We''ve got a set of tests for a couple of Elixir modules that are
      used to control a space ship. Alter the code to make the unit tests pass, and
      ensure that you''ve kept as much of each module''s internal functionality private
      as possible.

'
    item_type: exercise
    start_time: '9:15'
    duration: 20
  - title: 'EXERCISE: Extending a module'
    description: 'The `use` macro can essentially be used to decorate a module with
      some code from another '
    item_type: exercise
    start_time: '10:00'
    duration: 30
- title: Working With Data Structures
  description: 'Earlier we outlined and worked with several different types of data
    structures. Let''s take a closer look at some ways

'
  duration: 135
  agenda_items:
  - title: 'EXERCISE: Map, Filter, Reduce'
    description: We have a program that starts with a list of objects read from a
      file. Using the built-in functions available in the `Enum` and `Map` modules,
      filter out "inactive" items (objects where the "active" attribute is not `true`),
      and then log a list of object names to the console.
    item_type: exercise
    start_time: '10:30'
    duration: 30
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:00'
    duration: 45
  - title: 'EXERCISE: Comprehensions'
    description: Take another pass at the previous exercise, and use a comprehension
      to devise a concise solution.
    item_type: exercise
    start_time: '11:30'
    duration: 30
  - title: Taming List Enumeration with Comprehensions
    description: Often we find ourselves looping over something enumerable, mapping
      values into another list, and potentially filtering out some unwanted items.
      **Comprehensions use a generator and a filter** to provide some excellent syntactic
      sugar for this kind of task.
    item_type: lecture
    start_time: '11:00'
    duration: 30
- title: Request, Response
  description: A Phoenix app can basically be boiled down to a function that receives
    a HTTP request, and returns a response. We'll begin with this premise, and start
    to understand the important parts involved in this process.
  duration: 195
  agenda_items:
  - title: 'EXERCISE: Assigns & Functional Views'
    description: 'We''ll pass some data from the Phoenix controller layer to the view
      layer, and leverage view functions to do some light formatting & massaging. '
    item_type: exercise
    start_time: '15:30'
    duration: 30
  - title: Views & Templates
    description: "In a welcome contrast to other web frameworks, Phoenix's view layer
      is exceedingly easy to understand and use. \n\nJudging by how easy it is to
      keep views simple, performant, and easy to manage, It's clear that the hard-learned
      lessons from older frameworks have paid off."
    item_type: lecture
    start_time: '15:00'
    duration: 30
  - title: The Controller Responds
    description: 'Now that we understand how to leverage Phoenix''s routing layer,
      let''s take a closer look at Controllers: the modules ultimately responsible
      for responding to a request.'
    item_type: lecture
    start_time: '14:30'
    duration: 30
  - title: Plugs & Pipelines
    description: |-
      Plugs are at the core of Phoenix, and they're a relatively simple and approachable concept: things that accept a connection as an argument, and return a slightly-modified connection.

      Chain a few plugs together, and it's easy to see how basic building blocks start to assemble into a complete application.
    item_type: lecture
    start_time: '13:10'
    duration: 30
  - title: 'EXERCISE: Hating on a Content-Type'
    description: 'Build a Plug that interrupts the pipeline (returning a HTTP error
      for an incoming request) if we ever request a SOAP XML document (`Content-Type:
      application/soap+xml`)'
    item_type: exercise
    start_time: '14:00'
    duration: 30
  - title: 'EXERCISE: Routing to the Pages controller'
    description: Add a new page to your app, following the existing example set up
      in your PageController
    item_type: exercise
    start_time: '13:40'
    duration: 20
  - title: Endpoint & Routing
    description: "**Requests enter your app through an Endpoint**, and your app usually
      will have only one. We'll look at this chain of **Elixir Plugs**, which ends
      at the Router, the module ultimately responsible for delegating request-handling
      to an appropriate Controller."
    item_type: lecture
    start_time: '12:45'
    duration: 25
- title: Testing
  description: "Testing ergonomics is perhaps the most impactful factor in determining
    whether writing tests is an enjoyable part of day-to-day development, or an annoying
    slog that's neglected until problems arise. \n\nIn this area, Phoenix does not
    disappoint. We'll focus on several useful patterns for unit and acceptance testing,
    with the aim of making tests quick, easy, maintainable and intuitive. "
  duration: 60
  agenda_items:
  - title: Controller and View Tests
    description: Sometimes we use Phoenix to render HTML, so we'll look at how we
      can verify that both our controller and view layers (individually) are doing
      their job.
    item_type: lecture
    start_time: '16:00'
    duration: 30
  - title: JSON API Tests
    description: Often we use Phoenix Controllers to render JSON. We'll explore some
      built-in helpers that are well-suited for helping us write tests verifying that
      the JSON contains what we expect, and touch on a few libraries that make this
      even easier!
    item_type: lecture
    start_time: '16:30'
    duration: 30
- title: Managing Data
  description: |-
    Data is an integral part of virtually any web application, and a great persistence library make a huge difference in performance and maintainability.

    Thankfully, the Elixir ecosystem has us covered in spades. Ecto is a thin layer of functions that allow us to build composable queries, validate fields, and seamlessly transform records between our DB and application representations.
  duration: 225
  agenda_items:
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:00'
    duration: 45
  - title: 'EXERCISE: Query Olympics'
    description: You'll be given a list of database queries for you and your classmates
      to make using Ecto. Each query is worth a certain number of points. Highest
      number of points after the exercise is done, wins!
    item_type: exercise
    start_time: '11:15'
    duration: 45
  - title: Quick Queries
    description: While we could use SQL syntax to retrieve records from our database,
      doing so would open us up to a world of pain. Ecto provides an approachable
      and composable way of building queries, while stopping short of doing us any
      "automatic favors" (i.e., N+1 queries) that so often degrade performance.
    item_type: lecture
    start_time: '10:45'
    duration: 30
  - title: Managing Migrations
    description: |-
      If you've never used code to manage changes to your database schema, you're missing out. Migrations allow us to change our schema in (ideally) reversible steps, so we can apply and un-apply a set of changes while building features.
      Even if you've seen migrations before, there are some useful things to know about how they work with Ecto, and in particular, Postgres. We'll look, specifically at:
      - Postgres array and jsonb column types
      - Changing column types, while remaining backwards compatible
    item_type: lecture
    start_time: '9:20'
    duration: 25
  - title: 'EXERCISE: Models & Validation'
    description: Create models and appropriate validations for a blog post/comment
      app.
    item_type: exercise
    start_time: '10:15'
    duration: 30
  - title: Intro to Ecto
    description: "Heavy persistence libraries like ActiveRecord offer convenience,
      but often become performance bottlenecks. We could make every DB query explicitly,
      but then we're trading in all of our ergonomics for performance.\n\nEcto manages
      to strike an enjoyable balance, where we are asked to be deliberate about the
      records we fetch from a database but (most of the time) aren't dragged into
      the world of writing SQL queries explicitly.\n\nYou'll be amazed at how much
      we can do with just simple functions, and will never look at other persistence
      frameworks quite the same way again. "
    item_type: lecture
    start_time: '9:00'
    duration: 20
  - title: Cracking Changesets
    description: "This is one of my favorite parts about Ecto, and one of the parts
      you'll be most often working with. In contrast to other persistence libraries,
      **the concept of the shape of a record (schema) and the logic for checking the
      validity of values (validations)  are decoupled**.  There are some incredibly
      exciting consequences of this design decision.\n\nEcto ships with a bunch of
      validations, and because it's so quick and easy, we'll write a few of our own. "
    item_type: lecture
    start_time: '9:45'
    duration: 30
- title: Real Time
  description: One of the places where Elixir and Phoenix leave the competition in
    the dust is support for soft real time programming. The ability to keep a lightweight
    Elixir process running for the duration of a user's time in our app, and holding
    some small amount of state, makes things far simpler for certain things than it
    otherwise would be.
  duration: 105
  agenda_items:
  - title: Managing Channel Complexity
    description: 'While you may have contributed to a REST API project that had 10
      endpoints (each handling 1-4 HTTP verbs), it''s less likely that you have experience
      working with a long-lived web socket connection operating on the same scale
      of complexity.  It''s important to remember that this is API surface, and **because
      it''s often stateful instead of stateless, keeping organized is even more important**. '
    item_type: lecture
    start_time: '14:00'
    duration: 30
  - title: 'EXERCISE: My First Channel'
    description: Build your first channel, so that you can notify client-side apps
      of new comments being posted to articles.
    item_type: exercise
    start_time: '13:30'
    duration: 30
  - title: Channel Basics
    description: "Phoenix Channels are a first class citizen in the framework, on
      equal footing with Controllers. It shows! You'll be amazed at how easy it is
      to start adding real-time features to your apps, where we push data from server
      to client.\n\nDevelopment best practices are increasingly moving in a functional
      and \"stateless\" direction, but Elixir Processes are a place where small pieces
      of state can be safely held and used. We'll explore how powerful this idea is,
      in the context of Phoenix channels. "
    item_type: lecture
    start_time: '12:45'
    duration: 45
- title: Users & Authentication
  description: |-
    Nearly every app we build these days requires some sort of authentication, and probably a user account to go along with it.  Even if your app is an oddball and doesn't need this, user accounts provide us with a well-understood set of use cases that will serve as an excellent case study.

    Let's put some of our newfound Phoenix knowledge into practice as we implement a secure user account feature set. The goal will be to reduce explicit management of authorization & authentication on a per-resource basis as much as possible.
  duration: 150
  agenda_items:
  - title: Wrap Up & Goodbye
    description: We'll recap everything we've learned
    item_type: lecture
    start_time: '16:45'
    duration: 15
  - title: 'EXERCISE: Roles'
    description: We often have a concept of roles (or an equivalent concept masquerading
      as other flags/fields) built on top of our authentication. We'll add roles to
      our JWT, and design a plug that will raise an error if a user attempts to access
      a controller action without having the required roles.
    item_type: exercise
    start_time: '16:00'
    duration: 45
  - title: 'EXERCISE: Registration'
    description: "Creating new users will serve to highlight a few concepts at the
      model layer \n* Server-side validation, including writing our own validator\n*
      Safely handling passwords\n* Keeping slightly different changeset-generating
      functions organized\n\nWe'll also have an opportunity to start defining routes
      that require a user to be authenticated, and routes that don't."
    item_type: exercise
    start_time: '14:30'
    duration: 45
  - title: 'EXERCISE: Login & Logout'
    description: |-
      For our purposes, we'll use a JSON Web Token (JWT) and the OAuth 2 password grant standard, as a mechanism and vehicle for authentication. You will be provided with a client-side app that will talk to our Phoenix, via JSON.

      We'll validate a user's credentials in a way that's not incredibly sensitive to timing or brute force attacks, and then assemble our little piece of session state (the JWT) before encrypting it and handing it back to the client.
    item_type: exercise
    start_time: '15:15'
    duration: 45
---
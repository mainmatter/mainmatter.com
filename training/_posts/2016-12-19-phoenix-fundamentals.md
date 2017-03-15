---
layout: workshop
title: Phoenix Fundamentals
permalink: "/training/2016-12-19-phoenix-fundamentals"
category: Back End Development
description: |-
  Phoenix makes building robust, high-performance web applications easier and more fun than you ever thought possible.

  Combining popular conventions formed in popular projects like Ruby on Rails with the robustness of Elixir and the BEAM make it an excellent choice for a broad range of applications.
image: "/images/training/2016-12-19-phoenix-fundamentals.png"
stages:
- title: Request, Response
  description: A Phoenix app can basically be boiled down to a function that receives
    a HTTP request, and returns a response. We'll begin with this premise, and start
    to understand the important parts involved in this process.
  duration: 300
  agenda_items:
  - title: Welcome & Setup
    description: We'll set our sights on some specific goals for our Phoenix learning
      adventure, and ensure that everyone has what they need to get the most out of
      the training.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Endpoint & Routing
    description: "**Requests enter your app through an Endpoint**, which your app
      usually have just one. We'll look at this chain of **Elixir Plugs**, which ends
      at the **Router**, the module ultimately responsible for delegating request-handling
      to an appropriate **Controller**."
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: Plugs & Pipelines
    description: |-
      **Plugs** are at the core of Phoenix and a relatively simple concept: plugs accept a connection as an argument, and return a slightly-modified connection.

      Once we chain a few plugs together, it's easy to see how basic building blocks assemble into a complete application.
    item_type: lecture
    start_time: '9:45'
    duration: 30
  - title: 'EXERCISE: Routing to the Pages controller'
    description: Your new Phoenix project comes with a `PagesController` that renders
      a landing page you can see at [localhost:4000](http://localhost:4000). See if
      you can infer from how files are organized in the templates folder, how you
      can make a static HTML page reachable at ` [localhost:4000/my_page](http://localhost:4000/my_page).
    item_type: exercise
    start_time: '10:15'
    duration: 15
  - title: 'EXERCISE: Hating on a Content-Type'
    description: |
      Apparently SOAP is out of style. Let's return a discriminatory error message if we receive any request that has a SOAP content type.

      `SOAP is for washing up, not for APIs.`

      Build a Plug that interrupts the pipeline (returning a HTTP error for an incoming request) if we ever receive a request for a SOAP XML document (`Content-Type: application/soap+xml`)
    item_type: exercise
    start_time: '10:30'
    duration: 30
  - title: The Controller Responds
    description: Now that we understand how to leverage Phoenix's routing layer, let's
      take a closer look at **Controllers** -- the modules ultimately responsible
      for responding to a request.
    item_type: lecture
    start_time: '11:00'
    duration: 30
  - title: 'EXERCISE: Marco, Polo'
    description: |-
      In the PagesController, create a new action that returns a welcome message for a name. The router should delegate responsibility to this action for GET requests to `http://localhost:4000/welcome_me/<name>`  and `http://localhost:4000/welcome_me?name=<name>`.

      If the `Accept` header for the incoming request indicates that the client wants HTML, they should receive a reasonable HTML response, otherwise, they should receive JSON.
    item_type: exercise
    start_time: '11:30'
    duration: 30
  - title: Views & Templates
    description: "In contrast to other web frameworks, Phoenix's view layer is exceedingly
      easy to understand and use. \nJudging by how easy it is to keep views simple,
      performant, and easy to manage, It's clear that the hard-learned lessons from
      older frameworks have paid off."
    item_type: lecture
    start_time: '12:00'
    duration: 30
  - title: 'EXERCISE: Revise our HTML response'
    description: 'Let''s revise our previous approach to HTML rendering for our welcome
      endpoints, so that they take advantage of Phoenix''s view layer. Make sure to
      use **assigns** to make values available to views. '
    item_type: exercise
    start_time: '12:30'
    duration: 30
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '13:00'
    duration: 60
- title: Managing Data
  description: |-
    Data is an integral part of virtually any web application, and a great persistence library make a huge difference in performance and maintainability.

    **Thankfully, the Elixir ecosystem has us covered in spades.** Ecto is a thin layer of functions that allow us to build composable queries, validate fields, and seamlessly transform records between our DB and application representations.
  duration: 180
  agenda_items:
  - title: Intro to Ecto
    description: "Heavy persistence libraries like **ActiveRecord** offer convenience,
      but often become performance bottlenecks. We could make every DB query explicitly,
      but then we're trading in all of our ergonomics for performance.\n\n**Ecto**
      manages to strike an enjoyable balance, where we are asked to be deliberate
      about the records we fetch from a database but (most of the time) aren't dragged
      into the world of writing SQL queries explicitly.\n\nYou'll be amazed at how
      much we can do with just simple functions, and will never look at other persistence
      frameworks quite the same way again. "
    item_type: lecture
    start_time: '14:00'
    duration: 20
  - title: Schema & Managing Migrations
    description: |-
      If you've never used code to manage changes to your database schema, you're missing out. Migrations allow us to change our schema in (ideally) reversible steps, so we can apply and un-apply a set of changes while building features.

      Even if you've seen migrations before, there are some useful things to know about how they work with **Ecto**, and in particular, **Postgres**. We'll look specifically at:
      * Postgres array and jsonb column types
      * Changing column types, while remaining backwards compatible
    item_type: lecture
    start_time: '14:20'
    duration: 40
  - title: 'EXERCISE: Ecto Models'
    description: Make Ecto models to match the provided specifications (and successive
      changes to specifications). Ensure all of your DB migrations are reversible,
      and backwards compatible.
    item_type: exercise
    start_time: '15:00'
    duration: 30
  - title: Cracking Changesets
    description: "This is one of my favorite parts about Ecto, and one of the parts
      you'll be most often working with. In contrast to other persistence libraries,
      **the concept of the shape of a record (schema) and the logic for checking the
      validity of values (validations)  are decoupled**.  There are some incredibly
      exciting consequences of this design decision.\n\nEcto ships with a bunch of
      validations, and because it's so quick and easy, we'll write a few of our own. "
    item_type: lecture
    start_time: '15:30'
    duration: 45
  - title: 'EXERCISE: Validating for Password Complexity'
    description: |-
      Create a new field on our User model that validates the password field, ensuring that:
      * it's not empty
      * it has a minimum length of 8 characters
      * it includes an upper-case letter, symbol, lower case letter, and a number
      * it doesn't include more than two successive letters or numbers like `abc` or `123`

      Failing any of this validation should be met with an appropriately descriptive error message.
    item_type: exercise
    start_time: '16:15'
    duration: 30
  - title: Recap & Wrap Up
    description: We'll recap the topics we've covered today, answer any remaining
      questions, and preview the topics we'll cover tomorrow.
    item_type: lecture
    start_time: '16:45'
    duration: 15
- title: Testing
  description: "Testing ergonomics is perhaps the most impactful factor in determining
    whether writing tests is an enjoyable part of day-to-day development, or an annoying
    slog that's neglected until problems arise. \n\nIn this area, Phoenix does not
    disappoint. We'll focus on several useful patterns for unit and acceptance testing,
    with the aim of making tests quick, easy, maintainiable and intuitive. \n"
  duration: 155
  agenda_items:
  - title: Welcome Back
    description: One more recap of what we learned yesterday, to get those fresh in
      everyone's minds again, and a quick agenda of what we plan to do today.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Model Tests
    description: |-
      When working with Ecto, you may notice that your model layer is much thinner than what you're used to.  Particularly if you've never used a functional language to build web applications, you may have to get used to your **models being a collection of functions, rather than a factory for "record objects"**.
      We'll learn about **ExUnit**, the unit testing library that Phoenix ships with, and focus on a few common model testing needs:

      * Functions that return changesets
      * Validations that are run on said changesets
      * Special types of fields (i.e., virtual fields, fields with default values)
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: 'EXERCISE: User Model Tests'
    description: Write some user model tests, and most importantly, build tests around
      our password validation logic from yesterday.
    item_type: exercise
    start_time: '9:45'
    duration: 30
  - title: Controller & View Tests
    description: Sometimes we use Phoenix to render HTML, so we'll look at how we
      can verify that both our controller and view layers (individually) are doing
      their job. Together, we'll write some unit tests for the "welcome" pages we
      made yesterday.
    item_type: lecture
    start_time: '10:15'
    duration: 30
  - title: JSON API Tests
    description: 'Often we use Phoenix Controllers to render JSON. We''ll explore
      some built-in helpers that are well-suited for helping us write tests verifying
      that the JSON contains what we expect, and touch on a few libraries that make
      this even easier!

'
    item_type: lecture
    start_time: '10:45'
    duration: 20
  - title: 'EXERCISE: JSON Tests'
    description: |-
      1. Build some tests around the `StatusController`s JSON endpoints, protecting it from regression
      2. Build a test asserting that our anti-SOAP Plug works as intended
    item_type: exercise
    start_time: '11:05'
    duration: 30
- title: Real Time
  description: "**One of the places where Elixir and Phoenix leave the competition
    in the dust is support for soft real time programming.** The ability to keep a
    lightweight Elixir process running for the duration of a user's time in our app,
    and holding some small amount of state, makes our world far simpler for certain
    things than it otherwise would be."
  duration: 150
  agenda_items:
  - title: Channel Basics
    description: "Phoenix Channels are a first class citizen in the framework, on
      equal footing with Controllers. It shows! You'll be amazed at how easy it is
      to start adding real-time features to your apps, where we push data from server
      to client.\n\nDevelopment best practices are increasingly moving in a functional
      and \"stateless\" direction, but Elixir Processes are a place where small pieces
      of state can be safely held and used. We'll explore how powerful this idea is,
      in the context of Phoenix channels. "
    item_type: lecture
    start_time: '11:35'
    duration: 35
  - title: Managing Channel Complexity
    description: 'While you may have contributed to a REST API project that had 10
      endpoints (each handling 1-4 HTTP verbs), it''s less likely that you have experience
      working with a long-lived web socket connection operating on the same scale
      of complexity.  It''s important to remember that this is API surface, and **because
      it''s often stateful instead of stateless, keeping organized is even more important**. '
    item_type: lecture
    start_time: '12:10'
    duration: 30
  - title: 'EXERCISE: Push Notifications'
    description: We have a need to instruct consumers of our API to render a notification
      on their screen. Broadcast a notification object to all users subscribed to
      the `notifications:all` channel, consisting of a **type** and a **body**.
    item_type: exercise
    start_time: '12:40'
    duration: 35
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '13:15'
    duration: 50
- title: Users & Authentication
  description: |-
    Nearly every app we build these days requires some sort of authentication, and probably a user account to go along with it.  Even if your app is an oddball and doesn't need this, user accounts provide us with a well-understood set of use cases that will serve as an excellent case study.

    **Let's put some of our newfound Phoenix knowledge into practice as we implement a secure user account feature set.** The goal will be to reduce explicit management of authorization & authentication on a per-resource basis as much as possible.
  duration: 165
  agenda_items:
  - title: 'EXERCISE: User Registration'
    description: "Creating new users will serve to highlight a few concepts at the
      model layer \n\n* Server-side validation, including writing our own validator\n*
      Safely handling passwords\n* Keeping slightly different changeset-generating
      functions organized\n\nWe'll also have an opportunity to start defining routes
      that require a user to be authenticated, and routes that don't."
    item_type: exercise
    start_time: '14:05'
    duration: 55
  - title: 'EXERCISE: Login/Logout'
    description: |
      For our purposes, we'll use a JSON Web Token (JWT) and the OAuth 2 password grant standard, as a mechanism and vehicle for authentication. You will be provided with a client-side app that will talk to our Phoenix, via JSON.

      We'll validate a user's credentials in a way that's not incredibly sensitive to timing or brute force attacks, and then assemble our little piece of session state (the JWT) before encrypting it and handing it back to the client.
    item_type: exercise
    start_time: '15:00'
    duration: 45
  - title: 'Exercise: User Roles'
    description: We often have a concept of roles (or an equivalent concept masquerading
      as other flags/fields) built on top of our authentication. We'll add roles to
      our JWT, and design a plug that will raise an error if a user attempts to access
      a controller action without having the required roles.
    item_type: exercise
    start_time: '15:45'
    duration: 45
  - title: Wrap Up & Recap
    description: We'll recap everything we've covered in this training, and finish
      by providing a rich set of resources for further learning.
    item_type: lecture
    start_time: '16:30'
    duration: 20
---
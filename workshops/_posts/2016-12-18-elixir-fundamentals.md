---
layout: workshop
title: Elixir Fundamentals
permalink: "/workshops/2016-12-18-elixir-fundamentals"
category: Back End Development
description: |-
  Elixir's combination of modern language features, and a 30-year-old battle-tested foundation at its core, has made it increasingly popular over the past year.

  This course provides a strong foundation for writing general-purpose functional code, and is intended for developers already proficient in another language.
stages:
- title: Liftoff
  description: 'Elixir is in a fairly unique position as a programming language, in
    that it combines contemporary language features and excellent developer ergonomics
    with the established and battle-tested Erlang ecosystem. '
  duration: 120
  agenda_items:
  - title: Origins, Foundations & Core Principles
    description: 'When setting off to learn a new programming language, it''s often
      incredibly useful to understand the language''s foundations. In this case, we''re
      dealing with a language built on top of another language, which runs on a virtual
      machine that supports other languages

'
    item_type: lecture
    start_time: '9:00'
    duration: 30
  - title: Interactive Elixir
    description: |-
      **Elixir's interactive shell (IEx)** is one of the most powerful tools in your toolbox. We'll outline some of the most useful features for beginners, including:
      - Running scripts
      - Getting metadata about a value
      - Accessing embedded documentation
      - Inspecting the state of a particular process
    item_type: lecture
    start_time: '9:30'
    duration: 30
  - title: IO & Files
    description: As with most programming languages, it's useful to know how to interact
      with files and humans. We'll take care of this early on, and notice a few things
      that foreshadow some interesting aspects of Elixir's concurrency model.
    item_type: lecture
    start_time: '10:00'
    duration: 30
  - title: 'EXERCISE: Reading a CSV File'
    description: We're going to have to take a few things for granted, since we're
      just starting out, but let's use some existing well-documented code to read
      a CSV file into memory, and print some information about it to the console.
    item_type: exercise
    start_time: '10:30'
    duration: 30
- title: Types, Operators & Control Flow
  description: 'Our journey starts with basic types and procedural logic. Even if
    you''re experienced in a wide range of programming languages, there''s going to
    be a lot of stuff -- even at this basic level -- that may change the way you look
    at writing code forever.

'
  duration: 400
  agenda_items:
  - title: Math & Strings
    description: "There's no getting away from these kinds of things. Eventually you're
      going to need to work with numbers and text, so we'll start with a crash course
      in some core APIs (including a dip in the Erlang pool) that will make life easy.
      \n\nThere's a lot of capability here, but we'll stay close to the commonly-useful
      and pragmatic path."
    item_type: lecture
    start_time: '11:00'
    duration: 45
  - title: 'EXERCISE: Projectile Motion'
    description: We'll create a simple program that calculates an object's projectile
      motion, given a launch angle and initial velocity.
    item_type: exercise
    start_time: '11:45'
    duration: 30
  - title: 'EXERCISE: String Acrobatics'
    description: We've got a bunch of functions that do various things to string values,
      but our tests are failing. Let's fix that!
    item_type: exercise
    start_time: '12:15'
    duration: 30
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:45'
    duration: 45
  - title: Functions
    description: It stands to reason that functions are really important in a functional
      programming language. We'll build and work with named and anonymous functions,
      combine functions together to form pipelines, and even map out some higher-order
      functions of our own.
    item_type: lecture
    start_time: '13:30'
    duration: 45
  - title: Tuples & Lists
    description: Often times we find ourselves needing to work with several objects
      in a "collection", and will need to choose between Elixir's **List** and **Tuple**
      types. We'll compare and contrast tuples and lists, and write a few programs
      highlighting the benefits of each.
    item_type: lecture
    start_time: '14:15'
    duration: 30
  - title: 'EXERCISE: Fibonacci Pyramid'
    description: |-
      Using our knowledge of functions and recursion in Elixir, let's build a function that writes a Fibonacci pyramid to the console.

      ![Fibonacci Numbers](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/PascalTriangleFibanacci.svg/720px-PascalTriangleFibanacci.svg.png)

      20 levels deep!
    item_type: exercise
    start_time: '14:45'
    duration: 30
  - title: Associative Data Structures
    description: 'We have two main associative data structures in Elixir: **keyword
      lists** and **maps**. Let''s learn more about them!'
    item_type: lecture
    start_time: '15:15'
    duration: 20
  - title: 'EXERCISE: Building up a List'
    description: Assembling a bunch of items in a list is really fast, as long as
      we do it in a way that doesn't involve moving existing items around in memory.
      We'll write two programs, one which assembles a bunch of dictionary words into
      a tuple, and another that uses a list instead.
    item_type: exercise
    start_time: '15:35'
    duration: 25
  - title: Pattern Matching & Guards
    description: 'This modern language feature allows **destructed assignment**, and
      is often used to define several variants of a function, each to handle a specific
      scenario. This application of pattern matching reduces what would otherwise
      be a lot of internal function complexity by huge amounts.

'
    item_type: lecture
    start_time: '16:00'
    duration: 30
  - title: 'EXERCISE: Function Refactoring'
    description: We've got an Elixir module that involves some code that could benefit
      from some pattern matching magic. Refactor the monolith function so all use
      of if/else are replaced by creating new functions oriented toward handling that
      specific pattern of arguments.
    item_type: exercise
    start_time: '16:30'
    duration: 30
  - title: 'EXERCISE: A world without if/else'
    description: |-
      You'll be given an Elixir module that's currently a little messy and confusing. Untangle it by replacing all of the if/else logic with `cond` statements, `case`.statements and by applying pattern matching in function clauses.

      Remember: your goal is to make your code as easy to read and maintain as possible: be clever, but not confusing.
    item_type: exercise
    start_time: '17:00'
    duration: 30
  - title: Recap & Wrap Up
    description: We'll go over everything we've covered today, and connect them back
      to the big picture. This is a great time for Q&A that's broader than the specific
      topics we've covered so far.
    item_type: lecture
    start_time: '17:30'
    duration: 15
- title: Writing Modular Programs
  description: Elixir's module system allows us to define layers of related functions.
    In this part of the course, we'll explore the concepts of modules, and the ability
    to reference code in one module from another.
  duration: 240
  agenda_items:
  - title: Welcome Back
    description: We'll recap the ground we covered in day 1 of this training, so it's
      fresh in your mind, as we continue building up toward Elixir proficiency!
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Modules & Three Important Directives
    description: 'Modules are just a group of several functions, some of which may
      be private and some of which may be public. Modules give us the ability to define
      named functions using the `def` macro, which offer a few other features that
      were unavailable in the world of anonymous functions.

'
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: 'EXERCISE: Mission Control'
    description: We've got a set of tests for a couple of Elixir modules that are
      used to control a space ship. Alter the code to make the unit tests pass, and
      ensure that you've kept as much of each module's internal functionality private
      as possible.
    item_type: exercise
    start_time: '9:45'
    duration: 30
  - title: Basic Metaprogramming
    description: 'While the `use` macro is not strictly a directive, it''s of particular
      importance when considering "mixins" for common functionality, shared across
      multiple concrete modules.

'
    item_type: lecture
    start_time: '10:15'
    duration: 30
  - title: 'EXERCISE: Extending a Module'
    description: 'The `use` macro can essentially be used to decorate a module with
      some code from another module.

'
    item_type: exercise
    start_time: '10:45'
    duration: 30
  - title: Protocols & Behaviors
    description: |-
      Protocols are a mechanism for **polymorphism in Elixir**, where an implementation of a certain contract is defined on a per-type basis. In other languages, this contract would be called an interface (Java), or a pure abstract class (C++)

      Under the hood, part of how this works is by way of a **Behavior**: a definition of a set of functions that modules who adopt this behavior must implement.
    item_type: lecture
    start_time: '11:15'
    duration: 45
  - title: 'EXERCISE: Serializer Protocol'
    description: 'Given a list of values, we want to be able to generate a string
      representation, either in CSV or JSON array format. Design a protocol, and adopt
      that behavior in each of two modules: `CSVSerializer` and `JSONSerializer`.'
    item_type: exercise
    start_time: '12:00'
    duration: 30
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:30'
    duration: 60
- title: Working With Data Structures
  description: Earlier we outlined and worked with several different types of data
    structures. Let's take a closer look at some of these methods.
  duration: 210
  agenda_items:
  - title: Enum & Map
    description: We've learned about how to create and work with **list** and **map**
      literals in very basic ways. Let's take a look into some of the tooling that
      Elixir provides as core language features, for working with these data structures.
    item_type: lecture
    start_time: '13:30'
    duration: 45
  - title: 'EXERCISE: Map, Filter, Reduce'
    description: We have a program that starts with a list of objects read from a
      file. Using the built-in functions available in the `Enum` and `Map` modules,
      filter out "inactive" items (objects where the "active" attribute is not `true`),
      and then log a list of object names to the console.
    item_type: exercise
    start_time: '14:15'
    duration: 30
  - title: Taming List Enumeration with Comprehensions
    description: 'Often we find ourselves looping over something enumerable; mapping
      values into another list; and potentially filtering out some unwanted items.
      **Comprehensions use a generator and a filter** to provide some excellent syntactic
      sugar for this kind of task.

'
    item_type: lecture
    start_time: '14:45'
    duration: 30
  - title: 'EXERCISE: Comprehensions'
    description: Take another pass at the previous exercise, and use a comprehension
      to devise a concise solution.
    item_type: exercise
    start_time: '15:15'
    duration: 30
  - title: Lazy Operations with Streams
    description: 'Elixir''s `Stream` module offers some of the same capabilities that
      we enjoy in the `Enum` module, but when working with Streams, computations are
      performed lazily. This is particularly useful for dealing with huge (or infinitely
      huge) collections.

'
    item_type: lecture
    start_time: '15:45'
    duration: 30
  - title: 'EXERCISE: Skimming a good book'
    description: 'Given the entire text of the book ~Gulliver''s Travels~, find the
      highest- Scrabble-scoring word within the first 1000 lines.

'
    item_type: exercise
    start_time: '16:15'
    duration: 30
  - title: Recap & Wrap Up
    description: We'll round out the course by recapping everything we've learned,
      and finish with some tips for next steps in your mission to become an ace Elixir
      developer!
    item_type: lecture
    start_time: '16:45'
    duration: 15
---
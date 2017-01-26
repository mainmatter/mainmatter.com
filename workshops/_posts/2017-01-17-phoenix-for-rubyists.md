---
layout: workshop
title: Phoenix for Rubyists
permalink: "/workshops/2017-01-17-phoenix-for-rubyists"
category: Back End Development
description: Phoenix Framework draws heavily upon important foundations in the opinionated
  web frameworks that came before it, like Ruby on Rails.
stages:
- title: Writing Modular Programs
  description: Elixirs module system allows us to define layers of related functions.
    In this part of the course, we'll explore the concepts of modules, and the ability
    to reference code in one module from another.
  duration: 90
- title: The First Sip
  description: Before we jump right into the framework, we need to at least know the
    basics of the programming language we're working with.
  duration: 80
- title: Managing Data
  description: |-
    Data is an integral part of virtually any web application, and a great persistence library make a huge difference in performance and maintainability.

    Thankfully, the Elixir ecosystem has us covered in spades. Ecto is a thin layer of functions that allow us to build composable queries, validate fields, and seamlessly transform records between our DB and application representations.
  duration: 225
- title: Users & Authentication
  description: |-
    Nearly every app we build these days requires some sort of authentication, and probably a user account to go along with it.  Even if your app is an oddball and doesn't need this, user accounts provide us with a well-understood set of use cases that will serve as an excellent case study.

    Let's put some of our newfound Phoenix knowledge into practice as we implement a secure user account feature set. The goal will be to reduce explicit management of authorization & authentication on a per-resource basis as much as possible.
  duration: 150
- title: Types, Operators & Control Flow
  description: One must crawl before one walks, and it all starts with basic types
    and procedural logic. Even if you're experienced in a wide range of programming
    languages, there's going to be a lot of stuff -- even at this basic level -- that
    may change the way you look at writing code forever.
  duration: 360
- title: Request, Response
  description: A Phoenix app can basically be boiled down to a function that receives
    a HTTP request, and returns a response. We'll begin with this premise, and start
    to understand the important parts involved in this process.
  duration: 195
- title: Working With Data Structures
  description: 'Earlier we outlined and worked with several different types of data
    structures. Let''s take a closer look at some ways

'
  duration: 135
- title: Testing
  description: "Testing ergonomics is perhaps the most impactful factor in determining
    whether writing tests is an enjoyable part of day-to-day development, or an annoying
    slog that's neglected until problems arise. \n\nIn this area, Phoenix does not
    disappoint. We'll focus on several useful patterns for unit and acceptance testing,
    with the aim of making tests quick, easy, maintainable and intuitive. "
  duration: 60
- title: Real Time
  description: One of the places where Elixir and Phoenix leave the competition in
    the dust is support for soft real time programming. The ability to keep a lightweight
    Elixir process running for the duration of a user's time in our app, and holding
    some small amount of state, makes things far simpler for certain things than it
    otherwise would be.
  duration: 105
---
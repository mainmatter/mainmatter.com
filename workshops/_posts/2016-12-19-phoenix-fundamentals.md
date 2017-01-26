---
layout: workshop
title: Phoenix Fundamentals
permalink: "/workshops/2016-12-19-phoenix-fundamentals"
category: Back End Development
description: |-
  Phoenix makes building robust, high-performance web applications easier and more fun than you ever thought possible.

  Combining popular conventions formed in popular projects like Ruby on Rails with the robustness of Elixir and the BEAM make it an excellent choice for a broad range of applications.
stages:
- title: Managing Data
  description: |-
    Data is an integral part of virtually any web application, and a great persistence library make a huge difference in performance and maintainability.

    **Thankfully, the Elixir ecosystem has us covered in spades.** Ecto is a thin layer of functions that allow us to build composable queries, validate fields, and seamlessly transform records between our DB and application representations.
  duration: 180
- title: Real Time
  description: "**One of the places where Elixir and Phoenix leave the competition
    in the dust is support for soft real time programming.** The ability to keep a
    lightweight Elixir process running for the duration of a user's time in our app,
    and holding some small amount of state, makes our world far simpler for certain
    things than it otherwise would be."
  duration: 150
- title: Testing
  description: "Testing ergonomics is perhaps the most impactful factor in determining
    whether writing tests is an enjoyable part of day-to-day development, or an annoying
    slog that's neglected until problems arise. \n\nIn this area, Phoenix does not
    disappoint. We'll focus on several useful patterns for unit and acceptance testing,
    with the aim of making tests quick, easy, maintainiable and intuitive. \n"
  duration: 155
- title: Users & Authentication
  description: |-
    Nearly every app we build these days requires some sort of authentication, and probably a user account to go along with it.  Even if your app is an oddball and doesn't need this, user accounts provide us with a well-understood set of use cases that will serve as an excellent case study.

    **Let's put some of our newfound Phoenix knowledge into practice as we implement a secure user account feature set.** The goal will be to reduce explicit management of authorization & authentication on a per-resource basis as much as possible.
  duration: 165
- title: Request, Response
  description: A Phoenix app can basically be boiled down to a function that receives
    a HTTP request, and returns a response. We'll begin with this premise, and start
    to understand the important parts involved in this process.
  duration: 300
---
---
layout: workshop
title: Ember-Data Basics
permalink: "/trainings/2016-12-17-ember-data-basics"
category: Front End Development
description: |-
  Harness the power of the official persistence library of the Ember.js framework.


  We'll cover all of the basics you need to know in order to make ember-data the best part of working with your back end, diving deep into adapters, serializers and the store.
image: "/images/trainings/2016-12-17-ember-data-basics.png"
stages:
- title: JSON-API
  description: "[JSON-API](http://jsonapi.org/) is a spec for JSON contracts between
    APIs and their clients. Because ember-data uses JSON-API by default, and as a
    guide for its internal data structures, it's useful to be familiar with it when
    working with ember-data.\n\n> If you’ve ever argued with your team about the way
    your JSON responses should be formatted, JSON API can be your anti-bikeshedding
    tool.\n\n> By following shared conventions, you can increase productivity, take
    advantage of generalized tooling, and focus on what matters: your application.\n\n>
    Clients built around JSON API are able to take advantage of its features around
    efficiently caching responses, sometimes eliminating network requests entirely.\n\n "
  duration: 60
  agenda_items:
  - title: Basic Objects, Errors and Metadata
    description: We'll work through some examples of how basic objects are defined,
      according to the JSON-API standard.
    item_type: lecture
    start_time: '9:00'
    duration: 30
  - title: Relationships & Compound Documents
    description: |-
      In JSON-API, we can define relationships in multiple ways:
      * Including related records directly in the JSON
      * Providing explicit references for each related record (i.e., a **type and id**)
      * Providing a URL for retrieving related records at a later time

      We'll look at examples for each, and discuss use of the `include` queryParam for requesting inclusion of related records.
    item_type: lecture
    start_time: '9:30'
    duration: 30
- title: Building Requests
  description: Ember-data adapters are responsible for building URLs, and making other
    customizations to outgoing requests. We'll begin by establishing the URL & JSON
    contracts that ember-data has turnkey adapters for, and then explore a wide range
    of customization hooks that you can use to make ember-data work with **your API**.
  duration: 210
  agenda_items:
  - title: Built-in Adapters
    description: |-
      Ember-data ships with three types of adapters:
      * `DS.Adapter`
      * `DS.RESTAdapter`
      * `DS.JSONAPIAdapter`
      and optionally, by way of an [officially-supported addon](https://github.com/ember-data/active-model-adapter)
      * `DS.ActiveModelAdapter`

      We'll look at the kinds of APIs these types of adapters are designed to work with, and the types of functionality they each provide.
    item_type: lecture
    start_time: '10:00'
    duration: 45
  - title: Request Types & Customizing URL Building
    description: |-
      We often need to customize the way URLs are built for creating, updating, deleting or retrieving resources. We'll study **ember-data's 10 request types**, each of which comes with its own url-building customization hook. We'll examine several examples in detail:

      * Building URLs for hierarchical resources
      * Using the ember-data **snapshot API**
      * Moving queryParams to path params

      Finally, we'll look at the caching ramifications of different types of requests, and provide some battle-tested patterns for adapter customization.
    item_type: lecture
    start_time: '10:45'
    duration: 45
  - title: 'Exercise: Building Adapters for Awful APIs'
    description: I've got four apps that will work properly only when the ember-data
      adapter layer is sufficiently customized. Separate into four teams, and each
      team will fix one app using the adapter strategies we've outlined this morning.
      Each group will present their solution(s) to the rest of the group when complete.
    item_type: exercise
    start_time: '11:30'
    duration: 60
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:30'
    duration: 60
- title: Massaging JSON
  description: |-
    Ember-data serializers are the tool for transforming your API's representation of data into what your ember app expects. We'll examine several common use cases for massaging JSON, including:
    * changing the names of properties
    * normalizing property key format
    * synthesizing client-side IDs
  duration: 150
  agenda_items:
  - title: Built-In Serializers
    description: |-
      Ember-data ships with the following types of serializers:
      * `DS.Serializer`
      * `DS.RESTSerializer`
      * `DS.JSONSerializer`
      * `DS.JSONAPISerializer`

      and optionally, by way of an [officially-supported addon](https://github.com/ember-data/active-model-adapter)
      * `DS.ActiveModelSerializer`

      We'll study each of these, and explore the kinds of JSON they're designed to work with.
    item_type: lecture
    start_time: '13:30'
    duration: 45
  - title: Functional JSON Massaging
    description: We rarely have the luxury of working with ideal JSON contracts, and
      often need to write code to transform between our API's representation of a
      record, to our web client's representation. When done haphazardly, this part
      of your app can become a brittle web of spaghetti code. I'll provide some suggestions
      for using easily-testable and re-usable pure functions and JavaScript's built-in
      higher order functions to massage your JSON, leaving it as a well-organized
      and easy-to-understand pipeline of function calls.
    item_type: lecture
    start_time: '14:15'
    duration: 45
  - title: 'Exercise: Building Serializers for Awful JSON'
    description: I've added some new features to the apps we wrote adapters for, earlier
      today. The JSON for these new records doesn't align well with what ember-data
      expects to see by default. Split up into teams, and work together to massage
      this JSON until all tests pass. Each group will present their solution to the
      rest of the workshop.
    item_type: exercise
    start_time: '15:00'
    duration: 60
- title: The Store
  description: 'Ember-data''s store is the main API surface that developers interact
    with, in order to initiate requests for data. '
  duration: 60
  agenda_items:
  - title: Peek, Fetch or Find
    description: We'll explore these three ways of retrieving data from the ember-data's
      store, providing practical real-world use cases for each.
    item_type: lecture
    start_time: '16:00'
    duration: 30
  - title: Fastboot's Shoebox
    description: Ember Fastboot, the framework's server-side rendering technology,
      comes with a feature called the shoebox store whereby JSON data can be embedded
      in the server-rendered HTML, and immediately injected into the client-side ember-data
      store upon app boot. We'll study low-level use of the shoebox directly, and
      then introduce an addon that automates shoebox/ember-data integration.
    item_type: lecture
    start_time: '16:30'
    duration: 30
  - title: 'Exercise: Harness the Power of Caching'
    description: I have an app that requires use of a really slow API, so any use
      of clever caching will dramatically improve the end user's experience. By employing
      the fastboot store, and ember-data's client-side caching strategies, reduce
      the *time to first [meaningful] interaction* as much as possible.
    item_type: exercise
    start_time: '17:00'
    duration: 30
- title: Custom Transforms
  description: By specifying custom ember-data transforms, we can define new types
    of attributes on our model. We'll build our own "color", "array" and "object"
    custom ember-data transforms.
  duration: 90
  agenda_items:
  - title: Transforms vs. Other Options
    description: Ember-data transforms allow us to define other types of model attributes.
      We'll look at the practical differences between using transforms, compared to
      computed properties or serializer logic. Then, we'll finish by defining the
      parts needed for a complete ember-data transform, and go through a non-trivial
      example together.
    item_type: lecture
    start_time: '17:30'
    duration: 30
  - title: 'Exercise: Three Transforms'
    description: "Build three transforms so that you can access some interesting API
      data on our large example app:\n\n* RGB color\n* Array\n* Object\n \nWith reasonable
      unit tests for at least one of the three. Ensure that you handle important edge
      cases (like null value) appropriately."
    item_type: exercise
    start_time: '18:00'
    duration: 60
---
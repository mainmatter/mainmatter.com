---
layout: workshop
title: Ember-Data Basics
permalink: "/workshops/2016-12-17-ember-data-basics"
category: Front End Development
description: |-
  Harness the power of the official persistence library of the Ember.js framework.


  We'll cover all of the basics you need to know in order to make ember-data the best part of working with your back end, diving deep into adapters, serializers and the store.
stages:
- title: The Store
  description: 'Ember-data''s store is the main API surface that developers interact
    with, in order to initiate requests for data. '
  duration: 60
- title: Massaging JSON
  description: |-
    Ember-data serializers are the tool for transforming your API's representation of data into what your ember app expects. We'll examine several common use cases for massaging JSON, including:
    * changing the names of properties
    * normalizing property key format
    * synthesizing client-side IDs
  duration: 150
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
- title: Custom Transforms
  description: By specifying custom ember-data transforms, we can define new types
    of attributes on our model. We'll build our own "color", "array" and "object"
    custom ember-data transforms.
  duration: 90
- title: Building Requests
  description: Ember-data adapters are responsible for building URLs, and making other
    customizations to outgoing requests. We'll begin by establishing the URL & JSON
    contracts that ember-data has turnkey adapters for, and then explore a wide range
    of customization hooks that you can use to make ember-data work with **your API**.
  duration: 210
---
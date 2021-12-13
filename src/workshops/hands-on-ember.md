---
title: Hands-on Ember.js
format: Remote
description:
  Two or three-day hands-on Ember.js workshop. We cover all relevant aspects of
  the framework from the CLI to routing and components, ember-data, and testing.
tagline: |
  <p>Ember.js is the frontend framework for ambitious teams that never stop shipping without getting lost in low-level rabbit holes.</p>
  <p>This workshop covers all relevant aspects of the framework. It targets beginners that are just starting new with Ember as well as teams that are using the framework already and are looking to deepen their knowledge.</p>
tag: /assets/images/resources/workshops/hands-on-ember/ember.svg
og:
  image: /assets/images/resources/workshops/hands-on-ember/og-image.png
topics:
  - heading:  Ember.js Basic
    image: /assets/images/resources/workshops/hands-on-ember/box.svg
    text: >
      We'll look at what the basic building blocks of an Ember application are and how
      they play together. We also take a look at the CLI and development tooling like
      the Ember Inspector.
  - heading:  Templates and Components
    image: /assets/images/resources/workshops/hands-on-ember/code.svg
    text: >
      Rendering DOM elements is the most essential task of every Ember app. We'll dive
      deep into Handlebars, Ember's component model, tracked properties as well as
      actions and modifiers and more advanced topics like complex component
      architectures, component reusability concerns and architectural approaches.
  - heading:  Routing
    image: /assets/images/resources/workshops/hands-on-ember/map.svg
    text: >
      Ember pioneered the idea of driving the application state through the URL. In
      this stage, we'll explore Ember's routing, the template hierarchy and advanced
      concepts like loading and error states.
  - heading:  Ember Data
    image: /assets/images/resources/workshops/hands-on-ember/database.svg
    text: >
      This stage covers all aspects of Ember Data, from the basics like working with
      models and the store to advanced topics like adapters and serializers, the
      json:api spec as well as data loading patterns.
  - heading:  Services
    image: /assets/images/resources/workshops/hands-on-ember/hexagon.svg
    text: >
      Ember's services are a simple yet powerful mechanism for sharing state
      throughout the application as well as encapsulating specific functionality.
      We'll cover how services work and look at typical use cases and patterns.
  - heading:  Testing
    image: /assets/images/resources/workshops/hands-on-ember/check-circle.svg
    text: >
      In this stage, we'll dive deep into Ember's testing story, exploring the
      different kinds of test, patterns around mocking elements unrelated to a test as
      well as stubbing network requests and fake data.
  - heading:  Auth (optional)
    image: /assets/images/resources/workshops/hands-on-ember/unlock.svg
    text: >
      We will cover fundamental authentication and authorization concepts, discuss
      different mechanisms and related security aspects.
  - heading:  Deployment, Performance, SSR and SSG (optional)
    image: /assets/images/resources/workshops/hands-on-ember/upload.svg
    text: >
      In this stage, we'll look into serving Ember applications in the most performant
      way. We cover topics like CDNs, caching and service workers, as well as
      server-side rendering and pre-rendering with FastBoot.
  - heading:  Ember's object model (optional)
    image: /assets/images/resources/workshops/hands-on-ember/layers.svg
    text: >
      Ember applications building on versions older than the Octane edition are still
      using Ember's legacy object model with patterns like computed properties and
      mixins. In this stage, we cover those concepts in depth as well as explore
      approaches for migrating to native classes.
leads:
  - name: Ricardo Mendes
    title: Senior Frontend Engineer, Ember Framework and Learning Core teams member
    image: /assets/images/authors/locks.jpg
    bio: >
      Ricardo is a long time Ember core team member and one of the main people
      responsible for Ember's documentation. He is passionate about teaching and has
      worked with teams around the world to deepen and extend their knowledge about
      the framework.
  - name: Marco Otte-Witte
    title: Founder and Managing Director of simplabs
    image: /assets/images/authors/marcoow.jpg
    bio: >
      Marco has been working with Ember since before the 1.0 release. He is the
      original author of [ember-simple-auth](https://ember-simple-auth.com) and has
      built large Ember apps for international clients.
---
{% from "quote.njk" import quote %}

Ember.js is the frontend framework for ambitious teams that never stop shipping
without getting lost in low-level rabbit holes.

This workshop covers all relevant aspects of the framework. It targets beginners
that are just starting new with Ember as well as teams that are using the
framework already and are looking to deepen their knowledge.

<!--break-->

## The Workshop

We go through a series of stages that each build on one another. Each topic is
introduced via an in-depth presentation as well as a small, focussed demo
application that illustrates the respective concept in practice. Over the course
of the workshop we take participants through building a full Ember application
step by step so each topic can be applied hands-on with the support of our
tutors. Depending on each team's needs and previous experience, we will cover
each topic in varying depth. The workshop can be done in 2 days or stretch over
3 days.

## Customized for your team

Different teams have different needs and levels of experience with Ember. The
workshop can be done for beginners as well as more experienced developers by
covering different topics in different levels of depth. We are also happy to
customize workshops for the specific needs of a team and cover topics like
performance, debugging, upgrading from older versions of Ember or topics
particular to a team's application.

The workshop can be done remote or on-site although we recommend on-site if
possible.

{% set text = "I would send any new developer in our company to this workshop!" %}
{% set source = "Previous Participant" %}
{{ quote('purple', text, source, false) }}

All examples and practical assignments from the workshop are
[available publicly on GitHub](https://github.com/simplabs/ember-workshop).

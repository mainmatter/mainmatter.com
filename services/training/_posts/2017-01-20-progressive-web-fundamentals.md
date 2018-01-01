---
layout: workshop
title: Progressive Web Fundamentals
weight: 3
permalink: "/services/training/2017-01-20-progressive-web-fundamentals"
redirect_from: "/training/2017-01-20-progressive-web-fundamentals"
category: Front End
description: Progressive Web App technologies let you delight your users with the
  best modern browsers have to offer, without sacrificing compatibility for legacy
  environments.
image: "/images/training/2017-01-20-progressive-web-fundamentals.png"
stages:
- title: Terms and Tools
  description: We'll look at the important characteristics of Progressive Web Apps,
    and introduce some important metrics like "time to first paint" and "time to interactive".
    By getting hands-on experience with advanced areas of Chrome developer tools and
    other utilities, we'll learn how to keep an eye on "progressive web fitness".
  duration: 100
  agenda_items:
  - title: Welcome and Setup
    description: We'll grab some coffee, and make sure everyone has our workshop project
      properly installed.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: From MPA to SPA to PWA
    description: The way we think about web applications has evolved over the years.
      Before we jump in and start walking through the latest advancements, we'll set
      the stage of how we got to where we are. By looking at some characteristics
      of the Multi Page Apps that were popular in the mid-2000s, and the Single Page
      Apps that we've been building for years, we'll be able to identify the strengths
      and weaknesses of both approaches, and how a Progressive Web App measures up.
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: Audits and Instrumentation
    description: |-
      This course will take the form of improving a Single Page App so that it takes advantage of the latest features the web platform has to offer. In order to understand the work that needs to be done, we'll familiarize ourselves with some important tools, including:

      * Chrome (Canary) Dev Tools (now includes Lighthouse!)
      * [WebPageTest.org](https://www.webpagetest.org/)
      * iOS Simulator (OS X only)
      * Android Emulator
      * Google Structured Data Testing Tool

      We'll talk about and measure some important performance metrics, like "time to first paint", "time to interactive" and more!
    item_type: lecture
    start_time: '9:45'
    duration: 30
  - title: 'EXERCISE: Progressive Web Examples'
    description: We'll apply our new auditing tools to some progressive web app examples.
    item_type: exercise
    start_time: '10:15'
    duration: 25
- title: Tolerating Network Instability
  description: Service workers allow web applications to boot nearly instantly, regardless
    of whether the network connection is slow or completely absent! We'll begin with
    recipes for HTTP caching, and then get some serious practical experience with
    service workers. We'll combine FIVE great caching strategies, to achieve an optimum
    balance between data that's as fresh and instantly available as possible.
  duration: 210
  agenda_items:
  - title: HTTP Caching
    description: |-
      We'll look at the basic HTTP caching we've been using for decades, and outline two strategies for success:
      * **Immutable Content** - Where content at a URL never changes,
      * **Mutable Content** - Where we rewrite content at URLs, and rely on `Last-Modified` or `ETag` headers to detect modifications.
    item_type: lecture
    start_time: '10:40'
    duration: 20
  - title: Using Appcache (responsibly)
    description: We'll go over the basics of the first widely-applied technology for
      building offline-capable web apps. Appcache is known for its temperamental behavior,
      and its ability to _almost_ solve the problems we need it to solve. We'll review
      a strategy for minimizing risk and maximizing benefit -- ultimately delivering
      a fast return-visit experience for those browsers that don't yet support more
      modern approaches.
    item_type: lecture
    start_time: '11:00'
    duration: 30
  - title: 'EXERCISE: Appcache'
    description: 'We''ll add an Appcache Manifest to our single page app, allowing
      browsers to download the complete application in the background on users'' first
      visit. '
    item_type: exercise
    start_time: '11:30'
    duration: 30
  - title: Service Workers
    description: Service workers are programmable network proxies that can be installed
      on our users' browsers. Rather than providing us with a turnkey solution to
      the "offline problem", service workers expose a set of primitives that we can
      use to build our own solution. We'll dive deep into the worker registration
      process and lifecycle, discuss several different categories of resources, and
      provide an optimal caching strategy for each category!
    item_type: lecture
    start_time: '12:00'
    duration: 40
  - title: LUNCH
    description: Break for Lunch
    item_type: break
    start_time: '12:40'
    duration: 60
  - title: 'EXERCISE: Service Workers I'
    description: We'll apply our newfound knowledge of service workers, in order to
      greatly improve the "time to first paint" and "time to interactive" of our app
      for return visits.
    item_type: exercise
    start_time: '13:40'
    duration: 30
- title: Storage
  description: When we think of web applications as just another "thin client", it's
    clear that we need more durable storage primitives than cookies and localstorage.
    We'll get some hands-on experience with IndexedDB, a NoSQL database that's bigger,
    faster, more flexible and efficient than any of the other "classic" options.
  duration: 210
  agenda_items:
  - title: Service Worker Cache APIs
    description: We'll demonstrate some typical patterns to manage cached data in
      a service worker that you might be familiar with.
    item_type: lecture
    start_time: '14:10'
    duration: 30
  - title: 'EXERCISE: Crushing Caches'
    description: We'll polish up the use of caches in our service worker, ensuring
      that we only discard old data when we're confident in the integrity of updated
      data, and that our cache logic is as simple and maintainable as possible.
    item_type: exercise
    start_time: '14:40'
    duration: 30
  - title: Basic IndexedDB
    description: IndexedDB is a transactional, versioned NoSQL database supported
      by all modern browsers, and it is vastly more capable compared to other alternatives
      for saving durable data. We'll look at the IndexedDB API, and then a small promise-based
      library that we can layer on top of it to make our lives easier.
    item_type: lecture
    start_time: '15:10'
    duration: 30
  - title: 'EXERCISE: IndedDB IDB'
    description: We'll make use of IndexedDB (via `idb`) to pre-populate a collection
      of data in our service worker, so it is available almost instantly when our
      app boots on subsequent visits.
    item_type: exercise
    start_time: '15:40'
    duration: 30
  - title: Afternoon Break
    description: Short coffee break
    item_type: break
    start_time: '16:10'
    duration: 15
  - title: Indexes, Version Migration and IndexedDB 2.0
    description: We'll dive into more advanced IndexedDb concepts, illustrating the
      stark difference between the comparatively primitive localStorage and cookie
      options. Additionally, we'll cover new features that were added to the 2.0 draft
      of the IndexedDb web standard in 2016, and are now available in Chrome, Safari
      and Firefox.
    item_type: lecture
    start_time: '16:25'
    duration: 35
  - title: 'EXERCISE: IndedDB 2.0 and Migrations'
    description: We'll put our newfound knowledge of IndexedDB version migrations
      into practice!
    item_type: exercise
    start_time: '17:00'
    duration: 30
  - title: Recap and Wrap Up
    description: We'll quickly recap what we've covered today, and set our sights
      on tomorrow's topics!
    item_type: lecture
    start_time: '17:30'
    duration: 10
- title: App-Like Characteristics
  description: In many ways, Progressive Web Apps provide features and a user experience
    that users expect from native apps. We'll dive deep into the concept of a Web
    App Manifest, and add more metadata to our project to allow it to feel like a
    native app when launched from a mobile device home screen. We'll also look at
    how we can use web push notifications with our service worker!
  duration: 255
  agenda_items:
  - title: Welcome and Recap
    description: We'll go through today's agenda, and recap what we've learned so
      far.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Mobile and Social Metadata
    description: 'There are some easy ways that our app can become a "superhero",
      related to use on mobile devices and in "social situations" (social networks,
      sharing links on messaging apps, etc...). We''ll dip into the topics of [schema.org](https://schema.org)
      structured data, web application manifests, and mobile-specific meta tags to
      provide as rich and "app-like" an experience as possible. '
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: 'EXERCISE: Mobile Web, as an App!'
    description: Add a web app manifest, some meta tags and the add-to-homescreen
      Javascript library to our web app, so that it appears as close as possible to
      a native app. We should see our Lighthouse score jump up considerably as a result
      of this enhancement!
    item_type: exercise
    start_time: '9:45'
    duration: 30
  - title: Push Notifications
    description: Unfortunately, the world of web push notifications is still quite
      fragmented. We'll look at the Apple, Google and Firefox notification APIs, and
      present some examples of unified services that can be used to deliver messages
      to users regardless of their chosen browser. We'll look at both "local" and
      "push" notifications, providing some optional exercises that developers of various
      developer programs can complete, to get some hands-on experience with the pertinent
      APIs.
    item_type: lecture
    start_time: '10:15'
    duration: 40
  - title: Payment Processing
    description: The ability to accept secure one-touch payments via Apple Pay and
      Google Wallet is one of the most exciting new capabilities of progressive web
      applications. We'll look at the setup process required to get up and running,
      and provide some optional exercises that members of Apple and Google's respective
      developer programs can practice with using these payment APIs.
    item_type: lecture
    start_time: '10:55'
    duration: 40
  - title: Background Tasks
    description: Web Workers are available in all modern browsers and provide a foundation
      for doing some work in a separate thread. We'll explore the great potential
      that this capability offers, and outline some real-world use cases.
    item_type: lecture
    start_time: '11:35'
    duration: 20
  - title: 'EXERCISE: Background Processes'
    description: We'll use background processes in order to add a QR code reader to
      our app, where the heavy lifting is NOT done on the UI thread.
    item_type: exercise
    start_time: '11:55'
    duration: 35
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:30'
    duration: 45
- title: Runtime Performance
  description: Single page apps have a reputation for providing rich experiences,
    but at the cost of having to download lots of code that tend to run slowly. It
    may seem that this is the inevitable consequence of complexity. However, with
    a few adjustments, we'll be able to keep both initial and return visits loading
    quickly and performing as well as they can in modern JavaScript runtimes.
  duration: 165
  agenda_items:
  - title: 'Build Improvements: Tree Shaking'
    description: |-
      One of the ways we can reduce our "page weight" is by applying a technique known as "tree shaking", whereby we avoid including unused code in our production assets. We'll look at:
      * How this works in practice,
      * What you can do today to benefit from tree shaking as much as possible,
      * [Rollup.js](https://rollupjs.org/) vs [Webpack](https://webpackjs.com/).
    item_type: lecture
    start_time: '13:15'
    duration: 20
  - title: 'EXERCISE: Tree Shaking'
    description: Update the build configuration of our projects so that unused code
      is "shaken" away.
    item_type: exercise
    start_time: '13:35'
    duration: 20
  - title: 'Build Improvements: Partial Evaluation'
    description: "[Prepack.io](https://prepack.io/) is a new tool from Facebook, which
      applies a technique called partial evaluation. Essentially, values that can
      be calculated or simplified ahead of time are optimized, reducing the amount
      of code we have to send over the wire, and the amount of work that needs to
      be done at runtime. We'll look at how we can make use of this tool to further
      reduce page weight, and the techniques to apply to benefit from Prepack as much
      as possible, while still having deterministic builds."
    item_type: lecture
    start_time: '13:55'
    duration: 20
  - title: 'EXERCISE: Partial Evaluation'
    description: Further reduce our project's page weight, time to first meaningful
      paint, and time to interactive by setting up Prepack in our example app.
    item_type: exercise
    start_time: '14:15'
    duration: 25
  - title: 'Code Improvements: A V8 Primer'
    description: A little awareness of how modern JavaScript engines work goes a long
      way, particularly when it comes to keeping our code in "fast mode" as much as
      possible. We'll briefly discuss the architecture of the V8 JS engine, touching
      on parts like Ignition (interpreter) and Turbofan (compiler). We'll discuss
      some rules you can apply, and enforce with static analysis tools to avoid expensive
      de-optimizations.
    item_type: lecture
    start_time: '14:40'
    duration: 30
  - title: 'EXERCISE: Consistent Shapes and Hot Functions'
    description: |-
      Apply some of the performance debugging and performance optimization techniques to our example app. Particularly:
      * Make sure object shapes are not altered,
      * Refactor any functions that are de-optimized after being made "hot".
    item_type: exercise
    start_time: '15:10'
    duration: 30
  - title: 'Network Improvements: HTTP/2'
    description: HTTP/2 (originally named HTTP/2.0) is a major revision of the HTTP
      network protocol. In addition to making traditional use cases addressed by HTTP/1.1
      more efficient and performant, it also opens up totally new capabilities. We'll
      look at how we can use nginx in front of a Node.js API to reap the benefits
      of HTTP/2, without exposing our API to the hazard of long-running connections.
    item_type: lecture
    start_time: '15:40'
    duration: 20
- title: Architecture and System Design
  description: It's time to put everything we've reviewed so far into practice, as
    we study two important PWA architectural patterns. First, we'll employ the "app
    shell" pattern, whereby the frame or "shell" of the app is cached locally (and
    loads instantly). Secondly, we'll employ the PRPL pattern (Push, Render, Pre-Cache,
    Lazy-Load) to ensure that even after a minimal portion of our app loads initially,
    the rest of the app begin to prepare itself for instant availability in the background.
  duration: 105
  agenda_items:
  - title: App Shell
    description: The "App Shell" architecture pattern involves having some portion
      of our application available on the device, ready to boot almost instantly on
      return visits. Dynamic content is fetched from an API as usual, and rendered
      inside this "shell". We'll look at this pattern in detail, and explore how we
      might employ it in our app.
    item_type: lecture
    start_time: '16:00'
    duration: 20
  - title: 'EXERCISE: App Shell'
    description: Apply the "App Shell" pattern to our app, allowing the frame to load
      instantly for return visits.
    item_type: exercise
    start_time: '16:20'
    duration: 20
  - title: PRPL
    description: The "Push, Render, Pre-Cache, Lazy-Load" pattern works nicely with
      code splitting. The minimum amount of code possible is loaded for the initial
      render of the app, and then other resources are downloaded in the background,
      so they're instantly available on the device (and parsed into JavaScript lazily)
      when needed.
    item_type: lecture
    start_time: '16:40'
    duration: 20
  - title: 'EXERCISE: PRPL'
    description: Apply the PRPL pattern to our example app.
    item_type: exercise
    start_time: '17:00'
    duration: 30
  - title: Wrap Up
    description: We'll wrap up, and recap everything we've covered today.
    item_type: lecture
    start_time: '17:30'
    duration: 15
---
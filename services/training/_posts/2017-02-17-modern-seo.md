---
layout: workshop
title: Modern SEO
weight: 3
permalink: "/services/training/2017-02-17-modern-seo"
redirect_from: "/training/2017-02-17-modern-seo"
category: Front End
description: Getting the most out of search engines and social networking is more
  important than ever! Take advantage of Google, Facebook and Twitter’s most advanced
  features, and boost user engagement.
image: "/images/training/2017-02-17-modern-seo.png"
stages:
- title: Modern SEO
  description: "Some aspects of SEO seem like black magic, but there’s a lot that
    can be done to ensure your app is at its best when shown in search results, and
    linked to on social networks. \n\nIn this course, we’ll begin with the basics
    of traditional SEO, and quickly move on to adding structured metadata to your
    app, so that your site shows up in search results in as rich a way as possible.\n\nNext,
    we’ll explore Accelerated Mobile Pages - an open-source initiative to provide
    users with an instant-loading experience on mobile devices. To accomplish this,
    we have to play by a strict set of rules, but the end result is worth it!\n\nFinally,
    we’ll look at mobile optimizations that will make your web applications more mobile
    friendly, including Web Application Manifests and more!"
  duration: 525
  agenda_items:
  - title: Traditional SEO
    description: 'It’s important to know where we’re starting from before we talk
      about where we’re going. Let’s look at some SEO basics, including content quality,
      page rank, positive and negative metrics. '
    item_type: lecture
    start_time: '9:00'
    duration: 30
  - title: Optimizing for Crawlers
    description: Giving hints to crawlers, by way of a `robots.txt` file, meta tags
      and DOM attributes can go a long way in allowing search engines to index and
      represent your content in the best way possible.
    item_type: lecture
    start_time: '9:30'
    duration: 30
  - title: EXERCISE 1 - Crawler optimizations
    description: Using what we’ve just learned, make some optimizations that will
      give web crawlers some important hints as to how your URLs relate to each other.
    item_type: exercise
    start_time: '10:00'
    duration: 30
  - title: Structured Data
    description: While search engines are good at inferring what your content is all
      about in general, providing structured data can allow further enrichment of
      how your site is represented in search results. We’ll look at providing standardized
      structured data, aligned with the [schema.org](http://schema.org) standard,
      to Google and other search engines.
    item_type: lecture
    start_time: '10:30'
    duration: 30
  - title: EXERCISE 2 - An events page
    description: Events are one of several types of structured data that popular search
      engines use to enrich listings in results pages. Using the google structured
      data tester, add some of this metadata to your app, and fix any warnings brought
      to your attention.
    item_type: exercise
    start_time: '11:00'
    duration: 30
  - title: Accelerated Mobile Pages
    description: Accelerated Mobile Pages are part of a standards-based effort to
      provide a nearly instant loading experience for content on mobile devices. While
      AMP-ready pages make use of familiar technologies, there are some strict constraints
      we must adhere to, in order to enable this fast-loading experience.
    item_type: lecture
    start_time: '11:30'
    duration: 30
  - title: EXERCISE 3 - Build an AMP Page
    description: We discussed two strategies for building AMP pages. For this exercise,
      make a separate namespace for equivalent AMP content, and build a simple representation
      of a news article, while staying within the relevant constraints.
    item_type: exercise
    start_time: '12:00'
    duration: 30
  - title: Lunch
    description: Break for Lunch
    item_type: break
    start_time: '12:30'
    duration: 60
  - title: Social Metadata
    description: Modern web crawlers execute at least a limited subset of your app’s
      JavaScript, but this doesn’t help much when it comes to sharing links on Facebook,
      Twitter, Slack and other sites. To provide a great social sharing experience,
      we need to employ server-side rendering and a combination of OpenGraph and Twitter
      Card metadata, to go along with our content.
    item_type: lecture
    start_time: '13:30'
    duration: 30
  - title: EXERCISE 4 - Enriched product pages
    description: The product pages for our e-commerce site currently provide a very
      basic sharing experience. Using your newfound knowledge of Twitter Card and
      OpenGraph meta tags, enrich the sharing experience with a large product image,
      and a short description
    item_type: exercise
    start_time: '14:00'
    duration: 30
  - title: Rules of Thumb
    description: Now that we’ve learned about social metadata, we can see that generating
      thumbnails will be a bit of a challenge. We’ll look at a battle-tested library
      called ImageMagick to generate all the sizes we need on the fly, and learn some
      tips and tricks to make sure our cropping and resizing will turn out beautifully.
    item_type: lecture
    start_time: '14:30'
    duration: 30
  - title: EXERCISE 5 - Thumb Generation
    description: Find a set of ImageMagick arguments that results in a great group
      of thumbnails, given a collection of source images. Make sure not to cut any
      area indicated as “critical” out of the thumbnail image.
    item_type: exercise
    start_time: '15:00'
    duration: 30
  - title: Embedding in other places
    description: We’ll go beyond simple link sharing, and explore the OEmbed standard,
      whereby our apps can instruct consumers as to how our rich web content should
      be represented on their sites.
    item_type: lecture
    start_time: '15:30'
    duration: 30
  - title: EXERCISE 6 - iframe via OEmbed
    description: Build a new express route that returns an OEmbed-compliant JSON response,
      instructing consumers to iframe your content.
    item_type: exercise
    start_time: '16:00'
    duration: 30
  - title: Mobile Optimizations
    description: In mid-2016, Google announced that mobile-friendliness would have
      a significant impact on SEO for their new “mobile index”. We’ll take a look
      at a few tools designed to measure how well our apps work on mobile devices
      and provide some key metrics and thresholds to keep an eye on. We’ll also take
      a look at some additional metadata that modern mobile devices can use to provide
      a more native-app-like experience.
    item_type: lecture
    start_time: '16:30'
    duration: 30
  - title: EXERCISE 7 - Lighthouse + Web App Manifest
    description: Add a web app manifest to our app, and make other easy improvements
      to boost our app’s lighthouse score
    item_type: exercise
    start_time: '17:00'
    duration: 30
  - title: Wrap Up & Recap
    description: We'll recap everything covered throughout the day.
    item_type: lecture
    start_time: '17:30'
    duration: 15
---
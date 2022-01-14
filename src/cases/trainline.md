---
layout: case-study
company: Trainline
companyDescription: Trainline is Europe's leading independent rail and coach platform. They serve more than 125,000 rides every single day in and across 36 countries.
title: Mobile train tickets with Ember.js for Trainline | Work
displayTitle: "The full market potential for a <em>leading</em> travel platform"
description: Trainline is Europe’s leading rail and coach platform. We helped them deliver a high-performance mobile web app, along with an improved engineering process.
hero:
  color: blue
  desktopTextPosition: "right"
  image: ""
  imageAlt: ""
---

{% from "secondary-feature.njk" import secondaryFeature %}
{% from "split-quote.njk" import splitQuote %}

<div class="case-study__body">
<p class="post__tagline">
  Trainline is Europe's leading independent rail and coach platform. They sell tickets to customers worldwide, enabling more than 125,000 journeys every single day in and across 36 countries, covering 150 different carriers.
</p>

<p class="post__tagline">
  We worked closely with Trainline’s engineering team to build a mobile web app to complement their existing desktop web app. This enabled Trainline to better serve customers on the go and leverage the full market potential.
</p>
</div>

{% set 'content' = {
  "eyebrow": "Our expertise",
  "title": "We are Europe’s Leading Ember Experts.",
  "text": "",
  "linkUrl": "/ember-consulting/",
  "linkText": "Find out more",
  "image": "/assets/images/photos/collaboration@1200.jpg",
  "alt": "Alt text",
  "loading": "lazy"
} %}
{{- secondaryFeature('right', content, true) -}}

{% set 'content' = {
  "text": "It has been an absolute pleasure to work with [Mainmatter]. Their team of experienced JavaScript engineers quickly slotted in to our in-house development teams. Their expertise with modern, agile software development best practices and tools meant they were able to work with our processes to deliver fantastic customer experiences.",
  "source": "Mark Holt, Trainline CTO",
  "image": "/assets/images/photos/collaboration@1200.jpg",
  "alt": "Alt text",
  "loading": "lazy"
} %}
{{- splitQuote('left', 'aqua', content) -}}

<div class="case-study__body">

### Solidifying sustainable strategies

Working closely with Trainline's engineering and product teams, we were able to deliver the first version of the mobile web app on time and on budget. We helped develop the team’s expertise through pair-programming sessions and code reviews.

In addition to our engineering work, we also helped Trainline establish an iterative approach to their engineering process. This enabled both their engineers and management to better prioritize tasks and measure project progress.

<figure figure:scope>
  <img
    figure:class="content"
    src="/assets/images/work/trainline-comp-2.jpg"
    alt="three screenshots of the Trainline app, showing schedule and booking functionality"
  />

  <figcaption>
    trainline sells tickets for 150 different carriers across 36 countries via their mobile app.
  </figcaption>
</figure>

### More sales from happier customers

Beyond the core application, we spearheaded impovements in mobile performance, load times, server side rendering, and localization. Taken together, these changes resulted in a vastly improved user experience and, in turn, increased sales.

</div>

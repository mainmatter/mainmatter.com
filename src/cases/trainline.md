---
layout: case-study
company: Trainline
companyDescription: Trainline is Europe's leading independent rail and coach platform. They serve more than 125,000 rides every single day in and across 36 countries.
title: Mobile train tickets with Ember.js for Trainline | Work
displayTitle: "The full market potential for a <em>leading</em> travel platform"
description: <p>Trainline is Europe’s leading rail and coach platform.</p><p>We helped them deliver a high-performance mobile web app, along with an improved engineering process.</p>
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/trainline.jpg"
  imageAlt: "Back view of a man standing in front of departure boards"
  tags: "development / process / mentoring"
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">About Trainline</h2>
  <div class="case-study__text">
    <h3 class="h4">Trainline is Europe's leading independent rail and coach platform. They sell tickets to customers worldwide, enabling more than 125,000 journeys every single day in and across 36 countries, covering 150 different carriers.</h3><br>
    <p>We worked closely with Trainline’s engineering team to build a mobile web app to complement their existing desktop web app. This enabled Trainline to better serve customers on the go and leverage the full market potential.</p>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">Solidifying sustainable strategies</h2>
  <div class="case-study__text">
    <p>Working closely with Trainline's engineering and product teams, we were able to deliver the first version of the mobile web app on time and on budget. We helped develop the team’s expertise through pair-programming sessions and code reviews.</p>
    <p>In addition to our engineering work, we also helped Trainline establish an iterative approach to their engineering process. This enabled both their engineers and management to better prioritize tasks and measure project progress.</p>
  </div>
</div>

{% include 'content/secondary-feature-ember.njk' %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">More sales from happier customers</h2>
  <div class="case-study__text">
    <p>Beyond the core application, we spearheaded impovements in mobile performance, load times, server side rendering, and localization. Taken together, these changes resulted in a vastly improved user experience and, in turn, increased sales.</p>
  </div>
</div>

{% set 'content' = {
  "text": "It has been an absolute pleasure to work with [Mainmatter]. Their team of experienced JavaScript engineers quickly slotted in to our in-house development teams. Their expertise with modern, agile software development best practices and tools meant they were able to work with our processes to deliver fantastic customer experiences.",
  "source": "MARK HOLT, TRAINLINE CTO"
} %}
{{ quote(content) }}

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/trainline-ui.jpg", "Screenshot of the Trainline app", '100vw', "lazy", 'case-study__image', [1200] %}
</div>

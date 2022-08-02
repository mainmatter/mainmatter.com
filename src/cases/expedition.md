---
layout: case-study
company: Expedition
companyDescription: Expedition is an online travel magazine for global citizens who want to experience world’s best destinations through the eyes of a local.
title: An architecture based on Elixir and Ember.js for Expedition | Work
displayTitle: "A sturdy foundation for <em>advanced</em> system architecture"
description: <p>Expedition is an online travel magazine for global citizens.</p><p>They turned to Mainmatter when they were looking for guidance to get the most out of their technology stack based on Elixir, Phoenix and Ember.js.</p>
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/expedition.jpg"
  imageAlt: "Expedition homepage viewed on an iPad"
  tags: "development / architecture / mentoring"
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">About Expedition</h2>
  <div class="case-study__text">
    <h3 class="h4">Expedition is an online travel magazine for global citizens who want to experience world’s best destinations through the eyes of a local.</h3>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">Shipping more with less</h2>
  <div class="case-study__text">
    <p>Their team needed help sharpening up their Ember.js client and fortifying their API, built with Elixir and Phoenix, so it could be extended with more advanced functionality in the future.</p>
    <p>We reviewed Expedition's codebase and identified a number of issues that we presented along with background information and severity assessments for prioritization.</p>
    <p>We built prototype implementations for a number of advanced features in Expedition's system. We were able to deliver clean and concise code thanks to the capabilities of Elixir and Phoenix.</p>
  </div>
</div>

{% include 'content/secondary-feature-erlang.njk' %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">Optimizing for stability and resilience</h2>
  <div class="case-study__text">
    <p>We recommended Ember.js as a stable foundation that would support the project for years to come. We completed the prototype implementation of the architecture in just over six weeks, defining the structure for the application and establishing good patterns. That prototype laid the foundation for subsequent engineering efforts taken on by embeDD's in-house engineering team.</p>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">Growing into the future</h2>
  <div class="case-study__text">
    <p>Beyond our foundational work, we armed Expedition’s team with further information to enable them to confidently build upon what we’d established. We gave them strategies for tackling their core issues so they could address problems before they turned into roadblocks.</p>
  </div>
</div>

{% set 'content' = {
  "text": "[Mainmatter] brought wisdom, flexibility, and sane solutions when facing complex problems. They went above and beyond to work with our unique situation - would recommend 1000x.",
  "source": "BRYAN LANGSLET, EXPEDITION CEO",
  "image": "/assets/images/photos/qonto-alexander.jpg",
  "alt": "Alexandre Monjol, smiling at the camera wearing a Qonto t-shirt",
  "loading": "lazy"
} %}
{{- quote(content) -}}

---
layout: case-study
company: Expedition
companyDescription: Expedition is an online travel magazine for global citizens who want to experience world’s best destinations through the eyes of a local.
title: An architecture based on Elixir and Ember.js for Expedition | Work
displayTitle: "A sturdy foundation for <em>advanced</em> system architecture"
description: Expedition is an online travel magazine for global citizens. They turned to Mainmatter when they were looking for guidance to get the most out of their technology stack based on Elixir, Phoenix and Ember.js.
hero:
  color: purple
  desktopTextPosition: "right"
  image: ""
  imageAlt: ""
---

{% from "secondary-feature.njk" import secondaryFeature %}
{% from "split-quote.njk" import splitQuote %}

<div class="case-study__body">
<p class="post__tagline">
  Expedition is an online travel magazine for global citizens who want to experience world’s best destinations through the eyes of a local.
</p>

<p class="post__tagline">
  Their team needed help sharpening up their Ember.js client and fortifying their API, built with Elixir and Phoenix, so it could be extended with more advanced functionality in the future.
</p>
</div>

{% set 'content' = {
  "eyebrow": "Our expertise",
  "title": "Elixir & Phoenix",
  "text": "We recently have been recognized as an official sponsor of the Ember.js project along with international brands like LinkedIn and Yahoo.",
  "linkUrl": "/expertise/elixir-phoenix/",
  "linkText": "Find out more",
  "image": "/assets/images/photos/collaboration@1200.jpg",
  "alt": "Alt text",
  "loading": "lazy"
} %}
{{- secondaryFeature('right', content, true) -}}

{% set 'content' = {
  "text": "[Mainmatter] brought wisdom, flexibility, and sane solutions when facing complex problems. They went above and beyond to work with our unique situation - would recommend 1000x.",
  "source": "Bryan Langslet, Expedition CEO",
  "image": "/assets/images/photos/collaboration@1200.jpg",
  "alt": "Alt text",
  "loading": "lazy"
} %}
{{- splitQuote('left', 'yellow', content) -}}

<div class="case-study__body">

### Shipping more with less

We reviewed Expedition's codebase and identified a number of issues that we presented along with background information and severity assessments for prioritization.

We built prototype implementations for a number of advanced features in Expedition's system. We were able to deliver clean and concise code thanks to the capabilities of Elixir and Phoenix.

### Growing into the future

Beyond our foundational work, we armed Expedition’s team with further information to enable them to confidently build upon what we’d established. We gave them strategies for tackling their core issues so they could address problems before they turned into roadblocks.

</div>

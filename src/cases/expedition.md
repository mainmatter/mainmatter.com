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

{% from "split-quote.njk" import splitQuote %}

<div class="case-study__body">
<p class="post__tagline">
  Expedition is an online travel magazine for global citizens who want to experience world’s best destinations through the eyes of a local.
</p>

<p class="post__tagline">
  Their team needed help sharpening up their Ember.js client and fortifying their API, built with Elixir and Phoenix, so it could be extended with more advanced functionality in the future.
</p>
</div>

{% include 'content/secondary-feature-elixir.njk' %}

{% set 'content' = {
  "text": "[Mainmatter] brought wisdom, flexibility, and sane solutions when facing complex problems. They went above and beyond to work with our unique situation - would recommend 1000x.",
  "source": "Bryan Langslet, Expedition CEO",
  "image": "/assets/images/photos/collaboration.jpg",
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

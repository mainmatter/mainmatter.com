---
layout: case-study
company: Timify
companyDescription: Timify is a cloud-based appointment scheduling system that serves over 50,000 businesses across a wide range of industries.
displayTitle: "An engineering overhaul for a <em>validated</em> booking system"
description: Timify is an online appointment scheduling service that connects service providers with clients. When they decided it was time to re-engineer their existing product, they trusted us to set them up for future success.
hero:
  color: aqua
  desktopTextPosition: "right"
  image: "/assets/images/work/timify-right.jpg"
  imageAlt: "Macbook showing a Timify schedule"
---

{% from "split-quote.njk" import splitQuote %}

<div class="case-study__body">
<p class="post__tagline">
  Timify is a cloud-based appointment booking system that serves over 50,000 businesses worldwide.
</p>

<p class="post__tagline">
  The company had validated their product/market fit with an in-house prototype, but as the business grew, it became clear that this foundation was not sturdy enough to support further expansion. The entire system needed to be re-engineered from the ground up.
</p>
</div>

{% include 'content/secondary-feature-ember.njk' %}

{% set 'content' = {
  "text": "[Mainmatter's] experienced engineers delivered a solid and well architected foundation for our web app. They also helped us establish best practices and a lean process internally. Working with them was a pleasure.",
  "source": "Andreas Knürr, Timify CEO",
  "image": "/assets/images/photos/collaboration.jpg",
  "alt": "Alt text",
  "loading": "lazy"
} %}
{{- splitQuote('right', 'purple', content) -}}

<div class="case-study__body">

### Foundational structures and strategies

Timify had ambitious internal deadlines, so we completed the first release version of the new application in just over four months. Following the release, we joined forces with Timify’s engineers to get them up to speed on best practices and patterns for Ember.js. With the proper foundation now in place, their team could confidently build upon what we established long into the future.

<figure figure:scope>
  <img
    figure:class="content"
    src="/assets/images/work/timify-comp.jpg"
    alt="screenshot of the Timify app, showing the schedule"
  />

  <figcaption>
    Timify allows businesses in 29 countries to manage appointments and plan shifts more effectively
  </figcaption>
</figure>

### Features for the future

We spearheaded several engineering initiatives, including premium subscriptions, payment system integration, localization of the application in 15 languages, and support for time zones. Timify took over these initiatives after our time together, and they’ve continuted to maintain and iterate upon these features.

### Building on a modern stack

Ember.js proved to be the right technology choice for an ambitious application like Timify that was built to last for years. The framework’s baked-in conventions enable larger teams to move fast without breaking things—a key element of our design philosophy.

Leveraging modern web technologies like SVG, we were able to achieve excellent runtime performance even for large data sets. The json:api-based server API allowed us to implement the client and server side of a feature concurrently.

</div>

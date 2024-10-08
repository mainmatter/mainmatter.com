---
layout: case-study
company: Timify
title: Laying a solid frontend foundation for an ambitious startup | Work
displayTitle: "An engineering overhaul for a <em>validated</em> booking system"
problem: Timify's entire system needed to be re-engineered from the ground up.
solution: We completed the first release version of the new application and got them up to speed on best practices and patterns for Ember.js
tags: Team reinforcement
description: <p>Timify is an online appointment scheduling service that connects service providers with clients.</p><p>When they decided it was time to re-engineer their existing product, they trusted us to set them up for future success.</p>
hero:
  color: purple
  image: "/assets/images/work/timify.jpg"
  imageAlt: "Smiling blonde woman behind a counter serving another woman"
  tags: "development / architecture / mentoring"
og:
  image: /assets/images/cases/cs-timify-og-image.jpg
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About Timify</h3>
  <div class="case-study__text">
    <h3 class="h4">Timify is a cloud-based appointment booking system that serves over 50,000 businesses worldwide.</h3><br>
    <p>The company had validated their product/market fit with an in-house prototype, but as the business grew, it became clear that this foundation was not sturdy enough to support further expansion. The entire system needed to be re-engineered from the ground up.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Foundational structures and strategies</h3>
  <div class="case-study__text">
    <p>Timify had ambitious internal deadlines, so we completed the first release version of the new application in just over four months. Following the release, we joined forces with Timify’s engineers to get them up to speed on best practices and patterns for Ember.js. With the proper foundation now in place, their team could confidently build upon what we established long into the future.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Features for the future</h3>
  <div class="case-study__text">
    <p>We spearheaded several engineering initiatives, including premium subscriptions, payment system integration, localization of the application in 15 languages, and support for time zones.</p>
    <p>Timify took over these initiatives after our time together, and they’ve continuted to maintain and iterate upon these features.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/timify-comp.jpg", "Screenshot of the Timify app on a black laptop", '50rem', "lazy", 'case-study__image', [800, 1200] %}
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Building on a modern stack</h3>
  <div class="case-study__text">
    <p>Ember.js proved to be the right technology choice for an ambitious application like Timify that was built to last for years. The framework’s baked-in conventions enable larger teams to move fast without breaking things—a key element of our design philosophy.</p>
    <p>Leveraging modern web technologies like SVG, we were able to achieve excellent runtime performance even for large data sets. The json:api-based server API allowed us to implement the client and server side of a feature concurrently.</p>
  </div>
</div>

{% set content = {
  "text": "[Mainmatter's] experienced engineers delivered a solid and well architected foundation for our web app. They also helped us establish best practices and a lean process internally. Working with them was a pleasure.",
  "source": "Andreas Knürr, Timify CEO"
} %} {{ quote(content) }}

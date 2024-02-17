---
layout: case-study
company: DDWRT
title: A modern UI for DD-WRT NXT based on Ember.js | Work
displayTitle: "A modern user interface for perennial router firmware"
description:
  "DD-WRT is a firmware for wireless routers running on millions of devices
  worldwide. Mainmatter developed an Ember.js based foundation for a new
  configuration UI."
problem: DD-WRT wanted a new user experience for their Linux-based firmware.
solution: We built a new user interface using Ember.js as a strong foundation.
tags: Team Reinforcement
hero:
  color: purple
  image: "/assets/images/work/ddwrt.jpg"
  imageAlt: "Router on a white background"
  tags: Team Reinforcement
og:
  image: /assets/images/cases/cs-dd-wrt-og-image.jpg
---

{% from "secondary-feature.njk" import secondaryFeature %}
{% from "quote.njk" import quote %}
{% from "btn-secondary.njk" import btnSecondary %}

<div class="case-study__section">
  <h3 class="case-study__heading">About DD-WRT</h3>
  <div class="case-study__text">
    <p class="h4">DD-WRT is a Linux-based firmware for wireless routers. Originally designed for the Linksys WRT54G series, it now runs on a wide variety of models and is installed on millions of devices worldwide.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Accommodating a special environment</h3>
  <div class="case-study__text">
    <p>Shipping a single page app bundled with a router firmware is substantially different from serving it via the open web.</p>
    <p>The first step for our experts was to understand the characteristics of the environment, like limited hardware capabilities and slow update cycles. We then developed an application architecture for the project that was tailored to the particular requirements and limitations of this use case, accounting for infrequent updates, intermediate network outages, and a UI that adapts itself based on the capabilities of the device.</p>
  </div>
</div>

 <div class="split-content">
  <a href="https://emberjs.com/sponsors/" class="split-content__link"></a>
    <div class="split-content__wrapper">
        <div class="split-content__content">
          <h4>We are an official sponsor of the Ember.js project.</h4>
        </div>
        <div class="split-content__feature">
          <a href="https://emberjs.com/sponsors/" class="btn-secondary h4 mt-2">
          {% include 'content/secondary-feature-ember.njk' %}
          </a>
        </div>
      </div>
    </div>

<div class="case-study__section">
  <h3 class="case-study__heading">Optimizing for stability and resilience</h3>
  <div class="case-study__text">
    <p>We recommended Ember.js as a stable foundation that would support the project for years to come. We completed the prototype implementation of the architecture in just over six weeks, defining the structure for the application and establishing good patterns. That prototype laid the foundation for subsequent engineering efforts taken on by embeDD's in-house engineering team.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Ensuring long-term success</h3>
  <div class="case-study__text">
    <p>Before our work with embeDD was complete, we took an extended period of time to coach their engineers and review their work. This is how we ensured that they would be able to confidently continue the project long after we’d handed it over.</p>
  </div>
</div>

{% set 'content' = {
  "text": "[Mainmatter's] expertise in developing Ember.js based applications helped us to define and develop the new DD-WRT NXT user experience. It was impressive to see in what short time such a complex application leveraging a customer backend interface could be implemented. Mainmatter's work provided the new foundation for our UI and our in-house development team greatly benefitted from their knowhow.",
  "source": "Peter Steinhäuser, embeDD CEO"
} %} {{ quote(content) }}

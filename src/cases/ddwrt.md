---
layout: case-study
company: DDWRT
companyDescription: DD-WRT is a Linux-based firmware for wireless routers. Originally designed for the Linksys WRT54G series, it now runs on a wide variety of models and is installed on millions of devices worldwide.
title: A modern UI for DD-WRT NXT based on Ember.js | Work
displayTitle: "A modern user interface for <em>perennial</em> router firmware"
description: "DD-WRT is a firmware for wireless routers running on millions of devices worldwide. Mainmatter developed an Ember.js based foundation for a new configuration UI."
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/ddwrt.jpg"
  imageAlt: "Router on a white background"
  tags: "development / architecture"
---

{% from "secondary-feature.njk" import secondaryFeature %}
{% from "split-quote.njk" import splitQuote %}

<div class="case-study__body">
<p class="post__tagline">
  DD-WRT is a Linux-based firmware for wireless routers. Originally designed for the Linksys WRT54G series, it now runs on a wide variety of models and is installed on millions of devices worldwide.
</p>

<p class="post__tagline">
  DD-WRT is a Linux-based firmware for wireless routers. Originally designed for the Linksys WRT54G series, it now runs on a wide variety of models and is installed on millions of devices worldwide.
</p>
</div>

{% include 'content/secondary-feature-ember.njk' %}

<div class="case-study__body">

### Accommodating a special environment

Shipping a single page app bundled with a router firmware is substantially different from serving it via the open web.

The first step for our experts was to understand the characteristics of the environment, like limited hardware capabilities and slow update cycles. We then developed an application architecture for the project that was tailored to the particular requirements and limitations of this use case, accounting for infrequent updates, intermediate network outages, and a UI that adapts itself based on the capabilities of the device.

</div>

{% set 'content' = {
  "text": "[Mainmatter's] expertise in developing Ember.js based applications helped us to define and develop the new DD-WRT NXT user experience. It was impressive to see in what short time such a complex application leveraging a customer backend interface could be implemented. simplabs' work provided the new foundation for our UI and our in-house development team greatly benefitted from their knowhow.",
  "source": "Peter Steinhäuser, embeDD CEO",
  "image": "/assets/images/photos/collaboration.jpg",
  "alt": "Alt text",
  "loading": "lazy"
} %}
{{ splitQuote('left', 'yellow', content) }}

<div class="case-study__body">

### Optimizing for stability and resilience

We recommended Ember.js as a stable foundation that would support the project for years to come. We completed the prototype implementation of the architecture in just over six weeks, defining the structure for the application and establishing good patterns. That prototype laid the foundation for subsequent engineering efforts taken on by embeDD's in-house engineering team.

### Ensuring long-term success

Before our work with embeDD was complete, we took an extended period of time to coach their engineers and review their work. This is how we ensured that they would be able to confidently continue the project long after we’d handed it over.

</div>

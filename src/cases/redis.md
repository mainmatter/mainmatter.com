---
layout: case-study
company: Redis
problem: Redis wanted to convert a large C codebase to Rust but needed expertise.
solution: Our team collaborates closely with their engineers throughout the migration process, providing hands-on Rust mentoring along the way.
tags: Team Reinforcement
description: <p>Redis is the company behind the popular NoSQL database.</p><p>When they decided to migrate part of their C codebase to Rust, they turned to Mainmatter for support. Our team collaborates closely with their engineers throughout the migration process, teaching them Rust as we go.</p>
hero:
  tags: "Rust / development / mentoring"
title: From C to Rust | Work
displayTitle: From C to Rust
---

{% from "quote.njk" import quote %} {% from "image-aspect-ratio.njk" import imageAspectRatio %}

<div class="case-study__section">
  <h3 class="case-study__heading">About Redis</h3>
  <div class="case-study__text">
    <p class="h4">…</p>
  </div>
</div>

<section class="case-study__section">
  {% set imageData = {
    "imgPath": "/assets/images/work/rail-europe-case-study.jpeg",
    "alt": "A toy train traveling in an upwards direction",
    "sizes": "100vw",
    "loading": "lazy",
    "sizesArray": [760, 1440, 1920]
  } %}
  {{ imageAspectRatio(imageData, "32/13", "35/19") }}
</section>

<div class="case-study__section">
  <h3 class="case-study__heading">The Challenge</h3>
  <div class="case-study__text">
    <p>…</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Approach</h3>
  <div class="case-study__text">
    <p>…</p>
  </div>
</div>

{% set content = {
  "text": "Mainmatter enabled us to take our Product Development Organization to the next level. They work closely with our team and help us establish new practices while simultaneously delivering on our day to day product initiatives. Their technical and organizational expertise and fresh views allow us to set up the foundation for future success.",
  "source": "Jürgen Witte, CPO @ Rail Europe",
  "image": "/assets/images/photos/juergen-witte.png",
  "alt": "Jürgen Witte",
  "loading": "lazy"
} %} {{ quote(content) }}

<div class="case-study__section">
  <h3 class="case-study__heading">The Execution</h3>
  <div class="case-study__text">
    <p>…</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Outcome</h3>
  <div class="case-study__text">
    <p>…  </p>
  </div>
</div>

<section class="case-study__section">
  {% set imageData = {
    "imgPath": "/assets/images/cases/rail-europe-cs.jpg",
    "alt": "A monitor showing the opened rail europe app, displaying available train connections",
    "sizes": "100vw",
    "loading": "lazy",
    "sizesArray": [760, 1440, 1920]
  } %}
  {{ imageAspectRatio(imageData, "32/13", "35/19") }}
</section>


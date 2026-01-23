---
layout: case-study
anonymous: true
problem: Redis wanted to convert a large C codebase to Rust but needed expertise.
solution: Our team collaborates closely with their engineers throughout the migration process, providing hands-on Rust mentoring along the way.
tags: Team Reinforcement
description: <p>Redis is the company behind the popular NoSQL database.</p><p>When they decided to migrate part of their C codebase to Rust, they turned to Mainmatter for support. Our team collaborates closely with their engineers throughout the migration process, teaching them Rust as we go.</p>
hero:
  color: black
  image: "/assets/images/work/redis.jpg"
  imageAlt: "Close-up of a red LED grid pattern."
  tags: "Rust / development / mentoring"
og:
  image: /assets/images/cases/anondb-og-image.jpg
title: "Modernizing a Database With Rust: Safe, Fast, Future-Ready | Work"
displayTitle: "Modernizing a Database With Rust: Safe, Fast, Future-Ready"
---

{% from "quote.njk" import quote %} {% from "image-aspect-ratio.njk" import imageAspectRatio %}

<div class="case-study__section">
  <div class="case-study__text">
    <p class="h4">Our client maintains an open-source data platform commonly adopted in systems where responsiveness and consistency matter. The platform is optimized for real-time operation and supports multiple data access patterns, from simple key-value lookups to real-time analytical use cases. It also provides an integrated search engine for performing rich queries on live data.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Challenge</h3>
  <div class="case-study__text">
    <p>
      The search engine at its core is a mature and highly optimized C codebase – powerful, but ready for a more modern foundation as the project continues to grow. To support faster innovation and benefit from stronger safety guarantees, the team decided to gradually migrate the codebase to Rust. This shift promised more sustainable long-term development and a smoother path for future features. With limited in-house Rust expertise, the team reach out to Mainmatter to guide them through the transition.
    </p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Approach</h3>
  <div class="case-study__text">
    <p>We started by deconstructing the extensive C-codebase of the query engine into modular components, prioritizing the less entangled “leaf” modules for early migration. This incremental, step-by-step strategy allowed us to gradually substitute C modules with Rust while managing risk and preserving system stability. We mapped out a migration roadmap, selected modules with clear boundaries and low dependencies, and proceeded in waves to ensure each port built confidence and momentum.</p>
  </div>
</div>

<div class="case-study__image-wrapper case-study__image-wrapper--small">
  {% set imageData = {
    "imgPath": "/assets/images/work/anondb-modules.png",
    "alt": "A toy train traveling in an upwards direction",
    "sizes": "100vw",
    "loading": "lazy",
    "sizesArray": [760, 1440, 1920]
  } %}
  {{ imageAspectRatio(imageData, "1961/2048", "1961/2048") }}
</div>

<div class="case-study__section">
  <div class="case-study__text">
    Meanwhile, to ensure robust execution and skill transfer, we established a full-fledged testing and tooling infrastructure. We setup a CI pipeline covering tests, linting, sanitizers (including Miri), and coverage tracking. Concurrently, our team provided training, held workshops and presentations, and ran pair-review sessions to mentor the client's engineers through the Rust learning curve—embedding new practices while sustaining day-to-day development.
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Outcome</h3>
  <div class="case-study__text">
    <p>The collaboration has set the search engine on a clear path toward a safer, more maintainable codebase. Key modules have already been ported and released to the public, validating the approach and demonstrating tangible benefits. With a well-defined process for migrating C modules to Rust, a strong foundation of reusable Rust components, and growing in-house expertise, the client's team is steadily advancing its modernization journey—supported by Mainmatter’s experts, who continue to provide hands-on guidance throughout the transformation.</p>
  </div>
</div>

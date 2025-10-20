---
layout: case-study
company: Redis
problem: Redis wanted to convert a large C codebase to Rust but needed expertise.
solution: Our team collaborates closely with their engineers throughout the migration process, providing hands-on Rust mentoring along the way.
tags: Team Reinforcement
description: <p>Redis is the company behind the popular NoSQL database.</p><p>When they decided to migrate part of their C codebase to Rust, they turned to Mainmatter for support. Our team collaborates closely with their engineers throughout the migration process, teaching them Rust as we go.</p>
# TODO: add hero image, add og:image
hero:
  color: black
  image: "/assets/images/work/redis.jpg"
  imageAlt: "Close-up of a red LED grid pattern."
  tags: "Rust / development / mentoring"
title: "Modernizing Redis: Safe, Fast, Future-Ready | Work"
displayTitle: "Modernizing Redis: Safe, Fast, Future-Ready"
---

{% from "quote.njk" import quote %} {% from "image-aspect-ratio.njk" import imageAspectRatio %}

<div class="case-study__section">
  <div class="case-study__text">
    <p class="h4">Redis is an open-source, in-memory data store built for speed and reliability. It powers real-time applications around the world, from caching to analytics, with sub-millisecond performance. The project is maintained and advanced by Redis Inc.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Challenge</h3>
  <div class="case-study__text">
    <p>
      Redis’ core is a large and mature C codebase—highly optimized, but increasingly difficult to evolve safely at the pace of active development. Memory-safety issues and accumulated technical debt made change risky, even for experienced contributors. To address these challenges, Redis decided to gradually migrate parts of the codebase to Rust, aiming for stronger safety guarantees and more sustainable long-term development. With limited in-house Rust expertise, the team reach out to Mainmatter to guide them through the transition.
    </p>
  </div>
</div>

<section class="case-study__section">
  {% set imageData = {
    "imgPath": "/assets/images/work/redis-query-engine.png",
    "alt": "Screenshot of Redis Sandbox showing Query input and results",
    "sizes": "100vw",
    "loading": "lazy",
    "sizesArray": [760, 1440, 1920]
  } %}
  {{ imageAspectRatio(imageData, "160/99", "160/99") }}
</section>

<div class="case-study__section">
  <h3 class="case-study__heading">The Approach</h3>
  <div class="case-study__text">
    <p>We started by deconstructing the extensive C-codebase of the Redis Query Engine into modular components, prioritising the less entangled “leaf” modules for early migration. This incremental, step-by-step strategy allowed us to gradually substitute C modules with Rust while managing risk and preserving system stability. We mapped out a migration roadmap, selected modules with clear boundaries and low dependencies, and proceeded in waves to ensure each port built confidence and momentum.</p>
  </div>
</div>

<section class="case-study__section">
  <!-- TODO: add Luca's image of the module graph -->
  {% set imageData = {
    "imgPath": "/assets/images/work/redis-modules.png",
    "alt": "A toy train traveling in an upwards direction",
    "sizes": "100vw",
    "loading": "lazy",
    "sizesArray": [760, 1440, 1920]
  } %}
  {{ imageAspectRatio(imageData, "1961/2048", "1961/2048") }}
</section>

<div class="case-study__section">
  <div class="case-study__text">
    Meanwhile, to ensure robust execution and skill transfer, we established a full-fledged testing and tooling infrastructure. We setup a CI pipeline covering tests, linting, sanitizers (including Miri), and coverage tracking. Concurrently, our team provided training, held workshops and presentations, and ran pair-review sessions to mentor Redis engineers through the Rust learning curve—embedding new practices while sustaining day-to-day development.
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Outcome</h3>
  <div class="case-study__text">
    <p>The collaboration has set Redis on a clear path toward a safer, more maintainable codebase. Key modules have already been ported and released with Redis 8.2, validating the approach and demonstrating tangible benefits. With a well-defined process for migrating C modules to Rust, a strong foundation of reusable Rust components, and growing in-house expertise, Redis is steadily advancing its modernization journey—supported by Mainmatter’s experts, who continue to provide hands-on guidance throughout the transformation.</p>
  </div>
</div>

<!-- replace (or remove) quote -->

{% set content = {
  "text": "Mainmatter enabled us to take our Product Development Organization to the next level. They work closely with our team and help us establish new practices while simultaneously delivering on our day to day product initiatives. Their technical and organizational expertise and fresh views allow us to set up the foundation for future success.",
  "source": "Jürgen Witte, CPO @ Rail Europe",
  "image": "/assets/images/photos/juergen-witte.png",
  "alt": "Jürgen Witte",
  "loading": "lazy"
} %} {{ quote(content) }}

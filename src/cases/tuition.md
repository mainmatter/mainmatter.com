---
layout: case-study
company: Tuition
title: Ensuring long-term codebase health through the Ember Initiative | Work
displayTitle: "Ensuring long-term codebase health through the Ember Initiative"
tags: Ember Initiative
description: <p>Tuition.io helps employers offer simple, effective education benefits like tuition assistance and student loan repayment.</p><p>Through their Ember Initiative membership, we helped them upgrade their codebase and ensure its long-term health.</p>
hero:
  color: purple
  image: "/assets/images/work/tuition.jpg"
  imageAlt: "A group of college students sit in a classroom taking notes, while one student stands beside her desk holding notebooks and a backpack."
  tags: "development / consulting / Ember.js"
og:
  image: /assets/images/cases/cs-trainline-og-image.jpg
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <div class="case-study__text">
    <p class="h4">Tuition.io is a benefits platform that helps employers offer tuition assistance, student loan repayment, and education guidance in one system—reducing administrative overhead for HR teams and financial stress for employees.</p>
    <p>Tuition joined Mainmatter’s <a href="/ember-initiative/">Ember Initiative</a> to modernize their Ember.js codebase and reduce long-term maintenance risk. They were looking for direct access to Ember expertise and hands-on support for several critical upgrades.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Incremental Improvements with Immediate Impact</h3>
  <div class="case-study__text">
    <p>We started by migrating their build system to Vite, which significantly improved local development speed and reduced CI build times. This work demonstrated for the entire Ember ecosystem what modern Ember tooling can look like beyond ember-cli. We then integrated ember-intl with Vite, enabling live reloading for translations so engineers no longer needed to restart the development server when copy changed. Finally, we upgraded the project to Glint 2, improving type safety, autocomplete, and overall developer confidence.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">A Codebase Built to Last</h3>
  <div class="case-study__text">
    <p>After a few months of collaboration, Tuition’s Ember.js setup is fully up to date with modern tooling and practices. Their team now works faster, catches issues earlier, and has a stable foundation for future feature work—without needing large, disruptive upgrades down the line.</p>
  </div>
</div>

{% set content = {
  "text": "Being a member of the Ember Initiative is providing great help. We're 100% Vite, fixed many outstanding issues, and on the remaining things we have a plan to move forward.",
  "source": "Cory Loken, Tuition"
} %} {{ quote(content) }}

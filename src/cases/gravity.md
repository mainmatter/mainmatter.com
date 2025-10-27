---
layout: case-study
company: Gravity
title: "Gravity: Keep your artifact sizes under control | Work"
displayTitle: "Gravity: Keep your artifact sizes under control"
description: <p>It's easy to miss small changes that have a big impact on a project's artifact sizes.</p><p>Added npm packages end up exploding bundle sizes, oversized and uncompressed images make it to websites, etc. We built Gravity to help teams catch such regressions early.</p>
cta: gravity
hero:
  color: purple
  image: "/assets/images/work/gravity-visual.jpg"
  imageAlt: "Gravity logo floating in space"
  tags: "Mainmatter Product"
og:
  image: /assets/images/cases/cs-gravity-og-image.jpg
---

{% from "image-aspect-ratio.njk" import imageAspectRatio %} {% from "quote.njk" import quote %}

<div class="case-study__section">
  <div class="case-study__text">
    <p>Working with numerous teams over the years on all kinds of <a href="/work/">projects</a>, we've noticed a common issue over and over: small changes can lead to big impacts on artifact sizes which go unnoticed until they hit production systems. Adding a new npm package might bloat your frontend app, unoptimized images can slow down your website, and even binary assets like Docker images or Rust crates can grow disproportionally. These size increases result in slower load times, extra computation, and higher data transfer and storage costs.</p>
  </div>
</div>

<div class="case-study__section">
  {% set imageData = {
    "imgPath": "/assets/images/work/gravity-laptop-visualized.jpg",
    "alt": "Gravity website open on a laptop",  
    "sizes": "100vw",
    "loading": "lazy",
    "sizesArray": [760, 1440, 1920]
  } %}
  {{ imageAspectRatio(imageData, "32/13", "35/19") }}
</div>

<div class="case-study__section">
  <div class="case-study__text">
    <p>We built Gravity to help teams catch regressions before they hit production. Inspired by visual regression tools like <a href="http://percy.io">Percy</a> or <a href="http://chromatic.com">Chromatic</a>, Gravity integrates seamlessly into the developer workflow:</p>
    <ol class="text-with-list__list text-with-list__list--ordered">
    <li>For each new pull request, Gravity analyzes the relevant artifacts. If it spots new or growing artifacts, it adds a failing check to the PR, preventing it from being merged.</li>
    <li>The engineer reviews the changes in Gravity. If the changes are intentional, they approve them. If not, they go back and fix the issues.</li>
    <li>Once all changes are approved, the Gravity check turns green, and the PR is ready to merge.</li>
  </div>
</div>

<div class="case-study__section">
  <div class="case-study__text rte">
    <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2vD_geF_Ask" title="Gravity Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>
</div>

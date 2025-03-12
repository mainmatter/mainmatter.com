---
layout: case-study
company: Gravity
title: "Gravity: Keep your artifact sizes under control | Work"
displayTitle: "Gravity: Keep your artifact sizes under control"
description: <p>It's easy to miss small changes that have a big impact on a project's artifact sizes.</p><p>Added npm packages end up exploding bundle sizes, oversized and uncompressed images make it to websites, etc. We built Gravity to help teams catch such regressions early.</p>
hero:
  color: purple
  image: "/assets/images/work/gravity-background.svg" # TODO: better background image
  imageAlt: "TODO" # TODO
  tags: "Mainmatter Product"
og:
  image: /assets/images/cases/cs-kisters-og-image.jpg # TODO: add og:image
---

{% from "image-aspect-ratio.njk" import imageAspectRatio %} {% from "quote.njk" import quote %}

<div class="case-study__section">
  <div class="case-study__text">
    <p>Working with numerous teams over the years on all kinds of [projects](/work/), we've noticed a common issue over and over: small changes can lead to big impacts on artifact sizes which go unnoticed until they hit production systems. Adding a new npm package might bloat your frontend app, unoptimized images can slow down your website, and even binary assets like Docker images or Rust crates can grow disproportionally. These size increases result in slower load times, extra computation, and higher data transfer and storage costs.</p>
  </div>
</div>

<div class="case-study__section">
  <div class="case-study__text">
    TODO: add Gravity image here
  </div>
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
  <div class="case-study__text">
    TODO: add video here
  </div>
</div>

<div class="case-study__section">
  <div class="case-study__text">
    TODO: Gravity Teaser
  </div>
</div>

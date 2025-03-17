---
layout: case-study
company: KISTERS
problem: KISTERS wanted to handle traffic spikes by dynamically moving computation to different platforms.
solution: We created a data-processing package suitable for server, edge, and WASM.
tags: Team Reinforcement
title: Dynamically switching execution platforms with Rust | Work
displayTitle: "Dynamically switching execution platforms with Rust"
description: <p>KISTERS builds solutions for collecting, analyzing, and providing information based on environmental data. The HydroMet division provides software that helps warn people of upcoming floods using data obtained from numerous sensor devices deployed across the globe.</p>
hero:
  color: purple
  image: "/assets/images/work/kisters-background.jpg"
  imageAlt: "Wave in the ocean"
  tags: "development / architecture / Rust"
og:
  image: /assets/images/cases/cs-kisters-og-image.jpg
---

{% from "image-aspect-ratio.njk" import imageAspectRatio %} {% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About KISTERS</h3>
  <div class="case-study__text">
    <p><a href="http://kisters.eu/">KISTERS</a> provides software for collecting and analyzing environmental data.<br>
      In particular, they provide solutions to warn people of upcoming floods using data obtained from numerous sensor devices deployed throughout the globe.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The challenge</h3>
    <div class="case-study__text">
      <p>KISTERS needed the ability to dynamically move computation between traditional servers and edge functions, or offloading to end-user devices. That way, they would be able to <strong>handle large traffic spikes efficiently without risking astronomic cloud expenses</strong></p>
      <p>The large amounts of data KISTERS obtains from sensor devices need processing to become useful for analysis. Filtering, grouping, and post-processing, depend on dynamic inputs and need to be carried out on demand.</p>
      <p>That in and of itself warrants a well-optimized design and use of performant technologies, but in times of calamity, <strong>the amount of users requesting information may rise quickly</strong>: residents of endangered areas can use KISTERS’ software to obtain real-time information regarding their situation.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">How Mainmatter helped out</h3>
    <div class="case-study__text">
        <p>Mainmatter proposed and implemented an architecture that isolates the data processing implementation in a platform-independent package written in Rust.<p>
        <p>That package can be thinly wrapped for use in a web server, run as an edge function, or compiled to Web Assembly (WASM) for execution in browsers. All of these different environments run the same efficient code with close to no duplication.</p>
    </div>
</div>

<section class="mt-5">
        {% set imageData = {
          "imgPath": "/assets/images/work/kisters-graph.png",
          "alt": "KISTERS software open on a laptop",
          "sizes": "100vw",
          "loading": "lazy",
          "sizesArray": [760, 1440, 1920]
        } %}
        {{ imageAspectRatio(imageData, "32/13", "35/19") }}
</section>

<div class="case-study__section">
  <h3 class="case-study__heading">Technology</h3>
    <div class="case-study__text">
      <p></p>
      <p>Rust, with its strong performance and stability characteristics and solid WASM support, was a natural choice as a language with which to implement the design. What’s more, <a href="https://pola.rs/">Polars</a>, the famous high-performance open-source data frame manipulation library, is implemented in Rust itself and easily usable in Rust projects including those targeting WASM.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Aftercare</h3>
    <div class="case-study__text">
      <p>Upon finishing and delivering the proof-of-concept, Mainmatter provided guidance to KISTERS' team on integrating the code into their platform.</p>
      <p>Mainmatter has reviewed and optimized the integration code during several pairing sessions with KISTERS’ engineering team, ensuring the delivery of both the product and the technical knowledge required to maintain and expand it.</p>
    </div>  
</div>

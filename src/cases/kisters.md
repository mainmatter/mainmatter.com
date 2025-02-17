---
layout: case-study
company: KISTERS
problem: KISTERS wanted to use Rust's cross-platform support to its full potential.
solution: We created a data processing package suitable for server, edge, and WASM.
tags: Launch your idea
title: Dynamically switching execution platforms with Rust | Work
displayTitle: "Dynamically switching execution platforms with Rust"
description: <p>KISTERS builds solutions for collecting, analyzing, and providing information based on environmental data.</p><p>The department we’ve been working with provides software that can help warn people of upcoming floods using data obtained from numerous sensor devices deployed throughout the globe.</p>
hero:
  color: purple
  image: "/assets/images/work/aleph-alpha-background-2.jpg" # TODO
  imageAlt: "TODO" # TODO
  tags: "development / architecture / Rust"
og:
  image: /assets/images/cases/cs-aleph-alpha-og-image.jpg # TODO
---

{% from "image-aspect-ratio.njk" import imageAspectRatio %} {% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About KISTERS</h3>
  <div class="case-study__text">
    <p>Based in Aachen, Germany, <a href="http://kisters.eu/">KISTERS</a> provides software for collecting, analyzing, and providing information based on environmental data.<br>
      The department we’ve been working with provides solutions that can help warn people of upcoming floods using data obtained from numerous sensor devices deployed throughout the globe.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The challenge</h3>
    <div class="case-study__text">
      <p>With big data comes big computation. KISTERS wanted to <strong>handle large traffic spikes by dynamially switching</strong> between serving from a traditional server, from an edge function, or by offloading cumputation to end user's devices.</p>
      <p>The data KISTERS obtains from their sensor devices is packaged in large <a href="https://en.wikipedia.org/wiki/Apache_Parquet">parquet files</a> and needs processing to become useful for analysis.<br>
        The concrete steps taken in filtering, grouping, and post-processing depend on dynamic inputs reflecting the needs of KISTERS’ clients. These processing steps can, therefore, not simply be executed in batches during nightly computations; they need to be carried out on user demand.</p>
      <p>That in and of itself warrants a well-optimized design, but in times of calamity, <strong>the amount of users requesting information may rise quickly</strong>: residents of endangered areas can use KISTERS’ software to obtain real-time information regarding their situation.</p>
      <p><strong>To handle traffic spikes</strong>, KISTERS’ sought to employ a design that would allow them to <strong>quickly deploy their data processing to edge functions</strong> and, in case of extreme traffic surges, allow the processing steps to be <strong>run within the browser</strong> on end user’s devices.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">How Mainmatter helped out</h3>
    <div class="case-study__text">
        <p>During an initial development cycle, Mainmatter proposed and implemented an architecture that isolates the implementation of the data processing steps in a platform-independent package<p>
        <p>That way, the package can be thinly wrapped for use by a web server, served as an edge function, or compiled to Web Assembly for execution in browsers.</p>
    </div>
</div>

<section class="mt-5">
        <!-->TODO add image for KISTERS<-->
        {% set imageData = {
          "imgPath": "/assets/images/work/aleph-alpha-graphs.jpg",
          "alt": "TODO",
          "sizes": "100vw",
          "loading": "lazy",
          "sizesArray": [760, 1440, 1920]
        } %}
        {{ imageAspectRatio(imageData, "32/13", "35/19") }}
</section>

<div class="case-study__section">
  <h3 class="case-study__heading">Technology</h3>
    <div class="case-study__text">
      <p>Given the requirement of <strong>high performance, cross-platform code sharing</strong>, and the need for <strong>integration with their current software</strong>, Rust was a natural choice as a language with which to implement the architecture.<br>
      What’s more, <a href="https://pola.rs/">Polars</a>, the famous high-performance open-source data frame manipulation library, is implemented in Rust and <a href="https://crates.io/crates/polars">published</a> on Rust’s package registry, allowing our engineers to <strong>trivially import it as a dependency</strong> in their application and reap the <strong>benefits of executing data processing in Rust</strong>.</p>
      <p>Rust has proven to be an excellent basis for developing performant applications that are required to run on multiple platforms, including the end user’s browser.</p>
    </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Aftercare</h3>
    <div class="case-study__text">
      <p>Upon finishing and delivering the proof-of-concept, Mainmatter provided guidance to their team on integrating it into KISTERS’ platform.</p>
      <p>Mainmatter has reviewed and optimized the integration code during several pairing sessions, ensuring that not just the product but also the knowledge required to maintain and expand it is transferred to KISTERS’ engineering team.</p>
    </div>  
</div>

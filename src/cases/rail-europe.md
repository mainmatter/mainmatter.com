---
layout: case-study
company: Rail Europe
title: Transformation for Growth | Work
displayTitle: Transformation for Growth
description:
  <p>Rail Europe is the reference brand for European train booking, providing
  technology service solutions to +15,000 travel professionals in 70
  countries.</p><p>When setting off on their growth initiative, Rail Europe
  reached out to Mainmatter to perform an audit of their existing tech platform.
  We identified impediments and since support their team to address those which
  includes fixing performance bottlenecks and rebuilding the B2C offering in
  Svelte.</p>
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/rail-europe.jpg"
  imageAlt: "Train tracks on gravel"
  tags: "strategic advice / process / mentoring"
og:
  image: /assets/images/cases/cs-rail-europe-og-image.jpeg
---

{% from "quote.njk" import quote %}
{% from "image-aspect-ratio.njk" import imageAspectRatio %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">About Rail Europe</h2>
  <div class="case-study__text">
    <h3 class="h4">Rail Europe was founded in 1931 and is looking back at an impressive history of 90+ years in the travel industry. Over the years, the company established itself as the go-to brand for European train bookings and technology solutions for over 15,000 travel professionals in 70 countries.</h3>
    <p>Over the past few years, Rail Europe has gone through some major changes, from being part of SNCF to eventually being acquired by an investor with ambitious goals.</p>
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
  <h2 class="case-study__heading h5">The Challenge</h2>
  <div class="case-study__text">
    <p>In 2022, while the travel industry was still recovering from the pandemic, Rail Europe was acquired by a private equity firm and thus became independent from SNCF Voyageurs and SBB, the previous parent companies. Along with the acquisition came ambitious plans for the future and Rail Europe embarked on a growth initiative, aiming to significantly expand the business.</p>
    <p>Rail Europe was looking for an experienced partner to assess their platform, address concerns, and suggest a route forward. Because of our broad experience building large scale tech products and our previous experience in the Rail industry, Mainmatter was an ideal fit for the project.</p>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">The Assessment</h2>
  <div class="case-study__text">
    <p>To tackle the challenge and answer Rail Europe’s questions, we conducted a comprehensive assessment of the existing code, infrastructure, and processes. We also interviewed a diverse group of members of Rail Europe’s team, including top management, engineers, designers, as well as business stakeholders. This allowed us to gain a holistic understanding of the status quo and provide a detailed report with a clear tech transformation roadmap.</p>
  </div>
</div>

{% set 'content' = {
  "text": "Mainmatter enabled us to take our Product Development Organization to the next level. They work closely with our team and help us establish new practices while simultaneously delivering on our day to day product initiatives. Their technical and organizational expertise and fresh views allow us to set up the foundation for future success.",
  "source": "Jürgen Witte, CPO @ Rail Europe",
  "image": "/assets/images/photos/juergen-witte.png",
  "alt": "Jürgen Witte",
  "loading": "lazy"
} %} {{ quote(content) }}

<div class="case-study__section">
  <h2 class="case-study__heading h5">The Execution</h2>
  <div class="case-study__text">
    <p>We merged with their team and have since supported them along the way. To kickstart the work, we immediately focused on two main aspects of the initiative. Firstly, we started building a new B2C offering using Svelte and SvelteKit, a cutting-edge web framework. Secondly, we worked on improving the performance of a key part of their system.</p>
    <p>Throughout the collaboration, we not only actively contribute to those tech initiatives but also mentor the Rail Europe team on new technologies like Svelte. As we go, we also challenge the status quo in terms of tooling, infrastructure, and process – we support Rail Europe’s team to critically look at every aspect of the product development organization and bring in our expertise to pave the way towards a leaner, more efficient way of working for the future.</p>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">The Outcome</h2>
  <div class="case-study__text">
    <p>By integrating with their team for the initiative, we are able to help Rail Europe move forward without the need to build up internal expertise from scratch first. Instead, we help build up the expertise as we progress on the project, ensuring a sustainable future.</p>
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

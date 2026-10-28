---
layout: case-study
company: Qonto
title: "Qonto: Scaling fast without slowing down | Work"
displayTitle: "Qonto: Scaling fast without slowing down"
problem: Qonto was facing impediments that were impeding throughput and ability to scale.
solution: We helped them lay the foundations for sustainable growth at an accelerated pace and high quality.
tags: Team reinforcement
description: <p>Qonto is the leading neobank for SMEs and freelancers in Europe.</p><p>Mainmatter worked with their web frontend team to boost their productivity, establish best practices, and allow for fast growth.</p>
hero:
  color: purple
  image: "/assets/images/work/qonto.jpg"
  imageAlt: "Woman holds a credit card while using the Qonto web application"
  tags: "engineering foundations / architecture / mentoring"
og:
  image: /assets/images/cases/cs-qonto-og-image.webp
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About Qonto</h3>
  <div class="case-study__text">
    <p class="h4">Qonto is a European B2B Neobank for freelancers and SMEs. They provide over 600,000 clients with banking services, virtual and physical credit cards, and tools for accounting and expense management.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Sustainable growth with an ambitious timeline</h3>
  <div class="case-study__text">
    <p>Qonto’s frontend engineering team needed to rapidly scale their operations after the company raised its series B funding. Faced with a number of impediments that were slowing down their workflow, Qonto opted to bring in Mainmatter’s senior experts to help them release new features quickly while laying the foundations for sustainable growth at an accelerated pace.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Getting to the heart of the matter</h3>
  <div class="case-study__text">
    <p>We met with Qonto's team in their office in Paris to kick off the collaboration. We sat down with the relevant stakeholders to develop an understanding of their business, their technology, infrastructure, tools and processes. We reviewed the existing codebase and interviewed the frontend team to understand their main challenges. At the end of this process, we had a clear understanding of the status quo as well as the main obstacles the team was facing.</p>
  </div>
</div>

{% set content = {
  "text": "Mainmatter are well known as experts and they absolutely live up to the expectations. They had an immediate as well as significant positive impact on both our velocity and quality of output.",
  "source": "Marc-Antoine Lacroix, Qonto CPO",
  "image": "/assets/images/photos/qonto-marc-antoine-quote.jpg",
  "alt": "Elements of Qonto user interface on a mobile device",
  "loading": "lazy"
} %} {{ quote(content) }}

<div class="case-study__section">
  <h3 class="case-study__heading">Clearing the roadblocks</h3>
  <div class="case-study__text">
    <p>In the first few weeks of the project, we migrated the frontend application away from a legacy template language and moved it back on to standard patterns. We cut CI build times in half, and fixed instabilities that were causing flaky test results. These changes immediately improved the team’s productivity.</p>
    <p>We then helped the team ship critical features on ambitious timelines. Our experts spearheaded these initiatives, working closely with Qonto's in-house engineers to ensure that they would be able to take ownership with confidence after our collaboration was complete.</p>
    <p>We evolved the application’s architecture and engineering infrastructure to accelerate development while maintaining a high level of quality. We set up automated visual regression testing to prevent unintended changes to the product UI being released to production.</p>
    <p>We put a system in place for tracking the application's bundle size to prevent size and performance regressions. This led to a 25% reduction of the application's main bundle over two months.</p>
    <p>Lastly, we invested time and effort in setting up an advanced linting system to identify bad patterns, unused translation strings, and other common pitfalls.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/qonto-ui.jpg", "Screenshot of the Qonto app", '50rem', "lazy", 'case-study__image', [1600] %}
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Empowering the team</h3>
  <div class="case-study__text">
    <p>Our work with Qonto was highly collaborative. Beyond the product design and development work itself, we also conducted workshops and pair-programming sessions with their engineers to help them develop a deeper understanding of their tools. We set them up for success by sharing our expertise so they could carry on with confidence.</p>
  </div>
</div>

{% set content = {
  "text": "Working with mainmatter’s experts has always been a good experience. We can really feel that they have mastery on many topics, and knowledge about complex technical problems. I’ve learned so much, especially during our pairing sessions, and it allows me to improve my technical skillsand growth as an engineer.",
  "source": "Alexandre Monjol, Frontend Engineer at Qonto",
  "image": "/assets/images/photos/qonto-alexander.png",
  "alt": "Alexandre Monjol, smiling at the camera wearing a Qonto t-shirt",
  "loading": "lazy"
} %} {{ quote(content) }}

---
layout: case-study
company: Qonto
companyDescription: Qonto is a B2B Neobank that provides banking services and credit cards to more than 75,000 freelancers and SMEs in Europe.
title: Co-Engineering the Future of Banking for SMEs with Qonto | Work
displayTitle: "A helping hand for a <em>visionary</em> fintech startup"
description: <p>Qonto is the leading neobank for SMEs and freelancers in Europe.</p><p>Mainmatter worked with their web frontend team to boost their productivity, establish Ember.js best practices, and ensure long-term success.</p>
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/qonto.jpg"
  imageAlt: "Woman holds a credit card while using the Qonto web application"
  tags: "development / refactoring / mentoring"
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">About Qonto</h2>
  <div class="case-study__text">
    <h3 class="h4">Qonto is a European B2B Neobank for freelancers and SMEs. They provide over 75,000 clients with banking services, virtual and physical credit cards, and tools for accounting and expense management. In 2019 alone, they processed €10 billion in transactions.</h3><br>
    <p>The fintech company was rated among the five hottest startups in Europe by The Next Web. They’ve raised more than €150 million since they entered the market in 2017.</p>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">Sustainable growth with an ambitious timeline</h2>
  <div class="case-study__text">
    <p>Qonto’s frontend engineering team needed to rapidly scale their operations after the company raised its series B funding. Faced with a number of impediments that were slowing down their workflow, Qonto opted to bring in Mainmatter’s senior experts to help them release new features quickly while laying the foundations for sustainable growth at an accelerated pace.</p>
  </div>
</div>

{% include 'content/secondary-feature-ember.njk' %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">Getting to the heart of the matter</h2>
  <div class="case-study__text">
    <p>We met with Qonto's team in their office in Paris to kick off the collaboration. We sat down with the relevant stakeholders to develop an understanding of their business, their technology, infrastructure, tools and processes. We reviewed the existing Ember.js codebase and interviewed the frontend team to understand their main challenges. At the end of this process, we had a clear understanding of the status quo as well as the main obstacles the team was facing.</p>
  </div>
</div>

{% set 'content' = {
  "text": "mainmatter are well known as the Ember.js experts and they absolutely live up to the expectations. They had an immediate as well as significant positive impact on both our velocity and quality of output.",
  "source": "MARC-ANTOINE LACROIX, QONTO CPO",
  "image": "/assets/images/photos/qonto-marc-antoine-quote.jpg",
  "alt": "Elements of Qonto user interface on a mobile device",
  "loading": "lazy"
} %}
{{ quote(content) }}

<div class="case-study__section">
  <h2 class="case-study__heading h5">Clearing the roadblocks</h2>
  <div class="case-study__text">
    <p>In the first few weeks of the project, we migrated the application away from a legacy template language and moved it back on to standard Ember.js patterns. We cut CI build times in half, and fixed instabilities that were causing flaky test results. These changes immediately improved the team’s productivity.</p>
    <p>We then helped the team ship critical features on ambitious timelines. Our experts spearheaded these initiatives, working closely with Qonto's in-house engineers to ensure that they would be able to take ownership with confidence after our collaboration was complete.</p>
    <p>We evolved the application’s architecture and engineering infrastructure to accelerate development while maintaining a high level of quality. We set up automated visual regression testing to prevent unintended changes to the product UI being released to production.</p>
    <p>We put a system in place for tracking the application's bundle size to prevent size and performance regressions. This led to a 25% reduction of the application's main bundle over two months.</p>
    <p>Lastly, we invested time and effort in setting up an advanced linting system to identify bad patterns, unused translation strings, and other common pitfalls.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/qonto-ui.jpg", "Screenshot of the Qonto app", '50rem', "lazy", 'case-study__image', [800, 1200] %}
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">Empowering the team</h2>
  <div class="case-study__text">
    <p>Our work with Qonto was highly collaborative. Beyond the product design and development work itself, we also conducted workshops and pair-programming sessions with their engineers to help them develop a deeper understanding of their tools. We set them up for success by sharing our expertise so they could carry on with confidence.</p>
  </div>
</div>

{% set 'content' = {
  "text": "Working with mainmatter’s experts has always been a good experience. We can really feel that they have mastery on many topics, and knowledge about complex technical problems. I’ve learned so much, especially during our pairing sessions, and it allows me to improve my technical skillsand growth as an engineer.",
  "source": "ALEXANDRE MONJOL, FRONTEND ENGINEER AT QONTO",
  "image": "/assets/images/photos/qonto-alexander.png",
  "alt": "Alexandre Monjol, smiling at the camera wearing a Qonto t-shirt",
  "loading": "lazy"
} %}
{{ quote(content) }}

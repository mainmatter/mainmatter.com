---
layout: case-study
company: Qonto
title: Co-Engineering the Future of Banking for SMEs with Qonto | Work
displayTitle: "A helping hand for a visionary fintech startup"
problem:
  Qonto was facing a number of impediments that were slowing down their
  workflow.
solution:
  We helped them release new features quickly while laying the foundations for
  sustainable growth at an accelerated pace.
tags: Team Reinforcement
description:
  <p>Qonto is the leading neobank for SMEs and freelancers in
  Europe.</p><p>Mainmatter worked with their web frontend team to boost their
  productivity, establish Ember.js best practices, and ensure long-term
  success.</p>
hero:
  color: purple
  image: "/assets/images/work/qonto.jpg"
  imageAlt: "Woman holds a credit card while using the Qonto web application"
  tags: "development / refactoring / mentoring"
og:
  image: /assets/images/cases/cs-qonto-og-image.jpg
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About Qonto</h3>
  <div class="case-study__text">
    <p class="h4">Qonto is a European B2B Neobank for freelancers and SMEs. They provide over 75,000 clients with banking services, virtual and physical credit cards, and tools for accounting and expense management. In 2019 alone, they processed €10 billion in transactions.</p>
    <p>The fintech company was rated among the five hottest startups in Europe by The Next Web. They’ve raised more than €150 million since they entered the market in 2017.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Sustainable growth with an ambitious timeline</h3>
  <div class="case-study__text">
    <p>Qonto’s frontend engineering team needed to rapidly scale their operations after the company raised its series B funding. Faced with a number of impediments that were slowing down their workflow, Qonto opted to bring in Mainmatter’s senior experts to help them release new features quickly while laying the foundations for sustainable growth at an accelerated pace.</p>
  </div>
</div>

 <div class="split-content">
 <a href="https://emberjs.com/sponsors/" class="split-content__link"></a>
    <div class="split-content__wrapper">
        <div class="split-content__content">
          <h4>We are an official sponsor of the Ember.js project.</h4>
        </div>
        <div class="split-content__feature">
          <a href="https://emberjs.com/sponsors/" class="btn-secondary h4 mt-2">
          {% include 'content/secondary-feature-ember.njk' %}
          </a>
        </div>
      </div>
    </div>

<div class="case-study__section">
  <h3 class="case-study__heading">Getting to the heart of the matter</h3>
  <div class="case-study__text">
    <p>We met with Qonto's team in their office in Paris to kick off the collaboration. We sat down with the relevant stakeholders to develop an understanding of their business, their technology, infrastructure, tools and processes. We reviewed the existing Ember.js codebase and interviewed the frontend team to understand their main challenges. At the end of this process, we had a clear understanding of the status quo as well as the main obstacles the team was facing.</p>
  </div>
</div>

{% set 'content' = {
  "text": "Mainmatter are well known as the Ember.js experts and they absolutely live up to the expectations. They had an immediate as well as significant positive impact on both our velocity and quality of output.",
  "source": "Marc-Antoine Lacroix, Qonto CPO",
  "image": "/assets/images/photos/qonto-marc-antoine-quote.jpg",
  "alt": "Elements of Qonto user interface on a mobile device",
  "loading": "lazy"
} %} {{ quote(content) }}

<div class="case-study__section">
  <h3 class="case-study__heading">Clearing the roadblocks</h3>
  <div class="case-study__text">
    <p>In the first few weeks of the project, we migrated the application away from a legacy template language and moved it back on to standard Ember.js patterns. We cut CI build times in half, and fixed instabilities that were causing flaky test results. These changes immediately improved the team’s productivity.</p>
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

{% set 'content' = {
  "text": "Working with Mainmatter’s experts has always been a good experience. We can really feel that they have mastery on many topics, and knowledge about complex technical problems. I’ve learned so much, especially during our pairing sessions, and it allows me to improve my technical skillsand growth as an engineer.",
  "source": "Alexandre Monjol, Frontend Engineer at Qonto",
  "image": "/assets/images/photos/qonto-alexander.png",
  "alt": "Alexandre Monjol, smiling at the camera wearing a Qonto t-shirt",
  "loading": "lazy"
} %} {{ quote(content) }}

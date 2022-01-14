---
layout: case-study
company: Qonto
companyDescription: Qonto is a B2B Neobank that provides banking services and credit cards to more than 75,000 freelancers and SMEs in Europe.
title: Co-Engineering the Future of Banking for SMEs with Qonto | Work
displayTitle: "A helping hand for a <em>visionary</em> fintech startup"
description: Qonto is the leading neobank for SMEs and freelancers in Europe. Mainmatter worked with their web frontend team to boost their productivity, establish Ember.js best practices, and ensure long-term success.
hero:
  color: aqua
  desktopTextPosition: "right"
  image: "/assets/images/work/qonto.jpg"
  imageAlt: "Woman holds a credit card while using the Qonto web application"
---

{% from "quote.njk" import quote %}
{% from "split-quote.njk" import splitQuote %}
{% from "image-stacked.njk" import imageStacked %}
{% from "color-image.njk" import colorImage %}

<div class="case-study__body">

<p class="post__tagline">
Qonto is a European B2B Neobank for freelancers and SMEs. They provide over 75,000 clients with banking services, virtual and physical credit cards, and tools for accounting and expense management. In 2019 alone, they processed €10 billion in transactions.
</p>
<p class="post__tagline">
The fintech company was rated among the five hottest startups in Europe by The Next Web. They’ve raised more than €150 million since they entered the market in 2017.
</p>

## Sustainable growth with an ambitious timeline

Qonto’s frontend engineering team needed to rapidly scale their operations after the company raised its series B funding. Faced with a number of impediments that were slowing down their workflow, Qonto opted to bring in Mainmatter’s senior experts to help them release new features quickly while laying the foundations for sustainable growth at an accelerated pace.

</div>

{% include 'content/secondary-feature-ember.njk' %}

{% set 'contentBlocks' = [{
  "image": "/assets/images/photos/collaboration@1200.jpg",
  "alt": "Alt text",
  "loading": "lazy"
},{
  "image": "/assets/images/photos/collaboration@1200.jpg",
  "alt": "Alt text",
  "loading": "lazy",
  "small": true
}] %}
{{- imageStacked('left', contentBlocks) -}}

<div class="case-study__body">

## Getting to the heart of the matter

We met with Qonto's team in their office in Paris to kick off the collaboration. We sat down with the relevant stakeholders to develop an understanding of their business, their technology, infrastructure, tools and processes. We reviewed the existing Ember.js codebase and interviewed the frontend team to understand their main challenges. At the end of this process, we had a clear understanding of the status quo as well as the main obstacles the team was facing.

</div>

{% set text = "simplabs are well known as the Ember.js experts and they absolutely live up to the expectations. They had an immediate as well as significant positive impact on both our velocity and quality of output." %}
{% set source = "Marc-Antoine Lacroix, Qonto CEO" %}
{{ quote('aqua', text, source, true) }}

<div class="case-study__body">

## Clearing the roadblocks

In the first few weeks of the project, we migrated the application away from a legacy template language and moved it back on to standard Ember.js patterns. We cut CI build times in half, and fixed instabilities that were causing flaky test results. These changes immediately improved the team’s productivity.

We then helped the team ship critical features on ambitious timelines. Our experts spearheaded these initiatives, working closely with Qonto's in-house engineers to ensure that they would be able to take ownership with confidence after our collaboration was complete.

We evolved the application’s architecture and engineering infrastructure to accelerate development while maintaining a high level of quality. We set up automated visual regression testing to prevent unintended changes to the product UI being released to production.

<figure>
  <img
    src="/assets/images/work/qonto-comp.jpg"
    alt="Screenshot of the Qonto app, and a Qonto card"
  />
  <figcaption>
    Qonto is a business account for freelancers, startups and SMEs. We shared our expertise to help build a product used by over 75000 customers.
  </figcaption>
</figure>

We put a system in place for tracking the application's bundle size to prevent size and performance regressions. This led to a 25% reduction of the application's main bundle over two months.

Lastly, we invested time and effort in setting up an advanced linting system to identify bad patterns, unused translation strings, and other common pitfalls.

</div>

{% set 'content' = {
  "image": "/assets/images/work/qonto-alternative.jpg",
  "alt": "Man holds a credit card while looking at the Qonto web application",
  "loading": "lazy"
} %}
{{ colorImage('blue', 'lg', content) }}

<div class="case-study__body">

## Empowering the Team

Our work with Qonto was highly collaborative. Beyond the product design and development work itself, we also conducted workshops and pair-programming sessions with their engineers to help them develop a deeper understanding of their tools. We set them up for success by sharing our expertise so they could carry on with confidence.

</div>

{% set 'content' = {
  "text": "Working with simplabs’ experts has always been a good experience. We can really feel that they have mastery on many topics, and knowledge about complex technical problems. I’ve learned so much, especially during our pairing sessions, and it allows me to improve my technical skillsand growth as an engineer..",
  "source": "Alexandre Monjol, Frontend Engineer at Qonto",
  "image": "/assets/images/photos/qonto-alexander.jpg",
  "alt": "Alexandre Monjol, smiling at the camera wearing a Qonto t-shirt",
  "loading": "lazy"
} %}
{{- splitQuote('right', 'purple', content) -}}

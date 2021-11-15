---
layout: case-study
title: Co-Engineering the Future of Banking for SMEs with Qonto | Work
display_title: "Qonto: Co-Engineering the Future of Banking for SMEs"
description: Qonto is a european B2B Neobank for freelancers and SMEs. We helped their team deliver mission critical features and scale sustainably.
---

{% from "quote.njk" import quote %}

Qonto is a european B2B Neobank for freelancers and SMEs. They offer bank accounts, virtual and physical credit
cards, and tools for accounting and expenses management. They are serving over 75000 customers and have processed
€10 Billion worth of transactions in 2019.
The FinTech company was rated among the five hottest startups in Europe by The Next Web and has raised more than
€130 Million within three years since market entry in 2017.

## The Challenge

After successfully raising a series B round, Qonto’s frontend engineering team realized they needed more people
and knowledge to keep up with the ambitious goals that came with that. They needed to bring in senior experts to
be able to release new features in the Ember.js based banking UI following an ambitious timeline. With the very
fast growth of the company, the team also faced a number of impediments that impacted velocity and output quality.
Qonto decided to reach out to simplabs to help them get back on track to sustainable growth.

## simplabs’ Approach

Our engineering consultants met with Qonto's team on-site in their office in Paris to kick off the collaboration.
We sat down with the relevant stakeholders to develop an understanding of their business, their technology,
infrastructure, tools and processes. Next, we reviewed the Ember.js codebase and interviewed the frontend team to
understand what the main challenges were. At the end of this process, we had a clear understanding of the status
quo as well as the main obstacles the team was facing and the problem areas they were struggling with.

{% set text = "simplabs are well known as the Ember.js experts and they absolutely live up to the expectations. They had an immediate as well as significant positive impact on both our velocity and quality of output." %}
{% set source = "Marc-Antoine Lacroix, Qonto CEO" %}
{{ quote('aqua', text, source, true) }}

## Clearing the roadblocks

Having identified the top impediments we were able to take immediate action. In the first few weeks of the
project, we migrated the application away from a legacy template language and moved it back on to standard
Ember.js patterns. We also substantially accelerated the Continuous Integration build times (cutting them roughly
in half) as well as fixed some instabilities which had previously led to flaky test results. Both of these changes
led to an immediate acceleration of the team's velocity.

We then helped the team ship some mission critical features following ambitious timelines. Our experts spearheaded
these initiatives, working closely with Qonto's in-house engineers. We ensured Qonto's team had a clear
understanding of our implementations and would take ownership over these parts of the app once sufficiently
advanced.

<figure>
  <img
    src="/assets/images/work/qonto-comp.jpg"
    alt="Screenshot of the Qonto app, and a Qonto card"
  />
  <figcaption>
    Qonto is a business account for freelancers, startups and SMEs. We shared our expertise to help build a product used by over 75000 customers.
  </figcaption>
</figure>

Besides helping the team ship, we also focussed on evolving the application's architecture as well as engineering
infrastructure to sustainably accelerate development while improving and maintaining quality. We set up automated
visual regression testing to prevent unintended changes to the product UI being released to production. We also
put a system in place for tracking the application's bundle size to prevent size and performance regressions.
Having that system in place led to a 25% reduction of the application's main bundle over 2 months. Lastly, we
invested time and effort in setting up an advanced linting system that would identify bad patterns, unused
translation strings and other pitfalls to minimize their negative impact.

## Empowering the Team

All of the work we did for Qonto was done in close collaboration with their in-house team. An important part of
our work is always sharing our expertise and helping others develop deeper understandings of the tools they are
using so they can be more effective with higher confidence. At Qonto, we conducted workshop on various topics as
well as pair-programmed with their engineers and shared know-how via reviews.

{% set text = "Working with simplabs’ experts has always been a good experience.
        We can really feel that they have mastery on many topics, and knowledge about complex technical problems.
        I’ve learned so much, especially during our pairing sessions, and it allows me to improve my technical skills
        and growth as an engineer." %}
{% set source = "Alexandre Monjol, Frontend Engineer at Qonto" %}
{{ quote('aqua', text, source, true) }}

---
layout: case-study
company: Experteer
title: A mobile onboarding experience | Work
displayTitle:
  "A <em>smooth</em> mobile onboarding experience – design to release"
description:
  <p>Experteer is Europe’s leading executive career service.</p><p>Mainmatter
  has supported them in various ways over the years, building custom web apps,
  reviewing their code as well as providing architecture and process
  consulting.</p>
hero:
  color: purple
  textPosition: "center"
  image: "/assets/images/work/experteer.jpg"
  imageAlt: "Collage of the Experteer mobile application"
  tags: "architecture / development / process"
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h2 class="case-study__heading h5">About Experteer</h2>
  <div class="case-study__text">
    <h3 class="h4">Experteer is the executive career service for leading professionals. Their career and recruitment marketplace is used by 6 million executives and professionals worldwide.</h3><br>
    <p>The service offers access to the high-end job market with over 1.000.000 opportunities and confidentially connects candidates with approved headhunters and corporate recruiters.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/experteer-ui.png", "Screenshot of the Experteer app", '50rem', "lazy", 'case-study__image', [1600] %}
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">The Challenge</h2>
  <div class="case-study__text">
    <p>Being a career service, Experteer needs to have a complete record of candidates’ areas of expertise and previous positions in order to provide the best value. To offer users an easier onramp into their system and help them get to a complete profile effortlessly, Experteer was looking to recreate their signup flow. Lacking the internal capabilities for the project from product strategy to design and engineering, they approached Mainmatter for support.</p>
  </div>
</div>

<div class="case-study__section">
  <h2 class="case-study__heading h5">Mainmatter’s Approach</h2>
  <div class="case-study__text">
    <p>We kicked off the project with a product strategy workshop to align all stakeholders on the project’s goals. During the workshop, we also developed a first draft for a high level user flow. Based on that, the Mainmatter team was able to prepare a concrete design for the initial version of the project.</p>
    <p>We then set out to implement the project in React. Working closely with Experteer’s backend engineers who implemented the API part of the project, we incrementally built up the application, discussing technical questions along the way.</p>
    <p>Throughout the entire project, all stakeholders remained in constant communication. We ran weekly check-ins with Experteer’s team to transparently share progress with everyone, involved them in shaping each step, and supported them in making product decisions during the process. Read more about our process in our <a href="/playbook/">playbook</a>.</p>
    <p>In addition to implementing the application, we set up the infrastructure that would support its long-term evolution and maintenance. Our team established everything from the design system and component library to testing and deployment pipelines and preview systems for each pull request inside Experteer’s organization.</p>
  </div>
</div>

{% set 'content' = {
  "text": "Mainmatter helped us tremendously to execute on our roadmap and move on with important strategic product features. On top of that, they pushed our engineering culture to a new level while we were transforming our legacy UI/UX to a state-of-the-art architecture.",
  "source": "Thomas Nitsche, Director of Engineering, Experteer GmbH",
  "loading": "lazy"
} %} {{ quote(content) }}

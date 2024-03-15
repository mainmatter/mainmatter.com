---
layout: case-study
company: MVB
problem:
  MVB lacked the experience to feel confident that they were delivering on
  quality under time pressure.
solution: Our experts mentored the team to achieve both requirements.
tags: Team reinforcement
title: A platform for the german book industry | Work
displayTitle: "A platform for the <em>german</em> book industry"
description:
  <p>MVB provides marketing solutions for the German book industry.</p><p>They
  approached Mainmatter when they were looking for external expertise. We
  performed a workshop, leveling up the team’s expertise and guided the project
  until its successful completion.</p>
hero:
  color: purple
  image: "/assets/images/work/mvb-background.jpg"
  imageAlt: "Servers in Rack"
  tags: "Team reinforcement"
og:
  image: /assets/images/cases/cs-mvb-og-image.jpg
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About MVB</h3>
  <div class="case-study__text">
    <p class="h4">MVB (part of the Börsenverein Group) provides digital platforms and services for the marketing and distribution of books for publishing houses and bookstores in Germany and abroad. One of their core offerings is VLB-TIX which provides a database with detailed information on new titles of all 21.000 publishers in Germany.</p>
    <p>The platform improves the flow of information between publishing houses, booksellers, journalists, bloggers, and interested readers.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Challenge</h3>
  <div class="case-study__text">
    <p>Having previously relied on an external provider to develop VLB-TIX for them, MVB’s goal was in-house development and maintenance of the platform. At the same time, they needed to rewrite the existing product to align it with their internal tech stack and to integrate it better with other systems. Lacking the internal expertise and staff for a strategic project like this, MVB reached out to Mainmatter for help.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/mvb-ui-1.png", "Screenshot of the VLB-TIX app", '50rem', "lazy", 'case-study__image', [1600] %}
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Mainmatter's Approach</h3>
  <div class="case-study__text">
    <p>Throughout the collaboration, we supported MVB mainly in four areas:</p>
    <h3 class="h4">Product Development & Mentoring</h3>
    <p>Our team augmented MVB’s in-house team and actively supported them in delivering the application within a challenging timeframe. We worked closely with their frontend engineers to implement the application on a solid architectural foundation. As we did that, we also mentored the engineers both on best practices regarding the application code as well as tools like git and general development practices. Our mentoring also enabled MVB to scale up the team without much friction as we ensured a smooth onboarding of developers that were new to the technology stack.</p>
    <p>We also collaborated closely with MVB’s in-house backend team to design and implement critical aspects like authentication and client/server communication. Our extensive experience building web applications allowed us to put MVB’s team on the right track and ensure a sustainable architecture through the entire application stack.</p>
    <h3 class="h4">Infrastructure & Testing</h3>
    <p>Successful project teams thrive on solid infrastructure and tooling. From the beginning of the project, we supported MVB’s team in setting up streamlined local development and CI setups to minimize complexity and shorten feedback cycles. We also helped them solidify their testing infrastructure, replacing existing unreliable solutions that were hard to maintain with a highly automated, comprehensive approach.</p>
    <h3 class="h4">Product Strategy & Design</h3>
    <p>Besides helping MVB with engineering topics, our team was able to help refine the product strategy and design. We acted as a sparring partner for MVB’s product and market experts to rethink and improve the UX of the existing application as well as develop a consistent UI.</p>
    <h3 class="h4">Process</h3>
    <p>Working closely with MVB’s product team allowed us to help them understand the technical aspects of the product better so they could more efficiently communicate with the engineering team. Building on that improved collaboration, we supported MVB in establishing a better process with increased focus and alignment, which resulted in accelerated value delivery.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/mvb-ui-2.png", "Screenshot of the VLB-TIX app", '50rem', "lazy", 'case-study__image', [1600] %}
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Outcome</h3>
  <div class="case-study__text">
    <p>We guided MVB to deliver a capable product while at the same time establishing the processes and infrastructure that will support its sustainable growth and evolution. By improving collaboration and raising the level of expertise among engineers, we enabled the team to successfully continue the project for the long term.</p>
  </div>
</div>

{% set 'content' = {
  "text": "Mainmatter’s team is highly experienced and professional. They not only helped us develop the product but also mentored our internal team and introduced a number of improvements around infrastructure and processes along the way. Due to their work, we increased our team’s efficiency substantially and will be able to deliver better results faster going forward.",
  "source": "Ronald Schild, Managing Director of MVB",
  "image": "/assets/images/photos/mvb-ronald-schild.png",
  "alt": "Ronald Schild, Managing Director of MVB",
  "loading": "lazy"
} %} {{ quote(content) }}

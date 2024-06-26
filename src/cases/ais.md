---
layout: case-study
company: AIS
title: An MVP for an IT security dashboard | Work
problem: AIS wanted to be able to supervise their metrics with a dashboard.
solution:
  We helped defining and shaping the goal as well as designed and implemented a
  finished MVP.
tags: Launch your idea
displayTitle: "An MVP for an IT <em>infrastructure</em> security dashboard"
description:
  <p>AIS provides continuous monitoring of companies' external assets, allowing
  to proactively secure their attack surfaces.</p><p>Having built the core of
  their product in-house, they approached Mainmatter for support with building a
  web frontend for it. We conceptualized, designed and developed the application
  in 6 weeks, guiding AIS\' team along the way.</p>
hero:
  color: purple
  image: "/assets/images/work/ais.jpg"
  imageAlt: "2 walls with bank lockers, most closed but some open"
  tags: "design / development / React"
og:
  image: /assets/images/cases/cs-ais-og-image.jpg
---

{% from "quote.njk" import quote %}

<div class="case-study__section">
  <h3 class="case-study__heading">About AIS</h3>
  <div class="case-study__text">
    <p class="h4">AIS, founded in 2020 as a spin-off of the CISPA Helmholtz Center for Information Security, helps its customers understand their external attack surface and access the risks tied to it.</p>
    <p>Their platform Findalyze collects and consolidates the publicly available information as observed from an attacker's perspective, prioritizes it, and delivers actionable insights to reduce the external attack surface.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/ais-ui-1.png", "Screenshot of the Findalyze main dashboard", '50rem', "lazy", 'case-study__image', [1600] %}
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">The Challenge</h3>
  <div class="case-study__text">
    <p>After developing the suite of data collection and analysis tools internally, AIS needed to build the dashboard application that would give its users access to the gathered information. The dashboard would list findings along with suggested prioritizations and recommended actions to mitigate security risks. Lacking both the expertise as well as the people for designing and building web frontends, AIS approached Mainmatter for support.</p>
  </div>
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Mainmatter’s Approach</h3>
  <div class="case-study__text">
    <p>We kicked off the project with a <a href="/services/workshops/digital-product-strategy/">product strategy workshop</a> to define the desired outcomes. Together with the client, we agreed on a scope for an MVP version of the dashboard we'd build over 6 weeks. After a short design phase in which we laid out the visual foundation for the project, we then progressed to implementing the application and completing detailed designs. Simultaneously working on both design and implementation like that leads to less rework and stronger alignment between designers and engineers – read more about that in our playbook.</p>
    <p>Throughout the collaboration, we worked closely with AIS' team. Many small decisions need to be made while a project is developed – direct communication between the client's team and ours ensures these decisions are made transparently and fast without slowing down progress. We also shared the project's progress via a continuously updated preview system and weekly status calls.</p>
    <p>Besides designing and implementing the application in Next.js, we put all of the foundations necessary for the AIS team to continue where we left off afterward. That included a design based on reusable components together with a component library in Storybook, a solid testing setup, deployment processes, and a foundation for localizing the application later on. We also involved one of AIS' engineers in the project early on and mentored him to be able to eventually take over the maintenance and further evolution of the project.</p>
  </div>
</div>

<div class="case-study__image-wrapper">
  {% image "/assets/images/work/ais-ui-2.png", "Screenshot of the Findalyze login screen", '50rem', "lazy", 'case-study__image', [1600] %}
</div>

<div class="case-study__section">
  <h3 class="case-study__heading">Outcome</h3>
  <div class="case-study__text">
    <p>The fully functional MVP of the dashboard application was delivered in just over 6 weeks. That allowed AIS to onboard the first test clients onto their service and get valuable feedback from them to ensure correct focus for the future. After Mainmatter put the foundation for further evolution of the application in place and mentored their team members, AIS will be able to continue extending and improving the application in the future.</p>
  </div>
</div>

{% set content = {
  "text": "As we did not have any design or frontend expertise in-house, we could not professionally build the user interface of our platform and bring the product to the market. We were looking for support and chose to work with Mainmatter, which turned out to be a great partner for us. The experienced team of Mainmatter helped us release an MVP and set the foundation for developing the application in the future.",
  "source": "Milivoj Simeonovski, Chief Product Officer (Founding)",
  "image": "/assets/images/photos/milivoj-simeonovski.png",
  "alt": "Milivoj Simeonovski smiling at the camera wearing a red sweater",
  "loading": "lazy"
} %} {{ quote(content) }}

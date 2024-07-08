---
title: "The Embroider Initiative Becomes the Ember Initiative"
authorHandle: marcoow
tags: [ember]
bio: "Marco Otte-Witte"
description:
  "Marco Otte-Witte introduces the Ember Initiative – a permanent effort to
  advance the Ember ecosystem, building on the success of the Embroider
  Initiative."
og:
  image: /assets/images/posts/2024-07-09-the-embroider-initiative-becomes-the-ember-initiative/og-image.png
tagline:
  "<p>The Embroider initiative was a big success for the Ember ecosystem. Having
  two engineers work full-time on Embroider for a year allowed us to reach a
  point where new Ember apps can now be built with Vite from the start. It might
  not be as easy for teams working on slightly older Ember versions, but the
  path to Vite is open. Most teams just need to update their apps to the latest
  Ember version to get on to Vite.</p> <p>While the Embroider initiative has
  come to a successful end, we don’t want to stop pushing the Ember ecosystem
  forward. The success of the initiative has shown that crowd-funded work on
  Ember is effective: companies see the reasons to invest, and we can reach our
  goals, which have real value for everyone in the ecosystem. That’s why we’re
  proposing to turn the Embroider initiative into a permanent effort – the
  <strong>Ember Initiative</strong>.</p>"
image: "/assets/images/ember/ember-consulting.jpeg"
imageAlt: "A group of hamsters"
---

## What is the Ember Initiative about?

Mainmatter will continue to assign a team to work on Ember and its ecosystem
full-time, indefinitely if we secure enough funding (more on that below). They
will address topics relevant to the Ember ecosystem and every company that uses
Ember. The team won’t focus on a single topic like they did with the Embroider
initiative. Instead, they will work on various issues, addressing whatever is
most pressing for the Ember ecosystem at any given time. To start, we’re
proposing 4 main topics:

### Polishing Embroider

While the Embroider initiative has been a great success and the path towards
Vite is wide open, there is some work left to do to polish the experience:

- **Backwards compatibility:** Making Vite builds work with older Ember versions
  will make it easier for many teams to switch. We suggest making Embroider and
  Vite compatible with Ember 4.x.
- **Documentation:** While building Ember apps with Vite should be an
  out-of-the-box experience, some documentation will need to be updated before
  it can be the default experience for the wider Ember community.
- **Opening upgrade paths for the most popular addons:** Ember apps rely heavily
  on addons, but not all widely used ones work with Vite. We propose that we add
  support or document alternatives for the most used addons in the Ember
  ecosystem.

### Developer Tooling

Developer tooling hasn't seen much improvement in the Ember ecosystem in the
past few years. We suggest working on:

- **Ember Inspector:** The inspector needs some changes to work properly with
  Vite-built Ember apps. Also, its capabilities for modern Ember patterns like
  `<template>` tag components are limited. Fixing this will make developers more
  efficient.
- **Glint tooling and TS support:** We suggest our team works with Alex
  Matchneer, who has already begun improving Ember’s developer experience with
  TS and moving Glint to Volar for easier maintainability (see
  [Alex’s talk about the topic at Ember Europe](https://www.youtube.com/watch?v=6zy4nLHj83g)).

### Compiling Ember Apps to Web Components

Teams and companies are increasingly adopting polyglot architectures for their
frontends, using a mix of different frameworks. Using web components in Ember
apps is already straightforward. We suggest creating an easy way to compile
Ember apps themselves into web components so they can be used in other
applications. This will make it significantly easier to use (and continue using)
Ember in these contexts.

### Route and Router Manager APIs

Improving the router has been a long-standing goal in the Ember community, with
little progress in recent years (Polaris, Ember's next edition, will not ship
with a router). While the topic is big and we won't be able to ship a new router
soon, we suggest working on the first step: implementing manager APIs for routes
and the routing system. This will unblock experimentation by allowing the
implementation of routes and the routing system to be swapped, bringing the
ecosystem one step closer to a new router.

Eventually, a new router will bring several benefits:

- By removing controllers and route templates and routing components directly,
  there will be fewer concepts to deal with (and learn when coming new to
  Ember), making it much simpler to work with the framework.
- Eventually, there will be a simpler and more stable mechanism for handling
  query parameters.
- A new router will eliminate subtle bugs in the current routing system that
  have impacted several teams working with Ember.
- A new routing system will ideally simplify interoperability with other
  frameworks, such as allowing routing of components written in React, Svelte,
  and more.
- It will be easier to split large codebases into smaller, isolated parts that
  separate teams can work on, as a new router will open the way for building a
  new version of engines.

## Funding the Initiative

We’d like to fund the above work the same way that worked well for the Embroider
initiative. Instead of trying to get one company to sponsor all of the work,
we’re asking many companies to contribute a little each so they can have a
substantial impact together. Companies that have built on and invested in Ember
have good reasons to invest in its longevity and progression (see
[my talk on the topic at EmberFest 2023](https://www.youtube.com/watch?v=QMUm6UOoNRs)).

Sponsors joining the Ember initiative not only invest in the future and
longevity of their apps but also get a seat at the initiative's table. They can
share their pain points with Ember and, depending on the sponsorship tier,
influence our team's focus. They stay updated on what's happening and, again
depending on the sponsorship tier, benefit from pairing sessions with our
experts.

We encourage companies of all sizes to join the initiative by offering various
sponsorship tiers to fit every budget. To help make this a permanent effort, we
provide a discount for companies that sign up for a full year at a time.

### A Call to Action

If you are a current sponsor, a decision maker at a company that uses Ember, or
a passionate Ember engineer willing to convince your higher-ups to join the
initiative, please [reach out](https://mainmatter.com/contact/)! We’re hopeful
we can build on the success of the Embroider initiative and make the Ember
initiative a success for the entire ecosystem, but we need your support!

❤️🐹

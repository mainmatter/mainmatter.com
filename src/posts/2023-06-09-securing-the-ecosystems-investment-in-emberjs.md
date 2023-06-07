---
title: "Securing the ecosystem’s investment in Ember.js"
authorHandle: marcoow
tags: [ember]
bio: "Marco Otte-Witte"
description:
  "Marco Otte-Witte shares the background behind the initiative to ship
  Embroider and secure Ember's future Mainmatter is working on with sponsors
  like TicketSolve and Intercom."
og:
  image: /assets/images/posts/2023-02-28-ember-template-assert/og-image.jpg
tagline: |
  <p><a href="https://github.com/embroider-build/embroider" rel="external nofollow noopener noreferrer">Embroider</a> is Ember’s new and coming build system, or really a pre-build system that translates Ember code into spec-compliant modern JavaScript so that the actual build can be handed over to tools like Webpack or Rollup. It does not only allow the Ember project to drop its current, custom build system implementation and thus take a lot of maintenance work from the team’s shoulders. Shipping Embroider also unlocks many of the new things in the coming Polaris release (the framework team shared some details on that in the <a href="https://www.youtube.com/watch?v=nPZkvGeQK2k" rel="external nofollow noopener noreferrer">AMA at Ember Europe’s Q1 meetup in March</a>).</p>

  <p>However, Embroider has been in the making for more than 4 years and is still not done. It remaining unshipped and not adopted across the Ember ecosystem poses a substantial risk for the entire Ember community and with that all companies that have built on Ember. <strong>Mainmatter, together with a group of sponsors from the Ember ecosystem, is starting an initiative to ship Embroider to secure Ember’s future and with that the investments of all teams that have built on Ember</strong>.</p>
image: "/assets/images/posts/2023-02-28-ember-template-assert/header-illustration.jpg"
imageAlt: "The Ember logo on a gray backround picture"
---

## The Status Quo

At the time of this writing, only few apps and teams are using Embroider (and
only a fraction of the ones that do, use the optimized mode which is really the
one that matters). It’s not enabled by default in the blueprints for new apps
(or addons) and many addons in the ecosystem still need to be migrated to
support it.

### Risk of Fragmentation

While some teams managed to get their applications running in Embroider safe
mode, if only part of the ecosystem migrates to Embroider, **we’re at the risk
of fragmenting the ecosystem and community.** The worst case scenario is we end
up with 2 camps: Embroider and Non-Embroider. The longer we remain in this
intermediate state of ongoing migration, the higher the likelihood is for that
to happen.

The imminent risk of a fragmented community is threatening to break one of
Ember’s key promises – the fact that the community is aligned around a set of
patterns and practices that just work (what has been referred to as “the safety
of the herd”). In a fragmented ecosystem where addons, patterns, and
architectures cannot easily be shared, cross-pollination and sharing of
solutions we all benefit from in the ecosystem at the moment will become much
harder and much less effective. We're back to being on our own instead of being
part of a herd that moves collectively.

### Bundle Sizes and Build Performance

Without Embroider, it remains hard for teams working with Ember to **leverage
techniques like bundle splitting**. Many applications suffer from large bundles
and their impact on runtime performance, yet there is no straight-forward way to
decrease bundle sizes.

The same is the case for build performance: build times in Ember can be long, in
particular for large applications. Only with Embroider do we get access to
modern build tooling like [Vite](https://vitejs.dev),
[Turbopack](https://turbo.build/pack), etc. which offer **orders-of-magnitude
faster builds than are currently possible**.

## Keep Ember ~~weird~~ relevant

The risk of fragmentation and the gap to competing technologies regarding bundle
sizes and build times **poses a threat for Ember and all teams that have built
on it**. Eventually, teams might decide to leave Ember, it might be hard to
attract engineers to work on Ember projects, and the ecosystem might shrink
overall which leads to less work going into the project and less progress being
made. On the other hand, once Embroider ships, Ember will be in good shape for
the future and make a significant leap forward.

### The Initiative

In late 2022, Mainmatter started to reach out to companies that have invested in
Ember, with an idea: we wanted to put a team to work on Embroider full-time,
finish the package itself, make it the standard for new apps and addons, and get
it adopted across the ecosystem. We believe that **a team working on Embroider
as their main and only priority** would be able to have a huge impact on the
project and get it over the finish line (as much as everyone in the Ember
ecosystem appreciates Ed’s work and the work of
[other contributors](https://github.com/embroider-build/embroider/graphs/contributors)
without which we wouldn’t even be in the position to think about how we take the
last steps). Mainmatter as a consultancy is in a unique position to do this kind
of work since focusing on technical topics is at the core of what we do – we
don’t need to pull people out of product work, negotiate that with product
managers, get approval from project stakeholders, etc.

We were able to get a number of companies on board as sponsors of the initiative
quickly. All of those companies understand that investing in this initiative
means ensuring the longevity of the investment they made into Ember.js by
building their applications on top of it. They understand they cannot expect the
technical foundations of their applications to evolve and be maintained somehow
automatically at all times but they need to be an active contributor to the
evolution and maintenance that's essential for their businesses. **By sharing
the investment collectively among a group of sponsors via this initiative, it
becomes easier for everyone.**

We’re thankful to [Ticketsolve](https://www.ticketsolve.com/),
[Intercom](https://www.intercom.com/),
[OTA Insight](https://www.otainsight.com/),
[HashiCorp](https://www.hashicorp.com/), [XBE](https://www.x-b-e.com/),
[Isaac Lee](https://crunchingnumbers.live/),
[Balint Erdi](https://balinterdi.com/), [HotDoc](https://www.hotdoc.com.au/),
[solute](https://www.solute.de/), [Triptyk](https://www.triptyk.eu/),
[redpencil](https://redpencil.io/), and [Productive](https://productive.io/) for
sponsoring and supporting the initiative!

TODO: logos

## The Roadmap

Work on the initiative has started already on June 1st. The project is lead on
Mainmatter's side by [Chris Manson](https://twitter.com/real_ate). Our team of
course operates completely in the open since all work is happening in the
[Embroider](http://github.com/embroider-build/embroider),
[RFCs](https://github.com/emberjs/rfcs), and related repositories.

We have agreed with the sponsors on a roadmap focusing on five main points:

### 1. Finishing Embroider itself

Embroider is relatively stable but there are still bugs to uncover and fix. We
anticipate this to be the main part of the initiative as a substantial amount of
work needs to be done still to smooth all of Embroider’s rough edges.

Besides that, there is work that needs to happen in the wider Ember project.
Specifically, that is:

- preparing an RFC for the V2 addon format being the default blueprint for newly
  created addons
- preparing an RFC (and eventually a spec) for
  [engines](http://ember-engines.com) in an Embroider world
- preparing an RFC for a spec for build-time plugins or alternatively compiling
  documentation for authoring code that hooks into the Ember build
- shipping [ember-source](https://www.npmjs.com/package/ember-source) itself as
  a V2 addon
- preparing an RFC for a V2 application format

### Making Embroider maintainable

The bus factor for the Embroider project is essentially 1 at the moment. That
needs to be changed so a larger group of people in the community can take over
ownership of Embroider and be responsible for maintaining it which requires
better documentation as well as actively involving and teaching more people.

### Shifting the Ecosystem

We’ll work on attracting contributions from the community to ensure the most
important addons in the ecosystem are compatible with Embroider. We’ll also work
on putting the infrastructure in place to make it as easy as possible for
drive-by contributors to have a real impact

- We’re already working on setting up a dashboard on
  [emberobserver.com](http://emberobserver.com) that shows the Embroider support
  status of the top addons in the ecosystem. That makes it easy to quickly see
  where contributions are needed.
- We’ll actively market that dashboard as well as push for external
  contributions to the effort.
- Our team will invest some of their open source time (20% of every engineer’s
  time) on working through the dashboard.

### Making Embroider Mainstream

Eventually, we want to make Embroider mainstream across the community to align
the ecosystem and avoid fragmentation. Specifically, that means making the V2
addon structure the default for new addons as well as making Embroider the
default build system for new apps. Both tasks will likely require new RFCs and
consultation across the core teams.

### Next Steps

As a last step, we’ll build an initial version of an Ember plugin for Vite.

## Join and secure your investment in Ember.js!

We’re thrilled about the fact that a number of **companies that have invested in
Ember.js came together to secure those investments and fund this initiative**.
While we were optimistic we’d get funding for this, we couldn’t be sure when we
first pitched the idea. It’s great to see how many companies understand the
relevance of investing into the longevity of the technical foundations they
build on.

While the above roadmap will mean a huge step forward though, that’s not where
it ends. More work will need to be done to evolve the prototype Ember plugin for
Vite into a stable solution that teams can reliably bet on for the future. **We
hope we can get more sponsors on board as we go and extend the scope of the
initiative.** If you want to get involved and secure your investment in
Ember.js, [reach out](/contact/)!

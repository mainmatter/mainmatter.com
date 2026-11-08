---
title: "Shipping frontends at AI speed"
authorHandle: marcoow
tags: [ai, rust]
bio: "Marco Otte-Witte"
description: ""
tagline: ""
autoOg: true
---

For many years, Mainmatter has been focused on frontend engineering and helping teams get the most out of frameworks like Ember and later Svelte as well. When we started working in that space ca. 10 years ago, the whole concept of SPAs and the frameworks behind those was new and widely unexplored with many open questions to answer. 10 years later that's no longer the case: there are established patterns, frameworks are converging and you can argue become less relevant altogether. While we still consider ourselves standout experts in Ember and Svelte and work with many clients on projects on those technologies (e.g. large-scale codebase modernizations), as an engineering consultancy with the ambition to be at the leading edge of tech, we asked ourselves: what are the big challenges that frontend teams face in 2026? We believe that's adopting effective, sustainable agentic engineering and shipping at AI speed.

## The challenges

While AI and agents have proven their ability to generate high quality code and few engineers write code by hand anymore, for teams to accelerate their output at the rate that was promised by the AI labs (and is expected by their management), remains a challenge. Code reviews quickly become the new bottlenecks for many teams and even though most teams maintain their review practice with a human in the loop, overall in the industry bugs per merged PR go up, causing rework that slows teams down again. While it's hard to get numbers, for most teams the massively accelerated throughput has not realized and while pressure increases and they might feel faster in terms of pushing out code, they have not been able to sustainably accelerate their value delivery.

Generating a lot of code fast and (comparatively) cheap is not the same as evolving and maintaining a complex system over time at a high pace without throwing quality and maintainability (whatever that means in these times when AI writes most of the code) over time while serving real users. I like to use a Formula 1 analogy to make that clear to people that do not easily understand the point: everyone can drive a Formula 1 car at full throttle on a straight road (obviously I have never tried that and have no idea whether it's actually true but let's assume it is for now). Yet, it's a very different thing to complete a full round on a track and ideally not only one but ca. 70 per race and race 12 or so races in a season, outpace the competition and end the season as champion. The latter requires a well functioning machine consisting of the team, processes, tools, logistics, etc.

Just like succeeding in Formular 1, succeeding as a frontend engineering organization over time and actually delivering business value at a high pace over time at high quality, requires a well-functioning software delivery lifecycle (SDLC) with practices, tools, and infrastructure. The reality is that many teams do not have that set up to handle the load when code is hand-written, not to speak of agents pushing out code at a much accelerated pace. Mainmatter has been working with teams for many years in our Ember and Svelte projects to build up frontend engineering organizations that allow for growing output with team size, e.g. during our work with Qonto. Many of the challenges that teams face when adopting agentic engineering are the same that companies face when growing teams rapidly: more contributions to the codebase need to be channeled to prodcution to materialize as business value.

Progressive delivery, like feature flags, A/B testing, blue-green deployments

building internal development platforms, and site reliability engineering

> If code generation outstrips your ability to get that through a pipeline and into the hands of your users, then you're going to have a pile-up somewhere, and that's going to create backpressure in other places. Again, what we end up with is we end up with developers able to produce so much more work and the downstream process not being able to keep up.

https://www.infoq.com/presentations/agentic-dev-teams/?utm_campaign=infoq_content&utm_source=infoq&utm_medium=feed&utm_term=global

Although nobody quite knows what the future of software engineering will look like, our experience working with companies through those challenges, make us the perfect team to figure out the answers together with our clients.

## The Offering

We work with teams through a clear, three stage process.

### Assessing the status quo

We start by assessing the status quo, asking questions like what are bottlenecks and impediments currently, presumably before having gone all in on AI? What do error rates and performance metrics look like? How many regressions end up being shipped to prodcution? Does the team have the insight into their systems they need to understand in detail what is going on in their systems or are they missing key telemetry data?

### Clearing the path

Once we understand the status quo, we clear the pace to allow for accelerating the pace of code generation. We fix all the bottlenecks that are causing pain already as well as the ones that we can foresee to crumble once code generation is accelerated. That includes work on shortening the feedback loop so agents can more effectively create code such as accelerating builds and test suites. We also fix holes in test suites, resolve flakiness as well as setting up non-functional quality gates such as visual regression testing, accessibility testing, comprehensive linting, etc. Finally we close telemetry gaps so that teams are on top of bugs that show up in production, as well as performance metrics, etc.

anything manual obviously has to go anyway

All of these improvements have a positive impact on the team's ability to deliver even without going all in on AI.

### Rolling out tools and practices

Once the supporting infrastructure is in place, we roll out tools and practices step by step. For teams that have not yet had much exposure to AI tools that might mean getting people to use Claude or Codex locally. For most it will mean going from that to cloud agents and eventually software factories. As we roll out and go deeper into agentic engineering, we keep refining the underlying infrastructure as well as the shared context, skills, etc. that give the agents direction and ensure what's generated is as good as it can be from the get-go without a bunch of loops.

### Mentoring

As we've always done, we work closely with our clients' teams, mentoring them along the way. Our promise has always been sustainable change that leaves teams better than we found them, able to continue based on the foundation we set up together on their own once we leave.

## Ship frontends at AI speed

If you're looking to ship frontends at AI speed but have been struggling to turn accelerated code generation into accelerated, sustainable value generation, [contact us](/contact/). We'll work with you and your team through the process explained above to enable you to ship at AI speed.

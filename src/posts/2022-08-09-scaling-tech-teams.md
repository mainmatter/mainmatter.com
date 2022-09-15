---
title: "Scaling Tech Teams"
authorHandle: marcoow
tags: process
bio: "Founder and Managing Director of Mainmatter"
description:
  "Marco Otte-Witte shares learnings around growing tech teams and how to avoid
  typical mistakes."
og:
  image: /assets/images/posts/2022-08-09-scaling-tech-teams/og-image.jpg
tagline: |
  <p>Every successful company will face the challenge of having to scale their tech
  team sooner or later. There will be more to build and maintain than the small
  founding team is able to handle. However, increasing throughput by increasing
  the number of people isn't as easy as it might seem and many teams have learned
  that the hard way with average productivity (and overall team happiness) going
  down significantly once the team grew above a certain size. While we don't have
  a silver bullet to prevent all growing pains for everyone, I want to share some
  learnings Mainmatter made working with numerous startups and scaleups over the
  years.</p>
---

## Mentoring and Growth

While many teams start out with a small number of experienced experts, growth
beyond a certain threshold requires opening up to less experienced people as
well. And with the changing composition of a team also come changing needs –
less experienced engineers won't be able to contribute to the codebase to the
same extent that more senior people would. They need additional guidance and
mentoring and will get frustrated and burned out without it. At the same time,
given support, they will more often than not excel and become senior engineers
themselves. That said, a common mistake we see many teams make is to just add
beginners to their teams without putting any real thought into what kind of
guidance they will need, only to be surprised a few months later when the people
leave again. That's not only a bad experience for the less experienced engineer
who probably was eager to learn and motivated when they started but also a
missed opportunity for the company that could have added a valuable member to
their team.

Ines from the Mainmatter team wrote about
[her journey as a beginner engineer](/blog/2022/05/19/journey-of-a-junior-software-engineer/)
– it's a great post I recommend beginners as well as experienced engineers read.
One of Inês' main points is:

> If you land in a new job where nobody is showing availability to help you
> out - you are in the wrong place.

Supporting less experienced engineers in making impactful contributions to
codebase can (and should) happen in many ways. First, remove any accidental
complexity from the process and infrastructure that would impose an extra wall
to climb over for any engineer at the beginning of their career. For example,
while experienced engineers might be able to set up a bunch of dependant
services and run a variety of micro-services directly on their machine, that
might be a blocker for a beginner – containerizing the complete development
environment before introducing beginners to the team can likely prevent a lot of
frustration and wasted time and is beneficial to the rest of the team as well.

Preparing work thoroughly can go a long way in supporting less experienced
engineers as well. Instead of assigning underspecified tasks where lots is still
left to be figured out, analyze the status quo and plan what steps need to be
taken to get to the desired goal before starting to write code. That way,
beginners have a trail to follow and blockers or uncertainties can be uncovered
and resolved before they hit a wall mid-way through their work. For more
guidance on efficient preparation of work, check our [playbook](/playbook) as
well.

![A well prepared issue provides beginners with a
trail to follow](/assets/images/posts/2022-08-09-scaling-tech-teams/issue.svg#plain)

Analyzing and preparing work is also a nice exercise for a beginner and an
experienced engineer to do together. Generally, closely collaborating with and
observing more experienced people is a great way to learn – whether it's pair
programming or working on other tasks like figuring out what needs to be done
for a particular issue. Additionally, there are other ways of teaching of course
like giving deep explanations for why a particular change might be brought up
during a code review or running workshops on particular topics that people are
struggling with. We have worked with a number of fast-growing teams over the
years and seen many beginners excel and turn into experienced senior engineers
given the right support over the years – find out about our
[team augmentation](/services/team-augmentation/) offering to learn more.

## Code Health and Tech Debt

The negative impacts of low code health and technical debt are widely understood
in our industry by now. When it comes to scaling teams though, the topic becomes
even more relevant – whether bad code affects the productivity of a team of 5 or
a team of 50 just makes a huge difference. The bigger a team gets, the higher
the price tag is on unaddressed tech debt, in particular with more beginners on
a team that might not be as comfortable working around it. Accepting tech debt
as an impediment not only to the productivity but to the scalability of a team
as such is crucial (one of our client calls this Scaling work instead of tech
debt). **Plan time for working on code health and prioritize it together with
feature work – it will have equal relevance for the sustainability of your
product**!

## Developer Infrastructure

Related to tech debt is developer infrastructure – the bigger a team gets, the
bigger the negative impact of subpar infrastructure is going to be. A flaky test
server, slow deployment processes or unavailable tools will slow down or in the
worst case block a large and growing number of people. For the same reason,
there's also no room for any manual elements in the infrastructure or processes
– manual QA or deployment for example will quickly turn into bottlenecks and
impede the productivity of the entire team. Instead, in order to let teams focus
on their work and enable them to ship constantly, **double down on highly
integrated and automated pipelines – all time invested on these will pay off
manyfold later on**. I wrote more about the elements of such infrastructure in
an
[earlier post](/blog/2021/07/13/effective-infrastructure-for-efficient-development-workflows/).

### Invest in Developer Enablement

Once past a certain size, it often even makes sense to task a smaller number of
engineers exclusively with making everyone else more productive. That team would
focus on building, maintaining, and optimizing the internal developer platform
that all of the other engineers base their work on (a team like that would often
be referred to as a
[Platform Engineering](https://platformengineering.org/blog/what-is-platform-engineering)
or Platform Development team). Since this kind of work has increasing leverage
with a growing number of total people on the team, the cost-benefit analysis is
often obvious and makes a decision for such a team trivial. A Platform
Engineering team can e.g. build abstractions to make working with particular
aspects of the codebase easier, automate checks for particular patterns to avoid
rework, optimize tooling to shorten compile or testing times. While all of these
things might only result in relatively small productivity improvements per
individual engineer, as these changes affect every single engineer on the team,
they have a big impact overall.

## The Limits of Scope

While a small team of engineers might be able collaborate on a single codebase
efficiently, that becomes ever harder the bigger the team and the codebase with
it grows. At a certain point, nobody will be able to capture the system in its
entirety anymore which will lead to inconsistency and thus inefficiency – people
will solve the same problem over and over as they're not aware of existing
solutions that might be reusable, different parts of the codebase might actually
be conflicting with each other, etc.

The only option there is to address this problem is often to split things up
into smaller chunks – decomposing the large system and the team that maintains
it into smaller subsystems that are each maintained by their own teams (kind of
[Conway's law](https://en.wikipedia.org/wiki/Conway%27s_law) but in reverse).
Each of these subsystems will be limited to a reduced scope which enables teams
to actually be on top of all of that. Also subsystems only need to be consistent
within themselves and there is new freedom for teams to make different
technology choices for their subsystems which can also be a great driver for
motivation.

Where the boundaries between the individual subsystems are of course depends on
the respective project. There are also many ways of splitting up a big system
into subsystems – from keeping a central codebase but enforcing boundaries
between subsystems via architecture and tooling, to splitting into completely
separate products or going the micro-service/frontends route. There's no one
strategy that will work in all cases as different approaches will have pros and
cons in different situations. The one rule to keep in mind is that the less
interaction and fewer dependencies there are between the subsystems, the easier
things are going to be.

Splitting systems into subsystems comes at a substantial cost though and should
generally not be something that's decided for lightly. While limiting
cross-dependencies between subsystems and the teams managing them is a good
goal, it's rarely possible in reality to completely achieve. So while many
things get easier after the split, some things also get significantly harder
(e.g. code reuse across subsystems or synchronization between the teams
maintaining different subsystems). One mistake I've seen a few times over the
years is making this split too early or even building systems like this from the
beginning. Teams doing that end up paying a high cost for virtually no benefit
as they are not yet feeling the pain that this kind of architecture would solve.
**Decompose systems when you feel real pain but not before**.

## Process

Another critical requirement for being able to scale tech teams is establishing
a process that enables that. The main aspect of such a process is early and
close collaboration between stakeholders. While classic agile processes are
often driven exclusively by product needs, they result in a lot of inefficiency
when engineering figures out how to make a plan set by product a reality. Often,
there would have been easier and more efficient alternatives to reach the same
or an equal goal. The larger a team becomes, the more expensive the consequences
of these inefficiencies are.

![Source and shape work collaborating with all stakeholders from the get-to](/assets/images/posts/2022-08-09-scaling-tech-teams/work-sourcing.svg#plain)

So instead of a linear process where product sets a plan based purely on their
perspective that engineering then tries to convert into code, the two work
together from the beginning. Based on the high level product strategy, they work
out the most efficient way to reach a goal, considering both the user needs as
well as technical complexities and feasibility. That way, the team reaches goals
more efficiently instead spending valuable time working against each other or
trying to realize plans that were flawed from the get-go.

## Remotely international

Everyone knows that remote work is here to stay, in the tech industry at least.
Even though the pandemic situation would allow for it in many places, only few
teams go back to working from the office full-time. When it comes to scaling
tech teams, hiring remotely is often a prerequisite to even finding people to
hire and thus being able to scale at all. Even if a team is located in one of
the hotspots where there are lots of developers in the place in theory, demand
is likely high as well so that hiring locally would be no feasible option. So in
the end, everyone ends up hiring people remotely which usually also means
internationally.

While I have written about making
[remote work work](/blog/2020/11/16/the-guide-to-making-remote-work-work/)
before, there are two points to consider in particular when starting to
internationalize the team. As obvious as it might be, the first point is still
something teams forget and pay a high price for later: everything you do you
need to do in English. Hiring internationally means people will not speak the
local language and everyone will end up doing everything in English. If that
fact hasn't been taken into account from the get-go and there's essential
material (documentation, users stories, issues, etc.) that are only available in
german or french or whatever, all of these materials are inaccessible to people
that don't understand those languages and will have to be translated or
recreated eventually. **Keeping everything in English from the beginning is easy
to forget but absolutely essential to be able to internationalize a team later
on**.

The second point when it comes to scaling internationally is timezones. While
it's not important that everyone is around during the exact same times (after
all, people would start and end work at different times in an office as well),
it does make a difference whether there's a few hours of overlap or none at all.
While both setups can work and there are a lot of companies that have teams
distributed between the US West Coast and Asia where there's virtually no
overlap ever in people's working hours, it definitely is easier if there's at
least a few hours of overlap. So based on our experience at Mainmatter, I'd say
**if you can, try and limit your team to be across 3-4 timezones max** – that
not only makes communication easier but it also means people will still be
relatively close together which makes it easier (and more environmentally
friendly) to bring everyone together every once in a while to keep up team
spirit.

## You're not alone

After all, scaling tech teams is a human effort as well and like all efforts
that involve a group of people, can and will be challenging. However, keeping a
few things in mind and ensuring a solid foundation that support the scalability
of a team is helpful.

If you're experiencing growing pains you'd like to get some help with, please
contact us and we'd be happy to chat. We've worked with a number of growing
teams and companies over the years including Qonto, Trainline, and Sage and are
happy to share our learnings!

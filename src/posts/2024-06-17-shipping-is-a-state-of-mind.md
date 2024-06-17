---
title: "Shipping is a state of mind"
authorHandle: marcoow
tags: [process]
bio: "Marco Otte-Witte"
description:
  "Marco Otte-Witte explains how for the leading teams in the industry shipping
  is a permanent state rather than an occasional event."
og:
  image: /assets/images/posts/2023-08-14-the-case-for-rust-on-the-web/og-image.png
tagline:
  "<p>Shipping software to production so it’s available to real users is the
  ultimate goal of every digital product development team. There is no value in
  specs, designs, or changes committed to git, unless the code has made it to
  the production system and thus into the hands of users. The best teams ship
  dozens of times per day, every day, not every 2 weeks on particularly
  designated release days, or only at the end of the sprint – for those teams,
  shipping is a permanent state rather than an occasional event.</p>"
image: "/assets/images/posts/2023-08-14-the-case-for-rust-on-the-web/header.png"
imageAlt: "The Rust logo on top of a stylized world map"
---

## Legacy release processes

Despite the importance of shipping, many teams we work with in our consulting
projects still follow slow and complex processes for releasing changes to
production. There are many variations but usually these processes look something
like this:

![diagram showing a legacy release process with main and develop, feature and hotfix branches](/assets/images/posts/2024-06-17-shipping-is-a-state-of-mind/legacy-process.png)

- There is a `main` branch that contains the code currently running on the
  production system.
- Parallel to that, there's a `develop` branch in which the codebase evolves and
  that's ahead of `main`.
- The engineers make their changes in dedicated branches for the feature they
  work on (what you'd call "feature branches" typically). They will occasionally
  rebase their branch on `develop` but in many cases these branch tend to stay
  open for 1-2 weeks easily if not longer.
- Once the work that's done in a feature branch is finished, a PR is opened that
  is reviewed and eventually merged to `develop`.
- When there are "enough" changes (whatever that means) or at a certain point in
  time, a `release` branch is branched off from the `develop` branch.
- That `release` branch then goes through some kind of QA process.
- Once QA is done and potential bugs have been fixed, the `release` branch is
  merged back to `main` which is deployed to production. **This is the big day –
  everyone’s changes that have been collected on the develop branch for weeks or
  months in the worst case are finally released to the users!**
- If there's a bug in production, it is fixed in a `hotfix` branch that's
  branched off of the `main` branch, merged back to it and deployed. The changes
  are also propagated back to the `develop` branch.
- …and it goes on like that – changes are made in feature branches and collected
  in the `develop` branch; eventually those changes are merged back into the
  `main` branch via a `release` branch when "it's time" for a release.

## Plenty of problems

These outdated release processes lead to all kinds of problems – all of them
related to long intervals.

First, there’s the potentially long interval between branching off a feature
branch and merging it back to `develop`. The longer that interval is, the more
the feature branch diverges from the `develop` branch, increasing the likelihood
for conflicts when merging back (yes, engineers should rebase but that’s by far
not as common a practice as it should be in our experience). Also, if multiple
engineers each develop in their own, isolated feature branches for extended
periods of time, they all make changes in isolation and there’s a risk that the
changes might be incompatible, although they can be completely consistent within
each branch.

More importantly though, teams following legacy release processes, deal with
long intervals between the time a feature branch is merged and the respective
changes are deployed to production – what you could call the "deployment delay”.

### Deployment Delays

Assuming an engineer merges their feature branch at the beginning of a 2 week
sprint, the `release` branch is branched off by the end of the sprint and then
undergoes QA for 1 week before being deployed: the delay between merge and
deployment is 3 weeks! That has a number of negative consequences:

- **Constant risk of delayed rework:** During the period between merging a
  feature branch and it undergoing QA and finally being deployed, there is the
  risk of having to go back to the changes to fix things that come up during QA
  or after deployment. If that happens and indeed things need to be fixed later,
  the engineer has to get back to code they last touched weeks ago potentially.
  In the meantime they have moved on though and started to work on something
  else. They will now have to stop working on that new task and build up the
  mental model for the old task again to be able to fix the bug that was found.
  At the same time, since work on the new task does not progress anymore while
  the engineer fixes the problem in the old code, other engineers that might
  depend on the new task might end up being blocked – in the worst case causing
  cascades of friction.
- **Making Users Wait:** Delayed deployment of changes means users need to wait
  unnecessarily long to get new things – even if an engineer can build a feature
  or make a change users need in a day, they'll still have to wait until the
  next release window to get access to that feature. That's not only annoying
  for users, it also means they will only be able to provide their feedback
  after the same delay. Getting feedback from users and getting it fast is
  critical for efficient product development though – nobody wants to hear
  they've been heading in the wrong direction for 2 weeks already.
- **Larger, Riskier, Deployments:** Finally, legacy release processes lead to
  deployments becoming unnecessarily large and risky. As many, unrelated changes
  accumulate in the `develop` branch within each interval between two releases,
  those unrelated changes are all deployed together. That means that more things
  can go wrong at the same time, just because more things change at the same
  time. And for each bug that occurs after the deployment, the set of changes
  that engineers need to look into to find the root cause is bigger, thus making
  the task of debugging harder. In the worst case, teams end up being scared of
  deploying and try to avoid it or only deploy as rarely as they can (everybody
  knows teams in which deploying on Friday at 17:00 would be considered crazy or
  even be forbidden completely). Obviously that leads to a vicious cycle as the
  more rarely teams deploy, the bigger and thus riskier each deployment becomes
  which causes more fear and motivation to deploy less often and so on and so
  on…

Overall, these legacy release processes are a bit like opening the flood gates
every now and then to release a large swath of water which has been collected in
a reservoir (the `develop` branch) for some time. Once the gates are opened,
these teams are in gods hands – the uncontrollable waters have been set free and
they can only hope for things to go well:

![video of a gate in a dam being opened, releasing a large flood of water](/assets/images/posts/2024-06-17-shipping-is-a-state-of-mind/legacy-release.gif)

## Shipping constantly, continuously, sanely

As stated above, the best modern teams ship differently – they ship constantly,
continuously, in small steps, and because of that, much more sanely. Their
continuous stream of deployments looks like this:

![video of a small, calm stream of water](/assets/images/posts/2024-06-17-shipping-is-a-state-of-mind/continuously-releasing.gif)

They will deliver the same amount of water over the same period of time, just
without the delays, without the stress and without the risk of breaking
everything.

The main difference between this and the above legacy process is shorter
intervals – both between opening and merging branches as well as between merging
and deploying.

### Shortening branch lifetimes

Shorter branch lifetimes and a faster branch turnover requires reducing the
scope of the work that’s done in each branch obviously. The main change to make
in order to achieve that is to stop thinking about branches as “feature”
branches in which complete features are developed until they are 100% done
including every little detail and instead, breaking things down into much
smaller steps. A good way to think of these branches is “task branches” or
“smallest-mergable-units-of-work” branches – the idea is to advance the codebase
in small steps so that each step leaves the codebase in a consistent (and
deployable) state. Generally, a good rule of thumb is no branch should be so
large in scope or complexity that it cannot be merged back within 1-2 days max.

Here’s an example for that approach: consider adding
login-with-your-Google-account functionality to a web app. That might require a
number of changes that all have to be made to complete that feature:

- it might make sense to start by refactoring the login controller to make the
  subsequent changes easier
- then the user accounts model has to be changed to model the relation to the
  external authentication provider
- …and existing user data has to be migrated
- finally, the UI needs to be build
- …and translated

Instead of doing all this in one long-lived branch that is only merged back when
all the changes are made,

![diagram showing a feature branch with a number of commits/steps](/assets/images/posts/2024-06-17-shipping-is-a-state-of-mind/feature-branch.png)

the same changes can be done in multiple, small branches, that can each be
merged back individually with a much shorter turnover time, leaving the main
branch in a consistent state at all times:

![diagram showing the same commits/steps as in the above image, separated into individual branches](/assets/images/posts/2024-06-17-shipping-is-a-state-of-mind/task-branches.png)

That way, both problems of long-lived feature branches mentioned above are
solved: shorter lived branches with a shorter turnover time diverge less and
branches of different engineers have a lower risk of being incompatible. Also,
since the scope of changes in each branch is much smaller, and branches are
continuously integrated with the main branch much more often, there’s a smaller
chance for conflicts when merging back.

### ~Shortening~ Removing the deployment delay

The other big problem with legacy release process is the deployment delay as
explained above – the artificial delay resulting out of the process between
making a change (and merging it back to some mainline) and releasing the change
to production. Efficient teams shorten that delay to 0 by simply removing it
altogether – every set of changes that a developer merges back to the mainline
via a PR is released to production instantly:

![diagram showing the same commits/steps in individual branches with deployments after each branch is merged](/assets/images/posts/2024-06-17-shipping-is-a-state-of-mind/task-deployments.png)

_While this sounds like it might not be always possible, e.g. since users cannot
be confronted with half-done UIs, remember that releasing something to
production does not necessarily mean exposing it to (all) users. You can
leverage techniques like feature flags or canary deployments to limit the
visibility of things that are still under active development._

Removing the deployment delay solves all of the problems related to it in legacy
release processes:

- **Smaller, less risky deployments:** since the amount of changes in each
  deployment is much smaller, fewer things can go wrong. And if anything goes
  wrong, it’s much easier to find the root cause since the amounts of changes
  that need to be examined is much smaller.
- **No delay between completion of a task and potential rework:** since each
  branch/task is deployed immediately after its completion, the deployment is an
  integral part of the work on the task. If anything goes wrong during
  deployment or on production right after, the developer will still be “on” the
  task anyway. Only if the deployment has been completed successfully can the
  task be considered done and the developer will move on to the next thing,
  knowing they will not have to get back to what they worked on before.
- **No artificial wait time for users:** deploying changes immediately after
  they have been completed means there’s no systemic wait time for users – they
  benefit from fixes and new features as soon as those have been implemented.
  That also means the product development team gets feedback from users as fast
  as possible and can correct their course if necessary without continuing to
  move in the wrong direction for days, weeks, or months in the worst case.

## Shipping based on pipelines

This might raise the question why not all teams are working like this, and
consequently, what teams that work like this have that teams that use legacy
release process don’t have. The answer to that question is they have top-notch
infrastructure and shipping pipelines. Teams that are in a state of shipping
constantly stand on the shoulders of highly integrated and automated
infrastructure that enables an efficient and stable process. A well oiled
shipping pipeline covers testing, previewing, deploying, and observing.

### 1. Testing

Merging every PR directly to the `main` branch and shipping it to production
right away might seem like giving up on QA and just pushing out changes without
further control, but it’s actually quite the opposite. Thorough testing is even
more important than it is with legacy release processes. In order to even be
able to deploy dozens or hundreds of times per day, things can’t regularly go
wrong in production and require rollbacks. Not only would that lead to unhappy
users, it would also be an impediment to the process as such and eventually
bring it to a halt.

When merging PRs directly to and deploying from the `main` branch, testing works
a bit differently than with legacy release processes though. While those
processes have a central `release` branch that undergoes QA and thus acts as a
safety net, that safety net no longer exists when deploying from `main` right
after merge. Instead all testing needs to happen before a PR is merged. As there
are several PRs at any given time, all of those have to be tested in parallel.
That necessarily implies:

**Manual testing has no place in such processes or modern software development
in general! Teams that test manually will be slower, less efficient, and ship
worse quality than the ones who don’t. [^1]**

A solid, automated testing setup, that enables teams to ship constantly end
never stop, covers all relevant aspects:

- **Functional correctness within subsystems:** This is the foundation for
  thorough testing and provides the fastest feedback loop to developers. The
  subsystem they work on (and they are submitting a PR for) needs to be correct
  within itself.
- **Functional correctness across subsystems:** The next step after guaranteeing
  that each subsystem is correct within itself, is ensuring that subsystems work
  together as well. It’s possible for e.g. both a client app and the backend it
  talks to to be correct within themselves while not working together correctly
  in combination.
- **Visual correctness:** Unit, integration and other kinds of tests ensure
  correctness but don’t look at an app the same way a real user does. An app can
  be 100% functional while visually broken – sth. that would never be detected
  by a typical test. Tools like [Percy](https://percy.io),
  [Chromatic](https://www.chromatic.com), or
  [BackstopJS](https://github.com/garris/BackstopJS) can surface visual changes
  that might not have been intentional.
- **Performance:** Even performance can be tested automatically to some extent.
  While it might not be feasible to run complete load tests for every PR,
  setting up benchmarks for critical parts of the system or using tools like
  [Lighthouse](https://github.com/GoogleChrome/lighthouse) to detect performance
  regressions in web apps is often straight-forward.
- **Security:** What’s true for performance is true for security as well. It
  might not be possible to do a full penetration test for every PR but detecting
  typical security holes automatically is well possible in most cases.
- **Testing the deployment:** This is often overlooked but testing deployments
  before actually deploying is a critical piece of a solid testing setup as
  well, in particular for server backends and deployments that include database
  migrations (after all, production data always looks different than you think).
  Not only will testing deployments avoid potential downtimes due to e.g.
  failing migrations but also will it ensure a smooth process by preventing
  rollbacks from being necessary.

And there’s more – depending on the type of application a team works on, they
might want to test for translation strings being complete for all supported
locales, external links still being reachable or accessibility requirements
being met.

### 2. Previewing

Even if pushing out changes to production behind feature flags, developers will
need a way to share their work with stakeholders before the changes go to
production. While teams that use legacy release processes often have a central
staging system that e.g. product managers can access, teams that deploy any
change that’s merged to main directly can’t have such a central staging system
anymore – there’s just no central branch that the staging system could be
deployed from before going to production. There can well be multiple staging
systems though – precisely, one per PR. These systems are typically called
“Preview Systems”.

The idea is to, for every PR, boot up an environment that simulates the
production system as it will look once the respective PR is merged. E.g. for a
PR for a web frontend app, an instance of that frontend with the code from the
PR is set up and connected to a dedicated instance of the backend server it
speaks to at the revision of the backend code that’s currently running in
production. The dedicated URL to that system can then be shared with
stakeholders to preview and approve the changes in the PR or ask for
modifications if there e.g. was a misunderstanding. Once the PR is merged, the
preview system can be automatically torn down again.

Services like Netlify of Vercel offer support for setting up preview systems for
frontend apps automatically out-of-the-box. On the server side, there are
services like Heroku and ArgoCD that have support for preview systems and even
setting up a custom process is an option with manageable complexity in many
cases. The challenging part is typically making a well-defined and realistic
dataset available to these systems so that stakeholder know e.g. how to log in
to these systems and have actual data to play with. Modern database providers
like [Neon](https://neon.tech) make setting up such systems easier with support
for forking (and anonymizing) the production database for use in preview
systems.

### 3. Deploying

Once changes have been tested and approved by stakeholders on preview systems,
they are good to be merged and be shipped to production. Just like for testing,
one main requirement to consider is:

**Manual deployments have no place in such processes or modern software
development in general! Teams that deploy manually will be slower, less
efficient, and ship systems that are less stable than teams that don’t. [^2]**

Teams that aim to push to production several times per day need a stable, fast,
and reversible deployment process. Stability is essential so randomly failing
deployments don’t cause friction and slow the process (and thus the team’s
velocity) down. A fast deployment process is essential for being able to deploy
multiple times per day at all – if e.g. a deployment takes 1h, the maximum
number of deployments in a day is 8, or maybe 9-10 max. That will turn into a
bottleneck even for small teams quickly. Finally, even when testing deployments
before executing them, things can go wrong occasionally. If that happens, it
must be easy to revert the deployment to fix the production system and clear the
path for the next deployment that’s likely already waiting.

### 4. Observing

Of course teams will want to know whether the changes they deployed actually
work in production as intended. Tracking aspects like error rates, performance
metrics but also usage metrics and similar data is essential to remain on top of
what’s actually happening on the production systems. Are things running
smoothly? Has performance regressed since the last deployment? Has usage of a
particular feature gone down significantly which might indicate a bug that has
gone unnoticed?

While the need to have observability in place is not controversial in the
industry, in reality the collected data is often not looked at by anyone. Every
engineer has seen Grafana dashboards that nobody has looked at in weeks and
months or Sentry projects with 1000s of unresolved errors that just end up being
ignored as they are overwhelming anyway. Teams that operate at peak efficiency
will look at their data and at least be aware of sudden spikes that often
indicate things going differently than they should have.

## Constant shipping as a driver for true agility

Teams that ship constantly, in small steps, are also more – and I’d say truly –
agile. Teams that follow a legacy release process often work in a pretty
sequential fashion where product management writes a spec, designers build
mockups based on that, and engineers implement those in the final step – that’s
not really agile at all, it’s essentially the very ancient waterfall process,
just with smaller scopes. In contrast, teams that work and ship more granularly
work through the process in many small iterations, closely together the entire
time.

When the goal is to break features or other changes down into steps that are
each the “smallest-mergable-unit-of-work” possible so that each of these steps
is also shippable individually, product, design, and engineering have to work
together on each of these steps. They need to figure out what the next step is
and how it can go to production (e.g. behind a feature flag) together. That way,
walls between product, design, and engineering are broken down and role
definitions change: product and design are exposed to the small steps in which
engineers evolve a codebase. At the same time, engineers have to work more
closely with product managers and designers to help them translate their needs
into chunks that can be merged and deployed individually. While that closer
collaboration and change of role definitions necessarily leads to friction,
teams that work this way will generally be more aligned, have better
communication, and a more positive team spirit overall.

## Let’s ship!

Teams that ship constantly will run circles around those working with a legacy
release process. They have increased productivity due to a higher level of
automation, less time spent on process and ceremony around deployment decisions
and smaller tasks that are better understood by everyone.

Their collaboration is much better due to the increased frequency and amount of
communication between product, design and engineering which improves
transparency and allows people to better understand and thus appreciate the
perspectives and needs of the other stakeholder groups.

They ship better quality because of the solid and comprehensive testing pipeline
which they not only need to prevent shipping bugs to their users but in
extension, to make their process possible at all and keep it going smoothly.

Their users benefit from accelerated value delivery due to the absence of delays
in the workflow. That gives the teams faster access to user feedback and thus
allows them to be more aligned with their users’ needs at all times.

Finally teams that ship constantly and continuously are reported to have
improved morale across the board – from product people to designers and
engineers. In the end, all software we build, we build to end up in the hands of
users. The shorter and smoother the path towards that goal is, the more
satisfaction people will get from their work and the more motivated they will
be. As Charity Majors puts it:

> [People] who have worked on teams with a short delivery cycle are unwilling to
> ever work anywhere else again. […]
>
> No[body] ever got burned out from shipping too much. [People] get burned out
> from shipping too little.
>
> <author>[Charity Majors](https://charity.wtf)</author>

[^1] Yes, some exceptions do exist but no, your case is almost certainly not one
of those.

[^2] see [^1]

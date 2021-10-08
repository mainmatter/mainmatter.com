---
title: "Effective infrastructure for efficient development workflows"
authorHandle: marcoow
tags: process
bio: "Founder and Managing Director of simplabs"
description:
  "Marco Otte-Witte on how highly automated and integrated development
  infrastructure enables simpler and more effective workflows."
og:
  image: /assets/images/posts/2021-07-13-effective-infrastructure-for-efficient-development-workflows/og-image.png
---

Building software products of any kind is hard enough. Doing so without the
support of powerful infrastructure that enables efficient workflows is even
harder. Yet, many teams are suffering from the absence of such infrastructure,
forcing them into very much inefficient workflows with substantial time and
effort going into synchronizing the work of different engineers, tracking down
bugs, and getting back to tasks later that were already thought to be complete.

<!--break-->

![Effective infrastructure for efficient development workflows illustration](/assets/images/posts/2021-07-13-effective-infrastructure-for-efficient-development-workflows/illustration.svg#full)

## The machine that builds the machine

Elon Musk famously talks about the real challenge that Tesla faced/s isn't
building cars but building and running the factories for building cars at scale.
He refers to the factories as _"the machine that builds the machine"_ and while
the factories aren't still fully autonomous and can't build cars without human
labor, those humans' productivity is multiplied manyfold through highly
automated and integrated production processes. The same applies to software
development – the code isn't going to write itself anytime soon (although
[we're getting closer to that situation step-by-step](http://copilot.github.com)),
but with the help of integrated and automated infrastructure, developers are
enabled to write code more efficiently, faster, and with more certainty.

At the core of every development team's developer workflow, there is git (of
course [other](https://www.perforce.com) [version](http://darcs.net)
[control](https://subversion.apache.org) [systems](http://www.nongnu.org/cvs/)
exist as well, but in reality, almost everyone is using git these days). And
while git's cheap and simple (admittedly not everyone agrees about that)
branching model makes it easy for developers to code away in their own branch as
well as rebase and merge their branches back together, the real challenge that
teams are facing is orchestrating just that so that one person's changes
propagate to the codebases others are working on and merged code ends up in the
production system fast, predictably and with certainty.

Most teams rely on one of two techniques for managing branches and getting
merged code deployed to production:

- `main` branch plus feature branches: once a pull request is merged, the new
  version of the `main` branch is deployed to production automatically.
- `main` or `production` branch, `development` branch and feature branches
  branched off of that: pull requests are merged into `development`, and that
  branch is merged into `production` in intervals following some sort of
  schedule or process.

## Multi-branch setups

While in reality there are thousands of variations of the latter approach, they
are essentially all the same. The goal of those multi-branch setups is to add a
safety net between a pull request being merged and the code being deployed to
the production system. Whenever _"enough"_ changes have accumulated in the
`development` branch (or a scheduled release date has been reached), those
changes would typically go through some kind of testing process where they would
be checked for correctness (and potentially fixed) before eventually making
their way to the production system(s).

That results in all kinds of inefficiencies though:

- When bugs come up in the `development` branch it's often unclear where they
  originate; all kinds of unrelated changes have been merged together in the
  branch so it's unclear whether a bug originates in the pull request that
  implemented the respective feature or whether it is only caused by the
  combination of those changes with others.
- Once bugs or unmet requirements are identified, the developers responsible for
  the changes will have switched to a different task already since there's a
  delay between the merge of their PR to the `develop` branch and the
  testing/validation being performed on that branch. They now have to get back
  to something they considered done already, get all the context in their minds
  again while at the same time leaving whatever they are working on now behind,
  potentially causing problems for others that might be dependant on that work
  so that in the worst case whole cascades of focus and context switches are
  triggered.
- Changes can only be released to production with a delay. Something might be
  done in one week but could potentially only be released the next week or even
  later when the next release is scheduled or the testing cycle completes.
- Sometimes these branching models are so complex that developers don't always
  understand where to branch from, where to merge back and how to resolve the
  conflicts that might occur along the way (after all, rebasing git branches on
  top of each other is a key technique to master with git but in reality not
  something that all developers are comfortable doing).

In fact, these branching models and the inefficient workflows they force
developer teams into are almost always only necessary due to a lack of powerful
infrastructure. If that infrastructure is in place with proper automation and
integration, teams are enabled to adopt a much simpler model and workflow:

## Single `main` branch with auto-deployment

A branching model with a single `main` branch and feature branches that are
branched off of that and merged back right into it, is conceptually much simpler
obviously. Furthermore, deploying all changes that are merged back into the
`main` branch immediately and automatically, dramatically improves the workflow:

- Changes can be tested in isolation so it's clear what causes bugs that are
  found in the process (unless the bug exists in production already, it has to
  be the changes in the respective branch since everything else is just like in
  production).
- Developers will not have progressed to a different task yet. Their pull
  request is still open and a short feedback loop gives them all the feedback
  they need when they need it, thus reducing the need for context switches later
  on.
- Changes can be released to production fast without the need to wait for a
  release date to arrive or enough other changes to have accumulated to
  _"justify"_ a release.
- There's never any uncertainty about what base branch to branch off from, where
  to merge something into, what branch to rebase on what base etc.

![Single `main` branch workflow](/assets/images/posts/2021-07-13-effective-infrastructure-for-efficient-development-workflows/workflow.png#@800-1600)

Of course, the challenge is to do all the testing (and QA in the wider sense)
that happens based on some sort of schedule or process in multi-branch models,
for every single pull request – and ideally for multiple pull requests in
parallel to achieve high throughput. **This is where infrastructure and
automation come in.**

### Testing (sub)systems in isolation

The main building block of any effective developer infrastructure is of course a
good Continuous Integration (CI) system. The most basic task of which being to
run automated checks on a set of code changes to establish baseline correctness.

Typically the foundation of those checks are some sort of unit tests (or
whatever concept the language/framework of choice uses) to ensure the code in
fact does what it is supposed to. They also help to catch regressions early on
in cases where a change to one feature causes another, seemingly unrelated one
to break. Good test coverage and a fast and stable CI system that runs tests are
an absolute requirement for any development team to be successful. While that's
something that's not really new or controversial in our industry, there's more
than just unit tests that can be leveraged to ensure a set of changes is correct
and doesn't lead to regressions

- Visual regression testing can be used to ensure the code doesn't just **work**
  correctly but the UI it generates also looks right (and doesn't change in
  unexpected ways). Visual testing tools like [Percy](http://percy.io) will
  report any visual deviation from a baseline caused by a set of code changes
  and developers will manually approve (or revert) every single one of those.
  That makes all UI changes intentional and avoids accidental changes. Once the
  visual changes are approved and the respective code is merged back, they
  become part of the visual baseline the next PR is compared against, etc.
- Linting and static analysis, in general, can be a powerful tool to find more
  errors and inconsistencies than just particular lines that go against an
  agreed-upon coding style. You could lint translation files to ensure all
  language files have the same set of keys to prevent missing translations or
  prevent the use of `document.cookie` in case you don't want your web app to be
  required to render a cookie banner – there are countless opportunities and I
  personally believe there's still a lot to do in that area that could have huge
  positive impacts on developer teams' efficiency.
- For server systems with databases, migrations can be run against (anonymized)
  snapshots of the production database(s) to ensure they in fact modify the data
  as expected and won't run into unforeseen errors during deployment. It's also
  advisable to test that the server system's currently deployed code runs
  correctly with a migration applied and without it since that's usually what
  will happen when a deployment is rolled back – while it's easy to roll back
  code changes, rolling back migrations is often not an option or the migration
  has to run and complete before the respective code changes can be deployed at
  all.
- For server systems it's also essential to test the deployment of the code
  itself as well as rolling back that deployment. Like with testing migrations,
  this should be done with an (anonymized) snapshot of the production database
  and all tests should be run on the system after the rollback to ensure it
  still operates correctly.

This list isn't even nearly complete. Carefully analyzing any system and its
history of issues usually reveals countless opportunities to automate checks
that would have prevented those issues or can help prevent other issues in the
future.

All of these techniques test one (sub)system in isolation. However, many systems
today aren't built as monoliths but as networks of multiple, distributed systems
– e.g. single page apps (SPAs) with their respective server backends or
microservice architectures. In order to be able to auto-deploy any of the
individual subsystems of such architectures, it's critical to validate they
operate correctly in combination with all other subsystems.

### Testing all subsystems together

The key technique for testing a multitude of subsystems together of course is
end-to-end testing (sometimes also referred to as _"integration"_ or
_"acceptance"_ testing – the terminology is a bit unclear in practice, asking
four different people would typically result in five different opinions on the
exact meaning of each of these terms). For a proper end-to-end test, a pull
request that changes the code of one subsystem is tested together with the
respective deployed revisions of all other subsystems. That allows catching
situations where changes to the one subsystem, while completely consistent and
correct within that subsystem, cause problems when interfacing with other
subsystems. Typical examples for such situations would be backward-incompatible
API changes that would cause errors for any client of the API that hasn't been
updated yet.

Running such tests requires the ability to spin up a complete system including
all of the subsystems on demand. Typically that is achieved by containerizing
all of the systems so that a set of interconnected containers could be started
up on the CI server. In the case of a web app that would mean serving the
frontend app as well as running the API server in two containers and then
running a headless browser to send requests to the frontend app (which would
make requests against the backend) and asserting on the response.

Besides the simple ability to run these containers any time, another aspect of
this is to maintain an example data set to load into those containers so that
that data can be used in the end-to-end tests. Such datasets are typically
maintained in the form of seed scripts that generate a number of well-defined
resources. If such a setup isn't considered early in the project, this is
particularly hard to build later on when there is a plethora of different
resource types and data stores already – maintaining and evolving that data set
along with the code is much easier and efficient.

End-to-end tests aren't the only valuable thing that is enabled by the ability
to spin up instances of the system on demand though:

- Providing fully functional
  [preview systems](https://github.com/simplabs/playbook/tree/master/src/development-process#preview-systems)
  for every pull request allows getting stakeholder approval. If there's a
  preview link in every pull request that points to what's essentially the same
  system that the end-to-end tests run against, allows product managers,
  designers, and other stakeholders to see a new feature in action before it is
  deployed to production. That way they can give feedback while the developer is
  still actively working on the task which again shortens the feedback loop.
- That same system can also be used to do manual QA on a feature. Not everything
  can be automatically tested all the time – sometimes it's just necessary for a
  human to check for example whether an animation _"feels"_ good.
- To some extent, such an on-demand system could also be used for testing the
  performance characteristics of a change. While a containerized system that's
  spun up for testing purposes only will never use the same resources or
  experience the same load as the real production system, of course, it might be
  sufficient to get an idea for the performance characteristics of a feature and
  help to identify problems earlier rather than later.

With all this infrastructure in place, it's possible to move all of the testing
and validation that's done en-block after a whole bunch of pull requests have
been merged in a multi-branch model to the point **before** every individual
pull request is merged. Once it passes all these checks, it can be merged into
the `main` branch and auto-deployed to production with confidence. In fact, this
process can even lead to **increased confidence** in comparison to scheduled big
releases since every single deployment is now also much smaller in scope which
already reduces risk.

### Post deployment

With all that testing and automation in place, it is still possible for things
to blow up in production of course. Besides having error tracking with tools
like [Bugsnag](http://bugsnag.com) or others in place, the ideal infrastructure
also includes a process for running automated smoke tests against the production
system after every single deployment.

These are quite similar in nature to the end-to-end tests with the main
difference that they run against the production system. Typically those tests
would focus on the main flows of an application that also have the highest
relevance for the business:

- Can new users still sign up?
- Does the payment flow still work?
- Are the features that are critical to users still functional?

One concern when running anything automated against the production system –
potentially many times per day – is the amount of test data that is being
produced in the process and that could potentially interfere with analytics or
show up for real users. One way to address that (in the case of web
applications) is to set a custom header that identifies the client as a test
client so that the server can schedule the generated data to be deleted later on
or otherwise be filtered from anything real users can see.

## Efficient development workflows based on effective infrastructure

An efficient workflow based on effective infrastructure as described in this
post undoubtedly raises teams to new levels of productivity. Admittedly, it
takes time and effort to set it all up but the productivity gains easily
outweigh the cost. In particular, when considered early on in a project, that
cost isn't even as substantial as it might seem. The cost however of **not**
having infrastructure like this once it's absolutely needed, which is when
trying to scale a team up without scaling down its relative velocity at the same
time, is certainly much higher.

If you're interested in development workflows and ways to increase efficiency,
also have a look at
[my talk on the topic](https://simplabs.com/resources/video/2020/12/10/the-three-pillars-of-successful-digital-product-development/)
in which I also touch on some process aspects:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3K9jQfpkGWU?rel=0" title="Three pillars of successful digital product development - Product Circle - December 2020" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

_simplabs is a digital product development consultancy that helps teams ship
better software faster, more predictably, and with higher quality. If you're
interested in how we could help improve your infrastructure and workflow,
[schedule a call with us](/contact/)._

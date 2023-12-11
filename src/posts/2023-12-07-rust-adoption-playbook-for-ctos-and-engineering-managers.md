---
title: "Adopting Rust: the missing playbook for managers and CTOs"
authorHandle: algo_luca
tags: [rust]
bio: "Luca Palmieri, Principal Engineering Consultant"
description:
  "You want to kick off your first Rust project. How do you make it a success?
  Here is a playbook for building your first Rust team and, if all goes well,
  scaling it up."
tagline: |
  <p>
   You want to kick off your first Rust project. How do you make it a success?
   Here is a playbook for building your first Rust team and, if all goes well, scaling it up.
  </p>

og:
  image: /assets/images/posts/2023-12-11-adopting-rust/og-image.png
image: "/assets/images/posts/2023-12-11-adopting-rust/header.png"
imageAlt: "The Rust logo on top of a street map"
---

If you look for "Rust adoption" in your favorite search engine, most of the
content you'll find falls into one of two categories:

- How to convince your organization to adopt Rust, usually from the point of
  view of an individual contributor acting as a Rust advocate
- Survey data on Rust adoption

We feel there's a missing playbook: you are in charge of an engineering
organization/unit, and you have determined that Rust is a good technology to bet
on. How do you turn that bet into a success?

This article is our attempt at filling that gap.

### Table of contents

- [Building a team for your first Rust project](#building-a-team-for-your-first-rust-project)
  - [Should you hire?](#should-you-hire)
  - [Assess the readiness of your existing team](#assess-the-readiness-of-your-existing-team)
    - [Previous experience with Rust](#previous-experience-with-rust)
    - [Language proximity](#language-proximity)
    - [Willingness to learn](#willingness-to-learn)
  - [Upskilling your team](#upskilling-your-team)
    - [Self-guided learning](#self-guided-learning)
    - [Training](#training)
    - [Team augmentation](#team-augmentation)
    - [Code audits](#code-audits)
- [Scaling up your team](#scaling-up-your-team)
  - [The state of the Rust job market](#the-state-of-the-rust-job-market)
  - [Job boards](#job-boards)
- [Wrapping up](#wrapping-up)
- [Appendix: Learning resources](#appendix-learning-resources)

## Building a team for your first Rust project

You have a meaningful project in mind, and you are considering using Rust for
it. It's time to build a team!

### Should you hire?

We recommend **not to hire additional staff for your first Rust project**.  
If you go on the job market looking for production Rust expertise, you'll be
competing with the entire industry for a very limited pool of candidates. It may
take you months to find and onboard the right people: can your budget and
project timeline afford that?

Furthermore, it's dangerous to bring people on board for a "Rust job": the
technology might not be a good fit for your organization in the end. You don't
want to end up with a team of frustrated Rust experts with no projects to work
on: it's not going to be a great experience for anyone involved.

### Assess the readiness of your existing team

Unless you are a tiny startup, you already have a team that has been working
with other technologies up until now. Can they be productive with Rust? How long
will it take them to get up to speed?

Assessing their readiness is a key step in determining how to move forward.

#### Previous experience with Rust

First and foremost: look out for the hidden Rust experts in your team. They
might be using Rust in their spare time, or they might have been using it in
previous jobs. They can be an invaluable asset for the rest of your team, and
you should make sure they are involved in the project from the beginning.

Be careful though: staffing your entire project with Rust experts might not be a
great idea in the long run. You want to make sure that the codebase is
accessible to people with less experience with Rust, and that the knowledge is
shared across the team: that's going to happen organically if you add a few Rust
novices to the mix.

#### Language proximity

You might not have a hidden Rust expert in your team, but there might be others
with experience in languages that are close enough to Rust to allow them to
reach productivity quickly.  
C and C++ are obvious candidates, but don't discount functional languages: there
is more than memory management to Rust's learning curve! Having to manage
nullability (`Option`) and failures (`Result`) as types is a paradigm shift:
previous experience with functional languages can smooth the transition
significantly.

#### Willingness to learn

We like to joke about developers spending most of their time chasing the "next
shiny thing", but don't take that attitude for granted. Is your team excited
about the prospect of learning a new language? Are they willing to go through
the discomfort of being a beginner again?

Don't assume "yes" as the answer. Talk to your team, and make sure that they are
on board with the idea.  
This will become less of a factor once you have one or two successful Rust
projects under your belt, with a mature infrastructure and established code
practices, but it's a key aspect to keep in mind for your very first project.

### Upskilling your team

_If you found enough Rust experts in your existing organization to staff your
team, you can skip this section._

We'll assume the most common scenario: you have one or two people in your team
who have played with Rust in their spare time, building a few toy projects, but
nobody with production experience.  
How do you get them up to speed?

#### Self-guided learning

There are a lot of great resources out there to learn Rust at your own pace.  
We recommend a mix of books and hands-on exercises: you can end up spending a
lot of time reading about Rust, convincing yourself that you are "getting it",
just to end up with a blank page when you try to write the first non-trivial
program on your own.

We have collected a vetted list of resources in the
[Appendix](#appendix-learning-resources).

#### Training

Self-learning can play out beautifully, but it may take a while.  
If you don't have the luxury of time, you can speed up the learning process by
finding external mentors for your team.

Workshops are the most common solution.  
If you have a large team, you can bring in a trainer to run a dedicated
workshop. If the team is small, you can buy tickets to join a public workshop
alongside developers from other companies.

Interactivity is the key here: you want to make sure that your team has the
opportunity to ask questions to an experienced Rust mentor to speed up the
learning process and avoid common pitfalls.

To get a sense of what kind of topics a Rust workshop could cover, you can check
out the [Rust workshops](/services/workshops/rust/) that we offer here at
Mainmatter.

#### Team augmentation

If the project is important enough, you might want to consider augmenting your
team with one or two experienced Rust consultants. Embed them in your team:
they'll be working alongside your engineers, helping them get up to speed,
steering the project away from common pitfalls, and make sure that the codebase
is built on solid foundations.

It allows you to compress the timeline significantly: you can start delivering
value _while_ your team is learning Rust.

#### Code audits

If budget is tight, you can consider a code audit as a cheaper alternative to
team augmentation: you hire a consultant for a limited amount of time (e.g. a
few days) to review your codebase.  
At the end of the process, you get a report: critical issues that need to be
addressed urgently, recommendations on how to improve the codebase, and a list
of best practices that you might want to follow going forward. It becomes a
technical roadmap that your team can integrate into their future planning.

Alternatively, you can engage with a consultant _before_ starting the project:
they can help you with the initial design and architecture, putting you on the
right track. They can then pop in again, at regular intervals, to assess the
situation and provide guidance if the plan needs to be adjusted.

## Scaling up your team

Congrats! You've completed your first Rust project: business is thriving, and
you need to scale up your team to keep up with the demand.  
If the demand spike is transient, you can hire contractors to help you out. If
you expect the demand to be long-term, it's time to start hiring.

### The state of the Rust job market

Hiring for Rust positions is **easy**, but attracting talent with Rust
production experience is **hard**.  
The language is fairly young and industry adoption has only picked up in the
last few years, so there are few developers with Rust production horror stories
to tell.  
On the other hand, developers are excited about Rust: there are a lot of
engineers willing to learn it if you can train them; they often won't be
starting from scratch, having played with Rust in their spare time.

All the experience you've accumulated upskilling the team for your first project
will come in handy here: you'll just need to repeat the process on a larger
scale.

### Job boards

On top of the usual job boards, it pays off to advertise your open positions on
Rust-specific channels. We recommend the following:

- Every six weeks, there is a Rust jobs thread on
  [/r/rust](https://www.reddit.com/r/rust/). It's a great place to advertise
  your open positions! Go
  [here](https://www.reddit.com/r/rust/comments/163w6fl/official_rrust_whos_hiring_thread_for_jobseekers/)
  for the latest thread at the time of writing.
- Rust-focused events are a great place to find Rust developers. You can find a
  list of upcoming events, covering both conferences and meetups, on
  [This week in Rusts](https://this-week-in-rust.org/).

There are also recruiting agencies who are starting to specialize in Rust. We
don't have any specific recommendation at this point, but it might be worth
doing your research.

## Wrapping up

We've covered a lot of ground in this article, but we hope we've given you a
good starting point for your Rust journey. If you have any questions, or if
you'd like help with any of the topics covered in the article (training, team
augmentation, code audits, etc.) [get in touch](/contact)!

## Appendix: Learning resources

When it comes to books, we recommend one out of the following three as a
starting point:

- [The Rust Programming Language](https://doc.rust-lang.org/book/) (aka "the
  book"): the official Rust book. It's a great introduction to the language, and
  it's kept up to date with the latest changes to the language.
- [Programming Rust](https://www.oreilly.com/library/view/programming-rust-2nd/9781492052586/):
  compared to the Rust book, it assumes the reader is a more experienced
  developer, and it goes into more detail about the language internals.
- [Rust in Action](https://www.manning.com/books/rust-in-action): a great mix of
  theory and practice, trying to teach the language by building a lot of small
  projects.

When it comes to exercises, you should check out:
[Rustlings](https://github.com/rust-lang/rustlings) and/or
[the Rust track on Exercism](https://exercism.io/tracks/rust).

Once the team is up to speed with the basics of the language, the learning path
will diverge depending on the type of software project you are building.  
If you're dealing with embedded systems,
[The Embedded Rust Book](https://rust-embedded.github.io/book/) is a great
resource.  
If you're building an API or other kinds of backend systems, check out
[Zero to Production](https://zero2prod.com/).  
If you need advanced Rust topics,
[Rust for Rustaceans](https://nostarch.com/rust-rustaceans) and the
[Rustonomicon](https://doc.rust-lang.org/nomicon/) are the way to go.

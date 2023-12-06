---
title: "Adopting Rust: the missing playbook for CTOs and Engineering managers"
authorHandle: LukeMathWalker
tags: [rust]
bio: "Luca Palmieri, Principal Engineering Consultant"
#description:
#  "Paolo Ricciuti (paoloricciuti) shows the newest addition to Storybook that
#  allows for a tighter integration between Storybook and SvelteKit"
#tagline: |
#  <p>Are you using SvelteKit? Are you using Storybook with it? Well, i have good news for you because the SvelteKit integration just got a whole lot better!</p>

# og:
#   image: 
# image: 
# imageAlt: 
---

# Adopting Rust: the missing playbook for CTOs and Engineering managers

If you search for "Rust adoption" in your favourite search engine, most of the content you'll find falls into one of two categories:

- How to convince your organization to adopt Rust, usually from the point of view of an individual contributor acting as a Rust advocate
- Survey data on Rust adoption

We feel there's a missing playbook: you are in charge of an engineering organization/unit, and you have determined 
that Rust is good technology to bet on. How do turn that bet into a success?

This article is our attempt at filling that gap.

## Building a team for your first Rust project

You have a meaningful project in mind, and you are considering using Rust for it. Is it a good idea?

### Assess your team's readiness

Unless you are tiny startup, you already have a team that, up until now, has been using other technologies. Can
they be productive with Rust? How long will it take them to get up to speed?

Assessing their readiness is a key step in determining how to move forward. 

#### Previous experience with Rust

First and foremost: look out for the hidden Rust experts in your team. They might be using Rust in their spare time,
or they might have been using it in previous jobs. They can be an invaluable asset for the rest of your team,
and you should make sure they are involved in the project from the beginning.  

Be careful though: staffing your entire project with Rust experts might not be a great idea in the long run. 
You want to make sure that the codebase is accessible to people with less experience with Rust, and that
the knowledge is shared across the team: that's going to happen organically if you add a few Rust novices to the mix.

#### Language proximity

You might not have a hidden Rust expert in your team, but there might be others with experience in languages
that are close enough to Rust to allow them to reach productivity quickly.  
C and C++ are the obvious examples, but don't discount more functional languages like Haskell or OCaml: there is more
than memory management to Rust's learning curve! Having to manage nullability (`Option`) and failures (`Result`) via
the type system is a paradigm shift for many developers, and having previous experience with functional languages
can help a lot.

#### Willingness to learn

We like to joke about developers spending most of their time chasing the "next shiny thing", but that attitude
is a lot less common than you might think.  
Is your team excited about the prospect of learning a new language? Are they willing to go through the discomfort
of being a beginner again?

Don't assume that the answer is "yes" just because you are excited about Rust. Talk to your team, and make sure
that they are on board with the idea.  
This will become less of a factor once you have one or two successful Rust projects under your belt, with a mature
infrastructure and established code practices, but it's key aspect to keep in mind for your very first project.
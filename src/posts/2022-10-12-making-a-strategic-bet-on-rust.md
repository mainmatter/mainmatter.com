---
title: "Making a strategic bet on Rust"
authorHandle: marcoow
tags: rust
bio: "Marco Otte-Witte"
description:
  "Mainmatter is making a strategic bet on Rust to become the leading
  consultancy to help teams adopt Rust for web projects."
og:
  image: /assets/images/posts/2022-10-12-making-a-strategic-bet-on-rust/og-image.jpg
tagline: |
  <p>Rust continues on its path of success across the industry at full pace. It's been adopted by most big tech companies including Google, Microsoft, and AWS, <a href="https://survey.stackoverflow.co/2022/#section-most-loved-dreaded-and-wanted-programming-scripting-and-markup-languages">voted the most loved language</a> seven years in a row, and just recently <a href="https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=8aebac82933ff1a7c8eede18cab11e1115e2062b">was added to the Linux Kernel</a>.</p>
  <p>We feel now is the right time for more teams to adopt Rust also in web projects now that the ecosystem has reached sufficient maturity for that to be feasible choice. That's why <strong>we're making
  a strategic bet on Rust with the goal of establishing Mainmatter as Europe's leading consultancy for Rust
  in web contexts</strong>. We will leverage our years-long experience augmenting and
  mentoring web teams to help them adopt Rust. Here's why we think this is the
  right step at the right time.</p>

# image: "/assets/images/posts/2022-10-12-making-a-strategic-bet-on-rust/mainmatter-loves-rust.svg"
# imageAlt: "Mainmatter loves Rust"
---

Rust makes a level of efficiency and performance accessible to a wider audience
of engineering teams that was previously out of reach. While C and C++ have
allowed building highly efficient systems for decades, they come with so many
footguns that only extremely skilled and experienced teams can dare to build
anything substantial with them – and
[even those end up with systems that have plenty of problems](https://www.memorysafety.org/about/).
Now, with Rust, everyone can build systems with the same level of efficiency and
performance without having to worry about most of said footguns. Building on
Rust, systems will not only be just as fast as an equivalent system written in C
but also more stable and robust. In addition to ensuring memory safety, Rust's
rich type system and concepts like the `Option` and `Result` types further
increase confidence by encouraging solid error handling through concepts built
into the language itself.

Yet, Rust enables all that without sacrificing expressiveness of the language,
productivity, and developer experience. Modern language concepts like pattern
matching and generics, the integrated
[package manager](https://doc.rust-lang.org/cargo/) and solid development tools,
all make working with Rust a breeze.

## Rust on the Web

So where do we see Rust fitting in for web projects? Around 12 years after the
language's creation, the ecosystem is still relatively young, yet mature enough
for a variety of use cases already:

- **Native extensions** written in Rust (via FFI/NIF mechanisms) can be used to
  speed up parts of existing systems written in Ruby, Elixir, Node, and many
  other languages, by orders of magnitude and provide an easy onramp to
  introducing Rust into a team's tech stack.
- **Isolated subsystems** of larger server systems with very specific
  requirements in terms of performance and robustness are great candidates to
  build in Rust – whether those are individual services in a microservices
  architecture or layers in multi-layered systems.
- Similar to subsystems, **downstream systems** for e.g. data processing and
  similar tasks with relatively limited scope but hard requirements regarding
  efficiency will often benefit hugely from being implemented in Rust.

While all these are relatively isolated use cases with limited scope, we believe
that **eventually Rust will be a reasonable choice for building complete API
servers** as well although as of yet that problem space still requires some
exploration to develop and establish best practices and architectures. We're
excited to bring in our years-long experience building web apps of all kinds and
be a part of this exploration – for the benefit of the clients we work with as
well as the ecosystem overall. Establishing these patterns and building
consensus across the community will eventually drive adoption of Rust on the web
even further as it makes Rust more accessible for more teams.

And of course there's also WASM – while that sees quite some adoption outside of
the browser (e.g. via the
[WebAssembly Micro Runtime](https://github.com/bytecodealliance/wasm-micro-runtime))
recently, it was originally built to enable an entirely new category of apps to
run in browsers. Except for some high visibility examples
([Figma](https://www.figma.com/) likely being the most well known), it remains
slightly unclear how the average team would leverage WASM and what real world
use cases are. Yet, we're excited to explore this space more and support the
teams we work with experimenting what potential WASM can have for them.

![Mainmatter + Rust = 🚀🔥🚀](/assets/images/posts/2022-10-03-this-week-in-os-16/mainmatter-rust-rocket.png)

## Rust is a competitive advantage

Rust gives teams access to a level of efficiency, performance, and robustness
that's far beyond that of most other technologies commonly used for web apps.
Web apps written in Rust will have **better response times while requiring fewer
resources** which saves money and energy (Shane Miller and Carl Lerche gave a
[talk about how using Rust helps minimizing the environmental impact](https://www.youtube.com/watch?v=yQZaBtUjQ1w)
of the systems we all build every day at AWS re:Invent 2021).

At the same time, **teams working with Rust can have more confidence in their
code** because of Rust's rich type system and modern language concepts that
eliminate entire classes of errors. That does not only make code more stable at
runtime and less likely to run into unforeseen errors in production, but also
makes it easier to make changes to systems and maintain them over time compared
to dynamically typed languages (going back to strongly typed languages appears
to be a general trend in the industry, most prominently to be observed by the
huge success that TypeScript had over the past few years).

Finally, building systems in Rust is a competitive advantage in an industry that
continues to fight for the best talents like no other. As mentioned above, Rust
has been
[voted the most loved language](https://survey.stackoverflow.co/2022/#section-most-loved-dreaded-and-wanted-programming-scripting-and-markup-languages)
seven years in a row and literally *every engineer in the world*™ is eager to
work with it. Companies that can hire for Rust (and are willing to up-level
people that are new to the language), will have no problems finding people for
years to come.

## Mainmatter ❤️ Rust

We believe betting on Rust will benefit the teams we work with and enable a
bright future for Mainmatter at the same time. We're looking forward to
<strong>helping our clients adopt Rust for their web projects through
[team augmentation and training](/services/team-augmentation-and-training/)</strong>

We've invested in Rust quite significantly already by

- joining the Rust Foundation as a
  [Silver member](https://foundation.rust-lang.org/members/)
- having several people on the team help maintain [crates.io](https://crates.io)
  on company time for several years now
- running Rust workshops to help teams get started with the language
- creating [EuroRust](https://eurorust.eu), the conference for the European Rust
  community

We're looking forward to continue these investments, extending our involvement
with Rust even more over the next years and helping teams find their path
towards Rust. If you're **interested in Rust and want to adopt it in your
organization**, [reach out](/contact/)!

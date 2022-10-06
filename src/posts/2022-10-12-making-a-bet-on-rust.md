---
title: "Making a bet on Rust"
authorHandle: marcoow
tags: mainmatter
bio: "Marco Otte-Witte"
description:
  "Mainmatter is making a bet on Rust to become the leading consultancy to help
  teams adopt Rust for web projects."
og:
  image: /assets/images/posts/2022-10-12-making-a-bet-on-rust/og-image.jpg
tagline: |
  <p>Rust continues on its path of success across the industry. It's been adopted by most of the big tech companies including Google, Microsoft, and AWS, has been <a href="https://survey.stackoverflow.co/2022/#section-most-loved-dreaded-and-wanted-programming-scripting-and-markup-languages">voted the most loved language</a> seven years in a row and just recently <a href="https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=8aebac82933ff1a7c8eede18cab11e1115e2062b">was added to the Linux Kernel</a>.</p>
image: "/assets/images/posts/2022-10-12-making-a-bet-on-rust/mainmatter-loves-rust.svg"
imageAlt: "Mainmatter loves Rust"
---

We feel now is the right time for more teams to adopt Rust also in web projects.
The ecosystem is mature enough for that to be a feasible choice and we're making
a strategic decision to establish Mainmatter as the leading consultancy for Rust
in web contexts. We can leverage our years long experience augmenting and
mentoring web teams to help them adopt Rust. Here's why we think this is the
right thing to do at the right time.

Rust makes a level of efficiency and performance that's on par with what C and
C++ provide accessible to a wider audience of engineering teams. While C and C++
allow to build highly efficient systems, they come with so many footguns that
only extremely skilled and experienced teams can dare to build anything with
them – and even those end up with lots of problems (TODO: link to C error rates
thing). Now with Rust everyone can build systems with the same level of
efficiency and performance without having to worry about any of these footguns
so that what they build will not only be just as fast as an equivalent system
written in C but also more stable and robust.

TODO: mention robustness because types, option etc.

Finally, Rust enables all that without sacrificing expressiveness of the
language, productivity, and developer experience – it's essentially on par in
that regard with other modern languages.

## Rust on the Web

So where do we see Rust fitting in in web projects? After ca. 10 years the
ecosystem is still relatively young, at the same time mature enough for a
variety of use cases already:

- NIFs (Natively Implemented Functions) can make existing code in Ruby, Elixir,
  Node, and many other language, faster by several factors and provide an easy
  onramp to introducing Rust into a team's tech stack.
- Isolated subsystems of larger server systems with very specific requirements
  in terms of performance and robustness are great candidates to build in Rust –
  whether those are services in a microservices architecture or core layers in
  multi-layered systems.
- Similar to subsystems, downstream systems for e.g. data processing and similar
  tasks with relatively limited scope but hard requirements regarding efficiency
  will often benefit hugely from an implementation in Rust.

While all these are relatively isolated use cases with limited scope, we believe
that eventually Rust will be a reasonable choice for building complete API
servers. That space still requires a bit of exploration to develop and establish
best practices and architectures and we're excited to bring in our years long
experience building web apps of all kinds to help our clients and the ecosystem
overall to do this. Establishing these patterns and building consensus across
the community will eventually drive adoption of Rust on the web even further as
it will make it more accessible for more teams.

Of course there's also WASM. While WASM sees adoption outside of the browser
(e.g. https://github.com/bytecodealliance/wasm-micro-runtime), it was originally
built to enable a new category of apps to run in browsers. Except for some high
visibility examples ([Figma](https://www.figma.com/) likely being the most well
known one), it remains unclear how the average team would leverage WASM and what
real world use cases are. Yet we're excited to explore this space more and
support the teams we work with experimenting what potential WASM can have for
them.

## Rust as a competitive advantage

As mentioned above, Rust allows teams access to a level of efficiency,
performance, and robustness that's far beyond that of most other commonly used
technologies. Web apps written in Rust will have better response times while at
the same time requiring fewer resources which saves money and energy (Shane
Miller and Carl Lerche gave a
[talk about using Rust helps minimizing the environmental impact of what we do at AWS re:Invent 2021](https://www.youtube.com/watch?v=yQZaBtUjQ1w)).

At the same time, teams working with Rust can have more confidence in their code
because of Rust's advanced type system and abstractions like `Option` and
`Result` that eliminate entire classes of errors. That does not only make code
more stable at runtime and less likely to run into errors though but also makes
it easier to make changes to systems and maintain them over time compared to
dynamically typed languages (going back to strongly typed languages is a general
trend in the industry of course, most prominently to be observed by the huge
success that TypeScript had over the past few years).

Finally, developing in Rust is a competitive advantage in an industry that
continues to fight for the best talents like no other. As mentioned above, has
been
[voted the most loved language](https://survey.stackoverflow.co/2022/#section-most-loved-dreaded-and-wanted-programming-scripting-and-markup-languages)
seven years in a row and literally every engineer in the world™ wants to use it.
Companies that are able to hire for Rust (and onboard people that are new to
it), will have no problems finding people for years to come.

## Mainmatter ❤️ Rust

We believe betting on Rust will benefit the teams we work with and enable a
bright future for our company as well. We're looking forward to help teams adopt
Rust via team augmentation and training which we have both been doing for many
years in web related environments. Via doing that work, we're excited to explore
and pave the way for more widespread adoption of Rust in web projects, thus
moving both our clients as well as the general Rust ecosystem forwards.

We've invested in Rust quite significantly already by

- joining the Rust Foundation as a Silver member
- having several people on the team maintain crates.io on company time
- running Rust workshops to help teams get started with the language
- creating EuroRust, the conference for the European Rust community (EuroRust
  2022 is happening on October 13+14: https://eurorust.eu)

We're looking forward to continue these investments, extending our involvement
with Rust even more over the next years and helping teams find their path
towards Rust. If you're interested about Rust and want to adopt it in your
organization, [reach out](/contact/)!

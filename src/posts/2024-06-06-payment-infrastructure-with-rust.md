---
title: "Full-stack development of a B2B payment infrastructure with Rust"
authorHandle: algo_luca
tags: [rust]
bio: "Principal Engineering Consultant"
description:
  "Nikulipe's Florent Bécart and Luca Palmieri explored Nikulipe's journey using
  Rust across all layers of their stack to develop payment processing services."
og:
  image: "/assets/images/posts/2024-04-11-fiberplanes-three-year-rust-journey/og-image.png"
tagline: |
  <p>
  Florent Bécart, CTO of Nikulipe, and Luca Palmieri, Principal Engineering Consultant at Mainmatter, reviewed Nikulipe's experience with Rust, along with the reasons for adopting it as well as challenges they faced along the way.
  </p>

image: "/assets/images/posts/2024-04-11-fiberplanes-three-year-rust-journey/header.jpg"
imageAlt: "Florent's picture on a gray background"
---

Florent begins by discussing Nikulipe's reasons for choosing Rust to develop
their payment processing services. He mentions Rust's lower operations costs,
scalability, safety, and added maintainability compared to C as the language's
main advantages. The borrow checker minimizes vulnerabilities, which is
particularly critical for a payment infrastructure.

Nikulipe uses Rust across all layers of their stack, which promotes full-stack
and vertical ownership for their developers. Talking about frontend, Florent
shares how Nikulipe leveraged tools like Yew and WebAssembly to build an
internal component library to improve and speed up frontend development.

Next, Florent and Luca moved on to the challenges that Nikulipe faced on their
Rust journey. They discussed Rust's long compile times, Cargo's handling of
larger workspaces, and the lack of optimization in feature management and
caching as the primary drawbacks. They end by talking about the obstacles faced
working with Protobuf in Rust which led to code duplication and further
complications.

<iframe width="560" height="315" src="" title="Embedded video of Florent's interview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<rust-newsletter-cta></rust-newsletter-cta>

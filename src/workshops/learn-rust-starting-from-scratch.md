---
title: "Learn Rust, starting from scratch"
format: "Workshop: 4 days, on-site or remote"
description: |
  <p>Rust is a general-purpose programming languages that's been growing in popularity over the past few years.
    It's known for its strong type system, its focus on safety and performance, and its modern tooling.</p>
  <p>We designed this workshop to help you get started with Rust, assuming no prior knowledge of the language.</p>
  <p>The workshop starts from the absolute basics and gradually builds up to more advanced topics, interleaving theory with practice.</p>
  The goal is to offer you a coherent learning path that provides the right level of challenge at every step, 
  without being overwhelming.</p>
  <p>By the end of the workshop, you will have a solid understanding of the Rust language, its standard library,
    and its testing and async programming capabilities. You will be well equipped to start your Rust journey!</p>
  <p>The workshop is designed for software developers who have never used Rust before, but 
  it assumes you're familiar with at least another programming language.</p>
hero:
  image: "/assets/images/workshops/an-introduction-to-testing-in-rust/header-background.jpg"
  imageAlt: "A drawing of a giant crab standing in a village."
og:
  image: /assets/images/workshops/an-introduction-to-testing-in-rust/og-image.jpg
topics:
  - heading: The toolbox
    text: >
      We will cover the tools that every Rust developer should have in their
      toolbox: `rustup` (toolchain management), `cargo` (build system and
      package manager),  `clippy` (linter), `rustfmt` (formatter), and `rustdoc`
      (documentation generator).
  - heading: The language
    text: >
      We will cover in detail the core constructs of the Rust language,
      including: - Syntax - Control flow constructs - Type system - Ownership
      and borrowing - Polymorphism (generics and trait objects) - Closures and
      `Fn*` traits - Panics
  - heading: The standard library
    text: >
      Writing Rust programs is significantly easier if you have mastered the
      standard library. We will cover the most important parts of the standard
      library, including: - Primitive types - Collections and iterators -
      Conversion traits - Smart pointers (Box, Arc, Rc) - Nullability handling
      (Option) - Error handling (Result) - Concurrency primitives (threads,
      channels, locks)
  - heading: Testing
    text: >
      We will build up your Rust's testing toolkit. We will start from scratch,
      with your first unit test. By the end, you will have a comprehensive
      understanding of the available  test types, the best practices in terms of
      test organization as well as their runtime implications. You will be well
      equipped for the testing challenges ahead of you!
  - heading: Async Rust
    text: >
      We will cover the basics of asynchronous programming in Rust, including: -
      The `Future` trait - `async` functions - Spawning tasks - Overview of
      `tokio`, the most popular async runtime in Rust - Common pitfalls
leads:
  - name: Luca Palmieri
    title: Principal Engineering Consultant
    handle: algo_luca
    image: /assets/images/authors/algo_luca.jpg
    bio: >
      Luca Palmieri builds technology products for a living. His current focus
      is on backend development,  software architecture and the Rust programming
      language. He is the author of "Zero to Production in Rust".
---

<!--break-->

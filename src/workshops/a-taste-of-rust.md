---
title: "A taste of Rust"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: |
  <p>Rust has been the most loved programming language on StackOverflow for 7 years in a row. What's it all about?</p>
  <p>Join this workshop to get a taste of Rust! We'll cover the core concepts of the language: structs, enums, traits, 
  testing, key data structures.</p>
  <p>The workshop is organised as a series of exercises. You'll be learning by
  doing! Each concept will be introduced with a short presentation, followed
  by a hands-on exercise with tests to make sure you've wrapped your head
  around it.<br>
  By the end of the workshop, you'll have built a small command-line
  application in Rust: a simple JIRA clone that can be used to manage a
  backlog of tasks.</p>
  <p>The workshop is designed for developers who have experience using other programming languages 
  and are just getting started with Rust.</p>
hero:
  image: "/assets/images/workshops/an-introduction-to-testing-in-rust/header-background.jpg"
  imageAlt: "A drawing of a giant crab standing in a village."
og:
  image: /assets/images/workshops/a-taste-of-rust/a-taste-of-rust-og-image.jpeg
topics:
  - heading: Structs
    text: >
      Structs are the building blocks of Rust programs. We'll cover how to define
      structs, how to implement methods on them, and how to manage their 
      visibility across modules.
  - heading: Enums
    text: >
      Rust's enums are extremely powerful: each variant can have its own data!
      They're an excellent tool for modelling state machines, such as our tasks. 
      We'll cover how to define enums, how to implement methods on them, 
      and how to leverage pattern matching when working with them.
  - heading: Ownership
    text: >
      Ownership is Rust's most distinctive feature. It's what makes Rust code
      safe and performant. We'll cover how ownership works, how it impacts
      the way we write code, and how to leverage it to avoid unnecessary
      memory allocations.
  - heading: Traits
    text: >
      Traits are Rust's way of defining interfaces. We'll cover how to define
      traits, how to implement them for structs and enums, and how to use
      traits to write generic code.
      We'll also cover common traits from the standard library (e.g. `Debug`,
      `Display`, `Clone`, `PartialEq`) and how to derive them automatically.
  - heading: Data structures
    text: >
      The Rust standard library provides a few key data structures that are
      used everywhere. We'll zoom in on `Vec` and `HashMap` as our reference
      examples.
      We'll review where they fit and how to leverage them in our code.
  - heading: CLI applications
    text: >
      As a capstone exercise, we'll build a small command-line application to
      expose our task management functionality.  
      You'll learn how to parse command-line arguments and the difference
      between library and binary crates.
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

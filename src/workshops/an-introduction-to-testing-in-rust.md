---
title: "Testing in Rust: an introduction"
tags: "rust"
format: "Workshop: 4 hours"
subtext: "Bookable for teams – on-site or remote"
description: This half-day workshop will build up your Rust's testing toolkit. We will start from scratch, with your first unit test. By the end, you will have a comprehensive understanding of the available test types, the best practices in terms of test organization as well as their runtime implications.
introduction: |
  <p>Rust's type system is great, but it's not enough on its own to ensure correctness: 
  a solid testing strategy is a requirement for any serious Rust application.</p>
  <p>The workshop will build up your Rust's testing toolkit. We will start from scratch, with your first
  unit test. By the end, you will have a comprehensive understanding of the available 
  test types, the best practices in terms of test organization as well as their runtime implications.
  You will be well equipped for the testing challenges ahead of you!</p>
  <p>The workshop is designed for software developers who are just starting their Rust journey.</p>
  <p>If you've been working with Rust for a while, you might be interested instead in our 
  <a href="/services/workshops/advanced-testing-in-rust/">advanced testing workshop</a>.</p>
hero:
  color: purple
  image: "/assets/images/workshops/an-introduction-to-testing-in-rust/header-background.jpg"
  imageAlt: "A drawing of a giant crab standing in a village."

og:
  image: /assets/images/workshops/an-introduction-to-testing-in-rust/og-image.jpg
topics:
  - title: Writing your first unit test
    text: >
      Straight into the action: the <code>#[test]</code> annotation and  basic assertions!  
      We will wire everything up and get our feedback loop going.


  - title: Testing failures
    text: >
      Unhappy scenarios are often more important than the happy ones!  
      We will discuss the <code>#[should_panic]</code> annotation as well as  the tradeoffs of returning a <code>Result</code> from your tests.


  - title: The Rust testing zoo
    text: >
      Unit tests are just of the test approaches offered by Rust's built-in testing framework—we have integration and doc tests too.  
      We will look at each category and build a mental framework for choosing  the correct testing technique in each context.


  - title: Running your tests
    text: >
      What is a test?  We will take a look under the hood to understand how the Rust built-in testing framework is actually implemented. Armed with this knowledge, we will explore the runtime implications of different approaches for test organisation. We will also cover alternative test  runners, such as <code>cargo-nextest</code>.


  - title: "Test helpers: where do they go?"
    text: >
      Test code is just as important as production code: you want it to be terse and clearly communicate what is being tested. If you follow this philosophy, you'll soon be trying to extract common logic into test helpers: where should they be located? We will cover the different strategies available (test modules, feature gate, helper crate) and their trade-offs.


  - title: Beyond assertions
    text: >
      In closing, we will have a look at a few advanced techniques beyond the  standard toolkit: snapshot testing (<code>insta</code>) and property-based testing (<code>quickcheck</code>).


leads:
  - handle: algo_luca
---

<!--break-->

---
title: "Testing in Rust: going beyond the basics"
tags: "rust"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: A 1-day workshop designed for software developers who have a good understanding of Rust's basic concepts and want to move beyond the built-in testing toolkit.
introduction: |
  <p>No application is an island: you need to interact with third-party APIs, databases and who knows what else. 
  Testing those interactions is tricky, to say the least! 
  This workshop will focus on expanding your Rust testing toolkit, going beyond the basic techniques 
  you're already familiar with. At the end of the session, you'll have a strategy to test most of the scenarios 
  that are relevant for a complex Rust application.</p>
  <p>The workshop is designed for software developers who have a good understanding of Rust's basic
  concepts and want to move beyond the built-in testing toolkit.</p>
  <p>If you are new to Rust instead, you might be interested instead in our 
  <a href="/services/workshops/an-introduction-to-testing-in-rust/">introductory testing workshop</a>.</p>
hero:
  color: purple
  image: "/assets/images/workshops/advanced-testing-in-rust/header-background.jpg"
  imageAlt: "A schematic drawing of a grid with files on top and connecting lines between the files."
og:
  image: /assets/images/workshops/advanced-testing-in-rust/og-image.jpg
topics:
  - title: "Expanding your toolbox: better assertions"
    text: >
      The Rust standard library provides a few macros to perform assertions in your tests: <code>assert!</code>, <code>assert_eq!</code>, etc. They are good enough to get started, but the error messages they produce will often fail to keep up with the complexity of your assertions: we'll explore different libraries to boost the clarity of your test failures.


  - title: "Expanding your toolbox: snapshot testing"
    text: >
      Snapshot testing is a technique that allows us to capture the output of a system under test and compare it with a previously saved version. It is quite useful when working with complex data that might change frequently, such as HTML or error messages. We will explore how to use the <code>insta</code> crate to implement snapshot testing and manage the snapshots lifecycle.


  - title: "Isolating your tests: the filesystem"
    text: >
      All tests in Rust share the same filesystem as the underlying host, a problematic situation when multiple tests want to interact with the "same" files or touch directories that could affect the behaviour of the system they are being executed from.  We will explore various techniques to manage this scenario, including the  <code>tempfile</code> crate.


  - title: "Isolating your tests: the database"
    text: >
      The database is another shared resource that can cause problems when running tests in parallel. We will explore how to use Docker to run an isolated database instance for each test, and how to use the <code>sqlx</code> crate to manage the database lifecycle.


  - title: "Isolating your tests: HTTP mocking"
    text: >
      It is undesirable to have tests that hit real HTTP endpoints from third-party APIs, for a variety of reasons. We will explore how to use the <code>wiremock</code> crate to shield our tests from the outside world and make assertions on the HTTP requests that are being sent.


  - title: "Isolating your tests: mocks, stubs and fakes"
    text: >
      In order to isolate the behaviour of a system under test, it is not unusual to replace some of its dependencies with "fake" implementations. We will explore the different types of fakes and how to use them in Rust. We will review, in particular, the <code>mockall</code> crate and the testing implications of using generics and dynamic dispatch for polymorphism.


  - title: "Custom test runners: what is a test?"
    text: >
      We will take a look under the hood to understand how the Rust built-in testing framework works. Armed with this knowledge, we will explore the runtime implications of different approaches for test organisation. We will also cover alternative test  runners, such as <code>cargo-nextest</code>.


  - title: "Custom test runners: executing logic before and after a test run"
    text: >
      It is often desirable to execute the same logic before and after each test in our suite. We will explore a variety of techniques to achieve this, from a bespoke <code>#[test_case]</code> procedural macro to a custom test harness (via <code>libtest_mimic</code>).


  - title: "Custom test runners: capstone project"
    text: >
      We will combine everything we have learned so far into an easy-to-use setup that allows you to run black-box tests against a real database and a real HTTP server, without having to orchestrate multiple commands—just <code>cargo test</code> and you are good to go!


leads:
  - handle: algo_luca

quotes:
  - text: "Extremely well set up!"
    source: Onsite attendee
  - text: "Well constructed exercises that cover various testing topics. Well done."
    source: Onsite attendee
---

<!--break-->

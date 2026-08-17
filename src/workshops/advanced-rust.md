---
title: "Advanced Rust: designing APIs that are hard to misuse"
tags: "rust"
format: "2 days"
subtext: "Bookable for teams – on-site or remote"
description: A 2-day workshop for experienced Rust developers on using the type system to make misuse of an API a compile error rather than a production incident.
introduction: >
  <p>Every rule your domain has is enforced somewhere: in a comment, in a code review, in a runtime check, or in the type system. Rust has an unusually powerful set of tools for pushing those rules into the compiler, and most Rust code uses only a small fraction of them.</p><p>This workshop is about designing Rust APIs that other people, including your future self, cannot get wrong. You will build one library over the course of the day: <code>minidb</code>, a small embedded key-value store in the spirit of <code>redb</code> or <code>sled</code>. It starts as the kind of code anyone would write in an afternoon, with <code>HashMaps</code>, <code>&str</code> parameters, and <code>Option</code> everywhere. By the end of the workshop, forgetting to commit a transaction is a compile error, a key from one store cannot be used with another, and the only way to hold a value you should not have is to write <code>unsafe</code>.</p><p>Lifetimes are assumed. Elision, non-lexical borrows, and higher-ranked bounds are covered where they come up, because API design keeps running into them.</p><p>The workshop is designed for developers who are comfortable writing Rust and want to get better at designing APIs that other people have to live with. If you are new to Rust instead, start with <a href="/training/learn-rust-starting-from-scratch/">Learn Rust, starting from scratch</a>.</p>


hero:
  color: purple
  image: "/assets/images/workshops/rust-python-interoperability/header-background.jpg"
  imageAlt: "Close-up photo of 3 snake bodies (or 3 parts of the same snake body) stacked on top of each other."
og:
  image: /assets/images/workshops/rust-python-interoperability/og-image.webp
topics:
  - title: Names and documentation
    text: >
      We will cover Rust's naming conventions as a compression scheme: what <code>as_</code>, <code>to_</code>, and <code>into_</code> promise about cost and ownership, which words to borrow from the standard library, and which prefixes carry no information. You will also write doc comments for a caller who cannot see the body, including <code># Errors</code> and <code># Panics</code> sections and examples that <code>cargo test</code> keeps honest.


  - title: The newtype pattern
    text: >
      You will give distinct things distinct types, so that a call to <code>insert(bucket, key, value)</code> cannot compile with its arguments in the wrong order. We will cover parsing rather than validating, so that a <code>Key</code> is evidence the check already ran, and encapsulation, including the doors that <code>Deref</code>, <code>Default</code>, and a derived <code>Deserialize</code> leave open.


  - title: Common traits
    text: >
      A newtype starts with no traits at all, and most of them come back with one <code>derive</code>. We will cover the decisions <code>derive</code> cannot make for you: what <code>Debug</code> puts into your logs, the contract between <code>Hash</code> and <code>Eq</code>, <code>Clone</code> against <code>Copy</code> as a public commitment, and <code>From</code> and <code>TryFrom</code> as the generic entry points to the constructor you already wrote.


  - title: Ownership, borrowing, and lifetimes
    text: >
      We will cover what <code>&</code> and <code>&mut</code> actually promise, lifetime elision and the anonymous lifetime, and the receiver as part of the API. You will work through aliasing against mutation from the inside, using <code>retain</code> and two-pass approaches, and remove the hidden clones from signatures that borrow what they then need to own.


  - title: RAII and drop guards
    text: >
      You will add transactions to <code>minidb</code>, starting with a <code>Transaction</code> that borrows the store and cannot outlive it. We will cover drop guards that roll back automatically, drop bombs and why they have to check <code>thread::panicking</code>, the cases where <code>Drop</code> does not run at all, and a closure API that removes the possibility of forgetting to commit.


  - title: Typestate
    text: >
      We will cover moving the state of a value into its type, so that the operations which are illegal in that state do not exist. You will build a read-only transaction with no <code>insert</code> method using marker types and <code>PhantomData</code>, then a document writer whose transitions consume <code>self</code>, which gives you a state machine with no runtime representation.


  - title: Extension traits
    text: >
      We will cover the orphan rule and why you cannot add a method to <code>str</code>, then the extension trait pattern that works around it, including implementing for the unsized type and a blanket impl over another trait. We will also cover when to reach for a standard trait such as <code>FromStr</code> instead, and how method resolution decides which implementation a call reaches.


  - title: Polymorphism
    text: >
      We will cover static and dynamic dispatch, <code>dyn</code> compatibility and the signatures it rules out, and how to keep a generic function thin so that monomorphisation does not duplicate its body once per type. You will also seal a trait, and we will cover when a closed set is better expressed as an enum.


  - title: PhantomData, variance, and brands
    text: >
      We will cover what <code>PhantomData</code> does to size, auto traits, drop checking, and variance. You will give a handle that owns its data the borrowing behaviour of a reference, then use a branded lifetime and a higher-ranked bound so that keys built against one store cannot be used with another.


leads:
  - handle: algo_luca
---

<!--break-->

---
title: "Migrating C to Rust"
tags: "rust"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: This 1-day workshop gives C/C++ developers a clear, practical path to migrating real code to Rust, covering FFI boundaries, safe abstractions, and testing.
introduction: |
  <p>Migrating C code to Rust is rarely a single “rewrite” step. It’s a process that forces you to weave together these two very different systems. Calling conventions, memory management, 
    tooling, and (most importantly) how you structure and test your code. These things can quickly explode in complexity if 
    not understand and manage correctly.</p>
  <p>We designed this workshop to give your team a coherent path from “I can write Rust” to “I can ship Rust in a C codebase” 
    without hand-waving over these complexities.</p>
  <p>We start from the fundamentals of C/Rust interoperability and gradually build up to a pragmatic module rewrite process, 
    touching on performance, testing, debugging, and long-term maintainability.</p>
  <p>By the end of the workshop, you will have a clear mental model of Rust’s FFI boundaries, know how to design FFI-friendly APIs, 
    have written plenty of (correct) unsafe code, and have a concrete playbook to migrate real modules with confidence.</p>
  <p>The workshop is designed for software developers working in or around C/C++ codebases. Familiarity with Rust basics is helpful, 
    but we’ll introduce the concepts you need as we go.</p>
hero:
  image: "/assets/images/workshops/an-introduction-to-testing-in-rust/header-background.jpg"
  imageAlt: "A drawing of a giant crab standing in a village."
og:
  image: /assets/images/workshops/learn-rust-starting-from-scratch/og-image.jpg
topics:
  - heading: The basics
    text: >
      We will cover the essentials of FFI-safe Rust: <code>extern "C"</code>, ABI considerations, name mangling, <code>#[no_mangle]</code>, and when to use <code>repr(C)</code>.


  - heading: Building and Linking
    text: >
      We will look at how Rust links C code in practice: the <code>-sys</code> crate pattern, using <code>build.rs</code>, integrating with existing build systems, and generating bindings with bindgen—followed by how to build safe abstractions on top of unsafe bindings.


  - heading: Idiomatic FFI
    text: >
      We will translate common C idioms into idiomatic Rust. Iterators instead of manual loops. Return values vs out-parameters. Vtables vs traits (and when to keep the C shape). Strings and encodings (<code>CStr</code> vs <code>str</code>). Return codes vs errors. bitflags.


  - heading: Testing, Benchmarks, and Sanitizers
    text: >
      Testing, benchmarks, sanitizers, and more. We will put our FFI code on solid foundations. We will learn how to effectively use tools like Valgrind, sanitizers, and Miri. We will discover their limitations and when to reach for which tool.


leads:
  - handle: algo_luca

quotes:
---

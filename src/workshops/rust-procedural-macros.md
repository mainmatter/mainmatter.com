---
title: "Procedural Macros: extend the compiler, one token at a time"
tags: "rust"
format: "1 day"
subtext: "Bookable for teams – on-site or remote"
description: >
  <p>Most Rust codebases depend on procedural macros like <code>#[derive(Serialize)]</code>, <code>#[tokio::main]</code>, and <code>sqlx::query!</code>. They keep a large amount of repetitive code out of your project by generating it at compile time. The same applies to your own code: custom macros can keep codebases tidy, concise, and consistent.</p><p>This workshop teaches you how to write your own macros. You will build all three kinds of procedural macros – derive macros, attribute macros, and function-like macros – parsing Rust syntax with <code>syn</code> and generating code with <code>quote</code>. By the end of the day you will know when a macro is the right call and how to write one your colleagues can use without reading its source.</p><p>The workshop is designed for developers who have a good understanding of Rust. If you are new to Rust, start with our <a href="/training/learn-rust-starting-from-scratch/">"Learn Rust, starting from scratch"</a> workshop for an introduction to the language.</p>


hero:
  color: purple
  image: "/assets/images/workshops/rust-python-interoperability/header-background.jpg"
  imageAlt: "Close-up photo of 3 snake bodies (or 3 parts of the same snake body) stacked on top of each other."
og:
  image: /assets/images/workshops/rust-python-interoperability/og-image.webp
topics:
  - title: When to reach for a procedural macro
    text: >
      We will place procedural macros next to the alternatives and compare what a plain function can do, what <code>macro_rules!</code> can do, and what only a procedural macro can do. We will also cover the downsides of macros, and when to write the code by hand instead.


  - title: Tokens, token streams, and <code>cargo expand</code>
    text: >
      Everything a procedural macro receives and returns is a <code>TokenStream</code>. We will cover how the compiler turns source text into tokens, why the result is a tree, and how to use <code>cargo expand</code> to see the generated code.


  - title: Writing your first derive macro
    text: >
      You will write a derive macro end to end: setting up the proc-macro crate, parsing the annotated item into a <code>syn::DeriveInput</code>, generating an <code>impl</code> block with <code>quote!</code>, and moving your logic behind <code>proc-macro2</code> types so it can be unit tested.


  - title: Testing macros with <code>trybuild</code>
    text: >
      Unit tests prove that your macro emits well-formed tokens, but not that the generated code compiles. <code>trybuild</code> closes that gap, and snapshots the compiler's output in case of errors.


  - title: Deriving over real types
    text: >
      Real derive macros handle more than named structs. We will cover tuple structs, unit structs, and enums via the match on <code>syn::Fields</code>, and generics with <code>split_for_impl</code>.


  - title: Code that compiles in someone else's crate
    text: >
      Your macro will be compiled in modules you have never seen, os it needs to be robust. We will cover absolute references like <code>::std::string::String</code>, so a local <code>type String = MyString;</code> cannot change what your macro means, and identifier scoping, so two types deriving the same macro in one module do not collide.


  - title: Error messages your users can act on
    text: >
      We will work through the progression from a panicking macro to a useful diagnostic: <code>compile_error!</code>, then <code>syn::Error</code> and <code>syn::Result</code>, and spans that make the compiler underline the field that is actually wrong.


  - title: "Attributes: container, field, and <code>darling</code>"
    text: >
      Helper attributes are what make a derive macro configurable, as in <code>#[serde(rename_all = "camelCase")]</code>. We will cover reading them with <code>parse_nested_meta</code> and <code>parse_args</code>, then replacing that with darling, and finish with a custom <code>#[derive(Builder)]</code> derive macro.


  - title: Function-like macros and custom syntax
    text: >
      Whatever sits between a macros's parentheses is yours to parse. We will cover why <code>println!</code> has to be a macro, when to prefer this over <code>macro_rules!</code>, and build a small DSL along the lines of a <code>routes!</code> macro.


  - title: Attribute macros
    text: >
      Unlike a derive, an attribute macro replaces the item it is attached to. We will cover wrapping a function, re-emitting the original item on failure, and parsing arguments with <code>darling</code>'s <code>FromMeta</code> to build <code>#[retry(times = 3, delay_ms = 100)]</code>.


  - title: "Capstone: a state machine macro"
    text: >
      You will build one macro that uses everything: code generation over an enum, custom attributes declaring transitions and the initial state, invalid transitions rejected at compile time, and hygienic identifiers.


leads:
  - handle: algo_luca
---

<!--break-->

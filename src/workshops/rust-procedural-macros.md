---
title: "Procedural Macros: extend the compiler, one token at a time"
tags: "rust"
format: "1 day"
subtext: "Bookable for teams – on-site or remote"
description: This 1-day workshop will make you comfortable writing procedural macros in Rust. We cover all relevant topics from advantages and disadvantages of Rust, the kinds of procedural macros, tools like syn and quote, as well as error handling and testing.
introduction: >
  <p>Most Rust codebases depend on procedural macros like <code>#[derive(Serialize)]</code>, <code>#[tokio::main]</code>, and <code>sqlx::query!</code>. They keep a large amount of repetitive code out of your project by generating it at compile time. The same applies to your own code: custom macros can keep codebases tidy, concise, and consistent.</p><p>This workshop teaches you how to write your own macros. You will build all three kinds of procedural macros – derive macros, attribute macros, and function-like macros – parsing Rust syntax with <code>syn</code> and generating code with <code>quote</code>. By the end of the day you will know when a macro is the right call and how to write one your colleagues can use without reading its source.</p><p>The workshop is designed for developers who have a good understanding of Rust. If you are new to Rust, start with our <a href="/training/learn-rust-starting-from-scratch/">"Learn Rust, starting from scratch"</a> workshop for an introduction to the language.</p>


hero:
  color: purple
  image: "/assets/images/workshops/rust-python-interoperability/header-background.jpg"
  imageAlt: "Close-up photo of 3 snake bodies (or 3 parts of the same snake body) stacked on top of each other."
og:
  image: /assets/images/workshops/rust-python-interoperability/og-image.webp
topics:
  - title: Introduction
    text: >
      Rust has three kinds of procedural macros, and you have used all of them already. We will look at derive, function-like, and attribute macros in the wild, expand <code>thiserror</code> with <code>cargo expand</code> to see what they generate, and compare macros against plain functions and <code>macro_rules!</code> so you know when a procedural macro is the right call – and when it is not.


  - title: The proc-macro toolkit
    text: >
      Time to get your hands dirty. You will set up a proc-macro crate, write a minimal derive macro, and learn what a macro actually receives and returns: tokens and token streams, why <code>proc-macro2</code> makes your code testable, parsing Rust code with <code>syn</code>, and generating it with <code>quote</code>. We will also cover the re-export pattern used by <code>serde</code> and <code>thiserror</code>, and how to test a macro with <code>trybuild</code>.


  - title: Derive macros
    text: >
      Where the real work happens: handling every struct field layout and enums, absolute paths and hygienic identifiers so your output compiles in anyone's crate, error reporting from <code>panic!</code> to <code>compile_error!</code> to properly spanned <code>syn::Error</code>s, container and field attributes by hand and then with <code>darling</code>, and generics with lifetimes and <code>where</code> clauses.</code>.


  - title: Function-like macros
    text: >
      Whatever sits between a macro's delimiters is yours to interpret, even if it is not valid Rust. We will cover why <code>println!</code> has to be a macro, how to parse arbitrary token input, how to define your own syntax, and when to prefer this over a declarative macro. You will finish by building a small DSL: a <code>routes!</code> macro.


  - title: Attribute macros
    text: >
      Unlike a derive, an attribute macro receives the annotated item and returns its replacement. We will cover the parse-tweak-re-emit loop on a function, graceful error handling by re-emitting the original item to avoid cascading errors, and parsing attribute arguments with <code>darling</code>'s <code>FromMeta</code> to build a <code>#[retry(times = 3, delay_ms = 100)]</code> attribute.


  - title: "Putting it all together"
    text: >
      A capstone that draws on the whole day: a <code>#[derive(StateMachine)]</code> macro. Code generation over an enum's variants, custom helper attributes declaring the initial state and the allowed transitions, invalid transitions rejected at compile time with the error spanned on the offending token, and generated identifiers that never clash.



leads:
  - handle: algo_luca
---

<!--break-->

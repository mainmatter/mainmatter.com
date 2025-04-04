---
title: "Rust-Python Interoperability"
tags: "rust"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: >
  <p>Python has served you well: you spun up a prototype and iterated quickly, keeping up with the evolving requirements of a successful product. Nonetheless, as time goes on, cracks are starting to show up: an endpoint is slower than it needs to be, a data processing job that took seconds now takes almost an hour, and your infrastructure bill is growing too fast compared to the size of your user base. Engineers are starting to whisper: is it time for a rewrite? Should we pause feature development to rebuild everything on more solid foundations? That's an option, but it's expensive.</p><p>There's another path: rather than throwing away your entire Python codebase to start over, you analyse your application and isolate the performance-critical bits—the so-called "hot modules" where your application spends most of its time. You will rewrite those in Rust and package them as a Python native extension. This workshop will teach you how.</p><p>We will cover the <code>pyo3</code> crate, the subtleties of Python's Global interpreter lock, and typical examples that may arise in your daily Rust-Python interoperability work. By the end of the session, you will be well-equipped to seamlessly replace your slow Python modules with easy-to-use and blazingly fast Rust modules.</p><p>We assume you are familiar with Rust and Python, but we don't assume any prior interoperability knowledge. We will provide a brief explanation and references whenever we rely on advanced features in either language.</p>


hero:
  color: purple
  image: "/assets/images/workshops/rust-python-interoperability/header-background.jpg"
  imageAlt: "Close-up photo of 3 snake bodies (or 3 parts of the same snake body) stacked on top of each other."
og:
  image: /assets/images/workshops/rust-python-interoperability/og-image.jpg
topics:
  - title: Introduction to Rust-Python Interoperability
    text: >
      We kick off with looking at the advantages of combining Rust and Python, understanding where each language shines and why interoperability is valuable. This module introduces tools like <code>PyO3</code>, which enables Rust code integration within Python environments, and <code>maturin</code>, a library for building, packaging and publishing Python extensions written in Rust.


  - title: Building Python Extensions in Rust
    text: >
      We'll continue with the process of creating Python-callable Rust functions, setting up projects using <code>PyO3</code>, and configuring the development environment to handle Rust extensions in Python.


  - title: Managing Data and Types
    text: >
      Next, participants will learn how to handle complex data structures shared between Rust and Python, with a focus on type conversions, data ownership, and ensuring memory safety across both languages.


  - title: Concurrency and the GIL
    text: >
      The workshop covers Python’s Global Interpreter Lock (GIL) and strategies for concurrent programming, including async programming in Rust that can enhance Python’s parallel processing capabilities.


  - title: Creating Python Classes with Rust
    text: >
      We move on to explore creating Python-accessible classes directly in Rust using <code>PyO3</code>'s <code>#[pyclass]</code> attribute. This module teaches struct definition, implementing methods, and adding Rust-based functionality to Python classes.


  - title: Static Methods and Inheritance
    text: >
      The final module details adding static methods to Rust-backed Python classes, along with managing inheritance and visibility in Python environments.


leads:
  - name: Luca Palmieri
    title: Principal Engineering Consultant
    handle: algo_luca
    image: /assets/images/authors/algo_luca.jpg
    bio: >
      Luca Palmieri builds technology products for a living. His current focus is on backend development, software architecture and the Rust programming language. He is the author of "Zero to Production in Rust".


quotes:
  - text: "[…] Really enjoyed the training. The approach of self-paced, bit of background reading and including solutions, works for me."
    source: Onsite attendee
  - text: "These 8 hours might have saved me from naively starting a PyO3 project and waste a lot of effort and my companies money :) […]"
    source: Onsite attendee
---

<!--break-->

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
  - title: Python extensions, <code>maturin</code> & <code>pyo3</code>
    text: >
      An introduction to the anatomy of Python extensions, <code>maturin</code>, a library for building, packaging and publishing Python extensions written in Rust, as well as <code>pyo3</code>, a crate that exposes Rust bindings for Python.


  - title: Global Interpreter Lock
    text: >
      Python's Global Interpreter Lock (GIL) prevents data races as Python's own data structures are not thread-safe. When building native extensions in Rust, special care is required to prevent Rust code from interacting with Python object without holding the GIL. We'll look into how <code>pyo3</code>'s <code>Python<'py></code> type guarantees correct usage of the GIL.


  - title: Output values and exceptions
    text: >
      Let's now move our focus to output values: how do you return something from your Rust functions to Python? And how are Python exceptions converted to Rust <code>Result</code>s?


  - title: Classes
    text: >
      Classes are a cornerstone of every Python program. How do they map to Rust code, including constructors, methods, getters and setters, static methods, and inheritance?


leads:
  - name: Luca Palmieri
    title: Principal Engineering Consultant
    handle: algo_luca
    image: /assets/images/authors/algo_luca.jpg
    bio: >
      Luca Palmieri builds technology products for a living. His current focus is on backend development, software architecture and the Rust programming language. He is the author of "Zero to Production in Rust".
---

<!--break-->

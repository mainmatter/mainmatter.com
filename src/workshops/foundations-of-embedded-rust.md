---
title: "Foundations of Embedded Rust"
tags: "rust"
format: "Workshop: 3 days"
subtext: "Bookable for teams – on-site or remote"
description: >
  <p>Rust is the future of embedded software. No matter if you’re developing robust embedded systems, creating low-power, secure IoT products, or taking your device to space, Rust revolutionizes embedded software engineering. In this workshop, you’ll learn to apply your embedded engineering skills to the modern, ergonomic, performant, and memory safe programming language that is Rust. You’ll get acquainted with Rust’s embedded ecosystem, widely used tooling, and work your way from the basics to writing complex, multitasking applications.</p> <p>Furthermore, this workshops covers the current state of art when it comes to using Rust in safety-critical systems with real-time requirements.</p> <p>At the end of this workshop, you will be able to build robust and secure (asynchronous) embedded applications in Rust, write platform-agnostic device drivers, and work with tools and frameworks that are widely used in Rust's embedded ecosystem. On top of that, you know what to consider when it comes to using Rust in safety-critical systems.</p> <p>This workshop is targeted at experienced embedded developers that want to learn embedded development in Rust. Limited knowledge of Rust is assumed, but you are assumed to be proficient in low-level embedded software engineering in C or C++.</p><p>We will work with real hardware during this workshop.</p>


hero:
  color: purple
  image: "/assets/images/workshops/foundations-of-embedded-rust/embedded-rust-hero.jpg"
  imageAlt: "A crab standing on a printed circuit board"
og:
  image: /assets/images/workshops/foundations-of-embedded-rust/og-image.jpg
topics:
  - title: Rust's embedded ecosystem
    text: >
      Rust's embedded ecosystem is built around a set of standard APIs that let you write platform-independent code even for bare-metal development. This is possible thanks to Rust's strong and expressive type system and its package manager, Cargo, which makes it easy to add and manage dependencies on third-party libraries. In this part, you'll get an overview of the ecosystem, with a focus on the <code>core</code> library and the structure of Peripheral Access Crates and Hardware Abstraction Layers (HALs).


  - title: Tooling and documentation
    text: >
      There are various great tools out there that make life of an embedded Rust engineer much easier. This part covers the structure of a typical embedded Rust project, finding and adding dependencies and finding their documentation and usage examples, and optimising your code. Furthermore, you’ll work with <a href="https://probe.rs/"><code>probe-rs</code></a> to load and debug your application and log over RTT and <a href="https://github.com/knurling-rs/defmt"><code>defmt</code></a>.


  - title: A basic Rust application
    text: >
      With a solid grasp of the context and tools, you’re ready to write your first embedded Rust application. In this part, you’ll learn the Rust way of writing embedded applications, interacting with hardware and configuring interrupts. This part covers the hardships of sharing resources between application code and interrupt handlers, how Rust makes those explicit, and how to overcome them safely.


  - title: Writing cross-platform device drivers
    text: >
      API standards in Rust's embedded ecosystem enable writing platform-independent code, and making your device drivers cross-platform is just a matter of adhering to them. This part introduces Rust's trait and generics mechanism, allowing you to write your first sensor driver in Rust that can be used from bare-metal all the way to embedded linux, whatever the hardware platform.


  - title: An async Rust application
    text: >
      One of Rust's killer features for embedded development is language support for asynchronous multitasking. This part introduces how Rust transforms async code into state machines that can be run by embedded-specific executors such as <a href="https://embassy.dev/"><code>embassy-executor</code></a>. You’ll learn how a typical <code>embassy</code>-based application is structured, how to interact with hardware asynchronously, and how to configure interrupts and background tasks.


  - title: Rust in IoT
    text: >
      Communicating with systems external to the device is an essential requirement for almost every embedded system. In this part, you’ll learn how to leverage Rust to set up robust, re-usable, secure, and maintainable communications, as well as share code between device and server. You’ll make your device speak MQTT to exchange custom-defined, encrypted messages with a remote server.


  - title: A Zephyr application written in Rust
    text: >
      Sometimes, you’re in a situation where choices have been made for you. With the rising popularity of <a href="https://www.zephyrproject.org/">Zephyr RTOS</a> you may well find yourself having to write your code as a Zephyr application. In this part, you’ll learn how to write your Zephyr applications in Rust. This part covers the current state of Rust support in Zephyr, and interacting with various OS APIs.


  - title: Rust in safety-critical systems
    text: >
      Picking a memory safe programming language when creating safety-critical systems seems a no-brainer, but with the embedded world still relying heavily on older programming languages, deviating from the standard has implications. This part covers the current state of art when it comes to using Rust to write safety-critical code, and what to consider in doing so. In addition, this part covers writing embedded applications with real-time requirements using the <a href="https://rtic.rs/">RTIC</a> concurrency framework.


leads:
  - handle: hdoordt
---

---
title: "Foundations of embedded Rust"
tags: "rust"
format: "Workshop: 3 days"
subtext: "Bookable for teams – on-site or remote"
description: >
  <p>Whether you’re developing robust embedded systems, creating low-power, secure IoT products, or taking your device to space, Rust evolves embedded software engineering. In this workshop, you’ll learn to apply your embedded engineering skills to the modern, ergonomic, performant, and memory safe programming language that is Rust. You’ll get acquainted with Rust’s embedded ecosystem, widely used tooling, and work your way from the basics to writing complex, multitasking applications.</p> <p>Furthermore, this workshops covers the current state of art when it comes to using Rust in safety-critical systems with real-time requirements.</p> <p>At the end of this workshop, you will be able to build robust and secure (asynchronous) embedded applications in Rust, write platform-agnostic device drivers, and work with tools and frameworks that are widely used in Rust's embedded ecosystem. On top of that, you know what to consider when it comes to using Rust in safety-critical systems.</p> <p>This workshop is targeted at experienced embedded developers that want to learn embedded development in Rust. Limited knowledge of Rust is assumed, but you are assumed to be proficient in low-level embedded software engineering in C or C++.</p><p>We will work with real hardware during this workshop</p>


hero:
  color: purple
  image: "/assets/images/workshops/foundations-of-embedded-rust/embedded-rust-hero.jpg"
  imageAlt: "A crab standing on a printed circuit board"
og:
  image: /assets/images/workshops/foundations-of-embedded-rust/og-image.jpg
topics:
  - title: Rust's embedded ecosystem
    text: >
      Using Rust's strong and expressive type system, and with the ease of adding dependencies to your project using Cargo, Rust's library and tooling ecosystem revolves around standard APIs that allow for writing platform-independent code even in bare-metal embedded software development. This part covers the outline of this ecosystem, and draws the context in which the ecosystem lives, covering the <code>core</code> library, and the structure of Peripheral Access Crates and Hardware Abstraction Layers.


  - title: Tooling and documentation
    text: >
      There are various great tools out there that make life of an embedded Rust engineer much easier. This part covers the structure of a typical embedded Rust project, finding and adding dependencies and finding their documentation and usage examples, and optimising your code. Furthermore, you’ll work with <code>probe-rs</code> to load and debug your application and log over RTT and <code>defmt</code>.


  - title: A basic Rust application
    text: >
      With a solid grasp of the context and tools, you’re ready to write your first embedded Rust application. In this part, you’ll learn the Rust way of writing embedded applications, interacting with hardware and configuring interrupts. This part covers the hardships of sharing resources between application code and interrupt handler, how Rust makes those explicit, and how to overcome them in a safe way.


  - title: Writing cross-platform device drivers
    text: >
      API standards in Rust's embedded ecosystem enable writing platform-independent code, and making your device drivers cross-platform is just a matter of adhering to them. This part introduces Rust's trait and generics mechanism, allowing you to write your first sensor driver in Rust that can be used from bare-metal all the way to embedded linux, whatever the hardware platform.


  - title: An async Rust application
    text: >
      One of Rust's killer features for embedded development is language support for asynchronous multitasking, independent of the runtime. This part introduces how Rust transforms async code into state machines that can be executed by executors such as <code>embassy-executor</code>. You’ll learn how a typical <code>embassy</code>-based application is structured, how to interact with hardware in an asynchronous way, and configuring interrupts and background tasks.


  - title: Rust in IoT
    text: >
      Communicating with systems external to the device is a basic feature that is a requirement for almost every embedded system. In this part, you’ll learn how to leverage Rust for setting up robust, re-usable, secure and maintainable communications, sharing code between device and server. You’ll make your device speak MQTT, communicating custom-defined, encrypted messages with a server.


  - title: A Zephyr application written in Rust
    text: >
      Sometimes, you’re in a situation where choices have been made for you. With the rising popularity of Zephyr RTOS you may well find yourself having to write your code as a Zephyr application. In this part, you’ll learn how to write your Zephyr applications in Rust. This part covers the current state of Rust support in Zephyr, and interacting with various OS APIs.


  - title: Rust in safety-critical systems
    text: >
      Picking a memory safe programming language when creating safety-critical systems seems a no-brainer, but with the embedded world still relying heavily on older programming languages, deviating from the standard has implications. This part covers the current state of art when it comes to using Rust to write safety-critical code, and what to consider in doing so. In addition, this part covers writing embedded applications with real-time requirements using the RTIC concurrency framework.


leads:
  - name: Henk Oordt
    title: Senior Software Engineering Consultant
    handle: hdoordt
    image: /assets/images/authors/hdoordt.jpg
    bio: >
      Henk is a long time Rust engineer with a diverse background in developing Rust applications and others the trade, and has been writing embedded Rust since the early days. As a member of Rust's embedded working group, Henk works on creating educational content on embedded Rust, such as Rust's Discovery book.
---

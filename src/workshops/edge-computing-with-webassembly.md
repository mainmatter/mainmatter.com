---
title: "Edge Computing with WebAssembly"
tags: "rust"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: 1-day workshop – This hands-on workshop teaches how to build such efficient, portable, and secure server-side applications using Rust and WebAssembly.
introduction: <p>Your backend services are working, but they're not thriving. Docker containers feel heavy, cold starts are slow, and your cloud bill keeps climbing. Security concerns keep you up at night, all while you’re fighting the spaghetti-stack to deliver features on a tight deadline. You've heard WebAssembly is the future, but it seems confined to browsers - can it solve your server-side problems?</p><p>Yes it can! WebAssembly is starting to power anything from safety-critical embedded applications to large-scale web services. Employed correctly it gives you microsecond cold boot times, reliable sandboxing, safe user extensibility, and much more.</p><p>In this hands-on workshop you will learn how to build such an efficient, portable, and secure server-side applications using Rust and WebAssembly. We’ll cover everything from foundational concepts to cutting edge features and by the end, you’ll have built a microservice in Rust, compiled it to WebAssembly, and deployed it using cutting-edge tooling. You’ll understand when this approach outshines containers, where the technology is headed, and how to incorporate these techniques into your existing infrastructure.</p>
hero:
  color: purple
  image: "/assets/images/workshops/edge-computing-with-webassembly/edge-computing-with-webassembly-hero.jpg"
  imageAlt: "A dense, abstract network of thin black lines and nodes forming geometric, web-like connections against a light background."
og:
  image: /assets/images/workshops/edge-computing-with-webassembly/og-image.jpg
topics:
  - title: Getting Started with WebAssembly
    text: > 
      We introduce the core concepts by building a WebAssembly HTTP handler in Rust from setup to deployment. You’ll create your first modules, examine raw WebAssembly binaries, and explore the surrounding standards and tooling, while seeing how Rust compiles to WebAssembly.
  
  - title: Understanding Memory and the Component Model
    text: >
      After calling your first functions and confronting core WebAssembly's manual memory model, you'll transition to the Component Model, use WIT to enable automatic type marshaling, and finish by building a standalone WebAssembly CLI component.
      
  - title: Going Serverless
    text: >
      We expand the basic HTTP handler to explore different Wasm runtimes, deployment options, and common backend patterns in WebAssembly. You'll see why WebAssembly excels in serverless environments, learn its capability-based security model by explicitly granting outbound HTTP access, and build robust HTTP endpoints with proper error handling.
      
  - title: Data Persistence and Routing
    text: >
      You’ll add persistent state using a key–value store, upgrade to SQLite for safe and efficient data access, and implement both in-component routing with path parameters and multi-component routing within a larger architecture.

  - title: Debugging and Observability
    text: >
      No production application is complete without effective debugging and observability, so we explore debugging tools, performance profiling, and monitoring solutions. You’ll instrument your application with OpenTelemetry, examine metrics, traces, and logs using common observability stacks.
  
  - title: Optimizing WebAssembly
    text: >
      We will aggressively reduce WebAssembly binary sizes through optimization and post-processing. 
      You'll understand how to profile and improve WebAssembly performance.

leads:
  - handle: JonasKruckenberg
    bio: >
      Jonas Kruckenberg is a systems engineer and technologist focused on next-generation computing infrastructure, including k23 - an experimental operating system. As a TC39 Invited Expert, he helps shape the future of web standards by bringing non-browser WebAssembly perspectives to language standardization.
---

<!--break-->

## Customised to your team’s needs

We're happy to customize the workshop to precisely fit your team's specific needs or challenges. If you have a very specific branching model or infrastructure or your team frequently struggles with particular aspects of Git, we can adapt the focus of the workshop more towards these aspects or cover additional topics as necessary.

All content and examples of the workshop are available publicly on [GitHub](https://github.com/mainmatter/git-workshop).

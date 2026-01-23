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
  - title: Foundations
    text: >
      We start by introducing the basic concepts and building our first WebAssembly HTTP handler in Rust, from setup to deployment. You'll build your first modules, look at raw WebAssembly modules and understand the current ecosystem of standards and tooling.
      
You will:
- Set up the project and discover how the Rust compiler produces to WebAssembly binaries.
- Be calling your first functions and experience core WebAssembly's limitations by manually passing strings as pointer-length pairs.
- Transition to the Component Model and use WIT interface definitions to eliminate manual memory management with automatic type marshaling.
- Build a WebAssembly CLI component that runs as a standalone executable.


  - title: Building Real-World Services
    text: >
      We then expand on our basic HTTP handler, looking at different Wasm runtimes, deployment options, and common backend patterns in WebAssembly. You'll learn how to work with databases, manage state, and integrate Wasm modules into existing architectures.
      
You will:
- Discover why WebAssembly is superior for serverless workloads.
- Understand WebAssembly's capability-based security model by explicitly granting your component permission to make outbound HTTP requests.
- Create your first HTTP endpoint and implement proper error handling with Result types.
- Add persistent state to your serverless functions by storing and retrieving data from a key-value store.
- Upgrade to SQLite for data storage and learn how to safely manage queries and connections.
- Implement both in-component routing with path parameters and multi-component routing.


  - title: Advanced Topics
    text: >
      No production application is complete without tools to debug it. We will look debuggers, performance profiling tools, as well as monitoring solutions. We finish off by building expanding our HTTP handler yet again and - with everything we learned - build a simple calculator API service.
      
You will:
- Set up OpenTelemetry instrumentation and explore metrics, traces, and logs using Jaeger, Grafana, and Prometheus.
- Dramatically reduce binary sizes using release builds, aggressive optimization flags, and wasm-opt post-processing to achieve sub-400KB modules.
- Explore ideas for extending your calculator with features like queryable history, sharing, and Rust-based frontends.


leads:
  - handle: JonasKruckenberg
    bio: >
      Jonas Kruckenberg is a systems engineer and technologist focused on next-generation computing infrastructure, including k23 - an experimental operating system. As a TC39 Invited Expert, he helps shape the future of web standards by bringing non-browser WebAssembly perspectives to language standardization.
---

<!--break-->

## Customised to your team’s needs

We're happy to customize the workshop to precisely fit your team's specific needs or challenges. If you have a very specific branching model or infrastructure or your team frequently struggles with particular aspects of Git, we can adapt the focus of the workshop more towards these aspects or cover additional topics as necessary.

All content and examples of the workshop are available publicly on [GitHub](https://github.com/mainmatter/git-workshop).

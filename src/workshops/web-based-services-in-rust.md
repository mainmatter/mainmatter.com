---
title: Web-based Services in Rust
format: "Workshop: 2-3 days"
subtext: "Bookable for teams – on-site or remote"
description: <p>Rust is an excellent programming language for developing web
  applications and web services due to its concurrency approach, tool
  flexibility, library availability, and rich ecosystem. As a result, you can
  create services that are fast, reliable, and cost-effective. In fact, using
  Rust to write services can tremendously reduce your operating costs. However,
  the main challenge is knowing where to start. This workshop aims to guide you
  through the process of building web services using the ecosystem around the
  Tokio async runtime. You will learn how to make basic API calls, create
  advanced middleware layers to add functionality, and conduct tracing and
  testing.</p></br>

  <p>This workshop is intended for developers who have some experience with Rust
  and want to learn more about its problem domain for web applications. It is
  not necessary to have written Rust in a production environment yet. If you are
  just starting out with Rust, we will provide you with preparatory material
  beforehand.</p>
hero:
  image: "/assets/images/workshops/web-based-services-in-rust/header-background.jpg"
  imageAlt: "Several cogs and mechanical elements in purple."
og:
  image: /assets/images/workshops/web-based-services-in-rust/og-image.jpg
topics:
  - heading: Tokio, Hyper, and Axum
    text: >
      We will begin by setting up a web server for our web application using the
      Axum framework, which is built on top of Tokio and Hyper. We will learn
      about the FromRequest and IntoResponse traits, Extractors, Routers, and
      how to connect JSON serialization and deserialization. If time permits, we
      will also create a web socket connection for our clients.
  - heading: Tower and Middlewares
    text: >
      We will expand our application by creating middleware layers that handle
      crucial aspects such as sessions, authentication, timeouts, and
      compression. We will not only apply built-in middlewares but also create
      our own by implementing Tower's Service trait and learning more about
      futures and async.
  - heading: Tracing, Logging, and Testing
    text: >
      In the final part, we will examine how to gain insights into our
      application's behavior and perform performance and correctness tests.
      Ultimately, we will be able to publish our application on AWS, Shuttle,
      and other services.
leads:
  - name: Stefan Baumgartner
    title: Architect and Independent Trainer
    handle: ddprrt
    image: /assets/images/authors/ddprrt.jpg
    bio: >
      Stefan Baumgartner is an architect and developer based in Austria who
      specializes in serverless technologies. He has authored two books on
      TypeScript and is also the organizer of the Rust Linz meetup.
---

<!--break-->

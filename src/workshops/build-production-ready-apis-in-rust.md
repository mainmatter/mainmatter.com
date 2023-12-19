---
title: "A crash-course to build production-ready APIs in Rust"
format: "Workshop: 3 days, on-site or remote"
description: <p>Rust is an excellent programming language for developing APIs.
  You can build services that are fast, reliable, and cost-effective. In fact,
  using Rust to write services can tremendously reduce your operating costs.
  However, the main challenge is knowing where to start. This workshop guides
  you through the process. At the end of the journey, you'll know enough to set
  up a production-ready API using the Axum framework.</p></br>

  <p>This workshop is designed for developers who know the basics of Rust and
  want to learn more about API development using Rust. Having written Rust in a
  production environment is not a requirement.</p>
hero:
  image: "/assets/images/workshops/web-based-services-in-rust/header-background.jpg"
  imageAlt: "Several cogs and mechanical elements in purple."
og:
  image: /assets/images/workshops/web-based-services-in-rust/og-image.jpg
topics:
  - heading: Hello Axum!
    text: >
      Axum is the web framework we will be using throughout the workshop.  
      We'll go over its architecture and where it fits in the broader Rust ecosystem.
  - heading: Your first endpoint
    text: >
      We'll learn enough about Axum to write an API with a single endpoint that
      returns a static "Hello World" response.  
      It'll be an opportunity to learn about the key components of an Axum
      application (the HTTP server, the router, the handler) and how to  connect
      them together.  
      We'll also wire up our first integration test. No matter how simple the
      endpoint, we want to make sure it works!
  - heading: Extracting data from the request
    text: >
      We'll expand our API with new endpoints that leverage route parameters,
      query parameters and JSON bodies.  
      It'll be your introduction to the `FromRequest` trait and how to use it to
      write extractors, the key mechanism to inject data from the  incoming request
      into your handlers.
  - heading: Telemetry
    text: >
      At this point, the API is starting to get complex and you're likely to run
      into issues: how do you debug them? We'll learn how to use the `tracing`
      and the `tower-http` crates  to instrument our code and capture structured
      logs. It'll be the first middleware you'll mount in your application.
  - heading: Shared application state
    text: >
      Some data outlives the lifetime of a single request—e.g. a database
      connection pool, or a cache client.  
      We'll learn how to model this data as the state of our application and how
      to access it from our handlers.
  - heading: Hierarchical configuration
    text: >
      As soon as you start doing something non-trivial, you'll need to  configure
      your application with parameters that are specific to the environment it's
      running in.  
      We'll learn how to use the `config` crate to load configuration from
      environment variables and configuration files, using a  layered approach.
  - heading: External state, working with databases
    text: >
      We'll learn how to use the `sqlx` crate to connect to a PostgreSQL
      database and execute queries.  
      We'll cover connection pooling and transactions, as well as how to test
      endpoints that interact with the database.
  - heading: External state, working with third-party APIs
    text: >
      We'll learn how to use the `reqwest` crate to call third-party
      APIs.  
      We'll cover connection management, retries and timeouts, as well as how to
      test endpoints that interact with third-party services via `wiremock`.
  - heading: Sharing logic between endpoints via middlewares
    text: >
      When you have multiple endpoints, you'll often find yourself repeating the
      same logic in each of them. We'll learn how to extract this logic into
      middlewares and mount them in our application.
  - heading: Preparing to deploy
    text: >
      Most platforms require you to package your application as a Docker image
      for deployment. We'll cover how to write a Dockerfile to package our API,
      with a focus on effective caching (via `cargo-chef`) and techniques to  minimise
      the size of the final image.
leads:
  - name: Luca Palmieri
    title: Principal Engineering Consultant
    handle: algo_luca
    image: /assets/images/authors/algo_luca.jpg
    bio: >
      Luca Palmieri builds technology products for a living. His current focus
      is on backend development, software architecture and the Rust programming
      language. He is the author of "Zero to Production in Rust".
---

<!--break-->

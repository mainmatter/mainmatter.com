---
title: "You can't fix what you can't see: telemetry for Rust APIs"
format: 1 day on-site or remote
description:
  <p>Your Rust application has finally been deployed to production! Nice! But is
  it working? This workshop will introduce you to a comprehensive toolkit to
  detect, troubleshoot and resolve issues in your Rust APIs.</p><p>This workshop
  is designed for developers who are operating Rust services in production-like
  environments, or are preparing to do so.</p>
hero:
  image: "/assets/images/workshops/introduction-to-rust-for-web-developers/header-background.jpg"
  imageAlt: "The Rust logo in white on top of a photo of a rusty metal surface"
og:
  image: /assets/images/workshops/introduction-to-rust-for-web-developers/og-image.jpg
topics:
  - heading: Structured logging (tracing)
    text: >
      An introduction to the <code>tracing</code> instrumentation library,
      covering both how to instrument your code (capturing fields, log levels,
      macros) and how to process the resulting telemetry data in your
      application (subscriber configuration, logging levels, log filtering).
  - heading: Error handling
    text: >
      We will cover Rust’s <code>Error</code> trait, with a focus on the
      information that can be retrieved and recorded in your logs; we will also
      spend some time on logging patterns (e.g. when should an error be logged?)
      and relevant libraries for error handling (anyhow/thiserror).
  - heading: Panic handling
    text: >
      You should always manage to capture details about what went wrong, even if
      it’s due to an uncaught panic rather than an error. We will review panic
      hooks and integrate them in our <code>tracing</code> setup.
  - heading: Metrics, both for application and runtime (tokio-metrics)
    text: >
      Structured logs are important, but they don’t tell the full story. We will
      look at how to capture metric data using the <code>metrics</code> library,
      as a tool for designing alarms as well troubleshooting faulty behaviour.
      We will spend some time on <code>tokio-metrics</code> and how to interpret
      the data it shows with respect to your <code>tokio</code> runtime usage.
leads:
  - name: Luca Palmieri
    title: Principal Engineering Consultant
    handle: algo_luca
    image: /assets/images/authors/algo_luca.jpg
    bio: >
      Luca Palmieri builds technology products for a living, and has been doing
      so for a while. His current focus is on backend development, software
      architecture and the Rust programming language.
---

<!--break-->

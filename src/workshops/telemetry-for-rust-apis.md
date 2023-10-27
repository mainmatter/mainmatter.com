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
  image: "/assets/images/workshops/telemetry-for-rust-apis/header-background.jpg"
  imageAlt:
    "2 people in front of a notebook with 3 charts on the screen, only their
    arms visible, one points at the screen"
og:
  image: /assets/images/workshops/telemetry-for-rust-apis/og-image.jpg
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
      spend some time on logging patterns (e.g. when should an error be logged?).
  - heading: Panic handling
    text: >
      You should always manage to capture details about what went wrong, even if
      it’s due to an uncaught panic rather than an error. We will review panic
      hooks and integrate them in our <code>tracing</code> setup.
  - heading: Metrics
    text: >
      Structured logs are important, but they don’t tell the full story. We will
      look at how to capture metric data using the <code>metrics</code> library,
      as a tool for designing alarms as well troubleshooting faulty behaviour.
leads:
  - name: Luca Palmieri
    title: Principal Engineering Consultant
    handle: algo_luca
    image: /assets/images/authors/algo_luca.jpg
    bio: >
      Luca Palmieri builds technology products for a living.  His current focus
      is on backend development, software architecture and the Rust programming
      language.  
      He is the author of "Zero to Production in Rust".
---

<!--break-->

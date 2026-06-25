---
title: "You can't fix what you can't see: telemetry for Rust APIs"
tags: "rust"
format: "Workshop: 1 day"
subtext: "Bookable for teams – on-site or remote"
description: "This 1-day workshop will introduce you to a comprehensive toolkit to detect, troubleshoot and resolve issues in your Rust APIs. The workshop is designed for developers who are operating Rust services in production-like environments, or are preparing to do so."
introduction: <p>Your Rust application has finally been deployed to production! Nice! But is it working? This workshop will introduce you to a comprehensive toolkit to detect, troubleshoot and resolve issues in your Rust APIs.</p> <p>This workshop is designed for developers who are operating Rust services in production-like environments, or are preparing to do so.</p>
hero:
  color: purple
  image: "/assets/images/workshops/telemetry-for-rust-apis/header-background.jpg"
  imageAlt: "2 people in front of a notebook with 3 charts on the screen, only their arms visible, one points at the screen"
og:
  image: /assets/images/workshops/telemetry-for-rust-apis/og-image.jpg
topics:
  - title: Structured logging (tracing)
    text: >
      An introduction to the <code>tracing</code> instrumentation library, covering both how to instrument your code (capturing fields, log levels, macros) and how to process the resulting telemetry data in your application (subscriber configuration, logging levels, log filtering).


  - title: Error handling
    text: >
      We will cover Rust’s <code>Error</code> trait, with a focus on the information that can be retrieved and recorded in your logs; we will also spend some time on logging patterns (e.g. when should an error be logged?).


  - title: Panic handling
    text: >
      You should always manage to capture details about what went wrong, even if it’s due to an uncaught panic rather than an error. We will review panic hooks and integrate them in our <code>tracing</code> setup.


  - title: Metrics
    text: >
      Structured logs are important, but they don’t tell the full story. We will look at how to capture metric data using the <code>metrics</code> library, as a tool for designing alarms as well troubleshooting faulty behaviour.


leads:
  - handle: algo_luca

quotes:
  - text: "Throughly Enjoyed the excercises format. Looking forward to more workshops for middle to advanced rust developers […]"
    source: Onsite attendee
  - text: "Thank you very much for this informative workshop. The individual exercises build on each other very well. Direct practice makes it easier to understand the topics. […]"
    source: Onsite attendee
---

<!--break-->

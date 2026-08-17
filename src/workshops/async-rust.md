---
title: "Async Rust: concurrency you can reason about"
tags: "rust"
format: "1 day"
subtext: "Bookable for teams – on-site or remote"
description: A 1-day workshop for developers who have written async Rust and want to stop guessing, covering Tokio, cancellation, backpressure, and graceful shutdown.
introduction: >
  <p>You have written async Rust before. You know what <code>async fn</code> and <code>.await</code> do, you have used Tokio, and you have at some point watched a program do something other than what you expected it to. This workshop is about the advanced async topics that come after the syntax: who owns your state, what happens when a future is dropped halfway through, and what your server does when it is asked for more than it can deliver.</p><p>You will turn the example <code>minidb</code>, a small in-memory key-value store, into a networked service. By the end of the workshop you will have added support for a line protocol over TCP, and built an architecture where one task owns the data and everything else asks it for what it needs. With that setup, a slow client cannot starve a fast one, an overloaded server says so instead of falling over, and a restart picks up where the last one left off.</p><p>The workshop is designed for developers who have written async Rust before. If you are new to Rust altogether, start with our <a href="/training/learn-rust-starting-from-scratch/">"Learn Rust, starting from scratch"</a> workshop for an introduction to the language.</p>


hero:
  color: purple
  image: "/assets/images/workshops/rust-python-interoperability/header-background.jpg"
  imageAlt: "Close-up photo of 3 snake bodies (or 3 parts of the same snake body) stacked on top of each other."
og:
  image: /assets/images/workshops/rust-python-interoperability/og-image.webp
topics:
  - title: The Tokio runtime
    text: >
      We will cover what Tokio adds on top of the language, why a future does nothing until something polls it, and why <code>.await</code> is a suspension point rather than a call. This section also covers fundamentals like <code>Future</code>, <code>poll</code>, and <code>Pin</code>.


  - title: Tasks
    text: >
      <code>tokio::spawn</code> turns a future into a task, which is not a thread and does not behave like one. We will cover the <code>Send + 'static</code> requirement, running work concurrently with <code>join!</code> and <code>JoinSet</code>, and moving work that cannot yield onto <code>spawn_blocking</code> so that it does not occupy the runtime's worker threads.


  - title: Building the server
    text: >
      You will turn <code>minidb</code> into a TCP server that speaks a line protocol, covering the accept loop, framing with <code>BufReader</code> and <code>lines()</code>, and one task per connection. We will also cover which errors should end a single connection and which should not reach the accept loop.


  - title: Who owns the state
    text: >
      Every connection is a task, and each of them needs access to the same store. You will build both answers, <code>Arc&lt;Mutex&lt;Store&gt;&gt;</code> and an actor task that owns the data outright, and we will cover which mutex to use and where its guard may not be held. The section ends with a criterion benchmark comparing the two approaches under contention.


  - title: Cancellation
    text: >
      In async Rust, cancelling work means dropping a future, which can happen at any suspension point. We will cover <code>timeout</code>, <code>select!</code>, and <code>CancellationToken</code>, the state a dropped future leaves behind, and cancel safety: why <code>next_line</code> can be dropped safely and a hand-written read loop cannot.


  - title: Backpressure
    text: >
      An unbounded queue grows until the process runs out of memory. We will cover bounded <code>mpsc</code> channels, the difference between waiting, refusing, and dropping work when a queue is full, and limiting concurrent connections with a <code>Semaphore</code>, where the point at which the permit is acquired determines what the limit protects.


  - title: Shutdown and supervision
    text: >
      Without a shutdown path, a deploy terminates requests that are still in flight. We will cover graceful shutdown with <code>CancellationToken</code> and <code>TaskTracker</code>, the ordering that drains connections before the store task, and how to decide what should happen when a task fails without being asked to stop.


  - title: Testing async code
    text: >
      We will cover Tokio's paused clock, which makes a thirty second timeout testable in microseconds, <code>tokio::io::duplex</code> for exercising a connection handler without opening a socket, and asserting on properties rather than on scheduling order. You will also instrument the server with <code>tracing</code> and test the resulting spans as structured data.


  - title: Durability across restarts
    text: >
      You will add a write-ahead log, recording every mutating request before it is applied, batching the syncs into a group commit so that a busy server does not make one trip to the disk per request, and replaying the log on startup so that a restart preserves the data.


leads:
  - handle: algo_luca
---

<!--break-->

---
layout: workshop
title: Node.js Fundamentals
weight: 3
permalink: "/services/training/2017-12-04-node-js-fundamentals"
redirect_from: "/training/2017-12-04-node-js-fundamentals"
category: Back End & Full Stack
description: As a non-blocking programming language with amazing concurrency capabilities,
  it is no surprise that JavaScript shines just as brightly on the server side as
  it does in a browser. Whether you are making a build tool, web application or API,
  the rich JavaScript ecosystem and Node core libraries are by your side.
image: "/images/training/2017-12-04-node-js-fundamentals.png"
stages:
- title: Not a browser
  description: 'You already know how to use JavaScript in the browser, so we will
    first focus on getting you acclimated to this different environment. When we are
    done, you will have a much better sense of how to separate the JS programming
    language from browser-specific and Node-specific features.

'
  duration: 240
  agenda_items:
  - title: Welcome and Tech Check
    description: We'll get set up and ensure everyone has the required software installed.
    item_type: lecture
    start_time: '9:00'
    duration: 15
  - title: Process, Arguments, Input and Output
    description: "In Node.js, process is a global that provides information about
      your running Node program. Think of it as the server-side equivalent to a web
      browser’s `window` global.\n\nMany programming languages have a single “entry”
      point function (often called `main`). JavaScript is a little different, in that
      a module’s code is executed as soon as it is imported for the first time from
      somewhere else. As a result, the arguments passed to the program, the ability
      to print to the console and the ability to receive keyboard input are available
      throughout your node app. "
    item_type: lecture
    start_time: '9:15'
    duration: 30
  - title: 'EXERCISE: Magic 8 Ball'
    description: Write a Node.js program that prompts the user for a question, and
      responds with a random answer. If the user provides something that doesn’t seem
      like a question, your program should use `process.stderr` to tell the user their
      input is invalid, and allow them to try again.
    item_type: exercise
    start_time: '9:45'
    duration: 30
  - title: Async Control Flow
    description: While promises and `async/await` have become the preferred way to
      manage asynchronous jobs, nearly all of the asynchronous functions in Node.js
      core libraries require a callback to be passed as an argument. We’ll compare
      different ways of managing concurrency, and hone in on today’s best practices.
    item_type: lecture
    start_time: '10:15'
    duration: 30
  - title: 'EXERCISE: Promisify'
    description: Modern versions of Node.js include a `promisify` utility function,
      which converts a node-callback-style function into a promise-emitting function.
      However, as a workshop instructor, I need to be able to support Node versions
      that don’t come with this! Write me a `promisify`, and make sure that errors
      are handled properly.
    item_type: exercise
    start_time: '10:45'
    duration: 25
  - title: The REPL and Debugging
    description: |-
      The Node Read-Eval-Print-Loop (REPL) allows developers to execute statements in an interactive environment. We’ll learn how to make the REPL work for you, and a popular workflow involving prototyping code in isolation before bringing it into your program.

      One of the major differences in how JavaScript is developed for Node and the browser is the debugging process. We’ll learn how to use [Visual Studio Code](https://code.visualstudio.com/) and launch configurations to turn this amazing code editor into a lightweight IDE!
    item_type: lecture
    start_time: '11:10'
    duration: 30
  - title: 'EXERCISE: Bug Hunt'
    description: You’ll be given a program with a bug that slipped by all of our static
      code analysis. Set up a [Visual Studio Code](https://code.visualstudio.com/)
      debugging configuration so that you can “launch” the program from within the
      editor. Use your knowledge of conditional breakpoints and restarting stack frames
      to track down the malfunction.
    item_type: exercise
    start_time: '11:40'
    duration: 20
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:00'
    duration: 60
- title: Standard Library
  description: Node is not just a server-side JavaScript runtime, it also includes
    a robust collection of libraries or “core modules” for managing the filesystem,
    streaming data, events and more! We will get some hands-on experience with a broad
    array of commonly-used libraries, so you know what is available and when to reach
    for it.
  duration: 190
  agenda_items:
  - title: Buffers, Files and Paths
    description: Two of the most widely-used Node.js APIs are `fs`, used to interact
      with the filesystem, and `path`, used to construct proper resource paths that
      work on all operating systems. We’ll look at basic tasks like reading and managing
      files; how the “current directory” is affected by the location of our source
      code; and `fs-extra`, a popular open source library that provides a range of
      commonly-needed filesystem tools beyond those that ship with Node.
    item_type: lecture
    start_time: '13:00'
    duration: 30
  - title: 'EXERCISE: Directory-to-JSON and back again'
    description: You have been presented with a hierarchy of text files and folders.
      Build a `filesToJson`function that, given the path to a folder, generates a
      single JSON object representing the contents (and placement) of the files therein.
      Then, build a `jsonToFiles` function that takes your JSON object along with
      a folder path, and write the contents to disk as the appropriate hierarchy.
    item_type: exercise
    start_time: '13:30'
    duration: 30
  - title: Events
    description: A large portion of the Node api is built around the idea of “event
      emitters” to allow the registration of “listeners” (functions), which are invoked
      whenever an event is fired. We’ll learn about creating and consuming our own
      `EventEmitter`, and learn when it is appropriate to respond to events synchronously
      or asynchronously.
    item_type: lecture
    start_time: '14:00'
    duration: 20
  - title: 'EXERCISE: Operating an Oven'
    description: We’ll write some code to control an oven so that we can bake some
      Node-powered cookies! Your job is to build an `EventEmitter` that allows the
      operator of the oven to do their job in response to the `powerOn`, `powerOff`,
      `doorOpen`, `doorClose`, and `temperatureReached` events.
    item_type: exercise
    start_time: '14:20'
    duration: 30
  - title: Streams
    description: Streams are a particular type of collection, where data may not be
      available all at once. When working with a stream of data, we can start immediately
      processing whatever we have so far, without requiring that “everything” is placed
      in memory. While it is somewhat uncommon for developers to create new types
      of streams, you’ll end up working with them extensively as we get deeper into
      Node.
    item_type: lecture
    start_time: '14:50'
    duration: 30
  - title: 'EXERCISE: Oven Thermocouple'
    description: |-
      You’ll be provided with some code that represents a kitchen oven. It is set to a “desired temperature”, the heater turns on, and a temperature sensor lets us know when the oven is ready. However, we have a problem... the temperature sensor is cheap and produces a garbage reading sometimes.

      Write a program to consume the raw data stream from an oven’s temperature sensor to control the heating system, in order to keep the oven temperature pretty close to what the user set it at. You’ll need to use a `Transform` stream, and expose a stream for the oven’s heater to “listen” to.
    item_type: exercise
    start_time: '15:20'
    duration: 40
  - title: Wrap Up
    description: We'll recap what we have learned so far, and outline the topics to
      be covered tomorrow. Homework may be assigned.
    item_type: lecture
    start_time: '16:00'
    duration: 10
- title: Networking
  description: Node comes with some great foundational support for both low and high-level
    networking. We will begin with writing a program that manages a TCP socket directly,
    then upgrade it to a turnkey HTTP server to build a simple web application.
  duration: 120
  agenda_items:
  - title: Hello Network
    description: TCP/IP is at the core of how the internet works (After all, the “IP”
      stands for “internet protocol”).  The TCP (Transmission Control Protocol) ensures
      that when devices receive data, they are in the correct order and not missing
      any data. We’ll learn about how to open a port and communicate over it using
      Node’s `net` module.
    item_type: lecture
    start_time: '9:00'
    duration: 30
  - title: 'EXERCISE: Guess my Number'
    description: |-
      Build a small Node program that opens up a port on localhost, generates a random number between 0 and 100, and then asks the user to guess it. The user should receive some feedback on their guess (too high, too low), and once they find the correct number, the socket should be closed.
      ```
      Please guess my number. It is between 0 and 100
      10
      Too Low! Try again
      50
      Too High! Try again
      30
      Too High! Try again
      20
      GOT IT! The number was 20 and you guessed in 4 tries
      ```
    item_type: exercise
    start_time: '9:30'
    duration: 30
  - title: HTTP
    description: HTTP (Hypertext Transfer Protocol) is an application networking protocol
      that describes concepts like URLs, request methods (GET, POST, PUT, etc…) and
      more! We’ll learn about Node’s fantastic support for HTTP servers and clients,
      and walk through typical usage patterns.
    item_type: lecture
    start_time: '10:00'
    duration: 20
  - title: 'EXERCISE: Hello, Web!'
    description: We’ll build an HTTP-based version of our number guessing game from
      the previous exercise. After our work is done, players will be able to play
      the game using a web browser instead of their terminal.
    item_type: exercise
    start_time: '10:20'
    duration: 30
  - title: Coffee Break
    description: Short break
    item_type: break
    start_time: '10:50'
    duration: 10
- title: Processes and Clustering
  description: Node applications run on a single thread, but they can start new processes
    and communicate with them to form a distributed system. We will look at several
    use cases for doing something like this, and study how the Actor Concurrency Model
    helps keep inter-process communication simple and cheap.
  duration: 150
  agenda_items:
  - title: Child Process
    description: |-
      Sometimes we need to run a shell command and observe its output. We’ll study the various functions available in the `child_process` Node module in detail, focusing on things like:

      * Passing arguments
      * Monitoring output
      * Detecting successful execution
    item_type: lecture
    start_time: '11:00'
    duration: 20
  - title: 'EXERCISE: Running shell commands'
    description: Build a class that can retrieve information about the hardware your
      program is running on. These are typically not available to a Node application
      and involve running OS-specific shell commands.
    item_type: exercise
    start_time: '11:30'
    duration: 20
  - title: App as a Cluster
    description: In a production environment, running an app on a single threads is
      dangerous! All it takes is one rogue function to leak, and you have put everything
      you program can do in jeopardy. We’ll look at how a single script can be “forked”
      onto multiple processes to form a cluster, leaving the master process available
      to take on the next task.
    item_type: lecture
    start_time: '11:50'
    duration: 30
  - title: 'EXERCISE: Clustered HTTP server'
    description: Upgrade our HTTP server exercise to be run on a pool of worker processes
      (one per CPU core on your machine), to increase the maximum amount of traffic
      your program can potentially handle.
    item_type: exercise
    start_time: '12:20'
    duration: 20
  - title: Lunch
    description: Break for lunch
    item_type: break
    start_time: '12:40'
    duration: 60
- title: Express
  description: 'Express is, by a fairly large margin, the most popular web application
    framework for Node.js. It can be used to respond to HTTP requests with JSON, HTML,
    or pretty much anything else.  '
  duration: 190
  agenda_items:
  - title: Request, Response
    description: Express is built on top of Node’s networking concepts, leveraging
      the power of the `HTTP` server we have been using, and the existing `Request`
      and `Response` types. We’ll take some time to learn more about how `Request`
      and `Response` work.
    item_type: lecture
    start_time: '13:40'
    duration: 20
  - title: 'EXERCISE: A JSON API resource'
    description: "Build a set of Express request handlers for creating, listing, updating
      and destroying a “course” resource. \n"
    item_type: exercise
    start_time: '14:00'
    duration: 30
  - title: Views
    description: Modern versions of Express leave the job of “views” — HTML generation
      from declarative templates — up to other libraries. We’ll look at one of the
      most common view libraries, which allows us to express HTML using [Handlebars.js](http://handlebarsjs.com/).
      We’ll be sure to cover topics like layouts, handlebars helper functions, and
      passing data from our javascript into a template.
    item_type: lecture
    start_time: '14:30'
    duration: 20
  - title: 'EXERCISE: Course as HTML'
    description: 'Build a set of new routes for CRUD (Create, Read, Update, Delete)
      operations on the same course object we modeled in the last exercise — but render
      responses as HTML instead of JSON. '
    item_type: exercise
    start_time: '14:50'
    duration: 30
  - title: Routing
    description: Once we start responding to a variety of URLs, we’ll want to start
      breaking our code up into independent modules. Each module should follow SRP
      (Single Responsibility Principle) for handling a specific concern, or set of
      closely-related concerns.
    item_type: lecture
    start_time: '15:20'
    duration: 20
  - title: 'EXERCISE: JSON + HTML'
    description: "Time for us to combine HTML and JSON. Use hierarchical routing to
      expose both of the last two exercises, such that:\n`http://localhost:3000/courses`
      provides an HTML response, and\n`http://localhost:3000/api/courses` provides
      a JSON response. "
    item_type: exercise
    start_time: '15:40'
    duration: 20
  - title: Middlewares
    description: Middlewares are modular request/response handling units that can
      be composed together in a server. You could have one middleware that ensures
      requests are coming from only a specified origin; one that parses the body (text)
      into JSON for later use; one that logs the amount of time it took to generate
      a response; and more! We’ll build a few middlewares together, and try applying
      them broadly across our whole app, as well as specifically to a family of routes
      (or a single route).
    item_type: lecture
    start_time: '16:00'
    duration: 20
  - title: 'EXERCISE: CORS headers'
    description: Build an Express middleware for CORS (Cross-Origin Resource Sharing)
      validation. When an incoming `request` is received, the `Origin` header should
      be validated against the `allowedOrigins` list, and if everything checks out
      the appropriate CORS response headers should be set on the `response` object.
    item_type: exercise
    start_time: '16:20'
    duration: 30
- title: Testing
  description: You may already be using some Node-friendly testing tools and assertion
    libraries. We will focus mostly on [Mocha](https://mochajs.org/), a flexible and
    straightforward testing framework that works equally well for server and client-side
    code.
  duration: 150
  agenda_items:
  - title: Unit Tests
    description: Unit tests are fast, lightweight, and designed to validate algorithmic
      complexity in isolation. We’ll learn how to write our code in such a way that
      the trickiest parts are easily unit testable without having to build large numbers
      of “stubs”.
    item_type: lecture
    start_time: '16:50'
    duration: 20
  - title: 'EXERCISE: Unit testing with Mocha'
    description: |-
      Build a handlebars helper function that formats a number nicely for analytics dashboards. You must write your unit tests to fulfill these requirements:
      * 23004 should be represented as `23.0K`
      * -914 should be represented as `-914`
      * 1060241 should be represented as `1.1M`
    item_type: exercise
    start_time: '17:10'
    duration: 20
  - title: Integration Tests
    description: |
      Integration tests are designed to ensure interfaces or connections between components of your application work properly. We’ll learn how to write tests for two important “interfaces” to any Express app:
      * Ensuring that URLs are handled by the appropriate route,
      * Ensuring that routes pass the expected data to views.
    item_type: lecture
    start_time: '17:30'
    duration: 20
  - title: 'EXERCISE: Integration testing with Mocha'
    description: 'Write an integration tests suite to ensure that the `GET /course`
      view is passed the correct data to render its template. '
    item_type: exercise
    start_time: '17:50'
    duration: 20
  - title: Acceptance Tests
    description: 'Acceptance tests, sometimes called functional tests, are designed
      to ensure that critical user workflows work correctly and protect them from
      regression. Acceptance tests are the closest thing we have to simulating user
      behavior. They should be designed in such a way that they mimic what users may
      do. Acceptance tests usually involve starting up the entire app and are considerably
      slower than unit or acceptance tests. You should have a few of these, but the
      more you have, the slower your test suite will be.

'
    item_type: lecture
    start_time: '18:10'
    duration: 20
  - title: 'EXERCISE: API acceptance testing with Mocha'
    description: Build acceptance tests for the `/api/course` JSON Create, Read, Update
      and Destroy endpoints.
    item_type: exercise
    start_time: '18:30'
    duration: 20
  - title: 'EXERCISE: HTML acceptance testing with Mocha'
    description: Build acceptance tests for the `/course` HTML Create, Read, Update
      and Destroy endpoints.
    item_type: exercise
    start_time: '18:50'
    duration: 20
  - title: Wrap Up and Recap
    description: We'll recap everything we have learned throughout the course, and
      discuss resources for future learning.
    item_type: lecture
    start_time: '19:10'
    duration: 10
---
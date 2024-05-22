---
title: "Embroider Initiative: Progress Update"
authorHandle: academierenards
tags: [ember, embroider]
bio: "Marine Dunstetter, Senior Software Engineer"
description:
  "A summary of the progress over the last six months on the Embroider project
  that has been made through Mainmatter's Embroider Initiative."
og:
  image: ""
tagline: |
  <p>
    This post covers the progress over the last six months on [the Embroider project](https://github.com/embroider-build/embroider) that has been made through Mainmatter's [Embroider Initiative](https://mainmatter.com/embroider-initiative/).
  </p>

image: ""
imageAlt: ""
---

In the
[November 2023 blog post](https://mainmatter.com/blog/2023/11/16/embroider-initiative-progress-update/),
[Chris Manson](https://github.com/mansona) introduced to you Embroider, the new
build pipeline that compiles Ember apps into spec-compliant, modern JavaScript.
If this is the first time you have heard about Embroider, we encourage you to
read the introduction of the November blog post, which explains what Embroider
is in more detail and presents the Embroider Initiative.

Regarding the progress update itself, the first section of the November blog
post was “Getting Ember to work with Vite”. We concluded by expressing the
team’s optimism in reaching the point where it's possible to build the first
real-world Ember applications with Vite until the end of the year.

About six months later, we are glad to name the main section of this article…

## Improving how Ember works with Vite

Currently, our challenge is no longer to get Ember working with Vite, but to
optimize the Vite build and maintain the compatibility of all classic features.

### How we make it work: the rewritten app

By default, an Ember application cannot be built with Vite. Indeed, Ember
performs some “magic” around resolving imports, relying on
[AMD modules](https://github.com/emberjs/rfcs/pull/938) and other specific build
actions, which are incompatible with Vite resolver. Let’s take an example: you
generated an Ember app using the default blueprint, and you got a file
`app/index.html` which contains a reference to the CSS stylesheet
`“assets/vendor.css”`. This file is supposed to contain the styles provided by
the libraries you use, but… it doesn’t exist. Your `app/index.html` points to a
file that is literally nowhere in your app files. Ember expects this: at build
time, it will go through all the active Ember addons used in your app and will
emit the `assets/vendor.css` file in the build output. But this is an
Ember-specific behavior that Vite cannot deal with. Vite expects the referenced
file to exist, it cannot guess how to find it or write it.

To solve this issue, when the build starts, Embroider first produces an
intermediate Ember application that we call the “rewritten app”. The rewritten
app is slightly different from the initial Ember app, in a way it can be
consumed by Vite. For instance, it has an `index.html` at the root and it does
contain the `assets/vendor.css`. This approach allows us to build real-world
applications with Vite, but it has performance downsides: Vite prebuilds the app
dependencies for optimization purposes, but the rewritten app _is_ considered a
dependency. Therefore, changes in the Ember app that need to be reflected in the
rewritten app imply changes in a dependency, so Vite has to go through bundling
dependencies again and we lose the advantage of the prebuild.

### How we want to make it work: “inversion of control”

To improve this situation and get all the benefits of using Vite, we have
started a wide technical topic called “inversion of control”. The idea is the
following: instead of having Embroider produce a rewritten app, and then passing
over to Vite once the rewritten app is ready, Vite takes the lead, and when it’s
unable to resolve Ember-specific things, it asks Embroider to return the
information without the need of a rewritten app.

A good example to illustrate this idea is file virtualization. Let’s go back to
our `vendor.css` case. Before inversion of control, Embroider produces a
rewritten app that concats all the styles provided by the classic addons into a
file `assets/vendor.css`, and this file is referenced in the `index.html`. Vite
has no trouble consuming that. But now, we want to get rid of the rewritten app
step. To inverse the control, we use a special identifier in the `index.html`
that starts with `@embroider`. For instance: `@embroider/core/vendor.css`. Then
we implement our own Vite resolver plugin that is able to recognize this
identifier and ask Embroider to return the content for this file. Embroider
executes a code that is very similar to the code that was initially used to
create the `assets/vendor.css` in the rewritten app, but this time, it doesn’t
write any file: it just returns the content to Vite as “virtual” content.

### Progress and next steps

The “inversion of control” topic includes every task that is necessary to remove
the rewritten app. Among these tasks, we have the virtualization of several
files, handling the public assets provided by the app and addons, and also
maintaining the compatibility of classic addons with Embroider by getting
functionalities like content-for to work with Vite, etc… A wide part of this
work is done already: all the app entrypoints are virtualized, the new authoring
format for the `index.html` is ready, and we have identified the few pieces we
still miss to maintain entirely the compatibility with the classic world.

The task that will close the “inversion of control” topic will be the one that
actually turns off the writing of the rewritten app. From this moment, the
initial Ember app will have to contain everything Vite needs to communicate with
Embroider. That’s why another important step comes along with this one: updating
the application blueprint so newly generated Ember apps have everything in place
to build with Vite.

There is another side field we haven’t mentioned so far but is crucial: as we
progressively improve how Ember works with Vite, we need to test the new way our
functionalities work. Huge progress has been made already on this part as well.

### The test suite uses Vite

Embroider’s test suite relies on minimalist Ember app and addon templates that
can be overridden and output according to the needs of each test scenario. Some
of the new functionalities mentioned above required the test suite to build
these output apps with Vite. It has been a long road, but we are finally there:
most of Embroider's test suite uses Vite commands to get the app built.

For the new tests, we started to reorganize things in a way that allows us to
assert each functionality behaves as expected in build mode and dev mode: the
approach that was previously used to start the Ember dev server in one specific
test file has been refactored to a `CommandWatcher` helper that can be imported
in tests to easily start Vite or Ember server depending on arguments.

Also, we added an audit system that fits Vite: Some tests require asserting the
content of the build output in a way that cannot be anticipated. For instance,
let’s suppose you want to check a specific piece of code is present in the
production build. You don’t know how Rollup is going to organize the files, so
you don’t know where to look. One purpose of the audit is to serve the build
output at an http location, so your test can ask for fetching the URL that is
supposed to respond with the piece of code you are looking for.

## A word about reducing the bus factor

In the section “Improving the bus factor” of the November blog post, we
explained how challenging it is to contribute to the core of Embroider and we
introduced the apprenticeship model we adopted to address the
[bus factor](https://en.wikipedia.org/wiki/Bus_factor) issue. This model still
stands today: Chris pairs with [Ed Faulkner](https://github.com/ef4/) every week
and acquired a solid knowledge of the heart of the Embroider codebase.

Following Andrey Mikhaylov’s departure in March,
[Marine Dunstetter](https://github.com/BlueCutOfficial) joined the Embroider
Initiative as a full-time engineer. We have extended the apprenticeship model by
having Chris and Marine meet and pair half a day each week. Marine’s ramp-up was
successful and she made impactful contributions to the project over the past
three months.

## Last words

We are now at the point of wrapping up the technical challenges. We should soon
have a Vite demo that is a good approximation of the new way to write Ember apps
and matches the future blueprint. The next phase will be all about communication
and community work: we want this new fast Embroider + Vite experience to be the
default experience for all Ember users.

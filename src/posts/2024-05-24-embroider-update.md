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

The main goal that we laid out in the last blog was to get our Ember apps
building with Vite, not only have we achieved that landmark we have moved onto
the next phase which all about brining the wonderful DX improvments that Vite
can promise to all Ember apps.

## Improving how Ember works with Vite

Now that our challenge is no longer to get Ember working with Vite we need to
figure out how to optimize the Vite build and maintain the compatibility of all
classic features. To understand how to optimize, we need to dive into the
challenge that an Ember build presents to us

### How we make it work: the rewritten app

By default, an Ember application cannot be built with Vite. The reason for this
is because Ember performs some “magic” around resolving imports, relying on
[AMD modules](https://github.com/emberjs/rfcs/pull/938) and other specific build
actions, which are incompatible with the Vite resolver. Let’s take an example:
if you generated an Ember app using the default blueprint, and you will get a
file `app/index.html` which contains a reference to the CSS stylesheet
`“assets/vendor.css”`. This file is supposed to contain the vendor styles that
are automatically provided by the Ember addons you use, but that files doesn’t
exist in your repo. Your `app/index.html` points to a file that is literally
nowhere in your app files. At build time Ember will go through all the active
Ember addons used in your app and will emit the `assets/vendor.css` file at some
point in the build pipeline. But this is an Ember-specific behavior that Vite
cannot deal with. Vite expects the referenced file to exist, it cannot guess how
to find it or write it.

To solve this issue, when the build starts, Embroider first produces an
intermediate Ember application that we call the “rewritten app” and outputs it
to `node_modules/.embroider/rewritten-app`. The rewritten app is slightly
different from the initial Ember app, in a way it can be consumed by Vite. For
instance, it has an `index.html` at the root and it does contain the
`assets/vendor.css`. This approach allows us to build real-world applications
with Vite, but it has performance (and other) downsides: Vite prebuilds the app
dependencies for optimization purposes, but the rewritten app _is_ considered a
dependency because it lives in a folder in node_modules. Therefore, changes in
the Ember app that need to be reflected in the rewritten app imply changes in a
dependency, so Vite has to go through bundling dependencies again and we lose
the advantage of the prebuild.

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
step. To invert the control, we use a special identifier in the `index.html`
that starts with `@embroider`. For instance: `@embroider/core/vendor.css`. Then
we implement our own Vite resolver plugin that is able to recognize this
identifier and ask Embroider to return the content for this file. Embroider
executes code that is very similar to the code initially used to create the
`assets/vendor.css` in the rewritten app, but this time, it doesn’t write any
file: it just returns the content to Vite as “virtual” content.

### Progress and next steps

The “inversion of control” topic includes every task that is necessary to remove
the rewritten app. Among these tasks, we have the virtualization of several
files, handling the public assets provided by the app and addons, and also
maintaining the compatibility of classic addons with Embroider by getting
functionalities like content-for to work with Vite. A wide part of this work is
done already: all the app entrypoints are virtualized, the new authoring format
for the `index.html` is ready, and we have identified the few pieces we still
have to work on to maintain the compatibility with the classic world (the best
example is FastBoot supports).

The task that will close out the “inversion of control” topic will be the one
that actually turns off the writing of the rewritten app. From this moment, the
initial Ember app will have to contain everything Vite needs to communicate with
Embroider. This will also require us to update the application blueprint so
newly generated Ember apps have everything in place to build with Vite. We're
hoping to have a preview of this new blueprint ready in the next few days for
people to try out.

### The Embroider test suite now uses Vite

Embroider’s test suite relies on minimalist Ember app and addon templates that
can be overridden and output according to the needs of each test scenario. Some
of the new functionalities mentioned above required the test suite to build
these output apps with Vite. It has been a long road, but we are finally there:
all of Embroider's test suite uses Vite to get the app built.

For the new tests, we started to reorganize things in a way that allows us to
assert each functionality behaves as expected in build mode and dev mode: the
approach that was previously used to start the Ember dev server in one specific
test file has been refactored to a `CommandWatcher` helper that can be imported
in tests to easily start Vite and wait for logs that say building is complete
before asserting.

Also, we improved the existing audit system so that it can interface with both
the Vite dev server and the build output. Because Vite behaves differently in
dev mode and build (it essentially just uses Rollup during the build) we need to
verify that some of the virtualisation features we are implementing work both
when Ember developers are developing their app and when they are deploying to
production. Using this new audit system also allows us to more easly investigate
the contents of the build, e.g. you don’t know how Rollup is going to
organize the files, so you don’t know where to look for a specific piece of code
you want to verify made it into the build.

## Reducing the bus factor

In the section “Improving the bus factor” of the November blog post, we
explained how challenging it is to contribute to the core of Embroider and we
introduced the apprenticeship model we adopted to address the
[bus factor](https://en.wikipedia.org/wiki/Bus_factor) issue. This model still
stands today: Chris pairs with [Ed Faulkner](https://github.com/ef4/) every week
and now has a solid knowledge of the heart of the Embroider codebase.

Following Andrey Mikhaylov’s departure in March,
[Marine Dunstetter](https://github.com/BlueCutOfficial) joined the Embroider
Initiative as a full-time engineer. We have extended the apprenticeship model by
having Chris and Marine meet and pair regularly each week. Marine’s ramp-up was
very successful and she has made many impactful contributions to the project
over the past three months and we wouldn't be so close to completing the
inversion of control work at the time of writing without her!

## Last words

We are now at the point of wrapping up the technical challenges. We should soon
have a Vite demo that is a good approximation of the new way to write Ember apps
and matches the future blueprint. The next phase will be all about communication
and community work: we want this new fast Embroider + Vite experience to be the
default experience for all Ember users.

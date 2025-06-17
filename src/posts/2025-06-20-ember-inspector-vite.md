---
title: "The road to Ember Inspector supporting Vite apps"
authorHandle: academierenards
tags: [ember, embroider, vite]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "Introducing challenges and strategy to implement Vite support in ember-inspector"
autoOg: true
tagline: |
  <p>
  The <a href="https://github.com/emberjs/ember-inspector">Ember Inspector</a> is a popular browser extension in the Ember world, which allows Ember developers to inspect from their oldest to their most recent Ember apps... as long as they build with Ember CLI and Broccoli. Ember apps from version 3.28 to the latest can now be built with Vite, but the Ember Inspector doesn't support these modern apps yet. Fixing this is the primary focus of the <a href="/ember-initiative/">Ember Initiative</a> at the moment. This blog post overviews the challenges and the strategy we designed to reach this goal.
  </p>
---

The <a href="https://github.com/emberjs/ember-inspector">Ember Inspector</a> is a browser extension that extends the capacity of regular debuggers for Ember specifically. It allows developers to inspect their Ember apps and view information like the version of Ember and Ember Data running, the components render tree, the data loaded on the page, the state of the different Ember object instances like services, controllers, routes... It's a practical extension widely used in the Ember community. Such a popular tool must be able to inspect modern Ember apps built with Vite. The goal is as easy to state as it is hard to achieve.

The Ember Inspector project is complex enough to require its own micro-roadmap. This is exactly the kind of project that Mainmatter's [Ember Initiative](/ember-initiative/) exists to manage. Implementing Vite support for the Inspector is our team's primary focus at the moment. In this blog post, we will explain the problem, the strategy we designed to implement the support, and where we are so far with the implementation.

## Why it doesn't work

First of all, let's figure out what's wrong. The purpose of the Inspector is to display information about the Ember app running on your page. To do so, it needs to retrieve this information somehow. The architecture involves both the Inspector itself and your Ember app that depends on a version of ember-source:

![A picture of the architecture described in the following paragraph](/assets/images/posts/2025-06-20-ember-inspector-vite/ember-initiative-inspector.png)

The Inspector (on the right) is composed of two main pieces:

- The UI is an Ember app that displays what you see when the inspector runs.
- The folder `ember_debug` is built into a script `ember_debug.js`. The Inspector injects this script into your page to connect to your app.

The incompatibility with Vite apps lies in how `ember_debug.js` (on the left) uses ember-source. For a long time, `ember-cli` expressed all the modules using AMD (Asynchronous Module Definition) and `requirejs` `define()` statements. Addons and applications could rely on AMD loading to use these modules. This is what the Inspector does. When you use `@embroider/vite` to build your Ember app with Vite, ember-source is loaded as ESM (ECMAScript modules), and you essentially have no `requirejs` module support: the Inspector was designed to work with the AMD approach and breaks.

In a nutshell, supporting Vite means fixing the bridge between ember-source and `ember_debug.js`.

## How to fix the bridge

To fix the interaction between [ember-source](https://github.com/emberjs/ember.js) and [ember-inspector](https://github.com/emberjs/ember-inspector), we need to implement changes in both repositories:

- In **ember-inspector**: we need to implement the ability for `ember_debug` to import all modules from Ember as ESM modules. This should be done without breaking the previous AMD implementation because the Inspector should keep its current ability to inspect Classic apps built with Ember CLI and Broccoli.

- In **ember.js**: we need to implement an API to expose all the modules `ember_debug` needs to send relevant information to the Inspector UI.

Our team is relatively free to work on the ember-inspector part because [Chris Manson](https://mainmatter.com/blog/author/real_ate/) belongs to the [Ember Tooling Core Team](https://emberjs.com/teams/) and has permission to merge ready-to-go pull requests.

On the other hand, proposing changes in ember.js requires going through the [RFC process](https://rfcs.emberjs.com/). The RFC should describe the purpose and the accurate design of the new API that will expose the modules. Once written, the community will review and challenge it. Then, when a consensus is reached, the RFC gets the "accepted" state and can be implemented. This is a longer process by design, and we don't have full control over the timeline.

## Start with a proof of concept

To approach this work and draw the next steps, we started by implementing a proof of concept: We forked ember.js and ember-inspector and created testing branches that are not intended to be merged to design the new interaction system. Our approach relies on a global loading function exposed by ember-source and top-level `await` on the Inspector side to wait for the modules to be loaded.

Out of our functional but rough proof of concept, we started to dig deeper into the Inspector side to refine the implementation and figure out all the pieces. By doing this first, we will kill two birds with one stone: we will prepare the ground for Vite support by managing any refactoring that turns out to be necessary, and we will find out the exact list of modules the ember-inspector relies on to reuse it in the future RFC.

## The ember-inspector side

Digging into the ember-inspector revealed three main pieces to handle: re-establish trust in tests, build `ember_debug` with Rollup, and centralize interactions with ember-source. In the following sections, let's go through each of them.

### Re-establish trust in tests

This one was quite a bad surprise that imposed its presence on our plan. When we started to work on the ember-inspector repository, we noticed the CI was red. Two groups of [ember-try](https://github.com/ember-cli/ember-try) scenarios were failing: the oldest versions scenarios (which assert the compatibility with 3.16 to 3.24 apps), and the most recent versions scenarios (which assert the compatibility with the 6.x series). This was a problem we couldn't ignore: Vite support implies that we do substantial changes in the Inspector code, and the only way to reach a decent level of confidence with our changes is to trust the test results. If tests are already red before changing a thing, we can't even start.

The CI is now green again:

- `3.16~3.24` scenarios were failing because of the structure of the tests in the repository. As you learned earlier in this blog post, the Inspector comprises a UI app and `ember_debug`. The piece we want to test against the ember-try scenarios is `ember_debug`: it's the piece that directly interacts with the inspected app, which can use any version of ember-source. The Inspector UI is just what it is, an Ember app using its own version of ember-source. The problem is that tests build the UI and `ember_debug` together, and when the scenarios run, modern syntax used on the UI side can trigger failure in the oldest versions, even though they are perfectly functional. This behavior has been patched by overriding the UI app in tests, but the tests' structure in the Inspector deserves to be rethought.

- `release`, `beta`, and `canary` (6.x) scenarios were failing essentially because the way ember-source exposes the modules changed. These versions introduce an `ember/barrel` module that the Inspector didn't know about. Additionally, non-colocated components are no longer allowed in these versions, so a few fixtures had to be rewritten in tests to adjust to this breaking change.

An interesting part of this was the large contribution of [Patrick Pircher](https://github.com/patricklx). (Many thanks to him!) Sometimes, open source doesn't consist of coding things but rather of guiding others through a certain strategy and helping them help you.

### Build `ember_debug` with Rollup

The Inspector used to build entirely with `ember-cli`. By "entirely", read both the UI and `ember_debug`. Both parts were contained in one single package and shared the same build pipeline described in the ember-cli-build. `ember-cli` expresses all of the modules using AMD; we can't use top-level `await` in the AMD world, but it's a requirement for the design we have in mind. At some point, we would need the `ember_debug.js` script to be output as ESM.

To solve this problem, we did the following:

- We extracted `ember_debug` into its own package. The UI and `ember_debug` are now separated packages, each with its own build pipeline.
- We rewrote the `ember_debug` build pipeline using Rollup. The advantage of Rollup is that it outputs ESM, but provides features to output AMD instead. In other words, we can use Rollup to get things built as AMD without any regression, and easily move to ESM once we are ready to enable Vite support.

At this stage of the work, the ember-cli-build remains responsible for the `ember_debug.js` bundle, but we plan to change that; the next steps are currently in progress.

### Centralize interactions with ember-source

`ember_debug` requires modules from ember-source to send information to the Inspector UI. How these modules are required exactly changes depending on the version of ember-source the inspected app runs on. `requireModule`, `Ember.__loader.require` (where `Ember` is `window.Ember`, or `requireModule('ember').default`, or `requireModule('ember/barrel').default`), `emberSafeRequire` combining both, custom `require` function... all these approaches are used in several files and promise a lot of trouble when Vite and ESM will enter the game.

To prepare the ground, we initiated a refactoring task to centralize in one single file how modules are required. This unique module will adjust its behavior depending on the inspected app context. It will export all the items the other parts of `ember_debug` need to read, making them context-agnostic.

This task comes with its own set of challenges and must be divided into several substeps; we completed some of them, others are currently in progress, and others might still be discovered.

## The Ember app side

So far, we have presented the progress on the Inspector side. Once it's done, we will have an accurate picture of the modules that the twin — ember-source — should expose. As mentioned previously, the ember-source API depends on the RFC process. As long as the RFC is in progress, Ember developers will be stuck with a non-working Inspector. Our strategy is to find a decent balance between providing a solution earlier and limiting the risk that this solution quickly becomes obsolete.

### Write the RFC for early feedback

We will first invest time in writing the RFC and opening it for review. This will allow us to ask for early feedback and validate or invalidate our approach. If someone points out a critical issue, then we will find a different solution and draft it in a new proof of concept. If people point out things that don't fundamentally question our approach, then our level of confidence will be good enough to unblock developers.

### Quick fix Embroider

To provide an early fix for the Inspector, as the RFC process is still in progress, we want to use an implementation in Embroider. The idea is to create a Vite plugin `inspector-support` whose job is to emit a virtual file that exposes exactly the function ember-source should expose in the long run. Developers could activate the plugin in their `vite.config.mjs`, or it could be part of the `classic-ember-support` plugin.

Embroider also has a concept of "adapter" that allows the transformation of v1 addons to make them compatible with Vite. This feature can be used to adapt the virtual content in Ember <= 6.1 when the path to modules changed (e.g. `@ember/enumerable/mutable` didn't exist before 4.8, and we should instead import from `@ember/-internals/runtime/lib/mixins/mutable_enumerable`).

We have already drafted a proof of concept to get a picture of what the implementation would look like.

### Watch and implement the RFC

The rest of the plan is straightforward: we will respond to the comments on the RFC as they come, and once the RFC is accepted, we will implement it in ember-source.

Since the review will take some time and won't require a full-time investment from us, we will parallelize watching the RFC with starting the next topic of the Ember Initiative: the router API.

## Summary

Getting the Ember Inspector to support Vite apps is a demanding project that requires its own micro-roadmap, and involves three different repositories: ember-inspector, ember.js, and potentially Embroider for < 4.8 support. We have designed the plan, started to apply it, and made significant progress, overcoming hidden obstacles as they arise. We are still in the middle of the way, and the Ember Inspector should keep our team busy for a couple of weeks.

Once we reach the final stage (Watch and implement the RFC), we will start investigating the next topic of the Initiative. If your work relies on Ember and you want to have your say about our next priorities, consider encouraging your organization to sponsor Mainmatter's Ember Initiative : [get in touch with us](/contact/), spread the word, and follow our progress on this blog.

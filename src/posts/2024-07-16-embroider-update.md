---
title: "Embroider Initiative: Conclusion"
authorHandle: academierenards
tags: [ember, embroider]
bio: "Marine Dunstetter, Senior Software Engineer"
description:
  "A summary of what Mainmatter achieved with the Embroider Initiative and what
  are the next steps for the community."
og:
  image: /assets/images/posts/2024-05-29-embroider-update/og-image.jpg
tagline: |
  <p>
    The Embroider initiative was a big success for the Ember ecosystem that opened the door to building Ember apps with Vite. Having two engineers work full-time on Embroider allowed many important achievements towards that goal. In this blog post, we will look back at the roadmap to present how far we could go, what are the next steps for the community, and how Mainmatter can make them happen through the new <a href="/ember-initiative/">Ember Initiative</a>.
  </p>

image: /assets/images/posts/2024-05-29-embroider-update/header-embroider.jpg
imageAlt:
  "The logo of companies supporting the Embroider Initiative on a background
  showing people working together on a laptop"
---

Over the past year, the Embroider Initiative has opened the door to building
Ember apps with Vite, raising Ember back up to the same level as other modern
frameworks. Ember has started to be noticed in a wider community and remains a
good choice in 2024, thanks to everything that was accomplished through the
Embroider Initiative and all the companies that invested to make it happen. As
the Embroider Initiative becomes the Ember Initiative, let's take a look at what
we achieved so far and the next steps that are now possible.

## 1. Implement the core of Embroider

The biggest part of the work so far was of course to implement the core of
Embroider. The
[lastest blog post from May](https://mainmatter.com/blog/2024/05/29/embroider-update/)
is a good summary of the different steps of the implementation. In even shorter
words:

- Stage 1 (achieved in the 1st half of the initiative): To achieve backward
  compatibility, each classic Ember Addon package is rebuilt into a new v2
  package format stored in a `rewritten-packages` folder, more static and
  analyzable.

- Stage 2 (achieved in the 1st half of the initiative): By default, Ember apps
  can't be built with Vite because they rely on features Vite cannot understand.
  To work around this problem, Embroider generates a `rewritten-app`, which is
  slightly different from the initial Ember app in a way it can be consumed by
  Vite. But the generation of this rewritten app is an extra step that comes
  with performance downsides.

- Stage 3 (team's focus on the 2nd half of the initiative): To optimize the Vite
  build, we have started a wide technical topic called “inversion of control”.
  The idea is that instead of having Embroider produce a rewritten app, and then
  passing over to Vite once the rewritten app is ready, Vite takes the lead, and
  when it’s unable to resolve Ember-specific requests, it asks Embroider to
  return the information without the need of a rewritten app.

The sections below provide an overview of Stage 3, which consists of gradually
replacing a large proportion of Stage 2 behaviors with this new “inversion of
control” approach.

### a. Optimize the Vite build with inversion of control

To put it very simply: Vite cannot build the initial Ember app, but it can build
the rewritten app, so we are going to remove all the differences between both
apps so Vite can consume the initial Ember app directly... easier said than done
though, because the rewritten app is allowed to contain files generated during
the build process that cannot be part of the Ember app code base. When these
nonexisting files are requested to the Vite dev server, Embroider must be able
to return a consistent answer on the spot as virtual content. The clearest
example is probably the vendor file. In classic apps, `index.html` contains a
reference to `assets/vendor.js` (prefixed by the root URL), which points to a
file created during the classic build pipeline. When using Vite, this reference
must be replaced with `/@embroider/core/vendor.js`, a virtual identifier that
will tell Vite to ask Embroider for the content. On the other hand, part of
these virtual content must be emitted as assets for the production build, and
now this has to be done by Vite through custom plugins. Files virtualization
came with its set of challenges, like finding the right approach to deal with
Vite specifics in a way that keeps Embroider core bundler-agnostic.

🐹 _What's next:_ During the Embroider initiative, we have reached a point where
we are very close to removing the need for the rewritten app completely; there
are a few tasks left that are interdependent and already in progress. Also, to
work on the inversion of control, we had to stop Webpack support, which doesn't
use this new approach. Once the rewritten app is removed, one next step will be
to re-implement Webpack support with the inversion of control approach, and
therefore prove Embroider is truly bundler-agnostic.

### b. Maintain the compatibility of all classic features

A very wide part of the inversion of control is related to maintaining classic
functionalities and keeping v1 addons working the way they used to work in
classic builds. For instance, it makes sense that Vite generates a `vendor.css`
file in the production build only if some classic addon provides styles to
include in there; it makes sense that Embroider is able to locate an addon's
public asset in the rewritten packages and to return its path to the Vite dev
server only because that addon provides that public asset. Classic addons can
also implement hooks like `contentFor` that transform the content of the app's
`index.html`, and many other things.

We could create the rewritten app directly the way it needed to be so all these
features work. With inversion of control, the purpose of each classic
functionality must be carefully thought out so we decide what's the best new way
to handle it. There are three categories of such features:

- **We want to keep this feature as it is**: As Vite is now in charge of the
  build, it should now be responsible for tasks that were previously handled by
  Broccoli plugins, like emitting assets in the production build, or
  transforming the `index.html`. This is what was done for `vendor.js`,
  `vendor.css`, `test-support.js`, `test-support.css`, public assets,
  `content-for` snippets in `index.html`, initializers and
  instance-initializers... When it comes to upgrading v1 addons to v2,
  `@embroider/macros` is also a way to keep v2 addons "dynamic" by using Babel
  to transform addon code depending on the app build environment and options.

- **This should now be the responsibility of the app**: because Ember does a lot
  of things under the hood, classic addons ended up implementing capabilities to
  modify app code the developer cannot access, they kind of "come with their own
  configuration" instead of "explain how they should be configured". This is
  something that will change in modern Ember apps. For instance, classic addons
  could use the `contentFor` hook to change the way the app boots. In the new
  Ember app format, the developer will have access to the app-boot script
  directly in the `index.html`, so addons no longer need to try modifying it
  under the hood. Instead of supporting this feature, we decided to implement
  the detection of this hook being used and an informative message about how to
  update the app. The same rationale was used for `contentFor 'config-module'`.

- **We may not want to support this anymore**: some features have been
  deprioritized because we question their purpose. One example is the
  `serverMiddleware` hook. This hook allowed you to make changes to the express
  server run by ember-cli. This dev-only concept disappears with Vite, since we
  rely on the Vite dev server. Do we really want a way to re-implements in Vite
  middlewares what `serverMiddleware` hook was doing considering that, at the
  very beginning, this feature creates a big gap between testing the app in dev
  mode and production mode? There are probably better ways to make the test
  closer to a “production context”.

🐹 _What's next:_ During the Embroider Initiative, we prioritized the support of
the most important classic features, that are widely used by the community. Some
other less used features are not supported yet, like FastBoot, or storing the
environment config in JS rather than `index.html` meta. The issue
[embroider-build/embroider#1860](https://github.com/embroider-build/embroider/issues/1860)
contains a list of identified features that still require work.

## 2. Support older Ember versions

Embroider uses a tool called scenario-tester to test many apps and addons
scenarios against different Ember versions. Currently, the Vite branch of the
Embroider project runs against Ember 5.8 and canary, which means you need to
upgrade your app to the latest Ember to build with Vite.

Recently, we have been working hard on improving the scenario-tester and having
the stable branch run against Ember 3.28 and above. This work includes an
important fix for ember-data 4.x: the latest improvements on the scenario-tester
fixed the way some dependencies are managed, which highlighted false positives
in the test suite and reproduced errors encountered by developers in their apps.
This allowed us to find the root cause and fix Embroider to manage correctly
ember-data 4.x and any addon that may behave the same way. Not only did this
work on the stable branch positively impact apps using Embroider Stable, but it
also paved the ground to support older Ember versions in Vite.

🐹 _What's next:_ Ideally, we would like to bring the Vite build to Ember 3.28,
as it's the oldest version supported on Embroider Stable. The task will
essentially consist of fixing circular dependencies in ember-source to get a
correct ESM graph. Functionalities like assert, debug, deprecate… need to be
patched in older Ember versions. The idea is to implement a set of patches for
each version we want to support.

## 3. Stabilize the app blueprint

The implementation of the core of Embroider drives a new authoring format for
modern Ember apps. The approach we choose to answer compatibility questions
always tends toward making modern Ember apps more standardized. Between
Embroider Stable and Embroider Vite, the shape of the Ember app has changed
quite a bit. Among other things: the developer now has full control over the
app-boot module (which is now an in-html script in `index.html`) and the config
environment module (which is located in `app/config/environment.js`), a part of
the scripts are virtual modules identified by a virtual identifier starting with
`@embroider`, the AMD modules brought by classic addons are now defined in
`app/app.js` to get the notion of AMD out of Embroider and pave the ground to a
new resolver with
[strict ESM support](https://github.com/emberjs/rfcs/pull/938/), etc...

Some tasks are only about making the Ember apps more standard and comprehensible
without being directly related to compatibility questions. That's the case for
the Babel's config for example. Any classic Ember app depends on
ember-cli-babel, which builds a set of Babel plugins the app requires to run
correctly. ember-cli-babel can be controlled through some build options. In
modern Ember apps, the `babel.config.cjs` file will be responsible for the Babel
config, and the power to control Babel should not be split between
`babel.config.cjs` and build options. We are currently working on removing the
mandatory dependency to ember-cli-babel by creating a `babel.config.cjs`
made-for-Ember that will be provided in... the app blueprint.

On May 31st, Chris presented at EmberConf the
[app blueprint](https://github.com/embroider-build/app-blueprint) that allows
people to generate an Ember app building with Vite from the start. The CI runs
against the Vite branch of Embroider, so each time we merge something, we can
see if the app generated by the blueprint runs correctly. An important step of
Embroider development is to answer all the questions that allow us to define
what the app blueprint looks like, and therefore what developers start with when
creating a brand new app.

🐹 _What's next:_ Now that we have a good idea of what a modern Ember app looks
like, an important next step is to describe it in an RFC to introduce it to the
community and open the door to potential discussions and improvements.

## 4. Handover

The Embroider Initiative now comes to a - successful - end; We have achieved so
many important pieces and we are proud to see the first Ember apps in the
community making their way to Vite. It's now up to the Ember community to pursue
the implementation of Embroider: achieve the topics that remain open, challenge
the blueprint to make Ember as intuitive as possible, support the classic
features that are still wanted, enhance the documentation, make sure all the
most popular addons work with Vite... To ease the handover, the public GitHub
project
[Embroider Working Group](https://github.com/orgs/embroider-build/projects/2)
has been created to help future contributors keep track of the existing issues
and their current status. We plan to work on some of these issues as part of the
[Ember initiative](/blog/2024/07/09/the-embroider-initiative-becomes-the-ember-initiative/).

Over the past year, our team at Mainmatter has built a solid knowledge of
Embroider's core. We can help the Ember community push Embroider further and
further if you give us the means to do it. We’re proposing to turn the Embroider
Initiative into a permanent effort – the Ember Initiative. Mainmatter will
continue to assign a team to work on Ember and its ecosystem full-time. They
will address topics relevant to the Ember ecosystem and every company that uses
Ember. Polishing Embroider is part of the main topics we're proposing. Check out
our [Ember Initiative](/ember-initiative/) page and our dedicated blog post
[The Embroider Initiative Becomes the Ember Initiative](/blog/2024/07/09/the-embroider-initiative-becomes-the-ember-initiative/).

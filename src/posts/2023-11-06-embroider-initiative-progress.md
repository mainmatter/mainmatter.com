---
title: "Progress on the Embroider Initiative"
authorHandle: real_ate
tags: [ember]
bio: "Chris Manson"
description:
og:
  image: 
tagline: 
image: 
imageAlt: 
---

(Embroider background?)

The Embroider Initiative is an experimental programme that Mainmatter spearheaded to help finalise Embroider. 

- benefits to the ember community
- mention that Marco has talked about this in the previous blog post
- mention that marco talked about this at ember fest
- overview of the goals of the initiative (and link to sub sections)
  - need it to work
  - maintain it

Call to action at the top here (somewhere) as well as the bottom.

This blog post is going to take a slightly different approach to telling you about the Embroider Initiative. I have had the honour of working on the initiative for the last 22 weeks and I would like to tell you some of the key things that I have personally been able to achieve because of this Initiative (potentially rewrite as mine and Andrey's achievements)

## Great progress on the effort to get Ember working with Vite

At EmberConf this year [Ed Falkner](https://github.com/ef4) [announced that we were closing in on a Vite plugin for Embroider](https://www.youtube.com/watch?v=8rnmGGY5rhk&t=1723s). While that was true at the time we have learned a lot about the Vite build process since then and we know more about the steps that are still required to get the Vite integration working.

The Vite app that Ed demoed at EmberConf was a trivial app that is a [package in the Embroider monorepo](https://github.com/embroider-build/embroider/tree/main/tests/vite-app) and if you wanted to test it yourself then you could either clone the Embroider monorepo, or you could clone [this repo](https://github.com/mansona/ember-vite-app) which is essentially just extracting the same test app into an independent repo. It works, and you can even see the incredible rebuild speeds in action.

The issue with this trivial demo is that it doesn't represent an average Ember application. I don't know of any Ember applications out there that don't have a single addon installed. While it's not exactly true that the demo doesn't have **any** addons installed, it doesn't have any addons that are doing any real work. And as it turns out getting dependencies to work right is the challenge with the Vite build.

Ed and I have been pairing weekly plugging away at the remaining things that are required to fix the Vite build and will hopefully have some more progress over the coming weeks.

- TODO maybe talk about a few of the ebs and flows in the effort to get it working?
- TODO (maybe talk about some of the embroider resolver work here?)

## ember-auto-import allowAppImports

While the main focus of the Embroider Initiative was always going to be the Embroider code base, there are other parts of the ecosystem that will require some work to bring them more in line with how we want people to build their apps.

If you're already using Embroider you will know that a lot of the work to package your app is done by Webpack. If you're still on a classic build you may not be aware that ember-auto-import uses Webpack under the hood to allow you to seamlessly import from `node_modules`. This has been a very useful feature but since the acceptance of the [v2 addon spec RFC](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format) we have noticed that we have a bit of a blindspot in classic builds. Since v2 addons can't influence the build in any way (effectively making them static packages) addon authors need to add extra installation instructions to detail how to add a Webpack plugin to their application build config if they still wanted to influence the build process in any way. This is perfectly legitimate in Embroider but it does not work for classic apps.

The issue is that ember-auto-import was originally designed to only work with npm packages, so that means that classic apps couldn't add a Webpack plugin that would influence the build process for any files controlled by their app, only for files controlled by npm packages or addons. This has been a [blocker for some addon developers who want to upgrade their addons to the new v2 format](https://github.com/simonihmig/ember-responsive-image/pull/442) and our solution to this problem has been to [add a new config to ember-auto-import](https://github.com/embroider-build/ember-auto-import/pull/587) to allow you to specify parts of your app that should be under its control. 

While this work has been done to facilitate v2 addons having the same install instructions for classic ember-cli builds and Embroider apps, this functionality could also be considered a way to allow you to opt-in to Embroider on a folder by folder basis and when your whole app is being controlled by ember-auto-import (and Webpack) the move to embroider should technically require no changes to the app.

- TODO maybe asset import RFC https://github.com/emberjs/rfcs/blob/master/text/0763-asset-importing-spec.md

## Progress for Embroider Initiative backers

The embroider initiative can only work with backing from companies that see the vision etc.

- talk about the tiers a little bit
- talk about the benefits of the 2 hour pairing sessions
- talk about how solving specific issues for backers converted to solving general problems for the community

(maybe mention something about how the pairing sessions happened to be with incredibly talented engineers, and while I had a part in )

### Ticketsolve

- converted their internal addon to v2 
- helped them to adopt GJS and GTS
- helped to convert 2 of their 3 apps to embroider

### Intercom

- helped to convert internal app to v2
- helped to identify and fix the performance slowdown
- helped to identify a CI blocker around simlinking node_modules
- helped to convert the app and test suite to work in embroider

## Improving the bus factor

- talk about the complexity of the project
- high learning curve
- growing confidence & independence (give example of identify, fix, merge, and release)
- apprenticeship with Andrey

## General stability and ecosystem improvements

- watch mode tests
- ember-cli-update supporting v2 addons
- ember-cli --embroider flag
- scenario-tester ESM
- TODO add andreys stuff in here

## Call to action

This is just a snapshot of what I have been personally working on over the last 2 months. I hope to be able to continue this work but unless we can find some more backers teh initiative will end on (DATE).

I will continue to write looser weekly updates on my personal blog and if the Initiative continues indefinitely I hope to write a roundup like this every month.

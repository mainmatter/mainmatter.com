---
title: "The Start of the Ember Initiative"
authorHandle: real_ate
tags: ["ember"]
bio: "Senior Software Engineer, Member of the Ember Core Learning and Ember Core Tooling teams."
description: "Announcing the start of the Ember Iniative"
og:
  image: "/assets/images/posts/2025-02-25-the-ember-initiative/og-image.jpg"
tagline: |
  <p>
    After the success of the Embroider Initiative we are thrilled to be starting the Ember Initiative, a new on-going programme to improve various parts of the Ember ecosystem. This post recaps the status of Embroider since the end of the Embroider Initiative and what we're going to be focusing on for the first 3 months of the Ember Initiative. 
  </p>
---

## Recap - The Story so Far

Between 2023 and 2024, Mainmatter helped modernize Ember by fundraising and executing [the Embroider Initiative](/blog/2024/07/16/embroider-update/) so developers could use Vite to build their Ember apps. The initiative was a resounding success in that it got the Embroider project back on the rails and close to the final production version of Embroider with Vite. Since we concluded the Embroider Initiative, there have been two significant milestones reached:

- [The v2 app blueprint RFC](https://rfcs.emberjs.com/id/0977-v2-app-format) has been accepted, and
- We have [released our first alpha of the upcoming Embroider](https://github.com/embroider-build/embroider/releases/tag/v8.0.0-alpha.0-%40embroider%2Faddon-dev) release

While this is monumental, we're not quite at the point where running `ember new` gives you a Vite-powered app. We hope to fix that soon with the Ember Initiative.

## The Ember Initiative

The Ember Initiative is intended to be just like the Embroider Initiative, but it is ongoing and does not just focus on a single topic. You can read more detail about this in [our blog post that introduces the Ember Initiative](/blog/2024/07/09/the-embroider-initiative-becomes-the-ember-initiative/), but the short version is that the Embroider Initiative was so successful that the whole Ember Community wants to keep that train running 🎉

Because the Ember Initiative is not just focusing on a single project, we are encouraging people to think of it as an ongoing subscription that new backers can join at any time. Just like last time, you get a number of perks depending on what level of backing you join the Initiative on, but crucially this time if you're on the top tier you can **influence what the team focuses on**. The roadmap for the first 3 months of the Ember Initiative has already been agreed on with input from the Ember Core Team and the Ember Initiative Backers. If you want to influence next quarter's roadmap, please [get in touch](/contact/) and join the Initiative as a backer!

We're tracking our work on the [Mainmatter Ember Initiative GitHub project](https://github.com/orgs/mainmatter/projects/14). If you look at the project you'll see that there are two main focus items for this quarter (and a smaller sub-focus):

1. Polishing Embroider
2. Starting the Route Manager API
3. Preparing the "Developer Tooling" work for next quarter

### Polishing Embroider

As I mentioned in the intro, we achieved a lot with the Embroider Initiative, and this will not only improve the lives of developers currently using Ember but also allow us to reach other parts of the JavaScript ecosystem. I had the opportunity to [speak at ViteConf last year](https://viteconf.org/24/replay/ember), where I talked about some of the interesting things we are doing with Vite. To say that the atmosphere was electric during our talk is an understatement. There are a core group of Ember fans out there that would love to recommend Ember for their next project but the fact that our build system is not modern enough has been a real blocker, and that's what we are hoping to fix.

The [the v2 app blueprint RFC](https://rfcs.emberjs.com/id/0977-v2-app-format) is currently in the `accepted` stage, which means that we have agreed on the plan and we need to work on the implementation and documentation before it becomes the default. You can read more about the RFC Stages on the [Ember RFC website](https://rfcs.emberjs.com/#stages) but the short version is that when we reach the final stage `recommended` that is when running `ember new` will generate a Embroider and Vite powered app. This is our goal, to finish off the small number of implementation tasks and add the required documentation so that Vite can be the default experience for every Ember developer.

If you want to try out the new proposed v2 app, you can check out the [preview app-blueprint](https://github.com/embroider-build/app-blueprint?tab=readme-ov-file#embroiderapp-blueprint). Throughout the Ember Initiative, we will keep you updated on the progress towards making Vite the default build system for Ember apps.

### Route and Routing Manager API

The Ember Core team has identified Routing as an area that needs some improvement in the framework. Our Router has undergone little change since it was introduced in the first Ember 1.0 prerelease. [The commit that switched over to the Router was in June 2012](https://github.com/emberjs/ember.js/commit/d23ea3ab501fc0e8f591a793b927f572436647a1)— which was over 12 years ago at the time of writing. That is a very long time to have an essentially stable routing API.

A lot has changed in Ember in 12 years, and JavaScript has also changed so much in that time! This was before Classes or ES Modules were part of the language.

Even after all this time, Ember's Router is still state of the art, however, it just doesn't quite fit into modern architectures as well as it could. Some examples are the reliance on the _Ember Global Resolver_ for each of the parts of the route (template, route, controller). There has been some movement on this recently with the [introduction of Template Tag in Routes](https://rfcs.emberjs.com/id/1046-template-tag-in-routes), which allows you to essentially write Routable Components for the template part of your Route, but the underlying architecture that ties this all together is still based on the Global Resolver.

The second key part of the architecture we know we need to improve is the reactivity. We have almost fully transitioned our concept of reactivity to `@tracked` variables (which are akin to [signals](https://github.com/tc39/proposal-signals)), and the last thing that we need to transition is our routing system. The Ember Core team is currently exploring a new architecture based on resources, which you can see a great explanation of in [Ed Falkner's video in EmberFest Paris](https://www.youtube.com/watch?v=sWGyJR6P-V0).

Our goal as part of the Ember Initiative is to start the process of improving the routing system, not to finish it. We want to introduce a **Manager API** for Routes and eventually create one for the Router. I will not go into too much detail about what a Manager API is in this post, but if you want to get a feel for the type of API that we are aiming for you can read the [RFC that introduced the Component Manager API to Ember](https://rfcs.emberjs.com/id/0213-custom-components/). The short version is that a Manager API will allow us to implement alternative Route APIs and enable developers to transition to the new Route APIs **one Route at a time**. This sort of progressive upgrade strategy is incredibly important when changing something as fundamental as a Route in Ember.

The first push for the Ember Initiative will be to write a new RFC and to provide a test implementation for the Route Manager API. The Router/Routing Manager API is a much larger task to tackle because it is so deeply ingrained into how Ember works, but we are actively discussing this topic at the weekly Ember Spec Meeting, which is public on the Ember Discord every Thursday at 21h GMT if you want to come along.

### Developer Tooling

The first two topics I described above are more than enough to keep our team busy during the first 3 months of the Initiative, but we also plan to make a start on the substantial topic of Developer tooling. We don't intend to get any of the work done; we just want to define a roadmap and get a feel for the current state of play with developer tooling for Ember developers in the ever-changing Vite and GJS world. Our deliverable for the first 3 months of the Initiative is to have a well-defined set of tasks that we can add to the roadmap.

## Next Steps

I am very excited about the start of the Ember Initiative. If you are too, you can follow our progress on this blog so be sure to follow us on socials and be notified when we post another update.

To ensure we can continue improving Ember for the entire community beyond these first 3 months of work we need more backers like you. If you want to help, consider encouraging the organisation you work for to sponsor the Initiative. You can get dedicated engineering time with our team and have an influence the roadmap. With your help, we could keep this train going and make Ember shine for everyone for the next decade 💪

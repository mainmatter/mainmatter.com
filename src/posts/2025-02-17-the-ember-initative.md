---
title: "The Start of the Ember Initative"
authorHandle: real_ate
tags: ["ember"]
bio: "Senior Software Engineer, Memeber of the Ember Core Learning and Ember Core Tooling teams."
description: "Announcing the start of the Ember Iniative"
og:
  image: 
tagline: |
  <p>
    After the success of the Embroider Initiative we are thrilled to be starting the Ember Initiative, a new on-going programme to improve various parts of the Ember ecosystem. This post recaps the status of Embroider since the end of the Embroider Initiative and what we're going to be focusing on for the first 3 months of the Ember initiative. 
  </p>
---

## Recap - the story so far

[The Embroider Initiative concluded](http://localhost:8080/blog/2024/07/16/embroider-update/) in July of last year and by all accounts it was a resounding success. The goal was to inject life into the Embroider project and get it across the finish line so that people could start using Vite to build their Ember apps. While we didn't manage to deploy the final production version of Embroider with Vite, we succedded in the goal to unstick the project and get it back on the rails. Since we concluded the Embroider Initiative there have been two major milestones reached: 

- [The v2 app blueprint RFC](https://rfcs.emberjs.com/id/0977-v2-app-format) has been accepted, and
- We have [released our first alpha of the upcoming Embroider](https://github.com/embroider-build/embroider/releases/tag/v8.0.0-alpha.0-%40embroider%2Faddon-dev) release

While this is monumental, it means that we're not quite at the point where running `ember new` gives you a Vite powered app. But we hope to fix that soon because of the Ember initiative

## The Ember Iniative

The Ember Initiative is intended to be just like the Embroider Initiative but ongoing and not just focusing on a single topic. You can read more detail about this in [Marco's Blog Post that introduces the Ember Initiative](/blog/2024/07/09/the-embroider-initiative-becomes-the-ember-initiative/) but the short version is that the Embroider Initiative was so successful that we want to keep that train running 🎉

Because the Ember Initiative is not just focusing on a single project we are encouraging backers to think of it as an ongoing subscription that you can join at any time. Just like last time you get a number of perks depending on what level of backing you join the Initiative on, but curucially this time if you're on the top tier you can **influence what the team focuses on**. The roadmap for the first 3 months of the ember iniative has already been agreed on with input from the Ember Core Team and the Ember Initiative Backers. If you want to be able to influence the next quarter's roadmap please do get in touch! 

We're tracking our work on the [Mainmatter Ember Initiative GitHub project](https://github.com/orgs/mainmatter/projects/14). If you look at the project you'll see that there are two main focus items for this quarter (and a smaller sub-focus)

- Polishing Embroider
- Starting the Route Manager API
- Preparing the "Developer Tooling" work for next Quarter

I'll expand on those focus areas and what they mean in the following sections

## Polishing Embroider

As I mentioend in the intro we achieved some wonderful things

talk about the impact that this wil lhave on the community

talk about how we can support people getting over that hill, then maybe the rfc process 

- link to the RFC
- talk about the changes
- talk about RFC stages and what comes next

alpha version?

- we used to release unstable
  - what this means from a semver perspective
  - what this means from a social perspective
- giant PR with all the changes
- smaller incremental alpha releses on the road to 


## Route and Routing Manager API

Routing has been identified as a place of improvement in the Ember framework. Our router has gone through little change since it was first introduce in the first Ember 1.0 prerelease. [The commit that swapped over to the router was in June 2012](https://github.com/emberjs/ember.js/commit/d23ea3ab501fc0e8f591a793b927f572436647a1) - which was over 12 years ago at time of writing. That is a very long time to have an essentially stable routing API.

A lot has changed in Ember in 12 years, not only that JavaScript has changed a lot in 12 years! This was essentially before Classes were in the language and well before we were thinking about ES Modules.

This is not to say that our router is bad because it's foundations are so old, it just doesn't fit into the modern architextures as well as it could. some examples are the reliance on global resolver for the parts of the route (template, route, controller). There has been some movement on this recently with

the second key part of the architecture that could be improved is the reactivity. we have almost fully transitioned our concept of reactivity to tracked variables which are akin to signals but the last hold out is our routing system. The natural progression would be towards resources

You can see a great explanation of this principle in Ed falkner's video in EmberFest Paris

Our goal as part of the Ember Initiative is to start the process of improving the routing ystem, not to finish it. The way that we want to achieve this goal is to introduce a Manager API for Routes and one for the Router itself.

background on a manager API - maybe linking to https://rfcs.emberjs.com/id/0213-custom-components/ maybe linking to https://www.digitalocean.com/community/tutorials/strategy-design-pattern-in-java-example-tutorial


The first push for the Ember Initiative will be to get the RFC and a test implementation for the Route Manager API. The Router Manager API is a much larger thing to tackle because it is so deeply engrained into how Ember works but there is a plan currently being discussed by the core teams in the spec meeting which are public on the ember discord if you want to come along.

## Developer tooling

The first two topics I described above are more than enough for us to be working on for the first 3 months of the Initiative but we also plan to make a start on the larger topic of Developer tooling. We don't intend to get much done, we just want to define a roadmap and get a feel for the current state of play with developer tooling for Ember developers in the ever changing Vite and GJS world.

## Conclusion

I am very excited about this, and if reading about all these upcomign improvments has made you excited then you should consider bakcing the initiative. We plan to get a lot done in the first 3 months of the Initiative but if we can get enough regular backers we can keep this train going and make Ember shine for everyone for the next decade.



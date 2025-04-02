---
title: "One Month of the Ember Initative"
authorHandle: real_ate
tags: ["ember"]
bio: "Senior Software Engineer, Member of the Ember Core Learning and Ember Core Tooling teams."
description: "An update on the progress made in the first month of the Ember Initative"
autoOg: true
tagline: |
  <p>
    The Ember Initative has been running for only one Month and it has been a wild ride of success after success. The Ember Initiative Backers have had big wins and that has trickled down to the rest of the community making it better of everyone. This post will go into more detail of all the success.
  </p>
---

## Priorities for the first month

If you don't know what the Ember Inative is and you're reading this post then you can catch up wiht the [update]. The short version is that Mainmatter has put together a group of bakcers to work on things that are important to the Ember community. Those backers can influence what the priorities but the work is all done in the open and everyone gets to benefit.

We set our priorities and listed themin our [project](https://github.com/orgs/mainmatter/projects/14) and we have delivered amazing things


### ember-vite-codemod

We wanted to document the way to get from a "classic build" using ember-cli to Vite. This could have been a tedious 20 step document that would quickly get out of date... or we could just create a tool that did the work for you. So we created the [ember-vite-codemod](link here) that runs on your existing app to upgrade it to Vite. you can read more aobut the thought process behind the codemod in our [other blog post on the topic]() but there are some key benefits that we have been able to include

- Quickly test your app on Vite if it's ready to go
- automatically remove dependencies that you don't need any more
- Be able to identify known problems that you shoudl fix before continuing

We have done an audit of the top 100 used addons and figured out which things fall into the different categories. We have also identified some addons that should be removed but there was no documentation on how to remove them. so we documented it

### figure out a migration plan for ember-css-modules 

Some things just don't work in the modern Ember tooling. Bad archtectural decision of the past coming back ot bite us. There are some modern ways to achieve the same things but so far there has not been any migraion path. This is is something that we fixed

You should go and read the whole blog post but here are the high level points

- implement ember-sceoped-css and ember-css-modules at the same time
- migrate from ember-css-modules to ember-css-modules file-by-file
- when you switch to Vite then change the config to use only the vite plugin


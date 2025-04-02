---
title: "Ember Initative - First Update"
authorHandle: real_ate
tags: ["ember"]
bio: "Senior Software Engineer, Member of the Ember Core Learning and Ember Core Tooling teams."
description: "An update on the progress made so far in the Ember Initiative"
autoOg: true
tagline: |
  <p>
    The Ember Initiative has been running for a month and a half and has been a wild ride of success after success. The Ember Initiative Backers have had big wins and that has trickled down to the rest of the community making it better for everyone and we have hit significant milestones with Embroider.
  </p>
---

If you don't know about the Ember Initiative, you can catch up by reading our post on [The Start of the Ember Initiative](/blog/2025/02/25/the-ember-initiative/). The short version is that Mainmatter has brought together a group of backers to support the work on important things for the Ember community. Those backers can influence what we work on and in what order, but the work is all done in the open and everyone building apps with Ember gets to benefit.

The main focus so far has been "Polishing Embroider", with the explicit goal of making Vite the default experience for Ember developers. Finishing off Embroider has been a mixture of technical tasks and more "community" tasks, where we provide guidance and tooling for people moving their apps to Vite.

Thanks to the success of the previous Embroider Initiative large and time-consuming tasks have already been done, and we have been able to progress at a remarkable pace and finally deploy things in a way that people can easily consume


## Stable Vite Implementation

Over the past two years, the Ember Tooling Team has been releasing the upcoming Embroider+Vite implementation under nightly unstable or alpha versions on npm. This has been useful for allowing people to experiment with the implementation in their own apps, but many people may have been holding off upgrading their apps until Embroider was deemed stable. 

Nobody should hold back from trying Embroider with Vite now because we have released the first stable versions of Embroider@4 🎉 There is still a little bit of work to make it so that someone running `ember new fancy-app` will generate a Vite app by default, but anyone migrating to Embroider today will be migrating to the Vite-powered build.

If you're not on the latest version of Ember, don't worry. As part of the Ember Initiative, we were able to bring support for the Vite build system all the way back to Ember@v3.28. This is a fantastic achievement, but it also represents the Ember community's dedication to backwards compatibility. We want to leave no app behind when upgrading the whole community to the future of the Ember build system.

If you are looking for the fastest way to try out the new build, keep reading and check out the `ember-vite-codemod`.

## ember-vite-codemod

Now that Vite is the default experience for Embroider, we want to give people the easiest on-ramp to upgrading their apps to the new build system. Documenting the upgrade path from "classic" ember-cli to Vite would have been a very tedious multistep document that would quickly become out of date.

Instead, we created [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod), which you can run on your existing app to upgrade to Vite. You can read more about the thought process behind the codemod in our [other blog post on the topic](https://mainmatter.com/blog/2025/03/10/ember-vite-codemod/), but there are some key benefits that we have been able to include

- automatically install all the new packages required to build with Vite
- add all the new required config files required to build with Vite
- automatically remove dependencies that you don't need any more
- identify which addons you are using that have already been updated to v2 and prompt you to update
- identify known problems that you should fix before continuing and warn you before continuing

Having a codemod that guides you through the process is intended to significantly lower the barrier to entry for people testing out Vite with their Ember apps. It also allows us to provide an improved upgrade experience the more people try out the codemod and give feedback.


## Audit the top 100 Ember addons

Since we created the `ember-vite-codemod`, we decided to ensure that it provided the correct upgrade path for applications depending on the most popular Ember addons. To verify this information, we have audited the top 100 used addons and tried to categorise them based on what the `ember-vite-codemod` should do. 

- packages that can be safely ignored (because the ember-vite-codemod would remove them)
- any addon that has a newer version that is a v2 addon
- any addon with a known incompatibility 
- everything else

Our job here is not to make sure that all the top 100 addons work; we just want to be able to give people as much guidance as we can during the Vite upgrade. A lot of work has been done in Embroider over the last two years to make it work with as many classic addons as possible, so we can assume that, in most cases, it will do the right thing. When we encounter something that will either not work or break your build while upgrading to Vite,  we should link to a relevant upgrade or migration guide.

We are planning a blog post that goes into more detail about the top 100 addons, but the most important finding we had after the audit was that there was only one addon that we knew wouldn't work but didn't yet have a migration plan defined: `ember-css-modules`. We wrote a migration plan to unblock anyone depending on that addon.

## Define a Migration Plan for ember-css-modules 

I mentioned already that Embroider can automatically upgrade most addons during a prebuild step in your apps. The prebuild step has been invaluable for people trying out Embroider because they don't need to wait for addons to upgrade to v2 and be more aligned with modern tooling.

Unfortunately, some addons can never work because they rely on parts of the v1 addon API that we don't want to support going forward. You can read more about those APIs in the [rfc that introduced the v2 addon format](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/), with some justification on why we don't want to support those APIs.

`ember-css-modules` is, unfortunately, too tied into how the classic addon build process worked. Some efforts have been made to make it compatible with Embroider over the years, but none of those efforts succeeded. It is generally accepted that the best thing for people to do is to migrate away from `ember-css-modules` before upgrading to Vite. We came up with a migration path that utilises `ember-scoped-css`, which gives you most of the same functionality as `ember-css-modules` in a format that can be implemented successfully with Emberoider.

We recently wrote a blog post that goes into a lot more detail on [how to migrate away from ember-scoped-css](/blog/2025/03/28/migrate-from-ember-css-modules/) but here is a quick summary of the steps:

- Implement ember-scoped-css and ember-css-modules at the same time
- migrate from ember-css-modules to ember-css-modules file-by-file
- after you switch to Vite, you can change the config to use a Vite plugin

While this is still a measurable amount of work, it's better than having to migrate to Vite and change your css system at the same time and should represent a valid migration path for large applications relying on ember-css-modules

## Conclusion and next steps

The Ember initiative has already been a massive success for the whole Ember community. We have achieved so much relatively quickly and are still working hard to bring significant improvements to the DX of anyone using Ember. 

If we want this success to continue, The Ember Initiative needs more backers. We currently have enough support to continue working for another four months, and if we can get enough backers to keep the initiative going indefinitely, then there is truly no limit to what we can achieve for the Ember community over the coming years.

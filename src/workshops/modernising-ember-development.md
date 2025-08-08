---
title: "Modernising your Ember App Development with GJS and Vite"
tags: "ember"
format: "Workshop: 2–5 days"
subtext: "Bookable for teams – on-site or remote"
description: A 2–5 day workshop in which we teach you how to upgrade any Ember app to the most modern techiques in the Polaris Edition. We introduce you to single-file-components (GJS) and in which we go through a series of stages that each build on one another. Each topic is introduced via an in-depth presentation as well as a small, focussed demo application that illustrates the respective concept in practice.
introduction:
  <p>A 2–5 day workshop in which we teach you how to upgrade any Ember app to the most modern techniques in the Polaris Edition. We introduce you to single-file-components (GJS) and walk you through the template-tag-codemod that can upgrade all of your existing Ember templates to GJS.</p>

  <p>We also introduce you to the new default blueprint in Polaris that uses Vite by default to build your Ember app, and we walk you through the ember-vite-codemod that should simplify the migration path for your existing Ember apps.</p>

  <p>This workshop can be tailored, in both length and content, to solve specific challenges that you face in your application so reach out if you would like to discuss the topics you would like to see us cover.</p>
hero:
  color: purple
  image: "/assets/images/workshops/modernising-ember-development/modernising-ember-development-hero.jpg"
  imageAlt: "Hamster sitting behind a hamster-sized desk"

og:
  image: /assets/images/workshops/modernising-ember-development/og-image.jpg
topics:
  - title: Introduction to Ember single-file-components (GJS)
    text: >
      We introduce you to the new format for Ember templates, explain the benefits of the new format, and discuss some of the new functionality and organisation this unlocks for Ember applications


  - title: Introduction to the @embroider/template-tag-codemod
    text: >
      The <code>@embroider/template-tag-codemod</code> can automatically convert all of your existing templates to GJS. You will learn how to run the codemod, how to understand the different options, and learn how to interperet the different kind of error messages that the codemod can show


  - title: Learn how to customise the @embroider/template-tag-codemod
    text: >
      When the <code>@embroider/template-tag-codemod</code> fails to update a file it can sometimes be because of a real problem in your codebase or it can be because you're relying on something custom that doesn't work any more in modern GJS templates. The codemod provides a number of customisations that can allow you to influence the migration and overcome some of these challenges, and we can show you how to best make use of these customisations. 


  - title: Introduction to the new Vite build system
    text: >
      Ember has transitioned to using Vite to build your apps by default, this gives you a significant improvemnt to your Developer Experience (DX) while developing your Ember app. With the new build system there are a few structural changes to how your apps are laid out and we will go through the new blueprint output to familiarise you with the new structure.


  - title: Using the ember-vite-codemod to migrate existing apps to Vite
    text: >
      Because of the differences between the classic build system and the new Vite based system it can be tricky to migrate from one to the other, this is why the <code>ember-vite-codemod</code> was created. The codemod can check for issues that you might see while migrating, alerting you to fix things before proceeding, and once everythign is good-to-go it will move the required files around for you and make the necessary changes to those files. We will go through some of the changes that the codemod will make and help you to identify any of the issues that can show up when upgrading your application.


  - title: Updating Addons to V2 (optional)
    text: >
      The new Vite-based build system uses Embroider to automatically convert classic v1 addons to v2 addons under the hood, this is great because it means that you don't need to convert all your addons before moving to Vite. If you have any internal addons that you maintain it can improve build times and significantly improve DX if you upgrade them to v2 instead of having Embroider do it every time you start a build. We can go through some of the techniques and considerations for upgrading classic v1 addons and work through a few example addons to show you real-world examples


leads:
  - handle: real_ate
---

<!--break-->

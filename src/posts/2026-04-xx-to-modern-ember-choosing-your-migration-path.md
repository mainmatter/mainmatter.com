---
title: "To modern Ember: Choosing your migration path"
authorHandle: academierenards
tags: [ember, embroider, vite]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "TODO"
autoOg: true
customCta: "global/ember-cta.njk"
tagline: |
  <p>
  The main pieces to modernize an Ember application are the following: use GJS (or GTS) files, build with Embroider/Vite, use the latest version of Ember, type your code with TypeScript, and—if your app used to rely on EmberData—use WarpDrive. This blog post aims at describing a modernization path that is generally effective and could ease your life.
  </p>
---

This blog post is a "Choose Your Own Adventure" blog post to define your path to modern Ember. It's certainly not infallible, your may be working in a specific context that makes it hard to apply as is, but this represents the most generic "easier path" according to our experience as Ember experts working with many different Ember companies.

**Follow the sections in the proposed order** and "stop and do" each time your app fulfills the condition.

## 1. My app still uses Ember < 3.28

👉 Upgrade Ember to 3.28. This version is important because the tooling for GJS and Embroider/Vite was backported to work with it.

From the moment your app is at least in Ember 3.28, you are in a good place to start modernizing; even if you have the overwhelming feeling that 3.28 to 6 is just too much to catch-up with, the situation is actually better than you think it is. Ember never leaves anyone behind, all the tools are there to help you adopt modern practices at your own pace.

## 2. My Ember ≥ 3.28 app still uses `.hbs` and `.js` files

👉 Start using GJS. Use [template-tag-codemod](https://github.com/embroider-build/embroider/tree/main/packages/template-tag-codemod) to ease the migration.

GJS is more performant than separate `.hbs` and `.js` files, so your build will be faster. The explicit imports of the invokables used in the template make the code easier to understand. Also, from the moment a GJS component is functional, you can be certain it's compatible with Vite, so doing the GJS migration first will ensure you don't have any component that will later block your move to Embroider/Vite.

## 3. My 3.28 ≤ Ember < 5.0 app still uses EmberData < 5.3

👉 Update EmberData to 5.8. Your current version of EmberData is a v1 addon that is incompatible with Vite. EmberData 5.8 is a v2 addon that re-introduces the compatibility with Ember < 5. It will behave fine when building with Embroider/Vite.

Note that completing this update requires to fix EmberData deprecations. Additionally, EmberData 5.8 uses some of the WarpDrive packages under the hood, but your code should continue to work seamlessly as it is. However, new deprecation warnings will guide you through activating WarpDrive legacy mode, handle them.

## 4. My Ember ≥ 5.0 app still uses EmberData < 5.3

👉 Update EmberData to at least 5.8. Your current version of EmberData is a v1 addon that is incompatible with Vite. EmberData becomes a v2 addon in 5.3, but the advantage of 5.8 is that you will have all the deprecation warnings that guide you to WarpDrive legacy mode.

Note that completing this update requires to fix EmberData deprecations. Additionally, EmberData 5.8 uses some of the WarpDrive packages under the hood, but your code should continue to work seamlessly as it is. The new deprecation warnings will guide you through activating WarpDrive legacy mode, handle them.

## 5.  My Ember ≥ 3.28 app still builds with Broccoli 

👉 Start building with Embroider/Vite. Use [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod) for guidance and automation of the migration.

Embroider/Vite is a significant improvement for your build system. By adopting Vite and ensure your application is Vite-compatible, you also pave the way to more recent Ember versions. It's easier to modernize Ember in general when you're already using the modern build system.

## 6.  My Ember ≥ 3.28 app still uses EmberData Models

👉 Migrate EmberData Models to WarpDrive Schemas. There is a codemod under development to automate this migration. Meanwhile, refer to the [previous article]() of this series or to [WarpDrive documentation]().

Once your Models are migrated to schema using the legacy mode tools, you are using WarpDrive legacy mode in its strictest definition. The future WarpDrive update will enable a more truely framework-agnostic data layer.

## 7. My 3.28 ≤ Ember < 6.0 app is not typed

👉  Update Ember to at least 6.0. This version will ease TypeScript introduction because it provides native types.

Before Ember 6.0, you need to rely on the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) package for Ember to type your app. Starting Ember 6.0, native types are provided, so TypeScript configuration is lighter.

## 8. My Ember ≥ 6.0 app is not typed

👉  Introduce TypeScript. Use the [Ember Guides](https://guides.emberjs.com/release/typescript/application-development/converting-an-app/) for support.

Typing can be introduced progressively. The parts of your code that provide an API to the rest of the app can legitimately be considered more relevant, since they can effectively improve the code robustness and also make the APIs easier to read.

## Conclusion

As explained as the beginning of this blog post, the steps proposed above are the theoretically easier path to get a modern 6.x Ember app using GJS, building with Embroider/Vite, relying on WarpDrive legacy mode to manage data, with type safety checks. Some step may apply more or less well to your application. If this blog post doesn't solve all of your questions, [get in touch with Mainmatter]().  We can audit your codebase and help you figure out the best path forward.

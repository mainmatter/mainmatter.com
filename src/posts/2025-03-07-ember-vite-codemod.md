---
title: "Ember Vite Codemod"
authorHandle: academierenards
tags: [ember, embroider, vite]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "Announcing the first release of ember-vite-codemod"
og:
  image: ""
tagline: |
  <p>
   In the context of the <a href="/ember-initiative/">Ember Initiative</a>, we are thrilled to share the achievements of the first two weeks of work: the first release of <a href="https://github.com/mainmatter/ember-vite-codemod">ember-vite-codemod</a>, a codemod to get your Ember app building with Vite with just one command. 
  </p>
---

Ember is probably the most alive framework of all. It grows up with you; it evolves with you; it becomes a better framework year after year as you become a better developer. Step-by-step improvement is part of its power. As the framework evolves, the community won't leave you behind: it will provide you with everything you need to update your app and adopt modern practices at your own pace. Our job now at Mainmatter, in the context of the Ember Initiative, is to lend you a hand when it comes to migrating your classic Ember app to build with Vite. This is the first step of the journey: [**ember-vite-codemod**](https://github.com/mainmatter/ember-vite-codemod), the codemod to migrate from classic apps to Vite apps.

If you can't wait to try it out and you want to learn all the details of what it does, [jump to the README](https://github.com/mainmatter/ember-vite-codemod) of the repository. The purpose of this article is more about take you on our journey, and show you the way we approach this type of problem-solving.

## What's a codemod?

A codemod is essentially a script that transforms your code automatically. In the Ember ecosystem, it's a widely used way to help developers adopt a new syntax. For instance, long ago, we wrote double-curlies syntax `{{#my-component}}` to invoke components in a template. Nowadays, we use the angle bracket syntax `<MyComponent>` instead. There is a [codemod that does this for you](https://github.com/ember-codemods/ember-angle-brackets-codemod), so if you need to migrate an old Ember app to the modern syntax, you don't have to do it all by yourself.

## Do or document?

To put it differently, let's assume that you document entirely the way the code should be transformed: a codemod would be like a script that automatically follows your documentation so your users don't have to follow it themselves. But as long as the docs exist, users can read them, and the codemod is just a bonus with two purposes: saving your users time, and protecting them from a feeling of overwhelm that could turn them away from your lib.

With this idea in mind, it's up to you to put the cursor on what your codemod can or cannot do; what should be legitimately part of its job? What should remain the responsibility of the developer running it? Wherever you put that cursor, documenting both type of changes (codemod and manual) allows developers to use the documentation as a fallback if they encounter an issue with the codemod.

🐹 For ember-vite-codemod, we put the cursor on the strict requirements to build with Vite. Everything Vite requires that is not in a standard classic app, the codemod should have it; but everything that is not strictly included in this definition is the responsibility of the developer. A relevant example might be the linter configuration _versus_ the new Babel config. A pattern in some legacy Ember apps is to have `@babel/plugin-proposal-decorators` installed and configured in the `eslint.config.mjs`:

```
parserOptions: {
  requireConfigFile: false,
  babelOptions: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ],
  },
},
```

In a new Embroider+Vite app, the dependency `decorator-transforms` is used in the new Babel config `babel.config.cjs`. Suppose the pattern above is present in the Ember app and you run the codemod: the linter will throw a parsing error "Cannot use the decorators and decorators-legacy plugin together". Do we want to do something about it? The answer turns out to be no. The purpose of the codemod is to get the app building with Vite. The linter configuration is not related to the build; it's the developer's responsibility, so we prefer [_document over do_](https://github.com/mainmatter/ember-vite-codemod/blob/main/README.md#linter).

## What to start with?

Upgrading a classic Ember app to Vite requires moving, renaming, and changing a certain number of files. Since we want the new build system to work from `3.28` to the latest Ember (`6.2` when I am writing this), there will surely be many challenges to face. The task sounds overwhelming. How to even start it?

### The happy path

Let's choose the perfect use case, which could be a good starting point for transforming the code. Perfect can have different meanings depending on the type of codemod we work on; for instance, it could mean the "most standard" case.

🐹 For ember-vite-codemod, let's define the perfect use case as a brand-new empty app generated with `ember new` and initialized with the latest version of Ember. This means the app is completely up to date with modern practices and has no customization, so it's the most basic case we should handle, then we keep building upon it.

### The mirror view

Once we have identified the perfect use case, let's look at it and what we want instead. Let's put the initial code and the result side by side using a "diff viewer" tool to get a better picture of what we must achieve.

🐹 For ember-vite-codemod, we are working at the scale of a whole application, so we can use a tool like [Beyond Compare](https://www.scootersoftware.com/). This kind of software can compare entire folder scaffolding; we can see what files exist on the left and the right, and by clicking on a file, we have the content diff. It's a very practical approach: we run the codemod on the classic app displayed on the left, refresh the view, and if there is no more diff (or let's say expected diff only), then we win.

An example of mirror view for `app/app.js`:

![On the left is the content of app/app.js in the classic 6.2 app. On the right is the content of app/app.js in the Vite app](/assets/images/posts/2025-03-07-ember-vite-codemod/compare-app-js.png)

This approach can be combined with git features: Make two custom commands or shortcuts that allow you to almost instantaneously run the codemod, then reset the state of the classic app to HEAD, to remove everything the codemod has done. By alternating the commands and using a JavaScript Debug Terminal console, we get a comfortable enough workflow.

### The transform

Once you have a good vision of where you are and where you want to go, you must decide the best way to transform the code. Here are a few leads.

#### A simple text replacement

If your use case is somewhat "static", and you want to turn very specific strings into other strings, then maybe you can go with basic JavaScript functions like `replace` and `replaceAll`, and why not look at `RegExp` (regular expressions) as well.

🐹 For ember-vite-codemod, we decided to go with this approach for a few files like `index.html`. We want to replace specific URLs and script tags with new virtual URLs and inline scripts.

#### The AST structures

If the piece you want to transform is embedded into complex and potentially customized code, and the way to identify it and rewrite it relates to the code grammar, then [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) is the way to go. An AST is a data structure representing a program as a node tree. If you are a beginner, this [Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-introduction) has good explanations to start with (Babel is just one tool relying on AST, but the principle can apply to other contexts like ESLint rules, etc). The tool [AST Explorer](https://astexplorer.net) is a "must-use" to work with AST; you can copy-paste any valid code there and select the parsers you want to use to see the corresponding AST.

🐹 For ember-vite-codemod, most of the `js` files changed by the codemod are transformed using AST. We went with the library [recast](https://github.com/benjamn/recast) and implemented the following steps:

- Read the file with node fs.
- **Parse** the code content with recast.
- **Change** the AST with recast builder features.
- **Print** the new AST with recast.
- Rewrite the file with node fs.

#### Git commands

This insight is more about blueprints than codemods. If you expect your users to work with git, there are also ways to explore here. Investigating how frameworks and lib initializers prompt you for blueprint options and offer to edit when your existing files conflict with the blueprint can be interesting, depending on your context.

🐹 For ember-vite-codemod, we didn't go in that direction really. One thing we do though is to check the git repository is clean before executing anything else. Since the codemod modifies the app code, it's way better to start with a clean repository to easily compare changes and take a step back if something goes wrong.

## The way back to Ember 3.28

We implemented the first iteration of the codemod using a freshly generated Ember 6.2 app. We want Ember 3.28 apps to build with Vite, so we need a strategy to go all the way back. To achieve this, we used tests and CI.

The idea is that we have a CI job that runs a vitest test called [`all-versions.test.js`](https://github.com/mainmatter/ember-vite-codemod/blob/main/tests/all-versions.test.js). This test:

- Generates a new Ember app for each Ember version we want to support.
- Creates an acceptance test so that when the app tests run, it builds and visits the home page.
- Runs the tests to check they pass when the app builds with Broccoli.
- Runs the codemod.
- Runs the tests once more to check they still pass now that the app should build with Vite.

All the versions we _want to support_ are commented out, and all the versions we _do support_ are run:

```
const testVersions = [
  // ['ember-cli-3.28'],
  // ['ember-cli-4.12'],
  // ['ember-cli-4.4'],
  // ['ember-cli-4.8'],
  // ['ember-cli-5.4'],
  // ['ember-cli-5.8'],
  ['ember-cli-5.12'],
  ['ember-cli-latest'],
];
```

<br />

Having the first version of the codemod released is a great achievement for the start of the Ember Initiative. Now we have a clear path to follow to support all versions back to 3.28. Also, there is one case we want to _do over document_, which is the apps building with `@embroider/webpack`. Adding more support to the codemod is our next focus, so everyone can move to Vite as easily as possible.

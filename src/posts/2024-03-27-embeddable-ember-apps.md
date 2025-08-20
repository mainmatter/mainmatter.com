---
title: "Embedding an Ember App with Webpack"
authorHandle: bobrimperator
tags: [ember]
bio: "Software Developer"
description: "Bartlomiej Dudzik shows how to make an Ember App embeddable in non-Ember projects."
og:
  image: /assets/images/posts/2024-03-27-embeddable-ember-apps/og-image.png
image: /assets/images/posts/2024-03-27-embeddable-ember-apps/header.jpg
tagline: |
  <p>Taking a look at making an Ember app embeddable in non-Ember projects and allowwing for communication between both apps. Showing how to wrangle Webpack, Ember's build systems and their caveats.</p>
imageAlt: Embeddable Ember Apps image
---

#### What we're working with

We'll make a simple Ember to-do app (what else could it be :)) that's then loaded inside another non-Ember app. Use cases may vary, but probably the two most common ones are a widget that requires visualizing data like maps or micro-frontends that may need to share data between each other.

The goal of this post is to show how to wrangle Ember's build system and how a potential integration between applications could look like.

The easiest approach for making the app embeddable would be to bundle its scripts into single JS and CSS files. This is an additional build step we have to handle manually as, by default, Webpack splits code into chunks, and while that could be disabled, the Ember-cli itself also always splits code into `vendor.js` and `app.js` files. In the "old Ember" we'd use a tool such as `ember-cli-concat` to do that, but with Embroider, we need to take care of things through Webpack.

The end goal is to be able to include a script like so:

```html
<script src="https://ember-todo-test.onrender.com/bundle.js"></script>
```

and once loaded use it like so:

```javascript
const app = new window.MyEmbeddedApp(htmlElement, options);
await app.start();
```

##### Combining JS

This, in my opinion, is the most complicated step and unfortunately for the wrong reasons. When you're working with Ember, you yourself define and import files as ES6 modules. During build, they are then compiled as AMD modules, meaning that your application needs to bring a `requirejs` runtime with it.

What it means for us is that we need to make sure that the `requirejs` runtime is the very first thing in the bundle file. Ember apps provide that inside the `vendor.js` script that precedes the other scripts inside an `index.html` entry point.

A few Webpack plugins do concatenation, but there's nuance to handling concatenation, because we must ensure that the `vendor.js` file is at the top and is processed first. For this reason, I recommend rolling out your own.

The Webpack plugin needs to:

- run after compilation is finished,
- lookup all the js files it produced,
- sort files so `vendor` is first (the order of other files and chunks doesn't matter),
- concatenate contents of all the JavasSript files into a single file.

```js
const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

class FileConcatenationPlugin {
  constructor(options) {
    this.options = {
      destination: undefined,
      source: undefined,
      ...options,
    };
  }

  apply(compiler) {
    let webpackOutputPath = compiler.options.output.path;
    this.destinationFilePath = path.join(
      webpackOutputPath,
      this.options.destination
    );
    this.sourceFilesGlob = path.join(webpackOutputPath, this.options.source);

    compiler.hooks.done.tapPromise(
      "FileConcatenationPlugin",
      this.run.bind(this)
    );
  }

  async run(_compilation) {
    let inputFiles = await this.performGlobSearch(this.sourceFilesGlob);
    let filteredFiles = inputFiles.sort(a => {
      if (a.includes("vendor")) {
        return -1;
      }
      return 0;
    });

    console.log(filteredFiles);
    let allInputFileContents = "";
    for (let inputFilePath of filteredFiles) {
      let inputFileContents = await fs.readFile(inputFilePath);
      allInputFileContents += "\n";
      allInputFileContents += inputFileContents;
      allInputFileContents += `//# ${inputFilePath}`;
      allInputFileContents += "\n";
    }

    await fs.writeFile(this.destinationFilePath, allInputFileContents);
  }

  performGlobSearch(globStr) {
    return new Promise(resolve => {
      glob(globStr, null, function (er, files) {
        resolve(files);
      });
    });
  }
}
```

Now `ember-cli-build` needs to be configured:

- set `storeConfigInMeta` to `false` so configuration is defined in `config/environment.js` is embedded directly with the application code as opposed to the default behavior where your configuration would be a part of some separate tag inside `index.html`,
- use our defined plugin,
- (optionally) set the Embroider static flags.

```js
// ember-cli-build.js
const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const { Webpack } = require("@embroider/webpack");

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    storeConfigInMeta: false,
  });

  return require("@embroider/compat").compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    packagerOptions: {
      webpackConfig: {
        plugins: [
          new FileConcatenationPlugin({
            source: "**/*.js",
            destination: "bundle.js",
          }),
        ],
      },
    },
  });
};
```

##### Combining CSS

My recommendation is to opt out of the default styles CSS handling that Ember provides and do it on our own. The reason being that `ember-cli` doesn't seem to be using Webpack directly and it's not straightforward to know how and when to concatenate them.

Luckily, a basic PostCSS setup isn't scary and is more common nowadays, and even recommended.

First, let's define the styles:

- install packages `npm install postcss-loader mini-css-extract-plugin -D`,
- create an `app.css` file in the `app` directory - on the same level as `app.js`,
- scope the styles to `.ember-todo-test` to avoid style collisions with projects that embed the app (especially if you plan to use tools such as tailwind).

```css
/* app/app.css */

.ember-todo-test li {
  color: red;
}
```

Updated `ember-cli-build.js`:

```js
// ember-cli-build.js
const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const { Webpack } = require("@embroider/webpack");

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    storeConfigInMeta: false,
  });

  return require("@embroider/compat").compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    packagerOptions: {
      webpackConfig: {
        entry: {
          bundle: [path.resolve(__dirname, "app/app.css")],
        },
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: [
                {
                  loader: "postcss-loader",
                },
              ],
            },
          ],
        },
        plugins: [
          new FileConcatenationPlugin({
            source: "**/*.js",
            destination: "bundle.js",
          }),
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ],
      },
    },
  });
};
```

_If you're interested in a full tailwind setup, tailwindcss's official documentation has an excellent [tutorial](https://tailwindcss.com/docs/guides/emberjs). Only a tiny amount of extending what I've already shown is needed._

#### Booting up the application on our own terms

The application is only a few lines of code living inside `application.js`, `application.hbs` and `app.js` - there's also a `todo-list.gjs` that I won't show in this post in order to save some space, but you'll find a link to the rest of the code at the bottom.

```js
import Controller from "@ember/controller";
import { getOwner } from "@ember/application";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  @tracked todos = [];

  get config() {
    return getOwner(this).lookup("config:embedded");
  }

  receiveTodos = todos => {
    this.todos = todos;

    // Calling callback of a fake event handler.
    this.config.onTodosChanged?.(todos);
  };
}
```

```html
{% raw %}
<!-- templates/application.hbs -->
<div class="ember-todo-test">
  <TodoList
    @todos="{{this.todos}}"
    @onChange="{{this.receiveTodos}}"
    @canRemoveTodos="{{this.config.canRemoveTodos}}"
  />
</div>

{{outlet}} {% endraw %}
```

Some of the last shenanigans can be found in the `app.js` file. The only change that the default `app.js` has is the `autoboot = false` option. It makes sure that the app won't boot by default where usually it'd attempt to load and mount itself to `body` or `rootElement` configuration found in `config/environment.js`.

Below it, we add a `MyEmbeddedApp` class wrapper. Its job is to take over the App initialization as well as serve as a communication layer between the App and whoever uses it.

There's probably a few different ways to organize this. Here, for simplicity, the wrapper talks to the `application` controller directly, but, if you have a more complicated use case, you could use services, proper events, and such to do the job.

```js
import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "ember-todo-test/config/environment";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
  // Disable the autoboot of the Ember app.
  autoboot = false;
}

loadInitializers(App, config.modulePrefix);

class MyEmbeddedApp {
  #application;
  #appInstance;

  options;

  constructor(element, options = { canRemoveTodos: true }) {
    this.#application = App.create({ rootElement: element, autoboot: false });
    // Register the configuration options in the Ember's DI.
    // Mimics the behavior of resolving the `config/environment.js` i.e. resolveRegistration('config:environment').
    this.#application.register("config:embedded", options, {
      instantiate: false,
    });
    this.options = options;
  }

  async start() {
    // Boot the Ember app.
    // Visit the application route.
    const appInstance = await this.#application.visit("/");
    this.#appInstance = appInstance;

    return this;
  }
}

// Register the `MyEmbeddedApp` to the global object.
(function registerToGlobal() {
  let theGlobal;
  if (typeof window !== "undefined") {
    theGlobal = window;
  } else if (typeof global !== "undefined") {
    theGlobal = global;
  } else if (typeof self !== "undefined") {
    theGlobal = self;
  }

  const globalName = "MyEmbeddedApp";
  if (!theGlobal[globalName]) {
    theGlobal[globalName] = MyEmbeddedApp;
  }
})();

// Usage:
// a = new window.MyEmbeddedApp(document.querySelector('body'), { canRemoveTodos: true })
// a.start();
```

#### Build, Deploy and Use

Now the App can be built: run the build script as usual `npm run build` and deploy the `dist` to your static server or publish as an npm package.

Then add `script` and `link` tags pointing to the deployed bundles and initialize the App.

In this [Embeddable Demo](https://svelte-todo-13xa.onrender.com), the app is initialized when a `<div>` element is inserted. The app is initialized twice with different configurations; one configuration allows to remove items, the other doesn't. Also, both configurations set up a callback that will be called when to-do items have changed and will then display their count.

```html
{% raw %}
<script>
  import { onMount } from 'svelte';
  let removableTodosCount = 0;
  let nonRemovableTodosCount = 0;
  let isEmbeddedAppReady = false;
  let loadedEmbeddedAppCb;

  new Promise((resolve) => {
    loadedEmbeddedAppCb = resolve;
  }).then(() => {
    isEmbeddedAppReady = true;
  });

  onMount(() => {
    const script = document.createElement('script');
    script.onload = loadedEmbeddedAppCb;
    script.src = 'https://ember-todo-test.onrender.com/bundle.js';
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://ember-todo-test.onrender.com/bundle.css';
    document.head.appendChild(link);
  });

  async function bootEmbeddedApp(node, { canRemoveTodos, onTodosChanged }) {
    let options = {
      canRemoveTodos,
      onTodosChanged
    };

    const app = new window.MyEmbeddedApp(node, options)

    await app.start();

	return {
		destroy() {
			// the node has been removed from the DOM
		}
	};
  }
</script>

{#if isEmbeddedAppReady}
  <div use:bootEmbeddedApp={{ canRemoveTodos: true, onTodosChanged: (todos) => removableTodosCount = todos.length }} id="embedded-app-1">
    App with removable todos ({removableTodosCount})
  </div>

  <div use:bootEmbeddedApp={{ canRemoveTodos: false, onTodosChanged: (todos) => nonRemovableTodosCount = todos.length }} id="embedded-app-2">
    App without removable todos ({nonRemovableTodosCount})
  </div>
{:else}
  Loading...
{/if}
{% endraw %}
```

![Final result](/assets/images/posts/2024-03-27-embeddable-ember-apps/ember-todo-test.mp4#video)

#### Considerations

- The embeddable app is initialized under the assumption that the script was already loaded beforehand, making it difficult when loading asynchronously. Instead of providing and using the bundles directly, it could be a good idea to create a tiny wrapping script whose only job is to append script tags and expose a promise or hook to notify that they're loaded.
- Depending on the use case, an iframe could be simpler. On the other hand, this approach gives the most flexibility when it's necessary to allow manipulating the embedded app at runtime.

#### Summary

Embedding an Ember app isn't impossible or super hard but it is quirky, requiring understanding and working through the nuances of the build step responsibilities. Currently, the Embroider build feels like Webpack with Ember-cli on top, where we have both old and new systems to be mindful of when building the app.

However, there is a future where this will become much easier! The [Embroider Initiative](/ember-initiative/) is working its way towards full Vite support which should relief Ember from using the AMD format and allow for a much easier process where bundler users would only import that single class which initializes the App.

#### Resources

- [Github Repository](https://github.com/BobrImperator/my-blogposts)
- <https://api.emberjs.com/ember/release/classes/application>
- <https://guides.emberjs.com/release/configuring-ember/embedding-applications>
- <https://web.dev/articles/iframe-lazy-loading>
- <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#async>
- <https://webpack.js.org/api/module-methods/#require-amd-version>
- <https://tailwindcss.com/docs/guides/emberjs>

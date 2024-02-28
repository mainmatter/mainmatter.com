---
title: "Embedding an Ember App with webpack"
authorHandle: BobrImperator
tags: [ember]
bio: "Software Developer"
description:
  "Bartlomiej Dudzik shows how to make an Ember App embeddable in other
  projects."
og:
  image: /assets/images/posts/2021-12-08-validations-in-ember-apps/og-image.jpg
tagline: |
  <p>Taking a look at making Ember Apps embeddable.</p>
imageAlt: Embeddable Ember Apps image
---

#### What we're working with

We'll make a simple Ember Todo App (what else could it be :)) that's then loaded
in another non-Ember app.

_If your requirement is to also make that part Embeddable inside another Ember
app, you should consider extracting that chunk into an Addon, publish it so it
can be used in other apps as well as in the Embeddable wrapper._

The easiest, the most flexible approach for making the app embeddable would be
to bundle everything into a single JS file and a single CSS file. In the "old
Ember" we'd use a tool such as `ember-cli-concat` to do that, with Embroider we
need to take care of things through webpack however.

##### Combining JS

This in my opinion is the most complicated step and unfortunately for the wrong
reasons. When you're working with Ember, you yourself define and import files as
ES6 modules. During build they are then compiled as AMD modules, meaning thaty
our application needs to bring a `requirejs` runtime with it.

What it means for us is that we need to make sure that the `requirejs` runtime
is the very first thing in the bundle file. Ember apps provide that inside the
`vendor.js` script that preceeds the other scripts inside an `index.html`
entrypoint.

There are a couple webpack plugins that do concatenation but there's a little
specific nuance such as the order of concatenation or outdated webpack version
hence I recommend rolling out your own.

The Webpack plugin needs to

- run after compilation is finished
- lookup all the js files it produced
- sort files so `vendor` is first (the order of other files and chunks doesn't
  matter)
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

- set `storeConfigInMeta` to false so configuration defined in
  `config/environment.js` is embedded directly with the application code as
  opposed to the default behavior where your configuration would be a part of
  some separate tag inside `index.html`.
- use our defined plugin
- (optionally) set the Embroider static flags

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

##### Combining css

Applications rarely come unstyled and while this application will have almost
none, this is also a rather non obvious step that is otherwise complicated if
not setup correctly.

My humble recommendation is to opt out of the default styles CSS handling that
Ember provides and do it on our own. Reason being that unfortunately `ember-cli`
doesn't seem to be using Webpack directly and it's not straightforward to know
how and when to concatenate them.

Luckily a basic postcss setup isn't scary and is more common nowadays and even
recommended.

First lets define the styles:

- install packages `npm install postcss-loader mini-css-extract-plugin -D`
- Create an `app.css` file in the `app` directory - on the same level as
  `app.js`
- Scope the styles to `.ember-todo-test` to avoid collisions with users
  (especially if you plan to use tools such as tailwind).

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

_If you're interested in a full tailwind setup, tailwindcss's official
documentation has an excellent
[tutorial](https://tailwindcss.com/docs/guides/emberjs). Only a tiny amount of
extending what I've shown is needed._

#### Booting up the Application on our own terms

The application is only a few lines of code living inside `application.js`,
`application.hbs` and `app.js` - there's also a `todo-list.gjs` that I won't
show in this post in order to save some space but you'll find a link to the rest
of the code at the bottom.

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

Some of the last shenanigans can be found in the `app.js` file. The only change
that the default `app.js` has is the `autoboot = false` option. It makes sure
that the app won't boot by default where usually it'd attempt to load and mount
itself to `body` or `rootElement` configuration found in
`config/environment.js`.

Below it we add a `MyEmbeddedApp` class wrapper. It's job is to take over of App
initialization as well as serve as a communication layer between the App and
whoever uses it.

There's probably a few way to organize this, here for simplicity the wrapper
speaks to the `application` controller directly but if you've a more complicated
use case you could use services, proper events and such to do the job.

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

Now the App can be built. Simply run the build script as usual `npm run build`
and deploy the `dist` to your static server or publish as an NPM package.

Then add `script` and `link` tags pointing to the deployed bundles and
initialize the App.

In this [Embeddable Demo](https://svelte-todo-13xa.onrender.com), the App is
initialized when a div is inserted. The App is initialized twice with different
configurations, one allows to remove items, the other doesn't. Also both pass a
callback that will be called when todos have changed and then it'll display
their count.

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

![Final result](/assets/images/posts/2024-02-27-embeddable-ember-apps/ember-todo-test.mp4#video)

#### Considerations

- The Embeddable App is initialized under the assumption that the script was
  already loaded beforehand, making it difficult when loading asynchronously.
  Instead of providing and using the bundles directly, it could be a good idea
  to create a tiny wrapping script which's only job is to append script tags and
  expose a promise or hook to notify that they're loaded.
- Depending on a use case an iframe could be simpler, on the other hand this
  approach gives the most flexibility when it's necessary to allow manipulating
  the Embedded app at runtime.

#### Summary

Making an Ember app isn't impossible or super hard but it is quirky, especially
considering the nuances about what build step takes what responsibility.
Currently the Embroider build feels like Webpack with Ember-cli on top, we've
both old and new system to be mindful of when building it. And frankly an idea
where I thought about extracting script paths from an already built `index.html`
isn't that bad :)

However, there is a future where this will become much easier! The Embroider
Initiative is working its way towards full Vite support which should relief
Ember from using the AMD format and allow for a much easier process where
bundler users would only import that single class which initializes the App.

Time will tell.

#### Resources

- [Repository](https://github.com/BobrImperator/my-blogposts)
- https://api.emberjs.com/ember/release/classes/application/
- https://guides.emberjs.com/release/configuring-ember/embedding-applications/
- https://web.dev/articles/iframe-lazy-loading
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#async
- https://webpack.js.org/api/module-methods/#require-amd-version
- https://tailwindcss.com/docs/guides/emberjs

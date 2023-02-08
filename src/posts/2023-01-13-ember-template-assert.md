---
title:
  "Building a template assertion Ember addon that removes itself from production"
authorHandle: nickschot
tags: ember
bio: "Nick Schot"
description:
  "Nick Schot explains how to build an Ember addon that completely removes
  itself from production builds."
og:
  image: /assets/images/posts/2022-12-09-sending-emails-from-the-edge-with-rust/og-image.jpg
tagline: |
  <p>Sometimes there is the need for development-time-only functionality, in this case in the form of an Ember addon. We'd like to build an addon that provides us with an <a href="https://api.emberjs.com/ember/4.6/functions/@ember%2Fdebug/assert">assert</a> template helper so that we can use these development time assertions in templates as well.</p>

image: "/assets/images/posts/2022-12-09-sending-emails-from-the-edge-with-rust/rust-mail-server.png"
imageAlt: ""
---

Ember's `assert` function can be helpful to add checks meant for developers to
make sure, for example, that the correct data is passed.

```javascript
assert("Must pass myArgument", myArgument !== undefined);
```

The `assert` statement by default runs only for development builds and is
completely stripped from production. This rather useful functionality does by
default not have an equal in an Ember template. This could be a useful addition
especially for template-only components, which have no JavaScript backing class.
As such we'll create this helper and use this as an opportunity to show how to
strip such an addon completely from production builds.

## The `assert` helper

The helper itself is quite minimal, since we only need to wrap the original
`assert` function provided by Ember in a helper. We can first use ember-cli to
generate a helper with `ember g helper assert`. In an addon this will generate 3
files. The file where our implementation will be `/addon/helpers/assert.js`, a
re-export that will make the helper discoverable by Ember apps
`/app/helpers/assert.js`, and a test file.

Note that from Ember 4.5 onwards it is also possible to use plain functions as
helpers, removing the need to wrap the function in a `helper()` call. For
backward compatibility reasons, however, we will keep it for now.

```javascript
// addon/helpers/assert.js

import { helper } from "@ember/component/helper";
import { assert } from "@ember/debug";

export default helper(function templateAssert([message, condition]) {
  assert(message, condition);
});
```

## Testing an assertion

Testing an assertion is slightly tricky, since by default an assertion will
cause an uncaught error which crashes the app (and tests). In order to prevent
this from happening we can add a custom `Ember.onerror` hook for our test and
handle the assertion error there. This will make our test look like the
following:

```javascript
test("it fails to render when the assertion is falsy", async function (assert) {
  assert.expect(1);

  Ember.onerror = error => {
    assert.strictEqual(
      error.message,
      "Assertion Failed: Some assertion message"
    );
  };

  await render(hbs`{{assert "Some assertion message" false}}`);
});
```

## Removing helper invocations from production using an AST-transform

In order to remove helper invocations from consuming app code, we will need to
add an AST-transform. In our case we'll specifically need to write a transform
for the `htmlbars-ast-plugin`, which turns `.hbs` template files into an AST.

### Setting up `htmlbars-ast-plugin`

To get started we'll need to add `ember-auto-import` to the dependencies of our
addon. After that we can add some configuration to the addon's `index.js` file
to tell ember-cli about our new AST transform.

```javascript
"use strict";

module.exports = {
  name: require("./package").name,

  options: {
    babel: {
      plugins: [require.resolve("ember-auto-import/babel-plugin")],
    },
  },

  setupPreprocessorRegistry(type, registry) {
    const plugin = this._buildPlugin();
    plugin.parallelBabel = {
      requireFile: __filename,
      buildUsing: "_buildPlugin",
      params: {},
    };
    registry.add("htmlbars-ast-plugin", plugin);
  },

  _buildPlugin() {
    const emberTemplateAssertTransform = require("./lib/ast-transform");

    return {
      name: "ember-template-assert",
      plugin: emberTemplateAssertTransform,
      baseDir: emberTemplateAssertTransform.baseDir,
      cacheKey: emberTemplateAssertTransform.cacheKey,
    };
  },
};
```

### Writing the AST transform

The next thing we want to do is make sure we remove all calls of `{{assert}}`
from the templates in production builds. If we do not remove these, apart from
shipping unnecessary code, Ember would also throw an error after we remove the
helper code itself from the build in the next step.

We can do this by writing a small visitor statement in the following format:

```javascript
"use strict";

module.exports = function emberTemplateAssertTransform(env) {
  let visitor = {};
  if (env.isProduction) {
    visitor = {
      MustacheStatement(node) {
        if (node.path.original === "assert") {
          return null;
        }
      },
    };
  }

  return {
    name: "ember-template-assert",
    visitor,
  };
};

module.exports.baseDir = function () {
  return __dirname;
};

module.exports.cacheKey = function () {
  return "ember-template-assert";
};
```

The important bit here is:

```javascript
visitor = {
  MustacheStatement(node) {
    if (node.path.original === "assert") {
      return null;
    }
  },
};
```

This will remove all Mustache statements (any template statement that has
handlebars syntax like `{{...}}`) with the name `assert`. Since we want to
remove all assert statements, there's no need to look at the arguments that are
passed in to the assert helper.

## Removing the helper code itself from production

In order to remove our addon files from production builds, we can rely on a
plugin for broccoli called `broccoli-funnel`. It will allow us to specify file
paths that need to be filtered from the addon's file tree. After adding the
`broccoli-funnel` dependency, we can modify `index.js` again to add the
following section:

```javascript
  treeForAddon(tree) {
    let Funnel = require('broccoli-funnel');

    let app = this._findHost();
    if (app.isProduction) {
      tree = new Funnel(tree, {
        exclude: ['helpers/assert.js'],
      });
    }

    return this._super.treeForAddon.call(this, tree);
  }
```

Of course, like the AST transform, we only want to remove the helper from the
build in production environments which we achieve by checking
`app.isProduction`. We can remove the file from the build by specifying
`exclude: ['helpers/assert.js]` which matches the file path of the helper itself
in the addon directory - `addon/helpers/assert.js`.

However, we also need to remove the helper re-export from the app folder -
`app/helpers/assert.js`. The very similar hook called `treeForApp` can be used
for this purpose. It handles everything in the `app` folder of your v1 Ember
addon.

Let's start with abstracting our existing addon tree filter code a bit to make
it reusable:

```javascript
_filterAssertHelper(tree) {
  let Funnel = require('broccoli-funnel');
  let app = this._findHost();

  if (app.isProduction) {
    tree = new Funnel(tree, {
      exclude: ['helpers/assert.js'],
    });
  }

  return tree
},

treeForAddon(tree) {
  return this._super.treeForAddon.call(this, this._filterAssertHelper(tree));
}
```

We now only need to add the following to also filter the re-export
`app/helpers/assert.js`.

```javascript
treeForApp(tree) {
  return this._super.treeForApp.call(this, this._filterAssertHelper(tree));
}
```

To verify that we have done the right thing we can use a package called
`broccoli-stew`. It provides a log utility that will output the tree it's passed
to the console.

By modifying the `_filterAssertHelper` function as follows:

```javascript
_filterAssertHelper(tree, treeName) {
  ...

  let log = require('broccoli-stew').log;

  return log(tree, {
    output: 'tree',
    label: `ember-template-assert ${treeName} tree`,
  });
},
```

We will receive output that looks like:

```shell
ember-template-assert app tree
└── .gitkeep
└── helpers/
   └── helpers/assert.js

ember-template-assert addon tree
└── .gitkeep
└── helpers/
   └── helpers/assert.js
```

If we run the app with `ember s --environment=production` the output should no
longer show our assert helper, meaning the helper was successfully removed from
the build.

## Conclusion

While this is a small example where the benefits of removal are limited, one can
think of more comprehensive debugging tools that benefit from being removed from
production builds. This will allow you to have useful dev-time tools without the
fear of increasing bundle size. At the same time we've created a small but
useful helper for template-only components that can help prevent incorrect usage
of these components.

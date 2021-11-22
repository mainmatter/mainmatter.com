---
title: Using npm libraries in Ember CLI
authorHandle: tobiasbieniek
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek introduces a mechanism for using arbitrary npm libraries in
  Ember CLI applications and explains how that works under the hood.'
tags: ember
og:
  image: /assets/images/posts/2017-02-13-npm-libs-in-ember-cli/og-image.png
tagline: |
  <p>tl;dr Use npm instead of Bower whenever you can!</p> <p>With Ember 2.11 we are now using the [<code>ember-source</code>][ember-source] module and no longer the <code>ember</code> [Bower][bower] package. In the upcoming Ember CLI 2.12 release, Bower will also no longer be installed by default and only install lazily when an addon requests it. All this indicates that from now on we should try to use npm packages instead of Bower whenever possible. This blog post will explain how we can do that and what options are available to us.</p>
---

## Status Quo

The way to import Bower libraries into your app consists of three major steps.
First we will have to install the library. We will use the popular
[Moment.js][moment.js] library as an example here:

```
bower install --save moment
```

Secondly we will import it into the Ember CLI build pipeline by adding the
following line to our `ember-cli-build.js` file:

```js
{% raw %}
app.import('bower_components/moment/moment.js');
{% endraw %}
```

This `import()` call tells Ember CLI to add the `moment.js` file to the
generated `vendor.js` file to make the `moment` global available to the app.

As we prefer to use ES6 imports instead of globals we will generate a so-called
"vendor shim" which essentially just wraps the global and provides us with a way
to import it as an ES6 module:

```
ember generate vendor-shim moment
```

Running this command will generate a `vendor/shims/moment.js` file that looks
like this:

```js
{% raw %}
(function () {
  function vendorModule() {
    'use strict';

    return { default: self['moment'] };
  }

  define('moment', [], vendorModule);
})();
{% endraw %}
```

This looks a little cryptic at first, but once you understand the individual
parts it starts to make sense.

The files that the Ember CLI build pipeline generates use the [Asynchronous
Module Definition][amd] (or shorter: AMD). The `define()` call in the code above
defines a new AMD module with the name `moment` and the return value of the
`vendorModule` function describes what the module exports, or what we can import
from that module in our own code. In this case we export an object with a
`default` property that contains the `moment` global. You can find more
information on "default exports" and ES6 modules in general in the
[Exploring ES6](http://exploringjs.com/es6/ch_modules.html) ebook.

To use this vendor shim we will have to `app.import()` it like we did with the
library itself:

```js
{% raw %}
app.import('vendor/shims/moment.js');
{% endraw %}
```

We are now able to use `import moment from 'moment';` in our Ember code.

## App vs. Addon

The above instructions work great for apps, but what about addons? The
`ember-cli-build.js` file for addons is only relevant for building the dummy app
of the addon, but not for any other app using the addon. That means we can't
just call `app.import()` in the `ember-cli-build.js` file like we did above.

The solution to that is using the [`included()`][included-hook] in the
`index.js` file of the addon:

```js
{% raw %}
included() {
  this._super.included.apply(this, arguments);
  this.import('bower_components/moment/moment.js');
  this.import('vendor/shims/moment.js');
}
{% endraw %}
```

Note that the `this.import()` method is only available starting with Ember CLI
2.7. You can easily polyfill it though if you want to support Ember CLI releases
below that. Have a look at the
[ember-simple-auth](https://github.com/simplabs/ember-simple-auth/blob/1ca4ae678b7be9905076762220dcd9fcb0f27ac0/index.js#L24-L39)
code to find out how to do it.

This seems to work fine now if we are just looking at the dummy app, but in
reality it will not work yet for any other apps. The reason for this is that the
`bower_components` folder above refers to the `bower_components` folder of the
"host app", not of the addon itself. That means we will have to
`bower install --save moment` into the host app itself and there are two ways to
do it:

- the lazy way: tell the users in the `README` file to install it like that
- the comfortable way: install it automatically for them using an Ember CLI
  blueprint

Since we want to make it as easy for our users as possible we will prefer the
second solution, which is not actually that hard to implement either. First we
will have to generate a blueprint that matches the package name of our addon. So
if our addon was called `ember-moment` we would run:

```
ember generate blueprint ember-moment
```

This will generate a `blueprints/ember-moment/index.js` file in which we will
have to implement two hooks:

```js
{% raw %}
module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addBowerPackageToProject('moment');
  },
};
{% endraw %}
```

The `normalizeEntityName` hook is usually used to e.g. read the name of the
route you want to generate with `ember generate route <routename>`. Since this
is the default blueprint which will be executed automatically when the our addon
is installed through `ember install ember-moment` we don't need this method and
have to overwrite it to make sure it does not complain about a missing name.

The `afterInstall` hook is the important part. The
[`addBowerPackageToProject()`](https://ember-cli.com/api/classes/Blueprint.html#method_addBowerPackageToProject)
method installs the `moment` Bower package into the application by adding it to
the host app `bower.json` file. That way the Moment.js files will be present in
the top level `bower_components` folder of the application instead of being
available only inside of the addon. Since the `addBowerPackageToProject()`
method returns a `Promise` we have to return it from the `afterInstall` hook to
make sure that Ember CLI waits for the installation to finish.

## npm vs. Bower

> &quot;What&#39;s bower?&quot;
> &quot;A package manager, install it with npm.&quot;
> &quot;What&#39;s npm?&quot;
> &quot;A package manager, you can install it with brew&quot;
> &quot;What&#39;s brew?&quot; ...
> <author>Stefan Baumgartner (@ddprrt)
> <a href="https://twitter.com/ddprrt/status/529909875347030016">5. November
> 2014</a></author>

In an effort to simplify the situation the Ember team decided to focus on npm in
the future. Bower support will still be available to support older addons for
now, but might be deprecated at some point. That means that we should modify our
`ember-moment` addon above to install Moment.js via npm instead of Bower.

Fortunately for us Moment.js is also distributed on npm so we can just
`npm install --save moment` instead of using Bower and we're done, right? Well,
not quite. Unfortunately for the time being things are a little more
complicated, but the Ember CLI team has plans to make it easier in the future.

Let's start with the simple part: Installing via npm instead of Bower. Instead
of using `addBowerPackageToProject()` to install Moment.js we can use the
[`addPackageToProject()`](https://ember-cli.com/api/classes/Blueprint.html#method_addPackageToProject)
method instead:

```js
{% raw %}
afterInstall() {
  return this.addPackageToProject('moment');
}
{% endraw %}
```

That was easy! So where is the problem now?

Remember how we called `this.import()` to import the `moment.js` file into the
build pipeline and the `vendor.js` file? The `import()` method currently only
works for files inside the `bower_components` and `vendor` folders, but not the
`node_modules` folder. This was done for reasons of build performance but might
change at some point in the future once other issues are resolved. As we cannot
simply import `moment` from the `node_modules` folder we have to find another
way for loading the newly installed dependency into the app.

At this point we could just stop and give up, but instead we will use a
workaround that "moves" the file into our `vendor` folder and import it from
there. Instead of actually moving it as part of the installation process though
we tell Ember CLI to move it automatically as part of the build process.

To implement this we will need the fundamental
[broccoli-funnel](https://github.com/broccolijs/broccoli-funnel) and
[broccoli-merge-trees](https://github.com/broccolijs/broccoli-merge-trees) npm
packages:

```
npm install --save broccoli-funnel broccoli-merge-trees
```

Next we will implement the `treeForVendor()` hook in our `index.js` file and
adjust the `moment.js` import in the `included()` hook to point to
`vendor/moment.js` instead:

```js
{% raw %}
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-moment',

  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/moment.js');
    this.import('vendor/shims/moment.js');
  },

  treeForVendor(vendorTree) {
    var momentTree = new Funnel(
      path.join(this.project.root, 'node_modules', 'moment'),
      {
        files: ['moment.js'],
      },
    );

    return new MergeTrees([vendorTree, momentTree]);
  },
};
{% endraw %}
```

Let me explain what we did here. The `vendorTree` argument holds the actual
content of our `vendor` folder as we can see it in our addon. Next we create a
new `Funnel` tree, which is a fancy way of saying: import files into the build
pipeline. Essentially we just lookup the `moment.js` file inside the
`node_modules/moment` folder of the host app and wrap that in a Broccoli tree.
The last step merges the `vendorTree` and the `momentTree` into a single tree
which now contains the `moment.js` file and our vendor shim for the `vendor`
folder.

If you want to learn more about Broccoli and how the build pipeline works I
recommend watching Estelle DeBlois explain it in her fantastic EmberConf talk:
[Dissecting an Ember CLI Build](https://youtu.be/hNwgp9alwKg).

Now that we've imported the `moment.js` file into our `vendor` tree we can
finally `import()` it in the `included()` hook and everything works again.

## npm dependencies

As we are using npm now we can also take advantage of the way that npm resolves
dependencies. That means instead of using a blueprint to install the npm package
into the host app we declare `moment` as a dependency of the addon instead in
our `package.json` file:

```js
{% raw %}on
{
  "dependencies": {
    "moment": "^2.17.1"
  }
}
{% endraw %}
```

Since npm deduplicates packages during installation we can not be certain about
the path where `moment` is actually installed though. We need to use a resolver
algorithm to find the file inside the `node_modules` folder. Fortunately Node.js
has that algorithm built-in and we can just use it through the
`require.resolve()` function. All we have to do now is modify the `momentTree`
code like this:

```js
{% raw %}
var momentTree = new Funnel(path.dirname(require.resolve('moment/moment.js')), {
  files: ['moment.js'],
});
{% endraw %}
```

Note that we are passing the path to the `moment` **folder**, not to the
`moment.js` file itself, to the `Funnel` constructor.

Everything should work fine now and we can remove the `ember-moment` blueprint
and the `moment` dependency from the host app again since that is now a
subdependency via `ember-moment`.

If you want to see these things applied to a real addon visit the code of the
[`ember-cli-moment-shim`](https://github.com/jasonmit/ember-cli-moment-shim)
addon and have a look at their `index.js` file. They do support fastboot too
though which makes the code a little more complicated compared to our simplified
example here.

## App vs. Addon again

Now that we have converted our `ember-moment` addon to use npm instead of Bower,
how could we do the same if we wanted to use Moment.js in our app directly
without an additional addon?

Unfortunately there is currently no perfect solution for this and the best way
is using an [in-repo-addon](https://ember-cli.com/extending/#in-repo-addons) for
that. You could for example generate a `ember-moment` in-repo-addon:

```
ember generate in-repo-addon ember-moment
```

and use the same code as above inside the `lib/ember-moment/index.js` file.

## Next: CommonJS and ES6 modules

Things get a little more complicated when you want to use npm packages that are
not distributed in a prebuilt form like Moment.js. If they instead export only
CommonJS modules or ES6 modules we will need to add a few more plugins to the
build pipeline to make this work and we will explain how to do that in a future
blog post.

[ember-source]: https://www.npmjs.com/package/ember-source
[bower]: https://bower.io/
[moment.js]: https://momentjs.com/
[amd]: https://github.com/amdjs/amdjs-api/blob/master/AMD.md
[included-hook]: https://ember-cli.com/api/classes/Addon.html#method_included

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

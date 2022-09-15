---
title: "Making your dynamic Ember components work with Embroider"
authorHandle: nickschot
tags: ember
bio: "Senior Software Engineer"
og:
  image: /assets/images/posts/2022-03-17-dynamic-components-embroider/og-image.png
description:
  "Nick Schot explains how to make dynamic component invocation work with
  Embroider's static analysis."
tagline: |
  <p><a href="https://github.com/embroider-build/embroider">Embroider</a> is the future for building Ember apps. It unlocks features like
  splitting code per route by statically analyzing your codebase and dependencies.
  But what if you are using an addon that relies on dynamic components? This blog
  post will outline how we converted <a href="https://github.com/mainmatter/ember-promise-modals">ember-promise-modals</a> to be compatible with
  Embroider's route-splitting feature. <a href="https://github.com/mainmatter/ember-promise-modals">ember-promise-modals</a> is an Ember addon
  that allows you to dynamically render modals from your javascript code.</p>
---

## What are dynamic components?

{% raw %} Dynamic components are components resolved at run-time rather than
hardcoding the component to use. Ember provides a component helper which takes
an argument that is the dasherized string representation of the component path:
`{{component "my-component"}}` or `{{component "folder/another-component"}}`.
This is great for addons like ember-promise-modals as in this case it allows us
to open a modal from javascript. {% endraw %}

```javascript
@service modals;

@action
confirm() {
  this.modals.open('my-component');
}
```

Internally ember-promise-modals uses the component helper to render these
modals.

## Then what is the problem?

In order to make Embroider's route-splitting feature, which enables per-route
optimized bundles with ideally only the components required for that route,
Embroider needs to be able to statically resolve components at build time. This
is not guaranteed with the component helper syntax. Hypothetically one could
receive the component name from an API call, meaning there is no way to know
this at build time.

Fortunately, Embroider provides a few tools for us to make this work.

## Making old addons work in your Embroider Optimized app using `packageRules`

`packageRules` are more of a compatability feature rather than being the ideal
solution. They provide a way to tell Embroider what it needs to do. The main use
case is for addons out of your control and/or addons that have not been updated
yet to be fully Embroider optimized. By default Embroider currently ships
`packageRules` for a few widely used addons so that they'll work out of the box.

Now let's see if we can make ember-promise-modals <= 2 work with Embroider
through `packageRules`.

If you have created an Embroider enabled app (for example through
`ember new my-app --embroider`) your `ember-cli-build.js` file will contain a
section that looks like this:

```javascript
const { Webpack } = require("@embroider/webpack");
return require("@embroider/compat").compatBuild(app, Webpack, {
  skipBabel: [
    {
      package: "qunit",
    },
  ],
});
```

In order to be able to use route-splitting, we'll first have to enable all of
Embroider's flags. Normally you would do this one by one, but in this case the
only problem we're going to run into is with the `staticComponents` flag.

```javascript
const { Webpack } = require("@embroider/webpack");
return require("@embroider/compat").compatBuild(app, Webpack, {
  staticAddonTestSupportTrees: true,
  staticAddonTrees: true,
  staticHelpers: true,
  staticComponents: true,
  skipBabel: [
    {
      package: "qunit",
    },
  ],
});
```

When now trying to run the app with ember-promise-modals, we'll run into a
compilation error.

```shell
Unsafe dynamic component: @modal._name in node_modules/ember-promise-modals/templates/components/modal.hbs
```

This means Embroider detected a call to the component helper with a variable
`@modal._name`. To try and resolve this, let's add a `packageRules` section for
the `EpmModal` component. This component takes a `@modal` argument which is an
object that also contains the `_name` property as shown in the error that
Embroider threw. We can tell Embroider that this argument represents a component
name. The layout of the component also needs to be explicitly passed.

```javascript
const { Webpack } = require('@embroider/webpack');
return require('@embroider/compat').compatBuild(app, Webpack, {
  ...
  packageRules: [
    {
      package: 'ember-promise-modals',
      components: {
        '<EpmModal />': {
          acceptsComponentArguments: ['@modal._name'],
          layout: {
            addonPath: 'templates/components/modal.hbs',
          },
        },
      },
    },
  ],
});
```

If we now run the app Embroider will no longer throw build-time errors and our
modal will work. An unfortunate side-effect of this setup is that it will not
result in the `<ExampleModal/>` component being split from the main bundle if
you enable route-splitting. In order to get that working we'll have to dig a
little deeper, but the `packageRules` approach is a good way to unblock a
project from using a fully enabled Embroider with addons that do not have full
Embroider support.

## Updating your addon or dynamically invoked components to be Embroider Optimized

In order to let Embroider know how to handle our dynamic modal component, we
need to use the `ensure-safe-component` helper that Embroider provides. This
helper will turn a component class into a component definition that can be
invoked in the template. If just the name of a component is passed, it will use
the old curly component resolver to get the component definition, but also throw
a deprecation warning that you'll need to pass the component class when using
Embroider. For comprehensive documentation see:
[Replacing the Component Helper](https://github.com/embroider-build/embroider/blob/5fd49b50dd82bf7ceb6adeefa12efc2b85f92cd2/REPLACING-COMPONENT-HELPER.md)

In ember-promise-modals dynamic modal components are internally invoked with the
component helper as follows:

```handlebars
{% raw %}
{{component @modal._name data=@modal._data close=(action "close")}}
{% endraw %}
```

The relevant bit for us here is the first argument `@modal._name` which is the
name of the modal component, say `example-modal`. We can wrap this with the
`ensure-safe-component` helper that Embroider provides like this:

```handlebars
{% raw %}
{{component
  (ensure-safe-component @modal._name)
  data=@modal._data
  close=(action "close")
}}
{% endraw %}
```

Or if we want to use angle bracket syntax:

```handlebars
{% raw %}
{{#let (component (ensure-safe-component @modal._name)) as |ModalComponent|}}
  <ModalComponent @data={{@modal._data}} @close={{action "close"}} />
{{/let}}
{% endraw %}
```

The other thing we need to change is the way we pass the component to
ember-promise-modals in our app. We are currently still passing the
`<ExampleModal/>` component as a dynamic string.

```javascript
@service modals;

@action
confirm() {
  this.modals.open('example-modal');
}
```

If we were to start our app now (with `staticComponents: false`), we would get
the following deprecation message:

```
DEPRECATION: You're trying to invoke the component "example-modal"
 by passing its name as a string. This won't work under Embroider.
[deprecation id: ensure-safe-component.string] See https://github.com/embroider-build/embroider/blob/master/ADDON-AUTHOR-GUIDE.md#when-youre-passing-a-component-to-someone-else for more details.
```

We can update our app code to actually import the component class so that
Embroider can statically resolve this component. This will also make the
deprecation message disappear. Note that this will _only_ work for co-located
components or classic components that explicitly have their template definition
set on the component class using `layout`.

```javascript
import ExampleModal from '../components/example-modal';

...

@service modals;

@action
confirm() {
  this.modals.open(ExampleModal);
}
```

After re-enabling `staticComponents: true`, the last thing we need to do is
enable route-splitting in our app. This can be done by modifying the `router.js`
file to use `@embroider/router`...

```javascript
// app/router.js

//import EmberRouter from '@ember/routing/router';
import EmberRouter from "@embroider/router";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
```

...and by configuring the `splitAtRoutes` feature in `ember-cli-build.js`. We
can do this by adding the route names we want to split or by providing a regex.
Our full configuration will now look like this:

```javascript
const { Webpack } = require("@embroider/webpack");
return require("@embroider/compat").compatBuild(app, Webpack, {
  staticAddonTestSupportTrees: true,
  staticAddonTrees: true,
  staticHelpers: true,
  staticComponents: true,
  skipBabel: [
    {
      package: "qunit",
    },
  ],
  splitAtRoutes: ["my-page"],
});
```

If we now start our Embroider enabled app, we will see that our
`<ExampleModal/>` component is in a separate javascript chunk which is
dynamically loaded when the route where it is invoked is opened by the user.

## Conclusion

Even if you're still using addons that are not fully Embroider compatible, you
might still be able to make them work by utilizing the `packageRules`
configuration option. For properly updating an addon that requires dynamic
components we can use `ensureSafeComponent` to make them compatible with
Embroider and unlock the route-splitting feature.

[contact]: /contact/

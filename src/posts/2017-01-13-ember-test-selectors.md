---
title: New features for ember-test-selectors
authorHandle: tobiasbieniek
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek announces new features in ember-test-selectors such as
  automatic binding of data-test-* properties and how these are stripped in
  production.'
topic: ember
---

In March 2016 we have released the first version of
[ember-test-selectors](https://github.com/simplabs/ember-test-selectors) and
today we are proud to present you our next milestone: `0.1.0`.

While `0.1.0` does not sound like much has changed, the addon has actually
gained a lot of new functionality and should be considered our release candidate
for `1.0.0`.

This blog post will highlight the major changes in this release, and will give
you a short introduction into _how_ we have implemented these new features.

<!--break-->

## Automatic binding of `data-test-*` properties

As you may know from our
[previous blog post](/blog/2016/03/04/ember-test-selectors) on this topic, the
goal of this addon is to let you use attributes starting with `data-test-` in
your templates:

```handlebars
{% raw %}
<article>
  <h1 data-test-post-title>{{post.title}}</h1>
  <p>{{post.body}}</p>
</article>
{% endraw %}
```

... so that you can use these as selectors in your acceptance and integration
tests:

```js
assert.equal(find(testSelector('post-title')).text(), 'my first blog post');
//           find( '[data-test-post-title]' )
```

While this worked well on HTML tags, using the same pattern on components was a
little more complicated. The assigned `data-test-*` properties needed to be
bound to HTML attributes by adding them to the `attributeBindings` array on the
component class.

One of the major changes in this new release is that modifying the
`attributeBindings` array is now done automatically for you, so that you can
just assign `data-test-*` properties in your templates and they will
automatically appear on the `<div>` tag wrapping the component:

```handlebars
{% raw %}
{{comments-list data-test-comments-for=post.id}}
{% endraw %}
```

```html
<div id="ember123" data-test-comments-for="42">
  <!-- comments -->
</div>
```

### How we implemented this

Since we wanted to make this feature available on all components by default we
had to `reopen()` the `Ember.Component` class, figure out the list of
`data-test-*` properties on the component, and then add them to the
`attributeBindings` array.

The natural way to do this within an addon is using an
[initializer](https://guides.emberjs.com/v2.10.0/applications/initializers/), so
that is what we
[did](https://github.com/simplabs/ember-test-selectors/blob/v0.1.0/addon/initializers/ember-test-selectors.js#L5-L10).
Instead of putting all the logic in the initializer itself, we have extracted it
into a
[`bindDataTestAttributes()`](https://github.com/simplabs/ember-test-selectors/blob/v0.1.0/addon/utils/bind-data-test-attributes.js)
function, which we were now able to
[unit test](https://github.com/simplabs/ember-test-selectors/blob/v0.1.0/tests/unit/utils/bind-data-test-attributes-test.js)
separately.

As we are committed to not including any unnecessary code in your production
builds, we also had to make sure to not include the initializer and utility
function in there. Since both of those are part of our `addon` and `app`
folders, which are included in your builds by default, we borrowed a
["trick"](https://github.com/ember-cli/ember-cli-chai/blob/master/index.js#L119-L123)
from [ember-cli-chai](https://github.com/ember-cli/ember-cli-chai/) which only
includes both folders if we are in [testing mode](#testing-in-production-mode).

```js
module.exports = {
  // ...

  treeForAddon: function () {
    // only include our "addon" folder in the build if we're testing
    if (this.app.tests) {
      return this._super.treeForAddon.apply(this, arguments);
    }
  },

  treeForApp: function () {
    // only include our "app" folder in the build if we're testing
    if (this.app.tests) {
      return this._super.treeForApp.apply(this, arguments);
    }
  },
};
```

**UPDATE:** After releasing `0.1.0` we were notified that this feature was not
working for component integration tests, which was actually a pretty obvious
problem as initializers are not running for these kinds of tests. After thinking
about the issue for a few hours we came up with a solution that seems to work
even better now. Instead of calling `Component.reopen()` in an initializer we
are now doing it in a file in our `vendor` folder, which is always being run
before any tests are executed.

We have released `0.1.1` including this change and are now also warning you if
you try to use `data-test-*` attributes on tagless components.

## Stripping out `data-test-*` attributes in templates

Our initial goal with this library was stripping our `data-test-*` attributes
from HTML tags in your templates. In the previous section we implemented
automatic bindings for `data-test-*` properties on components now too, but these
properties were not stripped from the template yet.

To modify templates from within an addon our best bet was to use an
<abbr title="Abstract Syntax Tree">AST</abbr> transform on the Handlebars AST,
that we get from the template parser. This can be accomplished by registering a
Handlebars AST plugin in the
[`setupPreprocessorRegistry()`](https://ember-cli.com/api/classes/Addon.html#method_setupPreprocessorRegistry)
hook of the addon:

<!-- prettier-ignore -->
```js
module.exports = {
  // ...

  setupPreprocessorRegistry: function(type, registry) {
    if (type === 'parent' && !this.app.tests) {
      registry.add('htmlbars-ast-plugin', {
        name: 'strip-test-selectors',
        plugin: require('./strip-test-selectors'),
        baseDir: function() { return __dirname; }
      });
    }
  },
};
```

While this AST transform already existed in the previous releases, it was only
able to handle `data-test-*` attributes on HTML tags (called `ElementNode`), but
not on curly components yet:

```js
var TEST_SELECTOR_PREFIX = /data-test-.*/;

module.exports = class {
  transform(ast) {
    var walker = new this.syntax.Walker();

    walker.visit(ast, function (node) {
      if (node.type === 'ElementNode') {
        node.attributes = node.attributes.filter(function (attribute) {
          return !TEST_SELECTOR_PREFIX.test(attribute.name);
        });
      }
    });

    return ast;
  }
};
```

You can try out what this transform does in the
[AST explorer](https://astexplorer.net/#/5ZDpdTbKwL).

Fortunately for us the code to make this AST transform work for curly components
is very similar:

```js
if (node.type === 'MustacheStatement' || node.type === 'BlockStatement') {
  node.hash.pairs = node.hash.pairs.filter(function (pair) {
    return !TEST_SELECTOR_PREFIX.test(pair.key);
  });
}
```

If you try the same example template in the
[AST explorer](https://astexplorer.net/#/8wkrolD3V0), but with the modified
transform code, you will notice that the `data-test-comment-id=comment.id` part
of the `some-component` invocation is now gone.

## Stripping out `data-test-*` properties in JS files

While one way of assigning data attributes to a component is in the template,
data attributes can also be defined as properties on the component class. So
instead of assigning `data-test-comment-id` inside the loop:

```handlebars
{% raw %}
{{#each comments as |comment|}}
  {{comment-list-item comment=comment data-test-comment-id=comment.id}}
{{/each}}
{% endraw %}
```

... we could also use a computed property inside the component that mirrors
`comment.id`:

```js
export default Ember.Component({
  comment: null,
  'data-test-comment-id': Ember.computed.readOnly('comment.id'),
});
```

Unfortunately we have now have a property that is not stripped by the AST
transform described in the previous section. At this point we could have used a
similar strategy as before and added a JavaScript preprocessor, that strips all
those properties from the code, but instead we hooked into the existing
JavaScript processing pipeline using [Babel](http://babeljs.io/).

Fortunately for us the fantastic [AST explorer](https://astexplorer.net/) also
supports prototyping Babel plugins and so we came up with a simple
[plugin](https://astexplorer.net/#/xd5PB1rSD6) that basically just removes
`data-test-*` properties from all the objects in your code:

```js
var TEST_SELECTOR_PREFIX = /data-test-.*/;

module.exports = function (babel) {
  return new babel.Plugin('ember-test-selectors', {
    visitor: {
      Property: function (node) {
        if (TEST_SELECTOR_PREFIX.test(node.key.value)) {
          this.dangerouslyRemove();
        }
      },
    },
  });
};
```

With the Babel plugin done, all we had left to do was making sure that your app
actually uses that plugin at build time. While this is not quite public API and
may change in the future we have found a way to accomplish that in the official
[ember-cli-htmlbars-inline-precompile](https://github.com/ember-cli/ember-cli-htmlbars-inline-precompile/blob/v0.3.6/index.js#L64-L69)
addon:

```js
module.exports = {
  // ...

  included: function (app) {
    this._super.included.apply(this, arguments);

    // add the StripDataTestPropertiesPlugin to the list of plugins used by
    // the `ember-cli-babel` addon
    if (!app.tests) {
      app.options = app.options || {};
      app.options.babel = app.options.babel || {};
      app.options.babel.plugins = app.options.babel.plugins || [];

      app.options.babel.plugins.push(
        require('./strip-data-test-properties-plugin'),
      );
    }
  },
};
```

## Testing in `production` mode

In our previous releases we had offered an `environments` option to let you
choose when to strip attributes and when to keep them in the templates. The
default of this option was set to `['production']`, which made sense at the
time.

Since then we had discovered though that this will keep you from running your
tests in `production` mode using `ember test --environment=production`. Instead
of just checking the `environment` we are now making use of the
([not yet documented](https://github.com/ember-cli/ember-cli/issues/6656))
`tests` property on the `EmberApp` class in Ember CLI.

This property will be `true` when using the `development` environment with
either `ember build`, `ember serve` or `ember test`, or it will be `true` when
using `ember test --environment=production`. That makes sure that we still strip
all the `data-test-*` attributes from your code in production builds, but you
should now again be able to also test your production builds using test
selectors.

Since we previously offered an option to override our defaults, we were
committed to doing the same for the new defaults. For this we have deprecated
this existing `environments` option, and introduced a new `strip` option, which
can be set to `true` or `false`, but defaults to the `tests` property described
above:

```js
var app = new EmberApp({
  'ember-test-selectors': {
    strip: false,
  },
});
```

Note that using the `environments` option still works, but is deprecated and
will be removed by the time we release `1.0.0`.

## Simplified `testSelector()` import

The `testSelector()` helper function can be used to simplify building the
CSS/jQuery selector strings used for `find()` or `this.$()` in your tests.
Previously you had to import that function from
`<app-name>/tests/helpers/ember-test-selectors`, but since our `addon` folder is
now removed from the build in production we were able to simplify that import to
just this:

```js
import testSelector from 'ember-test-selectors';
```

We hope you enjoyed reading about our progress on this project and we would love
to get feedback on what else we can improve. Feel free to
[reach out](https://github.com/simplabs/ember-test-selectors/issues/new)!

**Note:** The code examples in this blog posts are simplified to be easier to
digest. Please refer to the
[actual implementation](https://github.com/simplabs/ember-test-selectors) if you
want to see all the glory details.

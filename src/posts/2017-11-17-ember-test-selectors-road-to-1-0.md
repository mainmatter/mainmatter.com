---
title: 'ember-test-selectors: The road to 1.0'
authorHandle: tobiasbieniek
bio: 'Senior Frontend Engineer, Ember CLI core team member'
description:
  'Tobias Bieniek goes through what happened in ember-test-selectors during the
  past year and what the roadmap towards a 1.0 release is.'
topic: ember
---

Back in January we wrote about the
[latest changes](/blog/2017/01/13/ember-test-selectors) in
[`ember-test-selectors`](https://github.com/simplabs/ember-test-selectors) and
how we implemented them. Since then we adjusted a few things and this blog post
should give you an idea what has happened so far and what else will happen
before we feel comfortable promoting the addon to v1.0.0.

<!--break-->

## v0.2.0: `data-test-*` attributes without values

In HTML it is possible to add attributes to an element that don't have a value:

```handlebars
{% raw %}
<h1 data-test-title>FourtyTwo</h1>
{% endraw %}
```

In Ember.js templates the same is possible for HTML elements, but for components
everything is a little different.

```handlebars
{% raw %}
{{user-list data-test-user-list users=users}}
{% endraw %}
```

The above snippet does compile, but instead of setting a `data-test-user-list`
property on the `user-list` component it will take the value of the
`data-test-user-list` property on the parent component and pass that as a
positional parameter to the `user-list` component.

In v0.2.0 of `ember-test-selectors` we introduced another Handlebars AST
transform which transforms all such valueless `data-test-foo` instances to
`data-test-foo=true` by default.

While that seems like a convenient thing, it has drawbacks and does not always
work as expected, as you can see in the following template:

```handlebars
{% raw %}
{{! works }}
{{user-list data-test-user-list users=users}}

{{! fails with cryptic parser error }}
{{user-list users=users data-test-user-list}}
{% endraw %}
```

The issue here is that Handlebars expects positional parameters in front of any
named parameters and will throw an error otherwise. It is common however to put
the more important things first in a component invocation which conflicts with
having to put the valueless `data-test-*` attributes first as seen above.

Due to these problems we believe it is best to be explicit about these
attributes and always declare them with a value:

```handlebars
{% raw %}
{{user-list users=users data-test-user-list=true}}
{% endraw %}
```

We will deprecate the usage of valueless `data-test-*` attributes on components
in an upcoming release and remove the transform completely for the v1.0.0
release.

## v0.3.0: Support for Babel 6

This year (2017) the Ember ecosystem finally moved from Babel 5 to Babel 6,
which happened mostly without issues for app developers as it was just a
dependency upgrade from `ember-cli-babel@5` to `ember-cli-babel@6`. Some app
developers might think they are still only using Babel 5 for their app, but it
is very likely that some of their addons are already using Babel 6 under the
hood since all Ember addons controls their own transpilation.

For addons that rely on Babel transforms the upgrade unfortunately was not quite
as smooth, as the Babel transforms API had changed significantly with Babel 6.

As `ember-test-selectors` relies on Babel transforms we needed to figure out a
solution to this problem. We wanted to support both Babel 5 and Babel 6 in the
same addon instead of having to publish two different variants of the addon each
targeting a different Babel version.

Fortunately at [EmberConf](http://emberconf.com/) in March we found a solution:
The addon now checks the dependencies of your project and figures out which
version of `ember-cli-babel` you use. Based on that information we inject
different Babel transforms into the build pipeline so that we can support both
major Babel versions with the same addon.

## v0.3.4: Support for test-selectors in nested addons

In April we were notified by [Luke Melia](https://github.com/lukemelia) that
test-selectors in templates in an addon that he extracted were stripped
unconditionally. It turned out that if `ember-test-selectors` was used as a
nested addon some of the build logic that we had in place was not working
properly.

A few days later Luke provided us with a repository that reproduced his problem.
Using his reproduction we have been able to fix the issue and it is now possible
to also use `ember-test-selectors` as a nested addon dependency and rely on
correct test-selector stripping depending on the build environment.

## v0.3.7: Deprecation of the `testSelector` helper function

A few weeks later [Kelly Selden](https://github.com/kellyselden) triggered a
[conversation](https://github.com/simplabs/ember-test-selectors/issues/121)
about the `testSelector` helper function in `ember-test-selectors`.

The purpose of the `testSelector` function is turning:

```js
let foo = testSelector('foo');
let bar = testSelector('bar', 'baz');
```

into:

```js
let foo = '[data-test-foo]';
let bar = '[data-test-bar="baz"]';
```

After discussing back and forth and coming up with
[alternative APIs](https://github.com/simplabs/ember-test-selectors/pull/122) we
decided the best way forward was actually to not use any helpers at all. This
has the advantage of not hiding the actual CSS selector that is being used and
requiring less knowledge of how `ember-test-selectors` works to understand what
any test code is doing.

Following the discussion we have deprecated the `testSelector` helper function
and will remove it before releasing v1.0.0. If you have used the function a lot
there is a third-party
[codemod](https://github.com/lorcan/test-selectors-codemod) that might be able
to save you a few minutes or hours by converting the code for you automatically.

## v0.3.8: Support for Ember 1.11 and 1.12

Only a few weeks ago [Chris Garrett](https://github.com/pzuraq/), better known
as @pzuraq, approached us about supporting Ember 1.11 and 1.12 in
`ember-test-selectors`. He was working on some projects that were started in the
early days of Ember and to be able to upgrade them confidently to a newer Ember
version he needed to write better tests. For those tests he wanted to use
test-selectors, but since they required a newer Ember version he was stuck in a
vicious circle.

It seemed that the main issue with Ember 1.11/1.12 support was that our template
AST transforms were failing and as a first attempt we simply disabled them
completely which resolved the problem. Unfortunately that meant that
test-selectors were no longer stripped at all from the templates which did not
seem like a good solution to us so we dug deeper.

Thanks to [ember-try](https://github.com/ember-cli/ember-try) it was very fast
and easy to try out our addon on many different Ember versions and we quickly
discovered that the Handlebars AST had changed between Ember 1.12 and 1.13 in a
way that caused our transforms to crash.

The AST for a template like:

```handlebars
{% raw %}
{{user-list data-test-user-list=true}}
{% endraw %}
```

looks roughly like this:

```kotlin
MustacheStatement {
  path: PathExpression {
    original: "user-list"
  }
  params: []
  hash: Hash {
    pairs: [
      HashPair {
        key: "data-test-user-list"
        value: BooleanLiteral {
          value: true
        }
      }
    ]
  }
}
```

but in Ember 1.12 it looks more like this:

```kotlin
MustacheStatement {
  path: PathExpression {
    original: "user-list"
  }
  sexpr: SymbolicExpression {
    params: []
    hash: Hash {
      pairs: [
        HashPair {
          key: "data-test-user-list"
          value: BooleanLiteral {
            value: true
          }
        }
      ]
    }
  }
}
```

As you can see the AST looks almost similar, but not exactly the same. In the
end we figured out we could check if the `MustacheStatement` has a `sexpr`
property, and in that case use the `hash` property inside of that instead.

Once we had that conditional in place all our tests were 🍏 again and we were
able to adjust our range of supported Ember versions all the way down to Ember
1.11.

## Conclusion

A lot of things have happened on the project this year and we will continue to
iterate forward on this. One exciting enhancement that we are looking into is
adding support for [glimmer.js](https://glimmerjs.com/) to the addon. This will
likely not be done by the time we release v1.0.0, but will be something for us
to work on in the next year.

If you have questions on how to best take advantage of test-selectors or how to
structure your tests in general make sure to [contact us](/contact/).

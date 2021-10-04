---
title: On Computed Properties vs. Helpers
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte discusses differences between computed properties and
  helpers and explains pros and cons of each alternative.'
topic: ember
og:
  image: /assets/images/posts/2017-03-21-on-computed-properties-vs-helpers/og-image.png
---

Ember's computed properties are a great mechanism for encapsulating reactive
logic and implementing consistent, auto-updating UIs. Since the past year or so
though, there seems to be an increasing tendency in the community to use
template helpers as the main tool for expressing this kind of logic right in the
templates. Following up on a
[talk I gave at last year's EmberFest](https://speakerdeck.com/marcoow/templates-and-logic-in-ember),
I'll elaborate in this post why I think that is often not the best choice and
what the drawbacks are.

<!--break-->

## Computed Properties

Computed Properties allow defining properties as functions of other properties.
Ember automatically re-evaluates computed properties (lazily) when any of its
dependents change so that they don't get out of sync.

Here's a simple example of a computed property that is `true` when the `age`
property is at least `65`:

```js
isSenior: computed('age', function () {
  return this.get('age') >= 65;
});
```

The `age` property is listed as a dependency of the `isSenior` property, thus
the `isSenior` property will be invalidated whenever the `age` property changes
and re-evaluated the next time it is accessed (unless it is used in a template
in which case the property is immediately re-evaluated so that the UI stays in
sync with the underlying data).

The `isSenior` property can then be used in a template (we're assuming it is
defined on the `user` here):

```hbs
{% raw %}
<p>
{{user.name}}
{{#if user.isSenior}}
  <small>(senior)</small>
{{/if}}
</p>
{% endraw %}
```

## Template Helpers

The above example **could just as easily be implemented using a template
helper**. Instead of defining the `isSenior` property with its dependents
upfront, one could define an `lte` helper like this:

```js
export default Ember.Helper.helper(function ([value, comp]) {
  return value >= comp;
});
```

and move the comparison into the template:

```hbs
{% raw %}
<p>
{{user.name}}
{{#if (lte user.age 65)}}
  <small>(senior)</small>
{{/if}}
</p>
{% endraw %}
```

## What's the difference?

Both alternatives are obviously very similar - both compare the user's `age`
property with a comparison value and depending on the outcome of that comparison
render some nodes to the DOM (or don't render them). The main difference is that
**with the computed property that comparison lives in the template context** and
is only invoked from the template (via the `isSenior` identifier) while **when
using a helper the comparison is defined inline right in the template** itself.

This might not seem like a big thing but there actually are some differences
between the two alternatives that have consequences on certain aspects of the
application.

### Separation vs. Unification

The main difference is that with the computed property solution, the logic and
its internals are separated from the template. The **logic lives in the template
context and appears as a black box to the template** which merely uses some
named properties - this is actually quite **similar to a class exposing named
methods** where the caller of these methods does not have to worry about their
internals as long as it's clear what they are supposed to be used for.

With the **template helpers solution though both the rendering as well as the
logic are merged in the template**. That means that understanding and
maintaining the template includes understanding all of the logic encoded in the
helper invocations.

While the complexity that's added to the template in the above example is fairly
limited of course, this point gets more obvious when looking at a slightly more
involved example. Assume there is a collection of users from which we want to
select a random one with a `status` of `'active'`. A computed property returning
such a user could look like this:

```js
userToDisplay: computed('users.@each.state', function () {
  let activeUsers = this.get('users').filterBy('state', 'active');
  return shuffle(activeUsers)[0];
});
```

Rendering that user's `name` then is as easy as using the `userToDisplay`
property in the template:

```hbs
{% raw %}
{{userToDisplay.name}}
{% endraw %}
```

Comparing this to a solution that moves all of the logic for selecting the user
into the template via helpers illustrates how much harder it becomes to
understand the template now:

```hbs
{% raw %}
{{#each (take 1 (shuffle (filter-by users 'state' 'active'))) as |user|}}
  {{user.name}}
{{/each}}
{% endraw %}
```

Instead of hiding this complexity behind a named interface all of it is right
there in the template and cannot be ignored as it can be when using a computed
property.

### Testability

Another consequence of **moving logic into the template is that the logic itself
becomes harder to test**. While logic that lives in the template context in the
form of computed properties is easily unit-testable, **logic that lives in the
template can only be tested by actually rendering the template** which again
leads to a few other consequences:

- Tests become slower to execute as it's obviously slower to render than not to
  render.
- Each test case becomes more complex. While unit tests can assert on the value
  of the computed property (e.g. `asser.equal(user.get('isSenior') true)`),
  (integration) tests for logic inside of templates have to assert on the
  presence or absence of DOM nodes (e.g.
  `assert.ok(find(testSelector('senior-flag')))`) which obviously is a much more
  indirect way of testing the same thing.
- Test cases (potentially) require more and unrelated context to be set up.
  While unit tests for computed properties only require the dependent properties
  of the computed property under test to be set up, rendering a template
  requires the full context for that template to be set up which might include
  elements that are unrelated to the current test case.

### Helpers don't always work as expected

One of the main reasons that we hear why people prefer template helpers over
computed properties is the fact that computed properties need to list their
dependent keys. **Especially newcomers to Ember.js are afraid of forgetting a
key or making a mistake** (especially when it comes to collections) which can
lead to hard to track down errors (see below for a potential fix for the need to
specify dependent keys at all). **Template helpers instead don't need to list
dependencies and are automatically re-executed** when any of their arguments
change. While that is true in most cases there are some edge cases where
**helpers might actually not work as expected**.

Consider a slightly modified version of the above example that compares the
user's `age` property with a comparison value:

```hbs
{% raw %}
{{#if (is-senior user)}}
  <small>(senior)</small>
{{/if}}
{% endraw %}
```

Here, the internals of the comparison logic have been moved into the `is-senior`
helper:

```js
export default Ember.Helper.helper(function ([user]) {
  return user.get('age') >= 65;
});
```

The problem with this solution is that the DOM does not get updated when the
user's `age` property changes. While arguments that are passed to helpers are
observed by Ember automatically and the **helper will be re-executed when any of
these arguments change to a different value, the same is not true when any
property on any of the arguments changes**. In this case changes of the user's
`age` property would go unnoticed and the DOM would get out of sync with the
underlying data.

### Performance

In general, **performance should be more or less on par for computed properties
and template helpers** in comparable scenarios. There's one slight difference
though in the way that helpers and computed properties work that can have
relevant performance implications though: **all arguments passed to helpers are
eagerly evaluated before the helper function is invoked**. This is a major
difference compared to computed properties actually.

Consider this example:

```hbs
{% raw %}
{{#if (and propA propB)}}
  both are truthy!
{{/if}}
{% endraw %}
```

Here, both `propA` and `propB` will be eagerly evaluated before being passed to
the `and` helper. Comparing this to the same logic implemented as a computed
property makes the difference clear:

```js
areBothTruthy: computed('propA', 'propB', function () {
  return this.get('propA') && this.get('propB');
});
```

As the `&&` operator will actually short-circuit execution when
`this.get('propA')` is false, `this.get('propB')` will never be evaluated in
these cases while both properties will always be eagerly evaluated when using a
helper. If calculating `propB` is a costly operation that is obviously not
desirable but something that cannot actually be prevented with template helpers.

## Pick one

As shown above there are many cases in which either computed properties or
template helpers can be used to implement the same functionality. There are
**some drawbacks though that template helpers come with while not actually
providing any additional value** in these scenarios.

We at simplabs prefer computed properties over template helpers in all of our
projects and are putting some effort in making computed properties better.
[ember-classy-computed](https://github.com/simplabs/ember-classy-computed) for
example introduces a mechanism for class based computed properties that is
actually quite similar to class based helpers. We are also currently
[experimenting with computed properties that automatically track their dependent keys](https://github.com/simplabs/ember-auto-computed)
which would obviously remove a lot of complexity and eliminate people's fear to
accidentally omit a dependency or specify a wrong one (besides that there could
even be performance improvements as there could be less invalidations).

There is also a **bunch of great computed property macro addons** like
[ember-cpm](https://github.com/cibernox/ember-cpm) by
[Miguel Camba](https://github.com/cibernox) and
[ember-awesome-macros](https://github.com/kellyselden/ember-awesome-macros) and
[ember-macro-helpers](https://github.com/kellyselden/ember-macro-helpers) by
[Kelly Selden](https://github.com/kellyselden) who has done a lot of great work
making computed properties easier accessible and more powerful recently. Check
out
[Kelly's talk on computed properties he gave at the recent Ember.js SF meetup](http://slides.com/kellyselden/the-world-of-ember-macros-and-how-to-create-your-own-2#/43).

### Pure Functions

One thing I hear a lot is that template helpers are better than computed
properties because helpers are (supposed to be) pure functions. While **pure
functions are great** and helpers are (unless you make a mistake) pure
functions, **computed properties are actually pure functions as well** so this
is not something that speaks for either of the alternatives.

For some context: a pure function is a function that only depends on its inputs
and will return the same value for the same inputs each time it is called. A
pure function also has no side effects. While this is true for helpers it is
obviously true for computed properties with the only distinction that **a
computed property's inputs are called its dependent keys**. Of course there's
also class based helpers whose whole purpose is to enable template helpers that
can depend on global state and thus are not pure functions (and the same concept
exists for computed properties with ember-classy-computed now).

### Original concerns of the template layer

The intention of this post is not to say template helpers are bad and computed
properties should be used for everything. That would be a pretty ignorant
statement to make. **There are original concerns of the template layer that are
best implemented in helpers** - typical examples being translating strings,
formatting numbers or dates etc. We use template helpers almost exclusively for
this kind of functionality which is usually only a small part part of any
application though - we often only have a few helpers defined even in pretty big
and involved applications.

### Missing a property context

There is one slightly more evolved scenario where computed properties cannot
easily be used instead of template helpers to achieve the same functionality.
That is when there is **no context the computed property could be defined on or
the context it would be needed on is unrelated to the template context**. One
example for this is a component that renders a list of items and keeps track of
which of these items is currently selected. The easiest way to do something like
that using template helpers would look something like this:

```hbs
{% raw %}
<ul>
  {{#each items as |item|}}
    <li class="{{if (eq selectedItem item) 'selected'}}">{{item}}</li>
  {{/each}}
</ul>
{% endraw %}
```

This isn't as straight forward to replace with a computed property as the
previous examples. While defining an `isSelected` property on the template
context isn't possible as the property is needed per item in the list, the
property can also not be defined on the items as the items have no notion of the
list component or how that keeps track of the selected element at all.

The solution to this problem is to construct a new context that has access to
both the item as well as the component:

```js
_listItems: computed('items.[]', 'selectedItem', function() {
  let selectedItem = this.get('selectedItem);
  return this.get('items').map((item) => {
    return {
      item,
      isSelected: item === selectedItem
    };
  });
})
```

The template iterates over this wrapper collection instead of the original
collection then:

```hbs
{% raw %}
<ul>
  {{#each _listItems as |listItem|}}
    <li class="{{if listItem.isSelected 'selected'}}">{{listItem.item}}</li>
  {{/each}}
</ul>
{% endraw %}
```

This pattern - **defining a wrapper context that combines two or more other
contexts** - should work in similar scenarios as well.

## Conclusion

Computed properties and template helpers are both valuable parts of the Ember
framework and **both have their use cases**. Being aware of which one is best
suited for which use case and what the consequences and drawbacks are when
picking either one is crucial for **preventing long term maintainability
issues**.

Computed properties are powerful already and will continue to improve with tools
like [ember-cpm](https://github.com/cibernox/ember-cpm),
[ember-awesome-macros](https://github.com/kellyselden/ember-awesome-macros),
[ember-macro-helpers](https://github.com/kellyselden/ember-macro-helpers) and
eventually perhaps computed properties that automatically track their
dependencies. Before turning towards a seemingly easier alternative, have a
close look at the consequences of your decision though.

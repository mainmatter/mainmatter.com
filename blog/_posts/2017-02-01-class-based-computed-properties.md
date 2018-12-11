---
layout: article
section: Blog
title: Class based Computed Properties
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
topic: ember
---

We think Computed Properties in Ember are awesome. We also think they [are in many cases the better alternative to template helpers](https://speakerdeck.com/marcoow/templates-and-logic-in-ember) as they allow for cleaner separation of where a computation is triggered and the implementation of that computation. In some cases though it is currently very hard to do things in Computed Properties (and Computed Property macros in particular) that are possible with Class based helpers. With the __introduction of Class based Computed Properties__ we're aiming at making these scenarios solvable easily.

<!--break-->

## Computed Properties and Computed Property Macros

Computed Properties are among the first things developers new to Ember learn. They are a great way of defining dependencies between data points in the application and __ensuring the UI stays consistent as these data points change__.

Ember comes with a set of macros that implement property logic that most applications need and allow for short and expressive definitions like

```js
isActive: Ember.computed.equal('state', 'isActive')
```

There are addons that provide even more macros for common use cases like [ember-cpm](https://github.com/cibernox/ember-cpm) or [ember-awesome-macros](https://github.com/kellyselden/ember-awesome-macros).

## Where Computed Property Macros fall short today

__Computed Properties are very similar to template helpers__ in the way that both are [pure functions](https://en.wikipedia.org/wiki/Pure_function) that can only depend on their inputs. While a template helpers receives its inputs as arguments, __Computed Properties define their inputs as dependent keys__.

In some cases pure functions are not sufficient though as the computation in the template helper or computed property also depends on global state or the inputs cannot statically be listed in the helper or property definition. This is the case for example for computations on collections when it is unknown upfront on which property of each element in the collection the computation depends, e.g.

```js
filteredUsers: filterByProperty('users' 'filter')
```

Here what we would like to do is filter the `users` array by the value of the `filter` property of the context. E.g. when `filter` is `'isActive'` we'd expect `filteredUsers` to contain all active users, when `filter` is `'isBlocked'` we'd expect it to contain all blocked users and so on.

With template helpers and the [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers) addon, we're be able to write something like this in the template:

```hbs {% raw  %}
{{#each (filter-by filter users) as |user|}}
  …
{{/each}}
{% endraw %}```

and because the [`filter-by` helper is a Class based helper](https://github.com/DockYard/ember-composable-helpers/blob/master/addon/helpers/filter-by.js) this actually works and the DOM updates correctly whenever the value of the `filter` property or e.g. the `isActive` property of any user changes.

With Computed Properties __it is not currently possible to implement something like this__ (at least not as a reusable macro).

## Enter Class based Computed Properties

With the Class based Computed Properties that [ember-classy-computed](https://github.com/simplabs/ember-classy-computed) introduces it is __actually possible now to implement something like the above mentioned `filterByProperty` macro__. The computed property returned by that macro can now correctly be invalidated when any of the user's `isActive`, `isBlocked` etc. properties change although it is not actually possible to know what these properties might be upfront. This __allows keeping the filtering logic in JavaScript as opposed to in the template__ when using a Class based template helper:

```js
import filterByProperty from 'app/computeds/filter-by';

…

filteredUsers: filterByProperty('users' 'filter')
```

```hbs {% raw %}
{{#each filteredUsers as |user|}}
  …
{{/each}}
{% endraw %}```

The implementation for the Computed Property macro looks like this:

```js
// app/computeds/filter-by.js
import Ember from 'ember';
import ClassBasedComputedProperty from 'ember-classy-computed';

const { observer, computed: { filter }, defineProperty } = Ember;

const DynamicFilterByComputed = ClassBasedComputedProperty.extend({
  contentDidChange: observer('content', function() {
    // This method is provided by the ClassBasedComputedProperty
    // base class and invalidates the computed property so that
    // it will get recomputed on the next access.
    this.invalidate();
  }),

  filterPropertyDidChange: observer('filterProperty', function() {
    let filterProperty = this.get('filterProperty');
    let property = filter(`collection.@each.${filterProperty}`, (item) => item.get(filterProperty));
    defineProperty(this, 'content', property);
  }),

  // This method is called whenever the computed property on the context object
  // is recomputed. The same lazy recomputation behavior as for regular computed
  // properties applies here of course. The method receives the current values
  // of its dependent properties as its arguments.
  compute(collection, filterProperty) {
    this.set('collection', collection);
    this.set('filterProperty', filterProperty);

    return this.get('content');
  }
});

export default ClassBasedComputedProperty.property(DynamicFilterByComputed);
```

Comparing this code to the implementation of the [`filter-by` helper](https://github.com/DockYard/ember-composable-helpers/blob/master/addon/helpers/filter-by.js) mentioned above you will recognize that both are almost identical. This illustrates very well what Class based Computed Properties are: a way to __use the same mechanisms that are already established for Class based template helpers for Computed Properties__ as well.

## Notice

__[ember-classy-computed](https://github.com/simplabs/ember-classy-computed) is currently at a very early stage__ and we haven't thoroughly tested the implementation just yet. We have also not done any benchmarking to get a better understanding of what the performance implications are. That is to say, __while we encourage everyone to try this out, be aware you're currently doing so at your own risk__ as this is most likely not production ready (yet). We have the feeling though that this will be a valuable addition to Computed Properties in the future and can close the gap that currently exists between Computed Properties and template helpers.

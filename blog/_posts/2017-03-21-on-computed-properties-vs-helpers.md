---
layout: article
section: Blog
title: On Computed Properties vs. Helpers
author: "Marco Otte-Witte"
github-handle: marcoow
twitter-handle: marcoow
---

Computed Properties are one of the first concepts new Ember Developers get exposed to when learning the
framework and they are actually a pretty powerful tool. Recently, it seems parts of the community are shifting away
from computed properties and towards template helpers though. In this post I'll explain why I think this is often not
the best direction to go, expanding on the talk on the same topic I gave at last year's EmberFest.

<!--break-->

#### Computed Properties

Computed Properties are a great way of defining new properties as functions of other properties. They are Ember's
main way of propagating changes through applications and are a manifestation of the Reactive Programming paradigm.

A simple example for a Computed Property is an `isSenior` property that returns true if a user is at least 65 years of age:

```js
isSenior: computed('age', function() {
  return this.get('age') >= 65;
})
```

The `isSenior` property is defined as a computed property that depends on the `age` property and
returns true if that is at least 65. Because `age` is specified as a dependent key, the `isSenior` property will
be invalidated whenever the `age` property changes and recalculated the next time it is accessed (the computed property
does not actually recalculate right away but only lazily on the next access).

In a template this computed property could be used like this:

```hbs
<p>
{{user.name}}
{{#if user.isSenior}}
  <small>(senior)</small>
{{/if}}
</p>
```

#### Template Helpers

The above example could just as easily be implemented with a template helper. Instead of defining the `isSenior` property
upfront, one would simply define a `lte` helper like this:

```js
export default Ember.Helper.helper(function([value, comp]) {
  return value >= comp;
});
```

This helper can then be used in the template directly:

```hbs
<p>
{{user.name}}
{{#if (lte user.age 65)}}
  <small>(senior)</small>
{{/if}}
</p>
```

#### What's the difference

Both pieces of code are obviously pretty similar. Both compare the user's age with a certain value and depending on the
outcome of that comparison render a piece of HTML or don't render it. The main difference really is that when using
a computed property that comparison lives in JS land and is accessed from the template via a named API (the
`isSenior` property) while in the helper case the comparison is defined inline right in the template where it is used.

This doesn't sound seem like a huge difference but when comparing the alternatives closer we uncover some differences that
might turn out to be relevant actually.

##### Separation of Concerns

The main difference is that while when using computed properties, concerns are clearly separated, when using a helper both
the rendering and the (business) logic are mixed in the template. While that might not seem like a huge issue in this
example it certainly is in more real-live examples. Without a clear separation where the template's maintainer only
interacts with the logic driving the template through a named API (e.g. the `isSenior` property in the above example)
all of the complexity and logic is shifted into the template and thus enters the realm of the maintainer who now has to
understand these internals instead of simply invoking something that has a descriptive name and can safely be treated
as a black box otherwise.

In a more real world example that point becomes more obvious. Imagine there's a collection of users in the template context
and we want to render a random user from that collection but only take active users into account. Selecting a random
active user from a collection of users using a computed property would looks something like this:

```
userToDisplay: computed('users.@each.state', function() {
  let activeUsers = this.get('users').filterBy('state', 'active');
  return shuffle(activeUsers)[0];
})
```

That user can then be rendered in the template through the `userToDisplay` property:

```hbs
{{userToDisplay.name}}
```

Comparing this to a solution that moves all of the implementation into the template via helpers shows how much harder
it becomes to understand the template now (although the logic is mostly the same of course):

```hbs
{{#each (take 1 (filter-by (shuffle users) 'state' 'active')) as |user|}}
  {{user.name}}
{{/each}}
```

##### Testability

Another consequence of the combination of concerns in the template besides the fact that the template become
harder to understand and maintain is that the logic that's now living in the template becomes harder to test. While
logic that lives inside the template context is easily unit-testable, logic that lives in the template layer can only
be tested when the template is actually rendered which has a few more consequences:

* Tests become slower to execute as it's obviously always slower to render than not to render (this is still true
  with Glimmer 2).
* Each test case becomes more complex. While in a unit test one could simply assert on the value of the computed
  property (e.g. `asser.equal(user.get('isSenior') true)`), assertions for helpers-based implementation have to based
  on the presence or absence of certain DOM nodes (e.g. `assert.ok(find(testSelector('senior-flag')))`).
* Test cases (potentially) require more context to be set up. While unit tests for computed properties only require
  all dependent properties of the computed property under test to be set up, rendering a template in a test case always
  requires the full context for that template to be set up which might include elements that are unrelated to the
  current test case.

##### Helpers don't work like you might think

One of the main things that keep people form using computed properties and let them move to helpers instead is the fact
that computed properties need to list their dependencies up front while when using helpers this all magically works out
of the box. While that is actually true in most cases there are some edge cases where helpers don't work as you might
think.

Consider the above example with the `isSenior` property vs. the helper based alternative solution:

```hbs
{{#if (lte user.age 65)}}
  <small>(senior)</small>
{{/if}}
```

Here we moved the age comparison into the template directly. If we were to implement a custom helper for the age
comparison that would encapsulate all of the logic and therefore e.g. improve testability as the helper could now
be unit-tested that could look something like this:

```js
export default Ember.Helper.helper(function([user]) {
  return user.get('age') >= 65;
});
```

which would simplify the template to this:

```hbs
{{#if (is-senior user)}}
  <small>(senior)</small>
{{/if}}
```

The problem with this solution though is that the template does not get re-rendered when the user's `age` property
changes. While arguments that are passed to helpers are observed by Ember automatically and the helper will be called
again when any of these arguments change, the same is not true when any properties on an argument change.

#### When to use which?

As shown above there are many cases where computed properties and helpers can be used to achieve the same result and
the differences between the solutions might not be obvious immediately. As we also saw there are a few subtle differences
though that one has to be aware of when choosing one of the alternatives.

As always giving general advice is hard and it usually depends which alternative is the better option. I will make 3
statements though that seem to be safe to make:

##### When both solutions would work

When both solutions would work and there is no immediate need to pick either one of the alternative, I think it's
generally good advice to go with the approach of leaving logic inside of the template context in a computed
property. There are some drawbacks when choosing helpers and I cannot think of any benefits that they would bring
in these cases really.

Computed properties allow for a clear separation of concerns, easy testability and great code reuse via computed
property macros. We prefer them over helpers in all of our projects and even recently worked on making them better
for some edge cases that were previously hard to implement as macros with ember-classy-computed. We are also currently
experimenting with computed properties that would work without specifying dependent keys upfront which will make
computed properties easier to use and might even offer some performance improvements.

Also don't let yourself be fooled by the functional programming hype and people telling you that helpers are better
because they are pure functions. While pure functions are a great things and helpers are (unless you make a mistake)
pure functions, computed properties are actually pure functions as well so this isn't something that differentiates
the alternatives.

For some context: a pure function is a function that only depends on its inputs and will return the same value for
the same inputs each time it is called. A pure function also has no side effects. While this is true for
helpers it is obviously true for computed properties with the only distinction that a computed property's inputs are
called dependent keys.

##### Originate concerns of the template layer

There is certainly logic that could be seen as originate concerns of the template layer and moving that into the
template context might break separations of concerns in the other way than explained above where code that belongs
into the template is moved into the template context.

These logic includes functionality for translating strings, formatting numbers etc. and lives perfectly fine in the
template. This type of logic will also usually be maintained by the person maintaining the template (and yes, these
are often different people than the ones writing the JavaScript code) and thus should be available to them without
having to look into the JavaScript code.

##### Missing a property context

list example

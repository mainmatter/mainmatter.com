---
title: "Ember Concepts: Declarative and Imperative Code"
authorHandle: lolmaus
tags: ember
bio: "Andrey Mikhaylov"
description:
  'Categorizing your code into "declarative" and "imperative" worlds can help
  structuring your app better.'
og:
  image: /assets/images/posts/2022-10-12-making-a-strategic-bet-on-rust/og-image.jpg
tagline: |
  <p>I like to think of fragments of Ember app code as belonging to either of two worlds: "declarative" and "imperative". This mental separation can help Ember developers orgainize their code for better maintainability.</p>
  <p>I use these two terms rather loosely and probably unconventionally. Please bear with me.</p>
---

## Part of "Ember Concepts and Antipatterns" Series

This mini article is part of a blog post series on Ember concepts and
antipatterns. I had produced this content for a client and we found it
appropriate to share with the community as other developers might find it
helpful.

You may find these mini articles too basic, that's intentional. The goal is to
have a bunch of reference materials at hand, so that one can quickly link to
such a material when necessary, wihtout having to take time explaining the
concept, for example in a PR review or team chat.

Some of these mini articles cover Ember Classic concepts. If you find them
obsolete in modern Ember, you may very well be right. 😉

## Declarative code

— is code that describes the desired outcome rather than executes steps that
achieve it.

In Ember this is achieved with computed properties (CPs) or getters, hooks and
templates. As a devoloper, you _define_ your logic, put it into place, wire it
together — and it works automatically.

A related concept is "reactive code" — code that’s organized in computed
properties or getters that depend on some source data and on each other.

When a user makes an action, it causes the source data to change. This
automatically triggers CPs and getter that depend on it to recompute and produce
new values. This in turn triggers other CPs and getters that depend on the ones
that have recomputed.

Values, both source data and CPs/getters, can be used in templates. When source
data changes, templates are re-rendered automatically and both new source data
and freshly recomputed values of CPs appear on the user’s screen.

Read more:

- [https://en.wikipedia.org/wiki/Declarative_programming](https://en.wikipedia.org/wiki/Declarative_programming)
- [https://en.wikipedia.org/wiki/Reactive_programming](https://en.wikipedia.org/wiki/Reactive_programming)
- [https://www.pzuraq.com/blog/what-is-reactivity](https://www.pzuraq.com/blog/what-is-reactivity)
- [https://www.pzuraq.com/blog/what-makes-a-good-reactive-system](https://www.pzuraq.com/blog/what-makes-a-good-reactive-system)

## Imperative code

— is such code where you manually execute methods, assign values to properties,
etc to make the desired outcome happen.

I use the terms "imperative code" and "procedural code" interchangeably, though
strictly speaking there probably is difference between them.

In Ember, class methods and actions are examples of imperative code.

## Why care of the difference?

It's important to know when to write declarative code and when imperative.

Declarative code should be preferred whenever possible because it makes your
code easier to understand and to maintain. This approach requires a paradigm
shift to some developers: you need to start thinking about your code as a data
flow.

For example, let's say a user action produces some value, and we need to
calclate a derived value. Naturally, we assign it to a property like this:

```js
{% raw %}@action
userInput(value) {
  this.value = value;
  this.derivedValue = value.toUpperCase();
}
{% endraw %}
```

But instead of doing the assignment by hand, we could make it a computed
property (in Classic Ember) or a tracked getter (in modern Ember):

```js
{% raw %}@action
userInput(value) {
  this.value = value;
}

@tracked
get derivedValue() {
  return this.value?.toUpperCase();
}
{% endraw %}
```

The difference may seem insignificant at first, but actually it's huge. This
approach untangles your code and makes it more straignforward to understand.

This example is small, but in real life situations there may be large amounts of
values to compute. Managing them by hand becomes difficult, and if they get out
of sync you have a bug. Getters and CPs compute automatically and never get out
of sync. Well, unless you forget to mark your source data with the `@tracked`
decorator or fail to provide CP dependency keys. 😇

Another benefit of getters and CPs is that they are _lazy_. This means that they
don't get eagerly computed until some other code actually needs to use those
values. Compared to imperative code style, this can improve your app's
performance.

## What declarative code should not do

Getters and CPs are only supposed to produce values derived from other values,
stored in regular properties and other CPS or getters.

What this means is that a getter/CP can only return a value. It must not create
any side effects such as mutating properties and calling methods that do
anything beyond returning values and debug logging.

If you violate this rule, your code will quicky turn into a maintenance
nightmare.

### Are getters/CPs pure functions?

You should definitely think of getters and CPs as pure functions, in the sense
that they should not make any side-effects.

But technically speaking, CPS and getters are not pure functions because they
can access stuff outside of the function itself. Pure functions only receive
source data as arguments, whereas CPS and getters are allowed to read class
instance properties, access services, etc.

## Unidirectional control flow

— is such a way to organize code that when code paths are traced they represent
a tree and not a spiderweb. They only entitis in your app that are allowed to
create horizontal links in your control flow tree are services.

Getters and computed properties can depend on other getters and computed
properties, but they can’t form circular dependencies, and they should not
violate the purity and cause side-effects that may trigger more getters/CPs to
recompute.

I've seen examples of circular CP dependencies that _happened_ to work correctly
because they had checks and early returs that prevented a
`Maximum call stack size exceeded` error. That code could be written in a way
where CPs don't cross-reference each other.

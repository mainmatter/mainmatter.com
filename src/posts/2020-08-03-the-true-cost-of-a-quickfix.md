---
title: The True Cost Of A Quickfix
authorHandle: patsy_issa_p
topic: process
bio: 'Senior Frontend Engineer'
description:
  'Patsy Issa makes the case for refactoring legacy code sooner rather than
  later'
og:
  image: /assets/images/posts/2020-08-03-the-true-cost-of-a-quickfix/og-image.png
---

Picture this, a sprint is underway, development is running smoothly, then QA
reports a rather odd bug, you begin to investigate and lo and behold you find
the following comment:

```javascript
// Dear programmer:
// When I wrote this code, only god and I knew how it worked
// Now, only god knows
```

<!--break-->

![the true cost of a quickfix illustration](/assets/images/posts/2020-08-03-the-true-cost-of-a-quickfix/illustration.png#full@1440-2880)

While avoiding code that resulted in such comments was harder to enforce in the
pre-framework era, opinionated frameworks such as
[Ember.js](https://emberjs.com/) offer us concrete ways to ship code with
confidence. This is known as the ember happy path, code smells can be identified
when an implementation strays away from the path.

In an ideal world, such problems can be caught early enough in the planning
cycle by collaborating closely among all stakeholders, making sure that design,
development and product work together towards finding functional solutions that
are worthy of our users' trust.

Delivering products with sustainable foundations is a core value that we hold
dear at simplabs. Such foundations, while relatively easy to set up on a
greenfield project are an entirely different story in any long-lived project
that might not have started with a solid foundation.

**"So how do I tackle refactoring legacy code that has made its way into
multiple core systems?"**

### Stop development, fix it now!

While all too tempting this approach has quite a heavy list of pre-requisites in
order to be successful:

- Tasks have already been scoped out and achievable goals are set
- The refactoring effort does not block mission-critical features
- No deadlines at the door
- The total cost and lead time impact must be justifiable to stakeholders
- A robust and comprehensive test suite

Often, teams with deadlines will have maintenance periods where engineers are
allocated time to "fix" the codebase. Time and time again I have seen this
pattern repeated with similar outcomes, overrun budgets and half-finished
long-lived branches.

As we tally up the costs (dev/design/product/... time, loss of competitiveness,
etc...), it is important to keep in mind that this is a one-time investment we
pay for a more standardized codebase with a reduced chance of future feature
work delay.

### Stop! Quick-fix time!

A scenario we are all too familiar with, everything is going according to plan,
development is running smoothly, marketing is preparing their release post. Then
the (un)expected happens, a part that seemed unrelated starts breaking.

A common approach, that has long term implications, is to run a quick analysis,
attempt to pinpoint the issue and patch it in time to meet the deadline. While
this may address our short-term needs, if not followed up with a code audit and
analysis, it will come back to haunt us.

Just recently I experience a situation where a quick fix implemented six months
ago set us back a total of two weeks. Further investigation revealed that the
code causing this was committed, by someone that was no longer on the team, a
little over **three years** ago.

Any long-lived codebase that does not have regular code audits, will at one
point or another have parts that are not understood by the current team.

Unlike the previous method; the cost for this approach depends, among other
things, on the time the quick-fix spends as tech debt and the future features it
impacts.

> An atomic habit is a regular practice or routine that is not only small and
> easy to do but is also the source of incredible power; a component of the
> system of compound growth. Bad habits repeat themselves again and again not
> because you don't want to change, but because you have the wrong system for
> change <author>Atomic Habits by James Clear</author>

### Prevention

Once the issue is resolved, the system in place must be revisited and improved
to reduce the probability of running into similar problems in the future.

Sustainable development habits must be put in place:

- Training and leveling-up existing staff resulting in higher code quality
- Reducing the
  [bus factor](https://en.wikipedia.org/wiki/Bus_factor#:~:text=The%20bus%20factor%20is%20a,truck%20number%2C%20or%20lorry%20factor.)
  by pairing and knowledge sharing through collaboration
- Code audits when a team member leaves, walkthroughs when a new one joins

To name a few, we go into greater detail in our [Playbook](/playbook/)!

The enemy of velocity is not quality but the absence of it.

---
title: The True Cost Of A Quickfix
author: 'Patsy Issa'
github: patsy-issa
topic: process
bio: 'Senior Frontend Engineer'
description:
  'Patsy Issa makes the case for refactoring legacy code sooner rather than
  later'
og:
  image: /assets/images/posts/2020-06-25-writing-rust-nifs-for-elixir-with-rustler/og-image.png
---

Picture this, a sprint is underway, development is running smoothly, QA reports
that one rather odd bug is happening, you begin to investigate and lo and behold
you find the following comment:

```
// ember-parachute sometimes seems to call `queryParamsDidChange()` even
// though the query parameters did not change their values. we work around
// this issue here by saving the "previous" value so that we can compare
// it later in `queryParamsDidChange()`.
```

Further investigation of the issue revelead the culprit, multiple query param
implementations, among them a **three** year old custom implementation that
called the function `queryParamsDidChange()` regardless of if they had changed
or not.

Unfortunately, the custom implementation was being used in key points of the
application, the size of the task was dawning on us. As we had a deadline to
meet planning our next steps carefully was crucial or we ran the risk of setting
back the effort of multiple teams.

At this stage, having leveraged re-usable components, we were a few days ahead
of schedule which allowed us to split our team's focus. One engineer focused on
understanding the quick fix and attempted to patch it to work for our current
scenario, while the two others were tasked with scoping, presenting and
executing a plan to refactor the implementations using the framework's
([ember.js](https://emberjs.com/)) happy path.

The efforts to patch the quick fix seemed successful and took a week, the
urgency of the refactor was reduced and work began on the next feature against
our recommendation. If you have worked on an application long enough chances are
the following will not surprise you. A day later we receive a bug report that a
completely unrelated part of the application was broken. Alarms rang and the
green light was given to begin refactoring.

It took us two days to scope the issue and another week of development to
implement it along with a full QA, justifying such a time and effort allocation
on an internal refactor can often be a tough case to sell. If we only look at
the direct costs, a new bug in production and a week of delay for three
engineers, if we take into account the cost of building features on top of
legacy code, a previous quick fix of one of the symptoms and two delayed
features things start to add up.

Sustainable development habits such as regular code audits can help mitigate
costs and reduce the dreaded risk of undertaking a complete re-write. The enemy
of velocity is not quality but the absence of it.

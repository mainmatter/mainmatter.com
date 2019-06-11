---
title: "Ember Octane, bridging the controller gap"
author: "Ricardo Mendes"
github: locks
twitter: locks
topic: ember
bio: "Frontend Engineer"
---

The topic of controllers has been a thorny one in the Ember community ever since the original design of routable components was abandoned.
However, several of Ember Octane's features potentially close that gap in ways that might not be evident at first glance.

## Closing the gap
### Glimmer components
Glimmers don't have a wrapping `div`, and neither do route templates.

### Render lifecycle hooks
Glimmers' API is highly simplified, lifecycle hooks were moved to render element modifiers, which can be used in route templates.

### Routing concerns
`RouterService` can be injected in components and controllers.
The special `ApplicationController` is no more.
query params blah blah

## Zeno's paradox

### Controllers are still singletons

### Query params
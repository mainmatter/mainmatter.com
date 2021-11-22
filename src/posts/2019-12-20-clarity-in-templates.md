---
title: 'Bringing clarity to templates through Ember Octane'
authorHandle: locks
tags: ember
bio: 'Senior Frontend Engineer, Ember Framework and Learning Core teams member'
description:
  'Ricardo Mendes explains how Ember templates have evolved in the path to Ember
  Octane to bring more clarity for developers.'
og:
  image: /assets/images/posts/2019-12-20-clarity-in-templates/og-image.png
tagline: |
  <p>When reading Ember templates, have you ever wondered where a certain dynamic value comes from? Is that dynamic value a property of the component, a named argument that was passed in, or even a helper?</p> <p>In this blog post we will be discussing how recent Ember.js modernization efforts on the path to Ember Octane have brought features that help with this exact problem.</p>
---

![Bringing clarity to your Ember templates](/assets/images/posts/2019-12-20-clarity-in-templates/illustration.jpg#full@720-1440)

## Ember Octane and editions

As a framework that values stability and providing its users solid upgrade
paths, Ember has accrued its fair share of idiosyncrasies. One of the more
demonstrable consequences of this is the so called pit of incoherence, alluded
to in the
[opening keynote of EmberConf 2019](https://www.youtube.com/watch?v=zYwdBcmz6VI):
APIs are introduced that move the framework to a new mental model, but that
mental model isn't complete yet. This leaves users unsure of which APIs to use
when, and how the interop might work.

This is where editions come into play. The main goal of editions is to document
and present a new and coherent mental model that developers can adhere to, while
keeping compatibility with existing APIs. This is done in one of two ways,
either a new API that can coexist with existing ones is introduced, or an
optional feature that users can opt into is introduced. This allows for new
applications to have the optional features and default blueprints of the newer
editions, while existing applications can update their codebase at their own
pace.

In this blog post we will address some changes to templates that were introduced
with Ember Octane in mind, the first planned edition for the Ember.js framework.
You can read more about Octane in the
[official edition page](https://emberjs.com/editions/octane).

## Ambiguity

{% raw %}
In Ember templates, interpolation of dynamic values is done through curly
braces, `{{}}`. Given this is the only syntax for dynamic values, there is an
ambiguity problem at times. Let us look at a template:
{% endraw %}
```hbs
{% raw %}
{{! app/templates/components/blog/post.hbs }}
<h1>{{title}}</h1>

{{post-body post=post}}

<button {{action 'expandComments'}}>

{{#if commentsExpanded}}
  {{#each post.comments as |commentObject|}}
    {{comment comment=commentObject onReport=onReportComment
    }}
  {{/each}}
{{/if}}
{% endraw %}
```

Looking only at the template, can we be certain where `title` comes from?
Whether `post-body` and `comment` are helpers or components? We can generously
assume that `comment` is a component as it is receiving an action, but when
scanning the file it is indistinguishable from `if`, `each`, and other
templating constructs.

We will work step by step to remove ambiguity where we can.

### Disambiguating properties

We will start by marking which dynamic values come from the component's
JavaScript. These are called properties. To do that we are going to consult the
JavaScript file to see which properties it might define:

```js
{% raw %}
import Component from '@ember/component';
import { computed } from '@ember/object';
import titleCase from 'my-app/utils/title-case.js';

export default Component.extend({
  title: computed('post.title', function () {
    return titleCase(this.post.title);
  }),

  commentsExpanded: false,

  actions: {
    toggleComments() {
      this.toggleProperty('commentsExpanded');
    },
  },
});
{% endraw %}
```

We see that `title` is a computed property, and `commentsExpanded` is a boolean
defined in the class definition, so we will update the template accordingly:

```hbs
{% raw %}
{{! app/templates/components/blog/post.hbs }}
<h1>{{this.title}}</h1>

{{post-body post=post}}

<button {{action 'expandComments'}}>

{{#if this.commentsExpanded}}
  {{#each post.comments as |commentObject|}}
    {{comment comment=commentObject onReport=onReportComment
    }}
  {{/each}}
{{/if}}
{% endraw %}
```

The great thing about this feature is that all versions of Ember support it, so
you can start annotating properties in your templates today. You can also
enforce that no new implicit `this` are added to templates by configuring the
appropriate
[`ember-template-lint`](https://github.com/ember-template-lint/ember-template-lint)
rule.

### Disambiguating named arguments

Next we will turn our attention to named arguments. We give this name to values
that we pass into components when we use them. Since components do not have
access to the context where they are called in, this is the primary way to pass
information into them.

To see what we are passing into our `blog/post` component, we need to see how it
is used in our application. To do this, we will check a route template, namely
the template for the `blog` route, where the component is used:

```hbs
{% raw %}
{{! app/templates/blog.hbs }}
{{blog/post post=post onReportComment=(action 'onReportComment')}}
{% endraw %}
```

We can see that when calling the component, we are passing in `post` and
`onReportComment`. The syntax to mark them as named argument is a `@` prefix, so
let us update our template:

```hbs
{% raw %}
{{! app/templates/components/blog/post.hbs }}
<h1>{{this.title}}</h1>

{{post-body post=@post}}

<button {{action 'expandComments'}}>

{{#if this.commentsExpanded}}
  {{#each post.comments as |commentObject|}}
    {{comment comment=commentObject onReport=@onReportComment
    }}
  {{/each}}
{{/if}}
{% endraw %}
```

We have improved our template a further step, now we can tell properties and
named arguments apart. Next we will dive into component invocation.

If you wish to use named arguments in your application, you can use
[`ember-named-arguments-polyfill`](https://github.com/rwjblue/ember-named-arguments-polyfill)
for Ember.js versions older than 3.1.

Named arguments mostly apply to components, since they are the piece of Ember
that is explicitly invoked by developers unlike route templates which the
framework renders for you.

Note that `@model` was introduced by
[RFC #523 "Model Argument for Route Templates"](https://emberjs.github.io/rfcs/0523-model-argument-for-route-templates.html)
so that you can refer directly to the model that was passed to a route template.

### Disambiguating components

After the last change, it would be nice to have a way to disambiguate component
invocations from other kinds of dynamic interpolations. Fortunately, a new
syntax was introduced by
[RFC #311 "Angle Bracket Invocation"](https://emberjs.github.io/rfcs/0311-angle-bracket-invocation.html),
that allows us to do just that. Using angle bracket invocation also enables us
to distinguish between named arguments passed to the component, and HTML
attributes passed to the component. HTML attributes and `...attributes` will be
covered in a future post.

To update, we replace curly braces with an HTML-like `<>` syntax–hence angle
bracket invocation,–using capital case for the name of the component, `::`
instead of `/` for nested components, and prefixing named arguments with `@`.
Here is how the above `blog` and `blog/post` templates look like once updated:

```hbs
{% raw %}
{{! app/templates/blog.hbs }}
<Blog::Post @post={{post}} @onReportComment={{action 'onReportComment'}} />
{% endraw %}
```

```hbs
{% raw %}
{{! app/templates/components/blog/post.hbs }}
<h1>{{this.title}}</h1>

<PostBody @post={{@post}} />

<button {{action 'expandComments'}}>

{{#if this.commentsExpanded}}
  {{#each post.comments as |commentObject|}}
    <Comment @comment={{commentObject}} onReport={{@onReportComment
    }} />
  {{/each}}
{{/if}}
{% endraw %}
```

To use this feature in older versions of Ember and its dependencies, you can use
[`ember-angle-bracket-invocation-polyfilll`](https://github.com/rwjblue/ember-angle-bracket-invocation-polyfill).

With just a couple of tweaks, we now have much more clarity when reading a
template, and the need to consult additional files is lessened:

- `{{this.title}}` is a property that comes from the JavaScript file of the
  component;
- `<PostBody />` is a component invocation;
- `{{@post}}` is a named argument that is passed to the component when invoked;
- `{{this.commentsExpanded}}` is also a property;
- `if` and `each` are templating constructs
- `commentObject` is a block argument that is available inside the `each` block
  scope
- `<Comment />` is a component invocation

These were not the only improvements made to Ember's templating engine, or even
to components. Also introduced to the framework were the ability to pass HTML
attributes to components and apply them with `...attributes`, a simplification
of DOM event handling with the
[`on`](https://emberjs.github.io/rfcs/0471-on-modifier.html) and
[`fn`](https://emberjs.github.io/rfcs/0470-fn-helper.html) modifiers replacing
`action`, the ability for users to create
[custom element modifiers](https://github.com/ember-modifier/ember-modifier)
like the built-in `action`, `on`, and `fn`,
[rendering lifecycle element modifiers](https://github.com/emberjs/ember-render-modifiers),
and
[Glimmer components](https://emberjs.github.io/rfcs/0416-glimmer-components.html).

These new features will be covered in upcoming posts, so be sure to keep an eye
out for them!

If you are looking for help to update your codebase to these new idioms, or you
want to level up your engineering team, make sure to [contact us](/contact/) so
we can work together towards achieving your goals.

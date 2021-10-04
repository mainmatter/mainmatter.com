---
title: Using better element selectors in Ember.js tests
authorHandle: marcoow
bio: "Founding Director of simplabs, author of Ember Simple Auth"
description:
  "Marco Otte-Witte announces the release of ember-test-selectors, an addon that
  enables better element selectors in Ember.js tests."
topic: ember
---

We just released
[ember-test-selectors](https://github.com/simplabs/ember-test-selectors), an
**Ember Addon that enables better element selectors in Ember.js tests**. It
removes all data attributes starting with `data-test-` from the application's
templates in the `production` environment so that these attributes can be used
to select elements with in acceptance and integration tests without polluting
the markup that is delivered to the end user.

<!--break-->

## Why even use `data` attributes as test selectors?

Integration and acceptance tests usually **interact with and assert on the
presence of certain elements** in the markup that an application renders. These
elements are identified using CSS selectors. Most projects use one of three
approaches for CSS selectors in tests:

### Selectors based on HTML structure

This approach simply selects elements by their position in the rendered HTML.
For the following template:

```html
<article>
  <h1>Post Title</h1>
  <p>Post Body…</p>
</article>
```

one might select the post's title with the selector `'article h1'`. Of course
this breaks when changing the `<h1>` to a `<h2>` while the functionality being
tested is probably not affected by that change.

### Selectors based on CSS classes

This approach selects elements by CSS classes. For the following template:

```hbs
{% raw %}
<article>
  <h1 class="post-title">{{post.title}}</h1>
  <p>{{post.body}}</p>
</article>
{% endraw %}
```

one might select the post title with the selector `'.post-title'`. This of
course breaks when the CSS class is changed or renamed, although that would only
be a visual change which shouldn't affect the tests at all.

Many projects use CSS classes with special prefixes that are only used for
testing to overcome this problem like `'js-post-title'`. While that approach is
definitely more stable it is often hard to maintain. Also it doesn't easily
allow to encode additional information like e.g. the post's id.

### Selectors based on `data` attributes

This approach uses HTML 5 `data` attributes to select elements. For the
following template:

```hbs
{% raw %}
<article>
  <h1 data-test-selector="post-title">{{post.title}}</h1>
  <p>{{post.body}}</p>
</article>
{% endraw %}
```

one would select the post's title with the selector
`*[data-test-selector="post-title"]` (which selects any element with a
`data-test-selector` attribute that has the value `"post-title"`). While the
selector is arguably a bit longer this approach **clearly separates the test
selectors from the rest of the markup and is resilient to change** as the
attribute can be applied to any element rendering the post's title, regardless
of the HTML structure, CSS classes etc. Also it easily allows encoding more data
in the markup like e.g. the post's id:

```hbs
{% raw %}
<article>
  <h1 data-test-selector="post-title" data-test-resource-id="{{post.id}}">{{post.title}}</h1>
  <p>{{post.body}}</p>
</article>
{% endraw %}
```

`ember-test-selectors` makes sure to remove all these `data` attributes in the
`production` environment so that **users will have perfectly clean HTML
delivered**:

```html
<article>
  <h1>My great post</h1>
  <p>Bla bla…</p>
</article>
```

## Future Plans

{% raw %}
We have some future plans for ember-test-selectors to make working with data
attributes as test selectors even more convenient:

- custom test helpers that find elements by data attributes so that you don't
  have to write the quite long selectors yourselves; probably sth. like
  `findViaTestSelector('selector', 'post-title')`,
  [https://github.com/simplabs/ember-test-selectors/issues/8](https://github.com/simplabs/ember-test-selectors/issues/8)
- template helpers that generate data attributes for elements, e.g.
  `<h1 {{test-selector="post-title"}}>{{post.title}}</h1>` which would result in
  `<h1 data-test-selector="post-title">{{post.title}}</h1>` or
  `<div {{test-selector post}}>…</div>` which would result in
  `<div data-test-selector="post-1">…</div>`,
  [https://github.com/simplabs/ember-test-selectors/issues/9](https://github.com/simplabs/ember-test-selectors/issues/9)
  {% endraw %}

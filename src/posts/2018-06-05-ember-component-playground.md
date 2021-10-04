---
title: "Autodiscovery for the Ember.js component playground"
authorHandle: tobiasbieniek
bio: "Senior Frontend Engineer, Ember CLI core team member"
description:
  "Tobias Bieniek introduces a mechanism for automatically discovering new
  components in Ember.js applications and showing them in an ember-freestyle
  playground."
topic: ember
---

In our [previous post] about [`ember-freestyle`][ember-freestyle] we have setup
a component playground for our Ember.js application. In this post we will
discuss how to implement "convention over configuration" for it by automatically
discovering new components and showing them in the playground.

[previous post]: /blog/2018/01/24/ember-freestyle
[ember-freestyle]: http://ember-freestyle.com/

<!--break-->

## Status Quo

You may remember that last time we closed with our `freestyle.hbs` template
looking roughly like this:

```handlebars
{% raw %}
{{#freestyle-guide title='My Awesome App'}}
  {{! ... }}

  {{#freestyle-section name='Components' as |section|}}
    {{#section.subsection name='styled-button'}}

      {{#freestyle-usage 'styled-button-example-1'}}
        {{#styled-button}}Hello World!{{/styled-button}}
      {{/freestyle-usage}}

      {{#freestyle-usage 'styled-button-example-2'}}
        {{#styled-button}}😀 😎 👍 💯{{/styled-button}}
      {{/freestyle-usage}}

    {{/section.subsection}}
  {{/freestyle-section}}
{{/freestyle-guide}}
{% endraw %}
```

If we now start to add subsections for all the components in our app you can
imagine that our `freestyle.hbs` would soon grow out of proportion. As with any
other template in Ember.js we can tackle that problem by extracting components.

In this case we can create a
`lib/freestyle/app/templates/components/usage/styled-button.hbs` file that looks
like this:

```handlebars
{% raw %}
{{#freestyle-usage 'styled-button-example-1'}}
  {{#styled-button}}Hello World!{{/styled-button}}
{{/freestyle-usage}}

{{#freestyle-usage 'styled-button-example-2'}}
  {{#styled-button}}😀 😎 👍 💯{{/styled-button}}
{{/freestyle-usage}}
{% endraw %}
```

and in the `freestyle.hbs` template we use the following snippet instead:

```handlebars
{% raw %}
{{#section.subsection name='styled-button'}}
  {{usage/styled-button}}
{{/section.subsection}}
{% endraw %}
```

Now we would still have to add a subsection and a component for every component
in our app that we want to include in the component playground, but overall the
situation has gotten a lot more manageable.

But there is always a way to improve the current situation so let's play around
a little...

## Autodiscovery

What if we could ask Ember what "usage components" it knows about and then
render them automatically in the `freestyle.hbs` template...? 🤔

It turns out the `loader.js` dependency that every Ember.js project has provides
us with an API to do exactly that. If we `import require from 'require';` and
then look at `require.entries` we will see a map of all the known module names
in your app and their corresponding module functions. We only care about the
module names though so we can use `Object.keys(require.entries)` to get a list
of all those module names.

Next, we need to filter the list so that it only includes our "usage
components". We can do so by using the `.filter()` method and checking for the
right prefix:

```js
let usageComponents = Object.keys(require.entries).filter(
  (path) => path.indexOf("myapp/templates/components/usage/") === 0
);
```

This should produce a list that looks roughly like this:

```js
[
  "myapp/templates/components/usage/styled-button",
  "myapp/templates/components/usage/country-flag",
  "myapp/templates/components/usage/form-input",
];
```

To be able to use those as component names in our template we will have to do a
few more things though. We will need to strip the
`myapp/templates/components/usage/` prefix and then we should sort the list
alphabetically, so that the order in the component playground is more
predictable.

In the end our `lib/freestyle/controllers/freestyle.js` will look roughly like
this:

```js
import require from "require";
import FreestyleController from "ember-freestyle/controllers/freestyle";

export default FreestyleController.extend({
  init() {
    this._super(...arguments);
    this.set("components", findUsageComponents());
  },
});

function findUsageComponents() {
  let pathPrefix = "myapp/templates/components/usage/";

  return Object.keys(require.entries)
    .filter((path) => path.indexOf(pathPrefix) === 0)
    .map((path) => path.slice(pathPrefix.length))
    .sort();
}
```

{% raw %}
With that JavaScript code out of the way we can focus on our template. Here, we
now have a `components` list available with the names of all our "usage
components". As usual with lists we will use a `{{#each}}` block to iterate over
it:
{% endraw %}

```handlebars
{% raw %}
{{#freestyle-guide title='My Awesome App'}}
  {{! ... }}

  {{#freestyle-section name='Components' as |section|}}

    {{#each components as |componentName|}}
      {{#section.subsection name=componentName}}
        {{component (concat "usage/" componentName)}}
      {{/section.subsection}}
    {{/each}}

  {{/freestyle-section}}
{{/freestyle-guide}}
{% endraw %}
```

If we visit the `/freestyle` route now, we should see a list of all our "usage
components" that Ember.js knows about and usage examples for all of them.

## Summary

Just like Ember.js is able to automatically find components, models, and other
modules when you put them in the right folder, our component playground can now
do the same thing. "Convention over Configuration" saves us from the extra work
of having to manually maintain the `freestyle.hbs` template by discovering the
content automatically.

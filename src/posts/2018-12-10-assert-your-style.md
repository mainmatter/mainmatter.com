---
title: "Assert Your Style - Testing CSS in Ember Apps"
authorHandle: jjordan_dev
bio: "Senior Frontend Engineer, Ember Learning core team member"
description:
  "Jessica Jordan explains approaches and patterns for testing styles in
  Ember.js applications."
tags: javascript
og:
  image: /assets/images/posts/2018-12-10-assert-your-style/og-image.png
---

Sometimes you really want to make sure that your web application looks good; and
that it keeps doing so in the future. **Automated tests** are an important
foundation for making your application's appearance future-proof and this may
involve the integration of a screenshot-based testing tool like
[Percy.io](https://percy.io/) or
[PhantomCSS](https://github.com/HuddleEng/PhantomCSS).

But writing your own **visual regression tests** for critical styles in your
application can be really useful, too - and it can be easily done on top of
that!

<!--break-->

These are a few approaches you can choose from to assert against the styling of
your web page as part of your automated integration and acceptance test suite:

## Testing Inline Styles of a HTML Element

Although it's a good practice to keep your HTML and your CSS entirely separate,
**inline styles** on components and other elements in your application are
sometimes necessary to be able to apply CSS property values that change
dynamically. And testing those styles can be important, too.

Imagine you created a component with an inline style attached to it assigning a
variable blue background color to it:

```js
// app/components/simplabs-logo-tile.js
import Component from "@ember/component";
import { computed } from "@ember/object";

const tileColors = {
  dark: "rgb(29, 113, 182)",
  mid: "rgb(0, 127, 189)",
  light: "rgb(108, 189, 242)",
};

export default Component.extend({
  tileColor: "mid",
  attributeBindings: ["style"],
  style: computed("tileColor", function () {
    let colorShade = this.get("tileColor");
    let bgColor = tileColors[colorShade];
    return htmlSafe(`background-color: ${bgColor}`);
  }),
});
```

Using `ember-test-selectors` to apply `data-` attributes to this component, you
can make it easier to interact with your component later on in the test.

```bash
ember install ember-test-selectors
```

Which now allows you to tag your component for testing as follows:

```js
// app/components/simplabs-logo-tile.js
import Component from "@ember/component";
import { computed } from "@ember/object";

const tileColors = {
  dark: "rgb(29, 113, 182)",
  mid: "rgb(0, 127, 189)",
  light: "rgb(108, 189, 242)",
};

export default Component.extend({
  tileColor: "mid",
  "data-test-simplabs-logo-tile": true,
  attributeBindings: ["style"],
  style: computed("tileColor", function () {
    let colorShade = this.get("tileColor");
    let bgColor = tileColors[colorShade];
    return htmlSafe(`background-color: ${bgColor}`);
  }),
});
```

To learn more about the rationale behind `ember-test-selectors`, be sure to also
[give this introduction a read](/blog/2017/11/17/ember-test-selectors-road-to-1-0).

Using the
[HTMLElement.style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)
API, we can assert if the correct background color has been applied to our
component:

```js
{% raw %}
// tests/integration/components/simplabs-logo-tile-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simplabs-logo-tile', function (hooks) {
  setupRenderingTest(hooks);

  test('it allows setting a dark background color', async function (assert) {
    await render(hbs`{{simplabs-logo-tile tileColor="dark"}}`);

    let elementStyle = find('[data-test-simplabs-logo-tile]').style;
    assert.equal(elementStyle.backgroundColor, 'rgb(29, 113, 182)');
  });
});
{% endraw %}
```

`HTMLElement.style` allows to check for the value of **individual CSS
properties**. The same API can also be used to assign new values for any CSS
property programmatically. You can read more about
[the style attribute in the MDN docs on HTMLElement.style here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style).

A major **benefit** of testing **CSS properties** directly is that it allows us
to derive information on how inline styles are applied to elements in our
application. This is particularly useful if we want to test **dynamic styles**.

**Testing inline styles** also has its **drawbacks** though: these styles don't
necessarily reflect the way the element is ultimately rendered on the page. In
this situation the assertion against an element's **computed style** provides
much more insight.

## Testing Computed Styles of a HTML Element

At times you also want to check against the actual **computed value** of your
element in your tests. Some CSS definitions require the browser to resolve the
basic computation, the actual computed styles will be applied during rendering.
For example, in the case of an element with a percentage-based width defined via
CSS stylesheets (e.g. `width: 80%`), the computed style will resolve to
`width: 800px` if the element happens to be a relatively positioned
(`position: relative`) child element of another DOM node with a computed width
of `1000px`. If the element's parent element turns out to have a width of
`500px` though, the computed width of the "80% wide" child will resolve to a
mere `400px`.

Computed styles provide information about the styles that are **ultimately
assigned** to an element. Due to
[CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
browsers will decide which CSS property value either defined in a CSS stylesheet
or an inline style is most relevant and this value will also be reflected in the
element's computed styles.

The
[getComputedStyle method](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)
will return an object containing these most relevant style values. In contrast
to the object returned from `HTMLElement.style` the return value of
`getComputedStyle` is read-only.

Therefore the `getComputedStyle` method is the ideal candidate for asserting
styles of an element in rendering tests:

```js
{% raw %}
// tests,/integration/components/simplabs-logo-tile-test.js
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { find, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | simplabs-logo-tile", function (hooks) {
  setupRenderingTest(hooks);

  test("it allows setting a dark background color", async function (assert) {
    await render(hbs`{{simplabs-logo-tile tileColor="dark"}}`);

    let computedStyle = window.getComputedStyle(
      find("[data-test-simplabs-logo-tile]"),
      null
    );
    assert.equal(
      computedStyle.getPropertyValue("background-color"),
      "rgb(29, 113, 182)"
    );
  });
});
{% endraw %}
```

## Easy Style Assertions with qunit-dom

Now we know how we can write style-related tests for our automated test process
that assert that the expected styles are applied to elements on the web page.

But there's an even easier way to assert the computed styles of elements in your
**QUnit test suite**. Since
[v0.8.1](https://twitter.com/simplabs/status/1065913669995978752) of
[qunit-dom](/blog/2017/10/24/high-level-assertions-with-qunit-dom) you can make
your tests truly ✨

Check it [out](https://github.com/simplabs/qunit-dom):

```bash
npm install --save-dev qunit-dom
```

or

```
yarn add --dev qunit-dom
```

In your rendering test you're now able to check for the component's style using
the `hasStyle` method:

```js
{% raw %}
// tests/integration/components/simplabs-logo-tile-test.js
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { find, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | simplabs-logo-tile", function (hooks) {
  setupRenderingTest(hooks);

  test("it allows setting a dark background color", async function (assert) {
    await render(hbs`{{simplabs-logo-tile tileColor="dark"}}`);

    assert.dom("[data-test-simplabs-logo-tile]").hasStyle({
      backgroundColor: "rgb(29, 113, 182)",
    });
  });
});
{% endraw %}
```

You can read more about the usage of the `.hasStyle` method in the
[API documentation](https://github.com/simplabs/qunit-dom/blob/master/API.md#hasStyle).

---

There are different ways to assert against inline styles and computed styles in
your application and if you're using Ember & QUnit,
[qunit-dom](https://github.com/simplabs/qunit-dom) is your best bet to make your
style tests easy to write and read.

Questions? Suggestions? [Contact us!](/contact/)

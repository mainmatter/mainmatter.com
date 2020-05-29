---
title: 'How to improve the accessibility of your existing Ember app'
author: 'Samanta de Barros'
github: sdebarros
twitter: sami_dbc
topic: ember
bio: 'Senior Frontend Engineer'
description:
  'Samanta de Barros on how to test the accessibility of your Ember app and what
  accessibility considerations you should have when creating forms in Ember.'
og:
  image:
---

Making sure your web app is accessible can be an effort similar to making sure
your app is well tested, or that it's responsive and works well accross devices:
it's great when you've thought of it from the start, but it can be daunting and
seem like an unattainable goal when you want to introduce it into a existing
app. Knowing where to start can be tough, as well as taking those first steps.

<!--break-->

For some time now, there's been an ongoing effort in the Ember community to make
accessibility an important consideration of the framework and to help developers
have an easier time building accessible apps – from talks, to tools. One
interesting tool is
[ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing), which
can help you detect accessibility violations both during testing and
development.

While working on a client project, we decided to make an effort to improve the
accessibility of that app, and this tool seemed like it would be a good start.
The first question we came across was, what's the best way to introduce these
tests when you have an app with an already big testing suite?

At the time, the best answer for us was to create dedicated acceptance tests for
accessibility, that would go through a couple of important flows within the app
rather than add those checks on the already existing tests. The reason for this
was that we were dealing with an incomplete testing suite where
tests didn't follow the same patterns, some would test flows, other would
test just parts of a page, so it was hard to define where to add the
accessibility checks so they would bring the most value.

To add accessibility checks, simply install the add-on.

```bash
ember install ember-a11y-testing
```

And add it to your tests, here's an example of an acceptance test:

```js
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import a11yAudit from 'ember-a11y-testing/test-support/audit';

module('Acceptance | accessibility check', function (hooks) {
  setupApplicationTest(hooks);

  test('sign in page has no accessibility issues', async function (assert) {
    await visit('/signin');

    await a11yAudit();

    // you need at least one assert, so if all a11y checks pass
    // so does your test
    assert.ok(true, 'no a11y errors found!');
  });
});
```

You can also add these validations to integration tests. When creating your
component and adding the integration tests, it would be a good idea to add a
test for accessibility checks. If you have well tested components, it could be
interesting to adopt the accessibility checks as part of the development process
of said components, making sure that both new components or changes to existing
component don't introduce any violations of accessibility rules.

```js
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import a11yAudit from 'ember-a11y-testing/test-support/audit';

module('Component | login-form', function (hooks) {
  setupRenderingTest(hooks);

  test('login form has no accessibility issues', async function (assert) {
    await render(hbs`<LoginForm/>`);

    await a11yAudit();
    assert.ok(true, 'no a11y errors found!');
  });
});
```

The `a11yAudit` helper will inspect the rendered page or component and it will
raise an error if it finds any accessibility violations. The great thing about
it, is that it will list all violations with it's severity and will even include
a link to documentation for that rule, which includes an explanation of why the
rule exists and how to fix it. For instance,
[here's the information](https://dequeuniversity.com/rules/axe/3.5/autocomplete-valid?application=axeAPI)
for one of the validation errors we're getting.

![example of errors thrown by a11y in an acceptance test](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/acceptance-test-error.png#@1024-2048)

One issue we ran into, was that these tests brought up a lot of accessibility
violations, some of which we couldn't just fix on our own. For example, several
of the errors were due to color contrast issues, in a lot of cases, deciding on
(and changing) color schemes may not be entirely in your power, and it can
involve discussions with designers, product owners, and may even be influenced
by branding, but you can and should use this information to spark those
discussions and promote change.

If you're in the same situation, and fixing those errors is not something that
can be done all at once, you can opt for muting validations and taking an
incremental approach to making this improvements (similar to the upgrade path in
Ember were you can mute deprecations and work on them step by step).

```js
test('sign in page has no accessibility issues', async function (assert) {
  let axeOptions = {
    rules: {
      'autocomplete-valid': {
        enabled: false,
      },
      'duplicate-id': {
        enabled: false,
      },
      label: {
        enabled: false,
      },
      'link-name': {
        enabled: false,
      },
    },
  };
  await visit('/signin');

  await a11yAudit(axeOptions);
  assert.ok(true, 'no a11y errors found!');
});
```

If you happen to have a very long list of rules to mutate, you may want to do
something like:

```js
function axeOptions(disabledRules) {
  let rules = {};

  disabledRules.forEach((r) => {
    rules[r] = { enabled: false };
  });

  return { rules };
}

test('sign in page has no accessibility issues', async function (assert) {
  await visit('/signin');

  await a11yAudit(
    axeOptions(['autocomplete-valid', 'duplicate-id', 'label', 'link-name']),
  );
  assert.ok(true, 'no a11y errors found!');
});
```

You can then remove the rules one by one as you fix the violations.

The [ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing)
add-on provides other helpers and options, and can even be used in developmen to
detect these issues visually while you work,
[so don't forget to read the docs!](https://github.com/ember-a11y/ember-a11y-testing)

## A few considerations when implementing forms

Back to our existing app case, we realized that using the test information and
fixing these issues as an effort in itself (independent from feature
development) would take a lot of time and was going to be a tough sell. So we
decided to start acting on these improvements gradually, and taking a more
mindfull approach when developing, trying not to introduce new issues and make
improvements where possible. One of these opportunities presented itself when making
improvements to a relatively simple page with a form.

Here are some of the things we had to improve, and why you should keep them in
mind.

### Labels, labels, labels

This may seem obvious, but your inputs should have labels that indicate what
information is required. The maybe not so obvious part is that labels should be
linked to those inputs. As an example, the failing test above: the labels exist
and are visually on top of the inputs, but in the HTML it is not clear the label
belongs to that input.

```html
<div id="ember8" class="x-label ember-view">
  <label class="x-label__label">
    Email address
  </label>
</div>
<div id="ember9" class="x-input-beta ember-view">
  <input
    placeholder="Enter your email address"
    autocomplete="off"
    class="x-input-beta__input"
    type="email"
  />
</div>
```

There are different options to fix this: rearrange the HTML and have the label
wrap the input, use the `for` attribute on the label to point to the input's
`id`, using `aria-labeledby` on the input to point to the label's `id`, or if
none of this is an option that works in your case, use `aria-label` on your
input as shown below:

```html
<input
  placeholder="Enter your email address"
  type="email"
  aria-label="Email address"
/>
```

Ideally this should match the visual label, to avoid any possible confusion.

### Labels and placeholders that make sense

Missing labels are one of the possible violations that
[ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing) will
detect for you, but having labels that make sense, on their own and in the context of
the form and page, is something that only you can do, no automatic tools will do
it for you (as far as I know). To understand why and also to have a better idea
of how accessible your app is, I highly suggest using a screen reader to
navigate your page and try to perform the action you want your users to perform
(in this case, filling out a form and submitting it). I can assure you if you've
never done it before, it will be mind opening.

Now, I know using a screen reader is not something everyone is acquainted with
(I wasn't), you can find resources on how to start
([like this one](http://uncaughtreferenceerror.com/a-crash-course-to-screenreaders-for-sighted-developers/))
and if you use a Mac for development, you can use Voice Over which already comes
installed. Just think of it as another tool that should be part of your
development process.

### Groups of fields

Another interesting case we came across was a group of inputs we had for
entering a date. There where three inputs, for day, month and year and they had
the placeholders "DD", "MM", "YYYY". This may seem clear enough when looking at
the whole page, but can be strange when you're using your keyboard to navigate
and listen 'DD' as the whole explanation for the field. Even having labels such
as 'Day', 'Month', 'Year' may not be sufficient context. For this case, we found
that using `fieldset` was a good option. When you have a `fieldset` with a
legend, the screen reader will include this information when giving you the
information of an input it contains. See below:

![image of screen reader info for an input in a group with fieldset legend](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/group-with-fieldset-legend.png#@1024-2048)

_with fielset legend_

![image of screen reader info for an input in a group without a fieldset legend](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/group-without-fieldset-legend.png#@1024-2048)

_without fielset legend_

Another case where you should consider using a `fielset` is whenever you have
big forms that may have a logical grouping of fields, for instance a group of
inputs relating to an address inside a bigger form.

![address form example](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/address-form.png#@900-1800)

In such cases it is better to use a `fieldset` with a `legend`, `<legend>Postal address</legend>`, instead of a heading element and a `div` grouping the fields.

### Tab index

If you have a well structured page and you're not rearranging input orders by
CSS or JS, your best bet is to just rely on the browser and not set a tab index
value on your inputs. This will ensure that when navigating with the keyboard
you will move through the form as you would expect, in the order the elements
are shown on the screen.

This is not always possible, and in some cases you will have to resort to
setting `tabindex` to make sure the keyboard navigation is consistent. Always
make sure to test these cases manually, there's nothing more frustrating then
having the inputs being skipped or having a jumping order when using only the
keyboard to fill out forms.

### Visually indicating focus

For those sighted users that rely on keyboard navigation, being able to
determine visually when an input is focused is also important. When using native
inputs with their default styles, the browser will take care of this for you.
But we often rely on custom implementations of inputs to make them more visually
appealing and forget to set specific styles for the focused state. This can
create a scenario where you tab through the fields of your form, and have no
idea where exactly you're focused until you try to enter some content.

One scenario where this might happen, is when the `outline` of elements is set
to none. This is usually to avoid the browser's default outline.

![select-with-default-outline](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/select-with-default-outline.png#@700-1400)

In this scenario, don't forget to set a style for the `:focus` state. For
instance, the following can be achieved by the CSS below.

![select-with-custom-outline](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/select-with-custom-outline.png#@700-1400)

```css
select:focus {
  border-color: #01c3a7;
}
```

Another scenario is when creating custom checkboxes, which usually involve not
showing an actual checkbox. This may be a more complicated case, but if your
custom implementation includes a hidden checkbox, you can use that to set the
focus styled. If not, you should really reconsider your implementation.

For example, the following checkbox can be implemented with the code below,
where the actual checkbox is hidden but is still used for the states.

| unfocused                                                                                                                                | checked                                                                                                                                | focused                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ![custom-checkbox-unfocused](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/custom-checkbox-unfocused.png) | ![custom-checkbox-unfocused](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/custom-checkbox-checked.png) | ![custom-checkbox-focused](/assets/images/posts/2020-05-29-how-to-improve-the-accessibility-of-your-app/custom-checkbox-focused.png) |

```html
<label for="my-checkbox">
  <input class="custom-checkbox" id="my-checkbox" type="checkbox" />
  <span>Label</span>
</label>
```

```css
input[type='checkbox'].custom-checkbox {
  width: 0;
  height: 0;
  border: none;
  padding: 0;
  margin: 0;
}

input[type='checkbox'].custom-checkbox + span {
  position: relative;
}

input[type='checkbox'].custom-checkbox + *::before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 1px #c0c9cc solid;
  background: #fff;
}

input[type='checkbox'].custom-checkbox:checked + *::before {
  background: #01c3a7 url(images/checkmark_success_white.svg) center no-repeat;
  border-color: #01c3a7;
  background-size: 60%;
}

/* our focus style */
input[type='checkbox'].custom-checkbox:focus + *::before {
  border-color: #01c3a7;
}
```

### Enter should submit your form

Another thing to keep an eye out for, is that you can submit the form just
using your keyboard. Especially when developing an Ember app, you may implement forms
that don't include an actual `form` element. Wether that's the case or not, at
least the submit button should respond to `Enter`, and why not... even the other
fields.

This is by no means a comprehensive list, there are other accessibility
considerations to have in mind when working with forms, such as making sure errors
are detected by the screen reader, that custom components behave well when using
just the keyboard, etc. The important thing to remember is you're not alone in
this, there are [tools](https://github.com/ember-a11y/ember-a11y) and
[resources](https://guides.emberjs.com/release/accessibility/components/) to
help, and if you don't know where to start, start with the tests.

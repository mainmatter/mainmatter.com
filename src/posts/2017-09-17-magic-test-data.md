---
title: Magic Data in Tests
authorHandle: geekygrappler
bio: 'Senior Frontend Engineer'
description:
  'Andy Brown explains the AAA principle for writing good tests and discusses
  what the negative consequences of not adhering to it are.'
topic: misc
---

Often when working on large codebases, my changes break some existing tests.
While I would prefer my coding to be perfect, it's highly unlikely that I'll
ever achieve the state of coding zen, so it's nice to know I have a test suite
to catch me when I fall. Given that the codebase is large and in the majority
not written by me, I tend to be introduced to code via the test files. One
important principle I've started to follow when writing and refactoring tests is
AAA.

<!--break-->

The [AAA principle](http://wiki.c2.com/?ArrangeActAssert) for testing is Arrange
Act Assert and it's Amazing. The TL;DR is:

- Setup the data/inputs for the code you're testing (Arrange)
- Invoke the code you are testing (Act)
- Check the result is what you want (Assert)

The simple example is:

```js
test('toLowerCase makes string all lower case', function (assert) {
  /* Arrange */
  const string = 'ABC';

  /* Act */
  const result = string.toLowerCase();

  /* Assert */
  assert.equal(result, 'abc');
});
```

If you have a test that doesn't Arrange, your test may be brittle.

Don't believe me? Lets go through a real life example. You are tasked with
making a country/language picker for a website that looks something like this.

![Country picker component](/assets/images/posts/2017-09-25-magic-test-data/tl-country-picker.png)

You will probably have a hardcoded list of countries that your website supports
somewhere in your app.

```js
// config/countries.js
export default [
  {
    country: 'DE',
    locale: 'de',
    region: 'europe',
    name: 'Germany',
  },
  {
    country: 'GB',
    locale: 'en',
    region: 'europe',
    name: 'United Kingdom',
  },
];
```

We need to write a function that adds a url pointing to an image of the country
flag so that the component can display that flag image.

So we write a component, here we're using Ember, but the principle is similar
for any JS framework or vanilla JS.

```js
import Component from '@ember/component';

/* the countries!! */
import COUNTRIES from 'config/countries';

export default Component.extend({
  displayCountries: function() {
    return COUNTRIES.map(country => Object.assign({}, country, { flag: `/assets/images/flags/${country.country}.png` }));
  })
});
```

Now you can have a test that does no arranging.

```js
test('displayCountries', function(assert) {
  /* This is an act */
  let displayCountries = this.subject().get('supportedCountries');

  /* This is assert */
  assert.deepEqual(displayCountries[0], { name: 'Deutschland' locale: 'de', country: 'DE', region: 'europe', flag: '/assets/images/flags/DE.png' });
});
```

This test will pass.

![Celebration gif](/assets/images/posts/2017-09-25-magic-test-data/celebrate.gif)

I don't think it's a good test though.

![Fry suspicious gif](/assets/images/posts/2017-09-25-magic-test-data/fry.gif)

<strong>The test is brittle.</strong>

Let's say our business development team have made inroads into Bulgaria and now
we need to add it to the the list of countries and locales.

```js
// config/countries.js
export default [
  {
    country: 'BG',
    locale: 'bg',
    region: 'europe',
    name: 'Bulgaria',
  },
  {
    country: 'DE',
    locale: 'de',
    region: 'europe',
    name: 'Germany',
  },
  {
    country: 'GB',
    locale: 'en',
    region: 'europe',
    name: 'United Kingdom',
  },
];
```

The test will now fail without us having changed the code. No code change, no
behaviour change, but failing tests. The definition of a brittle test. The test
relies on magic data from an external file, namely `COUNTRIES`. It may only take
the original writer of the test minutes to figure out why the test fails, but it
might take any one new to the code unit a bit longer to figure out why.

What you should do is _Arrange_ the data. When you do this it becomes clear that
the function is simply adding a key, and it won't break due to external data
changes. All you care about is that given a starting set of data, after applying
your function you get the resultant set of data, as clearly defined in the test.

First we need to stop using a constant directly in our component. This way we
can override the `countries` property in the test and _arrange_ the data.

```js
import Component from '@ember/component';

/* the countries!! */
import COUNTRIES from 'config/countries';

export default Component.extend({
  countries: COUNTRIES,

  displayCountries: function() {
    let countries = this.get('countries'); // This is equivalent to `this.countries` but for Ember objects.
    return countries.map(country => Object.assign({}, country, { flag: `/assets/images/flags/${country.country}.png` }));
  })
});
```

```js
test('displayCountries will add a flag key to a country object', function (assert) {
  /* Arrange */
  const component = this.subject({
    countries: [
      {
        country: 'SK',
        locale: 'we',
        region: 'westeros',
        name: 'Seven Kingdoms',
      },
    ],
  });

  /* Act */
  const result = component.get('displayCountries');

  /* (Write out my expectation for aesthetics) */
  const expectedResult = [
    {
      country: 'SK',
      locale: 'we',
      region: 'westeros',
      name: 'Seven Kingdoms',
      flag: '/assets/images/flags/SK.png',
    },
  ];

  /* Assert */
  assert.deepEqual(result, expectedResult);
});
```

I feel much better about this test. It is no longer brittle as it's not
dependent on an external `JSON` file.

And I get to commit GoT & LOTR to the code base.

![Game of Thrones gif](/assets/images/posts/2017-09-25-magic-test-data/GoT.gif)

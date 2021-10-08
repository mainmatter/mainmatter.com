---
title: "ember-intl data loading patterns"
authorHandle: tobiasbieniek
bio: "Senior Frontend Engineer, Ember CLI core team member"
description:
  "Tobias Bieniek shows how to load the necessary polyfills for the Intl API in
  older browsers most effectively when using ember-intl."
tags: ember
---

At simplabs we ❤️ [ember-intl][ember-intl] and use it for all our projects where
translations or other localizations are needed. ember-intl is based on the
native [Intl APIs][intl] that were introduced in [all newer browsers][browsers]
a while ago. Unfortunately some users are still using browsers that don't
support them and this blog post will show you our preferred way to load the
necessary polyfill and the associated data.

[ember-intl]: https://github.com/ember-intl/ember-intl
[intl]: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl
[browsers]: https://caniuse.com/#feat=internationalization

<!--break-->

## Loading Translations

Let's first start with how translations are loaded in ember-intl. By default
ember-intl will bundle all translations into your `app.js` file, which works
okay for small projects, but if you want to support more than 2-3 languages and
have a significant number of translations this will quickly bloat your bundle
size out of proportion.

The solution to this problem is "side-loading". After you have determined what
language/locale your users would like to see you load the translations using an
AJAX request and after that has finished you call `setLocale()` to activate the
new translations. It looks roughly like this:

```js
// app/routes/application.js

async beforeModel() {
  let locale = figureOutLocale(); // e.g. "de" or "fr-ch"

  let translations = await loadTranslations(locale);
  this.get('intl').addTranslations(locale, translations);

  this.get('intl').setLocale(locale);
}
```

To make this work we need to tell ember-intl that it should no longer bundle the
translations in the `app.js` file, and instead it should write them out as JSON
files into our `dist` folder. We can do so by opening the `config/ember-intl.js`
file, and adjusting the `publicOnly` property to `true`. If we now call
`ember build` and look at the `dist` folder we will see a `translations`
subfolder including JSON files for all existing translations.

We would like to make our translation loading code look a little simpler from
the outside, so what we could do is add a `loadTranslations()` method to the
`intl` service itself. For that we create a `myapp/app/services/intl.js` file
like this:

```js
import IntlService from "ember-intl/services/intl";
import fetch from "fetch";

export default IntlService.extend({
  async loadTranslations(locale) {
    let response = await fetch(`/translations/${locale}.json`);
    let translations = await response.json();
    this.addTranslations(locale, translations);
  },
});
```

Now we can simplify our code in the `application` route to this:

```js
async beforeModel() {
  let locale = figureOutLocale(); // e.g. "de" or "fr-ch"

  await this.get('intl').loadTranslations(locale);

  this.get('intl').setLocale(locale);
}
```

If we now open our app in the browser and look at the "Network" tab of the
browser we should see the app making an AJAX request for the translations before
it starts. 🎉

## Loading the Intl.js polyfill

As mentioned in the intro
[some browsers](https://caniuse.com/#feat=internationalization) need a polyfill
for the new `Intl` APIs. ember-intl makes this easy for us as it supports an
`autoPolyfill` option in its config file. Setting this option to `true` will
automatically add script tags like this to your `index.html` file:

```html
<script src="/assets/intl/intl.min.js"></script>
<script src="/assets/intl/locales/de.js"></script>
<script src="/assets/intl/locales/en.js"></script>
<script src="/assets/intl/locales/fr.js"></script>
```

That is a nice first step, but should not be used for any real user-facing apps.
The reason for this is that it adds a significant number of additional HTTP
requests to the startup time of your app, and those requests aren't even that
small. `intl.min.js` downloads roughly 40 kB and each locale script another 25
kB of uncompressed JavaScript code. It would be much better if we would only
load them if the browser actually needed the polyfill...

Let's turn off the `autoPolyfill` option and implement lazy loading of the
polyfill files instead.

The first thing we need for this is a function that downloads JS code and then
runs it. We could hack something together with `fetch()` and `eval()`, but there
is a better solution:

```js
function loadJS(url) {
  return new Promise((resolve) => {
    let el = document.createElement("script");
    el.src = url;
    el.onload = resolve;
    document.body.appendChild(el);
  });
}
```

The above function creates a `<script>` tag, sets the passed in `url` on it, and
returns a `Promise` that resolves once the script has loaded.

With the `loadJS` helper function in place we can add a `loadPolyfill()` method
to our `intl` service:

```js
async loadPolyfill() {
  await loadJS('/assets/intl/intl.min.js');
},
```

and then use it in the `application` route before downloading any translations:

```js
async beforeModel() {
  let locale = figureOutLocale(); // e.g. "de" or "fr-ch"

  if (!window.Intl) {
    await this.get('intl').loadPolyfill();
  }

  await this.get('intl').loadTranslations(locale);

  this.get('intl').setLocale(locale);
}
```

If you visit the app in your regular browser now you should _not_ see any
request for the `intl.min.js` file. But if you open the app in IE10 (e.g. via
<https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/>) you should
see the polyfill being loaded.

Unfortunately we're not done yet. While we have loaded the polyfill correctly,
we also need to load the locale data for the polyfill depending on what locale
the user chooses. For that reason we implement two more methods on the `intl`
service:

- a `loadPolyfillData()` method
- a `loadLocale()` method that combines `loadTranslations()` and
  `loadPolyfillData()`

```js
import IntlService from "ember-intl/services/intl";
import fetch from "fetch";

export default IntlService.extend({
  async loadTranslations(locale) {
    let response = await fetch(`/translations/${locale}.json`);
    let translations = await response.json();
    this.addTranslations(locale, translations);
  },

  async loadPolyfill(locale) {
    await loadJS("/assets/intl/intl.min.js");
  },

  async loadPolyfillData(locale) {
    await loadJS(`/assets/intl/locales/${locale}.js`);
  },

  async loadLocale(locale) {
    let promises = [this.loadTranslations(locale)];

    if (window.Intl === window.IntlPolyfill) {
      promises.push(this.loadPolyfillData(locale));
    }

    await Promise.all(promises);
  },
});
```

If we now switch our `application` route implementation from
`loadTranslations()` to `loadLocale()` we should see the locale data being
requested in IE10.

In case you're wondering what "locale data" actually means: it includes
information for the Intl.js polyfill on how to format dates, time and numbers
and several other things that are handled in a locale-aware way in the Intl API.

## Summary

In this blog post we have learned how to reduce our bundle size in several ways
when using the [ember-intl][ember-intl] addon. We are now loading only the code
and data that we actually need for the specific browser. Most users don't pay
the extra cost of loading the polyfill and related data, and for the browsers
that do need it, it's available on demand.

If you have any questions about these patterns or need help implementing them in
your apps feel free to [contact us](/contact/).

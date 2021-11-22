---
title: 'Ember Simple Auth 1.0 - a first look'
authorHandle: marcoow
bio: 'Founding Director of simplabs, author of Ember Simple Auth'
description:
  'Marco Otte-Witte gives an outlook on Ember Simple Auth 1.0 with Ember.js 2.0
  support, a session service and discontinued support for non-Ember CLI
  projects.'
tags: ember
tagline: |
  <p>The <strong>first beta of Ember Simple Auth 1.0 will be released soon</strong> and this post provides a first look at the changes that come with it.</p>
---

## Ember 2.0 Compatibility

The biggest improvement of course is that the **library will be compatible with
Ember 2.0** (which is mainly due to the fact that it now uses instance
initializers for a majority of its setup work). Also when using Ember 1.13 you
shouldn’t be seeing any deprecations triggered by Ember Simple Auth anymore so
that the upgrade path to 2.0 is clean.

## Session as a Service

While previous versions of Ember Simple Auth injected the session into routes,
controllers and components, **Ember Simple Auth 1.0 drops that and instead
provides a new `Session` service** that encapsulates all access to the actual
session and can simply be injected wherever necessary, e.g.:

<!-- prettier-ignore -->
```js
{% raw %}
import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),

  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:oauth2-password-grant', data).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});
{% endraw %}
```

It provides a similar UI as the old session object, including `authenticate` and
`invalidate` methods. Instead of reading the session content directly from the
session as was the case in old versions of the library, the session provides a
`content` property that can be used to read and write date from and to the
session.

Also support for defining a custom session class has been dropped in favor of
defining a service that uses the session service to provide functionality based
on that. E.g. the typical use case of providing access to the authenticated
account can now easily be implemented with a `SessionAccount` service that in
turn uses the `Session` service:

<!-- prettier-ignore -->
```js
{% raw %}
import Ember from 'ember';

const { inject, computed, isEmpty } = Ember;

export default Ember.Service.extend({
  session: inject.service('session'),

  account: computed('session.content.secure.account_id', function() {
    const accountId = this.get('session.content.secure.account_id');
    if (!isEmpty(accountId)) {
      return DS.PromiseObject.create({
        promise: this.container.lookup('store:main').find('account', accountId),
      });
    }
  }),
});
{% endraw %}
```

## Ember CLI only

While previous versions of Ember Simple Auth provided 3 different versions (AMD,
globals and the Ember CLI addons) where the Ember CLI addon was also split up
into several sub addons, **1.0 will come as one single Ember CLI addon**. This
offers 3 main advantages:

- The project structure is the standard Ember CLI addon structure and no longer
  a custom set of grunt tasks etc. This not only makes the development and
  release process much simpler but also promotes contributions from others.
- It is now much simpler to install Ember CLI as it’s now only
  `ember install ember-simple-auth` command instead of install at least 2
  packages or potentially more.
- Since all the source is now transpiled with Babel as part of the Ember CLI
  build process, all the source code has been updated to use thinks like
  template strings, function literals, deconstruction etc., making the code far
  more concise and readable.

## Getting to 1.0

1.0 is still not fully finished and ready for release. While I plan to release a
first beta until next week latest, getting to the final release still requires
some work:

- The docs need to be updated to fit the new API and modules. Existing
  documentation is still based on classes and namespaces and we need to find a
  way to convert that so we document modules instead.
- The docs are also not complete for new features like the **Session** service
  and existing documentation needs to be reviewed for whether it’s actually
  still correct.
- The code should be reviewed and cleaned up before the final 1.0 release - much
  of it is still what I wrote almost 2 years ago when I was still relatively new
  to Ember and could probably be greatly improved.
- The setup of the AJAX prefilter should be decoupled from the library so that
  it’s opt-in and could be replaced with a different approach (e.g. sth. that
  sets a property on the application’s Ember Data adapter instead) - see
  [#522](https://github.com/simplabs/ember-simple-auth/pull/522) and
  [#270](https://github.com/simplabs/ember-simple-auth/issues/270). A
  compatibility Addon should be extracted that implements the current behavior
  of setting up the prefilter automatically.

You can track the progress in the `jj-abrams` branch and if you want to submit a
PR for any of the above mentioned tasks that would be greatly appreciated of
course!

---
title: 'Grouping console output by tests in QUnit'
author: 'Tobias Bieniek'
github: Turbo87
twitter: tobiasbieniek
topic: ember
bio: 'Senior Frontend Engineer'
description: 'Tobias Bieniek introduces our most recent open-source project: qunit-console-grouper.'
---

Is your test suite showing deprecation warnings or errors on the console and
you have a hard time figuring out what test they belong to? We often had issues
like that when looking at the test suites of client projects and until now we
always copied a small snippet around to help us with that. This week, we
finally had time to convert this into a proper [QUnit] plugin and
[Ember.js] addon.

[QUnit]: https://qunitjs.com/
[Ember.js]: https://emberjs.com/

<!--break-->

## Introducing ...

🎉 [qunit-console-grouper] 🎉

This new project is a regular QUnit plugin that can be used via a `<script>`
tag, but just like with [qunit-dom] it is also an Ember.js addon at the same
time. That means, you only need to `npm install` (or `yarn add`) it and it will
automatically hook itself into the build pipeline and magically just work. 🧙‍

Enough words, let's look at an example of how this looks like:

![Screenshot of qunit-console-grouper](/assets/images/posts/2019-09-27-qunit-console-grouper/screenshot.png)

Previously, all those warnings would have been in one long list, with no
reference to the test that caused them. With qunit-console-grouper it is now
much easier to figure out that the `linkAttachmentTask` test suite in this
example is causing these deprecation warnings.

If you want to give this a try, the install instructions are in our
[README](https://github.com/simplabs/qunit-console-grouper/#install) and if you
have any feedback we'd love to hear from you in the
[Issues](https://github.com/simplabs/qunit-console-grouper/issues/new) section
of the project! ✨

[qunit-console-grouper]: https://github.com/simplabs/qunit-console-grouper/
[qunit-dom]: https://github.com/simplabs/qunit-dom/

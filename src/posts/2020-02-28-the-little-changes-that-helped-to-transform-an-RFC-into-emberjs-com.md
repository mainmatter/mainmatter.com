---
title: 'The little changes that helped to transform an RFC into emberjs.com'
authorHandle: pichfl
tags: design
bio: 'Consultant for Design & Technology'
description:
  'Florian Pichler highlights details of the just released overhaul of the
  landing page for Ember.js, looking specifically at how a distributed team of
  volunteers can achieve consistent design.'
og:
  image: /assets/images/posts/2020-02-28-the-little-changes-that-helped-to-transform-an-RFC-into-emberjs-com/og-image.png
tagline: |
  <p>The new landing page for Ember.js is a big project.</p> <p>In 2018 there was <a href="https://github.com/emberjs/rfcs/pull/425">an RFC</a> for updating the website. Which was a great thing, but there was just a mockup for the desktop website and a few of the interactive states. No version for small screens, no layout grid or repeatable measures.</p> <p>So besides development, there was the task of converting this initial design mockup into a full-featured design system with elements and components that can be reused across the large Ember.js universe for which the landing page is only the doorway.</p> <p>This post highlights some of the changes I proposed and which made it to the final website.</p>
---

## Side by side

![Side by side comparison of the original website mockup from the RFC and the final mockup created by me](/assets/images/posts/2020-02-28-the-little-changes-that-helped-to-transform-an-RFC-into-emberjs-com/before-after.jpg#full@1200-2761)

<small>You can also download a
[full sized comparision, side by side](https://user-images.githubusercontent.com/194641/75565735-c9559700-5a4e-11ea-8dd2-5bae88a694e0.jpg).
Be warned, it is huge.</small>

## Large changes

After a discussion with the Ember Learning Core team, the "Try out" section was
removed. There wasn't enough time left to create the section in a meaningful way
and it didn't communicate the real strengths of Ember.js.

We unfolded the tabs in the Batteries included section, so the core benefits of
Ember are visible right away. This gave us a chance to add playful illustrations
and lighten up the otherwise quite technical content.

## Little changes, big effort

### A new font for Ember.js

The font choice for the original RFC was lovely, and we are big fans of the
Metric fonts by Klimt, but it was necessary to find a solution that is open
source and does not involve licensing costs. After testing eight or more other
alternatives, we settled on an excellent open source font:

![Font sample for Inter font](/assets/images/posts/2020-02-28-the-little-changes-that-helped-to-transform-an-RFC-into-emberjs-com/inter.png#@860-1720)

Meet [**Inter**](https://rsms.me/inter/), the new font representing Ember.js
typographically in written word. It is not only well suited and tailor-made for
user interfaces in general, but provides an exceptional range of cuts for all
applications. It is both friendly and has an earnest quality that balances well
against the playfulness of the Ember.js logo and mascots.

### Typography

The new website now has a typographic scale which provides not only a range of
font sizes and appropriate line spacings, but also includes harmonic offsets
that can be applied across the design, making it easy to add white space and
layout organization to any element on a page.

### Half a gradient of colors

![Slate gradient, Ember brand color with gradiated variations](/assets/images/posts/2020-02-28-the-little-changes-that-helped-to-transform-an-RFC-into-emberjs-com/gradient.png#@860-1720)

The RFC mockup introduces a new slate color to mark a new era for Ember. The
Ember red represents the community. The new slate stands for the professionalism
and strong foundation in quality. In short, they are meant to symbolize that
Ember's strength lies in its an amazing community and reliability for
businesses.

As you might have noticed, we are still lacking secondary colors, which are not
settled yet and will become part of the second pass of changes to the Ember.js
website ecosystem.

## Style guide

Having a mockup is nice, but it doesn't solve the complex task of building a
theater of pages and small web apps which in total represents the online
presence of Ember. We now have a living breathing style guide, which is both an
ember-cli addon that can be consumed by the website and all the adjacent
projects, but also live documentation that can be viewed online and, no
surprise, is an Ember application itself, thanks to the magic of
[empress][empress] and [ember-styleguide][ember-styleguide].

[empress]: https://github.com/empress/field-guide
[ember-styleguide]: https://github.com/ember-learn/ember-styleguide/pull/145

The style guide provides both actual Ember components that can be applied to any
Ember project and a full set of CSS custom properties and helpers which make it
easy to create good looking pages from scratch.

![Examples for components created for the Ember Style Guide project](/assets/images/posts/2020-02-28-the-little-changes-that-helped-to-transform-an-RFC-into-emberjs-com/components.png#full@860-1720)

Beyond the purely visual aspects of the design, I also introduced some
lightweight CSS helpers for things like spacing, font sizes, grid and layout.
Some of them were inspired by [Tailwind][tailwind], while others are explicitly
narrow in their options to ensure overall consistency and to make them easier
for contributors of the website to work with. Take a look at the [styleguide
preview][styleguide-preview] to learn more about this.

[tailwind]: https://tailwindcss.com
[styleguide-preview]: https://deploy-preview-145--ember-styleguide.netlify.com/

## Thanks

Allocated time donated by simplabs allowed me and others to bring the styleguide
and overall design of the website to what you can see online now. I was very
honored by being invited to this project and my design changes were just an ever
so small piece of the huge effort that went into the website from every single
human on this team.

I'm glad we made it, and I'm looking forward to contributing more and updating
all the other aspecs of the Ember.js website landscape soon.

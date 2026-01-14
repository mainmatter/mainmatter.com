---
title: "Ember Initiative: How pairing sessions are growing the Ember community"
authorHandle: academierenards
tags: [ember, embroider, vite]
bio: "Marine Dunstetter, Senior Software Engineer"
description: "A Post describing how the Ember Initiative pairing sessions our team attends with members benefit the entire Ember community"
autoOg: true
customCta: "global/ember-cta.njk"
tagline: |
  <p>
  When you chose a framework to develop your application, you want to ensure the ecosystem you’ve invested in continues to evolve according to the latest standards. The <a href="/ember-initiative/">Ember Initiative</a> offers a solution for the Ember framework. Members receive one-on-one pairing sessions with the Ember Initiative team to get help with their own codebase. But that’s not all. The Ember Initiative is about keeping the entire ecosystem performant and up to date. Members also contribute to this goal because, as developers, our challenges are often shared by the whole community.
  </p>
---

Whenever you face a technical problem while developing a product, chances are you’re not alone. We all likely encounter the same issues repeatedly—we just don’t realize it, since we work in different companies and teams.

When you run into a problem with open-source code, the best course of action is to improve it, so everyone facing the same issue can benefit from your contribution. And if others do the same, _you_’ll benefit from _their_ work too. However, there are two main obstacles: you’re usually too busy with other priorities, or the open-source codebase is too complex to tackle the issue in the limited time you have.

The [Ember Initiative](/ember-initiative/) offers a solution for issues related to the Ember ecosystem. The members can participate in pairing sessions with us—the Ember Initiative team. Whenever we identify a problem outside their codebase, we can address it upstream—either with them or for them—so the solution benefits the entire community. Every time a member thinks, _“If only I could fix this upstream…”_ during a pairing session, that thought becomes an actionable task on [our board](https://github.com/orgs/mainmatter/projects/14/views/7).

Here are a few examples of how our members have contributed to the broader community through pairing sessions.

## We Contribute to Embroider

Since Ember Initiative members are typically interested in building their Ember apps with Vite, pairing sessions sometimes uncover issues in Embroider itself. Contributing to Embroider usually involves a steep learning curve—it’s the kind of project that requires more than just a few hours and good intentions. As the Ember Initiative team, we’re in an ideal position to push changes upstream to Embroider.

**Example:** Working in a real-world context revealed module cycle issues in Ember applications using TypeScript. This happened because app files weren’t filtered from the compat modules when an `app.ts` file was present instead of an `app.js`. We used the Ember Initiative to fix this issue outside of pairing sessions. ([embroider#2639](https://github.com/embroider-build/embroider/pull/2639))

## We Maintain Essential Codemods

When aligning a classic Ember app with a modern stack (such as GJS files and Vite builds), tools like [template-tag-codemod](https://github.com/embroider-build/embroider/tree/main/packages/template-tag-codemod) and [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod) are invaluable. Our members often work with large, complex applications that include customizations and edge cases not initially covered by these codemods. Pairing sessions provide an opportunity to expand the capabilities of these tools and improve them for everyone.

**Example:** We revamped the exit process of ember-vite-codemod to allow all tasks to be imported individually. This enables members with large applications to run specific parts of the codemod instead of the entire process, and even insert custom steps not included in the generic codemod. ([ember-vite-codemod#100](https://github.com/mainmatter/ember-vite-codemod/pull/100))

## We Upgrade Addons

Addons used by Ember Initiative members receive extra attention. The Ember Initiative allocates time to migrate them to the v2 format and ensure our members have high-performing, compatible addons.

**Example:** We helped migrate [ember-scroll-modifiers](https://github.com/elwayman02/ember-scroll-modifiers) to the v2 format. There was an initial attempt by community members in September 2024, but completing such an upgrade is non-trivial, and the pull request was abandoned. The Ember Initiative allowed us to revisit this. With our experience and methodology, we completed the work. This was made possible by the responsiveness of the maintainer, elwayman02, who regularly merged our PRs—many thanks to him. ([#1268](https://github.com/elwayman02/ember-scroll-modifiers/pull/1268), [#1273](https://github.com/elwayman02/ember-scroll-modifiers/pull/1273), [#1274](https://github.com/elwayman02/ember-scroll-modifiers/pull/1274), [#1275](https://github.com/elwayman02/ember-scroll-modifiers/pull/1275), [#1276](https://github.com/elwayman02/ember-scroll-modifiers/pull/1276))

## We Create New Tools

Ember Initiative members develop innovative tools to address their specific needs, and pairing sessions help explore how these tools can be adapted for the broader community.

**Example:** A performance test implemented by Discourse inspired the [build-start-rebuild-perf](https://github.com/mainmatter/build-start-rebuild-perf) tool, which provides metrics about your application’s build time. Following the protocol described in our blog post, [Ember Initiative: Tell us how much faster Vite makes your Ember app](https://mainmatter.com/blog/2025/12/10/ember-initiative-vite-performance/), you can help us gather data on how Vite performs in your application compared to classic builds.

## We Shape the Future of the Ecosystem

We mentioned earlier that pairing sessions can help identify gaps in Embroider, but our findings often extend to the broader ecosystem. Working with real-world applications helps us pinpoint which best practices haven’t been widely adopted yet and need further promotion. Additionally, missing features or optimizations in complex projects can become the next must-have for the entire community.

**Example:** Babel parsing is an expensive operation that runs on all files because the resulting AST is needed to determine whether a file requires transformation. Our member [Discourse](https://github.com/discourse/discourse/blob/f1f3e287a3602fd2faf54fc8444d506a61e99cfb/frontend/discourse/lib/vite-maybe-babel.js#L19C12-L19C12) implemented a Babel optimization by leveraging the much faster Rolldown parser to skip Babel plugin processing when no transformations are required. This approach could serve to inspire solutions aimed at reducing build times, particularly during dependency optimization.

## Conclusion

Being a member of the Ember Initiative is about more than just getting help with your Ember stack (though you do get that too). It’s about directly shaping the future of Ember. _Your_ day-to-day experiences—the challenges _you_ face in the applications you deliver to users—help define what the entire community needs and what the framework should become to continue fulfilling its mission: enabling developers to build robust, high-quality applications as smoothly as possible.

To be part of the future of Ember, [reach out to us](/contact/) and join the Ember Initiative. Spread the word and follow our progress on this blog.

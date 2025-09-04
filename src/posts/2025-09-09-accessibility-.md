---
title: "Useful accessibility tools and browser extensions"
authorHandle: pichfl
tags: [a11y, accessibility, frontend]
bio: "Florian Pichler, Software Developer"
description: "The EAA is here, use smart tools to act and improve your web applications."
autoOg: true
tagline: <p>Add new tools to your toolbelt to validate and improve a11y in your your web application.</p>
---

No matter what industry you're in, accessibility has been the word on all web developers’ lips lately. While being an evergreen topic, there’s also the [new EU legislation](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en) that expect sites to adhere to certain accessibility guidelines. In practice accessibility, or a11y, means building products that everyone can use.

For us at Mainmatter, this is a crucial part of delivering quality software.

While some accessibility challenges require careful design and human judgment, there are many technical issues that can easily be discovered automatically. That’s where browser extensions and testing tools come in. Here’s a list of tools that will help you work smarter, not harder:

## Your browser comes with built-in tools

Chrome's developer tools feature an [Accessibility tab](https://developer.chrome.com/docs/devtools/accessibility/reference#tab) within the Elements panel, along with a floating toggle icon that displays your website's accessibility tree structure, providing immediate insight into how assistive technologies interpret your content.

Firefox takes this further by offering [additional specialized tools](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/), including a tab order visualizer that shows keyboard navigation flow and built-in simulations for various visual conditions like color blindness and contrast issues.

## Extensions

[Google Lighthouse](https://developer.chrome.com/docs/lighthouse?hl=de)

Built directly into Chrome, Lighthouse offers a solid foundation for accessibility investigations. While its scoring system doesn't cover every accessibility concern, it provides valuable direction for achieving fundamental compliance standards.

[axe DevTools](https://www.deque.com/axe/devtools/web-accessibility) - [Chrome](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) [Firefox](https://addons.mozilla.org/de/firefox/addon/axe-devtools/)

The full page scan feature gives a good overview and can be used for free without creating an account. The pro features make a big difference and help you detect and analyze more complex problems.

[IBM Equal Access Checker](https://www.ibm.com/able/toolkit/tools/#develop) (extensions linked in the page)

Not as automated as the axe DevTools, but the page reports are really detailed and can even be downloaded as reports. Very useful for documentation and creating tasks for your development cycle.

[WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org) (extensions linked in the page)

The only extension that doesn’t live quite within the DevTools. It’s navigation order and structure features help you identify problems in your content flow that can be hard to notice otherwise and are a big step up from the basic tree built into the Chrome DevTools.

At the end of the day, it’s mostly about discovery. These tools can help you surface the most common pitfalls and help you build a strong product that can truly be enjoyed by everyone. We hope you found this list helpful, and if you want to go beyond the basics, we at Mainmatter are always here to help.

---
title: "Making Your Web Application Compliant With the European Accessibility Act"
authorHandle: zeppelin
tags: [process]
bio: "Gabor Babicz, Senior Software Engineering Consultant"
description: "Why making your digital product comply with the European Accessibility Act by June 2025 requires web engineering expertise."
og:
  image: "/assets/images/posts/2025-02-20-making-your-web-application-compliant-with-the-european-accessibility-act/og-image.png"
tagline: |
  <p>
    The European Accessibility Act (EAA) is already in effect, and by June 2025, digital products targeting European users must be fully accessible to people with disabilities. If you haven't started planning for compliance, now is the time because non-compliance could cost your business.
  </p>
---

**TL;DR:** By June 28, 2025, all digital products and services targeting EU users must meet accessibility standards under the [European Accessibility Act (EAA)](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en). This includes everything from websites and apps to platforms. Failing to comply could result in fines up to €20,000 per violation with additional daily penalties. Meeting these requirements involves deep web engineering expertise. Mainmatter can help modernize your web applications to improve the experience for all your users and minimize legal risk.

## What is the **European Accessibility Act**?

With the **[European Accessibility Act (EAA)](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en)**, the EU requires digital products to be accessible, improving access for people with all sorts of disabilities.

Failing to comply can lead to fines and legal action, especially if essential services remain inaccessible. To meet compliance requirements, businesses should conduct audits and integrate accessibility into their software development process. Prioritizing accessibility creates a better experience for all users in addition to reducing legal risks.

### Compliance Timeline

Product teams need to focus on the **June 28, 2025** deadline which applies to most digital platforms (websites, mobile apps) and expect products to comply with EAA accessibility standards. Is is essential to prepare for it so as to ensure compliance, avoid penalties, and meet market expectations for accessible products.

## Meeting compliance requirements

Ensuring compliance with the EAA requires product design and engineering work. This section shows the key steps.

### Success criteria

Let's look at some specific accessibility criteria from [Web Content Accessibility Guidelines (WCAG) version 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/), which the EAA uses as a technical basis. The WCAG guidelines establish accessibility standards based on four key principles: **Perceivable**, **Operable**, **Understandable**, and **Robust**. Addressing them requires expertise in building web applications:

The WCAG guidelines define four key principles: **Perceivable, Operable, Understandable, and Robust**. Addressing them demands expertise in building web applications, not just surface-level fixes.

- Perceivable: Ensuring content is accessible means going beyond basic `alt` text. For example, maintaining a minimum contrast ratio of 4.5:1 for readability requires considering background images, branding, and a wide range of dynamic states. Similarly, input fields must be programmatically identifiable, ensuring screen readers correctly interpret form elements rather than relying on placeholder text alone.
- Operable: In order to offering a keyboard-accessible experience, developers need to proper focus support and prevent users from getting trapped in interactive elements like modal dialogs. Ensuring that touch targets meet the minimum size of 24x24 pixels requires thoughtful UI design in mobile interfaces.
- Understandable: Navigational elements must appear in a predictable order across pages, and buttons performing the same function must have uniform labels. More than just UX considerations, these require structured content modeling and rigorous front-end implementation.
- Robust: Proper use of [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) ensures assistive technologies interpret UI components correctly. A visually hidden success message must be conveyed programmatically using `role=status` so that screen readers announce it without disrupting user flow.

The examples above highlight how making your web application accessible isn't quick checkbox but requires deep technical expertise in web development.

### Automated tooling

Nowadays there’s a plethora of tools to help tackle the accessibility requirements. Most popular UI development frameworks such as Ember and Svelte document their solutions and integrations that help with a11y.

- Code analysis or linting tools that automatically and continuously check the code for missing or invalid HTML element attributes. They are easy to set up and provide quick feedback but are limited to most common issues. They represent a good starting point to making your web products accessible. An example of such a tool is [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint?tab=readme-ov-file).
- [Axe](https://www.deque.com/axe/) provides excellent accessibility analysis of web pages. By using [axe-core](https://github.com/dequelabs/axe-core), it can integrate with an automated test suite and inspect web pages or individual components according to all sorts of scenarios. For instance, here's an integration with the Playwright test framework: [axe-core/playwright](https://playwright.dev/docs/accessibility-testing).

### Manual testing

Although automated tools can significantly streamline the process, they cannot uncover more complex yet common issues. Complying with the EAA requires some manual auditing. Elements such as focus management, keyboard behavior, and, most importantly, ensuring that screen readers are provided with correct metadata must be checked manually and evaluated within the broader context of a webpage. Some tools can help conduct manual accessibility audits, for instance:

- [Axe extension](https://www.deque.com/axe/browser-extensions/): Axe is a browser extension developed by the creators of Axe-core. It allows you to run Axe-core directly in your browser to assist with manual audits. The extension comes in free and paid versions. The free version is sufficient for most needs, while the paid version includes additional features such as a “Guided test,” which provides a checklist and guidance for completing it—although this feature is available for free in another tool we’ll mention later.
- [Accessibility Insights](https://accessibilityinsights.io/): Accessibility Insights, developed by Microsoft, is a completely free browser extension that may serve as the only tool you need for manual audits. It offers a guided assessment feature to assist you through the process and includes "ad-hoc" tools like "Tab stops" which visualize where keyboard navigation moves during keyboard accessibility testing.

### Supporting screen readers

The EAA requires web applications to be accessible via screen readers. Assessing screen reader compatibility requires accessibility expertise and tools, such as hardware screen readers (such as [NVDA](https://www.nvaccess.org/download/) or [JAWS](https://www.freedomscientific.com/products/software/jaws/)) or software solutions (e.g. [Silktide](https://silktide.com/toolbar/screen-reader-simulator/)). Going further, making your web application compatible with screen readers requires deep web engineering expertise that Mainmatter can provide.

### Staff training

Accessibility can’t simply be “done”; it must be an ongoing process integrated into the development cycle. Developers need at least a basic understanding of accessibility requirements, their implications, and how specific HTML attributes affect screen readers. Even if an app were to magically transform into an accessible product overnight, it would quickly deteriorate without conscious effort to maintain accessibility during updates. This is why educating teams on accessibility is essential. Articles, how-to guides, and [online courses](https://practical-accessibility.today/) are all great starting points, but accessibility must ultimately become an integral part of the development process—similar to code reviews, for example.

### Costs of compliance

The cost of ensuring compliance with the European Accessibility Act depends on the complexity of your web application. The process typically begins with an initial accessibility audit to identify areas requiring updates. Simpler applications may only require one-time investments to implement these updates, while more complex platforms may involve ongoing expenses for development, user testing, and the integration of assistive technologies. Training your team is another important factor, with costs associated with workshops or courses. Additionally, businesses should consider the long-term expenses of ongoing compliance monitoring and enhancing customer support for accessibility. Failing to comply may result in fines ranging from €5,000 to €20,000 _per violation_, with ongoing non-compliance penalties reaching as high as €1,000 per day. While these efforts require investment, the benefits include broader user engagement, reduced legal risks, and a strengthened reputation for inclusivity.

## Bottom line

The European Accessibility Act is setting the bar for accessibility across the EU, with the June 2025 deadline coming up fast. It might seem like a lot to take on, but with the right tools and a little planning, it’s completely doable. Making accessibility a priority now doesn’t just help you avoid penalties—it makes your products better for everyone. So why wait? Let’s get started and make sure your digital experiences are accessible to all.

The European Accessibility Act is setting the bar for accessibility across the EU, with the June 2025 deadline fast approaching. Achieving compliance isn't just a box to check - it's about creating digital experiences that are accessible to all. But identifying compliance gaps and implementing solutions takes more than just the right tools—it requires experience in building web applications and expertise in web engineering. With years of experience in accessibility and web development, we specialize in identifying and addressing accessibility challenges to ensure your digital products meet the highest standards.

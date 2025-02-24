---
title: "Making Your Web Application Compliant With the European Accessibility Act"
authorHandle: zeppelin
tags: [process]
bio: "Gabor Babicz, Senior Software Engineering Consultant"
description: "Why making your digital product comply with the European Accessibility Act by June 2025 requires web engineering expertise."
og:
  image: "/assets/images/posts/2025-02-28-making-your-web-application-compliant-with-the-european-accessibility-act/og-image.png"
tagline: |
  <p>
    The European Accessibility Act (EAA) is already in effect, and by June 2025, digital products targeting European users must be fully accessible to people with disabilities. If you haven't started planning for compliance, now is the time because non-compliance could cost your business.
  </p>
---

**TL;DR:** By June 28, 2025, all digital products and services targeting EU users must meet accessibility standards under the [European Accessibility Act (EAA)](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en). This includes everything from websites and apps to platforms. Failing to comply could result in fines up to €20,000 per violation with additional daily penalties. Meeting these requirements involves deep web engineering expertise. Mainmatter can help modernize your web applications to improve the experience for all your users and minimize legal risk.

## What is the **European Accessibility Act**?

With the **[European Accessibility Act (EAA)](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en)**, the EU requires digital products to be accessible, improving access for people with all sorts of disabilities.

Product teams need to focus on the **June 28, 2025** deadline which applies to most digital platforms (websites, mobile apps) and expect products to comply with EAA accessibility standards. Is is essential to prepare for it so as to ensure compliance, avoid penalties, and meet market expectations for accessible products.

Failing to comply can lead to fines (up to €20,000 _per violation_ with ongoing penalties up to €1,000 per day) and even legal action, especially if essential services remain inaccessible. To meet compliance requirements, businesses should conduct audits and integrate accessibility into their software development process. Prioritizing accessibility creates a better experience for all users in addition to reducing legal risks.

## Meeting compliance requirements

Ensuring compliance with the EAA requires product design and engineering work. This section shows the key steps.

### Success criteria

Let's look at some specific accessibility criteria from [Web Content Accessibility Guidelines (WCAG) version 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/), which the EAA uses as a technical basis. The WCAG guidelines establish accessibility standards based on four key principles: **Perceivable**, **Operable**, **Understandable**, and **Robust**. Addressing them requires expertise in building web applications:


- Perceivable: Ensuring content is accessible means going beyond basic `alt` text. For example, maintaining a minimum contrast ratio of 4.5:1 for readability requires considering background images, branding, and a wide range of dynamic states. Similarly, input fields must be programmatically identifiable, ensuring screen readers correctly interpret form elements rather than relying on placeholder text alone.
- Operable: In order to offering a keyboard-accessible experience, developers need to proper focus support and prevent users from getting trapped in interactive elements like modal dialogs. Ensuring that touch targets meet the minimum size of 24x24 pixels requires thoughtful UI design in mobile interfaces.
- Understandable: Navigational elements must appear in a predictable order across pages, and buttons performing the same function must have uniform labels. More than just UX considerations, these require structured content modeling and rigorous front-end implementation.
- Robust: Proper use of [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) ensures assistive technologies interpret UI components correctly. A visually hidden success message must be conveyed programmatically using `role=status` so that screen readers announce it without disrupting user flow.

The examples above highlight how making your web application accessible isn't quick checkbox but requires deep technical expertise in web development.

### Automated tools can support the assessment process

Automated tools can help assess the accessibility of simple web products such as websites. However, these tools require engineering work to cover more dynamic parts of a web such as logged-in states, user flows with various permissions, or all sorts of user-generated content.

- Code analysis or linting tools that automatically and continuously check the code for missing or invalid HTML element attributes. They are easy to set up and provide quick feedback but are limited to most common issues. They represent a good starting point to making your web products accessible. Here's a tool that we typically use for Ember applications: [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint?tab=readme-ov-file).
- [Axe](https://www.deque.com/axe/) provides excellent accessibility analysis of web pages. By using [axe-core](https://github.com/dequelabs/axe-core), it can integrate with an automated test suite and inspect web pages or individual components according to all sorts of scenarios.

While some automated tools will make recommendations on how to address accessibility issues, none of them will actually implement them as this requires manual web engineering work.

### Manual testing

Although automated tools can significantly streamline the process, they cannot uncover more complex yet common issues. Complying with the EAA requires some manual auditing. Elements such as focus management, keyboard behavior, and, most importantly, ensuring that screen readers are provided with correct metadata must be checked manually and evaluated within the broader context of a webpage. Some tools can help conduct manual accessibility audits, for instance:

- [Axe extension](https://www.deque.com/axe/browser-extensions/): Axe is a browser extension developed by the creators of Axe-core. It allows you to run Axe-core directly in your browser to assist with manual audits. The extension comes in free and paid versions. The free version is sufficient for most needs, while the paid version includes additional features such as a “Guided test,” which provides a checklist and guidance for completing it—although this feature is available for free in another tool we’ll mention later.
- [Accessibility Insights](https://accessibilityinsights.io/): Accessibility Insights, developed by Microsoft, is a completely free browser extension that may serve as the only tool you need for manual audits. It offers a guided assessment feature to assist you through the process and includes "ad-hoc" tools like "Tab stops" which visualize where keyboard navigation moves during keyboard accessibility testing.

### Supporting screen readers

The EAA requires web applications to be accessible via screen readers. Assessing screen reader compatibility requires accessibility expertise and tools, such as hardware screen readers (such as [NVDA](https://www.nvaccess.org/download/) or [JAWS](https://www.freedomscientific.com/products/software/jaws/)) or software solutions (e.g. [Silktide](https://silktide.com/toolbar/screen-reader-simulator/)). Going further, making your web application compatible with screen readers requires deep web engineering expertise that Mainmatter can provide.

### Staff training

Accessibility can’t simply be “done”; it must be an ongoing process integrated into the development cycle. Software developers need an understanding of accessibility requirements and their implications. Even an accessible application would deteriorate without conscious efforts to maintain accessibility with each new feature, update and bug fix. This is why educating teams on accessibility is essential. Articles, how-to guides, and [online courses](https://practical-accessibility.today/) are all great starting points, but accessibility must ultimately become an integral part of the development process.

## Partnering with Mainmatter to meet the EAA requirements

The European Accessibility Act is setting the bar for accessibility across the EU, with the June 2025 deadline fast approaching. Achieving compliance isn't just a box to check, and identifying compliance gaps and implementing solutions takes more than just the right tools: it requires experience in building web applications and expertise in web engineering. With years of experience in accessibility and web development, we specialize in identifying and addressing accessibility challenges to ensure your digital products meet the highest standards.

The work to comply with the European Accessibility Act depends on the complexity of your web application. With Mainmatter, the process would typically begin with an initial accessibility audit to identify areas requiring updates. We would then execute the recommended roadmap to compliance, working alongside and train your existing team on web accessibility. Simpler applications may only require one-time investments to implement these updates, while more complex platforms may involve ongoing engineering work, user testing, and the integration of assistive technologies.

Making accessibility a priority now doesn’t just help you avoid penalties, it makes your products better for everyone. Let’s get started and make sure your digital products are accessible to all.

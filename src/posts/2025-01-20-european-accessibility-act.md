---
title: "European Accessibility Act"
authorHandle: zeppelin
tags: [process]
bio: "Gabor Babicz, Senior Software Engineering Consultant"
description: "What the European Accessibility Act means for you"
og:
  image: "/assets/images/posts/2025-01-20-european-accessibility-act/og-image.png"
tagline: |
  <p>
    The European Accessibility Act (EAA) is already in effect, and by June 2025, digital products targeting European users must be fully accessible to people with disabilities. If you haven't started planning for compliance, now is the time because non-compliance could cost your business.
  </p>
---

> TL;DR: By June 28, 2025, all digital products and services targeting EU users must meet accessibility standards under the [European Accessibility Act (EAA)](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en). This includes everything from websites and apps to platforms in sectors like e-commerce, finance, and education. Failing to comply could result in fines of €5,000 to €20,000 per violation, with daily penalties up to €1,000 if issues persist.

Mainmatter can simplify this process for you. With our expertise, we’ll help ensure your products meet modern accessibility expectations, minimizing legal risks and improving the experience for all your users.

## Introduction to the **European Accessibility Act**

The **[European Accessibility Act (EAA)](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en)** is a directive designed to ensure digital accessibility across the European Union, covering websites, mobile applications, software, and other digital and physical products used in sectors like e-commerce, finance, education, and transportation. By establishing unified accessibility standards, the EAA simplifies compliance for businesses operating in multiple regions, eliminating the need to navigate varying national regulations. This harmonization reduces compliance costs, expands market opportunities, and enhances digital experiences for people with disabilities and elderly individuals.

Non-compliance with the EAA can lead to significant consequences, including fines and potential lawsuits. Businesses risk legal action, especially if their products or services are essential yet inaccessible. To mitigate these risks, organizations should prioritize accessibility by conducting regular audits, maintaining thorough reporting, and creating a knowledge base for customer support. By integrating accessibility into their strategy, businesses not only reduce liabilities but also foster a more inclusive user experience.

### Compliance Timeline

Product owners need to be aware of these key deadlines:

- **June 28, 2025**: Deadline for most digital platforms (websites, mobile apps) and other covered products to comply with EAA accessibility standards.
- **June 28, 2030**: Extended compliance deadline for certain self-service terminals, such as ATMs and ticket machines.

Preparing early for these dates is essential to ensure compliance, avoid penalties, and meet market expectations for accessible products.

### Expansion Beyond Web Accessibility

The EAA builds on the Web Accessibility Directive, which originally focused on public sector websites and mobile applications, and extends accessibility requirements to the private sector. This expansion ensures that a broader range of digital and physical products in the private sector adhere to inclusive standards. The EAA’s implementation also benefits from the models and expert groups developed for the Web Accessibility Directive, promoting consistency in enforcement across the EU.

## Meeting compliance requirements

Making sure your business is compliant could be a significant amount of product design and engineering work that also requires a know-how of the web application development field. This section will provide you steps to navigate the problem.

### Automated tooling

Nowadays there’s a plethora of tools to help tackle the accessibility requirements. Most popular UI development frameworks such as Ember and Svelte document their solutions and integrations that help with a11y.

- Code analysis or linting tools that automatically and continuously check the code for missing or invalid HTML element attributes. They are easy to set up and provide quick feedback but are limited to most common issues. They represent a good starting point to making your web products accessible. An example of such a tool is [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint?tab=readme-ov-file).
- [Axe](https://www.deque.com/axe/) provides excellent accessibility analysis of web pages. By using [axe-core](https://github.com/dequelabs/axe-core), it can integrate with an automated test suite and inspect web pages or individual components according to all sorts of scenarios. For instance, here's an integration with the Playwright test framework: [axe-core/playwright](https://playwright.dev/docs/accessibility-testing).

### Manual testing

Although automated tools can significantly streamline the process, they cannot uncover more complex yet common issues. Complying with the EAA requires some manual auditing. Elements such as focus management, keyboard behavior, and, most importantly, ensuring that screen readers are provided with correct metadata must be checked manually and evaluated within the broader context of a webpage. Some tools can help conduct manual accessibility audits, for instance:

- [Axe extension](https://www.deque.com/axe/browser-extensions/): Axe is a browser extension developed by the creators of Axe-core. It allows you to run Axe-core directly in your browser to assist with manual audits. The extension comes in free and paid versions. The free version is sufficient for most needs, while the paid version includes additional features such as a “Guided test,” which provides a checklist and guidance for completing it—although this feature is available for free in another tool we’ll mention later.
- [Accessibility Insights](https://accessibilityinsights.io/): Accessibility Insights, developed by Microsoft, is a completely free browser extension that may serve as the only tool you need for manual audits. It offers a guided assessment feature to assist you through the process and includes "ad-hoc" tools like "Tab stops" which visualize where keyboard navigation moves during keyboard accessibility testing.

### Screen readers

Keyboard accessibility—the way keyboard navigation behaves—is the minimum requirement that needs to be supported. True accessibility, however, is achieved when a product is fully usable with the help of screen-reading technology.

Without going into details, here are some screen readers available across different operating systems:

- [NVDA](https://www.nvaccess.org/download/): A third-party screen reader available for Windows.
- [JAWS](https://www.freedomscientific.com/products/software/jaws/): A commercial screen reader for Windows.
- **VoiceOver**: A built-in screen reader included with macOS.
- [Orca](https://orca.gnome.org/): A screen reader for Linux systems, specifically those running the GNOME desktop environment.

### Staff training

Accessibility can’t simply be “done”; it must be an ongoing process integrated into the development cycle. Developers need at least a basic understanding of accessibility requirements, their implications, and how specific HTML attributes affect screen readers. Even if an app were to magically transform into an accessible product overnight, it would quickly deteriorate without conscious effort to maintain accessibility during updates. This is why educating teams on accessibility is essential. Articles, how-to guides, and [online courses](https://practical-accessibility.today/) are all great starting points, but accessibility must ultimately become an integral part of the development process—similar to code reviews, for example.

### Costs of compliance

The cost of ensuring compliance with the European Accessibility Act depends on the complexity of your web application. The process typically begins with an initial accessibility audit to identify areas requiring updates. Simpler applications may only require one-time investments to implement these updates, while more complex platforms may involve ongoing expenses for development, user testing, and the integration of assistive technologies. Training your team is another important factor, with costs associated with workshops or courses. Additionally, businesses should consider the long-term expenses of ongoing compliance monitoring and enhancing customer support for accessibility. Failing to comply may result in fines ranging from €5,000 to €20,000 _per violation_, with ongoing non-compliance penalties reaching as high as €1,000 per day. While these efforts require investment, the benefits include broader user engagement, reduced legal risks, and a strengthened reputation for inclusivity.

## Quick intro to WCAG 2.2 (Levels A and AA) Success Criteria

Let's look at some specific accessibility criteria from WCAG, which the EAA uses as a technical basis.

The WCAG 2.2 guidelines establish accessibility standards based on four key principles: **Perceivable**, **Operable**, **Understandable**, and **Robust**. These principles ensure content is accessible to all users, including those with disabilities.

#### Perceivable

- **Text Alternatives:** Provide text alternatives for all non-text content to convey the same information. Use brief descriptions for simple content and detailed descriptions when more context is needed, especially for control elements or user input fields. Mark purely decorative content to be ignored by assistive technologies.
- **Adaptable:** Ensure content can adapt to different layouts without losing meaning. Content order should remain programmatically identifiable, and instructions shouldn’t rely solely on visual cues like color. Input fields collecting user information should be programmatically identifiable.
- **Distinguishable:** Improve content visibility and audibility, maintaining a minimum contrast ratio of 4.5:1 for readability. Users should be able to resize text up to 200% without losing functionality. Limit reliance on images of text where text can achieve the same effect, and provide independent controls for audio that auto-plays.

#### Operable

- **Keyboard Accessible:** All functionality must be accessible via keyboard without requiring specific timings for keystrokes. Avoid trapping users within components and allow remapping of character shortcuts where applicable.
- **Enough Time:** Provide options for users to control time limits, or turn off or pause moving content. Offer controls for blinking or scrolling content longer than five seconds, or stop it automatically.
- **Seizures and Physical Reactions:** Avoid flashing content that could provoke seizures, keeping any flashes below the defined threshold.
- **Navigable:** Support intuitive navigation through clear titles, bypass options for repetitive content, logical focus order, and contextually clear link purposes. Focus indicators should be visible, and elements receiving focus should not be obscured.
- **Input Modalities:** Ensure interaction compatibility with various input methods, like single pointers or motion-based gestures. Components should be operable through either large or alternative touch targets (minimum 24x24 CSS pixels), with options to cancel actions if needed.

#### Understandable

- **Readable:** Specify the default language for each webpage to support accurate text rendering by assistive technologies. Indicate changes in language to maintain clarity, except in cases like proper names or technical terms.
- **No automatic context switch:** Components shouldn’t change contexts automatically when receiving focus.
- **Content order:** Ensure consistent relative order of navigational elements across pages
- **Consistent identification:** Label elements with similar functions consistently across the site.
- **User-initiated changes:** Warn users of any context changes triggered by their input.
- **Input Assistance:** Help users avoid and correct errors by providing clear labels, descriptive instructions, and accessible error alerts. Detect errors automatically and offer correction suggestions unless security is compromised. For sensitive actions, implement safeguards against accidental submissions.

#### Robust

- **Name, Role, Value:** Ensure that user interface components (like buttons or input fields) are compatible with assistive technologies by making names, roles, states, and properties programmatically accessible. Use ARIA attributes and proper HTML markup to maintain accessibility.
- **Status Messages:** Status updates, such as success messages or alerts, should be communicated to assistive technologies without disrupting the user’s focus. Utilize roles and properties like `role=status` or `role=alert` to achieve this.

## Bottom line

The European Accessibility Act is setting the bar for accessibility across the EU, with the June 2025 deadline coming up fast. It might seem like a lot to take on, but with the right tools and a little planning, it’s completely doable. Making accessibility a priority now doesn’t just help you avoid penalties—it makes your products better for everyone. So why wait? Let’s get started and make sure your digital experiences are accessible to all.

The European Accessibility Act is setting the bar for accessibility across the EU, with the June 2025 deadline fast approaching. Achieving compliance isn't just a box to check - it's about creating digital experiences that are accessible to all. But identifying compliance gaps and implementing solutions takes more than just the right tools—it requires experience in building web applications and expertise in web engineering. With years of experience in accessibility and web development, we specialize in identifying and addressing accessibility challenges to ensure your digital products meet the highest standards.

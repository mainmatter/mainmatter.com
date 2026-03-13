import * as Sentry from "@sentry/browser";
import "wicg-inert";
import { Nav } from "./nav";
import { ContactForm } from "./contact-form";
import { LogoList } from "./logo-list";
import bindSelectDropdowns from "./select";
import './silktide-consent-manager.js';

if (window.location.host === "mainmatter.com" || window.location.host.includes("deploy-preview")) {
  Sentry.init({
    dsn: "https://43f7627909d94dc4a769340ad730f1a2@o68744.ingest.sentry.io/4504039028817920",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.httpClientIntegration(),
      Sentry.captureConsoleIntegration(),
    ],
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
  });
}

const navElement = document.getElementById("nav");
new Nav(navElement);

for (const form of document.querySelectorAll("[data-contact-form]")) {
  new ContactForm(form);
}

const logoList = document.getElementById("logo-list");
if (logoList) new LogoList(logoList);

bindSelectDropdowns();

//Silktide consent manager
window.silktideConsentManager.init({
  text: {
  prompt: {
    description: '<p>We use cookies to enhance your experience.</p>',
    acceptAllButtonText: 'Accept all',
    acceptAllButtonAccessibleLabel: 'Accept all cookies',
    rejectNonEssentialButtonText: 'Reject non-essential',
    rejectNonEssentialButtonAccessibleLabel: 'Reject all non-essential cookies',
    preferencesButtonText: 'Preferences',
    preferencesButtonAccessibleLabel: 'Manage cookie preferences',
  },
  preferences: {
    title: 'Customize your preferences',
    description: '<p>Choose which cookies you want to accept.</p>',
    saveButtonText: 'Save and close',
    saveButtonAccessibleLabel: 'Save your cookie preferences',
    creditLinkText: '',
    creditLinkAccessibleLabel: '',
  }
},
  consentTypes: [
    {
      id: 'essential',
      label: 'Essential',
      description: 'Required for the website to function. Cannot be switched off.',
      required: true
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Help us understand how visitors use the site.',
      defaultValue: true,
    },
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Used to deliver personalised ads.',
      defaultValue: false,
    }
  ]
});

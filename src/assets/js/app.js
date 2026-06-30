import * as Sentry from "@sentry/browser";
import "wicg-inert";
import "./nav.js";
import "./workshop-card.js";
import { ContactForm } from "./contact-form";
import { LogoList } from "./logo-list";
import bindSelectDropdowns from "./select";
import "./utils/silktide-consent-manager.js";

/* global dataLayer */

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

for (const form of document.querySelectorAll("[data-contact-form]")) {
  new ContactForm(form);
}

const logoList = document.getElementById("logo-list");
if (logoList) new LogoList(logoList);

bindSelectDropdowns();

//Silktide consent manager
window.silktideConsentManager.init({
  prompt: {
    position: "bottomLeft",
  },
  text: {
    prompt: {
      description: "<p>We use cookies.</p>",
      acceptAllButtonText: "Accept all",
      acceptAllButtonAccessibleLabel: "Accept all cookies",
      rejectNonEssentialButtonText: "Reject non-essential",
      rejectNonEssentialButtonAccessibleLabel: "Reject all non-essential cookies",
      preferencesButtonText: "Preferences",
      preferencesButtonAccessibleLabel: "Manage cookie preferences",
    },
    preferences: {
      title: "Customize your preferences",
      description: "<p>Choose which cookies you want to accept.</p>",
      saveButtonText: "Save and close",
      saveButtonAccessibleLabel: "Save your cookie preferences",
      creditLinkText: " ",
      creditLinkAccessibleLabel: " ",
    },
  },
  consentTypes: [
    {
      id: "analytics",
      label: "Analytics",
      description: "Help us understand how visitors use the site.",
      defaultValue: true,
      scripts: [
        {
          url: "https://t.contentsquare.net/uxa/d631f9850485f.js",
          load: "async",
        },
      ],
    },
    {
      id: "marketing",
      label: "Marketing",
      description: "Used to deliver personalised ads.",
      defaultValue: true,
      gtag: ["ad_storage", "ad_user_data", "ad_personalization"],
      scripts: [
        {
          url: "https://www.googletagmanager.com/gtag/js?id=AW-962403954",
          load: "async",
        },
      ],
      onAccept: function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "AW-962403954");
      },
    },
  ],
});

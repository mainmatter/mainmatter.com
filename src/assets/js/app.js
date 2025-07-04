import * as Sentry from "@sentry/browser";
import "wicg-inert";
import { Nav } from "./nav";
import { ContactForm } from "./contact-form";
import { LogoList } from "./logo-list";
import bindSelectDropdowns from "./select";

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

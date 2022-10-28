import * as Sentry from "@sentry/browser";
import "wicg-inert";
import { Animations } from "./animations";
import { Nav } from "./nav";
import { ContactForm } from "./contact-form";
import { LogoList } from "./logo-list";
import bindSelectDropdowns from "./select";

if (window.location.host === "mainmatter.com") {
  Sentry.init({
    dsn: "https://43f7627909d94dc4a769340ad730f1a2@o68744.ingest.sentry.io/4504039028817920"
  });
}

const navElement = document.getElementById("nav");
new Nav(navElement);

const contactForm = document.getElementById("contact-form");
if (contactForm) new ContactForm(contactForm);

const logoList = document.getElementById("logo-list");
if (logoList) new LogoList(logoList);

new Animations();
bindSelectDropdowns();

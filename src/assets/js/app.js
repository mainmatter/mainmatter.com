import "wicg-inert";
import { Animations } from "./animations";
import { Nav } from "./nav";
import { ContactForm } from "./contact-form";
import { LogoList } from "./logo-list";
import bindSelectDropdowns from './select';

const navElement = document.getElementById("nav");
new Nav(navElement);

const contactForm = document.getElementById("contact-form");
if (contactForm) new ContactForm(contactForm);

const logoList = document.getElementById("logo-list");
if (logoList) new LogoList(logoList);

new Animations();
bindSelectDropdowns();
import "wicg-inert";
import { Animations } from "./animations";
import bindAccordions from "./accordions";
import { Nav } from "./nav";
import { ContactForm } from "./contact-form";
import { LogoList } from "./logo-list";
import { ScrollSlides } from "./scroll-slides";

const navElement = document.getElementById("nav");
new Nav(navElement);

const contactForm = document.getElementById("contact-form");
if (contactForm) new ContactForm(contactForm);

const logoList = document.getElementById("logo-list");
if (logoList) new LogoList(logoList);

const scrollSlides = document.getElementById("scroll-slides");
if (scrollSlides) new ScrollSlides(scrollSlides);

new Animations();
bindAccordions();
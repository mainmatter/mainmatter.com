import "wicg-inert";
import { Animations } from "./animations";
import bindAccordions from "./accordions";
import { Nav } from "./nav";

const navElement = document.getElementById("nav");
new Nav(navElement);

new Animations();
bindAccordions();

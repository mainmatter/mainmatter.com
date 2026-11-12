import { resetDetails } from "./accordion.js";

// Scrolling event listener for the sticky nav bar.

const nav = document.querySelector(".nav");
const scrollEnterThreshold = 24;
const scrollExitThreshold = 4;
let isScrollFramePending = false;

const handleScroll = () => {
  if (window.scrollY > scrollEnterThreshold) {
    nav.classList.add("nav__scrolled");
  } else if (window.scrollY <= scrollExitThreshold) {
    nav.classList.remove("nav__scrolled");
  }
};

const dropdowns = nav.querySelectorAll(".nav-popover");

const positionDropdown = dropdown => {
  const trigger = nav.querySelector(`[popovertarget="${dropdown.id}"]`);
  const left = Math.max(
    16,
    Math.min(trigger.getBoundingClientRect().left, window.innerWidth - dropdown.offsetWidth - 16)
  );
  dropdown.style.setProperty("--nav-popover-left", `${left}px`);
};

dropdowns.forEach(dropdown => {
  dropdown.addEventListener("toggle", ({ newState }) => {
    if (newState === "open") {
      positionDropdown(dropdown);
      return;
    }

    dropdown.querySelectorAll(".nav__nested[open]").forEach(resetDetails);
  });
});

window.addEventListener("resize", () => {
  dropdowns.forEach(dropdown => {
    if (dropdown.matches(":popover-open")) positionDropdown(dropdown);
  });
});

// Run once immediately to handle reloads mid-page
handleScroll();

window.addEventListener(
  "scroll",
  () => {
    if (isScrollFramePending) {
      return;
    }

    isScrollFramePending = true;
    window.requestAnimationFrame(() => {
      handleScroll();
      isScrollFramePending = false;
    });
  },
  { passive: true }
);

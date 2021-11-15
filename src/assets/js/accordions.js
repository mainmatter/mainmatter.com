export default function () {
  const accordionToggles = document.querySelectorAll("[data-accordion-toggle]");
  accordionToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
      } else {
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });
}

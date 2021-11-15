export class Nav {
  constructor(element) {
    this.container = element;
    this.dropdownToggles = this.container.querySelectorAll(
      "[data-dropdown-toggle]"
    );
    this.menuToggle = this.container.querySelector("[data-menu-toggle]");
    this.dropdowns = this.container.querySelectorAll("[data-dropdown]");

    this.bindEvents();
  }

  bindEvents() {
    this.dropdownToggles.forEach((dropdownToggle) => {
      dropdownToggle.addEventListener("click", () => {
        if (dropdownToggle.getAttribute("aria-expanded") === "true") {
          dropdownToggle.setAttribute("aria-expanded", "false");
        } else {
          dropdownToggle.setAttribute("aria-expanded", "true");
        }
      });
    });

    this.dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("focusout", (event) => {
        if (!event.relatedTarget.closest("[data-dropdown]")) {
          const toggleName = dropdown.getAttribute("id");
          const toggle = document.querySelector(
            `[data-dropdown-toggle="${toggleName}"]`
          );

          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-dropdown-wrapper]")) {
        this.dropdownToggles.forEach((dropdownToggle) => {
          this.closeDropdown(dropdownToggle);
        });
      }
    });

    this.menuToggle.addEventListener("click", () => {
      if (this.menuToggle.getAttribute("aria-expanded") === "true") {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    });

    // Escape key handler
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.dropdownToggles.forEach((dropdownToggle) => {
          this.closeDropdown(dropdownToggle);
        });

        if (this.menuToggle.getAttribute("aria-expanded") === "true") {
          this.closeMenu();
        }
      }
    });
  }

  closeDropdown(toggle) {
    if (toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  }

  closeMenu() {
    const siblings = this.getAllSiblings(this.container);
    this.menuToggle.setAttribute("aria-expanded", "false");
    siblings.forEach((sibling) => sibling.removeAttribute("inert"));
    this.menuToggle.focus();
    document.body.style.overflow = "";
  }

  getAllSiblings(element) {
    const children = [...element.parentElement.children];
    return children.filter((child) => child !== element);
  }

  openMenu() {
    const siblings = this.getAllSiblings(this.container);
    this.menuToggle.setAttribute("aria-expanded", "true");
    siblings.forEach((sibling) => sibling.setAttribute("inert", true));
    document.body.style.overflow = "hidden";
  }
}

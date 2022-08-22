import { trapFocus } from './utils/trap-focus';

export class Nav {
  constructor(element) {
    this.container = element;
    this.menuToggles = this.container.querySelectorAll("[data-menu-toggle]");
    this.menuClose = this.container.querySelectorAll("[data-menu-close]");
    this.modals = this.container.querySelectorAll("[data-modal]");

    this.modals.forEach((modal) => {
      modal.setAttribute("aria-modal", true);
    });

    this.bindEvents();
  }

  bindEvents() {
    this.menuToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const menu = toggle.closest("[data-has-submenu]");
        if (menu.hasAttribute("open")) {
          this.closeMenu(menu);
        } else {
          this.openMenu(menu);
        }
      });
    });

    this.menuClose.forEach((button) => {
      button.addEventListener("click", () => {
        const toggle = button.closest("[data-has-submenu]").querySelector("[data-menu-toggle]");
        if (toggle) toggle.click();
      });
    });

    // Escape key handler
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.menuToggles.forEach((menuToggle) => {
          const menu = menuToggle.closest("[data-has-submenu]");
          if (menu && menu.hasAttribute("open")) {
            const toggle = menu.querySelector("[data-menu-toggle]");
            if (toggle) toggle.click();
          }
        });
      }
    });
  }

  getAllSiblings(element) {
    const children = [...element.parentElement.children];
    return children.filter((child) => child !== element);
  }

  closeMenu(menu) {
    const siblings = this.getAllSiblings(this.container);
    siblings.forEach((sibling) => sibling.removeAttribute("inert"));
    document.body.classList.remove("menu-open");
    const menuToggle = menu.querySelector("[data-menu-toggle]");
    menuToggle.focus({focusVisible: false});
  }

  openMenu(menu) {
    const siblings = this.getAllSiblings(this.container);
    siblings.forEach((sibling) => sibling.setAttribute("inert", true));
    document.body.classList.add("menu-open");

    if (menu) {
      setTimeout(function () {
        trapFocus(menu);
      }, 100);
    }
  }
}


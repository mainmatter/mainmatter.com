import { trapFocus } from './utils/trap-focus';

export class Nav {
  constructor(element) {
    this.container = element;
    this.menuToggles = this.container.querySelectorAll("[data-menu-toggle]");
    this.menuClose = this.container.querySelectorAll("[data-menu-close]");
    this.modals = this.container.querySelectorAll("[data-modal]");

    this.animation = null;
    this.isClosing = false;
    this.isOpening = false;

    this.modals.forEach((modal) => {
      modal.setAttribute("aria-modal", true);
    });

    this.bindEvents();
  }

  bindEvents() {
    this.menuToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();

        const menu = toggle.closest("[data-has-submenu]");
        if (this.isOpening || menu.open) {
          this.closeMenu(menu);
        } else if (this.isClosing || !menu.open) {
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
    const content = menu.querySelector("[data-modal]");
    this.isClosing = true;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = content.animate({
      opacity: [1, 0]
    }, {
      duration: 200,
      easing: 'ease-out'
    });

    this.animation.onfinish = () => this.onAnimationFinish(menu, false);
    this.animation.oncancel = () => this.isClosing = false;

    const siblings = this.getAllSiblings(this.container);
    siblings.forEach((sibling) => sibling.removeAttribute("inert"));
    document.body.classList.remove("menu-open");
    const menuToggle = menu.querySelector("[data-menu-toggle]");
    menuToggle.focus({focusVisible: false});
  }

  animateOpacity(menu) {
    const content = menu.querySelector("[data-modal]");
    this.isOpening = true;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = content.animate({
      opacity: [0, 1]
    }, {
      duration: 200,
      easing: 'ease-in'
    });

    this.animation.onfinish = () => this.onAnimationFinish(menu, true);
    this.animation.oncancel = () => this.isOpening = false;
  }

  openMenu(menu) {
    menu.open = true;
    window.requestAnimationFrame(() => this.animateOpacity(menu));

    const siblings = this.getAllSiblings(this.container);
    siblings.forEach((sibling) => sibling.setAttribute("inert", true));
    document.body.classList.add("menu-open");

    if (menu) {
      setTimeout(function () {
        trapFocus(menu);
      }, 100);
    }
  }

  onAnimationFinish(menu, open) {
    menu.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isOpening = false;
  }
}


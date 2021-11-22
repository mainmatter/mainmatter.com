import lax from "lax.js";

export class Animations {
  constructor() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      lax.init();
      lax.addDriver("scrollY", () => window.scrollY);
      this.textAnimations();
      this.imageWithTextAnimations();
      this.colorHeroAnimations();
    }
  }

  colorHeroAnimations() {
    lax.addElements("[data-color-hero]", {
      scrollY: {
        translateY: [
          ["elInY", "elCenterY"],
          ["elHeight", 0],
        ],
      },
    });
  }

  imageWithTextAnimations() {
    lax.addElements("[data-image-animation='md']", {
      scrollY: {
        translateY: [
          ["elInY", "elOutY"],
          {
            768: [0, 0],
            1366: ["elHeight / 3", "elHeight / 3 * -1"],
          },
        ],
      },
    });
    lax.addElements("[data-image-animation='sm']", {
      scrollY: {
        translateY: [
          ["elInY", "elOutY"],
          {
            768: [0, 0],
            1366: [0, "elHeight / 4 * -1"],
          },
        ],
      },
    });
  }

  textAnimations() {
    lax.addElements(".text-animation__cover", {
      scrollY: {
        scaleX: [
          // Todo: Come back and refine this, sizing may change things
          {
            768: ["elCenterY", "elOutY-200"],
            1366: ["elOutY-225", "elOutY-100"],
            1900: ["elOutY-325", "elOutY-150"],
          },
          [1, 0],
          // ["elOutY-225", "elOutY-100"],
          // [1, 0],
        ],
      },
    });
  }
}

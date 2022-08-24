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
          ["elInY-700", "elCenterY-300"],
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
          {
            768: ["elOutY-100", "elOutY-50"],
            1280: ["elOutY-200", "elOutY-100"],
            1900: ["elOutY-300", "elOutY-100"],
          },
          [1, 0],
        ],
      },
    });

    lax.addElements(".text-animation__cover-offset", {
      scrollY: {
        scaleX: [
          {
            480: ["elOutY-400", "elOutY-100"],
            1200: ["elOutY-900", "elOutY-600"]
          },
          [1, 0],
        ],
      },
    });
  }
}

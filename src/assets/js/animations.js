import lax from "lax.js";

export class animations {
  constructor() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      lax.init();
      lax.addDriver("scrollY", () => window.scrollY);
      this.textAnimations();
      this.imageWithTextAnimations();
    }
  }

  imageWithTextAnimations() {
    lax.addElements(
      "[data-image-animation]", // Element selector rule
      {
        scrollY: {
          translateY: [
            [0, 1000],
            {
              768: [0, 0],
              1366: [100, -100],
            },
          ],
        },
      }
    );
  }

  textAnimations() {
    lax.addElements(".text-animation__cover", {
      scrollY: {
        scaleX: [
          [0, 200],
          [1, 0],
        ],
      },
    });
  }
}

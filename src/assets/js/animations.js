import lax from "lax.js";

export class animations {
  constructor() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      lax.init();
      lax.addDriver("scrollY", () => window.scrollY);
      this.textAnimations();
    }
  }

  textAnimations() {
    lax.addElements(
      ".text-animation__cover", // Element selector rule
      {
        // Animation data
        scrollY: {
          scaleX: [
            [0, 200],
            [1, 0],
          ],
        },
      }
    );
  }
}

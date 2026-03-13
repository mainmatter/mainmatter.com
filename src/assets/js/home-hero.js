import { gsap } from "gsap";

export function initHomeHero() {
  const hero = document.querySelector(".home-hero");

  if (!hero) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const eyebrow = hero.querySelector(".home-hero__eyebrow");
  const title = hero.querySelector(".home-hero__title");
  const text = hero.querySelector(".home-hero__text");
  const actions = hero.querySelector(".home-hero__actions");
  const image = hero.querySelector(".home-hero__image");
  const logos = hero.querySelectorAll(".home-hero__logos svg");

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  if (eyebrow) {
    tl.from(
      eyebrow,
      {
        y: 18,
        opacity: 0,
        duration: 0.45,
      },
      0
    );
  }

  if (title) {
    tl.from(
      title,
      {
        y: 28,
        opacity: 0,
        duration: 0.7,
      },
      0.08
    );
  }

  if (text) {
    tl.from(
      text,
      {
        y: 22,
        opacity: 0,
        duration: 0.6,
      },
      0.2
    );
  }

  if (actions) {
    tl.from(
      actions,
      {
        y: 18,
        opacity: 0,
        duration: 0.5,
      },
      0.32
    );
  }

  if (image) {
    tl.from(
      image,
      {
        x: 56,
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: "power3.out",
      },
      0.12
    );

    tl.to(
      image,
      {
        y: 5,
        x: -2,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
      ">-0.1"
    );
  }

  if (logos.length) {
    tl.to(
      logos,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      },
      0.45
    );
  }
}

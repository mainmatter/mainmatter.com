import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const float = gsap.utils.toArray(".floating-btn");
if (float) {
  float.forEach(float => {
    const anim = gsap.from(float, {
      y: 400,
      paused: true,
    });

    const playST = ScrollTrigger.create({
      trigger: ".trigger",
      start: "top 50%",
      onEnter: () => anim.play(),
      onLeaveBack: () => anim.reverse(),
    });

    const resetST = ScrollTrigger.create({
      trigger: ".end-trigger",
      onEnter: () => anim.reverse(),
      onLeaveBack: () => anim.play(),
    });
  });
}

const numbers = gsap.utils.toArray(".strategy-list__number");
if (numbers) {
  numbers.forEach(number => {
    gsap.to(number, {
      opacity: 1,
      scrollTrigger: {
        trigger: number,
        start: "top 50%",
        end: "top 25%",
        toggleActions: "restart reverse restart reverse"
      },
    });
  });
}

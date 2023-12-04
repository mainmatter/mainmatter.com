import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
 
gsap.registerPlugin( ScrollTrigger );

gsap.from(".floating-btn", {
  y: 400,
  scrollTrigger: {
    trigger: ".trigger",
    start: "top 50%",
    toggleActions: "play pause reverse reset",
  }
  });

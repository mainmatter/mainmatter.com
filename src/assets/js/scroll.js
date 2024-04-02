import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
 
gsap.registerPlugin( ScrollTrigger );

/* gsap.from(".floating-btn", {
  y: 400,
  scrollTrigger: {
    trigger: ".trigger",
    start: "top 50%",
    toggleActions: "play complete reverse restart",
  }
  });

  gsap.to(".floating-btn", {
    opacity: 0,
    scrollTrigger: {
      trigger: ".end-trigger",
      start: "bottom 90%",
      toggleActions: "play none reset none",
    }
    }); */


    const anim = gsap.from('.floating-btn', {
        y: 400,
        paused: true
      });
      
      const playST = ScrollTrigger.create({
        trigger:'.trigger', 
        start:'top 50%', 
        onEnter: () => anim.play(),
        onLeaveBack: () => anim.reverse(),
      });
      
      const resetST = ScrollTrigger.create({
        trigger:'.end-trigger',
        onEnter: () => anim.reverse(),
        onLeaveBack: () => anim.play(),
      });
// Scrolling event listener for the sticky nav bar.

const nav = document.querySelector(".nav");
const scrollEnterThreshold = 24;
const scrollExitThreshold = 4;
let isScrollFramePending = false;

const handleScroll = () => {
  if (window.scrollY > scrollEnterThreshold) {
    nav.classList.add("nav__scrolled");
  } else if (window.scrollY <= scrollExitThreshold) {
    nav.classList.remove("nav__scrolled");
  }
};

// Run once immediately to handle reloads mid-page
handleScroll();

window.addEventListener(
  "scroll",
  () => {
    if (isScrollFramePending) {
      return;
    }

    isScrollFramePending = true;
    window.requestAnimationFrame(() => {
      handleScroll();
      isScrollFramePending = false;
    });
  },
  { passive: true }
);

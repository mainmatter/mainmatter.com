// Scrolling event listener for the sticky nav bar. Only appiles class="nav__scrolled" on breakpoints larger than breakpoint-m

const nav = document.querySelector(".nav");

const throttle = (fn, delay) => {
  let t = Date.now();
  return () => {
    if (t + delay - Date.now() <= 0) {
      fn();
      t = Date.now();
    }
  };
};

window.addEventListener(
  "scroll",
  throttle(() => {
    if (window.scrollY > 10) {
      nav.classList.add("nav__scrolled");
    } else {
      nav.classList.remove("nav__scrolled");
    }
  }, 100),
  { passive: true }
);

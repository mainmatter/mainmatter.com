// Scrolling event listener for the sticky nav bar. Only appiles class="nav__scrolled" on breakpoints larger than breakpoint-m

const nav = document.querySelector(".nav");

const throttle = (fn, delay) => {
  let now = Date.now();
  let timer;
  return (...args) => {
    clearTimeout(timer);
    if (now + delay - Date.now() <= 0) {
      fn.call(null, ...args);
      now = Date.now();
    } else {
      timer = setTimeout(() => {
        fn.call(null, ...args);
        now = Date.now();
      }, delay);
    }
  };
};

const handleScroll = () => {
  if (window.scrollY > 10) {
    nav.classList.add("nav__scrolled");
  } else {
    nav.classList.remove("nav__scrolled");
  }
};

// Run once immediately to handle reloads mid-page
handleScroll();

window.addEventListener("scroll", throttle(handleScroll, 100), { passive: true });

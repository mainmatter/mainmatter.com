export class ScrollSlides {
  constructor(element) {
    this.container = element;
    this.slides = this.container.querySelectorAll("[data-scroll-slide]");
    this.paginationButtons = this.container.querySelectorAll("[data-pagination]");
    this.startArr = [];
    this.maxPin = 0;
    this.current = 0;
    this.ticking = false;

    this.bindEvents();
    this.setUpAnimation();
  }

  setUpAnimation() {
    this.startArr = [];
    this.slides.forEach((el, index) => {
      el.style.transform = "translate3d(0, 0, 0)";
      const top = window.pageYOffset + el.getBoundingClientRect().top;
      this.startArr.push(top);
      if (index === this.slides.length - 1) {
        this.maxPin = top;
      }
    });
  }

  bindEvents() {
    window.addEventListener("scroll", this.onScroll.bind(this), false);
    window.addEventListener("resize", this.setUpAnimation.bind(this));

    this.paginationButtons.forEach((el) => {
      el.addEventListener("click", (e) => this.scrollToIndex(e));
    });
  }

  onScroll() {
    this.current = window.scrollY;
    if (!this.ticking) {
      requestAnimationFrame(this.startAnimation.bind(this));
    }
    this.ticking = true;
  }

  startAnimation() {
    this.ticking = false;
    const current = Math.min(window.scrollY, this.maxPin);

    this.slides.forEach((el, index) => {
      const start = this.startArr[index];
      const val = Math.max(start, current);
      const offset = val - start;
      el.style.transform = "translate3d(" + 0 + ", " + offset + "px, 0)";
    });
  }

  scrollToIndex(e) {
    const target = e.target.getAttribute("data-pagination");
    if (target) {
      const index = parseInt(target, 10);
      const slideTop = this.startArr[index];
      scrollTo(0, slideTop);

      const buttonToFocus = this.slides[index].querySelectorAll("[data-pagination]")[index];
      if (buttonToFocus) buttonToFocus.focus({ preventScroll: true });
    }
  }
}
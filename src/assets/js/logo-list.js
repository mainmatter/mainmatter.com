export class LogoList {
  constructor(element) {
    this.container = element;
    this.controls = this.container.querySelector("[data-marquee-controls]");
    this.marquee = this.container.querySelector("[data-marquee]");

    this.bindEvents();
  }

  bindEvents() {
    this.controls.addEventListener("click", (e) => {
      const className = "logo-list__inner--paused";
      const isPaused = this.marquee.classList.contains(className);
      const message = isPaused ? "Pause animation" : "Play animation";

      isPaused ? this.marquee.classList.remove(className) : this.marquee.classList.add(className);
      this.controls.innerHTML = message;
    });
  }
}


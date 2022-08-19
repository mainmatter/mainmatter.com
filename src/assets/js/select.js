export default function () {
  const select = document.querySelectorAll("[data-select]");
  select.forEach((el) => {
    el.addEventListener("change", () => {
      window.location.href = el.value;
    });
  });
}
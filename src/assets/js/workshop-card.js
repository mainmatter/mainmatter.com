function descriptionFitsWithoutToggle(description) {
  const clone = description.cloneNode(true);
  const styles = window.getComputedStyle(description);
  const lineHeight =
    Number.parseFloat(styles.lineHeight) || Number.parseFloat(styles.fontSize) * 1.6;

  clone.classList.add("workshop-card__mobile-description--measure");

  description.after(clone);
  const fits = clone.scrollHeight <= lineHeight * 3 + 1;
  clone.remove();

  return fits;
}

function updateWorkshopCards() {
  for (const details of document.querySelectorAll("[data-workshop-card-mobile-details]")) {
    if (details.dataset.hasDates === "true") continue;

    const description = details.querySelector(".workshop-card__mobile-description");
    if (!description) continue;

    details.classList.remove("workshop-card__mobile-details--static");
    details.removeAttribute("open");

    if (descriptionFitsWithoutToggle(description)) {
      details.classList.add("workshop-card__mobile-details--static");
      details.setAttribute("open", "");
    }
  }
}

for (const button of document.querySelectorAll(".workshop-card__mobile-ticket-hide")) {
  button.addEventListener("click", event => {
    event.preventDefault();
    event.currentTarget.closest("details").removeAttribute("open");
  });
}

window.addEventListener("load", updateWorkshopCards);
window.addEventListener("resize", updateWorkshopCards);

const detailsMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const setDetailsHeight = details => {
  const content = details.querySelector("[data-accordion-content]");
  if (!content) return null;

  content.style.maxHeight = `${content.scrollHeight}px`;

  return content;
};

const clearDetailsAnimation = details => {
  delete details.dataset.animating;
  delete details.dataset.expanding;
};

const onHeightTransitionEnd = (content, callback) => {
  const handleTransitionEnd = event => {
    if (event.propertyName !== "max-height") return;

    content.removeEventListener("transitionend", handleTransitionEnd);
    callback();
  };

  content.addEventListener("transitionend", handleTransitionEnd);
};

const openDetails = details => {
  details.dataset.animating = "true";
  details.dataset.expanding = "true";
  details.dataset.collapsed = "";
  details.open = true;

  window.requestAnimationFrame(() => {
    const content = details.querySelector("[data-accordion-content]");
    if (!content) return;

    content.style.maxHeight = "0px";
    content.getBoundingClientRect();
    delete details.dataset.collapsed;
    content.style.maxHeight = `${content.scrollHeight}px`;

    onHeightTransitionEnd(content, () => {
      content.style.removeProperty("max-height");
      clearDetailsAnimation(details);
    });
  });
};

const closeDetails = details => {
  const content = setDetailsHeight(details);
  if (!content) return;

  details.dataset.animating = "true";
  delete details.dataset.expanding;

  content.getBoundingClientRect();
  details.dataset.collapsed = "";
  content.style.maxHeight = "0px";

  onHeightTransitionEnd(content, () => {
    details.open = false;
    delete details.dataset.collapsed;
    content.style.removeProperty("max-height");
    clearDetailsAnimation(details);
  });
};

export const resetDetails = details => {
  const content = details.querySelector("[data-accordion-content]");

  details.open = false;
  delete details.dataset.collapsed;
  clearDetailsAnimation(details);
  content?.style.removeProperty("max-height");
};

const animateDetails = details => {
  if (!details || details.dataset.animating === "true") return;

  if (details.open) {
    closeDetails(details);
  } else {
    openDetails(details);
  }
};

document.querySelectorAll("[data-accordion] > summary").forEach(summary => {
  summary.addEventListener("click", event => {
    if (detailsMotionQuery.matches) return;

    event.preventDefault();
    animateDetails(summary.parentElement);
  });
});

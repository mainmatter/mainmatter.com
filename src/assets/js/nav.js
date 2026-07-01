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

const navOverflow = document.getElementById("nav-overflow");
const nestedMenuMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const setNestedMenuHeight = nestedMenu => {
  const nestedList = nestedMenu.querySelector(".nav__nested-list");
  if (!nestedList) return null;

  nestedList.style.maxHeight = `${nestedList.scrollHeight}px`;

  return nestedList;
};

const clearNestedMenuAnimation = nestedMenu => {
  delete nestedMenu.dataset.animating;
  delete nestedMenu.dataset.expanding;
};

const onNestedHeightTransitionEnd = (nestedList, callback) => {
  const handleTransitionEnd = event => {
    if (event.propertyName !== "max-height") return;

    nestedList.removeEventListener("transitionend", handleTransitionEnd);
    callback();
  };

  nestedList.addEventListener("transitionend", handleTransitionEnd);
};

const openNestedMenu = nestedMenu => {
  nestedMenu.dataset.animating = "true";
  nestedMenu.dataset.expanding = "true";
  nestedMenu.dataset.collapsed = "";
  nestedMenu.open = true;

  window.requestAnimationFrame(() => {
    const nestedList = nestedMenu.querySelector(".nav__nested-list");
    if (!nestedList) return;

    nestedList.style.maxHeight = "0px";
    nestedList.getBoundingClientRect();
    delete nestedMenu.dataset.collapsed;
    nestedList.style.maxHeight = `${nestedList.scrollHeight}px`;

    onNestedHeightTransitionEnd(nestedList, () => {
      nestedList.style.removeProperty("max-height");
      clearNestedMenuAnimation(nestedMenu);
    });
  });
};

const closeNestedMenu = nestedMenu => {
  const nestedList = setNestedMenuHeight(nestedMenu);
  if (!nestedList) return;

  nestedMenu.dataset.animating = "true";
  delete nestedMenu.dataset.expanding;

  nestedList.getBoundingClientRect();
  nestedMenu.dataset.collapsed = "";
  nestedList.style.maxHeight = "0px";

  onNestedHeightTransitionEnd(nestedList, () => {
    nestedMenu.open = false;
    delete nestedMenu.dataset.collapsed;
    nestedList.style.removeProperty("max-height");
    clearNestedMenuAnimation(nestedMenu);
  });
};

const resetNestedMenu = nestedMenu => {
  const nestedList = nestedMenu.querySelector(".nav__nested-list");

  nestedMenu.open = false;
  delete nestedMenu.dataset.collapsed;
  clearNestedMenuAnimation(nestedMenu);
  nestedList?.style.removeProperty("max-height");
};

const animateNestedMenu = nestedMenu => {
  if (!nestedMenu || nestedMenu.dataset.animating === "true") return;

  if (nestedMenu.open) {
    closeNestedMenu(nestedMenu);
  } else {
    openNestedMenu(nestedMenu);
  }
};

document.querySelectorAll(".nav__nested-summary").forEach(summary => {
  summary.addEventListener("click", event => {
    if (nestedMenuMotionQuery.matches) return;

    event.preventDefault();
    animateNestedMenu(summary.closest(".nav__nested"));
  });
});

navOverflow?.addEventListener("toggle", ({ newState }) => {
  if (newState !== "closed") return;

  navOverflow.querySelectorAll(".nav__nested[open]").forEach(nestedMenu => {
    resetNestedMenu(nestedMenu);
  });
});

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

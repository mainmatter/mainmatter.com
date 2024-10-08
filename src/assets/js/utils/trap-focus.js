var trapFocusHandlers = {};

export function trapFocus(container) {
  var elements = container.querySelectorAll(
    "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
  );

  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = event => {
    if (event.target !== container && event.target !== last && event.target !== first) return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key

    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus({ focusVisible: false });
    }

    if ((event.target === container || event.target === first) && event.shiftKey) {
      event.preventDefault();
      last.focus({ focusVisible: false });
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  container.focus({ focusVisible: false });
}

export function removeTrapFocus() {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
}

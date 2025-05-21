import * as Sentry from "@sentry/browser";

export class ContactForm {
  constructor(element) {
    this.form = element;
    this.liveRegion = document.getElementById("live-region");
    this.formContent = this.form.querySelector("[data-form-content]");
    this.loading = this.form.querySelector("[data-form-loading]");
    this.error = this.form.querySelector("[data-form-error]");
    this.success = this.form.querySelector("[data-form-success]");
    this.reset = this.form.querySelectorAll("[data-reset-form]");

    this.prefillService();

    this.bindEvents();

    this.enableForm();
  }

  bindEvents() {
    this.form.addEventListener("submit", event => {
      try {
        event.preventDefault();
        if (this.form.reportValidity()) {
          this.updateFormState("loading", "Your message is being sent...");

          const formData = new FormData(this.form);
          this.sendMessage(Object.fromEntries(formData.entries()));
        }
      } catch (error) {
        this.updateFormState("error", "An error occurred.");
        throw error;
      }
    });

    this.reset.forEach(reset => {
      reset.addEventListener("click", () => {
        this.updateFormState("initial");
      });
    });
  }

  enableForm() {
    let fieldsets = this.form.querySelectorAll("fieldset");
    for (let fieldset of fieldsets) {
      fieldset.disabled = false;
    }
  }

  prefillService() {
    const currentUrl = new URL(window.location.href);
    const selectedService = currentUrl.searchParams.get("service");

    if (selectedService) {
      const options = Array.from(this.form.service.options);
      const optionToSelect = options.find(
        o => o.value.toLowerCase() === selectedService.toLowerCase()
      );
      if (optionToSelect) {
        optionToSelect.selected = true;
      }
    }
  }

  async sendMessage(formData) {
    const handleError = e => {
      this.updateFormState("error", "An error occurred.");
      if (window.location.host === "mainmatter.com") {
        Sentry.addBreadcrumb({
          category: "post",
          message: "Submit Contact Form",
          level: "info",
          data: formData,
        });
        Sentry.captureException(e);
      }
    };

    const { plausible } = window;
    const { goal } = this.form.dataset;
    if (plausible) {
      plausible(goal);
    }

    let { action, method } = this.form.dataset;
    action = new URL(action);

    let params = {
      cache: "no-cache",
      method,
      mode: "cors",
    };

    let request;
    if (method.toLowerCase().includes("get")) {
      action.search = new URLSearchParams(formData);

      request = this.makeRequest(action, params);
    } else {
      request = this.makeRequest(action, {
        ...params,
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json; charset=UTF-8'",
        },
      });
    }

    let { response, error } = await request;
    if (response?.ok) {
      this.updateFormState("success", "Message sent successfully.");
    } else {
      handleError(new Error(`Failed to deliver message via contact form!`));
    }
    if (error) {
      handleError(error);
    }
  }

  updateFormState(state, screenreaderAnnouncement) {
    // Technically we shouldn't need to double announce, moving focus should just read the text,
    // but NVDA presently has a bug where moving focus in a 'replaced' element doesn't announce things:
    // https://github.com/nvaccess/nvda/issues/5825
    this.liveRegion.innerText = screenreaderAnnouncement || "";

    if (state === "initial") {
      this.formContent.removeAttribute("inert");
      this.form.reset();
    } else {
      this.formContent.setAttribute("inert", true);
    }

    this.form.setAttribute("data-status", state);

    if (state === "error") {
      setTimeout(() => this.error.focus(), 200);
    } else if (state === "success") {
      setTimeout(() => this.success.focus(), 200);
    } else if (state === "initial") {
      setTimeout(() => this.formContent.focus(), 200);
    }
  }

  async makeRequest(url, params) {
    return Sentry.startSpan(
      {
        name: `${params.method} ${url}`,
        op: "http.client",
        attributes: {
          url,
          ...params,
        },
      },
      async span => {
        try {
          const response = await fetch(url, params);
          span.setAttribute("http.response.ok", response.ok);
          span.setAttribute("http.response.status", response.status);
          return { response };
        } catch (error) {
          span.setAttribute("http.response.error", error);
          return { error };
        } finally {
          span.end();
        }
      }
    );
  }
}

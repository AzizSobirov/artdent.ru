const modal = {
  el: document.querySelector(".modal-overlay"),
  templates: {}, // Store modal templates here
  activeModal: null,

  init() {
    // Move modal templates to memory and clear them from the DOM
    document.querySelectorAll("[data-template]").forEach((template) => {
      this.templates[template.dataset.template] = template.outerHTML;
      template.remove();
    });

    this.setupTriggers();
    this.setupOutsideClick();
    this.checkHasActiveModal();
  },

  setupTriggers() {
    const triggers = document.querySelectorAll("[data-modal]");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        const modalName = trigger.dataset.modal;
        if (modalName === "close") {
          this.close();
        } else {
          this.open(modalName);
        }
      });
    });
  },

  setupOutsideClick() {
    this.el.addEventListener("click", (event) => {
      if (event.target === this.el) {
        this.close();
      }
    });
  },

  open(name) {
    const modalHTML = this.templates[name];
    if (modalHTML) {
      this.close(!!this.activeModal); // Close any currently active modal

      this.el.innerHTML = modalHTML; // Inject the modal HTML
      this.activeModal = this.el.querySelector(`[data-template="${name}"]`);
      this.el.style.display = "flex";

      // Append a child to the body when a modal is active
      document.body.appendChild(this.el);

      requestAnimationFrame(() => {
        this.el.classList.add("show");
        this.activeModal.classList.add("show");
      });

      // Reattach event listeners for buttons inside the modal
      this.setupTriggers();
    }
  },

  close(retainOverlay) {
    if (this.activeModal) {
      this.activeModal.classList.remove("show");
      this.activeModal = null;

      if (!retainOverlay) {
        this.el.classList.remove("show");
        this.el.addEventListener(
          "transitionend",
          () => {
            if (!this.el.classList.contains("show")) {
              this.el.style.display = "none";
              this.el.innerHTML = ""; // Clear the overlay content

              // Check if there are any active modals left
              this.checkHasActiveModal();
            }
          },
          { once: true }
        );
      } else {
        this.el.innerHTML = "";
      }
    }
  },

  checkHasActiveModal() {
    // If there are no active modals, remove the modal overlay from the body
    if (!this.activeModal) {
      document.body.removeChild(this.el);
    }
  },
};
modal.init();

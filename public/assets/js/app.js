// modal
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

// header
const header = document.querySelector(".header");
if (header) {
  const menu = header.querySelector(".header__menu");
  const services = header.querySelector(".menu-item-has-children");
  const servicesSubMenu = services.querySelector(".sub-menu");

  const div = document.createElement("div");
  div.classList.add("icon-plus");
  div.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.9999 12.0001C15.0007 12.1317 14.9755 12.2621 14.9257 12.384C14.8759 12.5058 14.8026 12.6166 14.7099 12.7101L10.7099 16.7101C10.5216 16.8984 10.2662 17.0042 9.99994 17.0042C9.73364 17.0042 9.47824 16.8984 9.28994 16.7101C9.10164 16.5218 8.99585 16.2664 8.99585 16.0001C8.99585 15.7338 9.10164 15.4784 9.28994 15.2901L12.5899 12.0001L9.29994 8.71006C9.13611 8.51876 9.05051 8.27268 9.06023 8.02101C9.06995 7.76933 9.17428 7.53059 9.35238 7.3525C9.53047 7.1744 9.76921 7.07007 10.0209 7.06035C10.2726 7.05063 10.5186 7.13623 10.7099 7.30006L14.7099 11.3001C14.8947 11.4863 14.9988 11.7377 14.9999 12.0001Z" fill="currentColor"/></svg>';

  services.appendChild(div);

  services.addEventListener("mouseenter", () => {
    servicesSubMenu.style.display = "flex"; // Ensure the submenu is visible
    requestAnimationFrame(() => {
      // Force a reflow to ensure transition starts
      servicesSubMenu.offsetHeight;
      servicesSubMenu.classList.add("show");
    });
  });

  services.addEventListener("mouseleave", () => {
    // Remove the "show" class to trigger the close transition
    servicesSubMenu.classList.remove("show");

    // Wait for the transition to finish before hiding the element
    servicesSubMenu.addEventListener("transitionend", function handler(event) {
      if (
        event.propertyName === "opacity" &&
        !servicesSubMenu.classList.contains("show")
      ) {
        servicesSubMenu.style.display = "none"; // Hide after fade-out
        servicesSubMenu.removeEventListener("transitionend", handler);
      }
    });
  });

  const tabs = header.querySelectorAll("#tab");
  const tabLinks = header.querySelectorAll("#tab-link");
  const tabsBody = header.querySelector(".mobile__menu-content");
  const tabsContent = tabsBody.querySelector("#content");
  const tabsContentClose = tabsBody.querySelector("#close");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabsBody.style.display = "flex";

      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");

      if (tab.dataset.toggle == "menu") {
        tabsBody.classList.remove("bg-primary");
        tabsContent.innerHTML = menu.innerHTML;
      } else {
        tabsBody.classList.add("bg-primary");
        tabsContent.innerHTML = servicesSubMenu.outerHTML;
      }
    });
  });

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });

      tabsContent.innerHTML = "";
      tabsBody.style.display = "none";
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
    });
  });

  tabsContentClose.addEventListener("click", () => {
    tabsContent.innerHTML = "";
    tabsBody.style.display = "none";
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
  });
}

// hero swiper
let heroSwiper = new Swiper(".hero__swiper .swiper", {
  slidesPerView: 1,
  spaceBetween: 15,
  effect: "fade",
  loop: true,
  // autoHeight: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".hero__swiper .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".hero__swiper .btn-next",
  },
});

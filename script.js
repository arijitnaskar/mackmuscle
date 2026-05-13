document.documentElement.classList.add("has-js");
document.body.classList.add("js-ready");

const preloader = document.querySelector("[data-preloader]");
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const yearNodes = document.querySelectorAll("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const hidePreloader = () => {
  preloader?.classList.add("is-hidden");
};

const closeMenu = () => {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  const icon = navToggle.querySelector("i");
  if (icon) {
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-xmark");
  }
};

window.addEventListener("DOMContentLoaded", () => window.setTimeout(hidePreloader, 550));
window.addEventListener("load", () => window.setTimeout(hidePreloader, 250));

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    const icon = navToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -70px 0px"
  });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
    const hasEmptyField = fields.some((field) => !field.value.trim());
    const emailField = contactForm.querySelector('input[type="email"]');
    const emailValue = emailField?.value.trim() || "";
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    formStatus.classList.remove("is-error");

    if (hasEmptyField || !emailLooksValid) {
      formStatus.textContent = "Please complete all fields with a valid email address.";
      formStatus.classList.add("is-error");
      return;
    }

    const formData = new FormData(contactForm);
    const subject = encodeURIComponent("Mack Muscle enquiry");
    const body = encodeURIComponent(
      `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\nPhone: ${formData.get("phone")}\n\nMessage:\n${formData.get("message")}`
    );

    formStatus.textContent = "Thank you. Your enquiry is ready in your email app, or call us for immediate support.";
    window.location.href = `mailto:accuratehealthcare25@gmail.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
}

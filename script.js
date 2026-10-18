/* ============================================================
   Evergreen Business Consultants — interactions
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Sticky header ---------- */
  const header = document.getElementById("site-header");
  const onScroll = () =>
    header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-nav");

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }),
  );

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById("theme-toggle");
  const themeRoot = document.documentElement;

  function syncThemeButton() {
    const dark = themeRoot.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
  }

  themeToggle.addEventListener("click", () => {
    const next =
      themeRoot.getAttribute("data-theme") === "dark" ? "light" : "dark";
    themeRoot.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ebc-theme", next);
    } catch (err) {
      /* private browsing — the choice just won't persist */
    }
    syncThemeButton();

    if (!prefersReduced) {
      themeRoot.classList.add("theme-anim");
      window.setTimeout(() => themeRoot.classList.remove("theme-anim"), 420);
    }
  });

  syncThemeButton();

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * easeOutCubic(progress));
      el.textContent = prefix + value.toLocaleString("en-US") + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setFinalCount(el) {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    el.textContent =
      prefix + Number(el.dataset.count).toLocaleString("en-US") + suffix;
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);
        prefersReduced ? setFinalCount(el) : animateCount(el);
      });
    },
    { threshold: 0.4 },
  );

  document
    .querySelectorAll(".stat-num")
    .forEach((el) => counterObserver.observe(el));

  /* ---------- Contact form → HTAI lead pipeline ---------- */
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  const errorNote = document.getElementById("form-error");

  // HTAI backend endpoint for lead ingestion (orchestrator container, published on
  // 127.0.0.1:8601). Override by setting window.HTAI_API_BASE before this script loads
  // (e.g. behind the nginx gateway: "http://localhost:8600/api" or your public domain).
  const HTAI_API_BASE =
    window.HTAI_API_BASE ||
    (location.protocol === "http:" || location.protocol === "https:"
      ? location.protocol + "//localhost:8601/api"
      : "http://localhost:8601/api");

  // Accountless fallback for public deploys (e.g. GitHub Pages): the visitor's
  // browser cannot reach this machine's localhost pipeline, so on failure we
  // pre-fill the visitor's own mail client instead.
  const CONTACT_EMAIL = "Julius@evergreenconsultants.site";

  const FIELD_LABELS = {
    name: "Name",
    email: "Email",
    company: "Company",
    service: "Service requested",
    message: "Message",
  };

  function openMailto(data) {
    const lines = Object.entries(data)
      .map(([key, value]) => (FIELD_LABELS[key] || key) + ": " + value)
      .join("\n");
    const subject = encodeURIComponent(
      "Website inquiry — " + (data.name || "a visitor"),
    );
    const body = encodeURIComponent(
      lines + "\n\n— sent from the Evergreen Business Consultants contact form",
    );
    window.location.href =
      "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";
    if (errorNote) errorNote.hidden = true;

    let viaMailto = false;
    try {
      const response = await fetch(HTAI_API_BASE + "/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "Evergreen Website",
          status: "lead",
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Server responded with status " + response.status);
      }

      // The administrator pipeline (n8n -> WhatsApp) will contact the visitor.
    } catch (error) {
      console.warn(
        "HTAI lead endpoint unreachable — falling back to mail client:",
        error,
      );
      openMailto(data);
      viaMailto = true;
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }

    // Success either way: the pipeline ingested the lead, or the visitor's
    // mail client now holds a pre-filled message ready to send.
    form.hidden = true;
    success.hidden = false;
    form.reset();

    let mailtoNote = document.getElementById("mailto-note");
    if (viaMailto) {
      if (!mailtoNote) {
        mailtoNote = document.createElement("p");
        mailtoNote.id = "mailto-note";
        mailtoNote.className = "form-note";
        mailtoNote.textContent =
          "One more step: your email app should have opened with your message pre-filled — please press send.";
        success.appendChild(mailtoNote);
      }
    } else if (mailtoNote) {
      mailtoNote.remove();
    }
  }

  form.addEventListener("submit", handleFormSubmit);

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = String(
    new Date().getFullYear(),
  );
})();

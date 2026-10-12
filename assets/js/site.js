(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile menu
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("hidden", !open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  // Games dropdown (desktop header)
  document.querySelectorAll("[data-dropdown]").forEach((root) => {
    const button = root.querySelector("[data-dropdown-toggle]");
    const panel = root.querySelector("[data-dropdown-panel]");
    const setOpen = (open) => {
      button.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("hidden", !open);
    };
    button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("click", (e) => { if (!root.contains(e.target)) setOpen(false); });
    root.addEventListener("focusout", (e) => { if (e.relatedTarget && !root.contains(e.relatedTarget)) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && button.getAttribute("aria-expanded") === "true") { setOpen(false); button.focus(); }
    });
  });

  // Hero carousel (home): arrows, dots, swipe, autoplay that pauses on hover/focus
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const slides = [...root.querySelectorAll("[data-slide]")];
    const dots = root.querySelector("[data-dots]");
    if (slides.length < 2) return;
    let index = 0, timer = null;
    const dotButtons = slides.map((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero-dot";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => { show(i); restart(); });
      dots?.append(b);
      return b;
    });
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        const on = n === index;
        s.classList.toggle("is-active", on);
        s.toggleAttribute("inert", !on);
        s.setAttribute("aria-hidden", String(!on));
      });
      dotButtons.forEach((b, n) => b.setAttribute("aria-current", String(n === index)));
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const restart = () => { stop(); if (!reduceMotion) timer = setInterval(() => show(index + 1), 6500); };
    root.querySelector("[data-prev]")?.addEventListener("click", () => { show(index - 1); restart(); });
    root.querySelector("[data-next]")?.addEventListener("click", () => { show(index + 1); restart(); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", restart);
    root.addEventListener("focusin", stop);
    let x0 = null;
    root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { show(index + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });
    show(0);
    restart();
  });

  // Game catalog filters (home)
  const filters = document.querySelector("[data-filters]");
  const cards = [...document.querySelectorAll("[data-catalog] [data-tags]")];
  if (filters && cards.length) {
    const matches = (card, key) => key === "all" || card.dataset.tags.split(" ").includes(key);
    filters.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.querySelector(".filter-count").textContent = cards.filter((c) => matches(c, btn.dataset.filter)).length;
    });
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      filters.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      cards.forEach((c) => { c.hidden = !matches(c, btn.dataset.filter); });
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Table of contents: highlight the section being read
  const tocLinks = [...document.querySelectorAll(".toc a")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map();
    tocLinks.forEach((a) => {
      const id = decodeURIComponent(a.hash.slice(1));
      byId.set(id, [...(byId.get(id) || []), a]);
    });
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        tocLinks.forEach((a) => a.classList.remove("is-active"));
        byId.get(entry.target.id)?.forEach((a) => a.classList.add("is-active"));
      }
    }, { rootMargin: "-20% 0px -70% 0px" });
    byId.forEach((_, id) => { const h = document.getElementById(id); if (h) spy.observe(h); });
  }
})();

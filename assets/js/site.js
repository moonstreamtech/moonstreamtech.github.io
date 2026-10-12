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

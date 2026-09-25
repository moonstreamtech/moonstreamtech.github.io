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

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Table of contents: highlight the section being read
  const tocLinks = [...document.querySelectorAll(".toc a")];
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        tocLinks.forEach((a) => a.classList.remove("is-active"));
        byId.get(entry.target.id)?.classList.add("is-active");
      }
    }, { rootMargin: "-15% 0px -75% 0px" });
    byId.forEach((_, id) => { const h = document.getElementById(id); if (h) spy.observe(h); });
  }

  // Brand module: moonstream [tech] → [studio] → [games]
  if (!reduceMotion) {
    document.querySelectorAll("[data-cycle]").forEach((el) => {
      const words = el.dataset.cycle.split(",");
      let i = 0;
      setInterval(() => {
        i = (i + 1) % words.length;
        el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-12%)" }], { duration: 220, easing: "ease-in", fill: "forwards" })
          .onfinish = () => {
            el.textContent = words[i];
            el.animate([{ opacity: 0, transform: "translateY(12%)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" });
          };
      }, 2600);
    });
  }
})();

// Shared page chrome. Every page carries marker comments, and this script
// rewrites what sits between them, so the header, footer and per-game bar are
// edited in one place:
//
//   <!-- @header --> … <!-- /@header -->
//   <!-- @product LastTile --> … <!-- /@product -->   (game pages only)
//   <!-- @footer --> … <!-- /@footer -->
//
// Runs as part of `npm run build`. Content outside the markers is untouched.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const EMAIL = "moonstreamtech@gmail.com";

// Order here is the order everywhere: menu, footer, home catalog.
export const games = [
  { id: "LastTile", name: "Last Tile", menuName: "Last Tile", href: "/LastTile/", status: "Out now", badge: "live",
    art: { src: "/LastTile/img/icon.png", w: 256, h: 256 },
    support: "/LastTile/support/", supportLabel: "Last Tile support",
    tabs: [["Overview", "/LastTile/"], ["Support", "/LastTile/support/"], ["Privacy", "/LastTile/privacy-policy/"], ["Terms", "/LastTile/terms/"]] },
  { id: "Mozai", name: "Mozai", menuName: "Mozai", href: "/Mozai/", status: "Coming soon", badge: "soon",
    art: { src: "/assets/img/mozai-heart.svg", w: 200, h: 200, bg: "bg-surface", pad: true },
    support: "/Mozai/support/", supportLabel: "Mozai support",
    tabs: [["Overview", "/Mozai/"], ["Support", "/Mozai/support/"], ["Privacy", "/Mozai/privacy-policy/"], ["Terms", "/Mozai/terms/"]] },
  { id: "Ribbo", name: "Ribbo: Pond Hopper", menuName: "Ribbo: Pond Hopper", href: "/Ribbo/", status: "In development", badge: "dev",
    art: { src: "/Ribbo/img/pond.svg", w: 400, h: 400, bg: "bg-night" },
    support: "/Ribbo/#support", supportLabel: "Ribbo support",
    tabs: [["Overview", "/Ribbo/"], ["Help", "#support"], ["Privacy policy", "#privacy-policy"], ["Account deletion", "#delete-account"]] },
  { id: "MyMiniBBQ", name: "My Mini BBQ", menuName: "My Mini BBQ", href: "/MyMiniBBQ/", status: "In development", badge: "dev",
    art: { src: "/MyMiniBBQ/img/key-art.webp", w: 640, h: 1146, pos: "object-[50%_25%]" },
    support: "/MyMiniBBQ/#support", supportLabel: "My Mini BBQ support",
    tabs: [["Overview", "/MyMiniBBQ/"], ["Help", "#support"], ["Privacy policy", "#privacy-policy"]] },
  { id: "MyTinyGarden", name: "My Tiny Garden", menuName: "My Tiny Garden", href: "/MyTinyGarden/", status: "In development", badge: "dev",
    art: { src: "/MyTinyGarden/img/garden.svg", w: 400, h: 400, bg: "bg-night" },
    support: "/MyTinyGarden/#support", supportLabel: "My Tiny Garden support",
    tabs: [["Overview", "/MyTinyGarden/"], ["Help", "#support"], ["Privacy policy", "#privacy-policy"]] },
  { id: "MeshChat", name: "MeshChat", menuName: "MeshChat", href: "/MeshChat/", status: "Coming soon", badge: "soon", app: true,
    art: { src: "/MeshChat/img/icon.png", w: 64, h: 64 },
    support: "/MeshChat/support/", supportLabel: "MeshChat support",
    tabs: [["Overview", "/MeshChat/"], ["Support", "/MeshChat/support/"], ["Privacy", "/MeshChat/privacy-policy/"], ["Terms", "/MeshChat/terms/"], ["Child safety", "/MeshChat/child-safety/"], ["Delete account", "/MeshChat/delete-account/"]] },
];

// A square app-icon-like thumbnail at the given size (Tailwind size class + radius class).
const thumb = (g, size = "size-10", radius = "rounded-[10px]") => {
  const a = g.art;
  return `<span class="grid ${size} shrink-0 place-items-center overflow-hidden ${radius} ${a.bg || ""}"><img src="${a.src}" alt="" width="${a.w}" height="${a.h}" loading="lazy" class="${a.pad ? "size-[72%]" : "size-full object-cover"} ${a.pos || ""}"></span>`.replace(/ +"/g, '"');
};

const chevron = `<svg class="size-3.5 opacity-60 transition-transform [[aria-expanded=true]>&]:rotate-180" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cur = (on) => (on ? ` aria-current="page"` : "");

function header(url) {
  const section = url === "/support.html" ? "support" : url === "/privacy.html" ? "privacy" : url === "/" ? "home" : "games";
  const menu = games.map((g) => `
            <a class="menu-item" href="${g.href}">
              ${thumb(g)}
              <span class="min-w-0"><span class="block truncate text-[14.5px] font-medium">${g.menuName}</span><span class="badge badge-${g.badge} mt-1 !border-0 !bg-transparent !p-0 !text-[12px] !text-muted">${g.status}${g.app ? " · App" : ""}</span></span>
            </a>`).join("");
  return `<!-- @header -->
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[10px] focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
<header class="site-header">
  <div class="wrap flex h-16 items-center justify-between gap-6">
    <a href="/" class="text-[20px] text-white" aria-label="Moonstream Tech — home"><span class="brand"><span class="brand-core">moonstream</span><span class="brand-mod">tech</span></span></a>
    <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
      <div class="relative" data-dropdown>
        <button type="button" class="nav-link"${section === "games" ? ` aria-current="page"` : ""} aria-expanded="false" aria-controls="games-menu" data-dropdown-toggle>Games ${chevron}</button>
        <div id="games-menu" class="games-menu hidden" data-dropdown-panel>
          <div class="grid grid-cols-2 gap-0.5">${menu}
          </div>
          <a href="/#games" class="mt-1 flex items-center justify-between rounded-[12px] bg-surface px-4 py-3 text-[14px] font-medium hover:bg-line"><span>Games</span><span class="link-arrow text-muted">All games &amp; apps</span></a>
        </div>
      </div>
      <a class="nav-link" href="/#studio">Studio</a>
      <a class="nav-link" href="/support.html"${cur(section === "support")}>Support</a>
      <a class="nav-link" href="/privacy.html"${cur(section === "privacy")}>Privacy</a>
    </nav>
    <div class="flex items-center gap-2">
      <a href="mailto:${EMAIL}" class="btn btn-primary btn-sm hidden sm:inline-flex">Contact</a>
      <button type="button" class="grid size-10 place-items-center rounded-[10px] hover:bg-white/10 md:hidden" data-menu-toggle aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 5.5h14M2 12.5h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="hidden max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-night md:hidden">
    <div class="wrap py-3">
      <a class="mobile-link" href="/#games">Games<span class="text-muted" aria-hidden="true">→</span></a>
      <div class="grid grid-cols-1 gap-0.5 pb-2 pl-1">${menu.replaceAll("\n            ", "\n        ")}
      </div>
      <a class="mobile-link" href="/#studio">Studio<span class="text-muted" aria-hidden="true">→</span></a>
      <a class="mobile-link" href="/support.html">Support<span class="text-muted" aria-hidden="true">→</span></a>
      <a class="mobile-link" href="/privacy.html">Privacy<span class="text-muted" aria-hidden="true">→</span></a>
      <a href="mailto:${EMAIL}" class="btn btn-primary mt-3 w-full">Contact us</a>
    </div>
  </div>
</header>
<!-- /@header -->`;
}

function product(id, url) {
  const g = games.find((x) => x.id === id);
  if (!g) throw new Error(`unknown game ${id}`);
  const tabs = g.tabs.map(([label, href]) => `<a class="tab" href="${href}"${cur(href === url)}>${label}</a>`).join("\n        ");
  return `<!-- @product ${id} -->
<div class="product-bar">
  <div class="wrap flex items-center gap-6">
    <a href="${g.href}" class="hidden shrink-0 items-center gap-2.5 py-2 text-[14.5px] font-semibold tracking-[-0.01em] sm:flex">${thumb(g, "size-7", "rounded-[7px]")}${g.name}</a>
    <nav aria-label="${g.name}" class="-mx-3 flex min-w-0 flex-1 items-center overflow-x-auto sm:mx-0 sm:justify-end [&::-webkit-scrollbar]:hidden">
        ${tabs}
    </nav>
  </div>
</div>
<!-- /@product -->`;
}

function footer() {
  const col = (title, links) => `
        <div>
          <p class="footer-head">${title}</p>
          <ul class="mt-4 space-y-2.5">${links.map(([l, h]) => `
            <li><a class="footer-link" href="${h}">${l}</a></li>`).join("")}
          </ul>
        </div>`;
  return `<!-- @footer -->
<footer class="band-dark on-dark torn-top overflow-x-clip">
  <div class="wrap pt-14 pb-8 sm:pt-20">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <a href="/" class="text-[22px]" aria-label="Moonstream Tech — home"><span class="brand"><span class="brand-core">moonstream</span><span class="brand-mod">tech</span></span></a>
        <p class="mt-6 max-w-xs text-[17px] leading-snug font-medium tracking-[-0.01em]">Games without edges.<br><span class="text-white/45">Built with care by a small, independent studio.</span></p>
        <a href="mailto:${EMAIL}" class="footer-link mt-6 inline-block underline decoration-white/25 underline-offset-4">${EMAIL}</a>
      </div>
      <div class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">${col("Games &amp; apps", games.map((g) => [g.menuName, g.href]))}${col("Studio", [["Home", "/"], ["Games", "/#games"], ["About", "/#studio"], ["Contact", `mailto:${EMAIL}`]])}${col("Help", [["Support", "/support.html"], ["Privacy Policy", "/privacy.html"], ...games.map((g) => [g.supportLabel, g.support])])}
      </div>
    </div>
    <div class="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
      <p>© 2026 Moonstream Tech. All rights reserved.</p>
      <p class="flex gap-5"><a class="hover:text-white" href="/privacy.html">Privacy Policy</a><a class="hover:text-white" href="/support.html">Support</a></p>
    </div>
  </div>
  <div class="pointer-events-none -mb-[2.2vw] flex justify-center text-[15vw] leading-none text-white/[0.06] select-none" aria-hidden="true"><span class="brand-core">moonstream</span></div>
</footer>
<!-- /@footer -->`;
}

// Rewrites the marked regions of one page. `url` is the page's site path.
export function applyLayout(html, url) {
  return html
    .replace(/<!-- @header -->[\s\S]*?<!-- \/@header -->/, () => header(url))
    .replace(/<!-- @product (\w+) -->[\s\S]*?<!-- \/@product -->/, (_, id) => product(id, url))
    .replace(/<!-- @footer -->[\s\S]*?<!-- \/@footer -->/, () => footer());
}

// ── apply to every page (when run as a script)
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const pages = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", ".git", "mozai-content", "scripts", ".claude"].includes(e.name)) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) pages.push(p);
    }
  };
  walk(".");

  let changed = 0;
  for (const page of pages) {
    const url = "/" + page.split(sep).join("/").replace(/index\.html$/, "");
    const html = readFileSync(page, "utf8");
    const next = applyLayout(html, url);
    if (next !== html) { writeFileSync(page, next); changed++; }
  }
  console.log(`layout applied to ${changed} page(s)`);
}

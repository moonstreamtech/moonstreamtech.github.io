// Stamps a content hash onto the site.css / site.js links in every page,
// so browsers fetch fresh assets right after a deploy instead of mixing new
// HTML with a cached stylesheet. Runs as part of `npm run build`.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const hash = createHash("sha1")
  .update(readFileSync("assets/css/site.css"))
  .update(readFileSync("assets/js/site.js"))
  .digest("hex")
  .slice(0, 8);

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "mozai-content"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".html")) pages.push(path);
  }
};
walk(".");

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const next = html.replace(/(\/assets\/(?:css\/site\.css|js\/site\.js))(\?v=[\w-]+)?/g, `$1?v=${hash}`);
  if (next !== html) writeFileSync(page, next);
}
console.log(`assets stamped ?v=${hash}`);

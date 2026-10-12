# moonstreamtech.github.io
Moonstream Tech — official website (https://moonstreamtech.com)

Static HTML served by GitHub Pages, styled with Tailwind CSS v4.

## Develop

```sh
npm install
npm run dev     # watch mode, rebuilds assets/css/site.css
npm run build   # shared layout + minified CSS + cache-bust links — commit the results
```

Design tokens and components live in `src/site.css`: a game-studio look with
black and white bands joined by torn-paper edges, ink-outlined buttons and cards
with hard offset shadows, and brand lime `#A0F34C` as the studio colour (never
text on white). Fonts: Lilita One for headings, Geist and Geist Mono for text.

The header, the per-game bar and the footer are shared. Pages carry marker
comments (`<!-- @header -->`, `<!-- @product LastTile -->`, `<!-- @footer -->`)
and `scripts/layout.mjs` rewrites what sits between them — edit the chrome
(and the list of games) there, then run `npm run build`.

## Do not move or rename

These URLs are referenced by Google Play listings, AdMob or the games:

- `/support.html`, `/privacy.html`
- `/LastTile/support/`, `/LastTile/privacy-policy/`, `/LastTile/terms/`
- `/Mozai/support/`, `/Mozai/privacy-policy/`, `/Mozai/terms/`
- `/Ribbo/` (with `#support`, `#privacy-policy` and `#delete-account`), `/MyMiniBBQ/`, `/MyTinyGarden/` (with `#support` and `#privacy-policy`)
- `/MeshChat/`, `/MeshChat/support/`, `/MeshChat/privacy-policy/`, `/MeshChat/terms/`, `/MeshChat/child-safety/`, `/MeshChat/delete-account/` (Google Play listing and the app itself link here)
- `/app-ads.txt` (AdMob)
- `/mozai-content/**` (synced automatically from the Mozai repo)

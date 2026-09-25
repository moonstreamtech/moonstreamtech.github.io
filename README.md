# moonstreamtech.github.io
Moonstream Tech — official website (https://moonstreamtech.com)

Static HTML served by GitHub Pages, styled with Tailwind CSS v4.

## Develop

```sh
npm install
npm run dev     # watch mode, rebuilds assets/css/site.css
npm run build   # minified build — commit assets/css/site.css
```

Design tokens live in `src/site.css`. The palette is locked to black, white
and brand lime `#A0F34C`; font is Google Sans.

## Do not move or rename

These URLs are referenced by Google Play listings, AdMob or the games:

- `/support.html`, `/privacy.html`
- `/LastTile/support/`, `/LastTile/privacy-policy/`, `/LastTile/terms/`
- `/Mozai/support/`, `/Mozai/privacy-policy/`, `/Mozai/terms/`
- `/app-ads.txt` (AdMob)
- `/mozai-content/**` (synced automatically from the Mozai repo)

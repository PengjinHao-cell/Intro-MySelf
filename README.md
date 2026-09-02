# Intro-MySelf — Personal Digital Garden

A localhost-only personal digital garden with an editorial, photography-first
interface. Content lives in one file-based source, editable both through the
local Keystatic editor and through direct Markdown/MDX editing.

## Prerequisites

- Node.js 20+ and npm.

## Install

```bash
npm install
npx playwright install chromium
```

## Start locally

```bash
npm run dev
```

Open <http://127.0.0.1:4321> in your browser.

Stop the server with `Ctrl-C`. Stopping the command stops both the site and
the editor; no background service remains afterwards.

## Editing content — two workflows, one source

All content lives in `src/content/` as Markdown/MDX and JSON files. There is
exactly one content source: the browser editor and direct file editing modify
the same files.

### Browser editor (Keystatic)

While `npm run dev` is running, open <http://127.0.0.1:4321/keystatic>.
Editor groups: Moments, Writing, Projects, Photo Stories, Timeline, and Site
Settings. Drafts are visible in the editor but never on the site, in RSS, or
in the sitemap. The editor is a local development tool; there is no production
editor in this release.

### Direct file editing

Edit the `.mdx`/`.json` files under `src/content/` with any editor:

- Frontmatter holds metadata; the document body holds the text.
- Images live under `public/images/content/<collection>/` and are referenced
  by repository-relative paths.
- `src/content/settings/site.json` holds the display name, Now fields, social
  links, and homepage selections.
- Invalid required fields or broken related-content references fail the
  build with a message naming the entry.

## Checks

```bash
npm run test:unit        # Vitest unit tests (schemas and domain queries)
npm run build            # astro check + production build
npm run test:e2e         # Playwright browser acceptance (starts its own dev server)
npm run verify:content   # reversible file → build → page round-trip check
npm run check            # unit + build + e2e
```

## Structure

- `src/content/` — the single shared content source (Markdown/MDX and images).
- `src/content.config.ts` — typed content collection schemas.
- `src/pages/` — routes; `src/layouts/` and `src/components/` — rendering.
- `tests/unit/` — Vitest; `tests/e2e/` — Playwright.

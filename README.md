# Intro-MySelf — Personal Digital Garden Shell

A local-first personal digital garden shell built with Astro and Keystatic. It
provides an editorial, photography-first structure for moments, writing,
projects, photo stories, and a personal timeline.

> [!NOTE]
> This repository is a starter shell, not a finished personal website. The
> bundled writing, projects, dates, and metadata are sample content. Image slots
> currently use a blank-paper placeholder until personal photographs are added.

## What is included

- A responsive editorial website built with Astro.
- File-based content stored as Markdown, MDX, and JSON.
- A local Keystatic editor that writes to the same content files.
- Draft filtering for pages, RSS, and sitemap output.
- Unit, build, accessibility, responsive, and browser acceptance checks.
- A neutral blank-paper placeholder for image slots without uploaded media.

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
- Replace `/images/placeholders/blank-paper.svg` with the path to an uploaded
  image when real media is ready.
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

- `src/content/` — the single shared text and metadata source.
- `public/images/` — uploaded media and the temporary blank-paper placeholder.
- `src/content.config.ts` — typed content collection schemas.
- `src/pages/` — routes; `src/layouts/` and `src/components/` — rendering.
- `tests/unit/` — Vitest; `tests/e2e/` — Playwright.

## Current scope

The project is intended for local development and content preparation. It does
not include hosting configuration, authentication, a production CMS, analytics,
or a public deployment URL.

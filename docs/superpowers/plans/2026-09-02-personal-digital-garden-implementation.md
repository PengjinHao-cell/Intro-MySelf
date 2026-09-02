# Personal Digital Garden Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a localhost-only personal digital garden with an editorial photography-first interface and one file-based content source editable through both Keystatic and Markdown/MDX.

**Architecture:** Astro renders typed local content collections into the homepage and five route families. React is reserved for interactions that need client state, while Keystatic local mode edits the same content and image files consumed by Astro. Vitest verifies schemas and domain queries; Playwright verifies rendered routes, responsiveness, accessibility-critical behavior, and the local editor.

**Tech Stack:** Astro, React, TypeScript, Keystatic, Markdown/MDX, Vitest, Testing Library, Playwright, axe-core, Impeccable

**Spec:** `docs/superpowers/specs/2026-09-02-personal-digital-garden-design.md`

## Global Constraints

- The first release runs only on localhost and must not require a cloud service, database, account, secret, or external runtime API.
- Primary navigation is exactly `Moments`, `Writing`, `Work`, `Photos`, `About`.
- Keystatic and direct file editing must modify one shared local content source; there is no synchronization layer.
- Draft content is excluded from pages, RSS, and sitemap output.
- The fixed palette is paper `#F2EFE7`, ink `#1D211C`, stone `#77766D`, moss `#536457`, and terracotta `#B65C3A`.
- Typography is Noto Serif SC for Chinese headings, LXGW WenKai for Chinese personal and long-form passages, Cormorant Garamond for English display text, and IBM Plex Mono for metadata.
- The visual direction is Editorial / Magazine and must avoid SaaS dashboards, repeated floating cards, glassmorphism, cyberpunk styling, generic AI gradients, and imitation of WeChat.
- Exact locations, credentials, private conversations, unpublished research results, and restricted academic or laboratory data must never enter fixtures or public content.
- All informative images require meaningful alternative text; reduced-motion preferences disable nonessential animation.
- Implementation must preserve the parent repository's unrelated working-tree changes. Every commit stages only the paths listed in its task.

## File Structure

```text
Intro-MySelf/
├── astro.config.mjs                 # Astro integrations and local Keystatic route
├── keystatic.config.ts              # Local editor collections and fields
├── package.json                     # Local commands and pinned project dependencies
├── playwright.config.ts             # Browser acceptance configuration
├── tsconfig.json                    # Strict TypeScript settings
├── vitest.config.ts                 # Unit-test configuration
├── public/
│   ├── fonts/                       # Locally packaged font files and licenses
│   └── images/sample/               # Clearly identified non-personal sample assets
├── src/
│   ├── content.config.ts            # Astro collection loaders and schemas
│   ├── content/                     # Shared Keystatic/direct-edit content source
│   │   ├── moments/
│   │   ├── writing/
│   │   ├── projects/
│   │   ├── photos/
│   │   ├── timeline/
│   │   └── settings/
│   ├── domain/
│   │   ├── content.ts               # Public-entry filtering and ordering
│   │   ├── relations.ts             # Related-content validation
│   │   └── types.ts                 # Shared view-model types
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Document shell, metadata, header, footer
│   │   └── ReadingLayout.astro      # Long-form reading measure and byline
│   ├── components/
│   │   ├── SiteHeader.astro
│   │   ├── SiteFooter.astro
│   │   ├── NowStrip.astro
│   │   ├── MomentEntry.astro
│   │   ├── WritingIndex.astro
│   │   ├── ProjectPreview.astro
│   │   ├── PhotoFigure.astro
│   │   └── MobileNav.tsx            # Only stateful navigation island
│   ├── pages/
│   │   ├── index.astro
│   │   ├── moments/[...id].astro
│   │   ├── moments/index.astro
│   │   ├── writing/[...id].astro
│   │   ├── writing/index.astro
│   │   ├── work/[...id].astro
│   │   ├── work/index.astro
│   │   ├── photos/[...id].astro
│   │   ├── photos/index.astro
│   │   ├── about.astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   └── styles/
│       ├── tokens.css                # Color, type, spacing, and motion tokens
│       ├── global.css                # Reset, base typography, accessibility
│       └── editorial.css             # Twelve-column and reading compositions
├── tests/
│   ├── unit/
│   │   ├── content-schema.test.ts
│   │   ├── content-query.test.ts
│   │   └── relations.test.ts
│   └── e2e/
│       ├── smoke.spec.ts
│       ├── homepage.spec.ts
│       ├── content-routes.spec.ts
│       ├── responsive-a11y.spec.ts
│       └── keystatic.spec.ts
└── README.md                         # Local start, edit, test, and stop workflow
```

---

### Task 1: Reproducible Astro Test Harness

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/pages/index.astro`
- Create: `tests/e2e/smoke.spec.ts`
- Create: `README.md`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm run test:unit`, `npm run test:e2e`, and `npm run check` commands.
- Produces: local website base URL `http://127.0.0.1:4321` for all later browser tests.

- [ ] **Step 1: Create the project manifest and install the exact resolved dependency graph**

Create `package.json` with these scripts before installing packages:

```json
{
  "name": "intro-myself",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev --host 127.0.0.1",
    "build": "astro check && astro build",
    "preview": "astro preview --host 127.0.0.1",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "check": "npm run test:unit && npm run build && npm run test:e2e"
  }
}
```

Run:

```bash
npm install astro@latest @astrojs/react@latest react@latest react-dom@latest @astrojs/check@latest typescript@latest
npm install -D vitest@latest @playwright/test@latest
npx playwright install chromium
```

Expected: `package-lock.json` records the resolved versions and `npm ls --depth=0` exits 0. Do not add Tailwind; the approved editorial design uses focused CSS files.

- [ ] **Step 2: Write the failing localhost smoke test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('serves the personal garden locally', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Personal Digital Garden/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I started with cameras')
})
```

Create `playwright.config.ts` with `baseURL: 'http://127.0.0.1:4321'`, `webServer.command: 'npm run dev'`, `webServer.url` set to the same URL, `reuseExistingServer: false`, and Chromium as the only project.

- [ ] **Step 3: Run the smoke test and preserve RED evidence**

Run: `npm run test:e2e -- tests/e2e/smoke.spec.ts`

Expected: FAIL because the Astro configuration and page do not exist yet. Record the failing assertion or startup error in the task log before proceeding.

- [ ] **Step 4: Add the minimal Astro shell**

Create strict `tsconfig.json` extending `astro/tsconfigs/strict`, an Astro configuration with the React integration, and `src/pages/index.astro` containing a document title and this `<h1>`:

```astro
<h1>I started with cameras.</h1>
```

Create `README.md` with exact commands for install, start, opening localhost, running checks, and stopping with `Ctrl-C`. Do not claim a server remains active after the command is stopped.

- [ ] **Step 5: Run GREEN verification**

Run:

```bash
npm run test:e2e -- tests/e2e/smoke.spec.ts
npm run build
```

Expected: one Playwright test passes and Astro completes a production build.

- [ ] **Step 6: Commit the harness**

```bash
git add Intro-MySelf/package.json Intro-MySelf/package-lock.json Intro-MySelf/astro.config.mjs Intro-MySelf/tsconfig.json Intro-MySelf/vitest.config.ts Intro-MySelf/playwright.config.ts Intro-MySelf/src/pages/index.astro Intro-MySelf/tests/e2e/smoke.spec.ts Intro-MySelf/README.md
git commit -m "chore: initialize personal garden harness"
```

### Task 2: Typed Content Source and Local Editor

**Files:**
- Create: `src/content.config.ts`
- Create: `keystatic.config.ts`
- Create: `src/content/settings/site.json`
- Create: `src/content/moments/first-reproduction.mdx`
- Create: `src/content/writing/validation-loss.mdx`
- Create: `src/content/projects/mini-deepid.mdx`
- Create: `src/content/projects/cv-lab.mdx`
- Create: `src/content/projects/robotics-experiments.mdx`
- Create: `src/content/photos/city-light.mdx`
- Create: `src/content/timeline/2026.json`
- Create: `tests/unit/content-schema.test.ts`
- Modify: `astro.config.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: collections `moments`, `writing`, `projects`, `photos`, `timeline`, and singleton-like `settings` through `astro:content`.
- Produces: Keystatic route `/keystatic` in local storage mode.
- Produces: shared fields `title`, `publishedAt`, `draft`, `tags`, and `content` where applicable.

- [ ] **Step 1: Install content and editor integrations**

Run:

```bash
npm install @keystatic/core@latest @keystatic/astro@latest @astrojs/mdx@latest zod@latest
```

Expected: install succeeds without peer-dependency errors. Run `npm ls @keystatic/core @keystatic/astro @astrojs/mdx` and resolve any mismatch by selecting mutually compatible current releases rather than using `--force`.

- [ ] **Step 2: Write failing schema tests**

Create `tests/unit/content-schema.test.ts` that imports exported Zod schemas from `src/content.config.ts` and asserts:

```ts
expect(momentSchema.safeParse({ body: 'test', publishedAt: new Date(), draft: false, images: [] }).success).toBe(true)
expect(momentSchema.safeParse({ body: 'test', publishedAt: new Date(), draft: false, images: new Array(10).fill({ src: '/x.jpg', alt: 'x' }) }).success).toBe(false)
expect(photoSchema.safeParse({ title: 'City light', publishedAt: new Date(), draft: false, category: 'City', images: [{ src: '/x.jpg', alt: '' }] }).success).toBe(false)
expect(projectSchema.safeParse({ title: 'Mini DeepID', publishedAt: new Date(), draft: false, category: 'Computer Vision', status: 'completed' }).success).toBe(true)
```

- [ ] **Step 3: Run tests to verify RED**

Run: `npm run test:unit -- tests/unit/content-schema.test.ts`

Expected: FAIL because the schema exports do not exist.

- [ ] **Step 4: Implement collection schemas and matching Keystatic fields**

In `src/content.config.ts`, export Zod schemas with these exact constraints:

- Moment: body, `publishedAt`, optional city, zero-to-nine images, tags, optional related references, and `draft` defaulting to true.
- Writing: title, summary, cover, type enum `article | note`, topics, `publishedAt`, positive integer `readingMinutes`, relations, and draft.
- Project: title, category enum `Computer Vision | Deep Learning | Robotics | Software`, status enum `planned | active | completed | archived`, technologies, dates, results, cover, repository URL, featured, and draft.
- Photo: title, category enum `Landscape | City | People | Experiment`, at least one image with non-empty alt text, optional city/camera/lens/explanation, order, and draft.
- Timeline: year plus ordered items containing ISO date, title, and summary.
- Settings: display name, introduction, Now fields, social links, homepage selections.

Configure `keystatic.config.ts` with `storage: { kind: 'local' }` and collections that write into the exact `src/content/*` paths. Use MDX document fields for rich bodies and image directories under `public/images/content/<collection>/`.

Update `astro.config.mjs` to register React, MDX, and Keystatic integrations.

- [ ] **Step 5: Add safe representative fixtures**

Add one published entry per major collection using clearly non-private sample text. Add all three selected project entries: `mini-deepid`, `cv-lab`, and `robotics-experiments`. Mini DeepID may use only the already supplied public facts: 10 identities, 500 face images, 160-dimensional representation, and 77.50% test accuracy. CV Lab and Robotics Experiments must be labelled as sample structures awaiting owner-supplied facts; they must not claim completed experiments or results. Use generated geometric sample images or locally created neutral image assets; do not imply they are the owner's photographs.

- [ ] **Step 6: Verify schema GREEN and editor availability**

Run:

```bash
npm run test:unit -- tests/unit/content-schema.test.ts
npm run build
```

Expected: all schema tests pass and Astro loads every fixture without collection errors.

- [ ] **Step 7: Commit content foundations**

```bash
git add Intro-MySelf/package.json Intro-MySelf/package-lock.json Intro-MySelf/astro.config.mjs Intro-MySelf/keystatic.config.ts Intro-MySelf/src/content.config.ts Intro-MySelf/src/content Intro-MySelf/tests/unit/content-schema.test.ts Intro-MySelf/public/images
git commit -m "feat: add typed local content source"
```

### Task 3: Public Content Queries and Relation Validation

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/content.ts`
- Create: `src/domain/relations.ts`
- Create: `tests/unit/content-query.test.ts`
- Create: `tests/unit/relations.test.ts`

**Interfaces:**
- Produces: `onlyPublished<T extends { data: { draft: boolean } }>(entries: T[]): T[]`.
- Produces: `newestFirst<T extends { data: { publishedAt: Date } }>(entries: T[]): T[]`.
- Produces: `validateRelations(refs: ContentRef[], available: Set<string>): RelationIssue[]`.
- Defines: `ContentRef = { collection: 'moments' | 'writing' | 'projects' | 'photos'; id: string }`.
- Defines: `RelationIssue = { ref: ContentRef; message: string }`.

- [ ] **Step 1: Write failing query and relation tests**

Test that `onlyPublished` removes drafts without mutating input, `newestFirst` produces descending dates without mutating input, and `validateRelations` returns:

```ts
[{ ref: { collection: 'projects', id: 'missing' }, message: 'Missing related content: projects/missing' }]
```

for a missing reference while returning an empty list for `projects/mini-deepid` when that key exists.

- [ ] **Step 2: Run targeted tests to verify RED**

Run: `npm run test:unit -- tests/unit/content-query.test.ts tests/unit/relations.test.ts`

Expected: FAIL with unresolved imports from `src/domain`.

- [ ] **Step 3: Implement immutable domain helpers**

Implement `onlyPublished` with `filter`, `newestFirst` with `toSorted` or a copied array, and `validateRelations` by comparing `${collection}/${id}` keys. Keep these functions independent of Astro so they can be tested without the runtime.

- [ ] **Step 4: Run GREEN tests and type checks**

Run:

```bash
npm run test:unit -- tests/unit/content-query.test.ts tests/unit/relations.test.ts
npx astro check
```

Expected: all targeted tests pass with zero Astro type errors.

- [ ] **Step 5: Commit content-domain behavior**

```bash
git add Intro-MySelf/src/domain Intro-MySelf/tests/unit/content-query.test.ts Intro-MySelf/tests/unit/relations.test.ts
git commit -m "feat: validate public content relationships"
```

### Task 4: Editorial Design System and Global Shell

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/editorial.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/MobileNav.tsx`
- Create: `public/fonts/README.md`
- Modify: `src/pages/index.astro`
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `BaseLayout` props `{ title: string; description: string; image?: string }`.
- Produces: CSS tokens `--paper`, `--ink`, `--stone`, `--moss`, `--terracotta`, type families, spacing, measure, and motion durations.
- Produces: semantic site header, primary navigation, main landmark, and footer on every public page.

- [ ] **Step 1: Extend the smoke test with failing design-shell assertions**

Assert exact navigation names, one `<main>`, visible keyboard focus after pressing Tab, CSS values for `--paper` and `--ink`, and absence of horizontal overflow at 390px.

- [ ] **Step 2: Run the test to verify RED**

Run: `npm run test:e2e -- tests/e2e/smoke.spec.ts`

Expected: FAIL because navigation and design tokens are absent.

- [ ] **Step 3: Implement tokens and global accessibility rules**

Define the five approved colors exactly. Add locally served `@font-face` declarations only after verifying each font file's license permits bundling; otherwise install a package that distributes the font with its license and copy both asset and license into `public/fonts/`. Use `:focus-visible`, `prefers-reduced-motion`, semantic defaults, readable Chinese line height, and a skip link.

- [ ] **Step 4: Implement the global shell**

Build an asymmetric header in Astro, with `MobileNav.tsx` as the only hydrated navigation island. The mobile button must expose `aria-expanded`, control a labelled menu, close on Escape, and restore focus. Do not add decorative icon dependencies unless a functional icon cannot be expressed by text and CSS.

- [ ] **Step 5: Verify shell GREEN**

Run:

```bash
npm run test:e2e -- tests/e2e/smoke.spec.ts
npm run build
```

Expected: smoke assertions pass, no overflow occurs at 390px, and the build contains no remote font request.

- [ ] **Step 6: Commit the design system**

```bash
git add Intro-MySelf/src/styles Intro-MySelf/src/layouts/BaseLayout.astro Intro-MySelf/src/components/SiteHeader.astro Intro-MySelf/src/components/SiteFooter.astro Intro-MySelf/src/components/MobileNav.tsx Intro-MySelf/src/pages/index.astro Intro-MySelf/public/fonts Intro-MySelf/tests/e2e/smoke.spec.ts
git commit -m "feat: establish editorial site shell"
```

### Task 5: Homepage Narrative

**Files:**
- Create: `src/components/NowStrip.astro`
- Create: `src/components/MomentEntry.astro`
- Create: `src/components/WritingIndex.astro`
- Create: `src/components/ProjectPreview.astro`
- Create: `src/components/PhotoFigure.astro`
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: published, newest-first entries from Task 3.
- Produces: homepage sections with accessible names `Introduction`, `Now`, `Latest moments`, `Latest writing`, `Selected work`, and `Photography`.
- Produces: reusable preview components that accept typed Astro collection entries.

- [ ] **Step 1: Write the failing homepage narrative test**

Assert that the approved opening copy appears, the six named sections occur in document order, exactly three latest Moments appear, Mini DeepID/CV Lab/Robotics Experiments are selected, article previews expose date and reading time, and the closing Human Vision/Machine Vision sentence is present.

- [ ] **Step 2: Verify RED**

Run: `npm run test:e2e -- tests/e2e/homepage.spec.ts`

Expected: FAIL because the homepage sections do not exist.

- [ ] **Step 3: Implement typed preview components**

Each component owns one responsibility: `NowStrip` renders settings; `MomentEntry` renders text and an adaptive zero-to-nine image composition; `WritingIndex` renders a numbered index; `ProjectPreview` foregrounds question/result/learning; `PhotoFigure` enforces `alt`, caption, dimensions, and loading strategy.

- [ ] **Step 4: Compose the asymmetric homepage**

Use server-rendered content queries. Reserve image dimensions, mark the opening image eager/high-priority, lazy-load below-the-fold images, and use CSS grid-breaking only at widths where it cannot produce horizontal overflow. Do not hydrate static sections.

- [ ] **Step 5: Verify homepage GREEN**

Run:

```bash
npm run test:e2e -- tests/e2e/homepage.spec.ts
npm run build
```

Expected: narrative, selection, and image assertions pass; Astro build succeeds.

- [ ] **Step 6: Commit the homepage**

```bash
git add Intro-MySelf/src/components Intro-MySelf/src/pages/index.astro Intro-MySelf/tests/e2e/homepage.spec.ts
git commit -m "feat: build personal garden homepage"
```

### Task 6: Content Listings and Detail Routes

**Files:**
- Create: `src/layouts/ReadingLayout.astro`
- Create: `src/pages/moments/index.astro`
- Create: `src/pages/moments/[...id].astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[...id].astro`
- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[...id].astro`
- Create: `src/pages/photos/index.astro`
- Create: `src/pages/photos/[...id].astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`
- Create: `tests/e2e/content-routes.spec.ts`

**Interfaces:**
- Consumes: collection entries and domain filters from Tasks 2 and 3.
- Produces: listing and static detail routes for every published entry.
- Produces: `ReadingLayout` props `{ title; summary?; publishedAt; readingMinutes?; topics?; cover? }`.

- [ ] **Step 1: Write failing route-contract tests**

Use a table-driven Playwright test for `/moments`, `/writing`, `/work`, `/photos`, and `/about`. Assert each route's unique heading and published fixture link. Visit each fixture detail route and assert its title, type-specific metadata, body, and canonical breadcrumb. Assert an unknown path shows the custom 404 page and that no draft title is visible in listings.

- [ ] **Step 2: Verify RED**

Run: `npm run test:e2e -- tests/e2e/content-routes.spec.ts`

Expected: FAIL with 404 responses for unimplemented routes.

- [ ] **Step 3: Build listing routes**

Use `getCollection`, `onlyPublished`, and `newestFirst`. Moments use a chronological feed; Writing uses article/note filters and a numbered index; Work groups categories without empty sections; Photos use an irregular editorial sequence; About renders the story, Timeline, Now, and only supplied public contacts.

- [ ] **Step 4: Build static detail routes**

Use `getStaticPaths` to return only published entries. Render MDX with Astro's content renderer. Writing uses `ReadingLayout`; Project detail preserves `Overview → Question → Process → Result → What I Learned → Gallery or Demo → Repository`; photo details preserve metadata without exact coordinates. Missing optional images use a text-led layout.

- [ ] **Step 5: Verify route GREEN**

Run:

```bash
npm run test:e2e -- tests/e2e/content-routes.spec.ts
npm run build
```

Expected: all public routes and 404 assertions pass; build output contains no draft route.

- [ ] **Step 6: Commit routes**

```bash
git add Intro-MySelf/src/layouts/ReadingLayout.astro Intro-MySelf/src/pages Intro-MySelf/tests/e2e/content-routes.spec.ts
git commit -m "feat: add digital garden content routes"
```

### Task 7: Prove the Keystatic/File Round Trip

**Files:**
- Modify: `keystatic.config.ts`
- Modify: `README.md`
- Create: `tests/e2e/keystatic.spec.ts`
- Create: `scripts/verify-content-roundtrip.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run verify:content`, a reversible check that creates a temporary Moment through the shared file contract, verifies it through Astro, and restores the tree.
- Produces: documented editor URL `http://127.0.0.1:4321/keystatic`.

- [ ] **Step 1: Write failing editor availability test**

Create a Playwright test that opens `/keystatic`, asserts a `Moments` collection link and a create action, and verifies the browser receives no request to a non-local origin while loading the editor shell.

- [ ] **Step 2: Run to verify RED**

Run: `npm run test:e2e -- tests/e2e/keystatic.spec.ts`

Expected: FAIL until the final Keystatic collection labels and route are wired correctly.

- [ ] **Step 3: Implement a reversible file round-trip verifier**

`scripts/verify-content-roundtrip.mjs` must:

1. refuse to overwrite an existing `src/content/moments/roundtrip-check.mdx`;
2. write a valid published test entry using Node filesystem APIs;
3. run the Astro build as a child process and assert the generated Moment page contains a unique marker;
4. remove only the exact test entry in a `finally` block;
5. exit nonzero if cleanup fails.

Add `"verify:content": "node scripts/verify-content-roundtrip.mjs"` to `package.json`.

- [ ] **Step 4: Finish editor schemas and author workflow documentation**

Ensure every field from the approved spec is exposed in the correct Keystatic group. Document both workflows: browser editor and direct MDX editing. Document that stopping `npm run dev` stops both the site and editor, and that the production editor remains out of scope.

- [ ] **Step 5: Verify GREEN and a clean content tree**

Run:

```bash
npm run test:e2e -- tests/e2e/keystatic.spec.ts
npm run verify:content
test ! -e src/content/moments/roundtrip-check.mdx
git status --short -- src/content
```

Expected: tests pass, the temporary file is absent, and no unexpected content changes remain.

- [ ] **Step 6: Commit the authoring workflow**

```bash
git add Intro-MySelf/keystatic.config.ts Intro-MySelf/package.json Intro-MySelf/scripts/verify-content-roundtrip.mjs Intro-MySelf/tests/e2e/keystatic.spec.ts Intro-MySelf/README.md
git commit -m "test: prove local content editing round trip"
```

### Task 8: SEO, RSS, Sitemap, Accessibility, and Responsive Acceptance

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `astro.config.mjs`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `src/styles/editorial.css`
- Create: `tests/e2e/responsive-a11y.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `/rss.xml`, `/sitemap-index.xml` or the sitemap path emitted by the installed integration, canonical metadata, Open Graph metadata, and draft-free feeds.
- Produces: verified viewports 390×844, 768×1024, and 1440×1000.

- [ ] **Step 1: Install official feed/sitemap and accessibility test dependencies**

Run:

```bash
npm install @astrojs/rss@latest @astrojs/sitemap@latest
npm install -D @axe-core/playwright@latest
```

- [ ] **Step 2: Write failing acceptance tests**

For each representative viewport, visit all primary pages and assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. Run axe and fail on serious or critical violations. Assert keyboard navigation reaches the skip link and primary navigation, the mobile menu works without hover, images have valid alternative-text behavior, and reduced-motion emulation removes nonessential transition durations. Fetch RSS and sitemap, asserting published URLs appear and a known draft identifier does not.

- [ ] **Step 3: Run to verify RED**

Run: `npm run test:e2e -- tests/e2e/responsive-a11y.spec.ts`

Expected: FAIL because feeds, sitemap, metadata, or required accessibility behavior is incomplete.

- [ ] **Step 4: Implement feeds and metadata**

Use `@astrojs/rss` over only published Writing and Moments entries. Register the official sitemap integration. Base canonical URLs on a single local-safe `site` configuration value documented for replacement at deployment time; do not invent a public domain. Add title, description, canonical, Open Graph type/image, and robots metadata to `BaseLayout`.

- [ ] **Step 5: Fix responsive and accessibility failures at their source**

Adjust shared tokens, layouts, or components rather than adding per-test exceptions. Preserve visible focus, semantic headings, AA contrast, reserved image dimensions, usable galleries without hover, and reduced motion. Confirm no generic card or gradient workaround enters the design.

- [ ] **Step 6: Run GREEN acceptance**

Run:

```bash
npm run test:e2e -- tests/e2e/responsive-a11y.spec.ts
npm run build
```

Expected: all viewport, axe, keyboard, feed, sitemap, and draft-exclusion checks pass.

- [ ] **Step 7: Commit quality features**

```bash
git add Intro-MySelf/package.json Intro-MySelf/package-lock.json Intro-MySelf/astro.config.mjs Intro-MySelf/src/pages/rss.xml.ts Intro-MySelf/src/layouts/BaseLayout.astro Intro-MySelf/src/styles Intro-MySelf/tests/e2e/responsive-a11y.spec.ts
git commit -m "feat: add accessible feeds and metadata"
```

### Task 9: Impeccable Review and Final Verification

**Files:**
- Modify: files identified by deterministic Impeccable findings, limited to `src/` and tests that prove the correction
- Modify: `README.md`
- Create: `tests/e2e/impeccable-regressions.spec.ts`
- Create: `docs/verification/2026-09-02-local-acceptance.md`

**Interfaces:**
- Consumes: complete website and all verification commands.
- Produces: a reproducible acceptance record containing RED/GREEN references, exact commands, exit results, browser viewports, and any accepted limitations.

- [ ] **Step 1: Audit the staged and working tree before tool installation**

Run:

```bash
git status --short
git diff --check
```

Expected: unrelated parent-repository changes may exist, but the `Intro-MySelf` paths from Tasks 1–8 are committed and clean.

- [ ] **Step 2: Install and initialize Impeccable in the project scope**

Run the repository's current official installation flow from `Intro-MySelf`, beginning with:

```bash
npx impeccable install
```

Then initialize it with the approved design language from the spec: Photography × Computer Vision; Editorial / Magazine; personal, image-first, and research-notebook-like; no SaaS dashboard, generic AI gradient, glassmorphism, or excessive cards. Inspect every generated file before staging it. If Codex requests hook approval, approve only the project-local Impeccable hook after reading its command and target paths.

- [ ] **Step 3: Run deterministic UI checks and record findings**

Run the installed Impeccable audit commands shown by its current project help. Record the command, tool version, findings, and exact affected paths. Do not treat a clean command exit as visual acceptance by itself.

- [ ] **Step 4: Add deterministic visual regression assertions and capture RED where needed**

Create `tests/e2e/impeccable-regressions.spec.ts` with a table of every public route and these fixed checks: the computed body background is `rgb(242, 239, 231)`; the computed primary text color is `rgb(29, 33, 28)`; no element has a horizontal bounding box outside the viewport at 390×844 or 1440×1000; no public element uses a computed font family containing Inter, Roboto, Arial, Helvetica, `system-ui`, or `-apple-system`; and every `[data-editorial-section]` after the opening has either a different column start, image ratio, or text measure from its immediate predecessor. Add the smallest additional assertion for each material Impeccable finding, naming the finding in the test title. Run the new file before correcting the UI and record every failing assertion as RED evidence.

- [ ] **Step 5: Make the minimal visual corrections and verify GREEN**

Change only the components or tokens responsible for accepted findings. Re-run `npm run test:e2e -- tests/e2e/impeccable-regressions.spec.ts` and the Impeccable check. Preserve the approved design specification; reject recommendations that would turn the site into a generic template and record the finding, decision, and reason in the acceptance document.

- [ ] **Step 6: Run the complete release-equivalent local gate**

Run:

```bash
npm run test:unit
npm run verify:content
npm run build
npm run test:e2e
git diff --check
```

Expected: every command passes, the reversible content check leaves no file behind, and the development server is stopped after Playwright finishes.

- [ ] **Step 7: Perform browser acceptance and write the evidence record**

Open the homepage, one Moment, one Article, one Project, one Photo Story, About, and `/keystatic` at 390×844 and 1440×1000. Verify visual hierarchy, Chinese typography, image cropping, keyboard focus, menus, and absence of horizontal overflow. Write exact results and screenshots paths into `docs/verification/2026-09-02-local-acceptance.md`; do not claim any cloud or public deployment.

- [ ] **Step 8: Audit the final staged scope and commit**

Run:

```bash
git status --short
git diff --cached --name-only
git diff --cached --check
```

Stage only `Intro-MySelf` implementation, tests, documentation, and reviewed Impeccable project files. Confirm no `.env`, token, unrelated parent file, or generated report directory is staged, then commit:

```bash
git commit -m "feat: complete local personal digital garden"
```

## Final Completion Gate

Before reporting completion, apply the verification-before-completion workflow and cite fresh output from the Task 9 full gate. Completion means the localhost site, local editor, file round trip, content routes, drafts, responsive behavior, accessibility, feeds, and design audit all meet the acceptance criteria. It does not mean the site is deployed, publicly reachable, or running after the verification process ends.

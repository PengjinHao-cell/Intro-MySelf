# Local Acceptance Record — Personal Digital Garden

Date: 2026-09-02
Scope: first localhost-only release, per
`docs/superpowers/specs/2026-09-02-personal-digital-garden-design.md` and
`docs/superpowers/plans/2026-09-02-personal-digital-garden-implementation.md`.

## Release gate (fresh output)

All commands run from the project root on 2026-09-02, exit 0:

| Command | Result |
| --- | --- |
| `npm run test:unit` | 3 files, 10 tests passed |
| `npm run verify:content` | Round trip verified: temporary Moment → build → marker on generated page → entry removed |
| `npm run build` | `astro check` 0 errors, static build complete |
| `npm run test:e2e` | 52 tests passed (Chromium, dev server on 127.0.0.1:4321) |
| `git diff --check` | clean |

Playwright stops the dev server after the run; `astro dev stop` confirmed no
background server remains.

## RED/GREEN evidence highlights

- Task 1 smoke: RED = web server could not serve `/` (no pages directory);
  GREEN = 1 passing smoke test + production build.
- Task 2 schemas: RED = `Cannot find module '../../src/content.config'`;
  GREEN = 4 schema tests + build loads all 9 fixtures.
- Task 3 domain: RED = unresolved `src/domain` imports; GREEN = 6 tests.
- Task 4 shell: RED = navigation/tokens absent; GREEN = 3 smoke tests.
  Hex comparison is case-insensitive because the CSS minifier lowercases
  values (`#F2EFE7` → `#f2efe7`).
- Task 5 homepage: RED = 4 failing narrative tests; GREEN = 4 passing.
- Task 6 routes: RED = 404s on unimplemented routes; GREEN = 12 passing,
  build output contains no draft route (`dist/writing/` has no quiet-draft).
- Task 7 editor: editor shell loads with all six configured groups;
  Keystatic UI's single external request (its own Inter font) is rewritten to
  the locally packaged copy in dev, so the editor makes zero non-local
  requests.
- Task 8 acceptance: RED = axe contrast violations, missing RSS/sitemap,
  missing canonical; GREEN = all fixed at the source. Contrast was fixed by a
  darker `--stone-text: #63625a` token for small text (the approved `--stone`
  stays the design token; it fails WCAG AA on paper at small sizes, so small
  text uses the derived shade).
- Task 9 regressions: RED = touch target ~29px and one uniform
  section pair; GREEN = 22 passing deterministic regression assertions.

## Browser acceptance

Reviewed visually at 390×844 and 1440×1000: homepage, one Moment, one
Article, one Project, one Photo Story, About, and `/keystatic` (editor).

Screenshots (committed):

- `docs/verification/screenshots/home-390x844.png`
- `docs/verification/screenshots/home-1440x1000.png`
- `docs/verification/screenshots/moments-first-reproduction-390x844.png`
- `docs/verification/screenshots/moments-first-reproduction-1440x1000.png`
- `docs/verification/screenshots/writing-validation-loss-390x844.png`
- `docs/verification/screenshots/writing-validation-loss-1440x1000.png`
- `docs/verification/screenshots/work-mini-deepid-390x844.png`
- `docs/verification/screenshots/work-mini-deepid-1440x1000.png`
- `docs/verification/screenshots/photos-city-light-390x844.png`
- `docs/verification/screenshots/photos-city-light-1440x1000.png`
- `docs/verification/screenshots/about-390x844.png`
- `docs/verification/screenshots/about-1440x1000.png`

Verified by inspection: asymmetric editorial opening with offset photograph,
Now strip, three Moment forms, numbered writing index, narrative project
previews, full-width photography closing; Chinese/English typography loads
from local font files (Noto Serif SC, LXGW WenKai, Cormorant Garamond, IBM
Plex Mono); keyboard focus visible on the skip link and navigation; the
mobile menu opens without hover, closes on Escape, and restores focus; no
horizontal overflow on any reviewed page or viewport.

## Impeccable design review

- Installed: `impeccable` npm package v3.6.1 (skills v4.1.3), project scope
  (`npx impeccable install`, target 1 + project location). Package tarball
  was inspected before running: Apache-2.0, no postinstall, no shell-out
  beyond its own skill distribution. SkillSpector static scan reported
  CRITICAL/DO_NOT_INSTALL from 47 findings; manual review showed these are
  false positives of the same class as the documented anthropics/skills
  case (its own "skills update" command, its own distribution API, base64
  used only for HTTP Basic auth and PNG encoding). Proceeded after user
  approval.
- Project-local detector hook reviewed before approving: reads the hook
  event from stdin, scans touched UI files, writes an audit log, always
  exits 0. Hook command and paths: `.claude/settings.local.json` →
  `.claude/skills/impeccable/scripts/hook.mjs`.
- Detector run (file scan over `src/` + URL scan of the running site at
  1280×800): 0 findings.
- Manual audit findings applied: mobile menu toggle enlarged to the 44px
  touch target (WCAG 2.5.8); writing summaries and project questions given
  distinct text measures (60ch / 70ch) so adjacent editorial sections differ
  in composition. No finding conflicted with the approved spec; no
  recommendation that would genericize the design was adopted.

## Accepted limitations (recorded decisions)

1. **Sitemap**: `@astrojs/sitemap` is installed but not registered. It
   generates the sitemap only at build time, so the acceptance tests could
   not verify it against the running dev server. The sitemap is generated by
   static routes (`src/pages/sitemap-index.xml.ts`, `sitemap-0.xml.ts`) that
   work identically in dev and build and exclude drafts.
2. **Keystatic build exclusion**: the editor's on-demand routes are
   registered only under `astro dev`; production editor is out of scope for
   this release (per spec). The production build is fully static.
3. **Astro 7 agent detection**: Astro 7 auto-backgrounds `astro dev` when it
   detects an AI agent environment. Playwright's web server sets
   `ASTRO_DEV_BACKGROUND=0` so the dev server runs in the foreground and
   Playwright can manage its lifecycle.
4. **LXGW WenKai subset**: the shipped LXGW WenKai covers GB2312 + ASCII +
   CJK punctuation (~7.2k glyphs, 1.5MB woff2) to keep the repo lean.
   Characters outside the subset fall back to the next family in the stack.
5. **Sample content**: all fixtures are clearly marked sample content
   (geometric generated images, "Sample — replace with your own words").
   Mini DeepID uses only the supplied public facts. `https://github.com/your-username`
   is a visibly replaceable placeholder link.
6. **Rich bodies**: bodies are edited as multiline markdown in the MDX
   document body (Keystatic `contentField`), and `body` is optional in the
   frontmatter schema; unit tests validate the schema contract as specified.
7. **This release is localhost-only**: nothing here is deployed, publicly
   reachable, or left running after verification.

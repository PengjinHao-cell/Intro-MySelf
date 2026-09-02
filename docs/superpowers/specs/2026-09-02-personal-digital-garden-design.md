# Personal Digital Garden Design

Date: 2026-09-02  
Status: approved design, awaiting written-spec review

## 1. Product definition

The site is a personal digital garden for a computer science student exploring photography, computer vision, machine learning, deep learning, and robotics. It is not primarily a resume or a social network. It should record the connection between photography and machine vision while allowing projects, learning, writing, and everyday moments to accumulate over several years.

The central narrative is:

> Photography → curiosity about images → computer vision → machine learning → research and continued exploration

The site should feel professional enough to be useful and personal enough to be memorable. The first release runs only on localhost and requires no cloud services.

## 2. Goals and non-goals

### Goals

- Present a coherent personal identity rather than a list of technologies.
- Support low-friction Moments, long-form Writing, Projects, and curated Photography.
- Provide a local browser-based editor and direct Markdown/MDX editing over one shared content source.
- Work well on phone, tablet, and desktop.
- Remain maintainable as the owner's interests and experience evolve.
- Preserve privacy by publishing only intentionally public content.

### Non-goals for the first release

- Cloud deployment, domains, or hosted services.
- Accounts, likes, comments, guestbooks, friend relationships, or private audiences.
- A database or cloud-hosted CMS.
- AI features.
- Multiple languages or a theme switcher.
- A publicly available administration interface.
- Precise locations or sensitive personal, academic, or research information.

Future capabilities are not prohibited, but the first release will not build unused abstractions for them.

## 3. Technical architecture

### Stack

- Astro for routing, content-driven pages, static rendering, RSS, and sitemap generation.
- React and TypeScript for interactive components that genuinely need client-side behavior.
- Keystatic in local storage mode for the browser-based editor.
- Astro content collections for typed content validation, querying, and rendering.
- Markdown or MDX for content files and project-local assets for images.
- Impeccable for design initialization and deterministic UI review during implementation.

### Content flow

```text
Keystatic at /keystatic ─┐
                         ├── local Markdown/MDX and image files
Direct file editing ─────┘                │
                                          ▼
                              Astro content collections
                                          │
                                          ▼
                                  localhost website
```

Keystatic and direct file editing must modify the same source files. There must not be a second content store or synchronization layer. Because the editor is local-only in this release, it does not require login. A future deployed site should omit or disable the administration route until a separate authentication decision is approved.

## 4. Information architecture

The primary navigation contains five destinations:

```text
Moments   Writing   Work   Photos   About
```

The homepage curates content from these areas. `Now` and `Timeline` live under About instead of occupying primary navigation positions.

### Moments

Moments are low-pressure entries for photographs, learning progress, experiment results, and everyday observations. Each entry supports:

- publication date and optional manually controlled time;
- body text;
- one to nine images;
- optional city-level location;
- tags;
- optional related article or project;
- draft or published status.

The interface uses a chronological editorial feed rather than a copy of WeChat Moments.

### Writing

Writing combines two related content types under one navigation destination:

- Article: long-form essays, reflections, and photography stories.
- Note: focused records about computer vision, machine learning, deep learning, mathematics, or another learning topic.

Entries support title, summary, cover image, body, type, topics, publication date, reading time, related content, and draft status.

### Work

Work contains projects in Computer Vision, Deep Learning, Robotics, and Software. Each project follows a consistent narrative:

```text
Overview → Question → Process → Result → What I Learned → Gallery or Demo → Repository
```

Project metadata includes category, status, technologies, start and end dates, key results, cover image, repository URL, featured state, and draft state. CV Lab is a continuing project containing numbered experiments rather than dozens of unrelated top-level projects.

### Photos

Photos contains curated photographic work and is separate from casual images in Moments. It supports individual photographs and photo stories in the categories Landscape, City, People, and Experiment. Entries may include capture date, city, camera and lens data, a short explanation, custom ordering, and draft status. Exact coordinates are not published.

### About

About contains:

- the personal story from photography to computer vision;
- current identity and interests;
- Timeline;
- Now;
- public contact links.

Now also appears as a compact block on the homepage and is maintained through site settings.

## 5. Local content administration

Keystatic is available at `http://localhost:4321/keystatic` while the local development server is running. Its editor groups are:

- Moments;
- Writing;
- Projects;
- Photo Stories;
- Timeline;
- Site Settings.

Site Settings owns the display name, short introduction, current learning/building/reading/location fields, public social links, and homepage selections. Content images are stored in a predictable project directory and referenced with repository-relative paths. Draft entries are visible in the editor but excluded from public routes and feeds.

## 6. Design specification

### Purpose statement

The interface should help visitors understand the owner's evolving relationship with photography, technology, and research within a few moments. It should remain comfortable for long reading and image viewing while making frequent small updates feel natural.

### Aesthetic direction

The single aesthetic direction is **Editorial / Magazine**: a photography book, research notebook, and independent Chinese publication combined. The interface should use restraint, strong typographic hierarchy, asymmetric composition, and meaningful image scale.

It must avoid generic SaaS dashboards, repeated floating cards, glassmorphism, cyberpunk styling, generic AI gradients, decorative animation without meaning, and imitation of WeChat's interface.

### Color palette

- Paper background: `#F2EFE7`
- Primary ink: `#1D211C`
- Secondary stone: `#77766D`
- Moss accent: `#536457`
- Terracotta accent: `#B65C3A`

Colors are exposed as CSS design tokens. The first release has one fixed warm-paper theme.

### Typography

- Chinese headings: Noto Serif SC.
- Chinese personal and long-form passages: LXGW WenKai.
- English display text: Cormorant Garamond.
- Dates, measurements, labels, and technical metadata: IBM Plex Mono.

Required font assets should be stored or packaged for reliable local use rather than depending on runtime calls to third-party font services. Body text must retain a readable fallback with compatible metrics if a preferred font cannot load.

### Layout strategy

Desktop pages use an asymmetric twelve-column editorial grid. The opening text is left-weighted, featured photography may cross or break the content grid, and article lists resemble a publication contents page instead of uniform cards. Project numbers, dates, coordinates at city granularity, focal lengths, and experiment identifiers form a quiet machine-vision visual layer.

Mobile pages use a deliberate single-column feed rather than a scaled desktop canvas. Photography, long titles, and metadata retain contrasting rhythm. The primary navigation remains easy to reach without obscuring reading content.

### Motion and icons

Motion is restrained: one orchestrated initial reveal, image transitions, and clear hover/focus feedback. It must respect reduced-motion preferences. When functional icons are required, the implementation uses one consistent professional icon family; emoji are content, not interface icons.

## 7. Homepage design

The homepage tells the personal story from present activity to deeper work.

### Opening

The display name and identity sit left of an offset representative photograph. The preferred introductory copy is:

> I started with cameras.  
> Then I became curious about how machines see.

Two understated actions lead to selected work and the latest Moment. This is not a centered hero with skill badges.

### Now

A compact strip shows the current month and the fields Learning, Building, Reading, and city-level Location.

### Latest Moments

Three recent entries demonstrate different forms: a photograph-led Moment, a study or experiment record, and a lighter personal observation. Image proportions can vary to retain a photographic rhythm.

### Latest Writing

Recent Articles and Notes appear as a numbered editorial index with title, summary, date, reading time, and type. The section does not use a grid of identical article cards.

### Selected Work

The initial selections are Mini DeepID, CV Lab, and Robotics Experiments. Each preview emphasizes the question, result, and learning rather than foregrounding a technology list.

### Photography closing

A near-full-width photograph closes the page with:

> Human vision records a moment.  
> Machine vision tries to understand it.

The footer contains GitHub, email if supplied, RSS, and copyright information.

## 8. Responsive and accessibility requirements

- No horizontal overflow at supported phone, tablet, and desktop widths.
- Body text, article measure, line height, and Chinese punctuation remain comfortable for long reading.
- All interactive controls are keyboard accessible and have visible focus states.
- Text and controls meet WCAG AA contrast targets.
- Informative images have meaningful alternative text; decorative images have empty alternative text.
- Image galleries remain usable without hover and do not depend on color alone.
- Reduced-motion preferences disable nonessential transitions.
- Navigation, headings, landmarks, and document hierarchy are semantic.

## 9. Performance, privacy, and failure behavior

- Responsive image output, compression, lazy loading, and reserved dimensions limit transfer size and layout shift.
- Missing optional images render a deliberate text-led layout rather than a broken placeholder.
- Invalid content fails schema validation during development or build with a message identifying the entry and field.
- Broken related-content references fail validation instead of silently linking to an invalid route.
- Draft content is excluded from pages, RSS, and sitemap output.
- No API keys, tokens, `.env` files, exact private locations, internal school information, private conversations, unpublished research results, or restricted laboratory data are published.

## 10. First-release scope

The first release includes:

- the complete local content architecture;
- homepage and five primary destinations;
- detail pages for Moments, Writing, Projects, and Photo Stories;
- local Keystatic editing;
- representative sample content that is clearly marked for replacement;
- responsive layouts and restrained motion;
- RSS, sitemap, metadata, image optimization, and draft filtering;
- Impeccable initialization and UI checks;
- automated checks appropriate to content schemas, routes, and critical rendering behavior;
- browser acceptance on phone and desktop viewports.

The sample content must not invent private facts. Unknown personal details use neutral, visibly replaceable sample values kept out of final production content.

## 11. Implementation sequence

1. Initialize Astro, React, TypeScript, Keystatic, and content collections.
2. Define content schemas, fixtures, draft rules, and image paths.
3. Establish design tokens, fonts, spacing, image ratios, and shared layout primitives.
4. Build global navigation and the homepage.
5. Build Moments, Writing, Work, Photos, and About routes and detail layouts.
6. Connect every content type to Keystatic and prove file-based round trips.
7. Add responsive behavior, accessibility, image optimization, metadata, RSS, and sitemap.
8. Initialize and apply Impeccable, then run deterministic UI review.
9. Run automated verification and browser acceptance at representative phone and desktop widths.

Implementation begins only after this written specification is reviewed and approved, followed by a separate implementation plan.

## 12. Acceptance criteria

The first release is accepted when:

- the site and `/keystatic` load locally from the documented start command;
- creating and saving a Moment in Keystatic changes the shared local content source and appears on the homepage and Moments page without manual duplication;
- creating an Article, Note, Project, or Photo Story produces the correct listing and detail route;
- direct editing of a content file is reflected through the same rendering path;
- drafts never appear in public pages, RSS, or sitemap output;
- invalid required fields and invalid relationships are caught by validation;
- phone, tablet, and desktop layouts have no horizontal overflow or unusable controls;
- keyboard navigation, focus visibility, semantic structure, contrast, image alternatives, and reduced motion meet the stated accessibility requirements;
- the interface follows the approved editorial aesthetic and avoids generic SaaS and AI-generated visual patterns;
- all primary pages remain functional without a database, cloud CMS, account, secret, or external runtime service;
- stopping the local development command leaves no claimed background service running.

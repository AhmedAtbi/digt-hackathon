# Test Cases — DIGT-33 · Enlarge and recolor landing page title to blue

- **Ticket:** [DIGT-33](https://linear.app/digt/issue/DIGT-33/enlarge-and-recolor-landing-page-title-to-blue)
- **Spec:** [docs/specs/DIGT-33.md](../specs/DIGT-33.md)
- **Stage:** 07b — Test-case design (spec-time)
- **Date:** 2026-07-01
- **Note:** These *update* the DIGT-32 suites (`frontend/tests/page.test.tsx`,
  `frontend/e2e/homepage-title.spec.ts`), not add a parallel set (AC9).

## Test cases

| TC | Covers | Description | Layer | Owner |
|----|--------|-------------|-------|-------|
| TC1 | AC1, AC2 | Render `/`; assert the `<h1>` text is "Recipes" and its computed `font-size` is `60px` (`text-6xl`). | unit (component) | FE |
| TC2 | AC3 | Light mode: assert the `<h1>` computed `color` resolves to `rgb(0, 0, 255)` / `#0000ff`. | unit (component) | FE |
| TC3 | AC4 | With `prefers-color-scheme: dark`, assert the `<h1>` colour is `rgb(96, 165, 250)` / `#60a5fa` (the `dark:` override applies), **not** `#0000ff`. | E2E (Playwright) | FE |
| TC4 | AC5 | Only the `<h1>` changed: recipe-card `<h2>` titles, subtitle, and sort `<select>` retain their original classes/appearance. | unit (component) | FE |
| TC5 | AC6 | Accessibility: `#0000ff` on light (`bg-zinc-50`) ≥ 3:1 (≈8.6) and `#60a5fa` on dark (`bg-zinc-950`) ≥ 3:1 (≈6.0) — WCAG AA large-text. | manual / a11y check | QA |
| TC6 | AC7 | No horizontal overflow at 375px and 1280px with the 60px heading; header still aligns the title and sort control. | E2E (Playwright) | FE |
| TC7 | AC8 (negative) | No new network request is triggered and no new dependency is added (page still falls back to static data when API is down). | E2E (Playwright) | FE |
| TC8 | AC9 (regression) | The updated DIGT-32 suites pass green: no lingering assertion on `text-5xl` / `#ff0000` remains. | unit + E2E | FE |

## Coverage matrix

| Acceptance criterion | Covered by |
|----------------------|-----------|
| AC1 — h1 renders blue + enlarged | TC1, TC2 |
| AC2 — font-size 60px | TC1 |
| AC3 — color #0000ff (light) | TC2 |
| AC4 — #60a5fa in dark via override | TC3 |
| AC5 — only the h1 changes | TC4 |
| AC6 — WCAG AA contrast both bg | TC5 |
| AC7 — no overflow, alignment intact | TC6 |
| AC8 — no new deps / no backend calls (negative) | TC7 |
| AC9 — DIGT-32 tests updated, not left failing | TC8 |

**Coverage: 9/9 ACs** — every AC has at least one test case. No uncovered AC or
edge case. Layers: 3 unit, 4 E2E, 1 manual/a11y (TC8 spans unit + E2E).

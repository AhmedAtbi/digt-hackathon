# Test Cases — DIGT-32 · Restyle landing page title

- **Ticket:** [DIGT-32](https://linear.app/digt/issue/DIGT-32/restyle-landing-page-title-50px-red)
- **Spec:** [docs/specs/DIGT-32.md](../specs/DIGT-32.md)
- **Stage:** 07b — Test-case design (spec-time)
- **Date:** 2026-07-01

## Test cases

| TC | Covers | Description | Layer | Owner |
|----|--------|-------------|-------|-------|
| TC1 | AC1, AC2 | Render `/`; assert the `<h1>` text is "Recipes" and its computed `font-size` is `48px`. | unit (component) | FE |
| TC2 | AC3 | Assert the `<h1>` computed `color` resolves to `rgb(255, 0, 0)` / `#ff0000`. | unit (component) | FE |
| TC3 | AC4 | With `prefers-color-scheme: dark`, assert the `<h1>` is still red (no `zinc-50` override applied). | E2E (Playwright) | FE |
| TC4 | AC5 | Only the `<h1>` changed: recipe-card `<h2>` titles, subtitle, and sort `<select>` retain their original classes/appearance. | unit (component) | FE |
| TC5 | AC6 | Accessibility: `#ff0000` on light (`bg-zinc-50`) and dark (`bg-zinc-950`) backgrounds meets WCAG AA large-text ≥ 3:1 (verified ≈4.0 / ≈5.2). | manual / a11y check | QA |
| TC6 | AC7 | No horizontal overflow at 375px and 1280px; header still aligns the title and sort control. | E2E (Playwright) | FE |
| TC7 | AC8 (negative) | No new network request is triggered by the change and no new dependency is added (page still falls back to static data when API is down). | E2E (Playwright) | FE |

## Coverage matrix

| Acceptance criterion | Covered by |
|----------------------|-----------|
| AC1 — h1 renders red + enlarged | TC1, TC2 |
| AC2 — font-size 48px | TC1 |
| AC3 — color #ff0000 | TC2 |
| AC4 — red in both light + dark | TC2 (light), TC3 (dark) |
| AC5 — only the h1 changes | TC4 |
| AC6 — WCAG AA contrast both bg | TC5 |
| AC7 — no overflow, alignment intact | TC6 |
| AC8 — no new deps / no backend calls (negative) | TC7 |

**Coverage: 8/8 ACs** — every AC has at least one test case. No uncovered AC or
edge case. Layers: 3 unit, 3 E2E, 1 manual/a11y.

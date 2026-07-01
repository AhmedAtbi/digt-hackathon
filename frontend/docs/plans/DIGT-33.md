# Implementation Plan — DIGT-33 · Enlarge and recolor landing page title to blue

- **Ticket:** [DIGT-33](https://linear.app/digt/issue/DIGT-33/enlarge-and-recolor-landing-page-title-to-blue)
- **Spec:** [docs/specs/DIGT-33.md](../specs/DIGT-33.md)
- **Stage:** 06 — Implementation Plan
- **Date:** 2026-07-01

## Build order

1. **Edit the heading class** — `frontend/src/app/page.tsx` (~line 71): change
   the `<h1>` className from
   `text-5xl font-semibold tracking-tight text-[#ff0000]` to
   `text-6xl font-semibold tracking-tight text-[#0000ff] dark:text-[#60a5fa]`.
2. **Update the inherited DIGT-32 tests** (AC9):
   - `frontend/tests/page.test.tsx` — swap the `text-5xl` / `#ff0000` (`text-[#ff0000]`)
     assertions to `text-6xl` / `#0000ff` (`text-[#0000ff]`), and add the
     `dark:text-[#60a5fa]` class assertion.
   - `frontend/e2e/homepage-title.spec.ts` — computed `font-size` `48px` → `60px`;
     light-mode `color` → `rgb(0, 0, 255)`; dark-mode `color` → `rgb(96, 165, 250)`
     (`#60a5fa`), instead of asserting the same colour in both schemes.
3. **Verify** — `npm run lint`, `npm test`, `npx playwright test`, and a quick
   `npm run dev` eyeball at `/` in both colour schemes.

## Files touched

| File | Change |
|------|--------|
| `frontend/src/app/page.tsx` | one `className` edit on the `<h1>` |
| `frontend/tests/page.test.tsx` | update class assertions (size/colour + dark override) |
| `frontend/e2e/homepage-title.spec.ts` | update computed size/colour; per-scheme colour |

## Rollback

Revert the `className` edit and the test updates (back to DIGT-32's 48px red).
No data, migration, or config to undo.

## Risks

- **Low.** Only presentation. Watch-items, both test-covered:
  - Dark-mode colour must be the lighter `#60a5fa`, not `#0000ff` (AC4/AC6).
  - `text-6xl` (60px) header alignment / overflow with the sort control (AC7).
- **Test debt is in-scope, not a surprise** — updating DIGT-32's assertions is
  an explicit build step (2), so the suites don't ship red.

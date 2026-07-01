# Implementation Plan — DIGT-32 · Restyle landing page title

- **Ticket:** [DIGT-32](https://linear.app/digt/issue/DIGT-32/restyle-landing-page-title-50px-red)
- **Spec:** [docs/specs/DIGT-32.md](../specs/DIGT-32.md)
- **Stage:** 06 — Implementation Plan
- **Date:** 2026-07-01

## Build order

1. **Edit the heading class** — `frontend/src/app/page.tsx` (~line 71): change
   the `<h1>` className from
   `text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50` to
   `text-5xl font-semibold tracking-tight text-[#ff0000]`.
2. **Add the test** — a component test (Vitest + Testing Library) asserting the
   `<h1>` renders "Recipes" with computed `font-size: 48px` and `color`
   resolving to `#ff0000` / `rgb(255, 0, 0)`. Optionally a Playwright check for
   no horizontal overflow at 375px and correct dark-mode colour.
3. **Verify** — `npm run lint`, `npm test`, and a quick `npm run dev` eyeball at
   `/` in both colour schemes.

## Files touched

| File | Change |
|------|--------|
| `frontend/src/app/page.tsx` | one `className` edit on the `<h1>` |
| `frontend/tests/…` (new) | one component test (+ optional E2E) |

## Rollback

Revert the `className` edit (single line). No data, migration, or config to undo.

## Risks

- **Negligible.** Only presentation. Main watch-item: dark-mode colour and
  header alignment with the sort control — both covered by tests (AC4, AC7).

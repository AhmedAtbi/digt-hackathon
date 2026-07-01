# Tech Spec — DIGT-33 · Enlarge and recolor landing page title (60px, blue)

- **Ticket:** [DIGT-33](https://linear.app/digt/issue/DIGT-33/enlarge-and-recolor-landing-page-title-to-blue)
- **Story:** [docs/stories/DIGT-33.md](../stories/DIGT-33.md)
- **Enrichment:** [docs/discovery/DIGT-33-enrichment.md](../discovery/DIGT-33-enrichment.md)
- **Stage:** 05 — Tech Spec (light template — single-module change)
- **Status:** Draft — awaiting `ok`
- **Date:** 2026-07-01
- **Supersedes:** DIGT-32 (48px red) — visual outcome + its test assertions

## Summary

Restyle the landing page hero heading (`<h1>` "Recipes") to be larger and blue:
`font-size` 60px, colour `#0000ff` in light mode and `#60a5fa` in dark mode.
Pure presentation change, one file. Reverses the DIGT-32 red styling.

## Design

Single edit in `frontend/src/app/page.tsx` (line ~71), the only `<h1>` on `/`.

**Before** (DIGT-32)
```tsx
<h1 className="text-5xl font-semibold tracking-tight text-[#ff0000]">
  Recipes
</h1>
```

**After**
```tsx
<h1 className="text-6xl font-semibold tracking-tight text-[#0000ff] dark:text-[#60a5fa]">
  Recipes
</h1>
```

Rationale for each token change:
- `text-5xl` → `text-6xl`: Tailwind v4 `text-6xl` = 60px exactly (a first-class
  scale step — no arbitrary size needed).
- `text-[#ff0000]` → `text-[#0000ff]`: true blue via arbitrary value (light mode).
- `dark:text-[#60a5fa]`: **re-introduces a `dark:` override** (DIGT-32 removed
  it). Pure `#0000ff` fails AA contrast on the dark background, so dark mode uses
  the lighter `blue-400` (#60a5fa) — see Accessibility. [PO decision, OQ1]
- `font-semibold tracking-tight` kept — only size and colour change.

No `globals.css @theme` token added — one-off arbitrary values are simpler than
introducing `--color-*` tokens for a single use.

## Alternatives considered

- **Pure `#0000ff` in both modes** — rejected by PO: fails AA in dark mode
  (≈ 2.3:1). Chosen fix: lighter blue in dark only.
- **One AA-safe blue for both modes (e.g. `#3b82f6`)** — rejected by PO: they
  wanted exact `#0000ff` in light; the split keeps that.
- **`blue-600` / a new `@theme` token** — rejected/deferred: PO asked for exact
  blue; no second consumer yet (YAGNI).

## Impact / blast radius

- One file, one element. No API, no data, no dependencies, no build config.
- Recipe-card `<h2>` titles, subtitle, and sort control are untouched.
- Header layout uses `sm:items-end`; `text-6xl` (60px) is ~12px taller than the
  current `text-5xl` (48px) — a real but small bump. Overflow/alignment covered
  by AC7 test at 375px and 1280px.
- **Test debt (AC9):** DIGT-32's suites (`frontend/tests/page.test.tsx`,
  `frontend/e2e/homepage-title.spec.ts`) assert `text-5xl` / `#ff0000` and will
  fail. They must be updated to the new size/colour + the dark-mode override.

## Accessibility

Large-text (≥ 24px bold ⇒ large) contrast, threshold ≥ 3:1:
- Light: `#0000ff` on `bg-zinc-50` ≈ **8.6:1** — passes.
- Dark: `#0000ff` on `bg-zinc-950` ≈ **2.3:1** — *fails* → replaced by
  `#60a5fa` on `bg-zinc-950` ≈ **6:1** — passes.

## Test surface

Small. FE-only. Component test asserting computed `font-size`/`color` on the
`<h1>` (light), plus a Playwright check for the dark-mode colour, no overflow,
and no new network calls. No backend or integration tests. Includes **updating
the inherited DIGT-32 tests** rather than adding net-new only.

## Rollback

Revert the single `className` change (back to DIGT-32's 48px red) and the test
updates. No data or migration concerns.

## Open questions

None — all resolved (see story OQ1–OQ6, including the a11y decision). Not blocking.

## Confidence

```json
{
  "completeness": 5,
  "ambiguity": 5,
  "risk": 4,
  "test_coverage": 4,
  "dependencies": 4,
  "notes": "Trivial single-file presentation change; all questions incl. the a11y conflict resolved. risk/dependencies 4 (not 5) because it supersedes DIGT-32 and must update that ticket's existing tests, not just add new ones. test_coverage 4 until the test-cases step lands."
}
```

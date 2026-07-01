# Tech Spec — DIGT-32 · Restyle landing page title (48px, exact red)

- **Ticket:** [DIGT-32](https://linear.app/digt/issue/DIGT-32/restyle-landing-page-title-50px-red)
- **Story:** [docs/stories/DIGT-32.md](../stories/DIGT-32.md)
- **Enrichment:** [docs/discovery/DIGT-32-enrichment.md](../discovery/DIGT-32-enrichment.md)
- **Stage:** 05 — Tech Spec (light template — single-module change)
- **Status:** Draft — awaiting `ok`
- **Date:** 2026-07-01

## Summary

Restyle the landing page hero heading (`<h1>` "Recipes") to be larger and red:
`font-size` 48px and colour `#ff0000`, in both light and dark mode. Pure
presentation change, one file.

## Design

Single edit in `frontend/src/app/page.tsx` (line ~71), the only `<h1>` on `/`.

**Before**
```tsx
<h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
  Recipes
</h1>
```

**After**
```tsx
<h1 className="text-5xl font-semibold tracking-tight text-[#ff0000]">
  Recipes
</h1>
```

Rationale for each token change:
- `text-4xl` → `text-5xl`: Tailwind v4 `text-5xl` = 48px (PO accepted nearest
  step over an exact-50px arbitrary value).
- `text-zinc-900 dark:text-zinc-50` → `text-[#ff0000]`: true red via arbitrary
  value; dropping the `dark:` override makes it red in both themes (PO).
- `font-semibold tracking-tight` kept — only size and colour change.

No `globals.css @theme` token added — a one-off arbitrary value is simpler than
introducing a `--color-*` token for a single use. (If a reusable brand red is
wanted later, promote to a token; out of scope here.)

## Alternatives considered

- **`text-[50px]` (exact 50px)** — rejected: PO accepted 48px, and `text-5xl` is
  a first-class scale step (cleaner than an arbitrary size).
- **`red-600` / `rose-*`** — rejected: PO asked for exact/true red, not a muted
  brand red.
- **New `@theme` red token** — deferred: no second consumer yet (YAGNI).

## Impact / blast radius

- One file, one element. No API, no data, no dependencies, no build config.
- Recipe-card `<h2>` titles, subtitle, and sort control are untouched.
- Header layout uses `sm:items-end`; `text-5xl` is only ~2px taller than the
  current `text-4xl`, so alignment risk is negligible (covered by AC7 test).

## Accessibility

`#ff0000` large-text (≥ 24px bold ⇒ large) contrast:
- on `bg-zinc-50` (light) ≈ 4.0:1 — passes WCAG AA (needs ≥ 3:1).
- on `bg-zinc-950` (dark) ≈ 5.2:1 — passes.

## Test surface

Small. FE-only. One component test asserting computed `font-size`/`color` on the
`<h1>`, plus a visual/E2E check for no overflow and dark-mode colour. No backend
or integration tests. (Drives the estimate — this is a unit-only change.)

## Rollback

Revert the single `className` change. No data or migration concerns.

## Open questions

None — all resolved at enrichment (see story). Not blocking.

## Confidence

```json
{
  "completeness": 5,
  "ambiguity": 5,
  "risk": 5,
  "test_coverage": 4,
  "dependencies": 5,
  "notes": "Trivial single-file presentation change; all enrichment questions resolved. test_coverage 4 only because tests are still to be written in the test-cases step."
}
```

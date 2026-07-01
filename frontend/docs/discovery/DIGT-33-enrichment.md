# Idea enrichment — DIGT-33 · Enlarge and recolor landing page title to blue

- **Stage:** 03 — Idea Enrichment (pre-user-story)
- **Ticket:** [DIGT-33](https://linear.app/digt/issue/DIGT-33/enlarge-and-recolor-landing-page-title-to-blue)
- **Source:** `/idea` intake (no discovery brief — straightforward styling request)
- **Date:** 2026-07-01
- **Status:** Enriched — open questions RESOLVED by PO (2026-07-01); ready for `/story`

## 1. Structured context

**Problem.** The landing page title currently reads at 48px in exact red
(`#ff0000`) — the outcome of the just-shipped [DIGT-32](https://linear.app/digt/issue/DIGT-32/restyle-landing-page-title-50px-red).
The request is to make it **larger** and change the colour to a **standard /
brand blue**.

**Restated (Architect's words).** Increase the size of the landing page's
primary heading beyond its current 48px and recolour it from red to a standard
blue, so it stays the visual focal point but in a blue treatment rather than
red.

**Explicit requirements the requester stated (via `/idea`):**
- E1. The landing page title font size becomes **larger than the current 48px**.
- E2. The landing page title colour becomes a **standard / brand blue** (i.e.
  no longer red).

**Grounded target.** The "landing page title" is `<h1>Recipes</h1>` at
`frontend/src/app/page.tsx:71`. Current classes:
`text-5xl font-semibold tracking-tight text-[#ff0000]`
(`text-5xl` = 3rem = 48px; `text-[#ff0000]` = exact red, applied in both light
and dark mode after DIGT-32 removed the `dark:` override). This is the only
`<h1>` on `/`; recipe cards use `<h2>` (`text-lg`), so they are out of scope.

## 2. Affected systems

| System | Touched? | Notes |
|--------|----------|-------|
| Frontend (`digt-hackathon/frontend`) | ✅ Yes | `src/app/page.tsx` `<h1>` only. Possibly `src/app/globals.css` if a blue brand token is preferred over a Tailwind utility. |
| Backend (Symfony) | ❌ No | Pure presentation change; no `/api/*` change. |
| CMS / Ergonode / iPaaS / Klaviyo | ❌ No | Standalone hackathon app, no PoS/ERP surface. |
| Data / migrations | ❌ No | No persistence. |

**Stack note.** Next.js 16 (App Router, `page.tsx` is a client component),
React 19, **Tailwind CSS v4** (CSS-first `@theme` in `globals.css`). Two
grounded consequences:
- **`globals.css @theme` defines no colour tokens** beyond `--color-background`
  / `--color-foreground` (confirmed at `globals.css:8-12`). There is **no
  "brand blue" token** in this codebase — "standard/brand blue" must be pinned
  to a concrete value (a Tailwind `blue-*` utility, an arbitrary `text-[#…]`,
  or a new `@theme` token) — see OQ1.
- **Sizing** is currently a Tailwind step (`text-5xl` = 48px). "Larger" has no
  default next-step obligation: `text-6xl` = 60px, `text-7xl` = 72px, or an
  arbitrary `text-[Npx]`. The exact target is unspecified — see OQ2.

## 3. Implicit requirements (testable)

- I1. **Scope isolation** — only the `<h1>` "Recipes" changes; recipe-card
  `<h2>` titles, the subtitle, and the sort control are visually unchanged.
- I2. **Exact size** — the rendered computed `font-size` of the `<h1>` is the
  agreed value and is **strictly greater than 48px** (assert via computed style
  in an E2E/component test) — pending OQ2.
- I3. **Colour** — the rendered `<h1>` `color` is the agreed blue token, and is
  **no longer `#ff0000`** (assert computed `color`) — pending OQ1.
- I4. **Dark mode** — DIGT-32 currently renders red in both modes with no `dark:`
  override. The blue behaviour in dark mode must be defined and tested (blue in
  both, or a distinct dark-mode blue) — pending OQ3.
- I5. **Responsive** — the larger heading causes no horizontal overflow at
  375px (mobile) or 1280px (desktop); the header flex layout (`sm:items-end`
  alignment with the sort control) still reads correctly. Larger-than-48px
  raises this risk more than DIGT-32 did.
- I6. **Accessibility** — the chosen blue on `bg-zinc-50` (light) and
  `bg-zinc-950` (dark) backgrounds meets WCAG AA contrast for large text
  (≥ 3:1). E.g. `blue-600` (#2563eb) on near-white passes; the dark-mode pair
  must be verified once the shade is fixed.
- I7. **No new dependencies / no backend calls** introduced.
- I8. **Rollback** = revert the single `className` change (back to DIGT-32's
  48px red); no data or migration concerns.
- I9. **Supersedes DIGT-32 visually** — this deliberately reverses DIGT-32's red
  outcome. The DIGT-32 tests assert `text-5xl` / `#ff0000`; those tests
  (`frontend/tests/page.test.tsx`, `frontend/e2e/homepage-title.spec.ts`) will
  fail after this change and must be **updated, not left broken** — see OQ4.

_i18n, audit logging, performance, data migration, and observability: **N/A** —
a pure CSS-class presentation change with no data or API surface._

## 4. Related epics / stories

- **DIGT-32 — Restyle landing page title to 48px red** (direct predecessor,
  **conflict/supersede**). This ticket reverses DIGT-32's colour and changes its
  size. Same file (`page.tsx:71`) and same test suites. Coordinate: this work
  replaces DIGT-32's styling and must refresh DIGT-32's assertions.
- **DIGT-29 — Add a welcome hero title to the recipes homepage** (adjacent,
  potential dependency). If DIGT-29 adds a hero *above* "Recipes", "the landing
  page title" becomes ambiguous (hero vs. "Recipes"). Both edit `page.tsx` →
  confirm which heading this targets and order the merges — see OQ5.
- **DIGT-23 — recipes sortable/filterable by cooking time** (same homepage, no
  direct dependency, also edits `page.tsx`).

## 5. Open questions — RESOLVED by PO (2026-07-01)

1. **Exact blue** → **true/exact blue `#0000ff`** (mirrors DIGT-32's exact-red
   approach; not `blue-600` or a new token). Implemented as `text-[#0000ff]`.
2. **Exact size** → **60px**, which is exactly Tailwind's `text-6xl` (3.75rem =
   60px) — a default step, so no arbitrary value required.
3. **Dark mode** → **blue in both light and dark** modes (no `dark:` override —
   same both-modes pattern DIGT-32 established).
4. **DIGT-32 tests** → **update** the DIGT-32 Vitest + Playwright assertions
   (`text-5xl` / `#ff0000` → `text-6xl` / `#0000ff`) as part of this ticket.
5. **Which title, given DIGT-29?** → restyle the current `<h1>Recipes</h1>`.
   DIGT-29 coordination noted but out of scope here.

No blocking questions remain — ready to feed `/story`.

**Resolved styling target:** `<h1>` classes become
`text-6xl font-semibold tracking-tight text-[#0000ff]` (60px, exact blue, both
modes).

## Human gate

✅ PO confirmed the enrichment and answered Q1–Q5 on 2026-07-01.

## Confidence

```json
{
  "completeness": 5,
  "ambiguity": 5,
  "risk": 4,
  "test_coverage": 4,
  "dependencies": 3,
  "notes": "Target element, affected systems, and blast radius are grounded in code. Ambiguity now high (=5): both core requirements pinned to exact values — true blue #0000ff and 60px (text-6xl). Resolved target: text-6xl font-semibold tracking-tight text-[#0000ff], both modes. Risk stays 4 for the deliberate supersede of DIGT-32 and its assertions, which must be updated (I9/OQ4). Ready for /story."
}
```

## See also

- `frontend/docs/discovery/DIGT-32-enrichment.md` — predecessor this supersedes.
- Next step: `/story` (once open questions are answered) → source-of-truth user
  story + spec + test cases.

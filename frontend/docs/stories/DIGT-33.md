# DIGT-33 — Enlarge and recolor landing page title to blue (60px, blue)

- **Linear:** https://linear.app/digt/issue/DIGT-33/enlarge-and-recolor-landing-page-title-to-blue
- **Enrichment:** [DIGT-33-enrichment.md](../discovery/DIGT-33-enrichment.md)
- **Scope:** Frontend only (`digt-hackathon/frontend`)
- **Status:** groomed — a11y conflict resolved by PO (see OQ1); ready for build
- **Supersedes visually:** DIGT-32 (48px red)

## User story

> As a visitor arriving on the recipes site, I want the main title to be large
> and boldly coloured in blue so that it immediately draws my eye and anchors
> the page in the intended blue treatment.

## Acceptance criteria

1. The landing page title (the `<h1>` "Recipes" at `src/app/page.tsx`) renders
   blue at a 60px font size.
<!-- agent-framework:enrich:start -->
2. The rendered `<h1>` computed `font-size` is `60px` (`text-6xl`). [PO: 60px]
3. The rendered `<h1>` computed `color` is **exact/true blue `#0000ff`** in
   **light** mode. [PO: exact blue]
4. The title is blue in **both** modes: `#0000ff` in light and a lighter blue
   **`#60a5fa`** (`blue-400`) in **dark** mode via a `dark:` override, so it
   stays readable. [PO: lighter blue in dark mode — resolves OQ1]
5. Only the `<h1>` "Recipes" changes — recipe-card `<h2>` titles, the subtitle,
   and the sort control are visually unchanged.
6. **WCAG AA large-text contrast (≥ 3:1) passes in both modes:** `#0000ff` on
   `bg-zinc-50` (light) ≈ **8.6:1 ✓**; `#60a5fa` on `bg-zinc-950` (dark) ≈
   **6:1 ✓**.
7. No horizontal overflow at 375px (mobile) or 1280px (desktop); header
   alignment with the sort control still reads correctly. (60px raises this risk
   above DIGT-32's 48px.)
8. No new dependencies and no backend calls are introduced.
9. The DIGT-32 test assertions (`text-5xl` / `#ff0000`) are updated to the new
   values, not left failing.
<!-- agent-framework:enrich:end -->

## Technical context
<!-- agent-framework:enrich:start -->
- Target: `frontend/src/app/page.tsx:71` — the only `<h1>` on `/`. Current
  classes (from DIGT-32): `text-5xl font-semibold tracking-tight text-[#ff0000]`.
- Stack: Next.js 16 (App Router, client component), React 19, Tailwind CSS v4
  (CSS-first `@theme` in `src/app/globals.css`; no colour tokens defined).
- Resolved implementation: `text-6xl font-semibold tracking-tight
  text-[#0000ff] dark:text-[#60a5fa]` — 60px, exact blue in light, lighter blue
  in dark. Re-introduces a `dark:` override (DIGT-32 had removed it). One-line
  `className` edit; no `globals.css` token needed.
- Test debt: `frontend/tests/page.test.tsx` and `frontend/e2e/homepage-title.spec.ts`
  assert the DIGT-32 values and must be updated (AC9).
<!-- agent-framework:enrich:end -->

## Out of scope

- Restyling recipe-card titles, subtitle, or any other heading.
- Adding an i18n layer or changing the title copy ("Recipes").

## Open questions
<!-- agent-framework:enrich:start -->
1. ~~a11y vs. exact blue in dark mode?~~ → **RESOLVED (PO, 2026-07-01):**
   `#0000ff` fails WCAG AA on the dark background (≈ 2.3:1). PO chose option (b):
   keep `#0000ff` in light, use **`#60a5fa` (`blue-400`, ≈ 6:1)** in dark mode.
_Resolved by PO on 2026-07-01 (enrichment):_
2. ~~Exact blue?~~ → **exact/true blue `#0000ff`**.
3. ~~Exact size?~~ → **60px (`text-6xl`)**.
4. ~~Dark mode?~~ → **blue in both light and dark** mode.
5. ~~DIGT-32 tests?~~ → **update** them as part of this ticket.
6. ~~Which title, given DIGT-29?~~ → the current `<h1>Recipes</h1>`.
<!-- agent-framework:enrich:end -->

## Related resources
<!-- agent-framework:enrich:start -->
- **DIGT-32** — Restyle landing page title (48px red). Direct predecessor this
  supersedes; same file + same tests.
- **DIGT-29** — Add a welcome hero title (both edit `page.tsx`).
- **DIGT-23** — Sort/filter recipes by cooking time (same homepage).
<!-- agent-framework:enrich:end -->

## Worked example

Given a visitor opens `http://localhost:3000`
When the page loads
Then the top-most "Recipes" heading renders in blue at 60px, standing out from
the subtitle and recipe grid, with no layout overflow.

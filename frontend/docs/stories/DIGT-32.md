# DIGT-32 — Restyle landing page title (50px, red)

- **Linear:** https://linear.app/digt/issue/DIGT-32/restyle-landing-page-title-50px-red
- **Enrichment:** [DIGT-32-enrichment.md](../discovery/DIGT-32-enrichment.md)
- **Scope:** Frontend only (`digt-hackathon/frontend`)
- **Status:** enriched

## User story

> As a visitor arriving on the recipes site, I want the main title to be large
> and boldly coloured so that it immediately draws my eye and anchors the page.

## Acceptance criteria

1. The landing page title (the `<h1>` "Recipes" at `src/app/page.tsx`) renders
   red at a 50px font size.
<!-- agent-framework:enrich:start -->
2. The rendered `<h1>` computed `font-size` is `48px` (`text-5xl`). [PO: 48px OK]
3. The rendered `<h1>` computed `color` is **exact/true red `#ff0000`** — not a
   muted `red-600`/`rose-*`. [PO: exact red]
4. The title is red in **both light and dark** mode (the current
   `dark:text-zinc-50` override is removed). [PO: both modes]
5. Only the `<h1>` "Recipes" changes — recipe-card `<h2>` titles, the subtitle,
   and the sort control are visually unchanged.
6. The title meets WCAG AA large-text contrast (≥ 3:1) on both backgrounds —
   verified: `#ff0000` on `bg-zinc-50` ≈ 4.0:1, on `bg-zinc-950` ≈ 5.2:1.
7. No horizontal overflow at 375px (mobile) or 1280px (desktop); header
   alignment with the sort control still reads correctly.
8. No new dependencies and no backend calls are introduced.
<!-- agent-framework:enrich:end -->

## Technical context
<!-- agent-framework:enrich:start -->
- Target: `frontend/src/app/page.tsx:71` — the only `<h1>` on `/`. Current
  classes: `text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50`.
- Stack: Next.js 16 (App Router, client component), React 19, Tailwind CSS v4
  (CSS-first `@theme` in `src/app/globals.css`).
- Resolved implementation: swap `text-4xl` → `text-5xl` (48px), and
  `text-zinc-900 dark:text-zinc-50` → `text-[#ff0000]` (true red, applies in
  both themes since no dark override remains). Keep `font-semibold tracking-tight`.
- One-line `className` edit in `page.tsx`; no `globals.css` token needed.
<!-- agent-framework:enrich:end -->

## Out of scope

- Restyling recipe-card titles, subtitle, or any other heading.
- Adding an i18n layer or changing the title copy ("Recipes").

## Open questions
<!-- agent-framework:enrich:start -->
_All resolved by PO on 2026-07-01 — none blocking:_
1. ~~Exact red?~~ → **exact/true red `#ff0000`** (not `red-600`/`rose-*`).
2. ~~Dark mode?~~ → **red in both light and dark** mode.
3. ~~Exactly 50px?~~ → **48px (`text-5xl`) is acceptable.**
4. ~~Which title, given DIGT-29?~~ → **dismissed by PO** — restyle the current
   `<h1>Recipes</h1>`; DIGT-29 coordination not a concern for this ticket.
<!-- agent-framework:enrich:end -->

## Related resources
<!-- agent-framework:enrich:start -->
- **DIGT-29** — Add a welcome hero title (dependency; both edit `page.tsx` and
  compete for "the title"). Coordinate merge order.
- **DIGT-23** — Sort/filter recipes by cooking time (same homepage).
<!-- agent-framework:enrich:end -->

## Worked example

Given a visitor opens `http://localhost:3000`
When the page loads
Then the top-most "Recipes" heading renders in red at 50px, standing out from
the subtitle and recipe grid, with no layout overflow.

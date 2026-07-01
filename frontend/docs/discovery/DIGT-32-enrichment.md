# Idea enrichment — DIGT-32 · Restyle landing page title (50px, red)

- **Stage:** 03 — Idea Enrichment (pre-user-story)
- **Ticket:** [DIGT-32](https://linear.app/digt/issue/DIGT-32/restyle-landing-page-title-50px-red)
- **Source:** `/idea` intake (no discovery brief — straightforward styling request)
- **Date:** 2026-07-01
- **Status:** Draft — awaiting PO confirmation

## 1. Structured context

**Problem.** The main heading on the recipes landing page doesn't stand out
enough. The request is to make it visually bolder: font size **50px** and
**red** text.

**Restated (Architect's words).** Increase the visual weight of the landing
page's primary heading by enlarging it to 50px and colouring it red, so it
reads as the clear focal point when a visitor arrives.

**Explicit requirements the human stated:**
- E1. The landing page title font size becomes **50px**.
- E2. The landing page title colour becomes **red**.

**Grounded target.** The "landing page title" is the `<h1>Recipes</h1>` at
`frontend/src/app/page.tsx:71`. Current classes:
`text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50`
(`text-4xl` = 2.25rem ≈ 36px). This is the only `<h1>` on `/`; recipe cards use
`<h2>` (`text-lg`), so they are out of scope.

## 2. Affected systems

| System | Touched? | Notes |
|--------|----------|-------|
| Frontend (`digt-hackathon/frontend`) | ✅ Yes | `src/app/page.tsx` `<h1>` only. Possibly `src/app/globals.css` if a `red` brand token is preferred over a utility. |
| Backend (Symfony) | ❌ No | Pure presentation change; no `/api/*` change. |
| CMS / Ergonode / iPaaS / Klaviyo | ❌ No | Standalone hackathon app, no PoS/ERP surface. |
| Data / migrations | ❌ No | No persistence. |

**Stack note.** Next.js 16 (App Router, `page.tsx` is a client component),
React 19, **Tailwind CSS v4** (CSS-first `@theme` in `globals.css`). Two
grounded consequences:
- **50px is not a default Tailwind step** (`text-5xl` = 48px, `text-6xl` = 60px).
  Hitting exactly 50px needs an arbitrary value `text-[50px]`, or a new
  `@theme` token. If "≈50px / nearest step" is acceptable, `text-5xl` (48px) is
  simpler — see OQ3.
- **No `red` brand token exists** in `globals.css @theme`. The app's existing
  palette is zinc (text) plus rose/emerald/amber for difficulty badges. A red
  title could reuse Tailwind's `red-*` or align to the existing `rose-*` used on
  the "Hard" badge — see OQ1.

## 3. Implicit requirements (testable)

- I1. **Scope isolation** — only the `<h1>` "Recipes" changes; recipe-card
  `<h2>` titles, the subtitle, and the sort control are visually unchanged.
- I2. **Exact size** — the rendered computed `font-size` of the `<h1>` is
  `50px` (assert via computed style in an E2E/component test).
- I3. **Colour** — the rendered `<h1>` colour is the agreed red token (assert
  computed `color`).
- I4. **Dark mode** — the `<h1>` currently overrides to `dark:text-zinc-50`.
  The behaviour in dark mode must be defined and tested (red in both, or red in
  light only) — pending OQ2.
- I5. **Responsive** — the 50px heading causes no horizontal overflow at 375px
  (mobile) or 1280px (desktop); the header flex layout (`sm:items-end`
  alignment with the sort control) still reads correctly.
- I6. **Accessibility** — the chosen red on the `bg-zinc-50` (light) and
  `bg-zinc-950` (dark) backgrounds meets WCAG AA contrast for large text
  (≥ 3:1). `red-600` (#dc2626) on near-white passes; verify the dark-mode pair.
- I7. **No new dependencies / no backend calls** introduced.
- I8. **Rollback** = revert the single `className` change; no data or migration
  concerns.

_i18n, audit logging, performance, data migration, and observability: **N/A** —
a pure CSS-class presentation change with no data or API surface._

## 4. Related epics / stories

- **DIGT-29 — Add a welcome hero title to the recipes homepage** (adjacent,
  **dependency**). DIGT-29 inserts a *new* hero title **above** the "Recipes"
  heading. If DIGT-29 lands, "the landing page title" becomes ambiguous (hero
  vs. "Recipes"), and both tickets edit `page.tsx` → land them in a deliberate
  order to avoid a merge conflict and to confirm which heading this restyle
  targets. See OQ4.
- **DIGT-23 — recipes sortable/filterable by cooking time** (same homepage, no
  direct dependency, also edits `page.tsx`).

## 5. Open questions — RESOLVED by PO (2026-07-01)

1. **Exact red** → **true/exact red `#ff0000`** (not `red-600` or `rose-*`).
2. **Dark mode** → **red in both light and dark** modes (remove the
   `dark:text-zinc-50` override).
3. **Exactly 50px?** → **48px (`text-5xl`) is acceptable.**
4. **Which title, given DIGT-29?** → **dismissed by PO**; restyle the current
   `<h1>Recipes</h1>`. DIGT-29 coordination noted but out of scope here.

No blocking questions remain — ready to feed `/story` → `/shape`.

## Human gate

✅ PO confirmed the enrichment and answered Q1–Q4 on 2026-07-01.

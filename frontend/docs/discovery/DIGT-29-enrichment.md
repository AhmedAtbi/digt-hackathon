# Idea enrichment — DIGT-29 · Welcome hero title

- **Stage:** 03 — Idea Enrichment (pre-user-story)
- **Ticket:** [DIGT-29](https://linear.app/digt/issue/DIGT-29/add-a-welcome-hero-title-to-the-recipes-homepage)
- **Source:** [Discovery brief](welcome-hero-title.md) · chosen candidate **C1** (static frontend hero)
- **Date:** 2026-07-01
- **Status:** Draft — awaiting PO confirmation

## 1. Structured context

**Problem.** The recipes homepage opens straight into a small "Recipes" heading
with no welcoming frame. For the demo the landing should read as intentional
and immediately say what the site is.

**Who it affects.** Any visitor landing on `/` of the recipes site
(`hackathon-recepies/frontend`). It is the first thing seen, so it shapes the
first impression during the demo.

**Why now.** This is the headline visual for an upcoming demo; a friendly hero
is low-cost, high-visibility polish that makes the landing feel finished.

## 2. Affected systems

| System | Touched? | Notes |
|--------|----------|-------|
| Frontend (`hackathon-recepies/frontend`) | ✅ Yes | `src/app/page.tsx` only — add a hero block above the existing grid. |
| Backend (Symfony) | ❌ No | C1 is static text; no `/api/*` change. (C2 would have touched `/api/hello`.) |
| CMS / Ergonode / iPaaS / Klaviyo | ❌ No | Not a PoS-domain or ERP change; standalone hackathon app. |
| Data / migrations | ❌ No | No persistence. |

**PoS note:** this is a customer-facing surface. Copy is currently English-only
and hard-coded — see open questions on i18n and final wording.

## 3. Related epics / stories

- **Parked siblings from the same idea:** C2 (backend-served greeting) and C3
  (time-aware greeting). If we later want the hero to *prove* the full-stack
  round-trip, C2 is the natural follow-up and would supersede this static text.
- **Adjacent feature:** DIGT-23 (recipes sortable/filterable by cooking time) —
  same homepage, no direct dependency, but both edit `page.tsx`, so land them in
  a sensible order to avoid a trivial merge conflict.

## 4. Open questions (unknowns — not assumed)

1. **Final copy** — is "🍳 Hello, hungry world!" the actual title, or is there
   preferred product wording?
2. **Subtitle text** — what should the supporting line say?
3. **i18n** — English-only acceptable for the demo, or must the hero be
   translatable now? (The DIGT house rule is that UI strings go through i18n;
   this app has no i18n layer yet, so honouring that would expand scope.)
4. **Emoji** — is a leading emoji on-brand, or plain text preferred?

## Human gate

PO to confirm this enrichment is accurate (and answer Q1–Q4 where they can)
before it feeds the user story in `docs/stories/DIGT-29.md`.

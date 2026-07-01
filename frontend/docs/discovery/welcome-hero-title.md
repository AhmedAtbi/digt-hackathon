# Discovery brief — Welcome hero title

- **Ticket:** [DIGT-29](https://linear.app/digt/issue/DIGT-29/add-a-welcome-hero-title-to-the-recipes-homepage)
- **Date:** 2026-07-01
- **Stage:** 00 — Discovery + Ideation
- **Status:** Chosen (C1)

## Problem / opportunity

The recipes homepage opens straight into a small "Recipes" heading. For the
demo we want a friendlier, hello-world-style welcome hero at the top so the
landing feels intentional and immediately communicates what the site is.

## Candidates considered

| # | Candidate | Effort | Notes |
|---|-----------|--------|-------|
| C1 | **Static frontend hero** (chosen) | XS | Hard-coded welcome title + subtitle above the grid. One file, no backend. |
| C2 | Backend-served greeting | S | Hero text from Symfony `/api/hello`. Best full-stack demo value. Parked. |
| C3 | Time-aware greeting | S | Client-computed "Good morning, chef". Cosmetic only. Parked. |

## Decision

**C1** picked for speed and zero risk — a static hero is enough for the demo
and touches only the frontend homepage. C2/C3 parked, not rejected; C2 can be
revisited if we want the greeting to prove the full-stack round-trip.

## Affected systems

- `hackathon-recepies/frontend` — `src/app/page.tsx` only.
- No backend, API contract, or data changes.

## Open questions

- Final copy for the hero title + subtitle (placeholder: "🍳 Hello, hungry world!").

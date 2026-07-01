# DIGT-29 — Add a welcome hero title to the recipes homepage

- **Linear:** https://linear.app/digt/issue/DIGT-29/add-a-welcome-hero-title-to-the-recipes-homepage
- **Discovery brief:** [welcome-hero-title.md](../discovery/welcome-hero-title.md)
- **Scope:** Frontend only (`hackathon-recepies/frontend`)
- **Chosen candidate:** C1 — static hero

## User story

> As a visitor landing on the recipes site, I want a clear, welcoming title at
> the top of the page so that I immediately understand what the site is and
> feel invited to browse.

## Acceptance criteria

1. A hero title (e.g. "🍳 Hello, hungry world!") renders above the recipe grid on `/`.
2. A short supporting subtitle sits directly under the hero title.
3. The existing "Recipes" section heading and the sort control remain and still work.
4. The hero is responsive — no horizontal overflow at 375px (mobile) or 1280px (desktop).
5. Hero text is legible in both light and dark colour schemes.
6. No backend calls are added for the hero (static text only).

## Out of scope

- Backend-served greeting (C2) and time-aware greeting (C3) — parked.

## Worked example

Given a visitor opens `http://localhost:3000`
When the page loads
Then they see "🍳 Hello, hungry world!" as the top-most heading, a one-line
subtitle beneath it, and the recipe grid with its sort control below.

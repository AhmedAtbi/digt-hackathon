---
name: fe-implementation
description: Implement the frontend slice of a ticket against an approved tech spec — components, routes, hooks, styles, API client wrappers, and the component/E2E tests alongside. Follows the project's Node/TypeScript stack preset and never ships an inaccessible or untyped change.
stage: Build
owner: FE
ai_role: propose
---

# Frontend Implementation

## When to use

After the tech spec (`docs/specs/<TICKET>.md`) and implementation plan
(`docs/plans/<TICKET>.md`) are approved AND the branch has been cut via
`agent-branch`. Skip this skill if the ticket has no frontend slice
(use `be-implementation` directly).

## Inputs

- The ticket and its artifacts:
  - `docs/stories/<TICKET>.md` (story + AC)
  - `docs/specs/<TICKET>.md` (tech spec)
  - `docs/plans/<TICKET>.md` (build order)
  - Design references / Figma links from the story (if any).
- The active frontend stack preset under
  `workflow/09-development/stack-presets/node-typescript.md` plus any
  framework-specific recipe from `bootstrap/` (`web-nextjs`,
  `web-vite-react`, `web-astro`, `monorepo-turbo`).
- The current branch (resolved by `branch-structure`).

## Steps

1. **Re-read the spec + plan.** Confirm the build order and the
   approved component shape (props, slots, events, accessibility
   contract).
2. **For each task in the plan, in order:**
   a. Search the codebase for existing components, hooks, utilities, or
      design-system primitives you can reuse. Reusing one component
      with a new prop is almost always better than a parallel
      implementation.
   b. Write the production code per the spec. Match the stack preset's
      conventions (file layout, naming, hook structure, ESM vs CJS,
      strictness).
   c. Add the test alongside:
      - **Unit/component:** Vitest + Testing Library or equivalent —
        one file per behavior, not per component.
      - **E2E:** only for genuinely critical user flows. The project's
        E2E stack lives in `cypress-bdd-functional-tests` (when
        Cypress) or under `e2e/` (when Playwright). Generate from the
        approved Gherkin `.feature` files when present, not from
        scratch.
   d. Keep the dev server / typecheck running locally. Don't commit a
      change that fails `typecheck` or `lint`.
   e. Commit when green using the project's commit format:
      `<type>: <TICKET> <imperative subject>`.
3. **Hold the design contract.** If a design reference forces a layout
   change the spec didn't anticipate, **stop** and surface it. Either
   update the spec or split the work.
4. **Accessibility is non-optional.** Keyboard navigation, focus order,
   ARIA labels, color contrast — every new interactive control gets
   them, not as a follow-up.
5. **Surface open questions, never invent UX.** If a behavior isn't
   defined in the spec / AC / design (empty states, error states, mid-
   stream loading, optimistic updates), write a one-line open question
   to the ticket via the Dev Agent's "open questions" gate.
6. **Run the FE checks** before declaring the slice done:
   ```
   pnpm typecheck
   pnpm lint
   pnpm test                        # vitest unit/component
   pnpm test:e2e                    # only if E2E added or touched
   pnpm build                       # catches type-only errors that test misses
   ```
7. **Hand off** to the next step in the Dev Agent's sequence (manual
   test in the browser, then push & MR). This skill **never pushes**
   and **never opens an MR**.

## Output — artifact as proof

- Source code + tests committed to the active branch with conventional
  messages.
- Storybook story (or equivalent isolated render) for any new
  user-facing component, when the project uses Storybook.
- A short status block printed to the calling agent:

  ```
  task 1/3  src/components/CampaignDeleteButton.tsx     done   (1 commit)
  task 2/3  src/components/CampaignDeleteButton.test    done   (1 commit)
  task 3/3  src/pages/campaigns/[id].tsx (wire-up)      done   (1 commit)
  typecheck                                              clean
  lint                                                   clean
  vitest                                                 12 tests passed
  build                                                  ok
  ```

## Human gate

Same shape as `be-implementation`:

- **Before:** the spec + design + plan were approved.
- **After:** the human Dev manually tests in the browser (Dev Agent
  step 5) — including the accessibility quick check (keyboard nav,
  screen reader announce, contrast).

This skill adds no new gate.

## Guardrails

- **No `any` introductions** when the surrounding file uses strict
  types. If a type is genuinely unknown, use `unknown` + narrow at the
  boundary.
- **No re-implementing design-system primitives.** Reuse the project's
  Button, Input, Modal, etc., even if it means one extra import.
- **No new dependencies without confirming they aren't already in the
  workspace.** Monorepos especially have a way of shipping three modal
  libraries.
- **No client-side secret reads.** Anything with `_SECRET` or `_KEY` in
  the name belongs server-side (Next.js: `app/api/`, BFF, or env
  variables consumed only at build time).
- **No accessibility regressions.** If you removed a label or focus
  trap to "simplify", you didn't simplify.
- **No `--no-verify` on commits.**

## Stack-specific addenda

| Framework | Critical do-not |
|---|---|
| Next.js App Router | Mark client components explicitly. Don't put server-only code in a `"use client"` file. |
| Vite + React (SPA) | Don't ship a route without lazy-loading when the bundle grows past the project's budget. |
| Astro | Hydration islands cost runtime — default to `client:idle` or `client:visible`, not `client:load`. |
| Turborepo | Touching `packages/*` requires updating downstream `apps/*` consumers in the same MR. |

Full preset rules: `workflow/09-development/stack-presets/node-typescript.md`.

## See also

- `be-implementation` — backend counterpart; same shape, different
  stack rules.
- `cypress-bdd-functional-tests` / `agent-test` — for the E2E layer
  the FE may touch.
- `workflow/09-development/prompt.md` — the broader stage 09 context.

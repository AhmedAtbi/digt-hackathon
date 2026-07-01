---
name: be-implementation
description: Implement the backend slice of a ticket against an approved tech spec. Follows the project's stack preset (PHP/Symfony, Node/NestJS, Python/FastAPI, …), writes code task-by-task with conventional commits, and adds the unit tests alongside. Never invents business rules — surfaces open questions instead.
stage: Build
owner: BE
ai_role: propose
---

# Backend Implementation

## When to use

After the tech spec (`docs/specs/<TICKET>.md`) and implementation plan
(`docs/plans/<TICKET>.md`) are approved AND the branch has been cut via
`agent-branch`. Skip this skill if the ticket has no backend slice
(use `fe-implementation` directly).

## Inputs

- The ticket and its artifacts:
  - `docs/stories/<TICKET>.md` (story + AC)
  - `docs/specs/<TICKET>.md` (tech spec)
  - `docs/plans/<TICKET>.md` (build order)
- The active stack preset under
  `workflow/09-development/stack-presets/<stack>.md`. Pick by
  `.agent.local.yaml` → `stacks:` matching the file you're editing.
- The current branch (resolved by `branch-structure`).

## Steps

1. **Re-read the spec + plan.** Confirm the build order is still
   valid for the current branch state (other MRs may have landed
   since).
2. **For each task in the plan, in order:**
   a. Search the codebase for existing services, repositories,
      factories, value objects you can reuse. Reuse trumps purity.
   b. Write the production code per the spec. Match the stack preset's
      conventions (naming, layering, dependency injection style).
   c. Add the unit test alongside (`tests/<Path>/<Class>Test.{php,ts,py}`).
      Same package as the production code.
   d. Run the suite for the touched module, not the whole suite — keep
      the loop tight. Commit when green using the project's commit
      format: `<type>: <TICKET> <imperative subject>`.
3. **Hold the surface area.** If a task forces you to touch files the
   plan didn't name, **stop** and surface the divergence. Either the
   plan was wrong (update it) or the task was wrong (split it).
4. **Surface open questions, never invent rules.** If a behavior isn't
   defined in the spec / AC and you can't infer it from the existing
   code with confidence, write a one-line open question to the ticket
   via the Dev Agent's "open questions" gate. Don't ship a guess.
5. **Run the full suite + static analysis** before declaring the BE
   slice done:
   - PHP: `vendor/bin/phpunit && vendor/bin/phpstan analyse`
   - Node: `pnpm test && pnpm lint && pnpm typecheck`
   - Python: `uv run pytest && uv run ruff check && uv run mypy src`
6. **Hand off** to the next step in the Dev Agent's sequence (manual
   test, then push & MR). This skill **never pushes** and **never opens
   an MR** — that's the agent's job, not this skill's.

## Output — artifact as proof

- Source code + unit tests committed to the active branch with
  conventional messages.
- A short status block printed to the calling agent:

  ```
  task 1/4  src/Domain/Campaign/Campaign.php          done   (1 commit)
  task 2/4  migrations/2026_06_30_…_add_retention.php  done   (1 commit)
  task 3/4  src/Application/Api/.../CampaignProcessor… done   (2 commits)
  task 4/4  tests/Campaign/CampaignRepositoryTest.php  done   (1 commit)
  suite     phpunit                                    green  (84 tests)
  static    phpstan level 9                            clean
  ```

## Human gate

This skill is **AI-only execution** between two gates that the calling
agent owns:

- **Before:** the spec + plan were approved by the human (Lead).
- **After:** the human Dev manually tests the change (Dev Agent step 5)
  before the MR is opened.

This skill itself adds no new gate.

## Guardrails

- **No business rule invention.** If the AC is silent on a behavior,
  ask. Don't pick a default.
- **No new abstractions without spec authority.** If the spec names
  three classes, write three classes. New factories / interfaces /
  middleware require updating the spec first.
- **No translation YAML edits** when the project routes translations
  through a TranslationMigration class (per the `php-symfony` preset).
  Inline literals; the migration captures keys.
- **No password / credential modifications** ever.
- **No `--no-verify` on commits.** If a hook fails, fix the issue and
  re-commit.
- **No skipping tests** to "see if the rest works." If a test fails,
  fix it before moving to the next task.

## Stack-specific addenda

| Stack preset | Critical do-not |
|---|---|
| `php-symfony` | Don't edit `vendor/` or `var/`. Don't bypass Symfony Workflow when the project uses it for state. |
| `node-typescript` | Don't add a dependency without checking it isn't already in the workspace. Prefer existing utilities. |
| `python` | Don't write `from __future__ import annotations` unless the file already uses it — match the file. |

Full preset rules: `workflow/09-development/stack-presets/<stack>.md`.

## See also

- `fe-implementation` — frontend counterpart; same shape, different
  stack rules.
- `agent-mr-comments` — used by the Dev Agent to re-enter this skill
  for review-feedback fixes.
- `workflow/09-development/prompt.md` — the broader stage 09 context.

---
name: agent-enrich
description: Enrich an accepted idea into a precise, testable requirement set — add technical context, identify the systems it touches (ERP, CMS, Sylius, Ergonode, Klaviyo, iPaaS, FE), surface the implicit requirements and edge cases the requester assumed, suggest related epics, and list the open questions a human must answer before a story is written. Step 3 of the delivery lifecycle.
command: enrich
---

# agent-enrich

Step 3 — **Idea Enrichment**. Takes an idea the PO has already accepted
(post `/idea` Go/No-Go) and turns it into an enriched, testable requirement
set the Architect can write a story against. It is the first move of the
refinement stretch the **Architect** owns (steps 3 → 5).

Use it after an idea is accepted. For a raw, unframed idea, run `/idea`
first. When the requirements are already enriched, go straight to `/story`.

## Inputs

- **The accepted-idea ticket** the Analyst created at idea validation — its
  title, problem, expected value, and affected area. This is the handoff
  artifact and your starting context; it already carries enough to begin. If
  no ticket ID is known, ask — do not invent one.
- The discovery brief from `/idea` (`docs/discovery/<slug>.md`), if one
  exists, as supporting reference — not a prompt to re-run discovery.
- The project's stack presets (`.agent/workflow/09-development/stack-presets/`)
  to ground "which systems does this touch".

## Steps

Drive stage 01 — read `.agent/workflow/01-requirement-enrichment/prompt.md`
end-to-end and follow it. As the **Architect**, apply rigorous scrutiny to
surface what's implicit, with a clear eye for blast radius. In short:

1. **Restate** the accepted idea in your own words. List the explicit
   requirements the human stated.
2. **Identify affected systems.** Name the modules, services, and external
   systems the change reaches — ERP, CMS, Sylius, Ergonode, Klaviyo, iPaaS,
   the frontend. Search the codebase; don't guess the boundary.
3. **Surface implicit requirements** against the stage-01 checklist
   (auth/permissions, audit, edge cases, i18n, performance, backward
   compatibility, data migration, observability, rollback). Every one must
   be phrased so it's testable — "should be fast" is a fail.
4. **Suggest related epics / prior art** the requirement connects to, so it
   isn't built in isolation.
5. **List the open questions** as a numbered list. Do **not** answer them
   yourself — they are the human gate.

## Output

Three writes — a companion requirements doc, an **updated user
story**, and the ticket description in the provider (which mirrors
the updated story).

### 6a. Companion requirements doc (tool gate)

Write `docs/requirements/<slug>.md` using
`.agent/workflow/01-requirement-enrichment/templates/requirements.md`.
This is the long-form artifact — deeper analysis, exhaustive edge
cases, calibration notes. Not what goes on the ticket verbatim.

### 6b. Update the user story itself (tool gate)

Read `docs/stories/<TICKET-ID>.md` (written by `/idea`) and merge the
enrichment findings into its **existing sections**, not into an
"Enrichment" appendix:

| Enrichment output | Story-template section it lands in |
|---|---|
| Explicit requirements (step 1) | 🖼️ Acceptance Criteria — sharpen the AC, replace vague terms |
| Affected systems (step 2) | 🚧 Technical Context — name the modules / services / repos |
| Implicit requirements (step 3) | 🖼️ Acceptance Criteria — add ACs for the discovered edge cases; 💡 Scope — add constraints; 🔑 Preconditions — add setup needs |
| Related epics / prior art (step 4) | 🔗 Related Resources |
| Open questions (step 5) | ❓ Open Questions |

Wrap the enrichment-generated content inside each section between
markers so a re-run replaces only the enrichment additions, not the
human-written or `/idea`-written baseline:

```markdown
## 🖼️ Acceptance Criteria
- <original AC from /idea>
- <original AC from /idea>
<!-- agent-framework:enrich:start -->
- <sharpened AC — was "should be fast", now "p95 < 500ms">
- <new AC for edge case: empty campaign list>
- <new AC for edge case: permission denied>
<!-- agent-framework:enrich:end -->

## 🚧 Technical Context
<!-- agent-framework:enrich:start -->
- Affected modules: `src/Domain/Campaign/`, `src/Application/Api/Resource/Campaign/`
- Migration required in `migrations/`.
- Stack preset: php-symfony.
<!-- agent-framework:enrich:end -->
```

Anything outside the markers stays untouched on re-runs.

Bump the story's `Status:` field from `validated` (set by `/idea`)
to `enriched`.

### 6c. Push the updated user story to the ticket (hard gate)

Now that the local story is authoritative, sync it to the provider
ticket **as the ticket description** — not as an appended block.

- Read the fully-updated `docs/stories/<TICKET-ID>.md`.
- Convert to the provider's description format (Linear takes
  Markdown; Jira ADF; ClickUp Markdown).
- Wrap the story content between one outer marker pair so re-runs
  don't create nested blocks:

  ```markdown
  <!-- agent-framework:story:start -->
  # <Story title>

  📝 User Story
  As a ..., I want ..., so that ...

  💡 Scope
  ...
  🖼️ Acceptance Criteria
  ...
  🚧 Technical Context
  ...
  ❓ Open Questions
  ...
  🔗 Related Resources
  ...

  Story file: docs/stories/<TICKET-ID>.md · Requirements: docs/requirements/<slug>.md
  <!-- agent-framework:story:end -->
  ```

- **Hard gate**: show the user a diff (current ticket description →
  proposed description). Wait for `confirm`. Never post silently.
- On `confirm`: call the provider's edit tool:
  - `linear`: `linear_edit_issue` with the new `description`.
  - `clickup`: `clickup_update_task` (description field).
  - `jira`: `jira_update_issue` (description field).
  - `none`: skip; local story is the only artifact.

Content **outside** the `<!-- agent-framework:story:start -->` /
`:end -->` markers on the ticket (human-added description text,
reactions, notes) is preserved.

### 6d. Legacy compatibility

If the ticket description already contains the old
`<!-- agent-framework:enrich:start --> ... :end -->` block from a
previous `/enrich` run (pre-this-commit), **remove it** during 6c so
the ticket doesn't carry two blocks (the story + the old enrichment
appendix). The updated story now includes what that block used to
say.

## Human gate

- **Tool gate** — writing `docs/requirements/<slug>.md` (6a).
- **Tool gate** — updating `docs/stories/<TICKET>.md` with enrichment
  merged into the existing sections between per-section
  `<!-- agent-framework:enrich:* -->` markers (6b).
- **Hard gate** — pushing the updated story to the provider ticket
  description (6c). Show the diff — old description vs the full
  updated story between `<!-- agent-framework:story:* -->` markers
  — and wait for `confirm`. Never post silently.
- The open questions themselves are for humans to answer. AI must
  not pre-answer. Downstream skills (`/story`, `/shape`) should
  refuse to proceed if unresolved questions remain.

## Guardrails

- **No business-rule invention.** Anything not stated by a human is an open
  question, never an asserted requirement.
- **Affected-systems claims must be grounded** in code you actually found.
  If you couldn't confirm a boundary, say so and add it as an open question.
- Stop and ask if the discovery brief is missing and the request is too thin
  to enrich — guessing the problem is worse than asking.

## Required MCP tools

| Server | Tools | When |
|---|---|---|
| Active `task_provider` (Linear / ClickUp / Jira) | `get_issue` (or equivalent) | Step 1 (read the ticket as input) |
| Same | `edit_issue` / `update_task` | Step 6b (write enrichment to description — after user confirms diff) |

If the provider MCP is unavailable: step 1 falls back to the local
discovery brief (`docs/discovery/<slug>.md`) if present; step 6b is
skipped with a warning telling the user to re-run once auth is
restored. The local `docs/requirements/<slug>.md` write always happens.

## Confidence

Score per `.agent/workflow/confidence-gates.md`. **Ambiguity** is the
critical dimension here — an untestable requirement poisons every stage
downstream.

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": ""
}
```

## See also

- [`agent-story`](../agent-story/SKILL.md) — the next step: enriched
  requirements → source-of-truth user story + spec + test cases.
- [`../../workflow/01-requirement-enrichment/prompt.md`](../../workflow/01-requirement-enrichment/prompt.md)
  — the canonical stage prompt this skill drives.
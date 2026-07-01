---
name: agent-groom
description: Take a user story all the way to ready-for-build in one pass — architecture review (if needed), tech spec, implementation plan, task breakdown, estimate, and prioritization — pausing at every human gate. One command instead of /spec + /tasks + /estimate + /prioritize.
command: groom
---

# agent-groom

End-to-end **refinement orchestrator**: story → ready-for-build. It runs
the coupled planning stages (04 → 08) in order so you don't type each
command separately, but it **stops at every human gate** and **halts if a
stage fails its confidence gate**. It never bypasses a checkpoint to save a
step.

Use it after a story exists (`/idea` or `/story`). For raw ideas, run
`/idea` first.

## Input

- A ticket ID (e.g. `PMO-7825`). If omitted, ask for one — do not guess.
- Reads the story + acceptance criteria at `docs/stories/<TICKET>.md`. If
  that file is missing, stop and offer to run `/idea` or `/story` first.

## Steps

Run these in order. After each, emit the stage's confidence score. **If a
stage scores a fail (any dimension < 3 or total < 18), stop, show the
refinement plan, and wait** — do not cascade a weak artifact into the next
stage.

1. **Architecture review (stage 04)** — read
   `.agent/workflow/04-architecture-review/prompt.md`. Run it **only if the
   change is non-trivial** (new entity/table, new external dependency,
   touches more than one module, or a public contract changes). Otherwise
   state "no ADR needed — single-module change" and skip.
   - **Hard gate**: if an ADR is produced, present the options + your
     recommendation and **wait for the user to accept an option** before
     continuing. Write `docs/adr/<NNNN>-<slug>.md`.
2. **Tech spec (stage 05)** — read `.agent/workflow/05-tech-spec/prompt.md`.
   Write `docs/specs/<TICKET>.md` (light template by default; full template
   for cross-module changes). Show the score; **wait for `ok` or change
   requests** before continuing.
3. **Implementation plan (stage 06)** — read
   `.agent/workflow/06-implementation-plan/prompt.md`. Write
   `docs/plans/<TICKET>.md` (build order + rollback).
4. **Task breakdown (stage 07)** — read
   `.agent/workflow/07-task-breakdown/prompt.md`. Draft the tasks as a
   table (title, parent link). Do **not** guess estimates here — that's
   step 7, which sees all children at once. **Hard gate**: read
   `task_provider` from `.agent.local.yaml`; if it is `clickup` / `linear`
   / `jira`, **show the proposed tickets and wait for confirmation**
   before creating anything via the matching
   `integrations/<provider>/sync-prompt.md`. If `none`, write the local
   task files only and say so.
5. **Test cases — right after breakdown, before anything else** —
   invoke `agent-test-design` (`/test` spec-time mode) on the parent.
   The skill sees the just-created breakdown, walks every AC + every
   edge case, and produces `docs/tests/<PARENT-TICKET>.md` using the
   predefined template at
   [`.agent/docs/test-cases-template.md`](../../docs/test-cases-template.md):

   - One test case per AC (minimum).
   - One test case per edge case (empty / max / permission /
     concurrency / timezone / locale / retry / audit).
   - One test case per negative path (what must NOT happen).
   - Every test case tagged with pyramid layer (unit / integration /
     API / E2E / manual) and owner (BE / FE / QA / shared).
   - A coverage matrix at the bottom: every AC + every listed edge
     case appears in at least one TC.

   Why test cases here (right after breakdown, before prioritize +
   estimate):

   - **Cost driver for estimation**: the test surface (unit-only vs
     integration-heavy vs E2E) is one of `agent-estimate`'s explicit
     drivers. Estimating without test cases is estimating blind.
   - **Reveals scope gaps**: writing a TC per AC often surfaces a
     missing AC — better to catch it here than during build.
   - **Every child is already tracked**: the test cases can reference
     the child ticket IDs from step 4 in the Owner column, so QA sees
     which subtask each test belongs to.

   **Hard gate**: if `agent-test-design`'s coverage matrix has ANY
   AC or edge case not covered by at least one TC, stop. Either fix
   the test-case draft or bounce back to breakdown to add the missing
   subtask.

6. **Prioritize (stage 08)** — apply the `/prioritize` logic. **Hard
   gate**: present the business priority (MoSCoW) as a *proposal*; the
   PO decides. Write technical + risk scores directly (AI-only,
   overridable).
7. **Estimate — LAST step, runs on the parent so it auto-covers every
   child from step 4** — invoke `/estimate <PARENT-TICKET>`. That skill
   now (post `a764cc9`) detects sub-tickets in the provider and:
   - Estimates each child individually (T-shirt + Fibonacci + hour
     range + one-line rationale + calibration against similar closed
     tickets).
   - Rolls up the sum of child points → parent total.
   - Flags any child still `XL` / `13+` (breakdown didn't go deep
     enough → recommend `/refine` for that child; the parent's split
     needs another pass).
   - **Hard gate**: shows a single proposed-writes table (all children
     + the parent's roll-up target field) and waits for confirmation
     before calling the provider MCP once per row.

   Estimate is deliberately the **last** step so that:
   - Every child created by step 4 exists in the provider when
     `/estimate` runs — no "the subtasks aren't tracked yet" edge case.
   - Business + technical priority (step 5) are set first, so the
     estimate can factor in "high-priority items get a wider hour
     buffer for interruption cost" if the project's estimating
     heuristic does that.
   - The final artifact of grooming is a fully-estimated backlog,
     ready for the sprint or ready for `/branch` → `/dev`.

## Output

A single summary with one line per artifact produced and its confidence
score:

```
PMO-7825 groomed → ready-for-build
  ADR         docs/adr/0007-soft-delete-campaigns.md   (skipped — single module)
  Spec        docs/specs/PMO-7825.md                   4/3/4/4/5
  Plan        docs/plans/PMO-7825.md                   4/4/3/4/5
  Tasks       3 created in Linear (PMO-7826, 7827, 7828)
  Test cases  docs/tests/PMO-7825.md                   coverage 12/12
    - 4 unit, 5 integration, 2 API, 1 manual
    - all 3 AC + 8 edge cases + 1 negative path covered
    - owners: PMO-7826 (BE), 7827 (BE+QA), 7828 (BE+FE)
  Priority    Should · tech 2 · risk 2
  Estimate    (invoked /estimate on parent — sub-ticket mode)
    PMO-7826  schema + migration           S | 3pt | 2–4h
    PMO-7827  read endpoints + admin form  M | 5pt | 4–6h
    PMO-7828  write endpoint + upstream    M | 5pt | 5–8h
    PMO-7825  parent roll-up               L | 13pt | 11–18h
  ⚠ weakest: spec.ambiguity=3 — "retention window" undefined
```

End by stating whether the ticket is **ready for build** (`/branch`) or
what still needs a human decision.

## Guardrails

- **Never skip a hard gate.** Architecture acceptance, provider ticket
  creation, and business priority each wait for the human, even though this
  is one command.
- **Stop on confidence failure.** A failed stage halts the chain with a
  refinement plan; it does not silently continue.
- **No business-rule invention.** Anything not in the story/AC or stated by
  a human is recorded as an open question in the spec, not asserted.

If `.agent/` is missing, ask the user to run
`git submodule update --init --recursive`. If `.agent.local.yaml` is
missing or has an unknown `task_provider`, ask the user to fix it before
the task-breakdown step.

## Confidence

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": "An orchestrator's score is the minimum across the stages it ran — it is only as ready-for-build as its weakest stage."
}
```

---
name: agent-refine
description: Analyze a task for estimation. If it exceeds the configured split threshold (default >8 story points / >L T-shirt), propose subtasks, estimate each, and create them as child issues in the configured task provider (Linear / ClickUp / Jira) linked to the parent.
command: refine
---

# agent-refine

Backlog refinement in one move. Takes one ticket, decides whether it
ships as-is or needs splitting, and (when splitting) creates the
subtasks in your task provider with parent-child links and individual
estimates.

This is `/estimate` + a conditional `/tasks` step, focused on one
oversized ticket — not a full sprint planning session.

## Inputs

Same input formats as `/estimate`. The skill normalizes any of these
to a ticket ID:

| Input | Use |
|---|---|
| Ticket ID (`PMO-7825`, `ACME-123`) | as-is |
| Linear URL | extract `TEAM-NNN` |
| ClickUp URL | extract task_id after `/t/` |
| Jira URL | extract `PROJECT-NNN` |
| Story file path (`docs/stories/<TICKET>.md`) | read locally |
| Nothing | infer from current branch; ask if that fails |

Also reads `.agent.local.yaml` for:

- `task_provider:` (clickup / linear / jira / none)
- `refine.split_threshold_points` (default `8`)
- `refine.split_threshold_tshirt` (default `L`)
- `refine.max_subtasks` (default `5`)

## Steps

1. **Normalize the input** to a ticket ID and print it back to the
   user.
2. **Read the ticket end to end**: story, AC, any linked spec.
3. **Estimate it** using the `agent-estimate` flow (cost drivers,
   T-shirt, points, hours, similar-ticket calibration). Show the result.
4. **Decide**: does the estimate exceed the configured split
   threshold?
   - `≤ 8 points` *and* `≤ L`: **no split needed.** Optionally write
     the estimate to the provider (with user confirmation) and stop.
   - `> 8 points` *or* `> L` (i.e. `XL`, `13+`): **split required.**
     Continue to step 5.
5. **Identify natural split seams** in the ticket. Common seams:
   - Schema / migration vs. application code.
   - Read endpoints vs. write endpoints.
   - Backend vs. admin UI vs. frontend.
   - Happy path vs. error handling + retries.
   - Per-locale or per-channel slices.
   Pick the seam that produces the **fewest** independently shippable
   subtasks (3–5 is the sweet spot; never exceed `max_subtasks`).
6. **Draft subtasks**. For each:
   - Title: `<PARENT-ID>/<n> — <focused phrase>` (or
     `<PARENT-ID>.<n>` if the provider rejects `/`).
   - Goal: one sentence.
   - Scope: bullets.
   - Out of scope: bullets (point at sibling subtasks).
   - Sequencing: which siblings block this one.
   - Estimate: T-shirt + points + hours (re-run agent-estimate
     logic on the subtask alone). Each must be `≤ 8 points` after
     splitting; if one isn't, split it further before moving on.
7. **Show the user the proposed split** in a single table before
   touching the provider:

   ```
   PARENT     PMO-7825 — Add invoice PDF footer fallback
   parent estimate  XL | 13 points | 16-24h   →  needs split

   #  SUBTASK                                      EST       BLOCKS
   1  schema + migration                            S | 3pt | 2-4h    -
   2  read endpoints + admin form                   M | 5pt | 4-6h    1
   3  write endpoint + locale handling              M | 5pt | 4-8h    1
   4  manual QA + smoke runbook                     S | 2pt | 2-3h    2,3
   ```

8. **Wait for the user to confirm**: accept all, accept some
   (`1,2,4`), edit (the user revises a title or estimate inline), or
   decline.
9. **Create the subtasks in the provider** (only after confirm):
   - Linear: child issues parented to the parent, using the matching
     `integrations/linear/sync-prompt.md` flow.
   - ClickUp: subtasks under the parent task
     (`integrations/clickup/sync-prompt.md`).
   - Jira: Sub-tasks under the parent issue
     (`integrations/jira/sync-prompt.md`).
   - `none`: write `docs/tasks/<PARENT-ID>-<n>.md` files locally with
     `parent: <PARENT-ID>` frontmatter; no provider call.
10. **Update the parent ticket**:
    - Add a comment listing the subtasks + their estimates.
    - Set the parent's estimate to **0** if the provider treats parents
      as epics (Linear, Jira with Story-Sub-task hierarchy); or keep
      the parent's original estimate as a top-level number when the
      provider doesn't have a parent/child semantic (ClickUp default).
11. **Write a local refinement log** at
    `docs/plans/<PARENT-ID>-refine.md` with the table from step 7, the
    user's decision, and the subtask URLs. This is the audit trail
    when the parent ships months later.

## Output format

```
parent     PMO-7825 — Add invoice PDF footer fallback
estimate   XL | 13 points | 16-24h
verdict    SPLIT — exceeds 8-point threshold

subtasks created in linear:
  PMO-7825/1  schema + migration                    https://linear.app/.../PMO-7826
  PMO-7825/2  read endpoints + admin form           https://linear.app/.../PMO-7827
  PMO-7825/3  write endpoint + locale handling      https://linear.app/.../PMO-7828
  PMO-7825/4  manual QA + smoke runbook             https://linear.app/.../PMO-7829

parent updated: estimate set to 0 (now an epic-style parent)
refinement log: docs/plans/PMO-7825-refine.md
```

## Guardrails

- Never create subtasks without explicit user confirmation.
- Never delete or close the parent — refinement is additive.
- A subtask that itself exceeds the threshold means the split was wrong;
  go back to step 5 with a different seam, don't ship oversized
  children.
- If the ticket has zero AC, stop at step 3 and refuse — refinement
  without acceptance criteria is guessing.
- Respect `max_subtasks` (default 5). More than that usually means the
  parent story is actually two stories — point the user at
  `/idea` to re-frame, not at this skill.
- For tickets already split (parent has existing children),
  re-estimate the **children**, not the parent.

## Configuration

Project-local in `.agent.local.yaml`:

```yaml
refine:
  split_threshold_points: 8        # > this → split required
  split_threshold_tshirt: L        # > this (XL, 13+) → split required
  max_subtasks: 5                  # hard cap; bigger → re-frame the story
  parent_treats_as_epic: true      # true for Linear / Jira hierarchy
                                   # false for ClickUp default
```

Missing block = use the defaults above.

## See also

- [`agent-estimate`](../agent-estimate/SKILL.md) — single-ticket
  scoring, no side effects.
- [`agent-prioritize`](../agent-prioritize/SKILL.md) — score after
  refinement so the new subtasks get prioritized.
- [`../../workflow/07-task-breakdown/prompt.md`](../../workflow/07-task-breakdown/prompt.md)
  — full stage-07 breakdown when you're starting from a spec, not from
  an oversized ticket.

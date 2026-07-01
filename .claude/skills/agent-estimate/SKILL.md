---
name: agent-estimate
description: Estimate the effort for a ticket — story points, T-shirt size, and a time range — with a short rationale citing the cost drivers. If the ticket has sub-tickets, estimates each child and rolls up to the parent. Updates the matching ClickUp / Linear / Jira ticket(s) when a task_provider is configured.
command: estimate
---

# agent-estimate

Lightweight scoring of one ticket or a parent + its sub-tickets. Use
it when you have a story but haven't done the full implementation
plan (stage 06) yet, or when you just want a sanity-check second
opinion before commitment.

## Inputs

- One of:
  - A path to a story file (`docs/stories/<TICKET>.md`).
  - A path to a task file (`docs/tasks/<TICKET>-<n>.md`).
  - A ticket ID — the skill fetches it from the configured task
    provider.
- `.agent.local.yaml` for provider IDs and `git.platform`.
- Project history: recent commits + closed tickets of similar shape (to
  calibrate against actual durations).

## Steps

0. **Detect sub-tickets**. After resolving the input ticket, check
   whether it has children in the task provider:
   - **Linear**: `linear_get_issue` returns child issues under the
     `children` / sub-issue relation. Use `linear_search_issues` with
     the parent filter if the direct field is empty.
   - **ClickUp**: `subtasks` field on the parent task.
   - **Jira**: sub-tasks under the Story / Task issue type; issue
     links of type `is parent of`.

   Branch:
   - **No children** → single-ticket mode (steps 1–6 below, applied to
     the input ticket).
   - **Has children** → sub-ticket mode. Print the parent + its N
     children in a table, then run steps 1–5 **for each child**, and
     finish with the roll-up (step 7).

1. **Read the ticket end to end**: story, AC, any linked spec or plan.
   If the spec is missing, say so — the estimate has wider uncertainty.
2. **List the cost drivers** explicitly:
   - Files / modules / boundaries touched.
   - New schema / migration / backfill?
   - New external integration?
   - Test surface (unit only, integration, E2E, manual?).
   - Unknowns ("the new auth flow", "rate limits on the upstream API").
3. **Score on three scales** so the reader can pick the unit they
   prefer:
   - **T-shirt**: `XS` / `S` / `M` / `L` / `XL`.
   - **Story points**: Fibonacci (`1` / `2` / `3` / `5` / `8` / `13`).
     `13+` means "split before committing".
   - **Calendar range**: lower-upper hours of focused work for a senior
     engineer who knows the codebase. Two numbers, e.g. `4–8h`.
4. **Cross-check** the three numbers against each other. If they
   disagree (e.g. `M` but `13 points` and `1h`), re-read the cost
   drivers — usually one of the three is wrong.
5. **Calibrate against recent tickets**: name 1–2 similar closed
   tickets and what they actually took. If none exist in this project,
   say "no comparable prior work" so the user weights the estimate
   accordingly.
6. **Suggest split points** if `XL` / `13+`:
   - The largest natural seam (migration vs. UI vs. API).
   - Concrete: "Task 1: migration alone (S, 3pt). Task 2: …".

7. **Roll-up (sub-ticket mode only)**: after every child has been
   estimated, aggregate:
   - **Sum of children's story points** → the parent's rolled-up
     total.
   - **Sum of children's hour ranges** → parent low = sum of lows,
     parent high = sum of highs.
   - **T-shirt is not summed** — pick the T-shirt whose Fibonacci
     bucket matches the rolled-up total (0–2 → `XS`, 3 → `S`, 5 → `M`,
     8 → `L`, 13+ → `XL`).

   How the parent's estimate is written depends on how the provider /
   project treats parents:
   - **Epic-style parent** (Linear / Jira parent whose children carry
     the real work): parent's own estimate = **0**; the roll-up total
     is presentational only. Set `refine.parent_treats_as_epic: true`
     in `.agent.local.yaml` to enable.
   - **Aggregating parent** (ClickUp default; some Jira setups):
     parent's estimate = the roll-up sum. Set
     `parent_treats_as_epic: false`.

   Flag any child that's still `XL` / `13+` after estimation — the
   split hasn't gone deep enough. Point at `/refine` for that child.

## Output format

```
TICKET    PMO-XXXX — <title>
estimate  M | 5 points | 4–8h
drivers   - new column on Campaign + migration + backfill
          - 2 new API endpoints (read-only)
          - 1 admin form change
          - integration test surface only; no E2E needed
unknowns  - upstream sync semantics for the new column (asked alice)
similar   - PMO-7321 (M, took 6h) — same migration shape
          - PMO-7405 (S, took 3h) — fewer endpoints
verdict   estimate is ready to commit; ↑ uncertainty if upstream
          question above is unresolved
```

If the ticket is `XL` / `13+`, end with:

```
recommended split
  PMO-XXXX/1  schema migration + backfill         S | 3pt | 2–4h
  PMO-XXXX/2  read endpoints + admin form         M | 5pt | 4–6h
  PMO-XXXX/3  write endpoint + upstream sync       M | 5pt | 4–8h
```

## Output format — sub-ticket mode

When the parent has children, one block per child plus a roll-up:

```
PARENT     PMO-7825 — Add invoice PDF footer fallback
children   3 (PMO-7826, PMO-7827, PMO-7828)

CHILD 1/3  PMO-7826 — Schema + migration
estimate   S | 3 points | 2–4h
drivers    - new column on Campaign + doctrine migration
           - no backfill (empty table today)
similar    PMO-7321 (S, took 2h)
verdict    ready to commit

CHILD 2/3  PMO-7827 — Admin form update
estimate   S | 3 points | 3–5h
drivers    - one Symfony form field + translation entry
           - UI validation only; no async
similar    PMO-7405 (S, took 3h)
verdict    ready to commit

CHILD 3/3  PMO-7828 — API write + upstream sync
estimate   M | 5 points | 5–8h
drivers    - new POST endpoint
           - upstream sync via messenger; retries idempotent
unknowns   - upstream rate limits under load (asked alice)
verdict    ↑ uncertainty until alice replies

ROLL-UP    parent PMO-7825
sum        11 points (S+S+M) | 10–17h
tshirt     L (13-point bucket for the sum)
parent mode  epic-style — parent estimate written as 0
                (per .agent.local.yaml refine.parent_treats_as_epic)
             or aggregating — parent estimate = 11pt.
verdict    ok; no child exceeds 8pt threshold; ready to commit
```

## Provider sync (only when `task_provider` is set)

After the user confirms the estimates, update the ticket(s) via the
matching sync-prompt:

- ClickUp: write `story_points` custom field
  (`integrations/clickup/sync-prompt.md`).
- Linear: write the `estimate` native field
  (`integrations/linear/sync-prompt.md`).
- Jira: write the `story_points` custom field
  (`integrations/jira/sync-prompt.md`).

**Single-ticket mode**: write the estimate to the one ticket.

**Sub-ticket mode**: write ALL of these in one batch (single
confirmation, not one per child):

- Each child's estimate to that child's ticket.
- The parent's estimate: `0` (epic-style) OR the roll-up sum
  (aggregating), per `refine.parent_treats_as_epic`.

Show the user the full table of proposed writes before any MCP call:

```
proposed writes
  PMO-7826  estimate = 3    (was: <old>)
  PMO-7827  estimate = 3    (was: <old>)
  PMO-7828  estimate = 5    (was: <old>)
  PMO-7825  estimate = 0    (epic-style parent)
                or = 11     (aggregating parent)
confirm? y/n
```

Don't update any ticket silently — one confirm covers the whole
batch, but never bypass it.

## Guardrails

- Never overwrite a human-set estimate without showing the diff and
  confirming.
- If you can't read the ticket (missing AC, spec, scope), output a
  blocking message ("AC missing — estimate would be a guess") and stop.
- For `XL` or `13+`, prefer "this should be split" over reporting a big
  number. Point the user at [`/refine`](../agent-refine/SKILL.md) — it
  estimates and then creates the subtasks in the provider, instead of
  just suggesting them on screen.

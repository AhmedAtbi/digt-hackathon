---
name: agent-prioritize
description: Score one or more tasks for priority — business (MoSCoW), technical (0-3 unblocker score), risk (0-5 from confidence gates) — and propose a sprint ordering. Updates the matching ClickUp / Linear / Jira ticket when a task_provider is configured.
command: prioritize
---

# agent-prioritize

Lightweight scoring for one ticket or a small backlog. Use it when
deciding what to pull next, not when running a full sprint planning
session (that's stage 08).

## Inputs

- One of:
  - A single ticket (story file path or ticket ID).
  - A list of tickets to rank (e.g. "everything in `docs/stories/` not
    yet closed", or a ClickUp/Linear/Jira list).
- `.agent.local.yaml` for provider config and `git.platform`.
- The project's `workflow/08-prioritization/matrix.md` for the scoring
  rubric.

## Scoring rubric (from matrix.md)

| Dimension | Scale | Who decides |
|---|---|---|
| **Business priority** | MoSCoW — Must / Should / Could / Won't | Human PO (AI proposes) |
| **Technical priority** | 0–3 (0 = polish, 3 = unblocks others / irreversible risk) | AI |
| **Risk score** | 0–5 (sum of missing test coverage + missing dependencies + missing rollback) | AI |

## Steps for a single ticket

1. **Read the ticket** (story + AC + any spec or plan).
2. **Score Business priority** by proposing one of Must / Should /
   Could / Won't with a one-line reason. Flag this is a proposal — PO
   has final say.
3. **Score Technical priority** with a number 0–3. Justify in one
   sentence (e.g. "Tech 3: blocks PMO-7421, PMO-7430 — they depend on
   this schema change").
4. **Score Risk** by counting the confidence-gate misses (or by reading
   the confidence JSON if present): missing AC tests, unresolved
   dependencies, no rollback plan. 0–5.
5. **Output the verdict**.

## Steps for a backlog of tickets

1. Score each ticket using the single-ticket flow above.
2. **Order them** using the rule from
   `workflow/08-prioritization/matrix.md`:
   1. Technical priority desc (do unblockers first).
   2. Within same tech tier: Business priority (Must > Should > Could).
   3. Within same business tier: Risk desc (riskiest first, fail fast).
   4. Ties broken by smallest estimate (ship momentum).
3. **Print the ordering** with a one-line rationale per row.
4. **Flag conflicts**: e.g. "PMO-7430 (Tech 3, Must) blocked by
   unscored PMO-7321 — score PMO-7321 first."

## Output format (single ticket)

```
TICKET     PMO-XXXX — <title>
business   Must     (regulatory deadline 2026-04-30)
technical  2        (blocks PMO-7445 only)
risk       3        (no rollback plan; AC tests not yet mapped)
verdict    Should be in the next sprint; pair with PMO-7445 for
           dependency.
```

## Output format (backlog ordering)

```
ORDER  TICKET     BUSINESS  TECH  RISK  REASON
1      PMO-7321   Must      3     2     schema migration; unblocks 7445 + 7430
2      PMO-7445   Must      2     1     read endpoints once migration lands
3      PMO-7430   Must      2     0     admin UI; parallel-safe with 7445
4      PMO-7500   Should    1     1     polish: pagination on Campaign list
5      PMO-7510   Could     0     0     copy tweak; bottom of next sprint
```

## Provider sync (when `task_provider` is set)

After the user confirms the scores, update each ticket via the matching
sync-prompt. The framework expects these fields:

| Provider | business priority | technical priority | risk |
|---|---|---|---|
| ClickUp | `priority_business` custom field | `priority_technical` custom field | `risk_score` custom field |
| Linear | label (`p_business_must|should|could|wont`) | label (`p_technical_p0..p3`) | label (`risk_low/med/high`) |
| Jira | `priority` field (mapped) | `priority_technical` custom field or label | `risk_score` custom field or label |

Don't update the provider silently — show the user the proposed updates
and wait for an OK.

## Guardrails

- The AI **proposes** business priority; the human PO accepts or
  changes it. Never overwrite a human-set business priority without
  surfacing the change.
- Don't re-prioritize tickets that aren't in the user's request scope.
  If they asked about PMO-7321, don't touch PMO-7322.
- If you can't read a ticket (e.g. no MCP), report it as
  "uncategorized" rather than guessing.
- For tickets scoring `XL`/`13+` on estimate, refuse to prioritize
  until they're split — point at `/estimate` and recommend a split.

## See also

- [`../../workflow/08-prioritization/matrix.md`](../../workflow/08-prioritization/matrix.md) — full rubric, worked example, ordering rule.
- [`agent-estimate`](../agent-estimate/SKILL.md) — pair with this for tickets that don't have an estimate yet.

---
name: agent-shape
description: Given a validated ticket from /idea, propose 2-3 distinct solution shapes (each = user story + AC + tech spec sketch + architecture + test plan + estimate), wait for the user to pick one, then commit the picked one — prioritize (respecting --priority=<value> override), estimate, split into subtasks if >8 story points, and sync to the configured task provider.
command: shape
---

# agent-shape

**Solution-shape orchestrator.** Where `/idea` proposes 3-5 ways to
frame a *problem*, `/shape` proposes 2-3 ways to *solve* the picked
framing. Each shape is a complete proposal — story, AC, tech sketch,
architecture, tests, estimate — so the user picks the trade-off they
want before any artifact gets canonicalized.

Sits between `/idea` (problem framing) and `/groom` (deep refinement
on one committed path). After `/shape` commits a picked option, you
can still run `/groom` for the full spec + implementation plan + task
breakdown if you want more depth before `/dev`.

## Inputs

Required:

- A ticket ID (e.g. `PMO-7825`). Resolves via the configured task
  provider (Linear / ClickUp / Jira) or a local story file at
  `docs/stories/<TICKET>.md` produced by `/idea`.

Optional flags (parsed from the invocation, e.g.
`/shape PMO-7825 --priority=high`):

| Flag | Values | Effect |
|---|---|---|
| `--priority=<v>` | `must`, `should`, `could`, `won't`, `P0..P3`, `high`, `med`, `low` | Skip the business-priority AI proposal; use this as-is. Technical priority + risk are still AI-decided. |
| `--shapes=<n>` | `2`, `3` | Override the default of 3 candidate shapes. |
| `--skip-split` | (no value) | Don't split even if estimate > 8 points. Use when you intentionally want a single oversized ticket. |

Also reads:

- `.agent.local.yaml` for `task_provider`, `git.platform`,
  `linear.*` / `clickup.*` / `jira.*` IDs, `refine.split_threshold_points`
  (default 8), `paths.*`.
- The user-story template at `docs/user-story-template.md` if present
  in the consuming project (the project's own house style); falls
  back to `.agent/workflow/02-user-story/templates/user-story.md`.
- Project context: stack preset, recent stories in `docs/stories/`,
  affected systems (codebase grep based on the ticket title).

## Steps

### 0. Resolve inputs

1. Normalize the ticket input (URL → ID, or read the local story
   file directly). If neither resolves, ask the user.
2. Parse flags from the rest of the invocation:
   - `--priority=<v>` → store. Map informal values to canonical:
     `high/P0` → `Must`, `med/P1` → `Should`, `low/P2` → `Could`,
     `none/P3` → `Won't`.
   - `--shapes=<n>` → store (default 3, min 2, max 5).
   - `--skip-split` → store (default off).
3. **MCP** (if `task_provider != none`): fetch the existing issue and
   confirm its state. If it's not at `In Progress` or earlier
   (`Backlog`, `Todo`, `validated`), warn — `/shape` is meant for
   pre-commit work, not for tickets already in build.

### 1. Generate N candidate shapes

Read the validated story + AC from `/idea` and the project context.
Generate `--shapes` candidates (default 3). Each candidate is a
distinct **solution direction**, not a wording variant. Pick seams
that produce genuinely different trade-offs:

- **Build vs. buy** (custom implementation vs. existing library /
  external service).
- **Sync vs. async** (request-path vs. message-queue).
- **Greedy vs. lazy** (precompute now vs. on-demand later).
- **Centralized vs. distributed** (one service vs. several).
- **Full vs. minimal scope** (everything in the AC vs. happy-path-only
  with follow-ups).
- **Frontend-heavy vs. backend-heavy** (where complexity lives).

For each candidate `S1..Sn`, fill the project's
`docs/user-story-template.md` shape (or the framework default if
absent), producing:

- **User story** in `As <role>, I want <goal>, so that <value>` form.
- **Scope** — what's in.
- **Out of scope** — what's not.
- **Change description** — New / Modified / Removed.
- **Acceptance criteria** — Given/When/Then, including edge cases.
- **Preconditions** — fixtures, flags, accounts.
- **Deliverables** — BE / FE / QA / DevOps bullets.
- **Technical context** — stack constraints, architecture sketch
  (1-2 paragraphs naming the modules, services, data flow), security
  notes.
- **Open questions** — explicit `<TBD with <owner>>` lines.
- **Estimate** — T-shirt (XS/S/M/L/XL) + Fibonacci (1/2/3/5/8/13) +
  hour range. Score per `agent-estimate` logic.
- **Trade-off summary** — one line: "S2 buys you X at the cost of Y."

### 2. Present the table — wait for the pick

Print to the user a single table summarizing the candidates so the
trade-off is visible:

```
SHAPE  TITLE                              EFFORT   STORY-PT   TRADE-OFF
S1     Soft-delete + restore window       M        5          fast + reversible, no archive UI
S2     Hard-delete after retention job    L        8          cleanest data model, needs cron + audit
S3     Archive + filter-from-default      S        3          simplest; campaigns linger forever
```

Wait for the user. Accept `S1`, `S2`, `S3`, `hybrid of S1+S3` (with
notes), or `reject` / `park`. If reject/park, stop — no artifacts
beyond a one-line note on the discovery brief.

### 3. Commit the picked shape

Write the picked candidate's content into canonical artifacts under
the project's `paths.*`:

- `docs/stories/<TICKET>.md` — overwrites the draft from `/idea`
  with the chosen shape's story + AC + scope/out-of-scope/change
  description.
- `docs/specs/<TICKET>.md` — the tech-spec sketch from the chosen
  candidate (light template — full spec comes from `/groom` or
  `/spec` later).
- `docs/adr/<NNNN>-<slug>.md` — the architecture sketch if it carries
  a non-trivial decision (e.g. "chose sync over async because …").
  Skip if the decision is obvious.
- `docs/plans/<TICKET>-shape.md` — record the full candidate list +
  the user's pick + the trade-off rationale. This is the audit trail.

Put a marker on the story between
`<!-- agent-framework:shape:start -->` and `:end -->` so re-runs of
`/shape` are idempotent.

### 4. Prioritization

If `--priority=<v>` was given:

- Use it as `business_priority`. Skip the AI business-priority
  proposal entirely. **Do not** ask "are you sure?" — the flag is
  the user's explicit choice.
- Still compute `technical_priority` (0-3, AI) and `risk` (0-5, AI)
  per `agent-prioritize`.

If not given:

- Run the full `agent-prioritize` flow (AI proposes business, AI
  decides technical + risk, user confirms before write).

Write the priorities to the provider ticket:

- ClickUp / Jira → custom fields per `integrations/<provider>/field-mapping.md`.
- Linear → labels (`p_business_*`, `p_technical_*`, `risk_*`).

### 5. Estimation

The picked candidate already came with an estimate. Reconcile it
with `agent-estimate`'s calibration step (similar closed tickets in
the repo). If they disagree by more than one Fibonacci step, surface
the discrepancy and use the higher number — bias toward honest
estimates.

Write the final estimate to the provider's native estimate field
(Linear `estimate`, ClickUp `story_points`, Jira Story Points
custom field).

### 6. Split if oversize

If `final_estimate > refine.split_threshold_points` (default 8)
AND `--skip-split` was NOT set:

- Delegate to `/refine`'s split flow on the now-committed story.
  Each subtask gets its own estimate (≤8 points), title
  `<TICKET>/<n> — <focused phrase>`, and is created as a child issue
  in the provider with the parent-child link.
- Write `docs/plans/<TICKET>-refine.md` as the split audit trail.

If `--skip-split` was set OR `final_estimate ≤ 8`: skip this step.

### 7. (Future) API contracts — out of scope

When the picked candidate touches an HTTP API, the framework will
eventually emit a draft OpenAPI / GraphQL contract here. For now,
this step is **deferred**. Note in `docs/specs/<TICKET>.md` under
"Open questions": `<TODO: API contract — to be defined post-shape>`.
Skip silently — don't block on this.

### 8. Report

Print one line per artifact + the verdict:

```
shape    S2 picked from {S1, S2, S3}
story    docs/stories/PMO-XXXX.md      (overwritten from /idea draft)
spec     docs/specs/PMO-XXXX.md        (tech-sketch from S2)
adr      docs/adr/0042-pmo-xxxx-...md  (sync vs async decision)
plan     docs/plans/PMO-XXXX-shape.md  (candidate list + rationale)
priority business=Must (--priority flag), technical=2, risk=2
estimate L | 8 points | 12-16h         (reconciled with PMO-7321 actuals)
split    none (8pt at threshold; --skip-split would have skipped anyway)
ticket   https://linear.app/.../PMO-XXXX   (updated)
next     /groom PMO-XXXX  →  /dev PMO-XXXX
```

## Human gates

| Step | Gate | What you do |
|---|---|---|
| 2 | Pick a shape | **Stop** and wait for `S<n>` / hybrid / reject / park |
| 4 | Confirm priorities (only if NO --priority flag) | Show proposal, wait for OK |
| 5 | Estimate disagreement | Print both numbers, use the higher, tell the user |
| 6 | Confirm subtask split (only if oversize + not --skip-split) | Show table, wait for OK |
| 7 | (Future) API contract | Skipped today; no gate |

## Guardrails

- **Never canonicalize a candidate the user didn't pick.** Steps 1-2
  are entirely speculative artifacts — they live in
  `docs/plans/<TICKET>-shape.md`, NOT in `docs/stories/` or
  `docs/specs/`. Only the picked candidate gets canonical paths.
- **Never overwrite a `/groom`-or-later spec** silently. If
  `docs/specs/<TICKET>.md` already exists with more depth than a
  sketch, stop and ask before overwriting — `/shape` is for
  *pre-commit*, not for re-shaping committed work.
- **Don't invent business value.** Each candidate's "trade-off
  summary" must follow from the AC, not from a desired conclusion.
- **`--priority=<v>` is explicit.** Don't second-guess. If you think
  the user got the priority wrong, surface it in the report — never
  refuse to honor the flag.
- **Skip-split is opt-in.** If `--skip-split` is set, do not split.
  Do flag in the report: "ticket is XL; future `/refine` may want to
  split."

## Required skills

| Skill | Where used |
|---|---|
| `agent-estimate` | step 1 (per-candidate sizing), step 5 (final calibration) |
| `agent-prioritize` | step 4 (priorities) |
| `agent-refine` | step 6 (split oversize tickets into subtasks) |
| `ambiguity-detector` | sanity check on each candidate's AC before presenting (no vague "fast / easy / should" sneaking back in after `/idea` validation) |

If any is missing, stop and report.

## Required MCP tools

| Server | Tools |
|---|---|
| Linear / ClickUp / Jira | per the configured `task_provider` — `get_issue`, `update_issue`, `add_comment`, plus custom-field writes for priority + estimate |

## TODOs the installer / project must fill

- `<<TICKET_ID>>` — supplied by the user on each invocation.
- `docs/user-story-template.md` — project-specific; the skill prefers
  this over the framework default. If the project doesn't have one,
  the framework's `workflow/02-user-story/templates/user-story.md` is
  used silently.
- `refine.split_threshold_points` — defaults to 8; override in
  `.agent.local.yaml` per project.

## See also

- `agent-idea` (`/idea`) — upstream: produces the validated ticket
  this skill consumes.
- `agent-groom` (`/groom`) — runs after `/shape` for the deeper
  refinement (full spec, implementation plan, task breakdown).
- `agent-estimate` / `agent-prioritize` / `agent-refine` — the
  per-aspect skills `/shape` orchestrates.
- `docs/dev-implementation-review-workflow.md` — what comes after
  this (`/dev` → `/reviewer`).

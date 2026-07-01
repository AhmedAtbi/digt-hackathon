---
name: agent-idea
description: Business Analyst intake. A Business Teamlead submits a raw idea; collect the four fields, frame it, scan for duplicates, and (on confirmation) create a Backlog ticket in the configured provider (Linear / ClickUp / Jira). Optional ideation for open-ended ideas.
command: idea
---

# agent-idea

The **Business Analyst** front door, per [`roles/analyst.md`](../../roles/analyst.md):
raw idea → four fields → frame → duplicate scan → **Backlog ticket** in the
configured provider, behind a hard gate.

When invoked:

1. **Intake (the four fields).** Collect **title**, **problem description**,
   **expected value**, **affected area**. Echo back what the submitter gave and
   ask a short numbered list for anything missing or vague — one round, no
   invented answers. Restate the idea in one sentence and confirm. This is the
   `problem-brief` artifact.
2. **Frame it (don't enrich).** Make the problem statement clear and the four
   fields complete; turn genuine ambiguity into numbered open questions. Keep
   every question plain and business-level — submitters are non-technical, so
   never ask about (or suggest) systems, data, security, or how it would be
   built. Technical context and edge cases are the Architect's stage 01 job,
   after handoff.
3. **Duplicate scan.** Run `duplicate-and-priority-scan` against local
   `docs/stories/*.md` and the provider's issues. Decide by the match and its
   stage:
   - **Same idea already captured** → do not create; report the match (ID,
     title, state) and stop.
   - **Delta (adds something the match lacks)** → surface what's new and **ask
     whether to improve the existing feature** (a linked improvement ticket).
   - **No match** → continue.
4. **Validate.** Recommend **proceed / improve-existing / park-reject** with a
   one-line rationale. The submitter / PO decides.
5. **(Optional) Ideation — only for open-ended ideas.** If the idea is broad
   enough to warrant comparing framings, read
   `.agent/workflow/00-discovery/prompt.md`, present 3–5 candidates, and wait for
   a pick. Skip this for a straightforward request.
6. **Confirm + create (hard gate).** Show the drafted ticket (title from
   **Title**; description carrying **Problem description**, **Expected value**,
   and open questions; **Affected area** → label/team routing — framed, not
   enriched). Create **only after the submitter confirms** — never silent.
   Read `.agent.local.yaml` `task_provider`, then:
   - `linear`: use `.agent/integrations/linear/sync-prompt.md`; create in the
     **Backlog** state (`linear.default_state_id`).
   - `clickup`: use `.agent/integrations/clickup/sync-prompt.md` (backlog list).
   - `jira`: use `.agent/integrations/jira/sync-prompt.md` (backlog status).
   - `none`: write the local files and tell the user no provider was synced.
7. **Report back**: the created ticket's ID + URL (or the matched duplicate, or
   "parked"), and where any local artifact landed.

If `.agent/` is missing, ask the user to run
`git submodule update --init --recursive`.

If `.agent.local.yaml` is missing or has an unknown `task_provider`, ask the
user to fix it before creating anything.

## Human gate

**Confirm idea framing + ticket creation — hard, owned by the submitter /
Product Owner.** No ticket (and no improvement ticket against a duplicate) is
created until they confirm. Backlog placement is not a priority commitment —
prioritization is a later human gate (stage 08).
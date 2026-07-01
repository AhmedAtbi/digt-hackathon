---
name: agent-document
description: Generates and maintains feature documentation for any change — backend, frontend, or fullstack — in a consistent house style, committed in the same PR as the code. Auto-detects genre (feature doc, investigation report, API reference, release note, README) from the diff and the ticket. Treats code/schema/OpenAPI as source of truth — links and references rather than restates — so docs don't drift. Honors per-project paths and stack presets. ADRs and MR descriptions are out of scope (owned by architecture-review and `/mr`).
command: document
---

# agent-document

Documents one change end-to-end so docs land in the same PR as the
code, never as a follow-up. Adopts the
[Documentation role](../../roles/doc.md): link to the source of truth,
don't restate; state the resolved scope and mode at the top of the
artifact so detection is auditable.

Two modes, one skill:

- **Write mode** (default): produce or update the documentation
  artifact for the current diff.
- **Check mode** (`/document --check`): scan the project for
  doc/code drift, list stale docs and missing docs, propose updates,
  **do not write**.

## Inputs

Required:

- A ticket ID (e.g. `PMO-7825`) — or, in check mode, no ticket
  needed; the skill scans the whole project.

Optional flags:

| Flag | Effect |
|---|---|
| `--mode=<genre>` | Pin the genre: `feature` / `report` / `api` / `release` / `readme`. Skip auto-detect. |
| `--check` | Drift / staleness scan; do not write anything. |
| `--paths-only` | List the files the skill would write/update; do not write. |

Also reads:

- `.agent.local.yaml`:
  - `task_provider` → which provider MCP to call.
  - `stacks` → which stack preset's coverage rules apply.
  - `paths.docs.<genre>` → per-genre output paths (see Output).
  - `paths.lessons` → optional `<project>/.agent/lessons/` directory
    for project-local lessons; default if absent.
- The active stack preset(s) at
  `.agent/workflow/09-development/stack-presets/<stack>.md` — they
  declare *what surfaces this stack documents* (entities, routes,
  migrations, components, hooks, locales, env vars, fixtures, …).
  The skill reads the preset to know what to cover; it does not
  invent a coverage matrix.
- The diff or changed-path set for the feature: `git diff <base>`,
  the current branch, or an explicit MR if given.
- The provider ticket (description, AC, status, comments) via the
  configured MCP — **read-only**.
- Prior artifacts for the ticket: story, spec, plan, ADRs.
- Lessons: this skill's framework-level `lessons.md` (next to this
  file) and the consuming project's
  `<project>/.agent/lessons/document.md` if it exists.

## Steps (write mode)

### 1. Resolve scope from the diff

Walk the changed-path set. Each stack preset declares which paths
belong to which surface (backend / frontend / shared / config / data /
tests). Aggregate:

- All-BE paths → `scope: backend`
- All-FE paths → `scope: frontend`
- Both → `scope: fullstack`

Record the resolved scope as the **Scope** line at the top of the
artifact so detection is auditable. Re-runs respect what's written
there — the marker block lets you regenerate without clobbering hand
edits outside it.

### 2. Read the ticket source + QA reviews

Via the provider MCP (read-only):

- Ticket description, AC, status, comments.
- QA sign-off / QA comments / MR review threads if present.
- `/test` results for this ticket if recorded.

Reconcile the diff against what the ticket asked. Flag under **Open
questions**:

- Scope drift (the diff did something the AC didn't ask for).
- Unmet AC (the AC asked for something the diff didn't do).
- Open QA defects — never silently drop one. Fold them into a
  **QA notes / Known issues** section.

### 3. Apply lessons

Read this skill's `lessons.md` (framework-wide) and the project's
`<project>/.agent/lessons/document.md` (project-specific). Do not
repeat a listed mistake. If a lesson conflicts with the diff (e.g.
"don't restate API bodies" but the doc has a body restated), fix the
doc, not the diff.

### 4. Pick genre

If `--mode=<genre>` was given: use it. Otherwise infer from the diff
and the ticket. **Defaults that don't need project-specific knowledge:**

| Signal | Genre |
|---|---|
| Diff adds/changes API routes / endpoints / handlers | `feature` (with an API table) — never separate `api` genre alone unless the change is *only* API surface |
| Ticket type is "bug" + diff has a root-cause path / commit history | `report` (investigation) |
| Diff is user-facing + project has a `CHANGELOG.md` for that surface | `release` (release note) |
| Diff adds a new top-level directory or a layer's purpose changes | `readme` (update or create) |
| None of the above; ticket is a story | `feature` (default) |

**Out of scope** (the skill stops and points elsewhere):

- ADRs / architecture decisions → owned by stage 04
  (`docs/adr/<NNNN>-<slug>.md`). Route a surfaced decision there as
  an Open question; **never** author an ADR here.
- MR / PR descriptions → owned by `agent-mr` / `/mr`. `/document`
  does not write the PR body.

State the chosen genre under **Mode** at the top of the artifact.

### 5. Gather evidence, don't invent

For every claim in the doc, you must have a source: a file path, a
ticket line, a commit, an OpenAPI spec, a schema entry. If a
business rule (pricing, retention, SLA, validation threshold,
permission) is not in the diff, the ticket, or a prior artifact,
record it under **Open questions**, not as fact.

Do not document a behavior the diff doesn't add.

### 6. Cover the surfaces declared by the stack preset

The active stack preset (`workflow/09-development/stack-presets/<stack>.md`)
declares its documentable surfaces — for example:

- For a backend stack: storage / migrations, write-side handlers,
  read-side queries / providers, API operations + endpoints,
  validation, async / message bus, external integrations, config /
  env, fixtures.
- For a frontend stack: routes / pages, components, API client
  hooks, state management, i18n / locales (only the locales the
  project actually supports — read from project config), design
  tokens / states.

Document every surface the diff touches **and only those**. Do not
fabricate surfaces the project doesn't have. If the preset doesn't
declare a surface and the diff touches code that doesn't fit any
declared surface, ask before inventing a new section.

### 7. Write the artifact (one per run)

Use the genre's house sections (see Output below). Headings are
sentence-case. File naming follows the project's existing convention
(read other files in `docs/`); never enforce an opinionated case if
the repo uses something else.

Reference code by class/file name in backticks. Quote snippets only
when the exact text is load-bearing (a config before/after, a critical
catch block). Use tables for endpoint shapes, touched files, expected
states; fenced code blocks for commands and payloads.

Wrap the generated content between markers so re-runs are idempotent:

```markdown
<!-- agent-framework:doc:start -->
…generated content…
<!-- agent-framework:doc:end -->
```

Anything outside the markers (hand-written notes, edits) is preserved
across regenerations.

### 8. Verification

Include copy-pasteable checks. Pull the commands from the project's
own conventions (in the stack preset / `AGENTS.md` of the project):
test commands, lint commands, route-walk steps, API smoke commands.

End with a **Pass criteria** checklist.

### 9. Evidence trail

Close the artifact with:

- Links to story / spec / MR.
- A `Closes <TICKET-ID>` line. This is the only ticket linkage the
  skill writes; it does NOT call the provider MCP to update the
  ticket itself (that's a hard gate — see Gates).
- A **Decided by / on** line — leave the name blank, the human fills
  it in.

### 10. Detect drift on adjacent docs

After writing the new doc, list any sibling docs in the same
directory whose modification time predates the latest commit touching
their declared subject. Flag them in the **Open questions** section
("X may be stale: last updated N, file Y last touched M"). Don't auto-
update those — that's check mode's job, on explicit invocation.

### 11. Capture a lesson

If a human corrects this doc (during MR review or by editing the
artifact), append the correction as a one-line lesson:

- **Project-specific gotcha** → `<project>/.agent/lessons/document.md`
  (write-mode file; no hard gate).
- **General documentation-skill mistake** → propose adding it to
  this skill's framework `lessons.md` (a framework change — **hard
  gate**, confirm before writing).

Each lesson is exactly one line: `Mistake → Do instead.`

## Steps (check mode)

When `--check` is set, the skill does NOT write. It walks the
project's `docs/` tree and produces a report:

1. **Inventory.** Build a list of `<doc-file> → declared-subject`
   from the resolved-scope marker at the top of each doc and from
   any `Closes PMO-XXXX` lines.
2. **Compare against the repo's last-modified clock.**
   - For each doc: find the most recent commit touching its declared
     subject (files / classes / ticket).
   - If the subject's last-commit date is newer than the doc's
     last-update date → **stale**.
3. **Find the orphans:**
   - Docs whose declared subject no longer exists in the codebase →
     **orphan**.
   - Subjects (closed tickets) with no doc → **missing**.
4. **Produce a report** at `docs/_document-check.md` (between
   `<!-- agent-framework:check:start -->` markers — idempotent):

   ```
   STALE     5 docs (subject changed after last doc update)
   ORPHANED  1 doc  (subject no longer exists)
   MISSING   3 tickets closed in the last 90 days without a doc

   <table per category — file path, subject, last-updated, drift
    in days, suggested action>
   ```
5. **Suggest** a `/document <TICKET>` command for each missing doc
   and a `/document --mode=<genre> <TICKET>` for each stale one.
   Do not run them — the user picks.

## Output

Write into the **consuming project's** configured paths. Defaults
shown; override per-genre in `.agent.local.yaml` → `paths.docs.<genre>`.

| Genre | Default path | Sections |
|---|---|---|
| `feature` | `docs/<TICKET>-<slug>.md` | Summary, Scope (BE/FE/fullstack + mode), Surfaces covered (per stack preset), Endpoints (when API touched), Validation, Config/env, Verification, Pass criteria, QA notes, Open questions, Evidence (`Closes PMO-XXXX`) |
| `report` | `docs/<TICKET>-<slug>-report.md` | TL;DR, How it was supposed to work, What was actually wrong (root cause), What changed (before/after), How I proved it, Files touched, Evidence |
| `api` | (folded into `feature`) | One table per operation, link to OpenAPI / equivalent spec. Skill does not produce a standalone `api` artifact — APIs always sit inside a feature context. |
| `release` | `CHANGELOG.md` (project root or surface-specific path per config) | One entry per shipped change, user-perspective, with `[TYPE]` tag and ticket link. |
| `readme` | `<repo>/README.md` or layer README (`src/README.md` etc.) | Minimal diff edit, no drive-by rewrites. |

**One artifact per run** (or one in-place edit). The skill never
edits two prior artifacts in one run. ADRs are never written here.

## Gates

- **Read-only — ticket + QA**: provider MCP for ticket / QA reviews
  is read-only, no gate.
- **Tool gate — file writes**: writing or editing under `docs/` or
  the repo root is per-write tool permission. No hard gate.
- **Hard gate — external effects**: posting outside the working
  tree (Slack release announcement, calling the provider MCP to
  update the ticket the `Closes` line points at, opening or editing
  an MR description) is a hard gate. Show the payload and confirm.
  The skill writes the local linkage line only.
- **Hard gate — judgment numbers**: if a doc must state a number a
  human sets by judgment (SLA, retention window, threshold), show
  it and let the human override before writing.
- **Hard gate — framework `lessons.md` edits**: appending a lesson
  to this skill's own `lessons.md` is a framework change. Propose
  the line and confirm. Project-local lessons (in the consuming
  project) are tool-gate only.

## Required skills

None — `/document` is leaf-level. It consumes artifacts the upstream
skills produced (`/idea`'s story, `/shape`'s spec, `/groom`'s plan)
but doesn't delegate.

## Required MCP tools

| Server | Tools |
|---|---|
| The configured task_provider (Linear / ClickUp / Jira) | `get_issue`, `list_comments`, `list_users` — all read-only |

If the provider MCP is unavailable, fall back to the local
`docs/stories/<TICKET>.md` and `docs/specs/<TICKET>.md` artifacts as
the ticket source. Warn that QA reviews can't be pulled.

## Configuration the project should consider

`.agent.local.yaml`:

```yaml
paths:
  docs:
    feature: "docs"               # or "docs/features", repo root, etc.
    report:  "docs"
    release: "CHANGELOG.md"       # project root or a surface-specific path
    readme:  "README.md"
  lessons: ".agent/lessons"       # project-local lessons dir

stacks:
  - php-symfony                   # determines coverage rules
  - node-typescript               # multi-stack monorepos list both
```

If `paths.docs.<genre>` is unset, the defaults in the Output table
apply. If `paths.lessons` is unset, the skill skips project-local
lessons reads silently.

## Confidence

End the artifact with:

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": "completeness = share of stack-preset surfaces covered (the diff intersects them) + QA notes / Known issues. ambiguity rises with every business rule in Open questions and every unreconciled scope drift / unmet AC. risk reflects undocumented open QA defects or proxy/contract claims not verified against the other side. test_coverage = whether Verification gives a runnable check per behavior. dependencies tracks unresolved links to schema / OpenAPI / paired docs."
}
```

## See also

- `roles/doc.md` — the Documentation role's voice and guardrails.
- `release-note-writer` skill — focused user-perspective release
  prose; `/document` invokes the same intent when `--mode=release`,
  but `release-note-writer` is also callable directly for non-ticket
  contexts (hotfix, infra-only release).
- `agent-mr` (`/mr`) — owns MR/PR descriptions. `/document` defers
  to it.
- `workflow/04-architecture-review/` — owns ADRs. `/document` defers
  to it.

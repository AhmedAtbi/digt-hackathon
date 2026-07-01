# agent-document — lessons (framework-level)

Documentation mistakes — and what to do instead — that apply to any
project, not just one team's stack. **Read this before writing
(Step 3).** When a human correction is general (would apply to any
consuming project), propose adding it here as a one-line lesson.
Project-specific gotchas go to `<project>/.agent/lessons/document.md`,
NOT here.

Each lesson: **Mistake → Do instead.** One line. Newest at the bottom
of its section.

## Source of truth

- Restating an API response body in prose → link to the project's
  OpenAPI / GraphQL spec; show only the divergence (read-vs-write
  field names, special content types) where the spec under-specifies.
- Pasting code into the doc when a class/file reference would do →
  reference by name in backticks; quote source only when the exact
  text is load-bearing.
- Hardcoding values that come from config → cite the env var / config
  key by name, link the config file, don't copy the value (it rots
  silently).
- Stating a business rule (pricing, retention, SLA, threshold) the
  diff doesn't add → move it to **Open questions** under a
  `TBD with <owner>` line; don't assert it as fact.

## Scope, ownership, evidence

- Authoring or numbering an ADR → ADRs are owned by stage 04
  (`docs/adr/<NNNN>-<slug>.md`). Route the decision there as an Open
  question; do not write the ADR here.
- Writing the MR / PR description → owned by `agent-mr` / `/mr`.
  `/document` writes about the change, not the MR body.
- Documenting features that don't exist in the diff → only document
  what the diff actually adds. Wishful documentation rots fastest.
- Dropping an open QA defect silently → carry it forward under
  **QA notes / Known issues** until it's closed; never assume it's
  fixed because the diff didn't touch the defect's surface.

## Coverage matrix

- Inventing surfaces the stack preset doesn't declare → stop and ask
  before adding a section the project's stack doesn't recognize.
- Documenting only the happy path → cover the loading / error /
  empty triad for any user-facing surface; the unhappy-path
  acceptance criteria deserve a section, not a footnote.
- Listing every code path the diff touched, including refactors that
  added no behavior → document **behavior**, not **lines changed**.

## Tone & accuracy

- Writing in the AI's voice ("I refactored…") → write in the team's
  voice ("The retention column is added…"). The doc is a project
  artifact, not a session log.
- Claiming an upstream / downstream contract changed when only one
  side moved → verify the other side; if the contract didn't move,
  state that explicitly ("API contract unchanged — internal-only
  refactor").
- Using stage numbers from memory → confirm against `workflow/`:
  04 architecture-review, 05 tech-spec, 06 implementation-plan,
  09 development, 10 code-review, 11 testing, 13 deployment.

## Idempotency

- Generating new content outside the `<!-- agent-framework:doc:start -->`
  markers → all generated content lives between markers; hand-written
  content above/below the markers is preserved across re-runs.
- Re-running and producing a second copy of the QA notes section →
  the marker block is one section; re-runs *replace* the block,
  never append.

## Drift detection

- Reporting a doc as stale based on `mtime` alone → use git's
  last-commit date for the doc and the most recent commit touching
  its declared subject; `mtime` resets on every checkout.
- Marking a doc as "orphan" when only a single file moved → walk
  the rename history; a file moved is not a subject removed.

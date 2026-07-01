---
name: branch-structure
description: Resolve the branch / environment / MR-target mapping for a ticket. Given a ticket type and the project's `.agent.local.yaml`, return the source branch, the target branch, the branch-name pattern, and the deploy environment. The single source of truth for "where does this work go?"
stage: Build
owner: Lead
ai_role: propose
---

# Branch Structure

## When to use

Before any other skill that touches git: `agent-branch` (to cut the new
branch), `agent-mr` (to know the MR target), `agent-mr-status`, the Dev
Agent's step 2, and the Reviewer Agent's step 8 (to know which
environment a merge deploys to).

If you find yourself hard-coding `develop` or `main` in a prompt, you
should be calling this skill instead.

## Inputs

- A ticket (`<TICKET-ID>` or local file path), used to detect the work
  type from the ticket label / title.
- The work **type** (one of `feature`, `bug`, `fix`, `hotfix`,
  `refactor`, `chore`, `docs`, `test`, `task`). If not given, infer
  from the ticket title using the heuristics in `agent-branch`.
- `.agent.local.yaml`:
  - `git.base_branch` (default `develop`)
  - `git.hotfix_base_branch` (default `main`)
  - `git.branch_patterns.<type>` (default `<type>/{ticket}-{slug}`)
  - `git.platform` (`gitlab` | `github`)

## Steps

1. **Resolve type** from input or infer from ticket title (use the same
   heuristics as `agent-branch`).
2. **Resolve source branch** — the branch the work is cut FROM:
   - `hotfix` → `git.hotfix_base_branch` (default `main`).
   - everything else → `git.base_branch` (default `develop`).
3. **Resolve target branch** — the branch the MR merges INTO:
   - `hotfix` → `main` (with a back-merge MR to `develop` and `staging`
     filed separately after merge).
   - everything else → `git.base_branch` (default `develop`).
4. **Resolve branch-name pattern** —
   `git.branch_patterns[<type>]`, substituting `{ticket}` and `{slug}`.
   If the pattern is missing for the type, fall back to
   `task/{ticket}-{slug}`.
5. **Resolve deploy environment** — the environment the target branch
   deploys to (defined by the project's CI config). Defaults:

| Target branch | Deploy env | Auto/manual |
|---|---|---|
| `develop` | dev | auto on merge |
| `staging` | staging | auto on merge |
| `main` | production | **manual** gate |

   Project-specific overrides live in
   `.agent.local.yaml` → `git.deploy_map.<branch>: <env>` if present.

## Output — artifact as proof

A single resolved record, printed back to the calling skill (no file
written). Shape:

```
ticket   : <TICKET-ID>
type     : <feature|bug|hotfix|…>
source   : <branch the work is cut from>
target   : <branch the MR merges into>
branch   : <full branch name, e.g. feature/PMO-7825-invoice-pdf-footer>
env      : <deploy environment the merge lands in>
gate     : <auto | manual>
platform : <gitlab | github>
```

The calling skill (`agent-branch`, `agent-mr`, the Dev / Reviewer
agents) uses this record verbatim. **No skill should re-derive these
values.**

## Human gate

None for the read path. When this skill is invoked from `agent-branch`
or `agent-mr`, the *calling* skill surfaces the resolved values to the
user before any git side effect — same gate, not duplicated here.

## Guardrails

- **Never invent a branch name pattern.** If `git.branch_patterns.<type>`
  is missing, fall back to the documented default; don't auto-generate
  a creative format.
- **Never derive the deploy env from the branch name alone.** Always
  read `git.deploy_map` or use the documented default table. Custom
  envs need to be declared in `.agent.local.yaml`.
- **`hotfix` is special.** Cut off `main`, MR back to `main`, deploys
  to prod with a manual gate. The skill MUST flag `gate: manual` for
  hotfix so the calling agent doesn't auto-merge.
- **`task/` is the legacy fallback.** New work should pick a typed
  prefix; emit a soft warning when the inferred or supplied type is
  `task`.

## Why this exists

Without this skill, every branch-aware operation (cut branch, open MR,
report status, decide deploy gate) reads `.agent.local.yaml` and
re-derives the same answers — diverging over time. Centralising in
one resolver keeps the Dev Agent, the Reviewer Agent, `agent-branch`,
and `agent-mr` consistent.

## See also

- `agent-branch` — uses this skill to know where to cut from.
- `agent-mr` — uses this skill to set the MR target.
- `workflow/09-development/git-flow.md` — the full prose rationale.

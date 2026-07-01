---
name: agent-branch
description: Cut a feature/bug/hotfix/refactor/chore/docs/test/task branch off the right base, using the project's branch-pattern config. Picks the type from the ticket title or commit-type when not given.
command: branch
---

# agent-branch

Create the next short-lived branch correctly so the rest of the git
flow (push, MR, reviewer assignment) can stay automated.

## Inputs

- The ticket ID (e.g. `PMO-7825`). Either supplied by the user, read
  from the open task file under `docs/tasks/`, or read from the
  configured task provider (ClickUp / Linear / Jira).
- The ticket title or short description (used to build the slug).
- Optionally, the work **type** — one of `feature`, `bug`, `fix`,
  `hotfix`, `refactor`, `chore`, `docs`, `test`, `task`. If absent,
  infer from the ticket title or ask.
- Project config from `.agent.local.yaml`:
  `git.base_branch`, `git.hotfix_base_branch`, `git.branch_patterns`.

## Steps

1. **Confirm the ticket ID, title, and type** with the user before
   doing anything. Show the proposed branch name and the base branch.
   Stop if they object.
2. **Slugify the title**: lower-case, replace non-alphanumeric with
   `-`, collapse repeats, trim, truncate to ~40 characters. Example:
   `Invoice PDF footer fallback` → `invoice-pdf-footer-fallback`.
3. **Pick the base branch**:
   - `hotfix` → `git.hotfix_base_branch` (default `main`)
   - everything else → `git.base_branch` (default `develop`)
4. **Pick the branch pattern** from `git.branch_patterns[<type>]`.
   Substitute `{ticket}` and `{slug}`.
5. **Run**:
   ```bash
   git fetch
   git checkout <base>
   git pull --ff-only
   git checkout -b <branch>
   ```
   If the working tree is dirty, stop and ask.

## Output

- A new local branch checked out and tracking nothing yet.
- One line printed: `created <branch> from <base>`.
- The task file's frontmatter updated with `branch: <name>`.

## Guardrails

- Never delete or rebase shared branches.
- Never `--force-with-lease` here — that's for `/mr`.
- Never skip the working-tree check.

## Type inference heuristics

When the user doesn't specify a type, guess from the ticket title:

- title has "bug" / "broken" / "doesn't work" / "regression" → `bug`
- title has "hotfix" / "urgent" / "prod down" → `hotfix`
- title has "refactor" / "rename" / "extract" / "move" → `refactor`
- title has "test" / "coverage" → `test`
- title has "docs" / "documentation" → `docs`
- title has "bump" / "upgrade" / "dependency" / "tooling" → `chore`
- otherwise → `feature`

Always show the guess to the user before cutting the branch.

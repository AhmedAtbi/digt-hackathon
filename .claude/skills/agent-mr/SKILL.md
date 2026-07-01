---
name: agent-mr
description: Rebase, push, and open a merge / pull request via glab or gh — pre-filled with the framework PR template, linked to the story/spec/plan/ClickUp/Linear/Jira, and with the configured reviewers assigned.
command: mr
---

# agent-mr

Take a feature branch from "code complete locally" to "MR open, reviewer
assigned, ClickUp / Linear / Jira updated."

## Inputs

- The current branch (must not be a long-lived one).
- Project config from `.agent.local.yaml`:
  `git.platform`, `git.base_branch`, `git.hotfix_base_branch`,
  `git.reviewers`, `task_provider`.
- The task file under `docs/tasks/<TICKET>-<n>.md` (or story file).
- The PR template at `.agent/workflow/09-development/pr-template.md`.

## Pre-flight

1. **Working tree must be clean.** If not, stop and ask the user what
   to commit / stash.
2. **Run the project's pre-push checks** (lint + tests). The commands
   come from the active stack preset under
   `.agent/workflow/09-development/stack-presets/<stack>.md`. Stop on
   failure.
3. **Verify the branch follows a configured pattern**. If it's an
   ad-hoc name, warn the user — automation downstream needs the
   pattern to infer type.

## Push

4. **Fetch and rebase** on the right base branch (default `develop`,
   `main` for hotfix branches):
   ```bash
   git fetch origin
   git rebase origin/<base>
   ```
   If conflicts arise, stop. The user resolves; re-run `/mr`.
5. **Push** with safe-force semantics:
   ```bash
   git push --force-with-lease --set-upstream origin <branch>
   ```
   Never `--force` without `--lease`.

## Open the MR/PR

6. **Pick reviewers**: `git.reviewers.<type>` if non-empty, else
   `git.reviewers.default`. The branch prefix determines the type.
7. **Build the title** from the most recent commit subject.
8. **Build the body** from the PR template; substitute links:
   - Story: `docs/stories/<TICKET>.md`
   - Spec: `docs/specs/<TICKET>.md`
   - Plan: `docs/plans/<TICKET>.md`
   - Task provider URL: from the task file's `clickup_task_id` /
     `linear_issue_id` / `jira_issue_key` frontmatter.
9. **Run the platform CLI**:
   - GitLab:
     ```bash
     glab mr create \
       --target-branch <base> \
       --title "<title>" \
       --description "<body>" \
       --reviewer <user1>,<user2> \
       --label "<work-type>"
     ```
   - GitHub:
     ```bash
     gh pr create \
       --base <base> \
       --title "<title>" \
       --body "<body>" \
       --reviewer <user1>,<user2> \
       --label "<work-type>"
     ```
   If the CLI is missing, print the equivalent UI URL and stop.

## After

10. **Record the MR URL** in the task file's frontmatter
    (`mr: <url>`) and in `docs/stories/<TICKET>.md`.
11. **Update the task provider**: read
    `.agent/integrations/<provider>/sync-prompt.md` and trigger a
    status transition to "In Review" (or the project's equivalent).
12. **Report**: print the MR URL, target branch, and assigned
    reviewers.

## Guardrails

- Never push to a long-lived branch directly.
- Never use `--force` (always `--force-with-lease`).
- Never run with `--no-verify`.
- Never assume the work-type label exists — if missing, omit the
  `--label` flag and tell the user.

## Re-running

`/mr` is idempotent: if an MR is already open for the branch, the
skill updates the description (between `<!-- agent-framework:start -->`
markers) and the reviewer set, but does not re-create the MR.

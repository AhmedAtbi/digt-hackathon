---
name: agent-mr-status
description: Check the status of the open MR/PR for the current branch — CI pipeline, approvals, merge conflicts, draft state, mergeability — and explain what's blocking merge.
command: mr-status
---

# agent-mr-status

Tell the user exactly what's between them and merge.

## Inputs

- The current branch.
- The task file (frontmatter has the MR URL after `/mr` ran).
- Platform CLI (`glab` or `gh`) and the configured `git.platform`.

## Steps

1. **Resolve the MR/PR**:
   - GitLab: `glab mr view --output json` (in the branch's clone).
   - GitHub: `gh pr view --json state,mergeable,statusCheckRollup,reviewDecision,isDraft,headRefName,baseRefName,additions,deletions,changedFiles`.
   If no MR is open for the branch, tell the user to run `/mr`.

2. **Report**:
   - **State**: open / draft / merged / closed.
   - **Target**: base branch.
   - **CI**: each check by name with pass / fail / running. Link to
     the failing job's log if any.
   - **Approvals**: who approved, who's required, how many are still
     missing.
   - **Conflicts**: yes / no. If yes, list the conflicting files.
   - **Mergeable**: yes / no, with the reason.
   - **Unresolved review threads**: count.

3. **Diagnose** the merge blocker in one sentence:
   - "CI failing on `phpunit`" → suggest `/review` of the test diff.
   - "Conflicts on `src/Foo.php`" → suggest rebase.
   - "Awaiting approval from <user>" → suggest a polite nudge.
   - "Unresolved review threads" → suggest `/mr-comments`.

4. **Don't fix anything**. This skill is read-only. Suggest the next
   command but don't run it.

## Output format

```
MR  PMO-7825 — Add invoice PDF footer fallback
URL https://gitlab.com/<group>/<project>/-/merge_requests/1234
    state         open
    target        develop
    pipeline      passed (jobs: build, phpunit, phpstan)
    approvals     1/1 (alice)
    conflicts     none
    mergeable     yes
    unresolved    0
    verdict       READY TO MERGE
```

or:

```
MR  PMO-7825 — Add invoice PDF footer fallback
URL https://...
    state         open
    pipeline      failed on `phpunit` (job #5544)
    verdict       BLOCKED — fix tests then push.
```

## Guardrails

- Never merge from this skill. Merging is a human action.
- Never re-trigger a CI job unless the user asks.
- If the CLI returns nothing (auth lapsed), tell the user to
  re-authenticate; don't loop.

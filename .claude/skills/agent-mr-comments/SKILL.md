---
name: agent-mr-comments
description: Fetch unresolved MR/PR comments, classify each as must-fix / should-fix / nit, and propose a concrete response (code change or reply) for each — pending user approval.
command: mr-comments
---

# agent-mr-comments

Triage review feedback fast: read every unresolved comment, decide what
it needs, and queue actionable responses.

## Inputs

- The current branch.
- The open MR/PR (resolved like in `agent-mr-status`).
- Platform CLI (`glab` or `gh`) and `git.platform`.
- The diff between the branch and base (so context lines accompany
  each comment).

## Steps

1. **Fetch unresolved review threads**:
   - GitLab: `glab api projects/:id/merge_requests/:mr/notes` plus
     `discussions` for thread-level resolution; filter to those where
     `resolved=false`.
   - GitHub: `gh api repos/:owner/:repo/pulls/:n/comments` and
     `gh api repos/:owner/:repo/issues/:n/comments`; the review
     comments have `path` + `line`; issue comments are general.
2. **Group** comments by file + line, then by reviewer.
3. **For each comment, classify**:
   - **must-fix**: correctness, security, broken acceptance criterion,
     test missing, failing CI.
   - **should-fix**: design / naming / duplication / readability.
   - **nit**: style preference, micro-optimization, "consider…".
   - **question**: reviewer asked for clarification, no change needed
     yet.
4. **For each comment, propose an action**:
   - **must-fix / should-fix** → a *minimal* code change as a diff
     hunk (don't write the change yet, just show it).
   - **nit** → a one-line reply ("good catch, will do" or "preferring
     consistency with X, leaving as-is").
   - **question** → drafted reply explaining the intent.
5. **Present a table to the user** before doing anything:

   ```
   # File:Line       Severity     Reviewer    Summary
   1 src/Foo.php:42  must-fix     alice       missing null check
   2 src/Foo.php:73  should-fix   alice       extract method
   3 src/Bar.php:12  nit          bob         prefer const over let
   4 tests/Baz:8     question     alice       why no edge case?
   ```

6. **Wait for the user's selection**: which items to act on. Accept
   ranges (`1-3`), specific IDs (`1,4`), "all must-fix", or "skip".
7. **Apply the picked changes**:
   - For code changes: make the edits, run tests + lint, commit on the
     same branch using the conventional message
     (`fix: <TICKET> address review feedback on <file>`).
   - For replies: post via `glab mr note` or `gh pr comment` /
     `gh pr review --comment`. Quote the original to preserve thread
     context.
   - For resolved threads: mark them resolved via the API.
8. **Push** (`--force-with-lease`) and report what changed.

## Guardrails

- Never auto-resolve `must-fix` threads without a corresponding code
  change.
- Never edit a comment posted by another user.
- Never re-request review automatically — that's the human's call.
- If a comment is ambiguous, classify as `question` and ask the
  reviewer, don't guess.

## Output format

End with:

```
applied: 3 (items 1, 2, 4)
skipped: 1 (nit, kept consistent with existing pattern)
pushed:  origin/feature/PMO-7825-invoice-pdf
mr-status: /mr-status to confirm CI re-runs cleanly.
```

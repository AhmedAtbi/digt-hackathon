---
name: handoff-check
description: Validate the next role has enough context to proceed. Invoke at every stage boundary before passing work on.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Hand-off Check

## When to use
At each stage boundary, just before work moves to the next owner. Catches the leaks codex flagged as the most fragile points.

## Inputs
- The current artifact.
- The next stage's required inputs.

## Steps
1. Compare what the artifact provides against what the next stage needs.
2. Flag missing context, unanswered questions, unowned risks.
3. Confirm the next owner is named and aware.
4. Output ready/not-ready with the gaps.

## Output — artifact as proof
Hand-off checklist: required-vs-provided gap list, next owner, ready verdict.

## Human gate
Both the sending and receiving owner agree the hand-off is complete.

## Guardrails
- AI proposes readiness; humans confirm.
- A hand-off with open blocking questions is not-ready by default.


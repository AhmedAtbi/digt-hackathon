---
name: spec-diff-review
description: Review whether an MR actually implements the locked spec — intent first, code second. Invoke at Review on every MR.
stage: Review
owner: Lead
ai_role: propose
---

# Spec-Diff Review

## When to use
An MR is open against a locked story spec. Run this **before** style/code review — it answers "did we build the agreed story?"

## Inputs
- Locked story spec + ACs.
- The MR diff.

## Steps
1. Walk each AC and locate where the diff satisfies it.
2. Flag ACs with no corresponding change (missing behaviour).
3. Flag changes with no backing AC (scope creep / invented behaviour).
4. Summarise: covered, missing, extra — with line references.

## Output — artifact as proof
Spec compliance review: AC→code coverage table, missing behaviours, out-of-scope changes.

## Human gate
Reviewer approves spec compliance; only then does code/style review proceed.

## Guardrails
- AI proposes the mapping; the human approves.
- An unexplained extra change is treated as a question to the author, not auto-accepted.

## Coding standards


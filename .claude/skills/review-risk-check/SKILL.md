---
name: review-risk-check
description: Flag maintainability, security, data and regression risks in an MR. Invoke at Review after spec-diff-review passes.
stage: Review
owner: Lead
ai_role: propose
---

# Review Risk Check

## When to use
The MR matches the spec; now assess code-level risk before approval.

## Inputs
- The MR diff + tests.
- Architecture/layer context and conventions.

## Steps
1. Scan for security/data issues (injection, auth gaps, leaked secrets, unsafe migrations).
2. Check maintainability: layering, naming, dead code, duplication.
3. Check regression surface: touched shared code, missing tests.
4. Rank findings; mark which block merge.

## Output — artifact as proof
Review risk report: findings by category, severity, blocking vs non-blocking, suggested fix.

## Human gate
Reviewer decides what blocks merge. AI never approves a merge.

## Guardrails
- AI proposes findings; the human commits to the merge decision.
- High-severity security/data findings default to blocking until a human clears them.

## Coding standards


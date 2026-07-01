---
name: ready-for-build-check
description: Verify a story is genuinely ready for AI-assisted implementation. Invoke at Spec Lock as a readiness check, not a freeze.
stage: Spec Lock
owner: Lead
ai_role: propose
---

# Ready-for-Build Check

## When to use
All Solution-Shape artifacts exist. Run as a lightweight readiness gate before build — it confirms readiness, it does not waterfall-freeze iteration.

## Inputs
- ACs, UX state list, API contract sketch, risk register.

## Steps
1. Check each required artifact is present and internally consistent.
2. Verify no open ambiguity/question is still blocking.
3. Confirm risks are accepted or mitigated with owners.
4. Output pass/fail with the exact blockers if fail.

## Output — artifact as proof
Ready-for-build checklist: per-artifact pass/fail, open blockers, overall verdict.

## Human gate
Discipline lead signs "ready for AI-assisted build." A fail returns the story to the relevant stage.

## Guardrails
- AI proposes the verdict; the Lead commits.
- Readiness ≠ frozen — iteration between AI and dev is still expected; this only blocks starting on quicksand.


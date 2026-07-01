---
name: role-gate-summary
description: Prepare a stage-specific approval summary for the accountable human. Invoke at any human gate instead of building a per-stage approval skill.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Role Gate Summary

## When to use
At any human gate (PO sign-off, lead readiness, QA verdict, release go/no-go). One skill serves every gate — no per-stage approval skills.

## Inputs
- The artifact under review + its checklist.
- Open risks/questions.

## Steps
1. Summarise what's being approved in plain language.
2. List what passed, what's open, and what the decision affects.
3. Present the explicit choice: approve / reject / needs-clarification.
4. Surface the consequences of each option.

## Output — artifact as proof
Gate summary: what's decided, open items, the approve/reject/clarify recommendation with consequences.

## Human gate
The accountable human makes the call. This skill prepares the decision; it never makes it.

## Guardrails
- AI proposes the summary and options; the human commits.
- AI cannot own ambiguity — unresolved blockers are shown, not decided away.


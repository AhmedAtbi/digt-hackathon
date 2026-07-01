---
name: acceptance-criteria-writer
description: Draft testable acceptance criteria and worked examples from a story. Invoke at Requirements once the canvas is agreed.
stage: Requirements
owner: PO
ai_role: propose
---

# Acceptance Criteria Writer

## When to use
The story canvas and assumptions are settled. Turn them into criteria a QA could test and an engineer could build against.

## Inputs
- Story canvas + assumption map.
- Constraints (technical, legal, brand).

## Steps
1. Write ACs in Given/When/Then form, one behaviour each.
2. Add at least one worked example per AC (concrete values).
3. Enumerate edge cases: empty, error, permission, boundary.
4. State explicit non-goals to bound scope.

## Output — artifact as proof
AC document: happy-path ACs, edge-case ACs, worked examples, non-goals — each phrased to be testable.

## Human gate
PO signs the scope; QA confirms each AC is actually testable.

## Guardrails
- AI proposes ACs; PO + QA commit.
- AI may not invent business rules — if a rule is undefined, raise it as an open question, never assert a default.


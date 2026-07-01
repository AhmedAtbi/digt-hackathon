---
name: qa-test-matrix
description: Generate a QA test matrix from acceptance criteria and UX states. Invoke at AI QA once a build is review-approved.
stage: AI QA
owner: QA
ai_role: propose
---

# QA Test Matrix

## When to use
The MR is spec-compliant and review-approved. Turn the spec into structured, executable QA scenarios.

## Inputs
- Locked spec + ACs.
- UX state list + API contract.
- Build/MR notes.

## Steps
1. Generate scenarios covering every AC and UX state.
2. Add cross-cutting axes: roles/permissions, locales, devices, data edge cases.
3. For each scenario: precondition, steps, expected result.
4. Mark which scenarios are automatable vs manual.

## Output — artifact as proof
QA matrix: scenarios with preconditions, steps, expected outcomes, coverage map to ACs.

## Human gate
QA decides whether coverage is sufficient; QA owns pass/fail (next: execute + `exploratory-test-guide`).

## Guardrails
- AI proposes scenarios; QA owns coverage adequacy and the verdict.
- Expected outcomes come from the spec; AI does not invent expected behaviour.


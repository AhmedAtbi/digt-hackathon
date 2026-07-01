---
name: story-spec-pack
description: Bundle all approved decisions into one canonical, build-ready story spec. Invoke at Spec Lock — this is the spine artifact of the whole loop.
stage: Spec Lock
owner: Lead
ai_role: propose
---

# Story Spec Pack

## When to use
The ready-for-build check passes. Assemble the single source-of-truth spec that build, review, QA and replay all reference.

## Inputs
- Approved ACs, UX state list, API contract, risk register, non-goals.
- The story canvas (for the why).

## Steps
1. Compose one document: problem, story, ACs, UX states, contract, non-goals, accepted risks.
2. Add a stable spec ID and version so `spec-diff` can track changes.
3. Link every section back to its source artifact for traceability.
4. Mark the spec version "locked" while leaving room to re-version on change.

## Output — artifact as proof
The locked story spec (versioned): the canonical reference for `spec-diff-review`, `qa-test-matrix`, and `delivery-replay-pack`.

## Human gate
Leads + PO + QA confirm the pack reflects what was agreed.

## Guardrails
- AI assembles; humans confirm fidelity.
- The pack records decisions, it does not create new ones — no new business rules introduced here.


---
name: defect-triage
description: Turn QA findings into clear, reproducible bug reports. Invoke at AI QA whenever exploration or scripted runs surface a defect.
stage: AI QA
owner: QA
ai_role: propose
---

# Defect Triage

## When to use
QA hit unexpected behaviour. Convert raw observations into actionable reports before routing back to build.

## Inputs
- QA notes, screenshots, logs.
- Expected behaviour from the spec.

## Steps
1. Write minimal reproduction steps.
2. State expected vs actual, with the spec reference.
3. Propose severity and likely affected area.
4. Suggest the owner (which repo/domain), as a proposal.

## Output — artifact as proof
Defect report: repro, expected vs actual, severity, suspected area, owner proposal.

## Human gate
QA confirms severity; the Lead/PO confirms it blocks release or not.

## Guardrails
- AI proposes the report; humans set severity and routing.
- AI does not assert the root cause as fact — it proposes the likely area and flags uncertainty.


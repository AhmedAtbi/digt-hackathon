---
name: exploratory-test-guide
description: Suggest exploratory test paths beyond the scripted matrix. Invoke at AI QA to probe for what scripts miss.
stage: AI QA
owner: QA
ai_role: propose
---

# Exploratory Test Guide

## When to use
The scripted matrix is being executed. Run to find real-world failure modes the ACs never named.

## Inputs
- Story spec + changed areas.
- Known risks (risk register).
- QA's domain intuition.

## Steps
1. Propose charters: "explore X to discover Y" per risk area.
2. Suggest hostile inputs, race conditions, and stale-state paths.
3. Point at integration seams most likely to break.
4. Leave room for QA's own charters — this guides, it doesn't replace judgement.

## Output — artifact as proof
Exploratory guide: charters, suspected weak spots, suggested adversarial inputs.

## Human gate
QA runs exploration and owns what counts as a defect.

## Guardrails
- AI proposes charters; QA decides where to dig and what's a bug.
- AI does not declare pass/fail — it widens the search.


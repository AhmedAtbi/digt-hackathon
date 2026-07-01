---
name: story-canvas
description: Convert an approved problem brief into a user story canvas. Invoke at Discovery once a problem is greenlit to pursue.
stage: Discovery
owner: PO
ai_role: propose
---

# Story Canvas

## When to use
The PO has decided to pursue a problem. Shape it into a single user-centred story before requirements.

## Inputs
- Problem brief + intake decision.
- Target user / persona context.
- Known assumptions and constraints.

## Steps
1. Draft the story as user → job-to-be-done → value (`As a … I want … so that …`).
2. List the success signals (how we'd know it worked).
3. Capture assumptions and the riskiest one to validate first.
4. Note design-relevant context for the Designer hand-off.

## Output — artifact as proof
Story canvas: user, JTBD, value, success signals, assumptions, riskiest assumption.

## Human gate
PO owns priority and scope; Design owns user understanding. Both confirm the canvas before requirements.

## Guardrails
- AI proposes the canvas; PO + Design commit.
- Do not fabricate personas or usage data — mark unknowns as assumptions to validate.


---
name: assumption-map
description: Separate facts from assumptions, risks, and open validation questions on a story. Invoke during Discovery alongside story-canvas.
stage: Discovery
owner: PO
ai_role: propose
---

# Assumption Map

## When to use
A story canvas exists but is full of implicit beliefs. Run to expose what we actually know vs assume before committing requirements.

## Inputs
- Story canvas.
- Stakeholder claims and notes.
- Any existing data or prior tickets.

## Steps
1. Sort every statement into: fact (evidenced), assumption (unevidenced), or risk.
2. For each assumption, write the validation question and cheapest way to answer it.
3. Rank assumptions by impact-if-wrong.
4. Flag any assumption that, if false, kills the story.

## Output — artifact as proof
Assumption/risk map: facts, assumptions (with validation question + cost), risks, and the kill-switch assumptions.

## Human gate
PO decides which assumptions must be validated before build and which are accepted as bets.

## Guardrails
- AI proposes the classification; humans confirm what counts as a fact.
- Never promote an assumption to a fact without cited evidence.


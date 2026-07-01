---
name: requirements-challenger
description: Adversarially attack draft requirements to find vagueness before they enter build. Invoke at Requirements after ACs are drafted.
stage: Requirements
owner: QA
ai_role: propose
---

# Requirements Challenger

## When to use
ACs exist and feel "done." Run a skeptic pass before Spec Lock to catch fake clarity.

## Inputs
- Draft ACs and worked examples.
- Story canvas + non-goals.

## Steps
1. Hunt for vague terms ("fast", "easy", "should", "etc.") and demand a measurable definition.
2. Find behaviours with no AC (missing path, missing error case).
3. Identify ACs that can't be tested as written.
4. Produce a question list, not rewrites — the PO answers.

## Output — artifact as proof
Ambiguity report: flagged terms, missing cases, untestable ACs, and the clarifying questions to resolve each.

## Human gate
PO answers the questions; QA confirms ambiguities are closed before Spec Lock.

## Guardrails
- AI proposes challenges; humans resolve them.
- The challenger never guesses the intended rule — it asks.


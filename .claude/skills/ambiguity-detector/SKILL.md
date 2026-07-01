---
name: ambiguity-detector
description: Find vague language, hidden assumptions, missing owners and untestable claims in any artifact. The highest-leverage guardrail — invoke at every hand-off.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Ambiguity Detector

## When to use
Before any artifact crosses a hand-off. Run on briefs, ACs, specs, MRs — anything about to be relied on by the next role.

## Inputs
- Any draft artifact.

## Steps
1. Flag vague terms, undefined nouns, and unquantified claims.
2. Surface implicit assumptions and missing owners.
3. Identify statements that can't be tested or verified.
4. Output questions, not rewrites.

## Output — artifact as proof
Ambiguity report: flagged items with the clarifying question for each.

## Human gate
The artifact owner answers the questions before hand-off.

## Guardrails
- AI proposes questions; humans resolve them.
- The detector never guesses the intended meaning — it asks. This is where "AI may not invent business rules" is enforced.


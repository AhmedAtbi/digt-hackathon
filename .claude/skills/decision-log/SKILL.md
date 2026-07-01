---
name: decision-log
description: Capture decisions, rejected alternatives, owner and rationale. Invoke whenever a non-trivial choice is made at any stage.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Decision Log

## When to use
Any time the team makes a choice that future-you will ask "why did we do that?" — scope cuts, contract shapes, build-vs-buy, tradeoffs.

## Inputs
- The decision and the discussion around it.
- Alternatives that were considered.

## Steps
1. State the decision in one line.
2. List alternatives rejected and why.
3. Record the owner and the date/context.
4. Link the artifact the decision affects.

## Output — artifact as proof
Decision log entry: decision, alternatives, rationale, owner, links.

## Human gate
The decision owner confirms the record is accurate.

## Guardrails
- AI drafts the entry; the owner confirms.
- Record the decision as made by a human — AI input is noted as input, not authority.


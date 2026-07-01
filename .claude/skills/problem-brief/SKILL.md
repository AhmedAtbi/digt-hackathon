---
name: problem-brief
description: Turn a raw idea, request or pain point into a crisp problem brief. Invoke at Intake before any solutioning.
stage: Intake
owner: PO
ai_role: propose
---

# Problem Brief

## When to use
A raw request lands (Slack, stakeholder, support, internal pain). Run before anything is shaped — this is the first artifact.

## Inputs
- Raw request text, source, and who raised it.
- Any business context, links, or screenshots provided.
- Current roadmap themes (for relevance, not prioritisation yet).

## Steps
1. Restate the problem in one paragraph: who hurts, what hurts, why it matters now.
2. Extract user, pain, value, and urgency as discrete fields.
3. List what is explicitly **out** of this problem (early non-goals).
4. Surface any unknown that blocks framing as a **question**, not an assumption.

## Output — artifact as proof
A problem brief: `source`, `user`, `pain`, `value`, `urgency`, `early non-goals`, `open questions`. Answers what/why/who-raised and links back to the source.

## Human gate
PO confirms the problem is real and worth shaping (→ hands to `duplicate-and-priority-scan`).

## Guardrails
- AI proposes the framing; the PO commits to pursuing it.
- Do not invent business value numbers — if impact is unknown, mark it a question.


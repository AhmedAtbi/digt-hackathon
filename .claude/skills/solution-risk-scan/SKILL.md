---
name: solution-risk-scan
description: Surface technical, product, UX, data and rollout risks early. Invoke at Solution Shape once UX + contract drafts exist.
stage: Solution Shape
owner: Lead
ai_role: propose
---

# Solution Risk Scan

## When to use
The slice is taking shape (UX + contract). Run before Spec Lock to find what could break it.

## Inputs
- ACs, UX state list, API contract sketch.
- Assumption map + system context.

## Steps
1. Scan five lenses: technical, product, UX, data, rollout/ops.
2. For each risk: likelihood, impact, and a mitigation owner.
3. Flag risks that should shrink the slice rather than be mitigated.
4. Hand the open risks to `risk-register` for tracking.

## Output — artifact as proof
Risk register seed: risks across the five lenses, each with likelihood, impact, mitigation, owner.

## Human gate
Lead decides which risks block build and which are accepted.

## Guardrails
- AI proposes risks; the Lead commits to the accept/mitigate decision.
- Do not downplay data-loss or contract-break risks to keep the slice tidy.


---
name: risk-register
description: Maintain open risks with owners, mitigations and closure evidence across the story. Invoke whenever a risk is raised or resolved.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Risk Register

## When to use
From Solution Shape onward, as the single place risks live until closed. Seeded by `solution-risk-scan`, updated through review/QA/release.

## Inputs
- Risks from any stage (scan, review, QA, exploration).

## Steps
1. Record each risk: description, likelihood, impact, owner.
2. Track status: open / mitigated / accepted / closed (with evidence).
3. Surface risks still open at each gate.
4. Block gates on unresolved high-impact risks.

## Output — artifact as proof
Living risk register: risks with status, owner, mitigation, closure evidence.

## Human gate
Owners commit to mitigate/accept; gates check the register before passing.

## Guardrails
- AI proposes and tracks; humans own accept/mitigate calls.
- A risk can't be closed without evidence; AI doesn't close risks on its own.


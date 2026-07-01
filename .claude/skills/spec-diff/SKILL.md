---
name: spec-diff
description: Compare two versions of a spec or artifact and explain the meaningful changes. Invoke whenever a locked artifact is re-versioned.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Spec Diff

## When to use
A spec/contract/artifact changes after it was relied on. Run so downstream stages know what actually moved (iteration is expected — this keeps it honest).

## Inputs
- The old version and the new version.

## Steps
1. Compute the semantic diff, not just text changes.
2. Classify each change: clarification, scope change, contract change, risk change.
3. Flag changes that invalidate prior review/QA work.
4. Recommend who must re-check.

## Output — artifact as proof
Diff summary: changes by class, downstream impact, who must re-validate.

## Human gate
The artifact owner confirms the diff and triggers any required re-validation.

## Guardrails
- AI proposes the diff and impact; humans decide on re-validation.
- A contract-level change always flags downstream review/QA as stale until re-checked.


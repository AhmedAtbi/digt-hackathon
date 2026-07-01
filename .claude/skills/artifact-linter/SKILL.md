---
name: artifact-linter
description: Check whether an artifact meets its required template and evidence standard. Invoke before accepting any artifact into the trail.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Artifact Linter

## When to use
Whenever an artifact is produced and needs to enter the evidence trail. Keeps the loop honest without manual policing.

## Inputs
- The artifact + its expected template (from `_TEMPLATE.md` or the skill that produced it).

## Steps
1. Check required sections/fields are present and non-empty.
2. Check it answers: what changed, why, who decided, how to replay.
3. Flag placeholder or copy-paste boilerplate.
4. Output pass/fail with the exact missing pieces.

## Output — artifact as proof
Lint result: pass/fail and the list of gaps.

## Human gate
Owner fixes gaps; a human accepts the artifact.

## Guardrails
- AI proposes the lint result; humans accept the artifact.
- A lint pass is necessary, not sufficient — it checks form, humans check truth.


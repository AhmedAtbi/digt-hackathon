---
name: release-readiness-check
description: Verify a story is safe to deploy. Invoke at Release once QA passes and the MR is approved.
stage: Release
owner: BE
ai_role: propose
---

# Release Readiness Check

## When to use
MR approved + QA passed. Confirm deploy safety before triggering the GitLab pipeline.

## Inputs
- MR status + QA evidence.
- Pipeline status and migration list.
- Rollout/rollback considerations.

## Steps
1. Confirm all ACs verified and no blocking defects open.
2. Check migrations are reversible and ordered; confirm env/config needs.
3. Confirm a rollback path exists.
4. Output go/no-go with explicit blockers.

## Output — artifact as proof
Release readiness checklist: AC verification, migration/config check, rollback plan, go/no-go.

## Human gate
PO accepts the value; the engineer owns deploy readiness. Both confirm before launch.

## Guardrails
- AI proposes readiness; humans commit to deploying.
- A missing rollback path defaults to no-go.


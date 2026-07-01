---
name: release-note-writer
description: Draft user-facing and internal release notes plus a rollback note. Invoke at Release once readiness is go.
stage: Release
owner: PO
ai_role: propose
---

# Release Note Writer

## When to use
The story is cleared to ship. Produce the communication artifacts alongside the deploy.

## Inputs
- Locked spec + merged MR.
- QA result + readiness checklist.

## Steps
1. Draft a user-facing note: what changed, who benefits.
2. Draft an internal note: scope, risk, affected systems.
3. Draft the rollback note: how to revert and the signal to revert on.
4. Link the MR, pipeline, and spec for traceability.

## Output — artifact as proof
Release note (user + internal) and rollback note, linked to MR/pipeline/spec.

## Human gate
PO approves the user-facing message; engineer approves the rollback note.

## Guardrails
- AI proposes the wording; humans approve before publishing.
- Do not overstate impact — claims must match what the spec/QA actually verified.


---
name: duplicate-and-priority-scan
description: Check whether a new idea duplicates existing work or conflicts with current priorities. Invoke right after problem-brief.
stage: Intake
owner: PO
ai_role: propose
---

# Duplicate & Priority Scan

## When to use
A problem brief exists and you need an intake decision before investing discovery time.

## Inputs
- The problem brief.
- Backlog / tracker search results (the chosen system of record).
- Current roadmap themes and in-flight epics.

## Steps
1. Search the tracker for overlapping stories, epics, or closed duplicates.
2. Classify overlap: exact duplicate, partial overlap (merge candidate), or net-new.
3. Weigh against current priorities and flag conflicts.
4. Recommend: **pursue / merge / park / reject** with a one-line rationale.

## Output — artifact as proof
Intake decision record: matched items (with links), overlap classification, recommendation, rationale.

## Human gate
PO makes the final pursue/merge/park/reject call. AI only recommends.

## Guardrails
- AI proposes; PO commits to the priority decision.
- Never silently merge — surface the merge candidate and let the PO decide.


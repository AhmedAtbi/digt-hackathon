---
name: implementation-plan
description: Produce a scoped implementation plan before coding begins. Invoke at Build, immediately after the spec is locked.
stage: Build
owner: BE
ai_role: propose
---

# Implementation Plan

## When to use
Spec is locked and an engineer is about to start. Plan the change before generating code.

## Inputs
- Locked story spec.
- Repo/module context (graphify query is the cheap way in).
- Coding conventions.

## Steps
1. List the files/areas to touch and the layer each belongs to.
2. Define the test plan first (what proves each AC).
3. Sequence the work into small reviewable commits.
4. Call out risky edits and where to stop and ask.

## Output — artifact as proof
Build plan: files/areas, layer mapping, test plan, commit sequence, risk notes.

## Human gate
Engineer owns the plan; Lead may sanity-check architecture fit.

## Guardrails
- AI proposes the plan; the engineer commits to it.
- AI may not invent business rules — gaps in the spec become questions, not code.

## Coding standards


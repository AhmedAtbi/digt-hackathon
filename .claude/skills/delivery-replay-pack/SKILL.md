---
name: delivery-replay-pack
description: Assemble the end-to-end evidence trail so one story is replayable on demand. Invoke at Replay — this is the proof condition of the whole loop.
stage: Replay
owner: Lead
ai_role: propose
---

# Delivery Replay Pack

## When to use
A story has shipped through the full loop. Build the artifact that lets leadership replay it and judge the way of working.

## Inputs
- Every prior artifact (brief → spec → dev log → review → QA → release).
- GitLab MR/pipeline links and deployment record.

## Steps
1. Build the timeline: each stage, its artifact, the human who gated it.
2. Use `traceability-map` to link idea → AC → design → code → tests → release.
3. Highlight where AI accelerated and where humans decided.
4. Package as a one-page replay plus drill-down links.

## Output — artifact as proof
Replay pack: stage timeline, artifact map, decision log, proof links — replayable on demand.

## Human gate
Leadership/CIO reviews the pack to endorse the *way of working*, not just the feature.

## Guardrails
- AI assembles from real artifacts; it does not fabricate missing evidence — gaps are shown as gaps.
- The pack reflects what happened, including detours and rollbacks.


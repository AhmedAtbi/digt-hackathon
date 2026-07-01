---
name: traceability-map
description: Link idea → AC → design → code → tests → release into one chain. Invoke when assembling proof or auditing coverage.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Traceability Map

## When to use
When you need to prove (or check) that every requirement made it through to shipped, tested code — feeds the replay pack and catches orphans.

## Inputs
- All stage artifacts for the story.

## Steps
1. Build a row per AC: idea → AC → design state → code change → test → release.
2. Flag broken links (AC with no test, code with no AC).
3. Highlight orphans in both directions.
4. Output the chain as a table.

## Output — artifact as proof
Traceability table: per-AC chain with gaps highlighted.

## Human gate
The Lead reviews gaps and decides if any block release/endorsement.

## Guardrails
- AI proposes the map; humans confirm completeness.
- A broken link is shown as a gap, never silently bridged.


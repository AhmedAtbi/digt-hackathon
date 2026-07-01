---
name: meeting-to-artifact
description: Convert raw meeting notes or a transcript into the correct stage artifact. Invoke instead of writing a per-meeting summary skill.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Meeting to Artifact

## When to use
After any working session (discovery, solution-shape, retro). Replaces ad-hoc "AI summary" — output is always a real stage artifact, not a transcript.

## Inputs
- Raw notes or transcript.
- Which artifact this should become (brief, canvas, ACs, decision log, etc.).

## Steps
1. Identify decisions, requirements, risks, and open questions in the notes.
2. Map them into the target artifact's template.
3. Separate "agreed" from "discussed but undecided."
4. List open questions for follow-up.

## Output — artifact as proof
The target artifact in template form, plus an open-questions list.

## Human gate
Attendees confirm the artifact reflects what was actually agreed.

## Guardrails
- AI proposes the artifact; humans confirm fidelity.
- "Discussed" is never silently promoted to "decided" — undecided items stay open.


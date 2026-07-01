---
name: prompt-capture
description: Record meaningful AI prompts, outputs and human corrections as reusable evidence. Invoke wherever AI is used materially.
stage: Cross-cutting
owner: Any
ai_role: propose
---

# Prompt Capture

## When to use
Any stage where AI did material work (drafting, coding, testing). Builds the "how AI was used" evidence and a reusable prompt library.

## Inputs
- The prompts used and their outputs.
- The human edits/decisions applied.

## Steps
1. Capture the prompt, the model/tool, and the output summary.
2. Note what the human kept, changed, or rejected.
3. Tag prompts worth reusing into the team library.
4. Strip secrets/PII before storing.

## Output — artifact as proof
Prompt/session evidence: prompt → output → human correction, plus reuse tags.

## Human gate
The user of the AI confirms the capture is accurate and safe to store.

## Guardrails
- AI drafts the capture; the human confirms.
- Never store secrets, tokens, or customer PII in captured prompts.


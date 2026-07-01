---
name: dev-session-log
description: Capture what AI was asked to do during build and what the human changed. Invoke at Build to produce the AI-assist evidence trail.
stage: Build
owner: BE
ai_role: propose
---

# Dev Session Log

## When to use
During and after an AI-assisted build session. This is the proof that AI accelerated the work *and* a human stayed in control.

## Inputs
- The prompts given to the AI.
- Generated output and diffs.
- Engineer corrections and decisions.

## Steps
1. Record the meaningful prompts and what each produced.
2. Note where the engineer accepted, edited, or rejected AI output and why.
3. Capture any business-rule question the AI raised instead of guessing.
4. Summarise net human decisions for the MR.

## Output — artifact as proof
AI-assisted development log: prompt→output→human-decision trail (feeds `prompt-capture` and the replay pack).

## Human gate
Engineer owns the final code; the log shows where human judgement overrode AI.

## Guardrails
- AI drafts the log; the engineer confirms it's honest.
- The log must show unknowns surfaced as questions, not silently filled.

## Coding standards


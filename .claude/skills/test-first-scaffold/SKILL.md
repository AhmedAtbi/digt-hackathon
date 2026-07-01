---
name: test-first-scaffold
description: Propose focused tests before or alongside implementation. Invoke at Build to keep the work TDD-first.
stage: Build
owner: BE
ai_role: propose
---

# Test-First Scaffold

## When to use
The implementation plan is set. Write the failing tests before the code so each AC has a guardrail.

## Inputs
- Locked story spec + ACs.
- Implementation plan.
- Existing test patterns in the repo.

## Steps
1. Map each AC to at least one test (happy path + edge).
2. Scaffold deterministic tests: no randomness, freeze time or assert ranges, mock external HTTP.
3. Cover unauthorized, validation errors, and post-failure state.
4. Mark tests that need fixtures or a real DB.

## Output — artifact as proof
Test checklist / skeletons: AC→test mapping, the failing tests to satisfy.

## Human gate
Engineer confirms coverage is sufficient before implementing.

## Guardrails
- AI proposes tests; the engineer owns coverage adequacy.
- Tests assert the spec's behaviour — they do not encode invented rules.

## Coding standards


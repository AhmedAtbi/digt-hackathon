---
name: ux-state-inventory
description: Enumerate every required UI state and interaction path for a story. Invoke at Solution Shape on any story with a UI surface.
stage: Solution Shape
owner: Design
ai_role: propose
---

# UX State Inventory

## When to use
ACs are agreed and the story touches a screen or flow. Run before the API/contract is locked so states drive the contract.

## Inputs
- ACs + worked examples.
- Design notes / target screen or flow.
- Existing component patterns.

## Steps
1. List every state: empty, loading, partial, success, error, permission-denied, offline/timeout.
2. Map the interaction paths between states.
3. Flag states that need data the API must provide.
4. Note reusable components vs net-new.

## Output — artifact as proof
UX state list: each state, its trigger, its copy/needs, and the data it depends on.

## Human gate
Design owns the interaction model; FE confirms the states are buildable.

## Guardrails
- AI proposes states; Design commits.
- Do not omit error/permission states to make the slice look smaller.


---
name: prioritization-subtasks
description: Propose a technical priority, break the story into subtasks, flag dependencies, and estimate. Invoke at Step 5 once the user story is the source of truth, before implementation.
stage: Prioritization
owner: Lead
ai_role: propose
---

# Prioritization & Subtask Breakdown

## When to use
Step 5 of the workflow — after the User Story (Step 4) is signed off as the source of truth and before Implementation (Step 6).

## Inputs
- The locked user story (Description, Acceptance Criteria, Mock-ups, Tech Specs, Test Cases, technical unknowns).
- Current backlog / roadmap and team capacity.

## Steps
1. Propose a technical priority with a one-line rationale for the Engineering lead to confirm.
2. Break the story into implementable subtasks.
3. Flag dependencies and integration points across systems.
4. Estimate story points per subtask (propose; humans confirm).

## Output — artifact as proof
Prioritized backlog item + subtask list + dependency map + effort estimate.

## Human gate
Engineering lead confirms the technical priority and estimate; the PO owns business priority.

## Guardrails
- AI proposes priority, subtasks, and estimates; humans commit them.
- AI may not invent business rules or capacity facts — surface unknowns as questions.


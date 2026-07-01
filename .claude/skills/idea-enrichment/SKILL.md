---
name: agent-enrich
description: Enrich an accepted idea into a precise, testable requirement set — add technical context, identify the systems it touches (ERP, CMS, Sylius, Ergonode, Klaviyo, iPaaS, FE), surface the implicit requirements and edge cases the requester assumed, suggest related epics, and list the open questions a human must answer before a story is written. Step 3 of the delivery lifecycle.
command: enrich
---

# agent-enrich

Step 3 — **Idea Enrichment**. Takes an idea the PO has already accepted
(post `/idea` Go/No-Go) and turns it into an enriched, testable requirement
set the Architect can write a story against. It is the first move of the
refinement stretch the **Architect** owns (steps 3 → 5).

Use it after an idea is accepted. For a raw, unframed idea, run `/idea`
first. When the requirements are already enriched, go straight to `/story`.

## Inputs

- **The accepted-idea ticket** the Analyst created at idea validation — its
  title, problem, expected value, and affected area. This is the handoff
  artifact and your starting context; it already carries enough to begin. If
  no ticket ID is known, ask — do not invent one.
- The discovery brief from `/idea` (`docs/discovery/<slug>.md`), if one
  exists, as supporting reference — not a prompt to re-run discovery.
- The project's stack presets (`.agent/workflow/09-development/stack-presets/`)
  to ground "which systems does this touch".

## Steps

Drive stage 01 — read `.agent/workflow/01-requirement-enrichment/prompt.md`
end-to-end and follow it. As the **Architect**, apply rigorous scrutiny to
surface what's implicit, with a clear eye for blast radius. In short:

1. **Restate** the accepted idea in your own words. List the explicit
   requirements the human stated.
2. **Identify affected systems.** Name the modules, services, and external
   systems the change reaches — ERP, CMS, Sylius, Ergonode, Klaviyo, iPaaS,
   the frontend. Search the codebase; don't guess the boundary.
3. **Surface implicit requirements** against the stage-01 checklist
   (auth/permissions, audit, edge cases, i18n, performance, backward
   compatibility, data migration, observability, rollback). Every one must
   be phrased so it's testable — "should be fast" is a fail.
4. **Suggest related epics / prior art** the requirement connects to, so it
   isn't built in isolation.
5. **List the open questions** as a numbered list. Do **not** answer them
   yourself — they are the human gate.

## Output

Write `docs/requirements/<slug>.md` using
`.agent/workflow/01-requirement-enrichment/templates/requirements.md`. End
the file with the confidence block.

## Human gate

**Soft gate.** You draft the enriched requirements and the open-questions
list; a human (PO + Architect) reads it and answers the open questions
before `/story` runs. Surface the open questions prominently — they are the
point of this step, not a footnote.

## Guardrails

- **No business-rule invention.** Anything not stated by a human is an open
  question, never an asserted requirement.
- **Affected-systems claims must be grounded** in code you actually found.
  If you couldn't confirm a boundary, say so and add it as an open question.
- Stop and ask if the discovery brief is missing and the request is too thin
  to enrich — guessing the problem is worse than asking.

## Confidence

Score per `.agent/workflow/confidence-gates.md`. **Ambiguity** is the
critical dimension here — an untestable requirement poisons every stage
downstream.

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": ""
}
```

## See also

- [`agent-story`](../agent-story/SKILL.md) — the next step: enriched
  requirements → source-of-truth user story + spec + test cases.
- [`../../workflow/01-requirement-enrichment/prompt.md`](../../workflow/01-requirement-enrichment/prompt.md)
  — the canonical stage prompt this skill drives.
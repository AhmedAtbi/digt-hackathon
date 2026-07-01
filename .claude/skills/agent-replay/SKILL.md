---
name: agent-replay
description: Reconstruct a feature's full chain from idea to production. Walks every workflow artifact for one ticket, lists each decision and its owner, flags missing evidence, and writes a replay pack.
command: replay
---

# agent-replay

Assemble the **replay pack** for one ticket: a single document that walks
the delivery chain from discovery to production metrics, so a human can
re-walk it for onboarding, audit, or retro.

Read [../../docs/replay-and-evidence.md](../../docs/replay-and-evidence.md)
for the model this skill implements.

## Inputs

- A ticket ID (e.g. `PMO-7825`). If omitted, ask for one — do not guess.
- The consuming project's `docs/` tree.
- Git history (`git log --grep <TICKET>`).
- `task_provider` from `.agent.local.yaml` (for the provider task + its
  priority/status fields), if configured.

## Steps

1. **Collect.** For the ticket, find each stage artifact by its
   conventional path (see the evidence-trail table in
   `replay-and-evidence.md`): discovery, requirements, story+AC, ADR, spec,
   plan, tasks, demo, runbook, metrics. Then `git log --grep <TICKET>` for
   the branch, commits, and MR reference.
2. **Order.** Lay them out in stage order `00 → 14`. One row per stage.
3. **Extract decisions.** For each gated stage (discovery framing, ADR
   option, UAT release call), pull the *Decided by / on* line. If a gated
   decision has no named owner, flag it.
4. **Check coverage.** Map acceptance criteria → tests. Note any AC with no
   matching test. Pull the confidence-rubric scores from each artifact and
   surface the lowest ones.
5. **Flag gaps.** Any stage with no artifact is listed as **MISSING**, not
   silently skipped. A gap is a finding, not an error.
6. **Link, don't copy.** The pack references artifacts by relative path;
   it does not duplicate their content. It is an index, not an archive.

## Output

Write `docs/replay/<TICKET>.md` with:

- **Summary** — one paragraph: what shipped and why.
- **Chain** — a table, one row per stage: stage · artifact link (or
  MISSING) · one-line takeaway.
- **Decisions** — table: decision · owner · date (or **unattributed**).
- **Coverage** — AC → test mapping; lowest confidence scores along the
  chain.
- **Gaps & risks** — missing artifacts, unattributed decisions, untested
  AC, where reality (stage 14 metrics) diverged from the spec.
- **Replay steps** — the ordered list of artifacts to read to re-walk the
  feature from idea to production.

This skill is **read-only**: it reads artifacts and git history and writes
one new file under `docs/replay/`. It never edits prior artifacts, touches
provider tickets, or changes code.

## Confidence

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": "A replay pack scores `completeness` against how many of the 15 stages have a real artifact; `test_coverage` against how many acceptance criteria map to a named test."
}
```

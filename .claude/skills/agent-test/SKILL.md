---
name: agent-test
description: Drive the testing stage for a ticket — map every acceptance criterion to a named test across the pyramid, design test cases (at spec time) or generate + run them (after implementation), and produce the manual test plan. The short entry into workflow stage 11.
command: test
---

# agent-test

Short entry point into **workflow stage 11 (Testing)**. Adopts the
[QA role](../../roles/qa.md) and follows
`.agent/workflow/11-testing/prompt.md` end-to-end. Use it in either mode:

- **Design mode** (Step 4, before code): map acceptance criteria → test
  cases across the pyramid. Output is the test-case list QA signs off as
  part of the spec — no code yet.
- **Build mode** (Steps 6–7, after implementation): generate the unit /
  integration / API / E2E tests, write the manual test plan, run the suite,
  and report coverage on the diff.

If the mode isn't given, infer it: no implementation diff yet → design
mode; diff present → build mode. State which mode you're in.

## Inputs

- A ticket ID. If omitted, ask — do not guess.
- Story + acceptance criteria (`docs/stories/<TICKET>.md`).
- Tech spec (`docs/specs/<TICKET>.md`), if it exists.
- The implementation diff, in build mode.

## Steps

Follow `.agent/workflow/11-testing/prompt.md`:

1. **Map AC → test type** using `pyramid.md` — most coverage at unit, less
   at integration, fewest at E2E. Every acceptance criterion gets at least
   one named test.
2. **Design mode** stops here: present the test-case table (AC → test type
   → what it asserts) for QA sign-off. Do not write test code.
3. **Build mode** continues: write unit tests (`unit-test-prompt.md`),
   integration tests for boundaries (DB, HTTP, bus, external service), API
   tests for changed endpoints, and E2E only for critical flows
   (`e2e-prompt.md`).
4. **Plan manual testing** for what can't be automated
   (`manual-test-plan.md`).
5. **Run the suite** locally and in CI — each run is a _tool gate_ the
   editor catches. Confirm green.
6. **Report coverage on the changed paths** (not overall).

## Output

- **Design mode**: a test-case table appended to the spec / story, for QA
  sign-off.
- **Build mode**: test files alongside the production code + a manual test
  plan in the MR description.

## Gates

- **Hard gate — QA sign-off** (Step 7): a human QA confirms the tests cover
  the acceptance criteria before the ticket is accepted.
- Running the suite and writing files are _tool gates_ (editor permission
  prompts).

## Confidence

```json
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": "Test coverage must be 4+ before the MR can merge. Score test_coverage against how many acceptance criteria map to a named, passing test on the diff."
}
```

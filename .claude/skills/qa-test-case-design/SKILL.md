name: agent-test-design
description: Drive the test-design stage for a ticket — turn each acceptance criterion into a named, reviewable test case before implementation. Designs Gherkin scenarios across the pyramid, flags untestable criteria, and produces the coverage matrix + manual test plan. The short entry into workflow stage 10 (spec-time testing). Pairs with agent-test, which executes these cases after implementation.
command: test-design
{
"completeness": 0,
"ambiguity": 0,
"risk": 0,
"test_coverage": 0,
"dependencies": 0,
"notes": "Spec-time stage — tests are designed, not yet run. Score test_coverage against how many acceptance criteria map to a named, reviewable test case (a tagged Gherkin scenario in the .feature file). test_coverage reaches 4+ only when every AC has at least one scenario and a coverage matrix exists. Raise ambiguity for any acceptance criterion that is untestable as written and flag it back to the author rather than inventing behavior. Raise risk where a criterion needs negative/boundary coverage that is missing."
}

# Test design (spec time)

Turn the ticket's user story + acceptance criteria into **Gherkin `.feature` files** plus a **coverage matrix** that a human reviews before any code is written. The Gherkin output is the contract the `agent-test` stage executes later — so do not write throwaway prose test cases here; write the scenarios that will become the automated tests.

## Steps

1. **Read the ticket.** Capture the issue key (e.g. `PROJ-412`), the user story, and every acceptance criterion. Number them AC1, AC2, …
2. **Vet the criteria.** If a criterion has no observable outcome ("should be fast", "be secure"), it isn't testable. Propose a concrete rewording, raise `ambiguity`, and confirm with the author before designing against it. Catching under-specified criteria is core value of this stage.
3. **Design scenarios** in Gherkin, one `.feature` per ticket, following the tagging contract and conventions below. One positive scenario per AC plus the relevant negative / boundary cases.
4. **Build the coverage matrix** — a table mapping each AC → scenario → tier. This is the review artifact.
5. **Score** the rubric per the notes above and report the test_coverage number with the matrix.

## Tagging contract (shared with agent-test)

Every scenario carries tags; this is how traceability and pipeline tiers survive into execution.

- `@<ISSUE-KEY>` (feature level) — links to the ticket.
- `@AC1`, `@AC2`, … — which acceptance criterion the scenario verifies.
- Exactly one tier: `@smoke` (critical happy path, runs on every change pre-deploy — keep minimal) or `@regression` (negatives/boundaries, runs nightly / pre-stage).
- Optional `@p1`/`@p2`/`@p3` priority.
- `@wip` — designed but not ready to automate; agent-test skips these and they do NOT count toward test_coverage.

## Gherkin conventions

Follow these so the scenarios read cleanly for reviewers AND stay reusable when agent-test implements them.

**Write declarative steps — intent and outcome, not UI mechanics.** This keeps scenarios stable when the UI changes, because selectors live in the step definitions later, not here.

```gherkin
# GOOD — describes intent
When the customer adds the "Pro" plan to their cart
Then the cart total shows "$49.00"

# BAD — bakes in selectors, breaks on any UI change
When I click "#plan-pro"
And I click ".add-to-cart"
Then ".cart-total" has text "$49.00"
```

**Reuse a shared vocabulary.** Phrase common actions identically across tickets so one step definition serves many features. Prefer established phrases over synonyms (don't mix "logs in" / "signs in" / "authenticates"). Common reusable steps:

- `Given a logged-in <role>`
- `When the user navigates to the "<page>" page`
- `Then a confirmation message "<text>" is shown`
- `Then an error message "<text>" is shown`

**One behavior per scenario.** Many unrelated `Then`s usually means it's two scenarios. Small, focused scenarios are easier to review, debug, and tier.

**Use `Background` for shared preconditions** and `Scenario Outline` + `Examples` for the same flow across multiple inputs — never copy-paste near-identical scenarios.

## Avoid duplication at design time

One happy-path scenario per AC; use a `Scenario Outline` with `Examples` for data variations instead of near-identical scenarios; push shared preconditions into `Background`; if one flow legitimately verifies two criteria, tag it `@AC1 @AC2` rather than duplicating. Over-testing inflates later run time. Flag in the matrix any AC covered by 3+ scenarios as a consolidation candidate.

## Worked example

This shows the full transformation the skill performs: ticket in → flagged criteria + `.feature` + matrix out.

name: agent-test-design
description: Drive the test-design stage for a ticket — turn each acceptance criterion into a named, reviewable test case before implementation. Designs Gherkin scenarios across the pyramid, flags untestable criteria, and produces the coverage matrix + manual test plan. The short entry into workflow stage 10 (spec-time testing). Pairs with agent-test, which executes these cases after implementation.
command: test-design
{
"completeness": 0,
"ambiguity": 0,
"risk": 0,
"test_coverage": 0,
"dependencies": 0,
"notes": "Spec-time stage — tests are designed, not yet run. Score test_coverage against how many acceptance criteria map to a named, reviewable test case (a tagged Gherkin scenario in the .feature file). test_coverage reaches 4+ only when every AC has at least one scenario and a coverage matrix exists. Raise ambiguity for any acceptance criterion that is untestable as written and flag it back to the author rather than inventing behavior. Raise risk where a criterion needs negative/boundary coverage that is missing."
}

# Test design (spec time)

Turn the ticket's user story + acceptance criteria into **Gherkin `.feature` files** plus a **coverage matrix** that a human reviews before any code is written. The Gherkin output is the contract the `agent-test` stage executes later — so do not write throwaway prose test cases here; write the scenarios that will become the automated tests.

## Steps

1. **Read the ticket.** Capture the issue key (e.g. `PROJ-412`), the user story, and every acceptance criterion. Number them AC1, AC2, …
2. **Vet the criteria.** If a criterion has no observable outcome ("should be fast", "be secure"), it isn't testable. Propose a concrete rewording, raise `ambiguity`, and confirm with the author before designing against it. Catching under-specified criteria is core value of this stage.
3. **Design scenarios** in Gherkin, one `.feature` per ticket, following the tagging contract and conventions below. One positive scenario per AC plus the relevant negative / boundary cases.
4. **Build the coverage matrix** — a table mapping each AC → scenario → tier. This is the review artifact.
5. **Score** the rubric per the notes above and report the test_coverage number with the matrix.

## Tagging contract (shared with agent-test)

Every scenario carries tags; this is how traceability and pipeline tiers survive into execution.

- `@<ISSUE-KEY>` (feature level) — links to the ticket.
- `@AC1`, `@AC2`, … — which acceptance criterion the scenario verifies.
- Exactly one tier: `@smoke` (critical happy path, runs on every change pre-deploy — keep minimal) or `@regression` (negatives/boundaries, runs nightly / pre-stage).
- Optional `@p1`/`@p2`/`@p3` priority.
- `@wip` — designed but not ready to automate; agent-test skips these and they do NOT count toward test_coverage.

## Gherkin conventions

Follow these so the scenarios read cleanly for reviewers AND stay reusable when agent-test implements them.

**Write declarative steps — intent and outcome, not UI mechanics.** This keeps scenarios stable when the UI changes, because selectors live in the step definitions later, not here.

```gherkin
# GOOD — describes intent
When the customer adds the "Pro" plan to their cart
Then the cart total shows "$49.00"

# BAD — bakes in selectors, breaks on any UI change
When I click "#plan-pro"
And I click ".add-to-cart"
Then ".cart-total" has text "$49.00"
```

**Reuse a shared vocabulary.** Phrase common actions identically across tickets so one step definition serves many features. Prefer established phrases over synonyms (don't mix "logs in" / "signs in" / "authenticates"). Common reusable steps:

- `Given a logged-in <role>`
- `When the user navigates to the "<page>" page`
- `Then a confirmation message "<text>" is shown`
- `Then an error message "<text>" is shown`

**One behavior per scenario.** Many unrelated `Then`s usually means it's two scenarios. Small, focused scenarios are easier to review, debug, and tier.

**Use `Background` for shared preconditions** and `Scenario Outline` + `Examples` for the same flow across multiple inputs — never copy-paste near-identical scenarios.

## Avoid duplication at design time

One happy-path scenario per AC; use a `Scenario Outline` with `Examples` for data variations instead of near-identical scenarios; push shared preconditions into `Background`; if one flow legitimately verifies two criteria, tag it `@AC1 @AC2` rather than duplicating. Over-testing inflates later run time. Flag in the matrix any AC covered by 3+ scenarios as a consolidation candidate.

## Worked example

This shows the full transformation the skill performs: ticket in → flagged criteria + `.feature` + matrix out.

### Input (from the ticket)

```
PROJ-412  "Reset password via email"

As a registered user, I want to reset my password via an email link
so that I can regain access if I forget it.

AC1: Entering a registered email sends a reset link and shows a confirmation.
AC2: Entering an unregistered or malformed email shows the SAME generic
     confirmation (no hint about whether the account exists).
AC3: The reset link expires 60 minutes after it is sent.
AC4: The reset flow should be secure.
```

### First, flag the weak criterion (raise `ambiguity`)

> ⚠️ **AC4 "should be secure" is not testable as written** — no observable outcome. Proposed concrete rewording: *"A reset link can only be used once; reusing a consumed link shows an error."* Confirm before designing against it.

Do not silently invent tests for a vague criterion — surface it and get agreement first.

### Output — `PROJ-412.feature`

```gherkin
@PROJ-412
Feature: Reset password via email

  As a registered user
  I want to reset my password via an email link
  So that I can regain access if I forget it

  Background:
    Given the user is on the "Forgot password" page

  @AC1 @smoke @p1
  Scenario: Registered email receives a reset link
    When the user requests a reset for "alice@example.com"
    Then a confirmation message "Check your email for a reset link" is shown
    And a reset email is sent to "alice@example.com"

  @AC2 @regression @p1
  Scenario Outline: Unregistered or malformed emails show the same confirmation
    When the user requests a reset for "<email>"
    Then a confirmation message "Check your email for a reset link" is shown
    And no reset email is sent

    Examples:
      | email               |
      | nobody@example.com  |
      | not-an-email        |
      |                     |

  @AC3 @regression @p2
  Scenario: A reset link expires after 60 minutes
    Given a reset link was sent to "alice@example.com" 61 minutes ago
    When the user opens the reset link
    Then an error message "This reset link has expired" is shown

  @AC4 @regression @p2
  Scenario: A reset link can only be used once
    Given a reset link was sent to "alice@example.com"
    And the user has already reset their password with that link
    When the user opens the reset link again
    Then an error message "This reset link has already been used" is shown
```

### Output — `PROJ-412-coverage-matrix.md`

```markdown
# Coverage Matrix — PROJ-412: Reset password via email
### Input (from the ticket)

```
PROJ-412  "Reset password via email"

As a registered user, I want to reset my password via an email link
so that I can regain access if I forget it.

AC1: Entering a registered email sends a reset link and shows a confirmation.
AC2: Entering an unregistered or malformed email shows the SAME generic
confirmation (no hint about whether the account exists).
AC3: The reset link expires 60 minutes after it is sent.
AC4: The reset flow should be secure.
```

### First, flag the weak criterion (raise `ambiguity`)

> ⚠️ **AC4 "should be secure" is not testable as written** — no observable outcome. Proposed concrete rewording: *"A reset link can only be used once; reusing a consumed link shows an error."* Confirm before designing against it.

Do not silently invent tests for a vague criterion — surface it and get agreement first.

### Output — `PROJ-412.feature`

```gherkin
@PROJ-412
Feature: Reset password via email

  As a registered user
  I want to reset my password via an email link
  So that I can regain access if I forget it

  Background:
    Given the user is on the "Forgot password" page

  @AC1 @smoke @p1
  Scenario: Registered email receives a reset link
    When the user requests a reset for "alice@example.com"
    Then a confirmation message "Check your email for a reset link" is shown
    And a reset email is sent to "alice@example.com"

  @AC2 @regression @p1
  Scenario Outline: Unregistered or malformed emails show the same confirmation
    When the user requests a reset for "<email>"
    Then a confirmation message "Check your email for a reset link" is shown
    And no reset email is sent

    Examples:
      | email               |
      | nobody@example.com  |
      | not-an-email        |
      |                     |

  @AC3 @regression @p2
  Scenario: A reset link expires after 60 minutes
    Given a reset link was sent to "alice@example.com" 61 minutes ago
    When the user opens the reset link
    Then an error message "This reset link has expired" is shown

  @AC4 @regression @p2
  Scenario: A reset link can only be used once
    Given a reset link was sent to "alice@example.com"
    And the user has already reset their password with that link
    When the user opens the reset link again
    Then an error message "This reset link has already been used" is shown
```

### Output — `PROJ-412-coverage-matrix.md`

```markdown
# Coverage Matrix — PROJ-412: Reset password via email

## Acceptance criteria
- AC1 — Registered email sends a reset link + confirmation.
- AC2 — Unregistered/malformed email shows the same generic confirmation.
- AC3 — Reset link expires 60 minutes after sending.
- AC4 — (reworded) A reset link can only be used once.

## Coverage
| AC  | Scenario                                             | Type     | Tier        | Priority | Notes |
|-----|------------------------------------------------------|----------|-------------|----------|-------|
| AC1 | Registered email receives a reset link               | Positive | @smoke      | p1       | Critical path |
| AC2 | Unregistered or malformed emails show same confirmation | Negative | @regression | p1    | 3 inputs via Examples; anti-enumeration |
| AC3 | A reset link expires after 60 minutes                | Boundary | @regression | p2       | 60-min limit |
| AC4 | A reset link can only be used once                   | Security | @regression | p2       | Reworded from vague "be secure" |

## Review flags
- Uncovered criteria: none.
- Over-covered criteria (3+ scenarios): none.
- Weak / reworded criteria: AC4 — original "should be secure" → "link can only be used once" (confirmed with author).

## Smoke set (runs on every change pre-deploy)
- Registered email receives a reset link
```

### Why this example is correct

Every AC maps to at least one tagged scenario (test_coverage = 4+). The weak AC4 was flagged and reworded rather than guessed. AC2's three input variants use one `Scenario Outline` instead of three scenarios. Only the single critical happy path is `@smoke`; everything else is `@regression`, keeping the pre-deploy gate fast. Steps are declarative, so agent-test can implement them without the scenarios churning on UI changes.

## Output

- `<ISSUE-KEY>.feature` — tagged Gherkin scenarios.
- `<ISSUE-KEY>-coverage-matrix.md` — AC → scenario → tier mapping, plus a "smoke set" list and any flagged weak criteria.

## Self-check

Every AC appears in at least one scenario's tags; every scenario has an issue-key tag, ≥1 `@AC` tag, and exactly one tier; the `@smoke` set is minimal; steps are declarative (intent, not selectors) so they stay stable and reusable; weak criteria are flagged (not guessed); the matrix matches the feature file.

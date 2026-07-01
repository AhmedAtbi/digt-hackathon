name: agent-test
description: Drive the testing stage for a ticket after implementation — generate Cypress tests from the approved Gherkin .feature files, run them on the diff, and confirm every acceptance criterion maps to a named, passing test. Wires the smoke gate into GitLab CI before deploy to dev/stage. The short entry into workflow stage 11. Pairs with agent-test-design, which produced the .feature files at spec time.
command: cy-test
{
"completeness": 0,
"ambiguity": 0,
"risk": 0,
"test_coverage": 0,
"dependencies": 0,
"notes": "Test coverage must be 4+ before the MR can merge. Score test_coverage against how many acceptance criteria map to a named, passing test on the diff. A designed-but-skipped (@wip) scenario does NOT count as covered. Raise risk if a critical path lacks a passing @smoke test, or if tests are flaky/non-deterministic. Raise dependencies if the suite needs unavailable services (app under test, seed/API hooks, test credentials)."
}

# Testing (after implementation)

Execute the **approved `.feature` files** from the `agent-test-design` stage as runnable **Cypress** tests and wire them into **GitLab CI**. Do not rewrite the scenarios — implement the step definitions underneath them. The shared Gherkin contract is what lets the same designed cases run as automated tests with no rework.

## Steps

1. **Confirm inputs.** You need the approved `.feature` file(s) and access to the implemented app (base URL, test credentials, seed/API hooks). If feature files are missing, return to `test-design` rather than inventing scenarios. Raise `dependencies` if anything required is unavailable.
2. **Set up the harness** if not present — Cypress + `@badeball/cypress-cucumber-preprocessor` (see Setup below). Verify `npx cypress run` works on an example feature first.
3. **Implement step definitions**, reusing shared steps wherever wording matches. Keep selectors/URLs in step definitions and custom commands, never in the `.feature` files.
4. **Apply dedup + coverage rules**: programmatic login via `cy.session`, API seeding instead of UI setup, `Background`/shared steps, no redundant flows.
5. **Wire the pipeline**: `@smoke` runs on every change as the pre-deploy gate; full suite (`not @wip`) runs nightly / pre-stage. Deploy jobs `needs:` the smoke job.
6. **Run, stabilize, score.** Run on the diff, fix flakiness, confirm every non-`@wip` scenario passes, then score test_coverage per the notes above.

## Tagging contract (shared with agent-test-design)

`@<ISSUE-KEY>` → ticket; `@AC1`/`@AC2` → acceptance criterion; `@smoke` vs `@regression` → tier; `@wip` → skipped. These tags carry into the test report, so a failing test points straight back to the ticket and the criterion. Do not strip them — they are how test_coverage is scored against the diff.

## Setup (once per repo)

Use the maintained preprocessor `@badeball/cypress-cucumber-preprocessor` (the old `cypress-cucumber-preprocessor` is deprecated).

```bash
npm install -D cypress \
  @badeball/cypress-cucumber-preprocessor \
  @bahmutov/cypress-esbuild-preprocessor esbuild
```

`cypress.config.js`:

```js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.feature",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config; // must return config so env (grepTags) propagates
    },
  },
});
```

`package.json` — tell the preprocessor where steps live and enable tag filtering:

```jsonc
{
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": [
      "cypress/e2e/step_definitions/**/*.{js,ts}",
      "cypress/support/step_definitions/**/*.{js,ts}"
name: agent-test
description: Drive the testing stage for a ticket after implementation — generate Cypress tests from the approved Gherkin .feature files, run them on the diff, and confirm every acceptance criterion maps to a named, passing test. Wires the smoke gate into GitLab CI before deploy to dev/stage. The short entry into workflow stage 11. Pairs with agent-test-design, which produced the .feature files at spec time.
command: cy-test
{
  "completeness": 0,
  "ambiguity": 0,
  "risk": 0,
  "test_coverage": 0,
  "dependencies": 0,
  "notes": "Test coverage must be 4+ before the MR can merge. Score test_coverage against how many acceptance criteria map to a named, passing test on the diff. A designed-but-skipped (@wip) scenario does NOT count as covered. Raise risk if a critical path lacks a passing @smoke test, or if tests are flaky/non-deterministic. Raise dependencies if the suite needs unavailable services (app under test, seed/API hooks, test credentials)."
}

# Testing (after implementation)

Execute the **approved `.feature` files** from the `agent-test-design` stage as runnable **Cypress** tests and wire them into **GitLab CI**. Do not rewrite the scenarios — implement the step definitions underneath them. The shared Gherkin contract is what lets the same designed cases run as automated tests with no rework.

## Steps

1. **Confirm inputs.** You need the approved `.feature` file(s) and access to the implemented app (base URL, test credentials, seed/API hooks). If feature files are missing, return to `test-design` rather than inventing scenarios. Raise `dependencies` if anything required is unavailable.
2. **Set up the harness** if not present — Cypress + `@badeball/cypress-cucumber-preprocessor` (see Setup below). Verify `npx cypress run` works on an example feature first.
3. **Implement step definitions**, reusing shared steps wherever wording matches. Keep selectors/URLs in step definitions and custom commands, never in the `.feature` files.
4. **Apply dedup + coverage rules**: programmatic login via `cy.session`, API seeding instead of UI setup, `Background`/shared steps, no redundant flows.
5. **Wire the pipeline**: `@smoke` runs on every change as the pre-deploy gate; full suite (`not @wip`) runs nightly / pre-stage. Deploy jobs `needs:` the smoke job.
6. **Run, stabilize, score.** Run on the diff, fix flakiness, confirm every non-`@wip` scenario passes, then score test_coverage per the notes above.

## Tagging contract (shared with agent-test-design)

`@<ISSUE-KEY>` → ticket; `@AC1`/`@AC2` → acceptance criterion; `@smoke` vs `@regression` → tier; `@wip` → skipped. These tags carry into the test report, so a failing test points straight back to the ticket and the criterion. Do not strip them — they are how test_coverage is scored against the diff.

## Setup (once per repo)

Use the maintained preprocessor `@badeball/cypress-cucumber-preprocessor` (the old `cypress-cucumber-preprocessor` is deprecated).

```bash
npm install -D cypress \
  @badeball/cypress-cucumber-preprocessor \
  @bahmutov/cypress-esbuild-preprocessor esbuild
```

`cypress.config.js`:

```js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin =
  require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.feature",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config; // must return config so env (grepTags) propagates
    },
  },
});
```

`package.json` — tell the preprocessor where steps live and enable tag filtering:

```jsonc
{
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": [
      "cypress/e2e/step_definitions/**/*.{js,ts}",
      "cypress/support/step_definitions/**/*.{js,ts}"
    ],
    "filterSpecs": true,
    "omitFiltered": true
  }
}
```

Run a tier by passing a tag expression:

```bash
npx cypress run --env grepTags=@smoke          # pre-deploy gate
npx cypress run --env grepTags="not @wip"      # full suite, nightly / pre-stage
```

Repo layout:

```
cypress/
  e2e/
    PROJ-412.feature                 # approved feature from test-design
    step_definitions/
      common.steps.js                # shared vocabulary (login, messages, nav)
      proj-412.steps.js              # steps unique to this ticket
  support/
    commands.js                      # custom commands (cy.apiLogin, cy.seed)
cypress.config.js
```

## Implementing step definitions

Reuse shared steps for anything in the common vocabulary; write only the genuinely new steps per ticket. Keep selectors/URLs here, never in the `.feature`. Prefer stable `data-cy` attributes over CSS/text selectors.

```js
// common.steps.js — reused across every feature
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("a logged-in {word}", (role) => {
  cy.apiLogin(role); // fast session login, NOT the login UI
});
Then("a confirmation message {string} is shown", (text) => {
  cy.contains('[data-cy="toast"]', text).should("be.visible");
});
Then("an error message {string} is shown", (text) => {
  cy.contains('[data-cy="error"]', text).should("be.visible");
});
```

```js
// commands.js — bypass slow UI flows
Cypress.Commands.add("apiLogin", (role) => {
  const creds = Cypress.env("users")[role];
  cy.session(role, () => {                 // cached for the whole run
    cy.request("POST", "/api/login", creds).then(({ body }) => {
      window.localStorage.setItem("token", body.token);
    });
  });
});
Cypress.Commands.add("seed", (fixture) => {
  cy.request("POST", "/api/test/seed", fixture);   // seed via API, not UI
});
```

**Anti-flake:** assert on state, never `cy.wait(ms)` — use `cy.intercept` + `cy.wait('@alias')`; make each scenario self-contained (seed its own data, no cross-scenario order dependence); let Cypress retry assertions by asserting the end state.

## Worked example

Given this approved feature from test-design:

```gherkin
@PROJ-412
    ],
    "filterSpecs": true,
    "omitFiltered": true
  }
}
```

Run a tier by passing a tag expression:

```bash
npx cypress run --env grepTags=@smoke          # pre-deploy gate
npx cypress run --env grepTags="not @wip"      # full suite, nightly / pre-stage
```

Repo layout:

```
cypress/
  e2e/
    PROJ-412.feature                 # approved feature from test-design
    step_definitions/
      common.steps.js                # shared vocabulary (login, messages, nav)
      proj-412.steps.js              # steps unique to this ticket
  support/
    commands.js                      # custom commands (cy.apiLogin, cy.seed)
cypress.config.js
```

## Implementing step definitions

Reuse shared steps for anything in the common vocabulary; write only the genuinely new steps per ticket. Keep selectors/URLs here, never in the `.feature`. Prefer stable `data-cy` attributes over CSS/text selectors.

```js
// common.steps.js — reused across every feature
import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("a logged-in {word}", (role) => {
  cy.apiLogin(role); // fast session login, NOT the login UI
});
Then("a confirmation message {string} is shown", (text) => {
  cy.contains('[data-cy="toast"]', text).should("be.visible");
});
Then("an error message {string} is shown", (text) => {
  cy.contains('[data-cy="error"]', text).should("be.visible");
});
```

```js
// commands.js — bypass slow UI flows
Cypress.Commands.add("apiLogin", (role) => {
  const creds = Cypress.env("users")[role];
  cy.session(role, () => {                 // cached for the whole run
    cy.request("POST", "/api/login", creds).then(({ body }) => {
      window.localStorage.setItem("token", body.token);
    });
  });
});
Cypress.Commands.add("seed", (fixture) => {
  cy.request("POST", "/api/test/seed", fixture);   // seed via API, not UI
});
```

**Anti-flake:** assert on state, never `cy.wait(ms)` — use `cy.intercept` + `cy.wait('@alias')`; make each scenario self-contained (seed its own data, no cross-scenario order dependence); let Cypress retry assertions by asserting the end state.

## Worked example

Given this approved feature from test-design:

```gherkin
@PROJ-412
Feature: Reset password via email

  Background:
    Given the user is on the "Forgot password" page

  @AC1 @smoke @p1
  Scenario: Registered email receives a reset link
    When the user requests a reset for "alice@example.com"
    Then a confirmation message "Check your email for a reset link" is shown
    And a reset email is sent to "alice@example.com"

  @AC3 @regression @p2
  Scenario: A reset link expires after 60 minutes
    Given a reset link was sent to "alice@example.com" 61 minutes ago
    When the user opens the reset link
    Then an error message "This reset link has expired" is shown
```

Implement only the new steps (`a confirmation message ...` and `an error message ...` are already shared):

```js
// proj-412.steps.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the {string} page', () => {
  cy.visit("/forgot-password");
});
When('the user requests a reset for {string}', (email) => {
  cy.get('[data-cy="email"]').clear().type(email);
  cy.get('[data-cy="submit"]').click();
});
// Time-dependent case: backdate the token via API — never wait 61 real minutes.
Given('a reset link was sent to {string} {int} minutes ago', (email, mins) => {
  cy.seed({ resetToken: { email, ageMinutes: mins } });
});
When('the user opens the reset link', () => {
  cy.request("/api/test/last-reset-link?to=alice@example.com")
    .its("body.url").then((url) => cy.visit(url));
});
Then('a reset email is sent to {string}', (email) => {
  cy.request(`/api/test/last-email?to=${email}`)
    .its("body.subject").should("contain", "Reset your password");
});
```

Why this is correct: the two `Then` message steps are reused from `common.steps.js` (no duplicate definitions); the 61-minute case is seeded via API so it's instant and deterministic; selectors are `data-cy`, kept out of the `.feature`; the `@PROJ-412`/`@AC` tags survive into the report so a failure points back to the ticket and criterion.

## GitLab CI

Fast `@smoke` gate on every change; full suite on a schedule / before stage. Deploy jobs `needs:` the test job, so a red gate blocks the deploy.

```yaml
stages: [test, deploy]

cache:
  key:
    files: [package-lock.json]
  paths: [.npm/, cache/Cypress]

smoke:                                   # every push / MR — fast gate
  stage: test
  image: cypress/included:13.6.0
  variables: { CYPRESS_BASE_URL: "http://localhost:3000" }
  script:
    - npm ci
    - npm run start:ci &
    - npx wait-on http://localhost:3000
    - npx cypress run --env grepTags=@smoke
  artifacts:
    when: on_failure
Feature: Reset password via email

  Background:
    Given the user is on the "Forgot password" page

  @AC1 @smoke @p1
  Scenario: Registered email receives a reset link
    When the user requests a reset for "alice@example.com"
    Then a confirmation message "Check your email for a reset link" is shown
    And a reset email is sent to "alice@example.com"

  @AC3 @regression @p2
  Scenario: A reset link expires after 60 minutes
    Given a reset link was sent to "alice@example.com" 61 minutes ago
    When the user opens the reset link
    Then an error message "This reset link has expired" is shown
```

Implement only the new steps (`a confirmation message ...` and `an error message ...` are already shared):

```js
// proj-412.steps.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the {string} page', () => {
  cy.visit("/forgot-password");
});
When('the user requests a reset for {string}', (email) => {
  cy.get('[data-cy="email"]').clear().type(email);
  cy.get('[data-cy="submit"]').click();
});
// Time-dependent case: backdate the token via API — never wait 61 real minutes.
Given('a reset link was sent to {string} {int} minutes ago', (email, mins) => {
  cy.seed({ resetToken: { email, ageMinutes: mins } });
});
When('the user opens the reset link', () => {
  cy.request("/api/test/last-reset-link?to=alice@example.com")
    .its("body.url").then((url) => cy.visit(url));
});
Then('a reset email is sent to {string}', (email) => {
  cy.request(`/api/test/last-email?to=${email}`)
    .its("body.subject").should("contain", "Reset your password");
});
```

Why this is correct: the two `Then` message steps are reused from `common.steps.js` (no duplicate definitions); the 61-minute case is seeded via API so it's instant and deterministic; selectors are `data-cy`, kept out of the `.feature`; the `@PROJ-412`/`@AC` tags survive into the report so a failure points back to the ticket and criterion.

## GitLab CI

Fast `@smoke` gate on every change; full suite on a schedule / before stage. Deploy jobs `needs:` the test job, so a red gate blocks the deploy.

```yaml
stages: [test, deploy]

cache:
  key:
    files: [package-lock.json]
  paths: [.npm/, cache/Cypress]

smoke:                                   # every push / MR — fast gate
  stage: test
  image: cypress/included:13.6.0
  variables: { CYPRESS_BASE_URL: "http://localhost:3000" }
  script:
    - npm ci
    - npm run start:ci &
    - npx wait-on http://localhost:3000
    - npx cypress run --env grepTags=@smoke
  artifacts:
    when: on_failure
    paths: [cypress/screenshots, cypress/videos]
    expire_in: 1 week

regression:                              # nightly schedule / before stage
  stage: test
  image: cypress/included:13.6.0
  variables: { CYPRESS_BASE_URL: "http://localhost:3000" }
  script:
    - npm ci
    - npm run start:ci &
    - npx wait-on http://localhost:3000
    - npx cypress run --env grepTags="not @wip"
  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
    - if: '$CI_COMMIT_BRANCH == "stage"'

deploy_dev:
  stage: deploy
  script: [echo "deploy to dev"]
  needs: ["smoke"]                       # deploy only if smoke passed
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

deploy_stage:
  stage: deploy
  script: [echo "deploy to stage"]
  needs: ["smoke", "regression"]         # stage requires full suite green
  rules:
    - if: '$CI_COMMIT_BRANCH == "stage"'
```

Notes: replace `npm run start:ci` + `wait-on` with however you boot the app under test (or point `CYPRESS_BASE_URL` at a deployed dev/ephemeral env). Set up the nightly `regression` run under CI/CD → Schedules. Keep test credentials / `CYPRESS_BASE_URL` in GitLab CI/CD variables. When the full suite grows, split specs across parallel runners to bound wall-clock time.

## Keep the pipeline fast & non-duplicative

Run `@smoke` only on the per-commit gate; run the full suite on a schedule. One reusable step definition per distinct phrase (align wording to existing steps rather than adding synonyms). Bypass slow setup (session login, API seeding). Test each flow once at the right tier — regression adds edges, it doesn't repeat the happy path. If implementation reveals a missing case, add the scenario to the `.feature` with proper `@AC`/tier tags and update the coverage matrix, so coverage stays traceable rather than buried in code.

## Self-check before merge

Every non-`@wip` scenario has a matching step definition and passes on the diff; no `.feature` step contains a raw selector/URL; login and seeding are programmatic; `@smoke` runs as the pre-deploy gate and is fast; reused steps are genuinely shared; `@<ISSUE-KEY>`/`@AC` tags survive into reports; the GitLab job is green and blocks deploy on smoke failure; test_coverage scored ≥ 4 only if every AC maps to a passing test.

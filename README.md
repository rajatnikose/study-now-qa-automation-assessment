# Study Now — QA Engineering (Automations) Assessment

Playwright + JavaScript automation suite for the Study Now assessment.

## Scope

This repository covers both parts of the assessment:

- **Part 1 — Build:** Conduit end-to-end and REST API automation.
- **Part 2 — Think:** GSP workflow, permissions, configuration-change and stability strategy.

The assessment asks for Playwright or Cypress with JavaScript/TypeScript, independent tests, API-based data setup, an authorization test, CI on every push, reporting, and a concise README. The implementation intentionally keeps the suite small and focused on meaningful assertions.

## Application under test

- Web: `https://conduit.bondaracademy.com`
- API: `https://conduit-api.bondaracademy.com/api`

The Conduit demo is an Angular SPA backed by a REST API. The API uses the RealWorld-style `/users`, `/users/login`, `/articles` and `/articles/:slug` endpoints.

## Project structure

```text
.
├── .github/workflows/playwright.yml
├── docs/
│   └── gsp-strategy.md
├── fixtures/
│   └── test-fixtures.js
├── pages/
│   ├── ArticlePage.js
│   ├── AuthPage.js
│   └── EditorPage.js
├── tests/
│   ├── api/
│   │   ├── article-crud.api.spec.js
│   │   └── authorization.api.spec.js
│   └── e2e/
│       ├── article-lifecycle.spec.js
│       ├── auth.spec.js
│       └── permissions.spec.js
├── utils/
│   ├── api-client.js
│   └── test-data.js
├── playwright.config.js
├── package.json
└── README.md
```

## Requirements

- Node.js 20+
- npm 10+
- Network access to the Conduit demo/API

## Install

```bash
npm install
npx playwright install chromium
```


## Run all tests

```bash
npm test
```

## Run only UI/E2E tests

```bash
npm run test:e2e
```

## Run only API tests

```bash
npm run test:api
```

## Debug locally

```bash
npm run test:headed
npm run test:debug
```

## HTML report

```bash
npm run report
```

The CI workflow uploads the Playwright HTML report as a GitHub Actions artifact.

## Environment overrides

The defaults target the assessment's Conduit environment. They can be overridden without changing source code:

```bash
BASE_URL=https://conduit.bondaracademy.com \
API_URL=https://conduit-api.bondaracademy.com/api \
npm test
```

No credentials or secrets are committed to this repository.

## Test design

### E2E authentication

- UI registration with a unique user.
- API registration followed by UI login for repeatable setup.

### E2E article lifecycle

The main journey is:

```text
API user setup
    ↓
UI sign-in
    ↓
Create article through UI
    ↓
Verify title/body
    ↓
Edit article through UI
    ↓
Verify updated UI state + API payload
    ↓
Delete article through UI
    ↓
Verify API returns 404
```

The test deliberately captures the article slug after editing because changing an article title can change its slug.

### Authorization

Two users are created through the API. User A owns an article. User B:

- cannot see Edit/Delete controls in the UI;
- receives `403` when attempting to update the article through the API;
- receives `403` when attempting to delete the article through the API;
- cannot change the article's persisted content.

This tests authorization at both the presentation and API boundary.

### API CRUD

The API test registers a fresh user and then performs:

```text
POST /users
POST /articles
GET /articles/:slug
PUT /articles/:slug
DELETE /articles/:slug
GET /articles/:slug → 404
```

Assertions cover status codes and important response payload fields.

## Why there are no hard-coded sleeps

The suite uses Playwright locator auto-waiting, web-first assertions and URL/state assertions. Arbitrary sleeps would make the suite slower without reliably synchronizing it with application state.

## CI

`.github/workflows/playwright.yml` runs on every push and can also be started manually. It:

1. checks out the repository;
2. installs Node dependencies;
3. installs Chromium;
4. runs the full Playwright suite;
5. uploads the HTML report;
6. uploads failure artifacts when the job fails.

## Known limitations

1. The assessment environment is a public demo application, so external availability/rate limiting can affect test execution.
2. User registration creates unique users because the demo API does not provide a user-delete endpoint in the tested contract.
3. The current suite targets the required assessment journeys rather than attempting exhaustive feature coverage.
4. The GSP permission matrix is a proposed test model; exact Allow/Deny cells must be reconciled with the final GSP authorization specification because the assessment brief describes the roles but does not provide a complete permission table.
5. The tests should be executed in a network-enabled environment before submission. The development environment used to assemble this repository cannot reach the public Conduit host, so runtime pass/fail results must not be fabricated.

## Assessment time box

Record the actual hands-on time spent before submitting. Do not invent a duration. The assessment explicitly asks candidates to report time spent and stop at the stated time box.

**Time spent:** 6 hours

## Part 2

See [`docs/gsp-strategy.md`](docs/gsp-strategy.md).

## Walkthrough

See [`docs/walkthrough.md`](docs/walkthrough.md) for the 30-minute walkthrough structure and questions to be ready for.

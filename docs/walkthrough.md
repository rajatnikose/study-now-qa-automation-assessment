# 30-Minute Walkthrough Preparation

The assessment says shortlisted candidates will run the suite live, break one selector together, debug it, and discuss the GSP answers. The objective is to demonstrate understanding, not merely that the code exists.

## Suggested flow

### 0–3 min — Repository overview

Explain:

- why Playwright + JavaScript;
- why Page Objects are limited to UI interaction concerns;
- why API helpers/fixtures own data setup;
- where CI and reporting live.

### 3–10 min — Run the core E2E journey

Run:

```bash
npx playwright test tests/e2e/article-lifecycle.spec.js --project=chromium
```

Explain the business assertions after each major step rather than narrating every click.

### 10–15 min — API tests

Run:

```bash
npx playwright test tests/api --project=chromium
```

Explain that API setup makes UI tests independent and reduces unnecessary UI work.

### 15–20 min — Authorization

Open the permission test and explain:

1. User A owns the article.
2. User B is a separate account.
3. UI controls are absent for B.
4. API update/delete attempts are explicitly rejected.
5. The article is verified unchanged.

Emphasize that UI hiding is not the security boundary; the server/API must enforce ownership.

### 20–24 min — Break a selector

If asked to break a selector, intentionally change a stable locator to an incorrect one and run the affected test. Use the trace/report to show the failure, then restore the locator.

Be able to explain why role/accessible-name locators were preferred over brittle CSS/XPath where practical.

### 24–30 min — GSP discussion

Be ready to explain:

- why P0 journeys were selected;
- why RBAC requires negative tests;
- what can be affected by a country checklist change;
- why configuration testing needs existing/new application coverage;
- how data isolation, web-first assertions and controlled parallelism reduce flakiness.

## Questions you should be able to answer

### Why API setup instead of UI setup?

UI setup adds time and creates extra failure points. API setup gives each test deterministic state while the UI test remains focused on the behavior it is intended to validate.

### Why not use sleeps?

A fixed delay does not prove the application is ready. It either wastes time or fails intermittently when the system takes longer than the chosen delay. Playwright's waiting and assertions synchronize with actual state.

### Why test authorization through the API?

A hidden button is not authorization. A user can bypass the browser and call an API directly. The API must reject unauthorized mutations and leave the resource unchanged.

### Why capture the slug after editing?

The article API can update the slug when the title changes. The current article URL is therefore the reliable identifier for subsequent verification/deletion after an edit.

### What makes a test flaky?

Typical causes here would be shared mutable data, arbitrary sleeps, ambiguous selectors, waiting for timing rather than state, uncontrolled parallel writes, and external demo instability.

### What would you add with another day?

Expand RBAC coverage, add API contract/schema validation, build reusable GSP-style data factories, add configuration mutation coverage, improve tagging and split fast smoke from broader regression.

## Important

Do not claim that the suite was executed successfully unless it has actually been run against the assessment environment. If asked about validation, state exactly what was run and where.

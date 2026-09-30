# Part 2 — GSP QA Strategy

## 1. Coverage first: first journeys to automate

GSP is a configuration-first recruitment platform with 9 destination markets, country-specific document checklists, a 15-stage admissions lifecycle, commission rate cards and three roles: Admin, Staff and Agent. I would prioritize journeys by business criticality, state-transition risk, authorization risk and the blast radius of configuration changes.

| Priority | Journey | Why it is automated early |
| --- | --- | --- |
| P0 | Agent creates a student/lead and progresses it through the first admissions stages | Core revenue-generating workflow and high state-transition risk. |
| P0 | Application progresses through offer → CAS/visa → enrolment | Downstream stages depend on correct state and required data. A defect can block completion. |
| P0 | Agent can see and operate only on their own students | Data isolation is a security and privacy boundary, not just a UI feature. |
| P0 | Staff/Admin can access the records and actions allowed by their role | Verifies the positive side of the RBAC model. |
| P0 | Country-specific document checklist is enforced for a new application | Configuration directly changes workflow behavior. |
| P1 | Admin edits a country's checklist and existing applications remain consistent | Targets the stated configuration-change risk. |
| P1 | Commission calculation from the applicable rate card | Financial/business-rule impact; wrong calculations can propagate to downstream processes. |
| P1 | Quick-apply / lead-to-application journey | High-frequency workflow with multiple state transitions. |
| P1 | CAS/visa exception and document-completion edge cases | Negative paths are where state machines often fail. |
| P1 | Drop-out/refund or invalid-contact exception flows | Explicitly called out as paths automation must supplement with exploratory testing. |

I would not attempt every market × course × document combination. Instead, I would use equivalence classes and pairwise coverage for configuration dimensions, then reserve exhaustive coverage for rules with financial, authorization or compliance impact.

## 2. Provably safe permissions

The permission model should be tested as an authorization contract at the API/service boundary, with UI checks as a second layer. Hiding a button is not sufficient evidence of authorization because a user can bypass the UI and call an endpoint directly.

### Core matrix

| Action | Admin | Staff | Agent | Negative cases |
| --- | --- | --- | --- | --- |
| View all students | Allow | Allow | Deny | Agent attempts direct URL/API access to another agent's student |
| View own students | Allow | Allow | Allow | Agent attempts another agent's student |
| Create student | Allow | Allow | Allow | Unauthenticated user |
| Edit student | Allow | Allow | Own students only | Agent edits another agent's student |
| Progress application | Allow | Allow | Allowed only where business rules permit | Invalid role + invalid state |
| Edit country checklist | Allow | Deny | Deny | Staff/Agent direct API request |
| Edit commission rate card | Allow | Deny | Deny | Staff/Agent direct API request |
| Manage users/roles | Allow | Deny | Deny | Staff/Agent direct API request |

The exact Allow/Deny cells should be confirmed against the final GSP authorization specification before implementation. The critical testing principle is that every protected action is tested both positively and negatively.

### Regression design

For each protected endpoint/action:

1. Authenticate as each role.
2. Create or locate data owned by the relevant actor.
3. Exercise the permitted action.
4. Attempt the same action against an out-of-scope resource.
5. Verify the API returns the expected authorization response and that the resource is unchanged.
6. Verify the UI does not expose actions the role cannot perform.
7. Repeat with direct navigation/deep links so client-side route guards cannot mask a server-side authorization defect.

A compact RBAC suite should run on every pull request and before release. Changes to authorization middleware, role definitions, student ownership, checklist permissions or relevant routes should trigger the full permission suite.

## 3. Friday configuration change: Canada checklist

An admin edits Canada's document checklist at 5pm Friday. The risk is not limited to the checklist editor itself. The configuration can alter validation, application progression and downstream eligibility.

### What can break

- Existing Canadian applications may unexpectedly gain or lose required documents.
- New Canadian applications may receive the wrong checklist.
- Applications already in progress may become blocked or incorrectly unblocked.
- A required document may be treated as optional, or an optional document as required.
- Stage-transition validation may reject valid applications or permit incomplete ones.
- Agent, Staff and Admin views may expose inconsistent state.
- Documents may be attached to the wrong country/application.
- CAS/visa/enrolment progression may be affected indirectly.
- Configuration caches or stale SPA state may cause different users to see different rules.
- Reporting or downstream integrations may continue using the old configuration.

### Automation approach

I would maintain a small, deterministic configuration-regression dataset:

1. One existing Canadian application before the change.
2. One new Canadian application created after the change.
3. A comparable non-Canadian application to detect accidental global impact.
4. Applications representing complete, incomplete and boundary document states.

The release/configuration pipeline would then:

```text
Read current configuration
        ↓
Create/identify controlled applications
        ↓
Assert checklist assigned by country
        ↓
Assert required/optional document behavior
        ↓
Attempt stage transition with complete data
        ↓
Attempt stage transition with missing required data
        ↓
Verify role visibility and ownership
        ↓
Verify downstream stage eligibility
        ↓
Compare non-Canada control case
```

The key assertion is not simply "Canada page loaded". It is that the configuration produces the expected business behavior across new and existing records without changing unrelated markets.

For a Friday 5pm change, this suite should be a release gate. If the configuration is deployed through an admin workflow rather than code, the same smoke/regression suite should run after the configuration save and before the change is considered production-safe.

## 4. Stability and speed

### Data isolation

- Generate unique users/applications per test where practical.
- Seed data through API/service calls instead of UI setup.
- Avoid tests depending on shared mutable records.
- Delete or reset created records when the system permits it.
- Use deterministic fixtures for read-only configuration cases.

### Waiting strategy

- Use Playwright's locator auto-waiting and web-first assertions.
- Wait on meaningful UI state, not arbitrary time delays.
- For important asynchronous operations, wait for the relevant API response or resulting state transition.
- Never use `sleep`/hard-coded delays as synchronization.

### Retries

Retries should be a diagnostic safety net, not a way to hide flaky tests. I would use a small CI retry count and investigate every retry. Repeated failures should remain visible in CI.

### Parallelism

- Run independent tests in parallel.
- Keep stateful end-to-end scenarios isolated.
- Avoid parallel tests that mutate the same student/application/configuration record.
- Split fast API checks from slower UI journeys so failures can be localized quickly.

### Failure diagnostics

CI should retain an HTML report and failure artifacts such as traces/screenshots/video. A trace should make it possible to determine whether a failure was caused by application behavior, test synchronization, test data or infrastructure.

## What I would add with one more day

1. JSON-schema or contract assertions for the highest-value APIs.
2. A larger RBAC matrix covering every protected action and role combination.
3. Configuration mutation tests for multiple markets using pairwise/equivalence-class selection.
4. API-based test-data factories for students, applications and documents.
5. Tagging for smoke, regression and security/authorization suites.
6. CI jobs that run fast smoke tests on every push and broader regression on pull requests/release candidates.
7. Basic performance timing around the highest-value API calls, without turning the functional suite into a load test.
8. Better environment health checks and controlled cleanup for long-running test data.

## Design principle

The suite should optimize for **business risk coverage**, not test count. The highest-value automation is the smallest set of reliable checks that proves critical workflow state, authorization boundaries and configuration behavior.

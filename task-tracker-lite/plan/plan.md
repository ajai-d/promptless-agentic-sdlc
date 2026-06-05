# Task Tracker Lite - Plan

Project: task-tracker-lite
Stage: Plan
Risk level: 2

## 2a. Architecture

### Objective
Define an implementation-ready architecture for a simple 3-tier task tracker aligned to the approved Spec and suitable for risk level 2.

### System Context
The system is a local-first web application for a single user.
- Client: browser-based UI (vanilla HTML/CSS/JS)
- Service: REST API (Node.js 22 + Express)
- Data: local SQLite file (`tasks.db`)

External dependency scope is intentionally minimal. No cloud services are required for core behavior.

### Architectural Boundaries

1. Web tier
- Renders task list and forms.
- Handles user input and client-side form checks.
- Calls API endpoints; does not access SQLite directly.

2. API tier
- Owns business rules, validation, error handling, and status codes.
- Exposes task CRUD and filtering endpoints.
- Translates request/response data to and from persistence model.

3. Data tier
- SQLite-backed repository layer.
- Owns SQL statements and schema evolution scripts.
- No UI or HTTP concerns.

### Component Breakdown

- `web/`
  - Static assets: HTML, CSS, JS
  - UI state and API client calls
- `api/`
  - Express app bootstrap
  - Route handlers (`/tasks`)
  - Validation middleware
  - Error middleware
- `data/`
  - SQLite connection module
  - Task repository methods
  - Schema initialization/migration script
- `tests/`
  - API tests for endpoint success/failure paths
  - One UI smoke test for create/list flow

### Request and Data Flows

1. Create task
- UI submits form -> `POST /tasks`
- API validates payload (including unknown field rejection)
- Repository inserts row in SQLite
- API returns created task (201)
- UI updates list

2. List/filter tasks
- UI requests `GET /tasks` with optional `status` and `priority`
- API validates query params
- Repository queries SQLite with filters and newest-first ordering
- API returns array (200)
- UI renders rows

3. Mark done
- UI sends `PATCH /tasks/:id` with `status=done`
- API validates id/payload and updates row
- API returns updated task (200)
- UI refreshes item state

4. Delete task
- UI sends `DELETE /tasks/:id`
- API performs hard delete
- API returns no content (204)
- UI removes row from view

### Technology Decisions and Rationale

- Node.js 22 LTS
  - Stable modern runtime for local dev and test tooling.
- Express
  - Lightweight, predictable routing/middleware model suitable for demo scope.
- SQLite
  - File-based persistence with zero infrastructure setup.
- Vanilla frontend
  - Minimizes framework overhead and keeps 3-tier behavior visible.

### Non-Functional Architecture Considerations

- Simplicity first: optimize for clarity and reproducibility.
- Strict contract: reject unknown fields for safer integrations.
- Deterministic error model: consistent JSON error shape.
- Local reliability: persistence survives process restarts.

### Risks and Mitigations (Risk Level 2)

- Risk: Validation drift between UI and API.
  - Mitigation: API is source of truth; UI performs only basic pre-checks.

- Risk: SQLite locking/contention during rapid test execution.
  - Mitigation: Keep tests isolated; use deterministic setup/teardown strategy.

- Risk: Ambiguous dueDate format handling.
  - Mitigation: Enforce ISO date format and validate at API boundary.

- Risk: Architecture erosion (direct SQL in routes).
  - Mitigation: Keep repository abstraction mandatory for DB operations.

### Architecture Exit Criteria (2a complete)

- Tier boundaries are explicit and accepted.
- Request/data flows cover all approved use cases.
- Tech stack and rationale are documented.
- Risk-2 concerns and mitigations are documented.
- Architecture is ready to hand off to 2b Design.

---

## 2b. Design

### Objective
Define concrete contracts between tiers so implementation can proceed with minimal ambiguity.

### API Interface Contracts

#### POST /tasks
Request body:
- title: string, required, trim, length 1-120
- description: string, optional, max 500
- priority: enum low | medium | high, required
- dueDate: string (ISO date), optional

Successful response (201):
- task object with fields: id, title, description, priority, status, dueDate, createdAt, updatedAt

Failure responses:
- 400 validation error
- 500 server error

#### GET /tasks
Query params:
- status: optional, enum open | done
- priority: optional, enum low | medium | high

Successful response (200):
- array of task objects sorted newest first by default

Failure responses:
- 400 invalid query params
- 500 server error

#### PATCH /tasks/:id
Path params:
- id: integer task identifier

Request body (allowed fields only):
- status: optional, enum open | done
- title: optional, trim, length 1-120
- description: optional, max 500
- priority: optional, enum low | medium | high
- dueDate: optional, ISO date or null

Successful response (200):
- updated task object

Failure responses:
- 400 validation error
- 404 task not found
- 500 server error

#### DELETE /tasks/:id
Path params:
- id: integer task identifier

Successful response:
- 204 no content

Failure responses:
- 404 task not found
- 500 server error

### Validation and Error Contract

Validation rules:
- Reject unknown fields in request bodies.
- Reject invalid enum values for status and priority.
- Reject invalid dueDate format when present.
- Trim title and enforce non-empty 1-120 length.

Standard error shape:
- error: string code (for example validation_error, not_found, internal_error)
- message: human-readable summary
- details: optional array/object with field-specific issues

### Repository Contract (API -> Data Tier)

Repository methods (logical contract):
- createTask(input) -> Task
- listTasks(filters, sort) -> Task[]
- updateTask(id, patch) -> Task | null
- deleteTask(id) -> boolean
- getTaskById(id) -> Task | null

Repository responsibilities:
- Parameterized SQL only.
- SQLite schema initialization and migration ownership.
- Timestamp handling for createdAt and updatedAt.
- No HTTP-specific behavior.

### Frontend Integration Contract (Web -> API)

Client behavior:
- Use fetch-based API client wrapper.
- Centralize base URL and error parsing.
- Map validation errors to field-level UI messages.
- Keep UI state minimal: tasks, filters, loading, error.

UI flows:
- Create form submit -> POST /tasks -> prepend/update list
- Filter controls -> GET /tasks with query string
- Mark done action -> PATCH /tasks/:id
- Delete action -> DELETE /tasks/:id then remove row

### Test Design

API test design:
- POST /tasks success and validation failures
- GET /tasks default ordering and filter behavior
- PATCH /tasks/:id success and 404
- DELETE /tasks/:id success and 404
- Unknown field rejection checks on write endpoints

UI smoke test design:
- Open app
- Create one valid task
- Verify task appears in list
- Refresh/load and verify persisted task still appears

### Design Exit Criteria (2b complete)

- Endpoint contracts are explicit and testable.
- Validation and error contract is unambiguous.
- Repository API and responsibilities are defined.
- Web/API integration behavior is defined for all core flows.
- Test design covers agreed quality bar.

## 2c. Orchestration

### Objective
Define the executable work sequence for stage 3 while preserving approval gates and right-sized controls for risk level 2.

### Execute Work Breakdown (3a-3m)

Planned for this demo:
- 3a Setup
- 3b Implement
- 3c Code review (lightweight)
- 3d Code scanning (dependency and basic static checks)
- 3f Test
- 3g CI/CD pipeline (local workflow script + optional CI file)
- 3m Iteration

Deferred for this demo unless explicitly requested:
- 3e Security deep-dive
- 3h Infrastructure as code
- 3i Deployment
- 3j Smoke tests after deployment environment
- 3k Monitoring
- 3l Observability

### Sequence and Dependencies

1. 3a Setup
- Create project structure and install dependencies.
- Dependency: approved plan only.

2. 3b Implement
- Build data layer, API layer, then web layer.
- Dependency: setup completed.

3. 3c Code review
- Review implementation for contract compliance and maintainability.
- Dependency: implementation complete.

4. 3d Code scanning
- Run dependency checks and baseline static checks.
- Dependency: implementation complete.

5. 3f Test
- Run API tests and one UI smoke test.
- Dependency: implementation complete.

6. 3g CI/CD pipeline
- Define reproducible local run/test commands and optional CI config.
- Dependency: tests passing locally.

7. 3m Iteration
- Address review findings and failed checks.
- Dependency: review/scan/test outputs available.

### Agent Assignment Matrix

| Step | Primary agent role | Inputs | Outputs |
|---|---|---|---|
| 3a Setup | Setup Agent | `spec.md`, `plan.md` (2a, 2b, 2c) | Bootstrapped project structure and dependency baseline |
| 3b Implement | Implementation Agent | Setup output + API/data/web contracts | Working web, API, and data-layer increments |
| 3c Code review | Code Review Agent | Implementation diff and contract docs | Review findings, required fixes, accepted deviations |
| 3d Code scanning | Code Scanning Agent | Current codebase and dependencies | Scan report with actionable issues |
| 3f Test | Test Agent | Current codebase + expected behavior from spec | API test results + one UI smoke result |
| 3g CI/CD pipeline | Deployment Agent | Passing local commands and test workflow | Reproducible run/test workflow and optional CI config |
| 3m Iteration | Human + owning agent | Findings from review/scan/test gates | Corrective changes and updated status |

### Handoff Contract Between Agents

- Every step handoff includes: scope executed, files changed, unresolved risks, and gate status.
- The receiving agent must not reinterpret approved contracts; it can only implement within approved scope or escalate.
- If a handoff lacks required context, the receiving agent requests clarification before executing.
- Handoff artifacts are appended to replay-execution records for traceability.

### Shared Context vs Isolated Custom Agents

Default for risk level 2:
- Use shared context with role switching for speed and lower overhead.

Promote specific steps to isolated custom agents when any trigger occurs:
- Trigger 1: repeated contract drift across two consecutive steps.
- Trigger 2: security-sensitive changes (auth, secrets, dependency risk with high severity).
- Trigger 3: persistent quality failures after one iteration cycle.
- Trigger 4: parallel execution required across independent workstreams.

If promoted:
- Use dedicated custom agents with focused instructions and minimal tool scope.
- Preserve same gate rules and approval model.

### Mode Assignment (Risk Level 2)

- Default mode: Interactive.
- Fast-path allowed: low-impact routine edits (for example, non-controversial docs and minor refactors).
- Fast-path not allowed: contract changes, schema changes, test scope reductions, or changes impacting acceptance criteria.

### Gate Criteria by Segment

Gate A (after 3a Setup):
- Project boots locally without errors.

Gate B (after 3b-3d):
- Endpoint behavior matches spec and design contracts.
- Review and scan findings are either resolved or explicitly accepted.

Gate C (after 3f Test):
- API tests pass.
- One UI smoke test passes.

Gate D (after 3g-3m):
- Local workflow is reproducible.
- Remaining issues are documented with clear next actions.

### Failure Handling Hooks

- Retry: transient command/test failures, up to two retries with adjusted approach.
- Refine: when output does not meet gate criteria, revise and re-run affected segment.
- Abandon: after three failed refinements for a single artifact, record and escalate.
- Escalate: ambiguous requirements, conflicting contracts, or risk-level mismatch.

### Definition of Done for Plan Stage

Plan stage is complete when:
- 2a Architecture is approved.
- 2b Design is approved.
- 2c Orchestration is approved.
- Execute sequence, ownership, and gates are explicit enough to begin 3a Setup without additional planning.

---

## SPEC-002 Plan Delta (UI Theme Enhancement)

### 2a Architecture Delta

Scope is presentation-only and confined to `web/styles.css`.
- No API, data, or repository changes.
- No schema, endpoint, or validation updates.
- Runtime and dependency footprint unchanged.

### 2b Design Delta

Theme token and style behavior:
- Introduce yellow-theme color tokens at `:root`.
- Apply atmospheric page background treatment.
- Keep `.container` and `.panel` surfaces neutral for readability.
- Update control border, focus, and action button styles for contrast.
- Preserve all existing DOM structure and JS behavior.

Use-case mapping:
- UC-002-01 -> body/container/panel visual treatment.
- UC-002-02 -> form controls and button affordance/focus states.
- UC-002-03 -> mobile spacing adjustments via media query.

### 2c Orchestration Delta

Execute sequence for SPEC-002:
1. Implement theme styles in `web/styles.css`.
2. Run `npm run quality:check`.
3. Record replay evidence and update spec registry status.

Gate criteria:
- Quality gate passes with no lint/test regressions.
- UI behavior remains functionally unchanged.

---

## SPEC-003 Plan Delta (Inline Task Detail + Quick Actions)

### 2a Architecture Delta

Scope is frontend behavior and styling only.
- Primary changes in `web/app.js` and `web/styles.css`.
- No API contract or data model changes.
- Existing endpoints reused for actions (`PATCH /tasks/:id`, `DELETE /tasks/:id`).

### 2b Design Delta

Interaction model:
- Each task row provides an Open/Close control.
- Exactly one task can be expanded at a time.
- Expanded detail renders inline below the selected task row.

Detail content model:
- title, description, priority, status, dueDate, createdAt, updatedAt.
- Missing values display as `N/A`.

Quick actions:
- Mark Done shown only when task status is `open`.
- Delete shown for all tasks.
- Actions call existing API endpoints and refresh list state.

Use-case mapping:
- UC-003-01 -> Open/Close and inline detail rendering.
- UC-003-02 -> Single `expandedTaskId` policy.
- UC-003-03 -> Detail action handlers and task refresh behavior.

### 2c Orchestration Delta

Execute sequence for SPEC-003:
1. Add SPEC-003 addendum and update spec registry.
2. Implement inline detail behavior and quick actions in web tier.
3. Update UI smoke tests for expansion and actions.
4. Run `npm run quality:check`.
5. Record replay evidence and close status.

Gate criteria:
- One-open-only behavior verified by UI smoke test.
- Quick actions verified through UI behavior and persisted API state.
- Quality gate passes with no regressions.

---

## SPEC-004 Plan Delta (Inline Task Edit)

### 2a Architecture Delta

Scope is frontend interaction/state only.
- Primary changes in `web/app.js`, `web/styles.css`, and UI smoke tests.
- Existing API contract reused (`PATCH /tasks/:id`) for edits.
- No changes to server routes, validation schema, or database schema.

### 2b Design Delta

Interaction design:
- Add `Edit` action in expanded task detail.
- Switching to edit mode replaces read-only rows with inline form.
- Maintain one-expanded-task model; edit mode scoped to expanded task.

Editable field model:
- title (required)
- description (optional)
- priority (low|medium|high)
- dueDate (date or empty)

Action design:
- Save -> PATCH update -> refresh list/detail -> exit edit mode.
- Cancel -> discard unsaved changes -> return to detail view.
- Existing Mark Done/Delete remain available when not editing.

Use-case mapping:
- UC-004-01 -> Edit action + edit-mode render.
- UC-004-02 -> Save handler + PATCH workflow.
- UC-004-03 -> Cancel handler + restore detail mode.

### 2c Orchestration Delta

Execute sequence for SPEC-004:
1. Add SPEC-004 addendum and spec registry update.
2. Implement inline edit mode and save/cancel handlers.
3. Add/adjust styles for inline edit form.
4. Extend UI smoke coverage for edit flow.
5. Run `npm run quality:check`.
6. Record replay evidence and close status.

Gate criteria:
- Edit form prefill and save behavior validated by UI smoke test.
- Cancel behavior validated (no persisted change on cancel path).
- Quality gate passes with no regressions.

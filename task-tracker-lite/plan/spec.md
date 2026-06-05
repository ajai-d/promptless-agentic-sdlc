# Task Tracker Lite - Specification

Project: task-tracker-lite
Stage: Spec
Risk level: 2

## Spec Registry

| Spec ID | Scope | Status | Evidence |
|---|---|---|---|
| SPEC-001 | Core task tracker app (API, data, web create/list, tests, CI baseline) | Implemented, Verified | `replay-execution/replay-execution.md` entries 001-011; `npm run quality:check` pass |
| SPEC-002 | UI theme enhancement (pretty yellow background treatment) | Implemented, Verified | `plan/spec-ui-theme.md` use cases UC-002-01..03; `plan/plan.md` SPEC-002 Plan Delta; `replay-execution/replay-execution.md` entry 012; `npm run quality:check` pass |
| SPEC-003 | Inline task detail expansion with single-open behavior and quick actions | Implemented, Verified | `plan/spec-task-detail-inline.md` use cases UC-003-01..03; `plan/plan.md` SPEC-003 Plan Delta; `replay-execution/replay-execution.md` entry 013; `npm run quality:check` pass |
| SPEC-004 | Inline task editing from expanded detail | Implemented, Verified | `plan/spec-task-edit-inline.md` use cases UC-004-01..03; `plan/plan.md` SPEC-004 Plan Delta; `replay-execution/replay-execution.md` entry 014; `npm run quality:check` pass |

## 1b. Business Requirements (BRD)

### Purpose
Build a simple 3-tier Task Tracker demo application with:
- Web frontend (vanilla HTML/CSS/JS)
- REST API backend (Node.js + Express)
- Local SQLite database file

### Goals
- Demonstrate clean separation of presentation, API/service, and data layers.
- Support core task management workflow for a single-user local app.
- Provide a low-friction local setup and run experience.

### Stakeholders
- Primary: Demo operator (developer or reviewer running locally)
- Secondary: Reviewer validating API behavior and architecture boundaries

### Success Metrics
- User can create, list, complete, and delete tasks from the web UI.
- API enforces validation and returns clear, consistent error responses.
- Data persists across application restarts in SQLite.
- API test suite passes and one UI smoke test passes.
- Local setup instructions are clear and reproducible.

### Constraints
- Runtime target: Node.js 22 LTS
- No cloud dependencies required for core functionality
- Local filesystem persistence only
- Local-first development workflow

## 1c. Use Cases

### UC-01 Create Task
Actor: User
Trigger: User submits new task form
Preconditions: App loaded and API reachable
Main flow:
1. User enters title, optional description, optional dueDate, and priority.
2. UI submits POST /tasks.
3. API validates payload and rejects unknown fields.
4. API stores task with default status open and timestamps.
5. UI shows created task in list.
Postconditions: New task exists and is visible.
Exceptions:
- Validation error (400) with field-level details
- Server error (500)

### UC-02 List Tasks
Actor: User
Trigger: User opens app or refreshes task list
Preconditions: API reachable
Main flow:
1. UI requests GET /tasks with optional filters.
2. API returns tasks sorted newest first by default.
3. UI renders returned tasks.
Postconditions: User sees current task state.
Exceptions:
- Server error (500)

### UC-03 Filter Tasks
Actor: User
Trigger: User sets filter controls
Preconditions: Task list available
Main flow:
1. User selects status and/or priority filter.
2. UI requests GET /tasks?status=...&priority=...
3. API validates query values and returns filtered list.
4. UI updates visible list.
Postconditions: Filtered task set displayed.
Exceptions:
- Invalid query value (400)

### UC-04 Mark Task Complete
Actor: User
Trigger: User marks a task done
Preconditions: Task exists
Main flow:
1. UI sends PATCH /tasks/:id with status done.
2. API validates id and payload.
3. API updates task status and updatedAt.
4. UI reflects new task state.
Postconditions: Task status is done.
Exceptions:
- Task not found (404)
- Validation error (400)

### UC-05 Delete Task
Actor: User
Trigger: User deletes a task
Preconditions: Task exists
Main flow:
1. UI sends DELETE /tasks/:id.
2. API performs hard delete.
3. UI removes task from list.
Postconditions: Task no longer exists.
Exceptions:
- Task not found (404)

## 1d. Technical Specification

### Architecture
- Web tier: Static frontend served locally (vanilla HTML/CSS/JS)
- API tier: Express application exposing REST endpoints
- Data tier: SQLite file-based storage

### Data Model
Entity: Task
- id: integer, primary key, auto-increment
- title: string, required, length 1-120 (after trim)
- description: string, optional, max length 500
- priority: enum {low, medium, high}, required
- status: enum {open, done}, required, default open
- dueDate: date string (ISO date), optional
- createdAt: datetime string, required
- updatedAt: datetime string, required

### Validation Rules
- Reject unknown JSON fields for create/update payloads.
- title is required and must be 1-120 chars after trim.
- description is optional; if present max 500 chars.
- priority must be one of low, medium, high.
- status must be open or done.
- dueDate, if present, must be a valid ISO date.

### API Contract Baseline
1. POST /tasks
- Creates task
- Request fields allowed: title, description, priority, dueDate
- Response: 201 with created task

2. GET /tasks
- Lists tasks
- Query params: status, priority
- Default sort: newest first
- Response: 200 with task array

3. PATCH /tasks/:id
- Updates task status (minimum required behavior: mark done)
- Allowed fields: status, title, description, priority, dueDate
- Response: 200 with updated task

4. DELETE /tasks/:id
- Hard delete task
- Response: 204 on success

### Error Handling
- 400 Bad Request for validation/query errors
- 404 Not Found for unknown task id
- 500 Internal Server Error for unexpected failures
- Error response shape (baseline):
  - error: machine-readable code
  - message: human-readable summary
  - details: optional field-level information

## Functional Requirements (FR)

- FR-01: System shall allow creating tasks.
- FR-02: System shall list tasks with newest-first default sorting.
- FR-03: System shall support filtering task lists by status and priority.
- FR-04: System shall allow updating task status to done.
- FR-05: System shall allow hard deletion of tasks.
- FR-06: System shall persist tasks in local SQLite across restarts.
- FR-07: System shall reject unknown request fields.

## Non-Functional Requirements (NFR)

- NFR-01: Project runs on Node.js 22 LTS.
- NFR-02: Architecture keeps web, API, and data responsibilities separated.
- NFR-03: API responses are consistent and include clear error information.
- NFR-04: Local setup and execution are reproducible from documentation.
- NFR-05: Test suite includes API tests and at least one UI smoke test.

## Acceptance Criteria (AC)

- AC-01 (Create): Given valid payload, POST /tasks returns 201 and created task.
- AC-02 (Create validation): Invalid or unknown fields return 400 with details.
- AC-03 (List): GET /tasks returns tasks sorted newest first by default.
- AC-04 (Filter): GET /tasks with status/priority returns correctly filtered tasks.
- AC-05 (Update): PATCH /tasks/:id can mark task done and updates updatedAt.
- AC-06 (Delete): DELETE /tasks/:id returns 204 and task is removed.
- AC-07 (Persistence): Restarting app preserves previously created tasks.
- AC-08 (Quality): API tests and one UI smoke test pass.

## Traceability Matrix

| Use Case | FR | AC |
|---|---|---|
| UC-01 Create Task | FR-01, FR-07 | AC-01, AC-02 |
| UC-02 List Tasks | FR-02 | AC-03 |
| UC-03 Filter Tasks | FR-03 | AC-04 |
| UC-04 Mark Task Complete | FR-04 | AC-05 |
| UC-05 Delete Task | FR-05 | AC-06 |
| Cross-cutting Persistence | FR-06 | AC-07 |
| Cross-cutting Quality | NFR-05 | AC-08 |

## Test Expectations

- API tests must cover success and failure paths for each endpoint.
- At least one UI smoke test must validate end-to-end create/list flow.
- Tests should run in local dev workflow and be documented in project README.

## Out of Scope (for this demo)

- Multi-user support and authentication
- Role-based permissions
- Cloud deployment
- Advanced search, pagination, or bulk operations
- Soft delete and audit history

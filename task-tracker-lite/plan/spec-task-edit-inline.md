# Task Tracker Lite - Spec Addendum: Inline Task Edit

Spec ID: SPEC-004
Parent spec: `plan/spec.md`
Status: Implemented, Verified

## Goal

Enable users to edit task details from the expanded inline task detail view without leaving the task list context.

## Business Requirements

- Preserve current list/detail interaction and one-open-at-a-time behavior.
- Allow editing of task fields in-place for fast correction.
- Keep existing quick actions (Mark Done, Delete) functional.
- Maintain current API contracts and validation model.

## Scope

- Add Edit action in expanded task detail.
- Add inline edit form for selected task.
- Allow editing fields:
  - title
  - description
  - priority
  - dueDate
- Add Save and Cancel controls.
- Persist changes through existing `PATCH /tasks/:id` endpoint.

## Use Cases

### UC-004-01 Enter Edit Mode
Actor: User
Trigger: User clicks Edit in expanded task detail
Preconditions: A task is expanded
Main flow:
1. User clicks Edit.
2. UI replaces detail rows with edit form.
3. Form is prefilled with current task values.
Postconditions: Task is in editable inline state.
Exceptions:
- None (client-side state transition).

### UC-004-02 Save Task Edits
Actor: User
Trigger: User clicks Save in edit form
Preconditions: Task is in edit mode
Main flow:
1. User updates one or more editable fields.
2. User clicks Save.
3. UI sends PATCH request with updated payload.
4. UI refreshes list and detail with updated values.
Postconditions: Updated task values are persisted and displayed.
Exceptions:
- Validation or API failure displays status error.

### UC-004-03 Cancel Task Edits
Actor: User
Trigger: User clicks Cancel in edit form
Preconditions: Task is in edit mode
Main flow:
1. User clicks Cancel.
2. UI exits edit mode.
3. UI restores non-edit detail view.
Postconditions: Unsaved changes are discarded.
Exceptions:
- None (client-side state transition).

## Acceptance Criteria

- Expanded task detail shows Edit action.
- Clicking Edit displays inline form with current values prefilled.
- Save persists edits via PATCH and reflects updated values in list/detail.
- Cancel exits edit mode without changing task data.
- Existing Mark Done and Delete actions remain functional.
- Existing behavior (create/list/detail open-close) remains unchanged.
- `npm run quality:check` passes.

## Traceability

- UC-004-01 -> Edit action and edit-mode rendering.
- UC-004-02 -> Save handler and PATCH update flow.
- UC-004-03 -> Cancel handler and detail restoration.

## Verification Evidence

- Quality gate: `npm run quality:check` passed (lint, API tests, UI smoke).
- UI smoke tests include inline edit/save scenario.

# Plan Addendum (For Agentic Apps)

> This file is a strict addendum to the baseline SDLC plan template at [../../sdlc/templates/plan-template.md](../../sdlc/templates/plan-template.md).
>
> **Do not duplicate baseline sections 1-3 here.** Start from the baseline plan template, then apply the addendum constraints below.

---

## 3. Orchestration delta

### 3.1 Work breakdown (additional constraints)

[Work items that implement evaluation harness MUST use ID pattern `W-<n>-eval`. Non-eval feature items use pattern `W-<n>`.]

Example:

| ID | Title | Description | Traces to |
|----|-------|-------------|-----------|
| W-1-eval | [eval harness setup] | [description] | C-1, NFR-1 |
| W-2 | [feature work item] | [description] | C-2, FR-1 |

### 3.2 Sequencing and dependencies (additional constraints)

[When LLM-driven behavior exists, sequencing MUST show eval-first dependency edges.]

Example:

- **W-2 depends on:** W-1-eval

---

## PLAN-EXIT validation checklist (addendum)

The AI Agent MUST first pass all baseline checks in [../../sdlc/templates/plan-template.md](../../sdlc/templates/plan-template.md), then pass all checks below.

1. If the spec is agentic (Section 10 present), Section 3.1 contains at least one `W-<n>-eval` work item.
2. Every `W-<m>` that introduces or modifies LLM-driven behavior depends (directly or transitively) on at least one `W-<n>-eval` item.
3. Section 3.2 explicitly records at least one eval-first dependency edge (`W-<m> depends on: W-<n>-eval`).
4. At least one work item traces to each Section 10 scoring dimension implementation (dataset, scorer, report output).

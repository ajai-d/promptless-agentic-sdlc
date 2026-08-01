# Plan Template (Agentic)

> This template extends the baseline SDLC plan template at [../../sdlc/templates/plan-template.md](../../sdlc/templates/plan-template.md).
>
> Sections 1-3 remain baseline in structure. This extension adds eval-harness-first orchestration constraints.
>
> All `[bracketed placeholders]` MUST be replaced. Section headings MUST be preserved verbatim for mechanical validation.

---

## 1. Architecture

### 1.1 Application architecture

- **C-1:** [component name] - [responsibility]
- **C-2:** [component name] - [responsibility]

### 1.2 Data architecture

[Optional. Use `None for this release.` if not applicable.]

### 1.3 Infrastructure architecture

[Optional. Use `None for this release.` if not applicable.]

### 1.4 Security architecture

[Optional. Use `None for this release.` if not applicable.]

### 1.5 Technology choices

- [technology] - [reason]
- [technology] - [reason]

### 1.6 Test architecture

[Conditionally required if spec has ACs. Include eval harness architecture and where eval artifacts live.]

## 2. Design

### 2.1 Application design

- **D-1:** [design item]
  - **Refines:** C-1

### 2.2 Data design

[Optional.]

### 2.3 Infrastructure design

[Optional.]

### 2.4 Security design

[Optional.]

### 2.5 Test design

- **D-2:** [test/eval design item]
  - **Refines:** §1.6

## 3. Orchestration

### 3.1 Work breakdown

[Required. Work items that implement evaluation harness MUST use ID pattern `W-<n>-eval`. Non-eval feature items use pattern `W-<n>`.]

| ID | Title | Description | Traces to |
|----|-------|-------------|-----------|
| W-1-eval | [eval harness setup] | [description] | C-1, NFR-1 |
| W-2 | [feature work item] | [description] | C-2, FR-1 |

### 3.2 Sequencing and dependencies

[Required when LLM-driven behavior exists. Must show eval-first dependency edges.]

- **W-2 depends on:** W-1-eval

---

## PLAN-EXIT validation checklist

The AI Agent MUST verify all checks below mechanically before requesting `PLAN-EXIT` approval.

### Baseline checks (inherited)

1. All three H2 sections present in order: `## 1. Architecture`, `## 2. Design`, `## 3. Orchestration`.
2. No `[bracketed placeholder]` text remains.
3. Required sub-sections are non-empty: §1.1, §1.5, §3.1.
4. Conditional sub-section §1.6: if `spec.md` Section 8 has at least one AC, §1.6 MUST be non-empty.
5. Optional sub-sections are present and either contain content or state `None for this release.`: §1.2, §1.3, §1.4, §2.1, §2.2, §2.3, §2.4, §2.5.
6. Section 1.1 contains at least one component; every component has unique `C-<n>` ID.
7. Section 1.5 contains at least one technology choice with a stated reason.
8. Every design item in §2.1-§2.4 (if any) has unique `D-<n>` ID and a valid `Refines:` target.
9. Every design item in §2.5 (if any) has unique `D-<n>` ID and `Refines: §1.6`.
10. Section 3.1 contains at least one work item with unique ID, non-empty title/description, and valid `Traces to:` references.
11. Section 3.2 dependency graph references existing IDs and has no cycles.
12. Every `C-<n>` declared in §1.1 is referenced by at least one work item `Traces to:` line.

### Agentic checks (additional)

13. If the spec is agentic (Section 10 present), Section 3.1 contains at least one `W-<n>-eval` work item.
14. Every `W-<m>` that introduces or modifies LLM-driven behavior depends (directly or transitively) on at least one `W-<n>-eval` item.
15. Section 3.2 explicitly records at least one eval-first dependency edge (`W-<m> depends on: W-<n>-eval`).
16. At least one work item traces to each Section 10 scoring dimension implementation (dataset, scorer, report output).

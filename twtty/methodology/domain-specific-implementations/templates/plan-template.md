# Plan Template

> **Design decision (locked) — single-file plan.**
>
> This template defines a **single** `plan.md` file rather than splitting Architecture, Design, and Orchestration into separate documents. This is deliberate.
>
> The three sections are tightly coupled: §2 Design items refine §1 Architecture components, and §3 Orchestration work items trace to §1 Architecture components or to spec FRs/NFRs. The `PLAN-EXIT` validation checklist enforces that cross-section traceability — splitting these into separate files would weaken the checklist (it would have to walk multiple files and resolve cross-file references) for no readability benefit.
>
> The single-file decision parallels the [spec template](spec-template.md). The split-vs-single decision is per-stage, justified by coupling.

> Template for the **Plan** artifact produced by stage tasks 2a, 2b, and 2c of the [SDLC implementation](../sdlc.md#33-plan). Saved by the Architecture / Design / Planning agents to `<project-folder>/plan/plan.md` (baseline release `R1`) or `<project-folder>/plan/plan-<release-id>.md` (subsequent releases).
>
> All `[bracketed placeholders]` MUST be replaced. Section headings (`## 1.`, `## 2.`, `## 3.`, and the H3 sub-section headings) MUST be preserved verbatim — the AI Agent uses them for mechanical validation at `PLAN-EXIT`.

---

## 1. Architecture

### 1.1 Application architecture

[Required. The system's components, their responsibilities, and how they interact. May include a component diagram (Mermaid or ASCII) and a component table. Each component MUST have a unique ID prefixed `C-<n>`.]

- **C-1:** [component name] — [responsibility]
- **C-2:** [component name] — [responsibility]

### 1.2 Data architecture

[Optional. Data stores, schemas, ownership, retention, and data flow. Use "None for this release." if there are no data concerns.]

### 1.3 Infrastructure architecture

[Optional. Hosting, networking, environments, and deployment topology. Use "None for this release." if infrastructure is not in scope.]

### 1.4 Security architecture

[Optional. Trust boundaries, authentication, authorization, secrets management, and threat-model summary. Use "None for this release." if there are no security concerns beyond defaults.]

### 1.5 Technology choices

[Required. Languages, frameworks, runtimes, libraries, and services chosen. Each choice MUST state the reason in one sentence.]

- [technology] — [reason]
- [technology] — [reason]

### 1.6 Test architecture

[Conditionally required: if the corresponding `spec.md` Section 8 contains at least one AC, this sub-section MUST be non-empty. The test pyramid (unit / integration / end-to-end / contract / performance / security as applicable), where tests live in the repository, test environments, and coverage targets. Use "None for this release." only when `spec.md` Section 8 is empty (no acceptance criteria) — which is rare.]

## 2. Design

[Sections 2.1 through 2.4 refine the corresponding §1 sub-sections. Each design item MUST trace to one or more §1 components via a `Refines:` line. Section 2.5 refines §1.6 instead. All §2 sub-sections are optional; use "None for this release." when the corresponding §1 sub-section is also "None for this release." or needs no further refinement.]

### 2.1 Application design

[Optional. Interfaces, contracts, sequence flows, and component-internal structure refining §1.1.]

- **D-1:** [design item]
  - **Refines:** C-1

### 2.2 Data design

[Optional. Concrete schemas, indexes, migrations, and data contracts refining §1.2.]

### 2.3 Infrastructure design

[Optional. Concrete environment definitions, IaC module choices, and deployment-pipeline shape refining §1.3.]

### 2.4 Security design

[Optional. Concrete identity, secrets, key-rotation, and authorization rules refining §1.4.]

### 2.5 Test design

[Optional. Concrete test frameworks, fixtures, mocking strategy, test-data approach, and CI wiring refining §1.6.]

- **D-2:** [test design item]
  - **Refines:** §1.6

## 3. Orchestration

### 3.1 Work breakdown

[Required. The atomic work items that implement §1 and §2. Each item MUST have a unique ID prefixed `W-<n>`, a short title, and a one-paragraph description. Each item MUST trace to one or more §1 components or to one or more spec FR/NFR IDs via a `Traces to:` line.]

| ID | Title | Description | Traces to |
|----|-------|-------------|-----------|
| W-1 | [title] | [description] | C-1, FR-1 |
| W-2 | [title] | [description] | C-2, NFR-1 |

### 3.2 Sequencing and dependencies

[Optional. Ordering and dependency relationships between §3.1 work items, expressed as a directed acyclic graph (DAG). Use "None for this release." if all work items are independent.]

- **W-2 depends on:** W-1
- **W-3 depends on:** W-1, W-2

---

## PLAN-EXIT validation checklist

The AI Agent MUST verify all of the following mechanically before requesting `PLAN-EXIT` approval (per [SDLC Section 3.3](../sdlc.md#33-plan)):

1. All three H2 sections present in order: `## 1. Architecture`, `## 2. Design`, `## 3. Orchestration`.
2. No `[bracketed placeholder]` text remains.
3. Required sub-sections are non-empty: §1.1, §1.5, §3.1.
4. Conditional sub-section §1.6: if the corresponding `spec.md` Section 8 contains at least one AC, §1.6 MUST be non-empty (not `None for this release.`).
5. Optional sub-sections are present and either contain content or state `None for this release.`: §1.2, §1.3, §1.4, §2.1, §2.2, §2.3, §2.4, §2.5, §3.2.
6. Section 1.1 contains at least one component; every component has a unique `C-<n>` ID.
7. Section 1.5 contains at least one technology choice with a stated reason.
8. Every design item in §2.1–§2.4 (if any) has a unique `D-<n>` ID and a `Refines:` line referencing at least one valid `C-<n>` ID declared in §1.
9. Every design item in §2.5 (if any) has a unique `D-<n>` ID and a `Refines:` line referencing `§1.6`.
10. Section 3.1 contains at least one work item; every work item has a unique `W-<n>` ID, a non-empty title and description, and a `Traces to:` line referencing at least one valid `C-<n>` ID from §1 or one valid `FR-<n>`/`NFR-<n>` ID from the corresponding `spec.md`.
11. Section 3.2 (if it lists dependencies) forms a directed acyclic graph: every `W-<n> depends on:` entry references existing `W-<n>` IDs, and there are no cycles.
12. Every `C-<n>` declared in §1.1 is referenced by at least one §3.1 work item's `Traces to:` line (no orphan components).

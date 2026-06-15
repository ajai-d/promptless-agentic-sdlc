# Spec Template

> **Design decision (locked) — single-file specification.**
>
> This template defines a **single** `spec.md` file rather than splitting into separate documents (e.g., `business-requirements.md`, `use-cases.md`, `technical-spec.md`). This is deliberate.
>
> The eight sections are tightly coupled: FRs reference use cases, ACs reference FRs/NFRs, and the `SPEC-EXIT` validation checklist enforces cross-section traceability (no orphan FRs/NFRs; every AC traces to ≥1 requirement). Splitting these into separate files would weaken that traceability — the checklist would have to walk multiple files and resolve cross-file references, adding moving parts and failure modes for no readability benefit (a large project's use cases are large whether they live in `spec.md` Section 5 or a separate `use-cases.md`).
>
> Reproducibility at the acceptance-criteria level (per [core Section 11.7](../../core-twtty-methodology.md#117-rules)) depends on the spec being one coherent contract. Do not split this file.
>
> Note: [SDLC Section 3.3](../sdlc.md#33-plan) does split its outputs into multiple files because Plan-stage artifacts (architecture, design, orchestration) are loosely coupled with different lifecycles and consumers. The split-vs-single decision is per-stage, justified by coupling.

> Template for the **Technical Specification** artifact produced by stage tasks 1b, 1c, and 1d of the [SDLC implementation](../sdlc.md#32-spec). Saved by the Spec Agent to `<project-folder>/spec/spec.md` (baseline release `R1`) or `<project-folder>/spec/spec-<release-id>.md` (subsequent releases).
>
> All `[bracketed placeholders]` MUST be replaced. Section headings (`## 1.`, `## 2.`, ..., `## 8.`) MUST be preserved verbatim — the AI Agent uses them for mechanical validation at `SPEC-EXIT`.

---

## 1. Goals

[What this release achieves. Bullet list, one goal per bullet.]

## 2. Stakeholders

[Who is affected by or accountable for this release. Bullet list: name/role + relationship.]

## 3. Success metrics

[How success is measured. Each metric MUST be quantified (target number, units, measurement window).]

## 4. Constraints

[Hard limits the solution MUST honor (technology, timeline, budget, compliance, integration). Use "None for this release." if there are no constraints.]

## 5. Use cases

[One H3 subsection per use case, ID-prefixed as `UC-<n>`. Each use case MUST include all five sub-bullets below.]

### 5.1 UC-1: [title]

- **Actors:** [who initiates / participates]
- **Triggers:** [what starts the flow]
- **Main flow:** [numbered steps, happy path]
- **Exceptions:** [error / alternate flows]
- **Dependencies:** [other use cases, systems, or data this depends on]

### 5.2 UC-2: [title]

[...repeat for each use case...]

## 6. Functional requirements (FR)

[Functional Requirements: what the system MUST do. One per line, ID-prefixed as `FR-<n>`. Each FR MUST be referenced by at least one acceptance criterion in Section 8.]

- **FR-1:** [requirement]
- **FR-2:** [requirement]

## 7. Non-functional requirements (NFR)

[Non-Functional Requirements: qualities the system MUST exhibit (performance, security, availability, accessibility, etc.). One per line, ID-prefixed as `NFR-<n>`. Each NFR MUST be referenced by at least one acceptance criterion in Section 8. Use "None for this release." if there are no NFRs.]

- **NFR-1:** [requirement]
- **NFR-2:** [requirement]

## 8. Acceptance criteria

[Acceptance Criteria: objectively verifiable pass/fail conditions per [core Section 11.7](../../core-twtty-methodology.md#117-rules). One per line, ID-prefixed as `AC-<n>`. Each AC MUST trace to one or more FR/NFR via a `Traces to:` line. Vague terms ("fast", "user-friendly", "robust") are prohibited.]

- **AC-1:** [criterion stated as pass/fail]
  - **Traces to:** FR-1
- **AC-2:** [criterion stated as pass/fail]
  - **Traces to:** FR-2, NFR-1

---

## SPEC-EXIT validation checklist

The AI Agent MUST verify all of the following mechanically before requesting `SPEC-EXIT` approval (per [SDLC Section 3.2](../sdlc.md#32-spec)):

1. All eight H2 sections present in order: `## 1. Goals` through `## 8. Acceptance criteria`.
2. No `[bracketed placeholder]` text remains.
3. Required sections are non-empty: 1, 2, 3, 5, 6, 8. (Sections 4 and 7 MAY be `None for this release.`)
4. Section 5 contains at least one `### 5.<n> UC-<n>:` subsection.
5. Every UC subsection contains all five required sub-bullets: Actors, Triggers, Main flow, Exceptions, Dependencies.
6. Section 6 contains at least one FR; every FR has a unique `FR-<n>` ID.
7. Every NFR (if any) has a unique `NFR-<n>` ID.
8. Section 8 contains at least one AC; every AC has a unique `AC-<n>` ID and a `Traces to:` line referencing at least one valid FR or NFR ID.
9. Every `FR-<n>` declared in Section 6 is referenced by at least one AC in Section 8 (no orphan FRs).
10. Every `NFR-<n>` declared in Section 7 (if any) is referenced by at least one AC in Section 8 (no orphan NFRs).
11. No AC contains the prohibited vague terms `fast`, `user-friendly`, `robust`, `easy`, `simple`, `intuitive` (case-insensitive whole-word match) per [core Section 11.7](../../core-twtty-methodology.md#117-rules).

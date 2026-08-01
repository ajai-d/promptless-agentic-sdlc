# Spec Template (Agentic)

> This template extends the baseline SDLC spec template at [../../sdlc/templates/spec-template.md](../../sdlc/templates/spec-template.md).
>
> Sections 1-8 remain identical in purpose to baseline SDLC. This template adds Sections 9-12 and additional `SPEC-EXIT` checks.
>
> All `[bracketed placeholders]` MUST be replaced. Section headings MUST be preserved verbatim for mechanical validation.

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

## 6. Functional requirements (FR)

- **FR-1:** [requirement]
- **FR-2:** [requirement]

## 7. Non-functional requirements (NFR)

- **NFR-1:** [requirement]
- **NFR-2:** [requirement]

## 8. Acceptance criteria

[Acceptance criteria remain objectively verifiable pass/fail conditions. Each AC MUST include a `Traces to:` line.] 

- **AC-1:** [criterion stated as pass/fail]
  - **Traces to:** FR-1
- **AC-2:** [criterion stated as pass/fail]
  - **Traces to:** FR-2, NFR-1

## 9. Tool schemas

[One H3 subsection per tool used by agentic runtime behavior. ID prefix: `T-<n>`.]

### 9.1 T-1: [tool name]

- **Purpose:** [what this tool is used for]
- **Input schema:** [fields and types]
- **Output schema:** [fields and types]
- **Side effects:** [writes, external calls, mutations]
- **Failure modes:** [timeouts, invalid input, auth failure, partial writes]

## 10. Evaluation rubric and baseline

[Defines how non-deterministic behavior is measured and gated.]

- **Eval type:** [rubric-based | LLM-as-judge | golden dataset | hybrid]
- **Dataset path:** [repository path, e.g., `tests/eval/data/cases.jsonl`]
- **Scoring dimensions:**
  - **DIM-1 [name]:** [metric definition], threshold: [number + unit]
  - **DIM-2 [name]:** [metric definition], threshold: [number + unit]
- **Baseline:** [version/date and numeric baseline per dimension]
- **Run protocol:** [how to execute eval and where outputs are written]

## 11. Cost budget

[Defines spend constraints for LLM behavior.]

- **Per-request budget:** [max tokens and/or max cost]
- **Per-session budget:** [max tokens and/or max cost]
- **Per-day budget:** [max tokens and/or max cost]
- **Budget degradation policy:** [fallback behavior when budget threshold is exceeded]

## 12. Safety policy

[Defines safety controls and escalation behavior.]

- **Prohibited input classes:** [e.g., explicit harmful instructions, secrets exfiltration requests]
- **Prohibited output classes:** [e.g., disallowed content categories]
- **PII handling:** [detection, masking/redaction, retention]
- **Jailbreak handling:** [detect/respond/escalate policy]
- **Escalation path:** [when and how handoff to human occurs]

---

## SPEC-EXIT validation checklist

The AI Agent MUST verify all checks below mechanically before requesting `SPEC-EXIT` approval.

### Baseline checks (inherited)

1. All twelve H2 sections present in order: `## 1. Goals` through `## 12. Safety policy`.
2. No `[bracketed placeholder]` text remains.
3. Required sections are non-empty: 1, 2, 3, 5, 6, 8, 9, 10, 11, 12. (Sections 4 and 7 MAY be `None for this release.`)
4. Section 5 contains at least one `### 5.<n> UC-<n>:` subsection.
5. Every UC subsection contains Actors, Triggers, Main flow, Exceptions, Dependencies.
6. Section 6 contains at least one FR; each FR has unique `FR-<n>` ID.
7. Every NFR (if any) has unique `NFR-<n>` ID.
8. Section 8 contains at least one AC; each AC has unique `AC-<n>` ID and a `Traces to:` line referencing at least one valid FR/NFR ID.
9. Every `FR-<n>` is referenced by at least one AC.
10. Every `NFR-<n>` (if any) is referenced by at least one AC.
11. No AC contains prohibited vague baseline terms `fast`, `user-friendly`, `robust`, `easy`, `simple`, `intuitive` (case-insensitive whole-word match).

### Agentic checks (additional)

12. Section 9 contains at least one `T-<n>` tool schema with all five required sub-bullets.
13. Section 10 declares eval type, dataset path, at least one scoring dimension, and numeric threshold for each dimension.
14. Section 10 declares a numeric baseline for every scoring dimension.
15. Section 11 declares per-request, per-session, and per-day budgets.
16. Section 11 defines explicit degradation behavior when a budget threshold is exceeded.
17. Section 12 declares prohibited input classes, prohibited output classes, PII handling, jailbreak handling, and escalation path.
18. Every `T-<n>` in Section 9 is referenced by at least one FR or NFR.
19. Every scoring dimension in Section 10 is referenced by at least one AC in Section 8.
20. No AC contains prohibited unquantified agentic-quality adjectives `helpful`, `accurate`, `relevant`, `natural`, `human-like` (case-insensitive whole-word match) unless the AC also cites a dimension/threshold in Section 10.
21. Section 10 run protocol writes evaluation outputs to a machine-readable artifact path under `reports/eval/`.
22. Section 12 escalation path defines the trigger condition and the destination role/team.

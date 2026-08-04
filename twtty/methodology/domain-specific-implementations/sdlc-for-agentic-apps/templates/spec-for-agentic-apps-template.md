# Spec Addendum (For Agentic Apps)

> This file is a strict addendum to the baseline SDLC spec template at [../../sdlc/templates/spec-template.md](../../sdlc/templates/spec-template.md).
>
> **Do not duplicate baseline sections 1-8 here.** Start from the baseline spec template, then append Sections 9-12 from this addendum.
>
> All `[bracketed placeholders]` MUST be replaced. Section headings MUST be preserved verbatim for mechanical validation.

---

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

## SPEC-EXIT validation checklist (addendum)

The AI Agent MUST first pass all baseline checks in [../../sdlc/templates/spec-template.md](../../sdlc/templates/spec-template.md), then pass all checks below.

1. Section 9 contains at least one `T-<n>` tool schema with all five required sub-bullets.
2. Section 10 declares eval type, dataset path, at least one scoring dimension, and numeric threshold for each dimension.
3. Section 10 declares a numeric baseline for every scoring dimension.
4. Section 11 declares per-request, per-session, and per-day budgets.
5. Section 11 defines explicit degradation behavior when a budget threshold is exceeded.
6. Section 12 declares prohibited input classes, prohibited output classes, PII handling, jailbreak handling, and escalation path.
7. Every `T-<n>` in Section 9 is referenced by at least one FR or NFR.
8. Every scoring dimension in Section 10 is referenced by at least one AC in Section 8.
9. No AC contains prohibited unquantified agentic-quality adjectives `helpful`, `accurate`, `relevant`, `natural`, `human-like` (case-insensitive whole-word match) unless the AC also cites a dimension/threshold in Section 10.
10. Section 10 run protocol writes evaluation outputs to a machine-readable artifact path under `reports/eval/`.
11. Section 12 escalation path defines the trigger condition and the destination role/team.

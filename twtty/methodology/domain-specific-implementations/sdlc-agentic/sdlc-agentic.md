# SDLC Agentic Domain-Specific Implementation

> This document extends the baseline SDLC implementation at [../sdlc/sdlc.md](../sdlc/sdlc.md). Everything in the baseline SDLC applies unless this document adds stricter requirements.
>
> This extension is for projects with LLM-driven behavior that cannot be fully validated by deterministic unit/integration tests alone.

## In this document

| Section | Purpose |
|---------|---------|
| [1. Purpose](#1-purpose) | Scope of the agentic extension |
| [2. Domain selection](#2-domain-selection) | Deterministic rule for choosing baseline SDLC vs agentic SDLC |
| [3. Stage and gate deltas](#3-stage-and-gate-deltas) | Additions to SPEC, PLAN, and EXECUTE |
| [4. Artifact locations](#4-artifact-locations) | Where agentic artifacts live |
| [5. Runtime and roles](#5-runtime-and-roles) | Role decisions for evaluation work |
| [6. Risk enforcement profile delta](#6-risk-enforcement-profile-delta) | Agentic evaluation requirements by risk level |
| [7. Agentic-specific rules](#7-agentic-specific-rules) | Additional executable constraints |

---

## 1. Purpose

This document adds deterministic requirements needed for AI-agent application delivery: tool contracts, quality evaluation, cost controls, and safety policy. It does not replace baseline SDLC; it tightens it for non-deterministic behavior.

---

## 2. Domain selection

The Discovery interview (baseline SDLC stage task `spec/1a`) MUST ask this question verbatim before stage task `1b`:

> "Does this release include LLM-driven behavior whose correctness cannot be verified with deterministic pass/fail tests alone?"

Selection rule:

- If the answer is `No`, use baseline SDLC at [../sdlc/sdlc.md](../sdlc/sdlc.md).
- If the answer is `Yes`, use this agentic extension and its templates.

This rule is mandatory in Discovery. A seed-level hint MAY be present, but seed content is not required to determine the domain.

---

## 3. Stage and gate deltas

### 3.1 Spec delta (`spec/1b`-`spec/1d`)

Use [templates/spec-agentic-template.md](templates/spec-agentic-template.md) instead of the baseline spec template.

The agentic spec adds four required sections:

- Section 9: Tool schemas
- Section 10: Evaluation rubric and baseline
- Section 11: Cost budget
- Section 12: Safety policy

`SPEC-EXIT` for agentic projects is satisfied only if all baseline `SPEC-EXIT` checks and all additional checks in the agentic template pass.

### 3.2 Plan delta (`plan/2a`-`plan/2c`)

Use [templates/plan-agentic-template.md](templates/plan-agentic-template.md) instead of the baseline plan template.

Agentic planning adds eval-harness-first orchestration:

- Eval harness work items MUST use ID pattern `W-<n>-eval`.
- At least one `W-<n>-eval` item MUST be sequenced before any `W-<m>` item that introduces LLM-driven behavior.

`PLAN-EXIT` for agentic projects is satisfied only if all baseline `PLAN-EXIT` checks and all additional checks in the agentic template pass.

### 3.3 Execute delta (`execute/3a`-`execute/3m`)

Baseline execute stage tasks and ordering remain unchanged.

`EXECUTE-EXIT` is extended with one additional mandatory condition:

6. For every `W-<n>` that introduces or modifies LLM-driven behavior, at least one corresponding `execute/3f/W-<n>` replay-log entry MUST record evaluation scores that are greater than or equal to the baseline thresholds declared in `spec.md` Section 10.

All six conditions (baseline 1-5 plus condition 6 above) MUST hold before requesting `EXECUTE-EXIT` approval.

---

## 4. Artifact locations

In addition to baseline SDLC artifact locations:

- Evaluation datasets and fixtures: `tests/eval/data/`
- Evaluation harness code: `tests/eval/`
- Evaluation run outputs (machine-readable): `reports/eval/`
- Prompt/policy fixtures for safety tests: `tests/safety/`

If the project uses alternate paths, those paths MUST be declared in `spec.md` Section 10 (dataset path) and Section 12 (safety test assets).

---

## 5. Runtime and roles

No new mandatory agent role is introduced.

- The baseline `Test Agent` remains the owner of evaluation execution under stage task `3f`.
- The default agent MAY configure a dedicated eval-focused custom agent, but this is optional and does not change stage-task ownership.

This resolves the role question: evaluation is a testing responsibility, not a separate required stage.

---

## 6. Risk enforcement profile delta

Agentic evaluation requirements by risk level:

- Level 1: Evaluation harness is REQUIRED, but minimum dataset size MAY be small if Section 10 thresholds are still statistically meaningful.
- Levels 2-5: Evaluation harness is REQUIRED with production-representative coverage.

Rationale: non-deterministic behavior requires measurable quality controls at every risk level.

---

## 7. Agentic-specific rules

1. Tool schemas are part of the specification contract and therefore MUST live in spec (Section 9), not only in plan.
2. Acceptance criteria in Section 8 MUST be operationalized through measurable thresholds; vague quality adjectives are prohibited unless quantified in Section 10.
3. Cost ceilings in Section 11 are release gates. A release that cannot satisfy budget constraints MUST be marked `Escalate` at `execute/3m` unless thresholds are explicitly re-approved.
4. Safety policy in Section 12 MUST include prohibited input/output classes, PII handling, jailbreak handling, and escalation behavior.
5. Replay-log evidence for agentic quality must be auditable: `execute/3f/W-<n>` entries MUST reference the evaluation report artifact path under `reports/eval/`.

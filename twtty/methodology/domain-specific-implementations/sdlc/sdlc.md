# SDLC Domain-Specific Implementation

> This document extends the [Core TWTTY Specification](../../core-twtty-methodology.md). It MUST NOT weaken the core's approval rules, stage order, or traceability requirements (see [core — Core TWTTY Specification vs. Domain-Specific Implementation](../../core-twtty-methodology.md#core-twtty-specification-vs-domain-specific-implementation)).

## In this document

| Section | Purpose |
|---------|---------|
| [1. Purpose](#1-purpose) | What this implementation is and how it maps to the core stages |
| [2. Pipeline summary](#2-pipeline-summary) | Visual summary of the SDLC pipeline |
| [3. Stage and stage task details](#3-stage-and-stage-task-details) | Stage tasks, agent roles, outputs, and stage exit gates |
| [4. Artifact locations](#4-artifact-locations) | Where each stage's artifacts are written |
| [5. Runtime profile (GitHub Copilot)](#5-runtime-profile-github-copilot) | Runtime, agent modes, and runtime features |
| [6. Guardrails profile](#6-guardrails-profile) | Guardrail categories negotiated during PLAN |
| [7. Risk enforcement profile](#7-risk-enforcement-profile) | Applicable stage tasks, gate strictness, and context isolation per risk level |
| [8. SDLC-specific rules](#8-sdlc-specific-rules) | Rules specific to software delivery |
| [9. Execution rules](#9-execution-rules) | Software-delivery extensions to the core execution rules |

---

## 1. Purpose

This document is a Software Development Life Cycle (SDLC) domain-specific implementation of the [Core TWTTY Specification](../../core-twtty-methodology.md). It maps the four canonical TWTTY stages (`SEED → SPEC → PLAN → EXECUTE`) to concrete stage tasks, artifacts, agent roles, and approval gates for software delivery. In this implementation, EXECUTE includes delivery and operations.

---

## 2. Pipeline summary

This section is a visual summary of the SDLC pipeline. [Section 3 — Stage and stage task details](#3-stage-and-stage-task-details) is authoritative for execution order, stage tasks, and stage exit gates.

```text
                              TWTTY SDLC Pipeline

    SEED ─────▶ SPEC ─────▶ PLAN ─────────────────────────────▶ EXECUTE
   Intent    Requirements  Strategy            Build + Validate + Deploy + Operate

  +-----------+--------------------------+----------------------+--------------------------------------+
  |   SEED    |           SPEC           |         PLAN         |               EXECUTE                |
  +-----------+--------------------------+----------------------+--------------------------------------+
  | 0a Intent | 1a Discovery interview   | 2a Architecture      | 3a Setup                             |
  |           | 1b Business requirements | 2b Design            | 3b Implement                         |
  |           | 1c Use cases             | 2c Orchestration     | 3c Code review                       |
  |           | 1d Technical spec        |                      | 3d Code scanning                     |
  |           |                          |                      | 3e Security                          |
  |           |                          |                      | 3f Test                              |
  |           |                          |                      | 3g CI/CD pipeline                    |
  |           |                          |                      | 3h Infrastructure as code            |
  |           |                          |                      | 3i Deployment                        |
  |           |                          |                      | 3j Smoke tests                       |
  |           |                          |                      | 3k Monitoring                        |
  |           |                          |                      | 3l Observability                     |
  |           |                          |                      | 3m Iteration                         |
  +-----------+--------------------------+----------------------+--------------------------------------+
  | seed/     | spec/spec.md      (R1)   | plan/plan.md   (R1)  | repository source / tests / infra /  |
  | seed.md   | spec/spec-R2.md          | plan/plan-R2.md      | .github/ (see Artifact locations)    |
  |           | spec/spec-R3.md   ...    | plan/plan-R3.md ...  |                                      |
  +-----------+--------------------------+----------------------+--------------------------------------+
  | replay-execution/ (appended throughout all stages and releases)                                    |
  |   replay-execution.md                                              (single-file layout, default)   |
  |   - or -                                                                                           |
  |   replay-execution-<period>.md  ...                                (chunked layout, optional)      |
  +----------------------------------------------------------------------------------------------------+
                                                                                  │
                              ◀──── Feedback loop ── next release ────────────────┘
```

Each stage is informed by the prior stage output. No stage begins until the prior stage's exit gate (`SEED-EXIT`, `SPEC-EXIT`, `PLAN-EXIT`, or `EXECUTE-EXIT`) is approved.

The EXECUTE stage tasks listed above are the **default** set. The Planning Agent tailors the applied EXECUTE subset to the project's risk level per [Section 7 — Risk enforcement profile](#7-risk-enforcement-profile), which is the single source of truth. SPEC and PLAN stage tasks apply at every risk level.

---

## 3. Stage and stage task details

### Default agent as orchestrator

The default Copilot agent applies the TWTTY method recursively. Before producing the artifact for any stage task, the default agent decides whether the named ROLE (e.g., "Spec Agent", "Architecture Agent", "Setup Agent") is fulfilled by the default agent itself or by a custom Copilot agent at `.github/agents/<name>.agent.md`. If a custom agent is needed, the default agent configures it through a TWTTY loop and records the decision in the replay-execution log before the role-bearing work begins. **Agent column names in stage-task tables denote ROLES, not mandated identities** — this principle applies across §3.1 Seed, §3.2 Spec, §3.3 Plan, and §3.4 Execute.

> **For the Human User: this is invisible by default.** The default agent makes agent-selection decisions on your behalf, asks plain-language questions when it needs your input, and only surfaces custom-agent configuration when there is a clear benefit (e.g., a specialized domain, repeated work, or strict tool restrictions). The terms "default agent", "custom agent", "ROLE", and "TWTTY loop" are internal vocabulary — you should never have to learn them to use this methodology. If the default agent ever asks you about agent configuration, it MUST explain *why* in plain language and offer to proceed with the default agent if you prefer not to engage with the question.

Examples (illustrative, not prescriptive):

- **Seed (3.1)**: usually fulfilled by the default agent — small, conversational, no specialization needed.
- **Spec (3.2)**: default agent often suffices; a custom Spec Agent may help on large or regulated projects.
- **Plan (3.3)**: a project with multiple architects may benefit from separate Architecture, Design, and Planning agents; a small project rarely does.
- **Execute (3.4)**: separate Setup, Test, Security, and Deploy agents may pay off when the project is large enough that tool restrictions and specialized instructions reduce errors. Otherwise, the default agent handles the lifecycle.

### 3.1 Seed

| Stage task | Agent | Output |
|------------|-------|--------|
| 0a. Intent | Human User (with AI Agent assistance per [core Section 11.2](../../core-twtty-methodology.md#112-on-first-contact)) | `<project-folder>/seed/seed.md` — a copy of [`twtty/templates/seed-prompt-template.md`](../../../templates/seed-prompt-template.md) with both required sections (`## What I Want To Build` and `## Done Looks Like`) completed. |

**Stage exit gate (`SEED-EXIT`).** All four conditions MUST hold; the AI Agent MUST verify conditions 1–3 mechanically before requesting approval for condition 4:

1. The file `<project-folder>/seed/seed.md` exists.
2. The file contains both required `## What I Want To Build` and `## Done Looks Like` H2 sections.
3. Neither section contains the template placeholder text (`[Describe your project...]`, `[How will you know it's complete?...]`) and both sections contain non-whitespace content.
4. The Human User's `Approval outcome` is `Approved` or `Approved with changes` (per [core Section 5 — Replay-execution log format](../../core-twtty-methodology.md#replay-execution-log-format)).

**Replay-log entry on `SEED-EXIT`:**
- `<stage>/<stage-task>` = `seed/0a`
- `<approval-gate-name>` = `SEED-EXIT`
- `Artifact / path changed` MUST be `<project-folder>/seed/seed.md`

### 3.2 Spec

| Stage task | Agent | Protocol | Output |
|------------|-------|----------|--------|
| 1a. Discovery interview | Spec Agent | Discovery (core [Section 4.1](../../core-twtty-methodology.md#41-interview-me)) | Elicited context held in the agent's working memory. Per [core Section 4.1](../../core-twtty-methodology.md#41-interview-me), individual Q&A pairs MUST NOT be logged; 1a produces exactly one replay-log entry, recorded on interview termination (see below). |
| 1b. Business requirements | Spec Agent | TWTTY loop (core [Section 11.5](../../core-twtty-methodology.md#115-the-twtty-loop)) | Sections 1–4 (Goals, Stakeholders, Success metrics, Constraints) of `<project-folder>/spec/spec.md`, drafted from the [spec template](templates/spec-template.md). |
| 1c. Use cases | Spec Agent | TWTTY loop | Section 5 (Use cases) of `<project-folder>/spec/spec.md`. |
| 1d. Technical specification | Spec Agent | TWTTY loop | Sections 6–8 (FR, NFR, Acceptance criteria) of `<project-folder>/spec/spec.md`. |

Acronyms used in the table: **FR** (Functional Requirements), **NFR** (Non-Functional Requirements), **AC** (Acceptance Criteria), **UC** (Use Case).

> **Note:** `spec.md` is intentionally a single file (not split into separate documents). See the design-decision note at the top of the [spec template](templates/spec-template.md) for the rationale.

For subsequent Release Scopes, the artifact path is `<project-folder>/spec/spec-<release-id>.md` (see [core Section 11.3](../../core-twtty-methodology.md#113-on-new-release-scope)).

**Intra-stage stage tasks 1a, 1b, 1c.** Each is approved through its own protocol cycle (Discovery for 1a, TWTTY loop for 1b/1c) and produces its own replay-execution log entry with `<approval-gate-name>` = `—`. Only 1d's approval triggers `SPEC-EXIT`.

**Discovery interview (1a) termination.** The interview MUST end with an explicit termination prompt approved by the Human User. The Spec Agent proposes: *"End of discovery; proceed to 1b Business requirements."* On approval, the agent appends exactly one replay-log entry for 1a (`spec/1a`, `<approval-gate-name>` = `—`, `Execution outcome:` = `end of discovery`, `Artifact / path changed:` = `—`). This is the only `spec/1a` log entry produced; per [core Section 4.1](../../core-twtty-methodology.md#41-interview-me) individual Q&A pairs MUST NOT be logged. 1b MUST NOT start before this entry is recorded.

**Stage exit gate (`SPEC-EXIT`).** All three conditions MUST hold; the AI Agent MUST verify conditions 1–2 mechanically before requesting approval for condition 3:

1. The file `<project-folder>/spec/spec.md` (or `<project-folder>/spec/spec-<release-id>.md` for a subsequent release) exists.
2. The file passes every check in the [spec template's `SPEC-EXIT` validation checklist](templates/spec-template.md#spec-exit-validation-checklist).
3. The Human User's `Approval outcome` is `Approved` or `Approved with changes` (per [core Section 5](../../core-twtty-methodology.md#replay-execution-log-format)).

**Replay-log entry shapes:**

| Stage task | `<stage>/<stage-task>` | `<approval-gate-name>` | `Artifact / path changed` |
|------------|------------------------|------------------------|---------------------------|
| 1a (termination, only entry) | `spec/1a` | `—` | `—` |
| 1b | `spec/1b` | `—` | `<project-folder>/spec/spec.md` (or `spec-<release-id>.md`) |
| 1c | `spec/1c` | `—` | `<project-folder>/spec/spec.md` (or `spec-<release-id>.md`) |
| 1d (final) | `spec/1d` | `SPEC-EXIT` | `<project-folder>/spec/spec.md` (or `spec-<release-id>.md`) |

### 3.3 Plan

| Stage task | Agent | Output |
|------------|-------|--------|
| 2a. Architecture | Architecture Agent | Section 1 (Architecture) of `<project-folder>/plan/plan.md`, drafted from the [plan template](templates/plan-template.md). |
| 2b. Design | Design Agent | Section 2 (Design) of `<project-folder>/plan/plan.md`. |
| 2c. Orchestration | Planning Agent | Section 3 (Orchestration) of `<project-folder>/plan/plan.md`. |

> **Note:** `plan.md` is intentionally a single file (not split into separate documents). See the design-decision note at the top of the [plan template](templates/plan-template.md) for the rationale.

For subsequent Release Scopes, the artifact path is `<project-folder>/plan/plan-<release-id>.md` (see [core Section 11.3](../../core-twtty-methodology.md#113-on-new-release-scope)).

**Intra-stage stage tasks 2a, 2b.** Each is approved through its own TWTTY loop cycle (core [Section 11.5](../../core-twtty-methodology.md#115-the-twtty-loop)) and produces its own replay-execution log entry with `<approval-gate-name>` = `—`. Only 2c's approval triggers `PLAN-EXIT`.

**Stage exit gate (`PLAN-EXIT`).** All three conditions MUST hold; the AI Agent MUST verify conditions 1–2 mechanically before requesting approval for condition 3:

1. The file `<project-folder>/plan/plan.md` (or `<project-folder>/plan/plan-<release-id>.md` for a subsequent release) exists.
2. The file passes every check in the [plan template's `PLAN-EXIT` validation checklist](templates/plan-template.md#plan-exit-validation-checklist).
3. The Human User's `Approval outcome` is `Approved` or `Approved with changes` (per [core Section 5](../../core-twtty-methodology.md#replay-execution-log-format)).

**Replay-log entry shapes:**

| Stage task | `<stage>/<stage-task>` | `<approval-gate-name>` | `Artifact / path changed` |
|------------|------------------------|------------------------|---------------------------|
| 2a | `plan/2a` | `—` | `<project-folder>/plan/plan.md` (or `plan-<release-id>.md`) |
| 2b | `plan/2b` | `—` | `<project-folder>/plan/plan.md` (or `plan-<release-id>.md`) |
| 2c (final) | `plan/2c` | `PLAN-EXIT` | `<project-folder>/plan/plan.md` (or `plan-<release-id>.md`) |

### 3.4 Execute

| Stage task | Agent | Output |
|------------|-------|--------|
| 3a. Setup | Setup Agent | Repository and environment ready |
| 3b. Implement | Implementation Agent | Working software increments |
| 3c. Code review | Code Review Agent | Quality and maintainability review |
| 3d. Code scanning | Code Scanning Agent | SAST, dependency, and license results |
| 3e. Security | Security Agent | Threat modeling and security checks |
| 3f. Test | Test Agent | Unit, integration, and end-to-end results |
| 3g. CI/CD pipeline | Deployment Agent | Build and deployment automation |
| 3h. Infrastructure as code | Deployment Agent | IaC templates |
| 3i. Deployment | Deployment Agent | Running system in target environment |
| 3j. Smoke tests | Deployment Agent | Post-deploy validation |
| 3k. Monitoring | Monitoring Agent | Alerts and dashboards |
| 3l. Observability | Observability Agent | Logs, metrics, and traces |
| 3m. Iteration | Human + Agents | Feedback and next-cycle updates |

**Stage exit gate:** Acceptance criteria met, deployment validated, monitoring and observability live, and outcomes recorded in the replay-execution log.

---

## 4. Artifact locations

SEED, SPEC, and PLAN artifacts are written to `<project-folder>/<stage>/` as defined in [core Section 5](../../core-twtty-methodology.md#5-repository-layout). EXECUTE artifacts are written to their natural locations in the repository:

| Stage task | Canonical location |
|------------|--------------------|
| 3a Setup, 3b Implement | Project source tree (e.g., `src/`, language-conventional layout) |
| 3c Code review, 3d Code scanning, 3e Security | Tooling reports under `reports/` or platform-native (e.g., GitHub code scanning) |
| 3f Test | Test tree (e.g., `tests/`, `__tests__/`, language-conventional) |
| 3g CI/CD pipeline | `.github/workflows/` (or platform-equivalent) |
| 3h Infrastructure as code | `infra/` (or `iac/`, `terraform/`, `bicep/` as appropriate) |
| 3i Deployment, 3j Smoke tests | Pipeline definitions plus smoke-test scripts under `tests/smoke/` or pipeline-native |
| 3k Monitoring, 3l Observability | Configuration under `infra/observability/` plus platform-native dashboards |

The replay-execution log MUST be appended to throughout all stages using the entry format defined in [core Section 5 — Replay-execution log format](../../core-twtty-methodology.md#replay-execution-log-format).

---

## 5. Runtime profile (GitHub Copilot)

This SDLC implementation runs in **GitHub Copilot**. Either runtime below MAY play the agent roles:

| Runtime | Recommended for | Notes |
|---------|-----------------|-------|
| **VS Code Agent mode** | Code-heavy projects (recommended default) | Inline diffs, collapsible subagent panels, visual approval gates make the TWTTY loop feel natural |
| **Copilot CLI** | Ops, runbooks, headless or remote environments | Terminal-native; better for scripting and CI |

Each agent in the pipeline is a role played by the chosen runtime. Context-isolation requirements per risk level are defined in [Section 7 — Risk enforcement profile](#7-risk-enforcement-profile).

### 5.1 Agent modes

The Planning Agent selects the appropriate mode for each stage task.

| Mode | Description | TWTTY usage |
|------|-------------|--------------|
| **Interactive** *(default)* | The user explicitly approves each tool action. | The default for every stage. Implements the TWTTY loop. |
| **Autopilot** | The agent runs fully autonomously without approval prompts. | Used when the spec is precise and the work is low risk. |
| **Plan** | The agent generates a multi-step plan, waits for user approval, then executes. | Used during the Plan stage. |
| **Fleet** (`/fleet`) | The agent decomposes work into parallel subtasks executed by subagents. | Used when work items are independent and can run concurrently. |

### 5.2 Runtime features

| Feature | Command / Location | TWTTY usage |
|---------|--------------------|--------------|
| **Custom Agents** | `.github/agents/<name>.md` | Each pipeline role is defined as a persistent custom agent with focused instructions, tools, and optional model selection. |
| **Skills** | Per-agent skill declarations | Atomic actions (run tests, open PR, scan dependencies, generate docs, etc.). Agents declare which actions they need; the runtime invokes them when appropriate. Custom skills can be added per project. |
| **AGENTS.md** | Repository root | Project-wide instructions that all agents read. Used to encode TWTTY conventions, workflow standards, and project context. |
| **GitHub Issues** | Repository issue tracker | Work management backbone for EXECUTE: each non-trivial work item is tracked as an issue, then implemented through branch and PR flow. |
| **Subagents** | Auto-spawned or `/agent <name>` | Isolated-context agents for specialized subtasks. Required for risk levels 4–5 (see [Section 7](#7-risk-enforcement-profile)). |
| **Delegate** | `/delegate` | Hands off a fully specified work item to the GitHub Copilot Coding Agent (cloud, async) for issue-to-PR execution. |
| **MCP Servers** | Per-agent configuration | Connects agents to external tools, data sources, or alternate models. |

---

## 6. Guardrails profile

During the Plan stage, the Planning Agent guides the user through establishing industry-standard guardrails appropriate to the project. Guardrails are **negotiated, not prescribed**, and are determined through the TWTTY loop based on the project's scope, technology stack, and risk level.

| Category | Examples |
|----------|----------|
| **Security** | Secrets management, dependency scanning, least-privilege access |
| **Quality** | Testing strategy, linting, type safety, code review gates |
| **Architecture** | Separation of concerns, API contract design, dependency boundaries |
| **Operations** | CI/CD pipelines, environment parity, observability |
| **Process** | Change-management conventions, branch strategy, approval workflows |

---

## 7. Risk enforcement profile

This profile defines how the SDLC implementation enforces TWTTY at each [risk level](../../core-twtty-methodology.md#8-risk-calibration). It is the single source of truth for which stage tasks apply, gate strictness, and agent context isolation per level.

| Level | Applicable EXECUTE stage tasks | Gate strictness | Agent context isolation |
|:-----:|--------------------------------|-----------------|-------------------------|
| **1** | 3a, 3b, 3f | Stage exit gates only | Shared context |
| **2** | Level 1 + 3c, 3g | Stage exit gates only | Shared context |
| **3** | Level 2 + 3d, 3i, 3j, 3k | Stage exit gates; stage task gates SHOULD apply | Shared context acceptable |
| **4** | Full EXECUTE set (3a–3m) | Stage exit and stage task gates MUST be enforced | Each agent role MUST run in an isolated context (subagent or custom agent) |
| **5** | Full EXECUTE set + formal review gates + external controls where required | All gates MUST be enforced and MUST NOT be skipped | Each agent role MUST run in an isolated context |

SPEC and PLAN stage tasks apply at every level. The Planning Agent MAY combine them at levels 1–2 where appropriate.

If the runtime cannot satisfy the isolation or gate requirements for the confirmed risk level, the agent MUST escalate per [core Section 9](../../core-twtty-methodology.md#9-failure-handling).

---

## 8. SDLC-specific rules

These rules are specific to software delivery and extend (do not replace) the core rules.

- In this implementation, deployment and operations are part of EXECUTE, not separate top-level stages.
- For software projects in GitHub, EXECUTE follows an issue-driven PR lifecycle: issue → branch → validate → pull request → review → merge.

---

## 9. Execution rules

These rules extend the core TWTTY rules ([Section 11.7](../../core-twtty-methodology.md#117-rules)) with software-delivery specifics.

- **Follow GitHub Copilot best practices** for prompts and context engineering.
- **Never skip a gate.** At risk levels 4–5, all gates MUST be enforced (see [Section 7](#7-risk-enforcement-profile)).
- **Use branch-per-work-item and PR-based integration.** Direct push to the default branch MUST NOT be used unless the repository is explicitly operating in solo/direct-push mode.
- **Use issue-based work management.** Each non-trivial execution item MUST map to a GitHub issue with clear scope, owner, and acceptance criteria.
- **Guide the user through tooling.** When a stage task requires a specific Copilot mode or feature, walk the user through the configuration step by step.
- **Honor the risk level.** Use the context-isolation and gate-strictness defined in [Section 7](#7-risk-enforcement-profile) for the confirmed risk level.

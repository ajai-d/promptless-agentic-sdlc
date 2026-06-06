# Tell Me What To Tell You (TWTTY)

> **A framework for AI-assisted work where AI proposes each next step and guides execution, while humans stay in control.**

TWTTY is a methodology for working with AI agents that removes the burden of prompt engineering. Instead of crafting prompts yourself, you provide a Project Seed (seed prompt) that captures the project's overall intent, and the AI Agent proposes each next step and the prompt to execute it. The AI Agent executes only after your explicit approval or modification. Every interaction is captured in a replay-execution log that serves as both project history and a reproducible reference.

This document is the canonical and normative Core TWTTY Specification for AI agents.

## Spec intent and applicability

- Primary audience: AI Agents that must execute TWTTY consistently.
- Secondary audience: humans reviewing or governing execution.
- Applicability: this spec SHOULD be readable and executable by any AI Agent.

---

## In this spec

| Section | Purpose |
|---------|---------|
| [1. Overview](#1-overview) | What TWTTY is and the problems it solves |
| &nbsp;&nbsp;&nbsp;&nbsp;[Normative Keywords And Consistency Rules](#normative-keywords-and-consistency-rules) | Normative term usage and mandatory execution consistency rules |
| [2. Core concepts](#2-core-concepts) | Key terms used throughout the methodology |
| [3. How it works](#3-how-it-works) | The TWTTY loop explained step by step |
| [4. Interaction protocols](#4-interaction-protocols) | Interview Me and the TWTTY loop |
| [5. Repository layout](#5-repository-layout) | Required folders and files |
| [6. Runtime](#6-runtime) | Runtime guidance is owned by the active domain-specific implementation |
| [7. Guardrails](#7-guardrails) | Guardrails are owned by the active domain-specific implementation |
| [8. Risk calibration](#8-risk-calibration) | How the pipeline adapts to project risk |
| [9. Failure handling](#9-failure-handling) | Retry, abandon, and escalation semantics |
| [10. Limitations](#10-limitations) | Honest constraints of the methodology |
| [11. Agent protocol](#11-agent-protocol) | Operating instructions for AI agents |
| [12. Reference](#12-reference) | Related documents |

---

## 1. Overview

### What is TWTTY?

**TWTTY ("Tell Me What To Tell You")** is a domain-agnostic framework for AI-assisted work where control remains with the Human User and execution is driven by the AI Agent. The Human User defines project intent with a Project Seed. The AI Agent proposes each next step and the prompt to execute it, and progression is controlled by Approval Gates where the Human User approves or modifies the proposed prompt. The AI Agent executes only approved prompts and records approved prompts and outcomes in the Replay-Execution Log.

### Core lifecycle

TWTTY uses four core stages in order:

```
SEED → SPEC → PLAN → EXECUTE
```

- **Seed** defines the intent for the active scope.
- **Spec** defines requirements and acceptance criteria.
- **Plan** defines execution strategy and orchestration.
- **Execute** carries out the approved plan.

### Core TWTTY Specification vs. Domain-Specific Implementation

- **Core TWTTY Specification** — The mandatory rules that apply in every domain. These include the stage order (`SEED -> SPEC -> PLAN -> EXECUTE`), Approval Gates, and replay-execution logging.
- **Domain-specific implementation** — A domain-specific adaptation of the Core TWTTY Specification that defines stage tasks, required artifacts, and agent roles.

This document is the Core TWTTY Specification. Domain-specific implementations are maintained separately. One software-delivery domain-specific implementation is available at [domain-specific-implementations/sdlc.md](domain-specific-implementations/sdlc.md).

Domain-specific implementations MAY extend the Core TWTTY Specification, but MUST NOT weaken approval rules, stage order, or traceability requirements.

### The problem TWTTY solves

TWTTY turns seeded intent into a repeatable implementation workflow. The Human User provides intent and approvals, the AI Agent drives specification, planning, and execution, and each approved prompt and result is captured in a replay-execution log.

| Challenge | Without TWTTY | With TWTTY |
|-----------|----------------|-------------|
| *"I don't know what to ask the AI."* | Trial and error. | The AI interviews you to surface the right requirements. |
| *"My process isn't repeatable."* | Knowledge lives in one person's head. | Every step is captured in a replay-execution log. |
| *"Others can't onboard quickly."* | Tribal knowledge, shadowing. | A reproducible sequence of prompts, approvals, and results that supports faster onboarding and handoff. |
| *"I don't know which agent mode to use."* | Mode selection is ad hoc and inconsistent across tasks. | The plan assigns the appropriate agent mode to each task. |
| *"Quality varies by person."* | Inconsistent prompting and decision quality across contributors. | Standardized prompts and Approval Gates improve consistency across contributors. |
| *"I lost track of what was done."* | Reconstruct from memory. | Built-in history with documented decisions. |
| *"I'm starting from scratch again."* | Reinvent every time. | Fork an existing replay-execution log, adapt, and ship faster. |

---

## Normative Keywords And Consistency Rules

The terms MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative keywords in this spec when capitalized.

1. Agents MUST use canonical TWTTY stage and Approval Gate names as defined in this spec.
2. Agents MUST execute stages in order: SEED -> SPEC -> PLAN -> EXECUTE.
3. Agents MUST NOT skip Approval Gates when a gate is defined. Each gate requires explicit human approval.
4. Agents MUST record every approved prompt and result in the replay-execution log using the entry format defined in [Section 5 — Replay-execution log format](#replay-execution-log-format). At minimum each entry MUST include: stage/stage task, Approval Gate name, approval outcome, approved prompt, execution outcome, artifact/path changed, and timestamp or sequence ID.
5. Agents SHOULD prefer stable, explicit prompts over stylistic variation.
6. Agents SHOULD avoid introducing synonyms for stage, gate, and artifact names.
7. Agents MAY optimize implementation details only when they do not alter approved intent, gate outcomes, or traceability requirements.

---

## 2. Core concepts

| Term | Definition |
|------|------------|
| **Human User** | The person using TWTTY and approving or modifying prompts. |
| **AI Agent** | The AI execution agent used by the project that proposes the next step (with the prompt to execute it) and executes approved prompts. |
| **Project** | The specific body of work organized under one Project Seed and the `seed/`, `spec/`, `plan/`, and `replay-execution/` folders in `<project-folder>/`. |
| **Stage** | One of the four ordered lifecycle phases: SEED, SPEC, PLAN, EXECUTE. |
| **Stage Task** | A discrete unit of work performed within a stage, usually with its own artifact, review step, or Approval Gate. |
| **Approval Gate** | A required approval checkpoint that controls progression; the Human User must approve or modify before the AI Agent continues. Stage exit Approval Gates control progression from one stage to the next; stage task Approval Gates control progression between stage tasks within a stage. |
| **Project Seed** | The project-level statement of intent that establishes the long-lived project direction. Saved in `<project-folder>/seed/seed.md`. |
| **Release Scope** | A bounded increment of project change, such as a release, enhancement, or additional feature, identified by a release ID (for example, R2). |
| **Spec** | A set of requirements, constraints, and acceptance criteria for the project or active Release Scope. The canonical baseline spec is saved in `<project-folder>/spec/spec.md`. Each subsequent Release Scope MUST have its own release-scoped spec at `<project-folder>/spec/spec-<release-id>.md` (see [Section 11.2](#112-on-subsequent-runs)). |
| **Plan** | A set of execution strategies, work breakdown, and sequencing decisions for the project or active Release Scope. The canonical top-level plan is saved in `<project-folder>/plan/plan.md`. Each subsequent Release Scope MUST have its own release-scoped plan at `<project-folder>/plan/plan-<release-id>.md` (see [Section 11.2](#112-on-subsequent-runs)). |
| **Execute** | The stage where work is performed, validated, and iterated. |
| **Replay-Execution Log** | A markdown file capturing every approved prompt and result from the project, including user modifications where applicable. Acts as both project history and a reference template for similar future work. See [Limitations](#10-limitations) for caveats on direct replay. Saved in `<project-folder>/replay-execution/replay-execution.md`. |
| **Agent Role** | A specialized AI responsibility used in execution (for example, Spec Agent or Implementation Agent). Whether Agent Roles share a single AI context or run in isolated contexts is determined by the active domain-specific implementation and the project's risk level (see [Section 8](#8-risk-calibration)). |
| **Domain-specific implementation** | A domain-specific mapping of the four core stages to concrete stage tasks, artifacts, and agent roles. The active implementation is selected from `twtty/methodology/domain-specific-implementations/<implementation>.md` (for example, `twtty/methodology/domain-specific-implementations/sdlc.md`). |
| **Risk level** | A 1–5 calibration of the project's risk profile that determines how much process the pipeline enforces. See [Section 8](#8-risk-calibration). |

Domain-specific terms (for example, software-delivery terms) are defined in each domain-specific implementation.

---

## 3. How it works

The operational mechanism of TWTTY is an interaction loop repeated inside every stage. The loop has five steps; the canonical definition is in [Section 11.4](#114-the-twtty-loop).

```text
[Step 1] AI Agent proposes the next step (what and why) and writes the prompt
  |
  v
[Step 2] Human User approves, modifies, or rejects the proposed prompt
  |
  v
[Step 3] AI Agent executes the approved prompt
  |
  v
[Step 4] Human User reviews the result
  |
  v
[Step 5] AI Agent records the approved prompt and result to replay-execution log
  |
  +-----------------------------+
              |
              v
        Back to Step 1
```

### Stage gates

Each stage has a stage exit Approval Gate that controls progression to the next stage. Stages MAY also define stage task Approval Gates that control progression between stage tasks within the stage.

| Stage | Stage exit Approval Gate |
|------|-----------|
| **Seed** | Intent is explicit and approved. |
| **Spec** | Acceptance criteria are approved. |
| **Plan** | Execution strategy and sequencing are approved. |
| **Execute** | Outcomes meet the acceptance criteria, are documented, and are ready for iteration or closure. |

### Approval options

In Step 2 of the TWTTY interaction loop, the Human User has three allowed responses:

| Response | Effect |
|----------|--------|
| **"Approved"** / **"Go"** | AI Agent executes the approved prompt as written. |
| **"Approved with changes: ..."** | AI Agent incorporates the modification into the prompt, then executes. |
| **"Reject — try again because ..."** | AI Agent enters the Refine state and revises the prompt (see [Section 9](#9-failure-handling)). |

---

## 4. Interaction protocols

TWTTY uses two distinct interaction protocols depending on what the AI needs from the user.

### 4.1 Interview Me

Used by the **discovery Agent Role** at the start of a project.

The discovery Agent Role has no prior knowledge of what the Human User wants to build. It conducts a structured interview by asking targeted questions to elicit goals, constraints, edge cases, and acceptance criteria. After discovery is complete, execution continues through the standard TWTTY loop.

> **Note:** The discovery Agent Role should propose sensible defaults when the Human User lacks domain expertise. Pure interviewing without informed challenge risks weak requirements.

On approval of the elicited content, the discovery Agent Role MUST write it to the canonical spec file under `<project-folder>/spec/` (`spec.md` for the baseline, or `spec-<release-id>.md` for a subsequent Release Scope) and append a replay-log entry per [Section 5 — Replay-execution log format](#replay-execution-log-format).

The interview protocol runs once per project during initial discovery, unless a later Release Scope requires additional discovery. Subsequent stages use the standard TWTTY loop (propose and write prompt -> approve/modify -> execute -> review -> record).

### 4.2 TWTTY loop

Used by **every non-discovery Agent Role** in the pipeline. These Agent Roles bring domain-specific expertise to their assigned responsibilities. Rather than interviewing the Human User, they propose the next step, write the prompt, execute on approval (or after incorporating modifications), and record the result.

---

## 5. Repository layout

Folder structure for the TWTTY repository

| Path | Purpose |
|------|---------|
| `twtty/` | The methodology reference set, including this document. |
| `<project-folder>/` | Project root for one specific project (create new for a new project; reuse if it already exists). |
| `<project-folder>/seed/seed.md` | The project seed expressing project-level intent. |
| `<project-folder>/spec/spec.md` | The canonical baseline spec for the active domain-specific implementation. |
| `<project-folder>/spec/spec-<release-id>.md` | A release-scoped spec for each Release Scope after the baseline (for example, `spec-R2.md`). |
| `<project-folder>/plan/plan.md` | The canonical top-level plan for the active domain-specific implementation. |
| `<project-folder>/plan/plan-<release-id>.md` | A release-scoped plan for each Release Scope after the baseline (for example, `plan-R2.md`). |
| `<project-folder>/replay-execution/replay-execution.md` | The step-by-step playbook captured during execution. |

Each `<project-folder>` MUST have exactly one project seed at `<project-folder>/seed/seed.md`.

Recommended naming for `<project-folder>`: a stable slug (lowercase, hyphen-separated; for example, `inventory-management`).

Example for a project named `inventory-management`:

```text
inventory-management/
  seed/
    seed.md
  spec/
    spec.md
  plan/
    plan.md
  replay-execution/
    replay-execution.md
```

### Replay-execution log format

The replay-execution log is a single markdown file containing one `###` section per recorded entry, in append order. Each entry MUST include the following fields:

````markdown
### <sequence-id> · <stage>/<stage-task> · <approval-gate-name>

- **Timestamp:** <ISO-8601>
- **Approval outcome:** Approved | Approved with changes | Reject | Abandon | Escalate
- **Approved prompt:**

  ```
  <verbatim prompt as executed>
  ```

- **Execution outcome:** <one-line summary>
- **Artifact / path changed:** `<path>` (one per line if multiple)
- **Notes:** <optional rationale, especially for Abandon or Escalate>
````

Entries MUST appear in monotonically increasing `<sequence-id>` order. The file MUST start with an `# H1` title and a one-line description; all subsequent content MUST be entry sections.

---

## 6. Runtime

Core TWTTY is runtime-agnostic. Runtime-specific mode and feature guidance is defined in the active domain-specific implementation.

For the software-delivery implementation, see `twtty/methodology/domain-specific-implementations/sdlc.md`.

---

## 7. Guardrails

Guardrail definitions are implementation-specific and are owned by the active domain-specific implementation.

For the software-delivery implementation, see `twtty/methodology/domain-specific-implementations/sdlc.md`.

---

## 8. Risk calibration

The TWTTY pipeline scales with the project's risk profile on a 1–5 scale.

| Level | Profile |
|:-----:|---------|
| 1 | Throwaway prototype or experiment |
| 2 | Internal workflow, low blast radius |
| 3 | Team-facing deliverable, moderate stakes |
| 4 | Customer-facing or revenue-impacting |
| 5 | Regulated, safety-critical, or mission-critical |

Higher risk levels MUST apply stricter enforcement of stages, stage tasks, and Approval Gates. The exact enforcement profile per risk level is defined by the active domain-specific implementation.

The risk level MUST be confirmed with the Human User on first contact (see [Section 11.1](#111-on-first-contact)) and used to calibrate the pipeline before any stage begins.

---

## 9. Failure handling

The methodology defines explicit semantics for when things go wrong.

| State | Trigger | Response |
|-------|---------|----------|
| **Retry** | A stage task fails on first attempt (transient error, simple mistake). | Agent retries once with an adjusted approach. If the retry also fails, escalate. |
| **Refine** | User responds "Reject" to a proposed prompt (step 2) or to a presented result (step 4). | Agent revises based on user feedback, then re-proposes. Maximum three refinement cycles per artifact. |
| **Abandon** | Three refinement cycles fail to converge, or the user explicitly says "abandon this approach." | Agent records the failure in the replay-execution log, returns to the prior approved artifact, and asks the user how to proceed. |
| **Escalate** | The agent detects ambiguity it cannot resolve, a retry that also failed, or a risk-level mismatch (the runtime cannot satisfy the enforcement profile required for the confirmed risk level — for example, isolated contexts unavailable when the implementation requires them). | Agent halts, surfaces the issue clearly, and waits for human direction. Never proceeds on assumption. |

Every abandon and escalate event is recorded in `<project-folder>/replay-execution/replay-execution.md` with rationale, supporting future learning and process refinement.

---

## 10. Limitations

TWTTY is not a silver bullet. Users should understand the following constraints.

| Constraint | Explanation |
|------------|-------------|
| **Replay logs degrade over time** | Dependencies, model behavior, and file state shift. A six-month-old log replayed in a fresh repository will likely require adaptation. Treat the log as a **structured reference**, not a guaranteed-replayable script. |
| **Velocity tax** | The full pipeline trades speed for safety. For low-risk, routine, or repetitive tasks, this overhead may exceed the benefit. Use risk calibration to right-size the process. |
| **Discovery quality depends on the user** | The discovery Agent Role can only elicit what the user knows. Domain expertise gaps produce weak requirements. The agent mitigates this by proposing defaults but cannot fully replace expertise. |
| **Cost** | Multiple agents with verbose context and interactive loops consume more tokens than single-agent autonomous execution. Plan for higher inference costs on complex projects. |
| **Role isolation depends on implementation** | Whether Agent Roles share a single AI context or run in isolated contexts is determined by the active domain-specific implementation and the project's risk level. |
| **No native evaluation framework** | The methodology does not currently include automated evaluation of agent behavior or outcome quality. Teams should add their own evals for production use. |

---

## 11. Agent protocol

> This section provides operating instructions for AI agents executing TWTTY. Human readers can skip to [Section 12](#12-reference).

### 11.1 On first contact

1. Determine the `<project-folder>` name from user intent (stable slug).
2. If `<project-folder>` exists, reuse it. If it does not exist, create it with the standard structure.
3. Ensure the project seed exists in `<project-folder>/seed/seed.md`. If it does not exist, draft it from the user's intent and obtain explicit Human User approval before proceeding. The approved seed satisfies the Seed stage Approval Gate.
4. Assess the project's [risk level](#8-risk-calibration) (1–5) and confirm it with the user.
5. Calibrate the pipeline (which stage tasks apply) based on the confirmed risk level.
6. Proceed to SPEC by entering the discovery interview (see [Section 4.1](#41-interview-me)).

### 11.2 On subsequent runs

Subsequent releases go through only SPEC → PLAN → EXECUTE, beginning with the discovery interview. Confirm the active release ID with the user before starting.

For each subsequent Release Scope, the AI Agent MUST create a new release-scoped spec document at `<project-folder>/spec/spec-<release-id>.md` (for example, `spec-R2.md`) and a new release-scoped plan document at `<project-folder>/plan/plan-<release-id>.md`. The baseline `spec.md` and `plan.md` MUST NOT be overwritten.

### 11.3 For each stage and stage task

1. Announce which agent role you are playing and which stage or stage task you are entering.
2. Use the agent's assigned protocol:
  - **Discovery Agent Role** → Interview Me (elicit requirements; propose defaults when the user lacks expertise).
  - **All non-discovery agents** → the TWTTY loop in [Section 11.4](#114-the-twtty-loop). Run the loop one or more times to produce the defined artifact for the stage task.
3. Wait for explicit human approval at each Approval Gate before advancing to the next stage task or stage.

### 11.4 The TWTTY loop

| Step | Action |
|:----:|--------|
| 1 | Propose the next step for the active stage task — including what it is and why — and write the prompt to execute it. |
| 2 | Wait for the user to approve, modify, or reject. If modifications are provided, incorporate them. |
| 3 | Execute. |
| 4 | Present the result for review. |
| 5 | On approval, write the produced artifact to its canonical location under `<project-folder>/<stage>/` (see [Section 5](#5-repository-layout)), then append an entry for the approved prompt and result to `<project-folder>/replay-execution/replay-execution.md`. If the runtime cannot write directly to the repository, return the produced changes to the Human User. |

Repeat for every stage task until the pipeline is complete.

### 11.5 Failure semantics

Follow the table in [Section 9](#9-failure-handling). Never proceed on assumption when escalation is warranted.

### 11.6 Rules

- **Optimize plans** for the shortest path to done given the risk level.
- **Use structured prompts.** Each prompt MUST state the goal, scope, inputs, expected output, and acceptance criteria, and reference relevant artifacts (seed, spec, plan, prior replay-log entries) when applicable.
- **Document continuously.** The replay-execution log MUST capture every approved prompt and result (per [Rule 4](#normative-keywords-and-consistency-rules)) plus every abandon and escalate event.
- **One recorded entry per approved prompt-and-result** to preserve atomic, traceable history.
- **When uncertain, ask.** Do not assume.

Implementations MAY define additional execution rules (workflow, tooling, runtime, and gate-enforcement behavior). For the software-delivery implementation, see `twtty/methodology/domain-specific-implementations/sdlc.md`.

---

## 12. Reference

| To... | See... |
|-------|--------|
| Start building | [`../getting-started.md`](../getting-started.md) |
| Create a seed prompt | [`../templates/seed-prompt-template.md`](../templates/seed-prompt-template.md) |

---

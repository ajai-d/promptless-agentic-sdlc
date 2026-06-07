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
| [4. Interaction protocols](#4-interaction-protocols) | Discovery interview vs. standard TWTTY loop |
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
4. Agents MUST record every approved prompt and result in the replay-execution log using the entry format defined in [Section 5 — Replay-execution log format](#replay-execution-log-format). At minimum each entry MUST include: stage/stage task, Approval Gate name, approval outcome, approved prompt, execution outcome, artifact/path changed, timestamp, and sequence ID.
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
| **Spec** | A set of requirements, constraints, and acceptance criteria for the project or active Release Scope. The Spec MUST be precise enough that any competent agent's output will pass the same acceptance criteria (see [Section 11.7](#117-rules)). The canonical baseline spec is saved in `<project-folder>/spec/spec.md`. Each subsequent Release Scope MUST have its own release-scoped spec at `<project-folder>/spec/spec-<release-id>.md` (see [Section 11.3](#113-on-new-release-scope)). |
| **Plan** | A set of execution strategies, work breakdown, and sequencing decisions for the project or active Release Scope. The canonical top-level plan is saved in `<project-folder>/plan/plan.md`. Each subsequent Release Scope MUST have its own release-scoped plan at `<project-folder>/plan/plan-<release-id>.md` (see [Section 11.3](#113-on-new-release-scope)). |
| **Execute** | The stage where work is performed, validated, and iterated. |
| **Replay-Execution Log** | A markdown log capturing every approved prompt and result across all stages and releases, including user modifications where applicable. Acts as both project history and a reference template for similar future work. See [Limitations](#10-limitations) for caveats on direct replay. The default location is a single file at `<project-folder>/replay-execution/replay-execution.md`; the log MAY be chunked into multiple time-period files under `<project-folder>/replay-execution/` per [Section 5 — Replay-execution log format](#replay-execution-log-format). |
| **Agent Role** | A specialized AI responsibility used in execution (for example, Spec Agent or Implementation Agent). Whether Agent Roles share a single AI context or run in isolated contexts is determined by the active domain-specific implementation and the project's risk level (see [Section 8](#8-risk-calibration)). |
| **Domain-specific implementation** | A domain-specific mapping of the four core stages to concrete stage tasks, artifacts, and agent roles. The active implementation is selected from `twtty/methodology/domain-specific-implementations/<implementation>.md` (for example, `twtty/methodology/domain-specific-implementations/sdlc.md`). |
| **Risk level** | A 1–5 calibration of the project's risk profile that determines how much process the pipeline enforces. See [Section 8](#8-risk-calibration). |

Domain-specific terms (for example, software-delivery terms) are defined in each domain-specific implementation.

---

## 3. How it works

The operational mechanism of TWTTY is an interaction loop repeated inside every stage. The loop has five steps; the canonical definition is in [Section 11.5](#115-the-twtty-loop).

```text
[Step 1] AI Agent proposes the next step (what, why, the prompt, and the tools to invoke)
  |
  v
[Step 2] Human User approves, modifies, or rejects the proposed prompt
  |
  v
[Step 3] AI Agent executes the approved prompt
  |
  v
[Step 4] Human User reviews the result (approves or rejects)
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
| **Spec** | The Spec (requirements, constraints, and acceptance criteria) is approved AND meets the precision bar in [Section 11.7](#117-rules). |
| **Plan** | Execution strategy and sequencing are approved. |
| **Execute** | Outcomes meet the acceptance criteria, are documented, and are ready for iteration or closure. |

### Approval options

In Step 2 of the TWTTY interaction loop, the Human User has three allowed responses:

| Response | Effect |
|----------|--------|
| **"Approved"** / **"Go"** | AI Agent executes the approved prompt as written. |
| **"Approved with changes: ..."** | AI Agent incorporates the modification into the prompt, then executes. |
| **"Reject — try again because ..."** | AI Agent enters the Refine state and revises the prompt (see [Section 9](#9-failure-handling)). The Human User MUST provide a reason; the reason informs the revised proposal. |

In Step 4, the Human User reviews the executed result and responds with either an approval (which advances the loop to Step 5) or a rejection. A Step 4 rejection enters the same Refine state as a Step 2 rejection, treating the entire execution — prompt plus result — as the artifact to revise.

---

## 4. Interaction protocols

TWTTY uses two distinct interaction protocols depending on what the AI needs from the user.

### 4.1 Interview Me

Used by the **discovery Agent Role** at the start of a project and at the start of every new Release Scope.

The discovery Agent Role has no prior knowledge of what the Human User wants to build for the active scope. It conducts a structured interview by asking targeted questions to elicit goals, constraints, edge cases, and acceptance criteria. After discovery is complete, execution continues through the standard TWTTY loop.

> **Note:** The discovery Agent Role should propose sensible defaults when the Human User lacks domain expertise. Pure interviewing without informed challenge risks weak requirements.

On approval of the elicited content, the discovery Agent Role MUST write it to the canonical spec file under `<project-folder>/spec/` (`spec.md` for the baseline, or `spec-<release-id>.md` for a new Release Scope) and append exactly one replay-log entry per [Section 5 — Replay-execution log format](#replay-execution-log-format) recording the approved spec. Individual interview questions and answers exchanged during elicitation are not logged; only the final approved spec is. Before requesting approval, the discovery Agent Role MUST self-check the spec against the precision rule in [Section 11.7](#117-rules) and surface any remaining ambiguities to the Human User for resolution. The approved spec satisfies the SPEC stage exit Approval Gate.

The interview protocol runs at two points: once at initial discovery (full project scope), and once at the start of every new Release Scope (release-scoped; the existing Project Seed is reused). All non-discovery activity uses the standard TWTTY loop (propose and write prompt -> approve/modify -> execute -> review -> record).

### 4.2 TWTTY loop

Used by **every non-discovery Agent Role** in the pipeline. These Agent Roles bring domain-specific expertise to their assigned responsibilities. Rather than interviewing the Human User, they propose the next step, write the prompt, execute on approval (or after incorporating modifications), and record the result.

---

## 5. Repository layout

### TWTTY methodology

```text
twtty/
  getting-started.md                                  (human-facing quick start)
  methodology/
    core-twtty-methodology.md                         (this spec — the normative core)
    domain-specific-implementations/
      sdlc.md                                         (software-delivery implementation)
  templates/
    seed-prompt-template.md                           (template the Human User copies)
```

### Starting a project

The Human User performs exactly one setup action: copy `twtty/templates/seed-prompt-template.md` to `<project-folder>/seed/seed.md` and fill in the project's intent. Everything else (`spec/`, `plan/`, `replay-execution/`, and any EXECUTE artifacts) is generated by the AI Agent through the TWTTY interaction protocols ([Section 4](#4-interaction-protocols)) under explicit Human User approval.

Recommended naming for `<project-folder>`: a stable slug (lowercase, hyphen-separated; for example, `inventory-management`).

### Project layout

The AI Agent MUST write project artifacts to the canonical paths shown below. Example for a project named `inventory-management` with a baseline release (`R1`) and two subsequent Release Scopes (`R2`, `R3`):

```text
inventory-management/
  seed/
    seed.md                                           (Human User: copies template)
  spec/
    spec.md                                           (AI Agent: baseline spec — R1)
    spec-R2.md                                        (AI Agent: release-scoped spec — R2)
    spec-R3.md                                        (AI Agent: release-scoped spec — R3)
    ...                                               (AI Agent: spec-<release-id>.md per release)
  plan/
    plan.md                                           (AI Agent: baseline plan — R1)
    plan-R2.md                                        (AI Agent: release-scoped plan — R2)
    plan-R3.md                                        (AI Agent: release-scoped plan — R3)
    ...                                               (AI Agent: plan-<release-id>.md per release)
  replay-execution/
    replay-execution.md                               (AI Agent: log — single-file layout, spans all releases)
```

Each `<project-folder>` MUST have exactly one project seed at `<project-folder>/seed/seed.md`. Release-scoped spec and plan files MUST be named `spec-<release-id>.md` and `plan-<release-id>.md`; the baseline `spec.md` and `plan.md` MUST NOT be overwritten (see [Section 11.3](#113-on-new-release-scope)). Paths for EXECUTE-stage outputs are defined by the active domain-specific implementation (for software delivery, this typically means standard source-code locations like `src/`, `tests/`, etc.). The replay-execution log MAY be chunked into multiple time-period files under `<project-folder>/replay-execution/`; see [Replay-execution log file layout](#replay-execution-log-file-layout).

### Pipeline and artifacts

The following diagram shows the canonical mapping from stages to output artifacts across the baseline release (`R1`) and subsequent Release Scopes (`R2`, `R3`, `...`). Domain-specific implementations refine the stage tasks within each stage; the artifact layout shown here is normative.

```text
                              TWTTY Pipeline and Artifacts

    SEED ─────▶ SPEC ───────────────────────────▶ PLAN ─────────────────▶ EXECUTE
   Intent    Requirements + acceptance criteria   Strategy + sequencing   Implement the plan

  +-----------+-------------------------+-------------------------+--------------------------+
  |   SEED    |          SPEC           |          PLAN           |         EXECUTE          |
  +-----------+-------------------------+-------------------------+--------------------------+
  | seed/     | spec/spec.md     (R1)   | plan/plan.md     (R1)   | Implementation-defined   |
  | seed.md   | spec/spec-R2.md         | plan/plan-R2.md         | (per active domain-      |
  |           | spec/spec-R3.md  ...    | plan/plan-R3.md  ...    | specific implementation) |
  +-----------+-------------------------+-------------------------+--------------------------+
  | replay-execution/ (appended throughout all stages and releases)                          |
  |   replay-execution.md                                  (single-file layout, default)     |
  |   - or -                                                                                 |
  |   replay-execution-<period>.md  ...                    (chunked layout, optional)        |
  +------------------------------------------------------------------------------------------+
                                                                              │
                              ◀──── Feedback loop ── next release ────────────┘
```

### Replay-execution log format

The replay-execution log is markdown content stored under `<project-folder>/replay-execution/` and containing one `###` section per recorded entry, in append order. Each entry MUST include the following fields:

````markdown
### <sequence-id> · <stage>/<stage-task> · <approval-gate-name>

- **Timestamp:** <ISO-8601 UTC, e.g., 2026-06-05T18:45:00Z>
- **Approval outcome:** Approved | Approved with changes | Abandon | Escalate
- **Approved prompt:**

  ```
  <verbatim prompt as executed>
  ```

- **Execution outcome:** <one-line summary>
- **Artifact / path changed:** `<path>` (one per line if multiple)
- **Notes:** <rationale; REQUIRED when Approval outcome is `Abandon` or `Escalate`; optional otherwise>
````

Entries MUST appear in monotonically increasing `<sequence-id>` order. The `<sequence-id>` MUST be a zero-padded integer of at least three digits (for example, `001`, `002`, ..., `010`, ..., `100`) so that entries sort lexicographically. Timestamps MUST be UTC ISO-8601 so resume and audit operations are deterministic across contributors and time zones.

Only outcomes that change project state are logged: `Approved`, `Approved with changes`, `Abandon`, and `Escalate`. `Reject` responses during a Refine cycle ([Section 9](#9-failure-handling)) MUST NOT produce log entries; only the eventual approved result (or the terminal `Abandon` / `Escalate`) is recorded.

The `<approval-gate-name>` field MUST contain the gate name when the entry corresponds to an Approval Gate event (stage exit or stage task gate); otherwise it MUST be `—` (em dash).

The canonical stage-exit gate names are `SEED-EXIT`, `SPEC-EXIT`, `PLAN-EXIT`, and `EXECUTE-EXIT`. These four names MUST be used verbatim for stage-exit entries. Domain-specific implementations MAY define additional stage-task gate names but MUST NOT redefine the four canonical stage-exit names.

Entries with `<stage>` = `meta` are administrative records that do not correspond to project stages. All `meta/*` entries MUST use `<approval-gate-name>` = `—`. The defined `meta/*` stage tasks are:

- **`meta/init`** — chunked-layout initialization (see [Replay-execution log file layout](#replay-execution-log-file-layout)). `Execution outcome` MUST be `chunking enabled, granularity=<period>`.
- **`meta/risk-level`** — confirmed risk level (see [Section 11.2 step 4](#112-on-first-contact)). `Execution outcome` MUST be the numeric level (1–5).
- **`meta/backfill`** — authorized drift backfill on resume (see [Section 11.1 step 4](#111-on-resume)). `Approval outcome` MUST be `Approved with changes`; `Notes` MUST describe the out-of-band change being backfilled.

#### Replay-execution log file layout

The log MAY be stored as either a single file or as multiple time-period chunk files. A project MUST use exactly one layout (single-file OR chunked), never both; mixing layouts within a project is prohibited. Both layouts MUST satisfy the rules above.

- **Single-file layout (default).** The entire log lives in `<project-folder>/replay-execution/replay-execution.md`. The file MUST start with an `# H1` title and a one-line description; all subsequent content MUST be entry sections.
- **Chunked layout (optional).** The log is split across multiple time-period files in `<project-folder>/replay-execution/`. The following rules apply:
  - Chunk files MUST be named `replay-execution-<period>.md`. `<period>` MUST be one of: `YYYY`, `YYYY-Qn`, `YYYY-MM`, `YYYY-Www`, or `YYYY-MM-DD`.
  - Exactly one granularity MUST be used per project; mixing or switching granularities is prohibited.
  - The single-file `replay-execution.md` MUST NOT exist in the same folder.
  - Each chunk MUST start with an `# H1` title including the period (for example, `# Replay-Execution Log — 2026-06`) and a one-line description.
  - Entries are appended to the chunk whose period contains the entry's timestamp. `<sequence-id>` values remain globally unique and monotonically increasing across all chunks.
  - The first entry in the first chunk MUST be a `meta/init` entry (see [Replay-execution log format](#replay-execution-log-format)) with `Execution outcome: chunking enabled, granularity=<period>`.

On resume ([Section 11.1](#111-on-resume)), the AI Agent MUST read every `replay-execution*.md` file in `<project-folder>/replay-execution/` in lexicographic filename order and treat their concatenation as the authoritative log. The naming above guarantees lexicographic order matches chronological order.

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

The risk level MUST be confirmed with the Human User on first contact (see [Section 11.2](#112-on-first-contact)) and used to calibrate the pipeline before any stage begins.

---

## 9. Failure handling

The methodology defines explicit semantics for when things go wrong.

| State | Trigger | Response |
|-------|---------|----------|
| **Retry** | A stage task fails on first attempt (transient error, simple mistake). | Agent retries once with an adjusted approach. If the retry also fails, escalate. |
| **Refine** | User responds "Reject" to a proposed prompt (step 2) or to a presented result (step 4). | Agent revises based on user feedback, then re-proposes. Maximum three refinement cycles per artifact; the counter is maintained in-session by the agent and is not persisted to the replay-execution log (Reject responses are not logged per [Section 5](#replay-execution-log-format)). |
| **Abandon** | Three refinement cycles fail to converge, or the user explicitly says "abandon this approach." | Agent records the failure in the replay-execution log, returns to the prior approved artifact, and asks the user how to proceed. If no prior approved artifact exists for the active stage (for example, abandoning during the first discovery interview before any spec was approved), the agent MUST escalate per the Escalate row below. |
| **Escalate** | The agent detects ambiguity it cannot resolve, a retry that also failed, or a risk-level mismatch (the runtime cannot satisfy the enforcement profile required for the confirmed risk level — for example, isolated contexts unavailable when the implementation requires them). | Agent halts, surfaces the issue clearly, and waits for human direction. Never proceeds on assumption. |

Every abandon and escalate event is recorded in the replay-execution log under `<project-folder>/replay-execution/` with rationale, supporting future learning and process refinement.

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

On every invocation, before proposing any action, the AI Agent MUST follow [11.1 On resume](#111-on-resume) to establish the current project state. The resume protocol then routes execution to one of the other flows: [11.2 On first contact](#112-on-first-contact) when no replay-execution log exists yet, [11.3 On new Release Scope](#113-on-new-release-scope) when the most recent release is complete and the Human User requests a new release, or continuation of the in-progress release.

### 11.1 On resume

The AI Agent MUST be able to resume an in-progress project regardless of where the prior session stopped. The replay-execution log plus the existing stage artifacts are the authoritative sources for project state.

1. Determine the candidate `<project-folder>` slug: if the Human User provided one, use it verbatim; otherwise propose a slug derived from the user's intent (lowercase, hyphen-separated, stable for the project's lifetime — for example, `inventory-management`) and obtain explicit confirmation before proceeding. If `<project-folder>/replay-execution/` does not exist or contains no `replay-execution*.md` files, route to [11.2 On first contact](#112-on-first-contact). A `<project-folder>` containing only a Human-User-prepared `seed/seed.md` and no replay-execution log is still a first-contact state.
2. Read the replay-execution log in full: every `replay-execution*.md` file in `<project-folder>/replay-execution/`, in lexicographic filename order, treated as a single concatenated log (see [Section 5 — Replay-execution log format](#replay-execution-log-format)).
3. Read every existing stage artifact in `<project-folder>/`: `seed/seed.md`, all `spec/*.md`, all `plan/*.md`, and any EXECUTE artifacts (locations defined by the active domain-specific implementation).
4. Reconcile log against artifacts. If a stage artifact exists with no corresponding log entry for its creation or update, the AI Agent MUST treat this as a drift condition and escalate per [Section 9](#9-failure-handling). The Human User MAY authorize the drift; on authorization the AI Agent MUST append a `meta/backfill` entry (see [Section 5](#replay-execution-log-format)) before continuing.
5. Identify the active risk level from the most recent `meta/risk-level` entry in the log and apply its pipeline calibration. If no `meta/risk-level` entry exists, escalate per [Section 9](#9-failure-handling).
6. Find the most recent non-`meta/*` entry in the log. Determine the next action from its fields:
   - **`Approval outcome` = `Abandon` or `Escalate`** → surface the entry's `Notes` to the Human User and wait for direction. Do not propose continuation autonomously.
   - **`<approval-gate-name>` = `EXECUTE-EXIT`** → the active release is complete. Announce completion and wait for Human User direction; the AI Agent MUST NOT propose further work autonomously. If a new Release Scope is requested, route to [11.3 On new Release Scope](#113-on-new-release-scope).
   - **`<approval-gate-name>` ∈ {`SEED-EXIT`, `SPEC-EXIT`, `PLAN-EXIT`}** → begin the next stage at its first stage task.
   - **`<approval-gate-name>` = `—`** → the entry is a non-gate stage task; begin the next stage task within the active stage.
   - **`<approval-gate-name>` is any other value** → it is a domain-defined stage-task gate; defer routing to the active domain-specific implementation.
7. Before continuing, announce to the Human User: the active release ID, the active risk level, the most recent recorded entry, and the proposed next stage or stage task. Obtain explicit confirmation before re-entering the TWTTY loop.

### 11.2 On first contact

First contact creates the baseline release, which is identified as `R1`. R1 artifacts use the unsuffixed filenames `spec.md` and `plan.md` (see [Section 11.3](#113-on-new-release-scope) for subsequent releases).

1. Use the confirmed `<project-folder>` slug from [Section 11.1 step 1](#111-on-resume).
2. Create `<project-folder>` with the standard structure.
3. Ensure the project seed exists in `<project-folder>/seed/seed.md`. If a seed already exists (for example, the Human User copied the template per [Section 5](#starting-a-project)), treat it as the user's initial draft and MUST NOT overwrite without explicit approval. Otherwise draft it from the user's intent. In both cases, obtain explicit Human User approval before proceeding. On approval, append a replay-log entry recording the approved seed (per [Section 5](#replay-execution-log-format); `<approval-gate-name>` = `SEED-EXIT`). The approved seed satisfies the SEED stage exit Approval Gate.
4. Assess the project's [risk level](#8-risk-calibration) (1–5) and confirm it with the user. On confirmation, append a `meta/risk-level` entry to the log (see [Section 5](#replay-execution-log-format)).
5. Calibrate the pipeline (which stage tasks apply) based on the confirmed risk level.
6. Proceed to SPEC by entering the discovery interview (see [Section 4.1](#41-interview-me)).

### 11.3 On new Release Scope

The baseline release is identified as `R1` and its artifacts use the unsuffixed names `spec.md` and `plan.md`. Subsequent Release Scopes (`R2`, `R3`, ...) go through only SPEC → PLAN → EXECUTE. Confirm the new release ID with the user before starting and run a release-scoped discovery interview limited to the new release's intent (the existing Project Seed is reused; full re-discovery is not required).

For each new Release Scope, the AI Agent MUST create a new release-scoped spec document at `<project-folder>/spec/spec-<release-id>.md` (for example, `spec-R2.md`) and a new release-scoped plan document at `<project-folder>/plan/plan-<release-id>.md`. The baseline `spec.md` and `plan.md` MUST NOT be overwritten.

Only one Release Scope MAY be active at a time. The AI Agent MUST NOT start a new Release Scope while the previous release's EXECUTE stage exit gate has not been approved. If the Human User requests a new Release Scope before the active release is complete, the AI Agent MUST surface the conflict and ask whether to (a) finish the active release first, (b) `Abandon` the active release and start the new one, or (c) defer the new request.

### 11.4 For each stage and stage task

1. Announce which agent role you are playing and which stage or stage task you are entering.
2. Use the agent's assigned protocol:
  - **Discovery Agent Role** → Interview Me (elicit requirements; propose defaults when the user lacks expertise).
  - **All non-discovery agents** → the TWTTY loop in [Section 11.5](#115-the-twtty-loop). Run the loop one or more times to produce the defined artifact for the stage task.
3. Wait for explicit human approval at each Approval Gate before advancing to the next stage task or stage.

### 11.5 The TWTTY loop

| Step | Action |
|:----:|--------|
| 1 | Propose the next step for the active stage task — including what it is, why, the prompt to execute it, and the tools, MCP servers, and external services to be invoked. |
| 2 | Wait for the user to approve, modify, or reject. If modifications are provided, incorporate them. |
| 3 | Execute. |
| 4 | Present the result for review. |
| 5 | On approval, write the produced artifact to its canonical location, then append an entry for the approved prompt and result to the replay-execution log under `<project-folder>/replay-execution/` (see [Section 5 — Replay-execution log format](#replay-execution-log-format) for single-file vs. chunked layout). SEED, SPEC, and PLAN artifacts are written to `<project-folder>/seed/`, `<project-folder>/spec/`, and `<project-folder>/plan/` respectively (see [Section 5](#5-repository-layout)). EXECUTE artifacts are written to locations defined by the active domain-specific implementation. If the runtime cannot write directly to the repository, return the produced changes to the Human User. |

Repeat for every stage task until the pipeline is complete.

### 11.6 Failure semantics

Follow the table in [Section 9](#9-failure-handling). Never proceed on assumption when escalation is warranted.

### 11.7 Rules

- **Optimize plans** for the shortest path to done given the risk level.
- **Specs MUST be precise.** Every requirement MUST be unambiguous, every constraint MUST be measurable or testable, and every acceptance criterion MUST be objectively verifiable (pass/fail without subjective judgment). Vague language (for example, "fast", "user-friendly", "robust") MUST be replaced with quantified or operationalized terms before SPEC stage exit. The goal is reproducibility at the acceptance-criteria level: any competent agent's output for the same Spec MUST pass the same acceptance criteria, even if implementation details differ.
- **Propose industry standards, frameworks, and best practices in every stage.** The AI Agent MUST recommend applicable industry standards, frameworks, and best practices in every stage, and ask the Human User whether to adopt them, add others, or proceed without any. The approved selection MUST be recorded in the replay-execution log. Silent adoption is prohibited.
- **Stay in scope.** The AI Agent MUST NOT perform work that falls outside the approved Project Seed and active Spec. If the Human User requests or the agent identifies work outside the approved scope, the agent MUST stop, surface the scope delta, and route it through a Refine cycle (updating the Spec for the current release, or proposing a new Release Scope) before proceeding.
- **Disclose tool use.** In step 1 of the TWTTY loop, the AI Agent MUST list the tools, MCP servers, and external services it intends to invoke to execute the proposed prompt (per [Section 11.5](#115-the-twtty-loop)). Human User approval covers both the prompt and the disclosed tool set; invoking undisclosed tools requires a new loop iteration.
- **Trace acceptance criteria where applicable.** During EXECUTE, every produced artifact SHOULD reference the specific acceptance criterion (or criteria) from the active Spec that it satisfies, when one applies. The reference MAY appear in the artifact itself (for example, as a comment, header, or metadata field) or in the corresponding replay-execution log entry. Artifacts that do not map to a specific acceptance criterion (for example, build scripts, scaffolding, or implementation-internal helpers) are exempt; their approval through the TWTTY loop and entry in the replay-execution log remain mandatory.
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

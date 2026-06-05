# Tell Me What To Tell You (TWTTY)

> **A framework for AI-assisted work where AI proposes each next step and guides execution, while humans stay in control.**

TWTTY is a methodology for working with AI agents that removes the burden of prompt engineering. Instead of crafting prompts yourself, you provide a Project Seed (seed prompt) that captures the project's overall intent, and the AI Agent proposes each next prompt. The AI Agent executes only after your explicit approval or modification. Every interaction is captured in a replay-execution log that serves as both project history and a reproducible reference.

This document is the canonical and normative Core TWTTY Specification for AI agents.

## Spec intent and applicability

- Primary audience: AI Agents that must execute TWTTY consistently.
- Secondary audience: humans reviewing or governing execution.
- Applicability: this spec SHOULD be readable and executable by any AI Agent.

---

## In this spec

| Section | Purpose |
|---------|---------|
| [Overview](#1-overview) | What TWTTY is and the problems it solves |
| [Normative Keywords And Consistency Rules](#normative-keywords-and-consistency-rules) | Normative term usage and mandatory execution consistency rules |
| [Core concepts](#2-core-concepts) | Key terms used throughout the methodology |
| [How it works](#3-how-it-works) | The TWTTY loop explained step by step |
| [Interaction protocols](#4-interaction-protocols) | Interview Me and the TWTTY loop |
| [Repository layout](#5-repository-layout) | Required folders and files |
| [Runtime](#6-runtime) | GitHub Copilot runtime modes and features |
| [Guardrails](#7-guardrails) | Security, quality, and process boundaries |
| [Risk calibration](#8-risk-calibration) | How the pipeline adapts to project risk |
| [Failure handling](#9-failure-handling) | Retry, abandon, and escalation semantics |
| [Limitations](#10-limitations) | Honest constraints of the methodology |
| [Agent protocol](#11-agent-protocol) | Operating instructions for AI agents |
| [Reference](#12-reference) | Related documents |
| [Applying TWTTY to a Domain-Specific Implementation](#13-applying-twtty-to-a-domain-specific-implementation) | How to apply the Core TWTTY Specification through separate domain-specific implementations |

---

## 1. Overview

### What is TWTTY?

**TWTTY ("Tell Me What To Tell You")** is a domain-agnostic framework for AI-assisted work where control remains with the Human User and execution is driven by the AI Agent. The Human User defines project intent with a Project Seed. The AI Agent proposes each next prompt, and progression is controlled by Approval Gates where the Human User approves or modifies the proposed prompt. The AI Agent executes only approved prompts and records approved prompts and outcomes in the Replay-Execution Log.

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
| *"Quality varies by person."* | Inconsistent prompting and decision quality across contributors. | Standardized prompts and approval gates improve consistency across contributors. |
| *"I lost track of what was done."* | Reconstruct from memory. | Built-in history with documented decisions. |
| *"I'm starting from scratch again."* | Reinvent every time. | Fork an existing replay-execution log, adapt, and ship faster. |

---

## Normative Keywords And Consistency Rules

The terms MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative keywords in this spec when capitalized.

1. Agents MUST use canonical TWTTY stage and Approval Gate names as defined in this spec.
2. Agents MUST execute stages in order: SEED -> SPEC -> PLAN -> EXECUTE.
3. Agents MUST NOT skip approval gates when a gate is defined.
4. Agents MUST record every approved prompt and result in the replay-execution log, including at minimum: stage/stage task, approval gate name, approval outcome, approved prompt, execution outcome, artifact/path changed, and timestamp or sequence ID.
5. Agents SHOULD prefer stable, explicit prompts over stylistic variation.
6. Agents SHOULD avoid introducing synonyms for stage, gate, and artifact names.
7. Agents MAY optimize implementation details only when they do not alter approved intent, gate outcomes, or traceability requirements.

---

## 2. Core concepts

| Term | Definition |
|------|------------|
| **Human User** | The person using TWTTY and approving or modifying prompts. |
| **AI Agent** | The AI execution agent used by the project that proposes the next prompt and executes approved prompts. |
| **Project** | The specific body of work organized under one Project Seed and the `seed/`, `spec/`, `plan/`, and `replay-execution/` folders in `<project-folder>/`. |
| **Stage** | One of the four ordered lifecycle phases: SEED, SPEC, PLAN, EXECUTE. |
| **Stage Task** | A discrete unit of work performed within a stage, usually with its own artifact, review step, or Approval Gate. |
| **Approval Gate** | A required approval checkpoint that controls progression; the Human User must approve or modify before the AI Agent continues. |
| **Configuration** | The project-specific setup required to execute the workflow, including agents, instructions, and supporting commands. |
| **Project Seed** | The project-level statement of intent that establishes the long-lived project direction. Saved in `<project-folder>/seed/seed.md`. |
| **Release Scope** | A bounded increment of project change, such as a release, enhancement, or additional feature, identified by a release ID (for example, R2). |
| **Spec** | A set of requirements, constraints, and acceptance criteria for the project or active Release Scope. The spec may be captured in one document or multiple documents. In this methodology, the canonical baseline spec is saved in `<project-folder>/spec/spec.md`, with additional spec artifacts added as needed. |
| **Plan** | A set of execution strategies, work breakdown, sequencing decisions, and definitions of who does what and in what order for the project or active Release Scope. The plan may be captured in one document or multiple documents. In this methodology, the canonical top-level plan is saved in `<project-folder>/plan/plan.md`, with additional plan artifacts added as needed. |
| **Execute** | The stage where work is performed, validated, and iterated. |
| **Replay-Execution Log** | A markdown file capturing every approved prompt and result from the project, including user modifications where applicable. Acts as both project history and a reference template for similar future work. See [Limitations](#10-limitations) for caveats on direct replay. Saved in `<project-folder>/replay-execution/replay-execution.md`. |
| **Agent Role** | A specialized AI responsibility used in execution (for example, Spec Agent or Implementation Agent). For lower-risk projects, a single AI Agent may perform multiple Agent Roles sequentially. For higher-risk projects, Agent Roles are executed in isolated subagent contexts (see [Section 8](#8-risk-calibration)). |
| **Domain-specific implementation** | A domain-specific mapping of the four core stages to concrete stage tasks, artifacts, and agent roles. The active implementation is selected from `twtty/methodology/domain-specific-implementations/sdlc.md`. |
| **Risk level** | A 1–5 calibration of the project's risk profile that determines how much process the pipeline enforces. See [Section 8](#8-risk-calibration). |

Domain-specific terms (for example, software-delivery terms) are defined in each domain-specific implementation.

---

## 3. How it works

The operational mechanism of TWTTY is an interaction loop repeated inside every stage.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   1. AI Agent         →  "Here's what I think we       │
│      proposes prompt     should do next, and here's    │
│                           the prompt to execute."      │
│                                                         │
│   2. Human User       →  Modifies or approves the     │
│                           proposed prompt              │
│                                                         │
│   3. AI Agent         →  Executes the prompt           │
│                                                         │
│   4. Human User       →  Verify the result             │
│                                                         │
│   5. AI Agent         →  Records the approved prompt   │
│                           and result to the replay-    │
│                           execution log                │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↻ repeat
```

### Stage gates

Stage completion is governed by explicit Approval Gates:

Each stage also MAY define one or more stage task Approval Gates. Stage task Approval Gates control progression within a stage; the stage exit Approval Gate controls progression to the next stage.

| Stage | Approval Gate |
|------|-----------|
| **Seed** | Intent is explicit and approved. |
| **Spec** | Requirements and acceptance criteria are approved. |
| **Plan** | Execution strategy and sequencing are approved. |
| **Execute** | Outcomes meet acceptance criteria (or approved variance), are documented, and are ready for iteration or closure. |

For enhancements after the baseline release, the AI Agent MUST collaborate with the Human User to establish the active Release Scope and its release spec, and MUST record the incremental spec entry in one or more spec documents before entering PLAN for that scope.

Each Release Scope after the baseline release MUST proceed through SPEC -> PLAN -> EXECUTE under the existing Project Seed.

### Approval options

In Step 2 of the TWTTY interaction loop, the Human User has three allowed responses:

| Response | Effect |
|----------|--------|
| **"Approved"** / **"Go"** | AI Agent executes the approved prompt as written. |
| **"Approved with changes: ..."** | AI Agent incorporates the modification into the prompt, then executes. |
| **"Reject — try again because ..."** | AI Agent revises the prompt (see [Section 9](#9-failure-handling)). |

The risk calibration (see [Section 8](#8-risk-calibration)) determines whether fast-path (immediate "go") is allowed for a given stage task.

---

## 4. Interaction protocols

TWTTY uses two distinct interaction protocols depending on what the AI needs from the user.

### 4.1 Interview Me

Used by the **discovery Agent Role** at the start of a project.

The discovery Agent Role has no prior knowledge of what the Human User wants to build. It conducts a structured interview by asking targeted questions to elicit goals, constraints, edge cases, and acceptance criteria. After discovery is complete, execution continues through the standard TWTTY loop.

> **Note:** The discovery Agent Role should propose sensible defaults when the Human User lacks domain expertise. Pure interviewing without informed challenge risks weak requirements.

The interview protocol runs once per project during initial discovery, unless a later Release Scope requires additional discovery. Subsequent stages use the standard TWTTY loop (propose and write prompt -> approve/modify -> execute -> review -> record).

### 4.2 TWTTY loop

Used by **every non-discovery Agent Role** in the pipeline. These Agent Roles bring domain-specific expertise to their assigned responsibilities. Rather than interviewing the Human User, they propose the next artifact, write the prompt, execute on approval (or after incorporating modifications), and record the result.

---

## 5. Repository layout

Folder Structure for TWTTY repository

| Path | Purpose |
|------|---------|
| `twtty/` | The methodology reference (this document). |
| `<project-folder>/` | Project root for one specific project (create new for a new project; reuse if it already exists). |
| `<project-folder>/seed/seed.md` | The project seed expressing project-level intent. |
| `<project-folder>/spec/spec.md` | The canonical baseline spec for the active domain-specific implementation. Additional spec documents and incremental spec entries MAY be stored under `<project-folder>/spec/` as needed. |
| `<project-folder>/plan/plan.md` | The canonical top-level plan for the active domain-specific implementation. Additional plan documents and incremental plan artifacts MAY be stored under `<project-folder>/plan/` as needed. |
| `<project-folder>/replay-execution/replay-execution.md` | The step-by-step playbook captured during execution. |

Rule: each `<project-folder>` has exactly one project seed at `<project-folder>/seed/seed.md`.

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

---

## 6. Runtime

TWTTY runs in **GitHub Copilot** — either of two runtimes plays the agent roles:

| Runtime | Recommended for | Notes |
|---------|-----------------|-------|
| **VS Code Agent mode** | Code-heavy projects (recommended default) | Inline diffs, collapsible subagent panels, visual approval gates make the TWTTY loop feel natural |
| **Copilot CLI** | Ops, runbooks, headless or remote environments | Terminal-native; better for scripting and CI |

Each agent in the pipeline is a role played by the chosen runtime. Both runtimes support the same set of modes and features described below.

> **Important:** For projects at risk level 4 or 5 (see [Section 8](#8-risk-calibration)), each agent role must run as a **separate custom agent with an isolated context**, not as different roles played by a single shared context. Cosmetic role separation is acceptable for risk levels 1–3.

### 6.1 Agent modes

The Planning Agent selects the appropriate mode for each stage task.

| Mode | Description | TWTTY usage |
|------|-------------|--------------|
| **Interactive** *(default)* | The user explicitly approves each tool action. | The default for every stage. Implements the TWTTY loop. |
| **Autopilot** | The agent runs fully autonomously without approval prompts. | Used when the spec is precise and the work is low risk. |
| **Plan** | The agent generates a multi-step plan, waits for user approval, then executes. | Used during the Plan stage. |
| **Fleet** (`/fleet`) | The agent decomposes work into parallel subtasks executed by subagents. | Used when work items are independent and can run concurrently. |

### 6.2 Features

| Feature | Command / Location | TWTTY usage |
|---------|--------------------|--------------|
| **Custom Agents** | `.github/agents/<name>.md` | Each pipeline role is defined as a persistent custom agent with focused instructions, tools, and optional model selection. |
| **Skills** | Per-agent skill declarations | Atomic actions (run tests, open PR, scan dependencies, generate docs, etc.). Agents declare which actions they need; the runtime invokes them when appropriate. Custom skills can be added per project. |
| **AGENTS.md** | Repository root | Project-wide instructions that all agents read. Used to encode TWTTY conventions, workflow standards, and project context. |
| **GitHub Issues** | Repository issue tracker | Work management backbone for Execute: each non-trivial work item is tracked as an issue, then implemented through branch and PR flow. |
| **Subagents** | Auto-spawned or `/agent <name>` | Isolated-context agents for specialized subtasks. Required for risk levels 4–5. |
| **Delegate** | `/delegate` | Hands off a fully specified work item to the GitHub Copilot Coding Agent (cloud, async) for issue-to-PR execution. |
| **MCP Servers** | Per-agent configuration | Connects agents to external tools, data sources, or alternate models. |

---

## 7. Guardrails

During the Plan stage, the Planning Agent guides the user through establishing industry-standard guardrails appropriate to the project. Guardrails are **negotiated, not prescribed** — they are determined through the TWTTY loop based on the project's scope, technology stack, and [risk level](#8-risk-calibration).

| Category | Examples |
|----------|----------|
| **Security** | Secrets management, dependency scanning, least-privilege access |
| **Quality** | Testing strategy, linting, type safety, code review gates |
| **Architecture** | Separation of concerns, API contract design, dependency boundaries |
| **Operations** | CI/CD pipelines, environment parity, observability |
| **Process** | Change-management conventions, branch strategy, approval workflows |

---

## 8. Risk calibration

The TWTTY pipeline scales with the project's risk profile. The Planning Agent assesses risk on a 1–5 scale and adjusts the depth of process accordingly.

| Level | Profile | Pipeline behavior |
|:-----:|---------|-------------------|
| **1** | Throwaway prototype or experiment | Minimal stages only. Fast-path approval allowed throughout. Shared context. |
| **2** | Internal workflow, low blast radius | Requirements can be lightweight. Peer review optional. Fast-path allowed for routine work items. Shared context. |
| **3** | Team-facing deliverable, moderate stakes | Full discovery, planning, execution, and validation. Fast-path allowed only for low-impact routine tasks. Shared context acceptable. |
| **4** | Customer-facing or revenue-impacting | Full pipeline including security and quality controls. Fast-path disabled for core delivery and validation stages. **Isolated subagent contexts required.** |
| **5** | Regulated, safety-critical, or mission-critical | Full pipeline plus formal review gates and external controls where required. No fast-path. Mandatory isolated subagents. |

The Planning Agent confirms the assessed risk level with the user during the Plan stage before proceeding.

---

## 9. Failure handling

The methodology defines explicit semantics for when things go wrong.

| State | Trigger | Response |
|-------|---------|----------|
| **Retry** | A stage task fails on first attempt (transient error, simple mistake). | Agent retries up to twice with adjusted approach. |
| **Refine** | User rejects the proposed prompt or result (steps 2 or 5). | Agent revises based on user feedback, then re-proposes. Maximum three refinement cycles per artifact. |
| **Abandon** | Three refinement cycles fail to converge, or the user explicitly says "abandon this approach." | Agent records the failure in the replay-execution log, returns to the prior approved artifact, and asks the user how to proceed. |
| **Escalate** | The agent detects ambiguity it cannot resolve, a guardrail violation, or a risk-level mismatch. | Agent halts, surfaces the issue clearly, and waits for human direction. Never proceeds on assumption. |

Every abandon and escalate event is recorded in `<project-folder>/replay-execution/replay-execution.md` with rationale, supporting future learning and process refinement.

---

## 10. Limitations

TWTTY is not a silver bullet. Users should understand the following constraints.

| Constraint | Explanation |
|------------|-------------|
| **Replay logs degrade over time** | Dependencies, model behavior, and file state shift. A six-month-old log replayed in a fresh repository will likely require adaptation. Treat the log as a **structured reference**, not a guaranteed-replayable script. |
| **Velocity tax** | The full pipeline trades speed for safety. For routine production work, this overhead may exceed the benefit. Use risk calibration to right-size the process. |
| **Discovery quality depends on the user** | The discovery Agent Role can only elicit what the user knows. Domain expertise gaps produce weak requirements. The agent mitigates this by proposing defaults but cannot fully replace expertise. |
| **Cost** | Multiple agents with verbose context and interactive loops consume more tokens than single-agent autonomous execution. Plan for higher inference costs on complex projects. |
| **Single-context role separation is cosmetic** | At risk levels 1–3, all roles share one AI context. Real isolation requires subagents (risk 4–5). |
| **No native evaluation framework** | The methodology does not currently include automated evaluation of agent behavior or outcome quality. Teams should add their own evals for production use. |

---

## 11. Agent protocol

> This section provides operating instructions for AI agents executing TWTTY. Human readers can skip to [Section 12](#12-reference).

### 11.1 On first contact

1. Determine the `<project-folder>` name from user intent (stable slug).
2. If `<project-folder>` exists, reuse it. If it does not exist, create it with the standard structure.
3. Ensure the project seed exists in `<project-folder>/seed/seed.md`. If it does not exist, create it from the user's intent before proceeding.
4. Determine the active release ID and confirm what "done" looks like for that Release Scope.
5. Assess the project's [risk level](#8-risk-calibration) (1–5) and confirm it with the user.
6. Calibrate the pipeline (which stage tasks apply, whether fast-path is allowed, whether subagents are required) based on the confirmed risk level.

### 11.2 For each stage and stage task

1. Announce which agent role you are playing and which stage or stage task you are entering.
2. Use the agent's assigned protocol:
  - **Discovery Agent Role** → Interview Me (elicit requirements; propose defaults when the user lacks expertise).
  - **All non-discovery agents** → TWTTY loop (propose + write prompt, approve/modify, execute, review, record).
3. Produce the defined artifact for the stage task.
4. Wait for explicit human approval at each gate before advancing.
5. Each stage is informed by the prior stage — do not skip ahead.
6. Map the same TWTTY loop to the active domain's equivalent stages and artifacts.

### 11.3 The TWTTY loop

| Step | Action |
|:----:|--------|
| 1 | Explain the concept — what you are about to do and why. |
| 2 | Propose the next artifact for the active domain-specific implementation and write the prompt to execute it. |
| 3 | Wait for the user to approve, modify, or reject. If **"go"** and fast-path is allowed, proceed immediately. If modifications are provided, incorporate them. |
| 4 | Execute. |
| 5 | Present the result for review. |
| 6 | On approval, persist the outcome according to repository permissions: record the approved prompt and result in `<project-folder>/replay-execution/replay-execution.md`, and return produced changes when direct repository writes are not available. |

Repeat for every stage task until the pipeline is complete.

### 11.4 Failure semantics

Follow the table in [Section 9](#9-failure-handling). Never proceed on assumption when escalation is warranted.

### 11.5 Rules

- **Optimize plans** for the shortest path to done given the risk level, minimal token usage, and industry-standard practices.
- **Follow GitHub Copilot best practices** and use structured prompts that conform to context engineering principles.
- **Never skip a gate** at risk levels 4–5. Fast-path is disabled for sensitive stage tasks.
- **Document continuously.** The replay-execution log must capture each step, each abandon, and each escalation.
- **One recorded change-set per artifact** to preserve atomic, traceable history.
- **Use branch-per-work-item and PR-based integration** unless the repository is explicitly operating in solo/direct-push mode.
- **Use issue-based work management** for GitHub projects: each non-trivial execution item maps to a GitHub issue with clear scope, owner, and acceptance criteria.
- **When uncertain, ask.** Do not assume.
- **Guide the user through tooling.** When a stage task requires a specific Copilot mode or feature, walk the user through the configuration step by step.
- **Honor the risk level.** At levels 4–5, use isolated subagent contexts. At levels 1–3, shared context is acceptable.

---

## 12. Reference

| To... | See... |
|-------|--------|
| Start building | [`../getting-started.md`](../getting-started.md) |
| Create a seed prompt | [`../templates/seed-prompt-template.md`](../templates/seed-prompt-template.md) |

---

## 13. Applying TWTTY to a Domain-Specific Implementation

Domain-specific implementations are maintained as dedicated methodology companions. An SDLC implementation is available at:

- [domain-specific-implementations/sdlc.md](domain-specific-implementations/sdlc.md)

This keeps the Core TWTTY Specification separate from domain-specific implementations.
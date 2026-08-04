# Tell Me What To Tell You (TMWTTY)

> **A framework for AI-assisted work where the AI writes the prompts.**

TMWTTY is a methodology for working with AI agents that removes the burden of prompt engineering. Instead of crafting prompts yourself, you provide a short statement of intent — and the AI proposes each next step, writes the prompt, and executes only after your explicit approval or modification. Every interaction is captured in a replay-execution log that serves as both project history and a reproducible reference.

This document is the canonical reference for the TMWTTY methodology. A full Agentic Software Development Life Cycle (SDLC) profile is included as one concrete application of the core method.

---

## In this article

| # | Section | Purpose |
|:-:|---------|---------|
| 1 | [Overview](#1-overview) | What TMWTTY is and the problems it solves |
| 2 | [Core concepts](#2-core-concepts) | Key terms used throughout the methodology |
| 3 | [How it works](#3-how-it-works) | The TMWTTY loop explained step by step |
| 4 | [Interaction protocols](#4-interaction-protocols) | Interview Me and the TMWTTY loop |
| 5 | [Applying TMWTTY to the SDLC](#5-applying-tmwtty-to-the-sdlc) | One concrete application profile (software) |
| 6 | [Repository layout](#6-repository-layout) | Required folders and files |
| 7 | [Runtime](#7-runtime) | GitHub Copilot runtime modes and features |
| 8 | [Guardrails](#8-guardrails) | Security, quality, and process boundaries |
| 9 | [Risk calibration](#9-risk-calibration) | How the pipeline adapts to project risk |
| 10 | [Failure handling](#10-failure-handling) | Retry, abandon, and escalation semantics |
| 11 | [Limitations](#11-limitations) | Honest constraints of the methodology |
| 12 | [Agent protocol](#12-agent-protocol) | Operating instructions for AI agents |
| 13 | [Reference](#13-reference) | Related documents |

---

## 1. Overview

### What is TMWTTY?

**TMWTTY ("Tell Me What To Tell You")** is a domain-agnostic framework for AI-assisted work. The defining characteristic is that **the user does not need to write prompts**. The AI proposes each action, writes the prompt, and executes only after explicit user approval or modification.

### Core lifecycle

TMWTTY has four core stages:

```
SEED → SPEC → PLAN → EXECUTE
```

Everything in a project happens inside one of these four stages.

- **Seed** defines intent.
- **Spec** defines requirements and acceptance criteria.
- **Plan** defines execution strategy and orchestration.
- **Execute** performs delivery, validation, deployment, operations, and iteration as required by the active domain profile.

### Core method vs. domain profile

- **Core method (TMWTTY)** — The reusable loop and governance model: AI writes prompts, human approves or modifies, AI executes, human reviews, AI records.
- **Domain profile (for example, SDLC)** — A domain-specific stage map, artifacts, and agent roles layered on top of the core method.

This document defines the core method first, then shows the SDLC profile as an implementation example.

### The problem TMWTTY solves

| Challenge | Without TMWTTY | With TMWTTY |
|-----------|----------------|-------------|
| *"I don't know what to ask the AI."* | Trial and error. | The AI interviews you to surface the right requirements. |
| *"My process isn't repeatable."* | Knowledge lives in one person's head. | Every step is captured in a replay-execution log. |
| *"Others can't onboard quickly."* | Tribal knowledge, shadowing. | A reproducible sequence of prompts, approvals, and results that any team member can replay end to end. |
| *"I don't know which AI mode to use."* | Chat for everything. | The plan assigns the appropriate mode to each task. |
| *"Quality varies by person."* | Inconsistent prompting. | Standardized prompts produce consistent output. |
| *"I lost track of what was done."* | Reconstruct from memory. | Built-in history with documented decisions. |
| *"I'm starting from scratch again."* | Reinvent every time. | Fork an existing replay-execution log, adapt, and ship faster. |

---

## 2. Core concepts

| Term | Definition |
|------|------------|
| **Seed** | A concise statement of intent. Exactly one active seed exists per project folder and is saved in `<project-folder>/plan/seed.md`. |
| **Spec** | A document defining requirements, constraints, and acceptance criteria. Saved in `<project-folder>/plan/spec.md`. |
| **Plan** | A document defining execution strategy, sequencing, and orchestration. Saved in `<project-folder>/plan/plan.md`. |
| **Execute** | The stage where work is performed, validated, and iterated; may include deployment and operations depending on the domain profile. |
| **Replay-execution log** | A markdown file capturing every approved prompt and result from the project, including user modifications where applicable. Acts as both project history and a reference template for similar future work. See [Limitations](#11-limitations) for caveats on direct replay. Saved in `<project-folder>/replay-execution/replay-execution.md`. |
| **Agent** | A specialized AI role assigned to a single responsibility (for example, Discovery Agent or Delivery Agent). For lower-risk projects, a single AI plays all roles sequentially. For higher-risk projects, real subagents with isolated contexts are used (see [Section 9](#9-risk-calibration)). |
| **Skill** | An atomic capability an agent can invoke (for example, *run tests*, *open a PR*, *search the web*, *generate documentation*). Skills are the building blocks; agents are the personas that orchestrate skills. |
| **Domain profile** | A domain-specific mapping of the four core stages to concrete sub-steps, artifacts, and agent roles. |
| **Branch** | A parallel line of development in Git where a single work item is implemented before merging back. |
| **Issue** | A tracked work item in GitHub (feature, bug, task, or spike) used as the source of truth for scope and status. |
| **Pull Request (PR)** | A request to merge a branch into a target branch (usually `main`) after review and checks. |
| **Risk level** | A 1–5 calibration of the project's risk profile that determines how much process the pipeline enforces. See [Section 9](#9-risk-calibration). |

---

## 3. How it works

The operational mechanism of TMWTTY is an interaction loop repeated inside every stage.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   1. AI proposes      →  "Here's what I think we       │
│      + writes prompt     should do next, and here's    │
│                           the prompt to execute."      │
│                                                         │
│   2. You approve      →  "Approved" / "Approved with   │
│      or modify            these changes: ..."          │
│                                                         │
│   3. AI executes      →  Performs the work             │
│                                                         │
│   4. You review       →  Verify the result             │
│                                                         │
│   5. AI records       →  Records the approved prompt   │
│                           and result to the replay-    │
│                           execution log                │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↻ repeat
```

### Stage gates

Stage completion is governed by explicit gates:

| Stage | Exit gate |
|------|-----------|
| **Seed** | Intent is explicit and approved. |
| **Spec** | Requirements and acceptance criteria are approved. |
| **Plan** | Execution strategy and sequencing are approved. |
| **Execute** | Outcomes meet acceptance criteria (or approved variance), are documented, and are ready for iteration or closure. |

### Approval options

At step 2, the user has three responses:

| Response | Effect |
|----------|--------|
| **"Approved"** / **"Go"** | AI executes the prompt as written. |
| **"Approved with changes: ..."** | AI incorporates the modification into the prompt, then executes. |
| **"Reject — try again because ..."** | AI revises the prompt (see [Section 10](#10-failure-handling)). |

The risk calibration (see [Section 9](#9-risk-calibration)) determines whether fast-path (immediate "go") is allowed for a given sub-step.

---

## 4. Interaction protocols

TMWTTY uses two distinct interaction protocols depending on what the AI needs from the user.

### 4.1 Interview Me

Used by the **discovery-stage agent** at the start of a project.

The discovery-stage agent has no prior knowledge of what the user wants to build. It conducts a structured interview — asking targeted questions to elicit goals, constraints, edge cases, and acceptance criteria. Once discovery is complete, the workflow switches to the standard TMWTTY loop for downstream execution.

> **Note:** The discovery-stage agent should propose sensible defaults when the user lacks domain expertise. Pure interviewing without expert pushback risks weak requirements.

The interview protocol runs once per project, during initial discovery. Subsequent stages use the standard TMWTTY loop (propose + write prompt → approve/modify → execute → review → record).

In the SDLC profile (Section 5), this maps to **Spec sub-step 1a**.

### 4.2 TMWTTY loop

Used by **every non-discovery agent** in the pipeline. These agents bring domain-specific expertise to their assigned responsibilities. Rather than interviewing the user, they propose the next artifact, write the prompt, execute on approval (or after incorporating modifications), and record the result.

---

## 5. Applying TMWTTY to the SDLC

This section is an **application profile**, not the definition of TMWTTY itself. It shows how the core TMWTTY loop can be mapped to software delivery.

When TMWTTY is applied to software development, it uses the same four core stages as the generic method:

```
SEED → SPEC → PLAN → EXECUTE
```

In this SDLC profile, **Execute includes delivery and operations**.

The **authoritative SDLC execution order** is listed in [SDLC stage details](#sdlc-stage-details) below; the diagram is a visual summary.

```
                          TMWTTY Agentic SDLC Pipeline

    SEED ─────▶ SPEC ─────▶ PLAN ─────────────────────────────▶ EXECUTE
   Intent    Requirements  Build Strategy      Build + Validate + Deploy + Operate

  +-----------+----------------------+----------------------+--------------------------------------+
  |   SEED    |         SPEC         |         PLAN         |               EXECUTE                |
  +-----------+----------------------+----------------------+--------------------------------------+
  | 0a Intent | 1a Discovery Interview | 2a Architecture    | 3a Setup                             |
  |           | 1b BRD               | 2b Design            | 3b Implement                         |
  |           | 1c Use Cases         | 2c Orchestration     | 3c Code Review                       |
  |           | 1d Technical Spec    |                      | 3d Code Scan                         |
  |           |                      |                      | 3e Security                          |
  |           |                      |                      | 3f Test                              |
  |           |                      |                      | 3g CI/CD Pipeline                    |
  |           |                      |                      | 3h Infrastructure as Code            |
  |           |                      |                      | 3i Deployment                        |
  |           |                      |                      | 3j Smoke Tests                       |
  |           |                      |                      | 3k Monitoring                        |
  |           |                      |                      | 3l Observability                     |
  |           |                      |                      | 3m Iteration                         |
  +-----------+----------------------+----------------------+--------------------------------------+
  | seed.md   | spec.md              | plan.md              | replay-execution/replay-execution.md |
  +-----------+----------------------+----------------------+--------------------------------------+
                                                                              │
                              ◀──── Feedback loop ── next Seed ───────────────┘
```

Each stage is **informed by the prior stage's output**. No stage begins until the prior stage is approved.

> **Note:** The sub-steps shown below are the default set. The Planning Agent tailors them to the project's [risk level](#9-risk-calibration). A risk-1 prototype may use only a subset of Execute (for example, Setup + Implement + Test). A risk-5 system uses the full Execute set with strict gates.

### SDLC stage details

#### Seed

| Sub-step | Agent | Output |
|----------|-------|--------|
| 0a. Intent | Human | A short description of intent in `<project-folder>/plan/seed.md` |

#### Spec

| Sub-step | Agent | Output |
|----------|-------|--------|
| 1a. Discovery interview | Spec Agent | Raw interview notes (elicitation) |
| 1b. Business requirements (BRD) | Spec Agent | Goals, stakeholders, success metrics, constraints |
| 1c. Use cases | Spec Agent | Actors, triggers, main flow, exceptions, dependencies |
| 1d. Technical specification | Spec Agent | FR, NFR, AC traced to use cases |

#### Plan

| Sub-step | Agent | Output |
|----------|-------|--------|
| 2a. Architecture | Architecture Agent | System design, components, and technology choices |
| 2b. Design | Design Agent | Interfaces, contracts, data models |
| 2c. Orchestration | Planning Agent | Work breakdown, ordering, and mode assignments |

#### Execute

| Sub-step | Agent | Output |
|----------|-------|--------|
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

### SDLC accuracy rules

- Requirements are completed in **Spec** before design and implementation begin.
- **Plan** defines sequencing and execution mode before **Execute** starts.
- For software projects in GitHub, **Execute** follows an issue-driven PR lifecycle: issue -> branch -> validate -> pull request -> review -> merge.
- In this profile, deployment and operations are part of **Execute**, not separate top-level stages.
- The replay-execution log is updated throughout all stages.

---

## 6. Repository layout

Every TMWTTY project uses the following structure:

| Path | Purpose |
|------|---------|
| `tmwtty/` | The methodology reference (this document). |
| `<project-folder>/` | Project root for one specific project (create new for a new project; reuse if it already exists). |
| `<project-folder>/plan/seed.md` | The seed prompt expressing project intent. |
| `<project-folder>/plan/spec.md` | The requirements package for the active domain profile. |
| `<project-folder>/plan/plan.md` | The execution blueprint and orchestration plan for the active domain profile. |
| `<project-folder>/replay-execution/replay-execution.md` | The step-by-step playbook captured during execution. |

Rule: each `<project-folder>` has exactly one active seed file at `<project-folder>/plan/seed.md`.

Recommended naming for `<project-folder>`: a stable slug (for example, `stock-ticker-mcp`).

Example for a project named `stock-ticker-mcp`:

```text
stock-ticker-mcp/
  plan/
    seed.md
    spec.md
    plan.md
  replay-execution/
    replay-execution.md
```

---

## 7. Runtime

TMWTTY runs in **GitHub Copilot** — either of two runtimes plays the agent roles:

| Runtime | Recommended for | Notes |
|---------|-----------------|-------|
| **VS Code Agent mode** | Code-heavy projects (recommended default) | Inline diffs, collapsible subagent panels, visual approval gates make the TMWTTY loop feel natural |
| **Copilot CLI** | Ops, runbooks, headless or remote environments | Terminal-native; better for scripting and CI |

Each agent in the pipeline is a role played by the chosen runtime. Both runtimes support the same set of modes and features described below.

> **Important:** For projects at risk level 4 or 5 (see [Section 9](#9-risk-calibration)), each agent role must run as a **separate custom agent with an isolated context**, not as different roles played by a single shared context. Cosmetic role separation is acceptable for risk levels 1–3.

### 7.1 Agent modes

The Planning Agent selects the appropriate mode for each sub-step.

| Mode | Description | TMWTTY usage |
|------|-------------|--------------|
| **Interactive** *(default)* | The user explicitly approves each tool action. | The default for every stage. Implements the TMWTTY loop. |
| **Autopilot** | The agent runs fully autonomously without approval prompts. | Used when the spec is precise and the work is low risk. |
| **Plan** | The agent generates a multi-step plan, waits for user approval, then executes. | Used during the Plan stage. |
| **Fleet** (`/fleet`) | The agent decomposes work into parallel subtasks executed by subagents. | Used when work items are independent and can run concurrently. |

### 7.2 Features

| Feature | Command / Location | TMWTTY usage |
|---------|--------------------|--------------|
| **Custom Agents** | `.github/agents/<name>.md` | Each pipeline role is defined as a persistent custom agent with focused instructions, tools, and optional model selection. |
| **Skills** | Per-agent skill declarations | Atomic capabilities (run tests, open PR, scan dependencies, generate docs, etc.). Agents declare which skills they need; the runtime invokes them when appropriate. Custom skills can be added per project. |
| **AGENTS.md** | Repository root | Project-wide instructions that all agents read. Used to encode TMWTTY conventions, workflow standards, and project context. |
| **GitHub Issues** | Repository issue tracker | Work management backbone for Execute: each non-trivial work item is tracked as an issue, then implemented through branch and PR flow. |
| **Subagents** | Auto-spawned or `/agent <name>` | Isolated-context agents for specialized subtasks. Required for risk levels 4–5. |
| **Delegate** | `/delegate` | Hands off a fully specified work item to the GitHub Copilot Coding Agent (cloud, async) for issue-to-PR execution. |
| **MCP Servers** | Per-agent configuration | Connects agents to external tools, data sources, or alternate models. |

---

## 8. Guardrails

During the Plan stage, the Planning Agent guides the user through establishing industry-standard guardrails appropriate to the project. Guardrails are **negotiated, not prescribed** — they are determined through the TMWTTY loop based on the project's scope, technology stack, and [risk level](#9-risk-calibration).

| Category | Examples |
|----------|----------|
| **Security** | Secrets management, dependency scanning, least-privilege access |
| **Quality** | Testing strategy, linting, type safety, code review gates |
| **Architecture** | Separation of concerns, API contract design, dependency boundaries |
| **Operations** | CI/CD pipelines, environment parity, observability |
| **Process** | Change-management conventions, branch strategy, approval workflows |

---

## 9. Risk calibration

The TMWTTY pipeline scales with the project's risk profile. The Planning Agent assesses risk on a 1–5 scale and adjusts the depth of process accordingly.

| Level | Profile | Pipeline behavior |
|:-----:|---------|-------------------|
| **1** | Throwaway prototype or experiment | Minimal stages only. Fast-path approval allowed throughout. Shared context. |
| **2** | Internal workflow, low blast radius | Requirements can be lightweight. Peer review optional. Fast-path allowed for routine work items. Shared context. |
| **3** | Team-facing deliverable, moderate stakes | Full discovery, planning, execution, and validation. Fast-path allowed only for low-impact routine tasks. Shared context acceptable. |
| **4** | Customer-facing or revenue-impacting | Full pipeline including security and quality controls. Fast-path disabled for core delivery and validation stages. **Isolated subagent contexts required.** |
| **5** | Regulated, safety-critical, or mission-critical | Full pipeline plus formal review gates and external controls where required. No fast-path. Mandatory isolated subagents. |

The Planning Agent confirms the assessed risk level with the user during the Plan stage before proceeding.

---

## 10. Failure handling

The methodology defines explicit semantics for when things go wrong.

| State | Trigger | Response |
|-------|---------|----------|
| **Retry** | A sub-step fails on first attempt (transient error, simple mistake). | Agent retries up to twice with adjusted approach. |
| **Refine** | User rejects the proposed prompt or result (steps 2 or 5). | Agent revises based on user feedback, then re-proposes. Maximum three refinement cycles per artifact. |
| **Abandon** | Three refinement cycles fail to converge, or the user explicitly says "abandon this approach." | Agent records the failure in the replay-execution log, returns to the prior approved artifact, and asks the user how to proceed. |
| **Escalate** | The agent detects ambiguity it cannot resolve, a guardrail violation, or a risk-level mismatch. | Agent halts, surfaces the issue clearly, and waits for human direction. Never proceeds on assumption. |

Every abandon and escalate event is recorded in `<project-folder>/replay-execution/replay-execution.md` with rationale, supporting future learning and process refinement.

---

## 11. Limitations

TMWTTY is not a silver bullet. Users should understand the following constraints.

| Constraint | Explanation |
|------------|-------------|
| **Replay logs degrade over time** | Dependencies, model behavior, and file state shift. A six-month-old log replayed in a fresh repository will likely require adaptation. Treat the log as a **structured reference**, not a guaranteed-replayable script. |
| **Velocity tax** | The full pipeline trades speed for safety. For routine production work, this overhead may exceed the benefit. Use risk calibration to right-size the process. |
| **Discovery quality depends on the user** | The discovery-stage agent can only elicit what the user knows. Domain expertise gaps produce weak requirements. The agent mitigates this by proposing defaults but cannot fully replace expertise. |
| **Cost** | Multiple agents with verbose context and interactive loops consume more tokens than single-agent autonomous execution. Plan for higher inference costs on complex projects. |
| **Single-context role separation is cosmetic** | At risk levels 1–3, all roles share one AI context. Real isolation requires subagents (risk 4–5). |
| **No native evaluation framework** | The methodology does not currently include automated evaluation of agent behavior or outcome quality. Teams should add their own evals for production use. |

---

## 12. Agent protocol

> This section provides operating instructions for AI agents executing TMWTTY. Human readers can skip to [Section 13](#13-reference).

### 12.1 On first contact

1. Determine the `<project-folder>` name from user intent (stable slug).
2. If `<project-folder>` exists, reuse it. If it does not exist, create it with the standard structure.
3. Read the user's seed prompt in `<project-folder>/plan/seed.md`. If it does not exist, create it from the user's intent before proceeding. Do not create multiple seed files for the same project folder.
4. Acknowledge the intent and confirm your understanding of what "done" looks like.
5. Assess the project's [risk level](#9-risk-calibration) (1–5) and confirm it with the user.
6. Calibrate the pipeline (which sub-steps apply, whether fast-path is allowed, whether subagents are required) based on the confirmed risk level.

### 12.2 For each stage and sub-step

1. Announce which agent role you are playing and which stage or sub-step you are entering.
2. Use the agent's assigned protocol:
  - **Discovery-stage agent** → Interview Me (elicit requirements; propose defaults when the user lacks expertise).
  - **All non-discovery agents** → TMWTTY loop (propose + write prompt, approve/modify, execute, review, record).
3. Produce the defined artifact for the sub-step.
4. Wait for explicit human approval at each gate before advancing.
5. Each stage is informed by the prior stage — do not skip ahead.
6. If you are operating outside the SDLC profile, map the same TMWTTY loop to the domain's equivalent stages and artifacts.

### 12.3 The TMWTTY loop

| Step | Action |
|:----:|--------|
| 1 | Explain the concept — what you are about to do and why. |
| 2 | Propose the next artifact for the active domain profile and write the prompt to execute it. |
| 3 | Wait for the user to approve, modify, or reject. If **"go"** and fast-path is allowed, proceed immediately. If modifications are provided, incorporate them. |
| 4 | Execute. |
| 5 | Present the result for review. |
| 6 | On approval, persist the outcome according to repository permissions: record the approved prompt and result in `<project-folder>/replay-execution/replay-execution.md`, and return produced changes when direct repository writes are not available. |

Repeat for every sub-step until the pipeline is complete.

### 12.4 Failure semantics

Follow the table in [Section 10](#10-failure-handling). Never proceed on assumption when escalation is warranted.

### 12.5 Rules

- **Optimize plans** for the shortest path to done given the risk level, minimal token usage, and industry-standard practices.
- **Follow GitHub Copilot best practices** and use structured prompts that conform to context engineering principles.
- **Never skip a gate** at risk levels 4–5. Fast-path is disabled for sensitive sub-steps.
- **Document continuously.** The replay-execution log must capture each step, each abandon, and each escalation.
- **One recorded change-set per artifact** to preserve atomic, traceable history.
- **Use branch-per-work-item and PR-based integration** unless the repository is explicitly operating in solo/direct-push mode.
- **Use issue-based work management** for GitHub projects: each non-trivial execution item maps to a GitHub issue with clear scope, owner, and acceptance criteria.
- **When uncertain, ask.** Do not assume.
- **Guide the user through tooling.** When a sub-step requires a specific Copilot mode or feature, walk the user through the configuration step by step.
- **Honor the risk level.** At levels 4–5, use isolated subagent contexts. At levels 1–3, shared context is acceptable.

---

## 13. Reference

| To... | See... |
|-------|--------|
| Start building | [`01-getting-started.md`](./01-getting-started.md) |
| Create a seed prompt | [`02-seed-prompt-template.md`](./02-seed-prompt-template.md) |
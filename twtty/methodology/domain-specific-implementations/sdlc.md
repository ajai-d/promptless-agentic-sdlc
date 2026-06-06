# SDLC Domain-Specific Implementation

## Purpose

This document is a concrete Software Development Life Cycle (SDLC) domain-specific implementation of the Core TWTTY Specification.

Core TWTTY Specification:

SEED -> SPEC -> PLAN -> EXECUTE

In this implementation, Execute includes delivery and operations.

---

## SDLC summary

The authoritative SDLC execution order is listed in SDLC stage details below.

```text
                          TWTTY Agentic SDLC Pipeline

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
    | seed/seed.md | spec/spec.md       | plan/plan.md         | replay-execution/replay-execution.md |
  +-----------+----------------------+----------------------+--------------------------------------+
                                                                              │
                              ◀──── Feedback loop ── next Seed ───────────────┘
```

Each stage is informed by the prior stage output. No stage begins until the prior stage is approved.

Note: Sub-steps are the default set. The Planning Agent tailors them to project risk level. A risk-1 prototype may use only Setup + Implement + Test. A risk-5 system uses the full Execute set with strict gates.

---

## SDLC stage details

### Seed

| Sub-step | Agent | Output |
|----------|-------|--------|
| 0a. Intent | Human | A short description of intent in <project-folder>/seed/seed.md |

### Spec

| Sub-step | Agent | Output |
|----------|-------|--------|
| 1a. Discovery interview | Spec Agent | Raw interview notes (elicitation) |
| 1b. Business requirements (BRD) | Spec Agent | Goals, stakeholders, success metrics, constraints |
| 1c. Use cases | Spec Agent | Actors, triggers, main flow, exceptions, dependencies |
| 1d. Technical specification | Spec Agent | FR, NFR, AC traced to use cases |

### Plan

| Sub-step | Agent | Output |
|----------|-------|--------|
| 2a. Architecture | Architecture Agent | System design, components, and technology choices |
| 2b. Design | Design Agent | Interfaces, contracts, data models |
| 2c. Orchestration | Planning Agent | Work breakdown, ordering, and mode assignments |

### Execute

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

---

## Runtime profile (GitHub Copilot)

This SDLC implementation runs in **GitHub Copilot** — either of two runtimes can play the agent roles:

| Runtime | Recommended for | Notes |
|---------|-----------------|-------|
| **VS Code Agent mode** | Code-heavy projects (recommended default) | Inline diffs, collapsible subagent panels, visual approval gates make the TWTTY loop feel natural |
| **Copilot CLI** | Ops, runbooks, headless or remote environments | Terminal-native; better for scripting and CI |

Each agent in the pipeline is a role played by the chosen runtime.

> **Important:** For projects at risk level 4 or 5, each agent role must run as a **separate custom agent with an isolated context**, not as different roles played by a single shared context. Cosmetic role separation is acceptable for risk levels 1–3.

### Agent modes

The Planning Agent selects the appropriate mode for each stage task.

| Mode | Description | TWTTY usage |
|------|-------------|--------------|
| **Interactive** *(default)* | The user explicitly approves each tool action. | The default for every stage. Implements the TWTTY loop. |
| **Autopilot** | The agent runs fully autonomously without approval prompts. | Used when the spec is precise and the work is low risk. |
| **Plan** | The agent generates a multi-step plan, waits for user approval, then executes. | Used during the Plan stage. |
| **Fleet** (`/fleet`) | The agent decomposes work into parallel subtasks executed by subagents. | Used when work items are independent and can run concurrently. |

### Runtime features

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

## Guardrails profile

During the Plan stage, the Planning Agent guides the user through establishing industry-standard guardrails appropriate to the project. Guardrails are **negotiated, not prescribed** and are determined through the TWTTY loop based on the project's scope, technology stack, and risk level.

| Category | Examples |
|----------|----------|
| **Security** | Secrets management, dependency scanning, least-privilege access |
| **Quality** | Testing strategy, linting, type safety, code review gates |
| **Architecture** | Separation of concerns, API contract design, dependency boundaries |
| **Operations** | CI/CD pipelines, environment parity, observability |
| **Process** | Change-management conventions, branch strategy, approval workflows |

---

## Risk enforcement profile

This profile defines how the SDLC implementation enforces TWTTY at each risk level.

| Level | Pipeline behavior |
|:-----:|-------------------|
| **1** | Minimal stages only. Shared context. |
| **2** | Requirements can be lightweight. Peer review optional. Shared context. |
| **3** | Full discovery, planning, execution, and validation. Shared context acceptable. |
| **4** | Full pipeline including security and quality controls. |
| **5** | Full pipeline plus formal review gates and external controls where required. |

---

## SDLC accuracy rules

- Requirements are completed in Spec before design and implementation begin.
- Plan defines sequencing and execution mode before Execute starts.
- For software projects in GitHub, Execute follows an issue-driven PR lifecycle: issue -> branch -> validate -> pull request -> review -> merge.
- In this profile, deployment and operations are part of Execute, not separate top-level stages.
- The replay-execution log is updated throughout all stages.

---

## Execution rules

These rules extend the core TWTTY rules ([Section 11.6](../core-twtty-methodology.md#116-rules)) with software-delivery specifics.

- **Follow GitHub Copilot best practices** for prompts and context engineering.
- **Never skip a gate** at risk levels 4–5.
- **Use branch-per-work-item and PR-based integration** unless the repository is explicitly operating in solo/direct-push mode.
- **Use issue-based work management:** each non-trivial execution item maps to a GitHub issue with clear scope, owner, and acceptance criteria.
- **Guide the user through tooling.** When a stage task requires a specific Copilot mode or feature, walk the user through the configuration step by step.
- **Honor the risk level.** At levels 4–5, use isolated subagent contexts. At levels 1–3, shared context is acceptable.

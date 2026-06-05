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

## SDLC accuracy rules

- Requirements are completed in Spec before design and implementation begin.
- Plan defines sequencing and execution mode before Execute starts.
- For software projects in GitHub, Execute follows an issue-driven PR lifecycle: issue -> branch -> validate -> pull request -> review -> merge.
- In this profile, deployment and operations are part of Execute, not separate top-level stages.
- The replay-execution log is updated throughout all stages.

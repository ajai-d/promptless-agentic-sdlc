# Replay Execution Log

---

## Step 1 — Create Spec Agent

| Field | Value |
|-------|-------|
| **Stage** | Setup (pre-Spec) |
| **Agent** | Planning Agent |
| **Risk Level** | 2 (confirmed) |
| **Date** | 2026-05-21 |

### Prompt

```
Create a custom Spec Agent at `.github/agents/spec-agent.md` for the TMWTTY methodology.

The agent should:
- Use the "Interview Me" protocol to conduct a structured discovery interview
- Read `plan/seed.md` on first contact to understand the user's intent
- Ask targeted questions to surface requirements, edge cases, and acceptance criteria
- Propose sensible defaults when the user lacks domain expertise
- Synthesize responses into `plan/spec.md` with: functional requirements, non-functional requirements, acceptance criteria, and out-of-scope items
- Follow TMWTTY failure semantics: refine up to 3 cycles, then escalate
- Confirm risk level 2 conventions (informal spec, fast-path allowed)
- Keep the interview concise — aim for 3-5 focused questions, not an exhaustive questionnaire
```

### Result

Created `.github/agents/spec-agent.md` with Interview Me protocol, structured question categories, spec output template, failure semantics, and risk-2 conventions.

---

## Step 2 — Spec (Discovery Interview + Spec Document)

| Field | Value |
|-------|-------|
| **Stage** | Spec (1a–1d) |
| **Agent** | Spec Agent (played by Planning Agent in shared context) |
| **Risk Level** | 2 |
| **Date** | 2026-05-21 |

### Interview Questions (1a)

1. Data source → Mock first, upgrade to Yahoo Finance later
2. Tech stack → AI picks (TypeScript throughout)
3. "Top performing" metric → Top 5 by % daily gain from major US index
4. Out of scope → No auth, no DB, no streaming, no cloud (confirmed)

### Prompt

```
Synthesize the interview responses into plan/spec.md following the textbook
requirements order: 1b BRD → 1c Use Cases → 1d Technical Specification.
```

### Result

Created `plan/spec.md` with BRD (goal, stakeholders, success metrics, constraints), 7 use cases (UC-1–UC-7 with dependency graph), and technical spec (FR-1–FR-5, NFR-1–NFR-3, AC-1–AC-5, traceability to UCs). User approved via fast-path.

---

## Step 3 — Plan (2a–2c)

| Field | Value |
|-------|-------|
| **Stage** | Plan (2a–2c) |
| **Agent** | Planning Agent (interactive) |
| **Risk Level** | 2 |
| **Date** | 2026-05-25 |

### Sub-steps

| # | Sub-step | Output |
|---|----------|--------|
| 2a | Architecture | ASCII system diagram, component table, key decisions |
| 2b | Design | TypeScript interfaces, MCP tool schema, file structure |
| 2c | Orchestration | Agent Registry (4 agents), invocation sequence, rationale |

### Prompt (iterative — one sub-step per "go")

```
Write 2a Architecture → approved
Write 2b Design → approved
Write 2c Orchestration → revised after feedback (needed proper agent definitions, not a task table) → approved
```

### Result

All 3 sub-steps written to `plan/plan.md`. Plan stage complete.

---

## Step 4 — Create Execute-Stage Agent Definitions

| Field | Value |
|-------|-------|
| **Stage** | Execute (setup) |
| **Agent** | Planning Agent |
| **Risk Level** | 2 |
| **Date** | 2026-05-25 |

### Files Created

| Agent | File | Mode |
|-------|------|------|
| Setup Agent | `.github/agents/setup-agent.md` | Autopilot |
| Implementation Agent | `.github/agents/impl-agent.md` | Interactive |
| Test Agent | `.github/agents/test-agent.md` | Autopilot |
| Integration Agent | `.github/agents/integration-agent.md` | Interactive |

### Result

All 4 agent definition files created. Ready for `@setup-agent` invocation.

---

## Step 5 — Methodology Restructure (BRD → Use Cases → Spec)

| Field | Value |
|-------|-------|
| **Stage** | Process improvement |
| **Agent** | Planning Agent |
| **Risk Level** | 2 |
| **Date** | 2026-05-25 |

### Rationale

During the Plan stage, the team identified that Use Cases (2a) were placed *after* the Technical Spec — the reverse of textbook requirements engineering. Use cases are a discovery tool that should *drive* the formal spec, not restate it.

### Changes Made

| File | Change |
|------|--------|
| `twtty/methodology/core-twtty-methodology.md` | Restructured Spec stage: 1a Interview → 1b BRD → 1c Use Cases → 1d Tech Spec. Removed Use Cases from Plan stage. Renumbered Plan to 2a–2c. Cleaned up all diagrams to consistent style. |
| `plan/spec.md` | Reorganized into BRD (1b) + Use Cases (1c) + Technical Spec (1d) with FR/AC traceability to UCs. |
| `plan/plan.md` | Removed Use Cases section. Renumbered: Architecture (2a), Design (2b), Orchestration (2c). |
| `.github/agents/spec-agent.md` | Updated to produce 4 sub-steps (1a–1d) with BRD and Use Cases before Tech Spec. |
| `replay-execution/replay-execution.md` | Retroactively corrected step numbering to match new structure. |

### Result

Methodology now follows textbook order: elicitation → business context → scenario discovery → formal specification. Traceability from FR → UC established.

---

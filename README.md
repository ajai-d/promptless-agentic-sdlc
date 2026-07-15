# Build any application. Never write a prompt again.

> **Tell Me What To Tell You (TWTTY)** — a methodology for AI-assisted software development where the AI proposes each next step and you just approve.

Instead of you crafting the perfect prompt, TWTTY interviews you upfront to understand what you want to build. Then it drives the whole software lifecycle — **SEED → SPEC → PLAN → EXECUTE** — asking for your approval at every gate. Every decision is captured in a replay-execution log so you (or anyone) can resume the work later.

---

## Why TWTTY?

| Without TWTTY | With TWTTY |
|---|---|
| "I don't know what to ask the AI." | The AI interviews you. |
| "I keep re-explaining my project." | The seed captures it once. |
| "My teammate can't onboard." | Every step is in the replay log. |
| "I skipped a review and shipped a bug." | Approval gates enforce the flow. |
| "Quality varies by who's driving." | Deterministic spec + traceable execution. |

---

## Get started in 3 steps

### 1. Create your project folder

Pick a stable slug name (lowercase, hyphen-separated):

```
my-awesome-app/
```

Create one file inside it — `my-awesome-app/seed/seed.md` — from the template at [`twtty/templates/seed-prompt-template.md`](./twtty/templates/seed-prompt-template.md). Fill in two sections:

- **What I Want To Build** — describe your project in plain language.
- **Done Looks Like** — describe what "finished" looks like.

The AI Agent creates everything else (`spec/`, `plan/`, `replay-execution/`, source code) as it works.

### 2. Point your AI Agent at the methodology

Copy this prompt into GitHub Copilot (or any AI agent):

> Read `twtty/methodology/core-twtty-methodology.md` and follow the TWTTY methodology.
>
> Project seed: `my-awesome-app/seed/seed.md`
>
> Active domain-specific implementation: `twtty/methodology/domain-specific-implementations/sdlc/sdlc.md`

### 3. Approve. Approve. Ship.

The AI proposes each next step. You approve, modify, or reject. When you approve, the AI executes and records what happened. Repeat through SEED → SPEC → PLAN → EXECUTE. At the end, you have working software plus a complete replay log.

---

## Repository layout

```
agentic-dev-scafolding/
  twtty/                                     ← the TWTTY methodology itself
    methodology/
      core-twtty-methodology.md              ← the normative core spec
      domain-specific-implementations/
        sdlc/                                ← software-delivery implementation
          sdlc.md
          templates/                         ← spec.md and plan.md templates
    templates/
      seed-prompt-template.md                ← seed template you start with
  <project-folder>/                          ← your projects live here (one folder each)
    seed/
    spec/
    plan/
    replay-execution/
    ...                                      ← source code, tests, infra, .github/, etc.
  archive/                                   ← prior methodology iterations
```

---

## Reference

| To... | See... |
|---|---|
| Understand the methodology | [`twtty/methodology/core-twtty-methodology.md`](./twtty/methodology/core-twtty-methodology.md) |
| See the SDLC implementation | [`twtty/methodology/domain-specific-implementations/sdlc/sdlc.md`](./twtty/methodology/domain-specific-implementations/sdlc/sdlc.md) |
| Copy the seed template | [`twtty/templates/seed-prompt-template.md`](./twtty/templates/seed-prompt-template.md) |
| Copy the spec template | [`twtty/methodology/domain-specific-implementations/sdlc/templates/spec-template.md`](./twtty/methodology/domain-specific-implementations/sdlc/templates/spec-template.md) |
| Copy the plan template | [`twtty/methodology/domain-specific-implementations/sdlc/templates/plan-template.md`](./twtty/methodology/domain-specific-implementations/sdlc/templates/plan-template.md) |

---

## License

[MIT](./LICENSE)


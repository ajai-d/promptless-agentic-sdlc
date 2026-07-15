# Build Apps with AI without writing anything — not even prompts

Build production-grade applications using AI agents without writing prompts or configuring anything. You describe your idea at a high level in a seed and AI takes over — the AI agent interviews you, drafts a spec, plans the work, writes the code, tests it, and ships it — checking with you at every step.

## About the methodology

TWTTY (Tell Me What To Tell You) is a methodology for building software with AI agents. It organizes AI-driven development into four stages: **SEED** (capture your idea), **SPEC** (define requirements), **PLAN** (design and break down the work), and **EXECUTE** (build, test, and deploy). The AI proposes each next step, you approve it, and every decision is recorded. You can pause and resume anytime — the project's history is a complete audit trail that anyone can pick up and continue.

## How to use it

### 1. Create a project folder

Pick a short, lowercase name for your project (e.g., `my-app/`).

### 2. Create your seed

Inside the project folder, create `seed/seed.md`. Use [this template](./twtty/templates/seed-prompt-template.md) and fill in two sections in plain English:

- **What I Want To Build** — your idea.
- **Done Looks Like** — how you'll know it's finished.

### 3. Give this exact prompt to GitHub Copilot

```text
Read twtty/methodology/core-twtty-methodology.md and follow the TWTTY methodology.
Project seed: my-app/seed/seed.md
Domain: twtty/methodology/domain-specific-implementations/sdlc/sdlc.md
```

That's it. The AI agent takes over.

## License

[MIT](./LICENSE)


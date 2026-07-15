# TWTTY

Build production-grade applications using AI agents without writing prompts or configuring anything. You describe your idea at a high level; the AI agent interviews you, drafts a spec, plans the work, writes the code, tests it, and ships it — checking with you at every step.

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


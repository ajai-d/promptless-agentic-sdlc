# Build Apps with AI without writing anything — not even prompts

Build production-grade applications using AI agents without writing prompts or configuring anything. You describe your idea at a high level in a seed and AI takes over — the AI agent interviews you, drafts a spec, plans the work, writes the code, tests it, and ships it — checking with you at every step.

## About the methodology

TWTTY (Tell Me What To Tell You) is a methodology for working with AI agents that removes the burden of prompt engineering or any kind of configuration related to Agentic software development. Instead of crafting prompts yourself, you provide a Project Seed (seed prompt) that captures the project's overall intent, and the AI Agent proposes each next step and the prompt to execute it. The AI Agent executes only after your explicit approval or modification. Every interaction is captured in a replay-execution log that serves as both project history and a reproducible reference.

See [`core-twtty-methodology.md`](./twtty/methodology/core-twtty-methodology.md) for the full specification.

## How to use it

### 1. Create a project folder

Pick a short, lowercase name for your project (e.g., `my-app/`). Create it **outside** this repo — your project stays completely independent.

Then open both folders in one VS Code workspace:

1. Open this repo (`agentic-dev-scafolding`) in VS Code.
2. `File → Add Folder to Workspace...` → select your project folder.
3. (Optional) `File → Save Workspace As...` to save the setup so you can re-open it later.

You should now see both folders in the sidebar.

### 2. Create your seed

Inside your project folder, create `seed/seed.md`. Use [this template](./twtty/templates/seed-prompt-template.md) and fill in two sections in plain English:

- **What I Want To Build** — your idea.
- **Done Looks Like** — how you'll know it's finished.

### 3. Give this exact prompt to GitHub Copilot

```text
Read agentic-dev-scafolding/twtty/methodology/core-twtty-methodology.md and follow the TWTTY methodology.
Project seed: my-app/seed/seed.md
Domain: agentic-dev-scafolding/twtty/methodology/domain-specific-implementations/sdlc/sdlc.md
```

That's it. The AI agent takes over.

## License

[MIT](./LICENSE)


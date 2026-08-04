# Build Apps with Agentic AI without writing anything — not even prompts

Build production-grade applications using AI agents without writing prompts or configuring anything. You describe your idea at a high level in a seed and AI takes over — the AI agent interviews you, drafts a spec, plans the work, writes the code, tests it, and ships it — checking with you at every step.

## About the methodology

TWTTY (Tell Me What To Tell You) is a methodology for working with AI agents that removes the burden of prompt engineering or any kind of configuration related to Agentic software development. Instead of crafting prompts yourself, you provide a Project Seed (seed prompt) that captures the project's overall intent, and the AI Agent proposes each next step and the prompt to execute it. The AI Agent executes only after your explicit approval or modification. Every interaction is captured in a replay-execution log that serves as both project history and a reproducible reference.

See [`core-twtty-methodology.md`](./twtty/methodology/core-twtty-methodology.md) for the full specification.

## How to use it

### 1. Clone this repository

Install [VS Code](https://code.visualstudio.com/) and enable GitHub Copilot Chat. Then clone this repository and open it in VS Code:

```text
git clone https://github.com/ajai-d/promptless-agentic-sdlc.git
```

Use **Agent** mode in GitHub Copilot Chat for the remaining steps.

### 2. Create a workspace and project folder

Pick a short, lowercase name for your project (for example, `my-app`) and create an empty folder with that name outside this repository. Then create a VS Code workspace that contains both folders:

1. In VS Code, select `File → Open Folder...` and open `promptless-agentic-sdlc`.
2. Select `File → Add Folder to Workspace...`.
3. Select your new project folder.
4. Select `File → Save Workspace As...` and save the workspace so you can reopen both folders together.

You should now see `promptless-agentic-sdlc` and your project folder in the Explorer sidebar.

### 3. Create your seed

Inside your project folder, create `seed/seed.md`. Use [this template](./twtty/templates/seed-prompt-template.md) and fill in two sections in plain English:

- **What I Want To Build** — your idea.
- **Done Looks Like** — how you'll know it's finished.

### 4. Open a new GitHub Copilot Chat in this workspace and paste this prompt

Use a fresh chat (not one you've been using for other work) so the AI starts with no prior context.

```text
Read promptless-agentic-sdlc/twtty/methodology/core-twtty-methodology.md and follow the TWTTY methodology.
Project seed: <your-project-folder>/seed/seed.md
Domain: promptless-agentic-sdlc/twtty/methodology/domain-specific-implementations/sdlc/sdlc.md
```

Replace `<your-project-folder>` with the folder name you chose in Step 2.

That's it. The AI agent takes over.

## License

[MIT](./LICENSE)


# 📘 Getting Started with TMWTTY

---

## Step 1 — Create Your Project Folder

Create a project-specific folder using a stable slug name, for example:

```text
stock-ticker-mcp/
```

Inside it, create:

```text
stock-ticker-mcp/
	seed/
	domain-profile/
	spec/
	plan/
	replay-execution/
```

---

## Step 2 — Create Your Seed Prompt

Use [`templates/seed/02-seed-prompt-template.md`](./templates/seed/02-seed-prompt-template.md) as an example to create `<project-folder>/seed/seed.md`:

- **What I Want To Build** — your intent in plain language
- **Done Looks Like** — how you'll know it's complete

---

## Step 2.5 — Choose Your Domain Profile

Choose the domain profile template the project will use.

Default example:
- [`templates/domain-profiles/SDLC-TMWTTY.md`](./templates/domain-profiles/SDLC-TMWTTY.md)

---

## Step 3 — Give It To Your AI Agent

Give this prompt to your AI Agent.
> Read `tmwtty/00-tmwtty-methodology.md` and follow the TMWTTY methodology.
>
> Project seed: `<project-folder>/seed/seed.md`
>
> Active domain profile: `tmwtty/templates/domain-profiles/SDLC-TMWTTY.md` (example)

You're off to the races.

---

## 📚 Reference

| File | Purpose |
|------|---------|
| [`00-tmwtty-methodology.md`](./00-tmwtty-methodology.md) | The methodology — what the agent reads |
| [`templates/seed/02-seed-prompt-template.md`](./templates/seed/02-seed-prompt-template.md) | Example template — use to create `<project-folder>/seed/seed.md` |
| [`templates/domain-profiles/SDLC-TMWTTY.md`](./templates/domain-profiles/SDLC-TMWTTY.md) | Example domain profile template — use as the active profile input |
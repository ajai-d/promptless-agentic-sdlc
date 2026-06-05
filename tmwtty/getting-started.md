# 📘 Getting Started with TMWTTY

---

## Step 1 — Create Your Project Folder

Create a project-specific folder using a stable slug name, for example:

```text
inventory-management/
```

Inside it, create:

```text
inventory-management/
	seed/
	domain-profile/
	spec/
	plan/
	replay-execution/
```

---

## Step 2 — Create Your Seed Prompt

Use [`templates/seed-prompt-template.md`](./templates/seed-prompt-template.md) as an example to create `<project-folder>/seed/seed.md`:

- **What I Want To Build** — your intent in plain language
- **Done Looks Like** — how you'll know it's complete

---

## Step 2.5 — Choose Your Domain Tmwtty Specification

Choose the Domain Tmwtty Specification template the project will use.

Default example:
- [`methodology/domain-specific-implementations/sdlc.md`](./methodology/domain-specific-implementations/sdlc.md)

---

## Step 3 — Give It To Your AI Agent

Give this prompt to your AI Agent.
> Read `tmwtty/methodology/core-tmwtty-methodology.md` and follow the TMWTTY methodology.
>
> Project seed: `<project-folder>/seed/seed.md`
>
> Active Domain Tmwtty Specification: `tmwtty/methodology/domain-specific-implementations/sdlc.md` (example)

You're off to the races.

---

## 📚 Reference

| File | Purpose |
|------|---------|
| [`methodology/core-tmwtty-methodology.md`](./methodology/core-tmwtty-methodology.md) | The methodology — what the agent reads |
| [`templates/seed-prompt-template.md`](../templates/seed-prompt-template.md) | Example template — use to create `<project-folder>/seed/seed.md` |
| [`methodology/domain-specific-implementations/sdlc.md`](./methodology/domain-specific-implementations/sdlc.md) | Example Domain Tmwtty Specification — use as the active domain spec input |
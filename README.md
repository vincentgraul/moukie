# Moukie

Solo, from Figma mockup to PR: Moukie is a Claude Code plugin that codes your front end and back end **in parallel** against a shared contract, then brings you back the PR. You do the merging.

The plugin ships the workflow **skills** and the implementation **subagents**. At setup, it installs a **git hook** in each project that refuses commits on `main`/`master`.

---

## The pipeline

```
setup     →  spec  →  ┌─ contract ─┐  →  reviewer  →  pr
(config)    (WHY)     │ orchestrator│    (review)     (PR)
                      │ front ∥ back│
                      └────────────┘
```

| Step | Skill | Role | Stops at |
|------|-------|------|----------|
| 1 | `setup` | Framing interview (product, stack, architecture) → writes the `project/` vault, has `scaffold` generate the missing code, configures permissions, linter, git guard and `CLAUDE.md` | Setup PR opened |
| 2 | `spec` | Frames a feature → `project/specs/<feature>/` (its `README.md` + one story per file) | Feature `validated` |
| 3a | `contract` | Freezes the front/back interface as **zod** schemas (if the story spans several layers) | Contract frozen |
| 3b | `orchestrator` | Implements **one story**: runs the front/back lanes in parallel (isolated worktrees), integrates, gets it reviewed | PR opened (delegates to `pr`) |
| 4 | `pr` | Commit (conventional), push, `gh pr create` | PR opened (**never merges**) |

Each skill has a **clear boundary** and explicitly hands over to the next one. None of them merges or skips a step.

Alongside these steps, two **knowledge skills** are invoked by the other skills rather than by the user:

| Skill | Role | Invoked by |
|-------|------|------------|
| `feature-sliced-design` | The FSD v2.1 methodology, the reference for the front end | `front-web`, `front-mobile`, `reviewer` |
| `figma-annotations` | Collects the Dev Mode annotations from the mockups and normalizes them into usable rules | `spec`, `contract` |

---

## The `project/` vault

Everything about **the project** rather than its code lives in a single folder at the root of the repository, in Markdown:

```
project/
├── product.md        ← the WHY: problem solved, for whom, scope
├── market.md         ← alternatives, positioning, licence or business model
├── stack.md          ← the chosen stack (source of truth, not CLAUDE.md)
├── architecture.md   ← repository strategy, FSD on the front end, Vertical Slice on the back end
├── decisions.md      ← log of structural trade-offs
├── design.md         ← links to the mockups and the design system
├── rules/            ← project-specific invariants (auth.md, …)
└── specs/            ← features and their stories
```

This folder is both the user's **Obsidian vault** (opened as is, so Obsidian never indexes `node_modules`) and the **context** the agents load. Since it is versioned in the repository, a spec and the code that implements it change in the same commit and the same PR.

The root `CLAUDE.md` is a **router**, not documentation: it imports `product.md` and `stack.md` (small, always relevant), points to the rest on demand, and holds the **rules table** (one line per file in `rules/`, domain → file) so an agent knows which one to open without reading them all.

An `architecture.canvas` can be drawn by hand in Obsidian. It is a **view**: `architecture.md` remains the canonical source, the one the agents read and the `reviewer` checks the code against.

Three tools are enough to run a project: **Figma** (the mockups), **Obsidian** (the vault) and **Claude Code** (the execution).

---

## The subagents

| Agent | Model | Tools | Use |
|-------|-------|-------|-----|
| `front-web` | sonnet | all | Web front-end lane: React + TS, [Empreint](https://github.com/vincentgraul/empreint) design system, Figma mockups (read only) |
| `front-mobile` | sonnet | all | Mobile front-end lane: React Native + TS, Empreint, Figma (read only) |
| `backend` | sonnet | Read/Edit/Write/Bash/Grep/Glob | Back-end lane: endpoints, business logic, data access |
| `reviewer` | sonnet | Read/Grep/Glob/Bash/Skill | Read-only review before the PR, prioritized findings |

The agents run on **Sonnet** by default; the orchestrator switches a lane to Opus only for a complex story.

The writers work **against the frozen zod contract**: they never modify it and report any change they need to the orchestrator.

---

## The hooks

- **Git guard**: `setup` installs a `pre-commit` hook (`.githooks/`) in each project that refuses any commit on `main` or `master`, activated automatically when dependencies are installed. A deterministic guard: the subagents run autonomously, and an instruction alone is not enough.
- **Notification** (plugin hook): a macOS notification (`osascript`) when an action is waiting for the user. macOS only, fails silently elsewhere.

---

## Requirements

- **`gh` CLI** installed and authenticated (a GitHub Free account is enough).
- **Figma MCP** connected (read only; writing is set to `deny`).
- Front end: the [Empreint](https://github.com/vincentgraul/empreint) design system.

---

## Installation

The repository is also a **marketplace** (`.claude-plugin/marketplace.json`). From Claude Code:

```
/plugin marketplace add vincentgraul/moukie
/plugin install moukie@vincentgraul
```

(or point the marketplace to this local repository during development).

After installing, open `/hooks` once so the hooks configuration is reloaded.

---

## Usage

Everything is driven in natural language; the skills trigger on intent:

- *"set up Claude Code for this project"* → `setup`
- *"write the spec for the cart feature"* → `spec`
- *"implement the add-item story"* → `orchestrator` (which chains `contract`, the lanes, `reviewer`, `pr`)

Conversations and the generated Markdown (the vault, the specs, the PR descriptions) use the **project language**, chosen at `setup`. Names, commits, branches, code and the repository's public files stay in English.

---

## Conventions

- **Git**: conventional commits; never on `main`/`master`; never an automatic merge.
- **English names**: files, folders, slugs, branches, commits and code are in English, whatever the project language.
- **No external tracker**: the specs versioned in `project/specs/` are the single source of the requirements, and progress is read from the GitHub PRs. No progress file: it would drift out of sync.
- **A feature is a folder, a story is a file**: `project/specs/<feature>/README.md` holds the framing and the `status`; each `project/specs/<feature>/<story>.md` holds one story and its acceptance criteria (a checklist, never one story per criterion).
- **The slug is the story's identifier**: it is its file name, so unique by construction and fixed once and for all (the readable title can change). Its branch `<feature>/<story>` mirrors its path under `project/specs/`.
- **Contract**: a single source of truth in zod, strictly frozen during parallel work.

---

## Contributing

Contributions are welcome: read [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

[MIT](LICENSE)

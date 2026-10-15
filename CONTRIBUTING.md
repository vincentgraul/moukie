# Contributing to Moukie

Thanks for your interest. This repository holds two things: the Claude Code **plugin** (`skills/`, `agents/`, `hooks/`, `.claude-plugin/`) and its **documentation site** (`docs/`).

## Installation

You need [Bun](https://bun.sh) 1.x.

```bash
bun install
```

Installing also activates the git guard (see below).

## Commands

All of them run from the repository root.

| Role | Command |
|---|---|
| Install dependencies | `bun install` |
| Run the site locally | `bun run dev` |
| Build the site | `bun run build` |
| Lint, format and type-check | `bun run check` |
| Check the site's architecture | `bun run check:architecture` |
| Run the tests | `bun run test` |
| Run the end-to-end tests | `bun run test:e2e` |

## Requirements live in `project/`

The `project/` folder describes the project rather than its code: the product, the stack, the architecture, the decisions and the specs. It is written in French, the language of this project. A significant contribution starts with a **spec** in `project/specs/<feature>/`, discussed before any code is written. Read `project/decisions.md` before challenging a structural choice.

## Conventions

- **Naming**: the conventions of the `naming-conventions` skill (`skills/naming-conventions/SKILL.md`). Names are in English, files and folders in kebab-case, exports are named, never default. `bun run check` enforces them.
- **No comments** in the code.
- **Commits**: [conventional commits](https://www.conventionalcommits.org/), in English.
- **One branch and one PR per contribution**, opened against `main`. Only the maintainer merges.

## Git guard: no commits on `main`

A `pre-commit` hook (`.githooks/pre-commit`) refuses any commit on `main` or `master`. It activates itself on `bun install`, which runs `git config core.hooksPath .githooks`. Create a branch before committing, and never use `--no-verify`.

## Site translations

The site is in French and English. French is the source language: if you change the `metadata` of a skill or an agent, update its English translation in `docs/content/en/`. A check built into `bun run check` blocks translations that fall behind.

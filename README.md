# claude-workflow

Plugin Claude Code pour un développement **spec-driven** de bout en bout : du cadrage d'une feature jusqu'à l'ouverture de la PR, avec une implémentation **front/back en parallèle** disciplinée par un contrat d'interface gelé.

Le plugin embarque les **skills** du workflow, les **subagents** d'implémentation, et un **hook universel** anti-commit sur `main`/`master`.

---

## Le pipeline

```
scaffold  →  spec  →  ┌─ contract ─┐  →  reviewer  →  pr
(config)    (WHY)     │ orchestrator│    (revue)     (PR)
                      │ front ∥ back│
                      └────────────┘
```

| Étape | Skill | Rôle | S'arrête à |
|-------|-------|------|-----------|
| 1 | `scaffold` | Entretien guidé → génère `.claude/` (settings, hooks, CLAUDE.md), branche les subagents et skills | Config validée |
| 2 | `spec` | Cadrage d'une feature → `specs/<feature>/` (son `README.md` + une story par fichier) | Feature `validated` |
| 3a | `contract` | Gèle l'interface front/back en schémas **zod** (si la story est multi-couche) | Contrat gelé |
| 3b | `orchestrator` | Implémente **une story** : lance les lanes front/back en parallèle (worktrees isolés), intègre, fait revoir | PR ouverte (délègue à `pr`) |
| 4 | `pr` | Commit (conventional), push, `gh pr create` | PR ouverte (**ne merge jamais**) |

Chaque skill a une **frontière nette** et passe explicitement la main à la suivante. Aucun ne merge ni ne saute d'étape.

---

## Les subagents

| Agent | Modèle | Outils | Usage |
|-------|--------|--------|-------|
| `front-web` | opus | tous | Lane front web — React + TS, design system [Empreint](https://github.com/vincentgraul/empreint), maquettes Figma (lecture) |
| `front-mobile` | opus | tous | Lane front mobile — React Native + TS, Empreint, Figma (lecture) |
| `backend` | opus | Read/Edit/Write/Bash/Grep/Glob | Lane back — endpoints, logique métier, accès données |
| `reviewer` | opus | Read/Grep/Glob/Bash/Skill | Revue lecture seule avant PR — findings priorisés |

Les writers travaillent **contre le contrat zod gelé** : ils ne le modifient jamais et remontent tout besoin de changement à l'orchestrateur.

---

## Les hooks

- **PreToolUse / Bash** — refuse `git commit` quand la branche courante est `main` ou `master`. Garde-fou déterministe (les subagents tournent en autonomie : l'instruction seule ne suffit pas). Nécessite `jq`.
- **Notification** — notification macOS (`osascript`) quand une action attend l'utilisateur. macOS uniquement, échoue silencieusement ailleurs.

---

## Prérequis

- **`gh` CLI** installé et authentifié (compte GitHub Free suffit).
- **`jq`** (pour le hook anti-commit).
- **MCP Figma** connecté (lecture seule ; l'écriture est en `deny`).
- Front : design system [Empreint](https://github.com/vincentgraul/empreint).

---

## Installation

Le repo est aussi une **marketplace** (`.claude-plugin/marketplace.json`). Depuis Claude Code :

```
/plugin marketplace add vincentgraul/claude-workflow
/plugin install claude-workflow@vincentgraul
```

(ou pointe la marketplace sur ce dépôt local pendant le développement).

Après installation, ouvre `/hooks` une fois pour que la config des hooks soit rechargée.

---

## Utilisation

Tout est piloté en langage naturel — les skills se déclenchent sur l'intention :

- *« configure Claude Code pour ce projet »* → `scaffold`
- *« rédige la spec de la feature panier »* → `spec`
- *« implémente la story ajout-article »* → `orchestrator` (qui enchaîne `contract`, les lanes, `reviewer`, `pr`)

Les échanges sont menés en **français**.

---

## Conventions

- **Git** : conventional commits ; jamais sur `main`/`master` ; jamais de merge automatique.
- **Pas de tracker externe** : les specs versionnées dans `specs/` sont la source unique du besoin, l'avancement se lit dans les PR GitHub.
- **Une feature est un dossier, une story est un fichier** : `specs/<feature>/README.md` porte le cadrage et le `status` ; chaque `specs/<feature>/<story>.md` porte une story et ses critères d'acceptation (une checklist — jamais une story par critère).
- **Le slug est l'identifiant de la story** : c'est le nom de son fichier, donc unique par construction et fixé une fois pour toutes (le titre lisible, lui, peut changer). Sa branche `<feature>/<story>` reprend exactement son chemin sous `specs/`.
- **Contrat** : source unique de vérité en zod, gel strict pendant le travail parallèle.

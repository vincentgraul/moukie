# claude-workflow

Plugin Claude Code pour un développement **spec-driven** de bout en bout : du cadrage d'une feature jusqu'à l'ouverture de la PR, avec une implémentation **front/back en parallèle** disciplinée par un contrat d'interface gelé.

Le plugin embarque les **skills** du workflow, les **subagents** d'implémentation, et un **hook universel** anti-commit sur `main`/`master`.

---

## Le pipeline

```
scaffold  →  spec  →  jira  →  ┌─ contract ─┐  →  reviewer  →  pr
(config)    (WHY)   (tickets)  │ orchestrator│    (revue)     (PR)
                               │ front ∥ back│
                               └────────────┘
```

| Étape | Skill | Rôle | S'arrête à |
|-------|-------|------|-----------|
| 1 | `scaffold` | Entretien guidé → génère `.claude/` (settings, hooks, CLAUDE.md), branche les subagents et skills | Config validée |
| 2 | `spec` | Cadrage d'une feature → `specs/<feature>.md` (Epic + Stories + critères) | Spec `validated` |
| 3 | `jira` | Découpe la spec validée en hiérarchie Jira (1 Epic, N Stories) | Tickets créés/synchronisés |
| 4a | `contract` | Gèle l'interface front/back en schémas **zod** (si la story est multi-couche) | Contrat gelé |
| 4b | `orchestrator` | Implémente **une story** : lance les lanes front/back en parallèle (worktrees isolés), intègre, fait revoir | PR ouverte (délègue à `pr`) |
| 5 | `pr` | Tests + lint, commit (conventional), push, `gh pr create` | PR ouverte (**ne merge jamais**) |

Chaque skill a une **frontière nette** et passe explicitement la main à la suivante. Aucun ne merge ni ne saute d'étape.

---

## Les subagents

| Agent | Modèle | Outils | Usage |
|-------|--------|--------|-------|
| `front-web` | opus | tous | Lane front web — React + TS, design system [Empreint](https://github.com/vincentgraul/empreint), maquettes Figma (lecture) |
| `front-mobile` | opus | tous | Lane front mobile — React Native + TS, Empreint, Figma (lecture) |
| `backend` | opus | Read/Edit/Write/Bash/Grep/Glob | Lane back — endpoints, logique métier, accès données |
| `QA` | sonnet | Read/Edit/Write/Bash/Grep/Glob | Tests, couverture des critères d'acceptation |
| `reviewer` | opus | Read/Grep/Glob/Bash | Revue lecture seule avant PR — findings priorisés |
| `devops` | sonnet | Read/Edit/Write/Bash/Grep/Glob | CI/CD (GitHub Actions), hébergement, infra — **ad hoc**, hors boucle par story |

Les writers travaillent **contre le contrat zod gelé** : ils ne le modifient jamais et remontent tout besoin de changement à l'orchestrateur.

---

## Les hooks

- **PreToolUse / Bash** — refuse `git commit` quand la branche courante est `main` ou `master`. Garde-fou déterministe (les subagents tournent en autonomie : l'instruction seule ne suffit pas). Nécessite `jq`.
- **Notification** — notification macOS (`osascript`) quand une action attend l'utilisateur. macOS uniquement, échoue silencieusement ailleurs.

---

## Prérequis

- **`gh` CLI** installé et authentifié (compte GitHub Free suffit).
- **`jq`** (pour le hook anti-commit).
- **MCP Jira** connecté (écriture en `ask` via les permissions du scaffold).
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
- *« crée les tickets Jira de cette spec »* → `jira`
- *« implémente PROJ-34 »* → `orchestrator` (qui enchaîne `contract`, les lanes, `reviewer`, `pr`)

Les échanges sont menés en **français**.

---

## Conventions

- **Git** : conventional commits ; jamais sur `main`/`master` ; jamais de merge automatique.
- **Spec → Jira** : 1 fichier spec = 1 Epic ; chaque `### Story (<slug>) —` = 1 Story ; les critères d'acceptation restent une checklist (jamais un ticket par critère). Le **slug** stable appaire la story à son issue Jira (le titre lisible peut changer).
- **Contrat** : source unique de vérité en zod, gel strict pendant le travail parallèle.

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
| 1 | `scaffold` | Entretien guidé → génère le vault `project/`, le `CLAUDE.md` routeur et le `.claude/` (settings, hooks), branche les subagents et skills | Config validée |
| 2 | `spec` | Cadrage d'une feature → `project/specs/<feature>/` (son `README.md` + une story par fichier) | Feature `validated` |
| 3a | `contract` | Gèle l'interface front/back en schémas **zod** (si la story est multi-couche) | Contrat gelé |
| 3b | `orchestrator` | Implémente **une story** : lance les lanes front/back en parallèle (worktrees isolés), intègre, fait revoir | PR ouverte (délègue à `pr`) |
| 4 | `pr` | Commit (conventional), push, `gh pr create` | PR ouverte (**ne merge jamais**) |

Chaque skill a une **frontière nette** et passe explicitement la main à la suivante. Aucun ne merge ni ne saute d'étape.

À côté de ces étapes, deux **skills de connaissance** sont invoqués par les autres plutôt que par l'utilisateur :

| Skill | Rôle | Invoqué par |
|-------|------|-------------|
| `feature-sliced-design` | La méthodologie FSD v2.1 qui fait foi côté front | `front-web`, `front-mobile`, `reviewer` |
| `figma-annotations` | Récolte les annotations Dev Mode des maquettes et les normalise en règles exploitables | `spec`, `contract` |

---

## Le vault `project/`

Tout ce qui parle **du projet** plutôt que de son code vit dans un seul dossier à la racine du dépôt, en markdown :

```
project/
├── product.md        ← le WHY : problème résolu, pour qui, périmètre
├── stack.md          ← la stack retenue (source de vérité, pas le CLAUDE.md)
├── architecture.md   ← stratégie de dépôt, FSD côté front, Vertical Slice côté back
├── decisions.md      ← journal des arbitrages structurants
├── rules/            ← invariants propres au projet (auth.md, …)
└── specs/            ← les features et leurs stories
```

Ce dossier est à la fois le **vault Obsidian** de l'utilisateur — on l'ouvre tel quel, donc Obsidian n'indexe jamais `node_modules` — et le **contexte** que les agents chargent. Comme il est versionné dans le dépôt, une spec et le code qui l'implémente changent dans le même commit et la même PR.

Le `CLAUDE.md` à la racine est un **routeur**, pas une documentation : il importe `product.md` et `stack.md` (petits, toujours pertinents), renvoie vers le reste à la demande, et porte la **table des règles** — une ligne par fichier de `rules/`, domaine → fichier — pour qu'un agent sache lequel ouvrir sans les lire tous.

Un `architecture.canvas` peut être dessiné à la main dans Obsidian. C'est une **vue** : `architecture.md` reste la source canonique, celle que les agents lisent et que le `reviewer` confronte au code.

Trois outils suffisent donc pour mener un projet : **Figma** (les maquettes), **Obsidian** (le vault) et **Claude Code** (l'exécution).

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
- **Pas de tracker externe** : les specs versionnées dans `project/specs/` sont la source unique du besoin, l'avancement se lit dans les PR GitHub. Pas de fichier d'état d'avancement : il se désynchroniserait.
- **Une feature est un dossier, une story est un fichier** : `project/specs/<feature>/README.md` porte le cadrage et le `status` ; chaque `project/specs/<feature>/<story>.md` porte une story et ses critères d'acceptation (une checklist — jamais une story par critère).
- **Le slug est l'identifiant de la story** : c'est le nom de son fichier, donc unique par construction et fixé une fois pour toutes (le titre lisible, lui, peut changer). Sa branche `<feature>/<story>` reprend exactement son chemin sous `project/specs/`.
- **Contrat** : source unique de vérité en zod, gel strict pendant le travail parallèle.

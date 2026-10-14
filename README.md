# Moukie

Seul, de la maquette Figma à la PR : Moukie est un plugin Claude Code qui code ton front et ton back **en parallèle** contre un contrat partagé, puis te rapporte la PR. C'est toi qui merges.

Le plugin embarque les **skills** du workflow et les **subagents** d'implémentation. À l'initialisation, il installe dans chaque projet un **hook git** qui refuse les commits sur `main`/`master`.

---

## Le pipeline

```
setup     →  spec  →  ┌─ contract ─┐  →  reviewer  →  pr
(config)    (WHY)     │ orchestrator│    (revue)     (PR)
                      │ front ∥ back│
                      └────────────┘
```

| Étape | Skill | Rôle | S'arrête à |
|-------|-------|------|-----------|
| 1 | `setup` | Entretien de cadrage (produit, stack, architecture) → écrit le vault `project/`, fait générer le code manquant par `scaffold`, configure permissions, linter, garde-fou git et `CLAUDE.md` | PR d'initialisation ouverte |
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
├── market.md         ← alternatives, positionnement, licence ou modèle économique
├── stack.md          ← la stack retenue (source de vérité, pas le CLAUDE.md)
├── architecture.md   ← stratégie de dépôt, FSD côté front, Vertical Slice côté back
├── decisions.md      ← journal des arbitrages structurants
├── design.md         ← liens vers les maquettes et le design system
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
| `front-web` | sonnet | tous | Lane front web — React + TS, design system [Empreint](https://github.com/vincentgraul/empreint), maquettes Figma (lecture) |
| `front-mobile` | sonnet | tous | Lane front mobile — React Native + TS, Empreint, Figma (lecture) |
| `backend` | sonnet | Read/Edit/Write/Bash/Grep/Glob | Lane back — endpoints, logique métier, accès données |
| `reviewer` | sonnet | Read/Grep/Glob/Bash/Skill | Revue lecture seule avant PR — findings priorisés |

Les agents tournent sur **Sonnet** par défaut ; l'orchestrateur passe une lane en Opus seulement pour une story complexe.

Les writers travaillent **contre le contrat zod gelé** : ils ne le modifient jamais et remontent tout besoin de changement à l'orchestrateur.

---

## Les hooks

- **Garde-fou git** — `setup` installe dans chaque projet un hook `pre-commit` (`.githooks/`) qui refuse tout commit sur `main` ou `master`, activé automatiquement à l'installation des dépendances. Garde-fou déterministe : les subagents tournent en autonomie, l'instruction seule ne suffit pas.
- **Notification** (hook du plugin) — notification macOS (`osascript`) quand une action attend l'utilisateur. macOS uniquement, échoue silencieusement ailleurs.

---

## Prérequis

- **`gh` CLI** installé et authentifié (compte GitHub Free suffit).
- **MCP Figma** connecté (lecture seule ; l'écriture est en `deny`).
- Front : design system [Empreint](https://github.com/vincentgraul/empreint).

---

## Installation

Le repo est aussi une **marketplace** (`.claude-plugin/marketplace.json`). Depuis Claude Code :

```
/plugin marketplace add vincentgraul/moukie
/plugin install moukie@vincentgraul
```

(ou pointe la marketplace sur ce dépôt local pendant le développement).

Après installation, ouvre `/hooks` une fois pour que la config des hooks soit rechargée.

---

## Utilisation

Tout est piloté en langage naturel — les skills se déclenchent sur l'intention :

- *« configure Claude Code pour ce projet »* → `setup`
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

---

## Contribuer

Les contributions sont bienvenues : lis [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

[MIT](LICENSE)

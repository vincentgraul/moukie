---
name: scaffold
description: Initialise toute la configuration Claude Code d'un projet via un entretien guidé. Se déclenche quand l'utilisateur souhaite créer un nouveau projet ou configurer Claude Code dans un projet existant, afin de générer le vault `project/` (produit, stack, architecture, règles, specs), un CLAUDE.md, plus les agents, skills, hooks et settings nécessaires.
model: opus
---

# Skill Scaffold

## Règles

### Conventions de nommage

Pour définir les conventions de nommage du projet reprends le fichier du plugin `${CLAUDE_PLUGIN_ROOT}/references/naming-conventions.md`.

### Commentaires

N'écris pas de commentaires dans le code. Pas de mention de co-auteur Claude ou autre.

### Git

Ne fais aucun merge sur `master` ou `main` et ne merge jamais les PR.

---

## Phase 1 — Préparation

Avant de poser quoi que ce soit, regarde le répertoire pour que les questions soient pré-remplies plutôt que génériques :
lance `ls -la` et lis `package.json`, `tsconfig.json`, `README`, `CLAUDE.md`, le contenu de `project/` s'il existe déjà, et les fichiers dans le `.claude/`.

Résume en une ou deux lignes ce que tu as détecté, puis démarre l'entretien en proposant tes valeurs détectées comme valeurs par défaut, pour que l'utilisateur confirme au lieu de tout taper.

---

## Phase 2 — Entretien

Pose les questions en **français** par lots et dans l'ordre en utilisant l'outil `AskUserQuestion`. Laisse toujours l'utilisateur remplacer les valeurs par défaut.
Saute toute question déjà résolue par la Phase 1. 
À la fin de l'entretien récapitule et demande une confirmation avant d'écrire quoi que ce soit.
 **Utilise WebSearch durant l'entretien afin d'être à jour pour proposer les meilleures pratiques**

### Lot A — Identité
- Nom du projet
- Type de projet : `application web` / `application mobile` / `site e-commerce` / `librairie de composants` / `autre`
- Commercial : `oui` ou `non`
- Description du projet (**tu te dois de poser des questions si la description ne te semble pas suffisamment clair**)

### Lot B — Stack
Ceci est la stack que j'utilise généralement sur mes projets mais sens-toi libre de proposer autre chose :

#### Commun
- langage: `TypeScript`
- runtime et gestionnaire de paquets: `Bun`
- linter et formatter: `Biome`
- monorepo: `Turborepo`
- forge: `GitHub`
- CI/CD: `GitHub Actions`
- conteneurisation: `Docker`
- workflows: `Git conventional commit`, `Spec-driven development`
- gestion de projet: les specs versionnées dans `project/specs/`

#### Frontend web
- bibliothèques: `React`, `Empreint`, `TanStack Router`, `TanStack Form`, `TanStack Query`
- build tool: `Vite`
- tests: `Vitest`, `Playwright`
- documentation: `Storybook`
- icons: `Lucide React`

#### Frontend mobile
- bibliothèques: `React native`
- icons: `Lucide React native`

#### Backend
- framework: `Hono`
- validation: `Zod`
- authentification: `Better Auth`
- ORM: `Kysely`
- base de données: `PostgreSQL`
- documentation: `Scalar`
- tests: `Vitest`

#### E-commerce
- plateforme: `Shopify`

### Lot C — Outils externes

#### GitHub
J'utilise un compte `Github Free`.
Assure-toi que le CLI `gh` soit bien installé.

#### Figma
J'utilise un compte `Figma Professionnel License Full`.
Assure-toi que le MCP Figma soit bien connecté.
**Demande deux URLs :**
- les maquettes du projet sur Figma
- le DS du projet sur Figma

#### Docker
Si le projet a besoin d'un backend, vérifie que `Docker Desktop` soit bien installé sur mon environnement, sinon informe-moi avant de continuer.

---

## Phase 3 — Architecture

### Stratégie de dépôt 

Un projet contenant deux apps ou plus (ex: front et back) sera en **monorepo**. Sinon il sera en repo simple.

---

### Architecture Front (web & mobile)

L'architecture front suit **Feature-Sliced Design v2.1**.
Le skill `feature-sliced-design` (embarqué dans le plugin) **fait foi**.

#### Utilisation de steiger

Installe `steiger` et `@feature-sliced/steiger-plugin` en devDependency et ajoute un script `fsd` dans le `package.json` pour l'exécuter.

---

### Architecture Back

L'architecture back suit **Modular Monolith et Vertical Slice** :

- **Vertical Slice** : le code est organisé par feature (chaque slice contient sa route, sa logique et son accès données), pas par couche technique
- **Modular Monolith** : les slices sont regroupées en modules (bounded contexts) qui communiquent via leur API publique

## Phase 4 — Génération du vault `project/`

Le dossier `project/`, à la racine du dépôt, porte tout ce qui parle **du projet** plutôt que de son code. Il est à la fois le **vault Obsidian** de l'utilisateur et le **contexte** que les agents chargent. Il vit dans le dépôt : une spec et le code qui l'implémente changent ainsi dans le même commit et la même PR.

```
project/
├── product.md
├── stack.md
├── architecture.md
├── decisions.md
├── rules/
└── specs/
```

Écris chaque fichier à partir de ce que l'entretien a produit. **N'invente rien** : s'il manque un élément, retourne le demander. Si un fichier existe déjà, **fusionne au plus près** plutôt que de réécrire.

- **`product.md`** — le WHY du projet : le problème résolu, pour qui, le périmètre. Reprend la description obtenue au Lot A. Aucune technique ici.
- **`stack.md`** — la stack retenue au Lot B, groupée par domaine (commun / front / back), chaque choix avec sa version majeure. C'est **la** source de vérité de la stack : le `CLAUDE.md` ne la duplique pas, il pointe ici.
- **`architecture.md`** — la stratégie de dépôt (repo simple ou monorepo) et la structure retenue en Phase 3 : FSD v2.1 côté front, Modular Monolith + Vertical Slice côté back, et l'emplacement du contrat partagé. Source **canonique** de l'architecture : c'est elle que les agents lisent et que le `reviewer` confronte au code.
- **`decisions.md`** — le journal des arbitrages structurants, une entrée par décision : date, choix retenu, options écartées, raison. Amorce-le avec ce qui a été tranché pendant l'entretien (ORM, framework, stratégie de dépôt…). Il évite qu'un agent rouvre un débat déjà clos.
- **`rules/`** — crée le dossier vide. Il n'accueille que les règles **propres à ce projet** ; les conventions de nommage, elles, restent dans le plugin (voir la règle en tête de ce skill).
- **`specs/`** — crée le dossier vide, c'est le skill `spec` qui le remplit.

N'écris **pas** de `roadmap.md` ni de fichier d'état d'avancement : le `status` d'une feature vit dans le frontmatter de son `README.md` sous `project/specs/`, et l'avancement se lit dans les PR GitHub. Un second endroit se désynchroniserait.

### Obsidian

`project/` est fait pour être ouvert tel quel comme vault dans Obsidian, ce qui lui évite d'indexer `node_modules`. Tu n'as rien à installer : signale simplement à l'utilisateur qu'il peut l'ouvrir ainsi.

Quand Obsidian créera `project/.obsidian/`, cette configuration se versionne (plugins, thème, exclusions) **sauf** `workspace.json`, qui ne porte que la disposition des fenêtres. Ajoute donc au `.gitignore` du projet :

```
project/.obsidian/workspace.json
```

Un `architecture.canvas` peut être ajouté à la main par l'utilisateur : c'est une **vue**, jamais une source de vérité. Ne le génère pas.

---

## Phase 5 — Génération des fichiers de configuration

### Génération du .claude/settings.json

Si le `.claude/settings.json` n'existe pas à la racine du projet crée-le, sinon fusionne-le avec les règles suivantes :

#### Permissions

Les noms d'outils MCP sont **propres à chaque serveur connecté**. Ne devine pas, ne hardcode pas.
**Liste d'abord les outils réellement exposés par chaque serveur MCP connecté** (Figma) et
classe chacun en **lecture** ou **écriture**.

Applique ensuite les règles ci-dessous à ces noms réels :

- Figma : `deny` sur les outils d'écriture, `allow` sur la lecture
- GitHub : `allow` sur l'outil git et gh
- Bun : `allow` sur l'outil Bun

### Génération du biome.json

Si le `biome.json` n'existe pas à la racine du projet lance `biome init`, sinon fusionne le en activant les règles suivantes : `useFilenamingConvention`, `useNamingConvention` et `noDefaultExport`.

Ajoute un script `check` dans le `package.json` pour exécuter `biome check`.
**Vérifie que la configuration fonctionne bien avant de continuer.**

### Génération du docker-compose.yml

Si le projet a besoin d'un backend, crée un `docker-compose.yml` à la racine du projet avec les informations que tu estimes nécessaires.
Si ce fichier existe déjà fusionne-le. 

---

## Phase 6 — Mise en place des agents

Les agents sont définis dans le plugin. Assure-toi que tu as bien accès aux agents suivant (sinon, signale-le): `backend`, `front-mobile`, `front-web`, `reviewer`.

Utilise les agents requis pour ce projet en prenant en compte ces règles:

- Les agents writers seront isolés par **worktree**, avec leurs permissions d'**écriture (`Write`/`Edit`) pré-autorisées** pour qu'ils avancent sans s'interrompre
- Le travail des agents en parallèle est piloté par le skill `orchestrator`, autour d'un contrat d'interface géré par le skill `contract`
- Un agent est **autonome**, il n'a pas besoin de moi pour avancer dans son travail

---

## Phase 7 — Utilisation des skills

Assure-toi que tu as bien accès aux skills suivant: `spec`, `contract`, `orchestrator`, `pr` sinon signale-le.

---

## Phase 8 — Génération du CLAUDE.md

Génère le `CLAUDE.md` **en dernier**, une fois le vault, la stack, les permissions, l'outillage, les hooks, les agents et les skills de workflow définis, pour qu'il puisse les documenter fidèlement.

Écris-le à la racine du projet. C'est le **seul** fichier que Claude Code charge automatiquement : il est donc un **routeur**, pas une documentation. Il ne duplique jamais le contenu de `project/`, il y renvoie. Garde-le **sous ~100 lignes** et utilise le cadre `WHAT` / `WHY` / `HOW`.

### Le cadrage, importé

Le contenu de ces fichiers doit être présent à chaque session : importe-les.

```
@project/product.md
@project/stack.md
```

N'importe ainsi que des fichiers **petits et toujours pertinents**. Si l'un d'eux grossit, remplace son import par un simple renvoi : un import est payé en contexte à chaque session.

### Les fichiers à lire à la demande

Pour ceux-là, écris une **instruction de lecture**, pas un import :

- `project/architecture.md` — avant de créer un module ou de décider où placer du code
- `project/decisions.md` — avant de remettre en cause un choix structurant
- `project/specs/<feature>/<story>.md` — la story en cours, et le `README.md` de sa feature

### La table des règles

Une ligne par fichier de `project/rules/`, domaine → fichier, pour qu'un agent sache lequel ouvrir **sans les lire tous** :

| Domaine | Règle |
|---|---|
| Authentification et contrôle d'accès | `project/rules/auth.md` |

C'est le mécanisme d'aiguillage des règles : **tiens cette table à jour** à chaque règle ajoutée. Sans elle, un agent charge tout `rules/` et paye le contexte, ou n'en lit aucun et les règles deviennent décoratives.

Sur un projet neuf, `project/rules/` est vide : **n'écris pas la table**, une table vide coûte du contexte à chaque session sans rien aiguiller. Elle apparaît avec la première règle.

### Le workflow

Les skills disponibles et leur enchaînement, les agents et leur rôle, et les interdits : jamais de commit sur `main`/`master`, jamais de merge, pas de commentaires dans le code, pas de mention de co-auteur.

## Phase 9 - Commit & Push

Une fois le scaffold finalisé crée une branche `scaffold`, commit, push cette branche et ouvre une PR sur `main` (ou `master`).
Incite ensuite l'utilisateur à faire le merge de cette PR.
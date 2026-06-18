---
name: scaffold
description: Initialise toute la configuration Claude Code d'un projet via un entretien guidé. Se déclenche quand l'utilisateur souhaite créer un nouveau projet ou configurer Claude Code dans un projet existant, afin de générer un CLAUDE.md de qualité plus les subagents, skills, hooks et settings nécessaires.
model: opus
---

# Scaffolding du projet

Mène un entretien puis génère une configuration `.claude/` complète pour les besoins du projet.
Déroule les phases dans l'ordre et mène l'entretien en **français**.
Pose un lot de questions à la fois avec l'outil `AskUserQuestion`.
Ne déverse jamais toutes les questions d'un coup, et n'écris aucun fichier tant que l'entretien n'est pas terminé et confirmé.
 **Utilise WebSearch durant l'entretien afin d'être à jour pour proposer les meilleurs pratiques**

Ce scaffold est défini dans mon plugin Claude (https://github.com/vincentgraul/claude-workflow). Il vient donc avec d'autres skills, des agents et des hooks. **Tu te dois d'avoir connaissance de cet environnement**.

---

## Phase 0 — Détection du contexte

Avant de poser quoi que ce soit, regarde le repository pour que les questions soient pré-remplies plutôt que génériques :
lance `ls -la` et lis `package.json`, `tsconfig.json`, `README`, `CLAUDE.md` et les fichiers dans le `.claude/`.

Résume en une ou deux lignes ce que tu as détecté, puis démarre l'entretien en proposant tes valeurs détectées comme valeurs par défaut, pour que l'utilisateur confirme au lieu de tout taper.

---

## Phase 1 — Entretien

Pose les questions par lots. Laisse toujours l'utilisateur remplacer les valeurs par défaut.
Saute toute question déjà résolue par la Phase 0. 
À la fin de l'entretien récapitule et demande une confirmation avant d'écrire quoi que ce soit.

### Lot A — Identité
- Nom du projet
- Type de projet : `application web` / `application mobile` / `site e-commerce` / `librairie de composants` / `autre`
- Commercial : `oui` ou `non`
- Description du projet (**tu te dois de poser des questions si la description ne te semble pas suffisamment clair**)

### Lot B — Stack
Ceci est la stack que j'utilise généralement sur mes projets mais sens toi libre de proposer autre chose :

#### Commun
- langage: `TypeScript`
- runtime et gestionnaire de paquets: `Bun`
- linter et formatter: `Biome`
- monorepo: `Turborepo`
- forge: `GitHub`
- CI/CD: `GitHub Actions`
- conteneurisation: `Docker`
- workflows: `Git conventional commit`, `Spec-driven development`
- gestion de projet: `Jira`

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
Assure toi que le CLI `gh` soit bien installé.

#### Figma
J'utilise un compte `Figma Professionnel License Full`.
Assure toi que le MCP Figma soit bien connecté.
**Demande deux URLs :**
- les maquettes du projet sur Figma
- le DS du projet sur Figma

#### Jira
J'utilise un compte `Jira Free`
Assure toi que le MCP Jira soit bien connecté.
**Demande l'url du projet Jira**.

---

## Phase 2 — Architecture

Reprends le fichier canonique du plugin `references/architecture.md`

## Phase 2 — Génération du settings.json

Écris `.claude/settings.json` à la racine du projet. **Lis-le d'abord s'il existe déjà et fusionne**, n'écrase jamais des tableaux `allow` / `deny` / `ask` ou `hooks` existants, ajoute aux tableaux.

### Permissions

Les noms d'outils MCP sont **propres à chaque serveur connecté**. Ne devine pas, ne hardcode pas.
**Liste d'abord les outils réellement exposés par chaque serveur MCP connecté** (Figma, Jira) et
classe chacun en **lecture** ou **écriture**.
Applique ensuite les règles ci-dessous à ces noms réels :

- Figma : **lecture autorisée, écriture interdite** → `deny` sur les outils d'écriture, `allow` sur la lecture.
- Jira : **lecture autorisée, écriture avec permission** → `ask` sur les outils d'écriture.
- GitHub : **aucun merge sur `master` ou `main` et ne merge jamais les PR**

---

## Phase 3 — Configuration de Biome

Configure **Biome** à la racine. Biome est une devDependency parmi d'autres : son installation suit le sort des paquets du `package.json`, ce n'est pas une étape à part.

- **Écris `biome.json`** à la racine. Si un `biome.json` existe déjà, **lis-le et fusionne** plutôt que d'écraser. Mets : formatter activé, `linter.rules.recommended`, plus les règles qui encodent le **sous-ensemble lintable** des conventions (`references/naming-conventions.md`) :
  - `useFilenamingConvention` réglé sur le casing de fichiers retenu (ex. `kebab-case`),
  - `useNamingConvention` pour le casing des identifiants,
  - `noDefaultExport` si la convention impose les named exports.
  
  Adapte les règles à la stack et aux conventions **réelles** du projet ; n'active pas de règle que tu ne peux pas justifier.
- **Câble les scripts** `package.json` : `lint`, `format`, `check` (via `biome`).
- **Vérifie que la config tourne avant de continuer** : lance `biome check .`. Une erreur de **config** (règle inconnue, JSON invalide) se corrige ici ; des findings lint légitimes, eux, sont normaux.
- Hook **format-on-write** (`PostToolUse` sur `Write|Edit`) : **optionnel** — propose-le, ne l'impose pas.

---

## Phase 4 — Mise en place des subagents

Les subagents sont définis dans le plugin. Assure toi que tu as bien accès aux subagents suivant (sinon, signal le): `backend`, `devops`, `front-mobile`, `front-web`, `QA`, `reviewer`.

Utilise les subagents requis pour ce projet en prenant en compte ces règles:

- Les subagents writers seront isolés par **worktree**, avec leurs permissions d'**écriture (`Write`/`Edit`) pré-autorisées** pour qu'ils avancent sans s'interrompre
- Le travail des subagents en parallèle est piloté par le skill `orchestrator`, autour d'un contrat d'interface géré par le skill `contract`
- Un subagent est **autonome**, il n'a pas besoin de moi pour avancer dans son travail

---

## Phase 5 — Utilisation des skills de workflow

Assure toi que tu as bien accès aux skills suivant: `spec`, `jira`, `contract`, `orchestrator`, `pr`

---

## Phase 6 — Génération du CLAUDE.md

Génère le `CLAUDE.md` **en dernier**, une fois la stack, les permissions, l'outillage, les hooks, les subagents et les skills de workflow définis, pour qu'il puisse les documenter fidèlement.

Écris le `CLAUDE.md` à la racine du repository. Garde-le **sous ~150 lignes**.
Utilise le cadre WHAT / WHY / HOW.

**Conventions de nommage** : reprends le fichier canonique du plugin `references/naming-conventions.md`, **adapte-le à la stack retenue** (ne garde que les sections pertinentes — ex. Hono côté back, React côté front), et écris-le dans le projet en `docs/naming-conventions.md`. Référence-le depuis le `CLAUDE.md`. C'est ce fichier projet que les agents writers et le `reviewer` consultent. Le **sous-ensemble lintable** est déjà encodé dans `biome.json` (Phase 3) — ici, tu **documentes et référence**, tu ne re-spécifies pas les règles Biome.
---
name: scaffold
description: Initialise toute la configuration Claude Code d'un projet via un entretien guidé. Se déclenche quand l'utilisateur souhaite créer un nouveau projet ou configurer Claude Code dans un projet existant, afin de générer un CLAUDE.md de qualité plus les agents, skills, hooks et settings nécessaires.
model: opus
---

# Skill Scaffold

## Règles

### Conventions de nommage

Pour définir les conventions de nommage du projet reprends le fichier canonique du plugin `references/naming-conventions.md` et écris-le dans le projet en `docs/naming-conventions.md`. Référence-le depuis le `CLAUDE.md`. C'est ce fichier que les agents consultent.

### Commentaires

N'écris pas de commentaires dans le code. Pas de mention de co-auteur Claude ou autre.

### Git

Ne fais aucun merge sur `master` ou `main` et ne merge jamais les PR.

---

## Phase 1 — Préparation

Avant de poser quoi que ce soit, regarde le repository pour que les questions soient pré-remplies plutôt que génériques :
lance `ls -la` et lis `package.json`, `tsconfig.json`, `README`, `CLAUDE.md` et les fichiers dans le `.claude/`.

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
Assure-toi que le CLI `gh` soit bien installé.

#### Figma
J'utilise un compte `Figma Professionnel License Full`.
Assure-toi que le MCP Figma soit bien connecté.
**Demande deux URLs :**
- les maquettes du projet sur Figma
- le DS du projet sur Figma

#### Jira
J'utilise un compte `Jira Free`
Assure-toi que le MCP Jira soit bien connecté.
**Demande l'url du projet Jira**.

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

## Phase 4 — Génération des fichiers de configuration

### Génération du .claude/settings.json

Si le `.claude/settings.json` n'existe pas à la racine du projet crée-le, sinon fusionne-le avec les règles suivantes :

#### Permissions

Les noms d'outils MCP sont **propres à chaque serveur connecté**. Ne devine pas, ne hardcode pas.
**Liste d'abord les outils réellement exposés par chaque serveur MCP connecté** (Figma, Jira) et
classe chacun en **lecture** ou **écriture**.

Applique ensuite les règles ci-dessous à ces noms réels :

- Figma : `deny` sur les outils d'écriture, `allow` sur la lecture
- Jira : `allow` sur les outils d'écriture et de lecture
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

## Phase 5 — Mise en place des agents

Les agents sont définis dans le plugin. Assure-toi que tu as bien accès aux agents suivant (sinon, signale-le): `backend`, `front-mobile`, `front-web`, `reviewer`.

Utilise les agents requis pour ce projet en prenant en compte ces règles:

- Les agents writers seront isolés par **worktree**, avec leurs permissions d'**écriture (`Write`/`Edit`) pré-autorisées** pour qu'ils avancent sans s'interrompre
- Le travail des agents en parallèle est piloté par le skill `orchestrator`, autour d'un contrat d'interface géré par le skill `contract`
- Un agent est **autonome**, il n'a pas besoin de moi pour avancer dans son travail

---

## Phase 6 — Utilisation des skills

Assure-toi que tu as bien accès aux skills suivant: `spec`, `jira`, `contract`, `orchestrator`, `pr` sinon signale-le.

---

## Phase 7 — Génération du CLAUDE.md

Génère le `CLAUDE.md` **en dernier**, une fois la stack, les permissions, l'outillage, les hooks, les agents et les skills de workflow définis, pour qu'il puisse les documenter fidèlement.

Écris le `CLAUDE.md` à la racine du projet. Garde-le **sous ~150 lignes**.
Utilise le cadre `WHAT` / `WHY` / `HOW`.

## Phase 8 - Commit & Push

Une fois le scaffold finalisé crée une branche `scaffold`, commit, push cette branche et ouvre une PR sur `main` (ou `master`).
Incite ensuite l'utilisateur à faire le merge de cette PR.
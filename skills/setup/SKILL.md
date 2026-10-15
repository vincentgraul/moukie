---
name: setup
description: Initialise un projet pour le workflow Moukie. Mène l'entretien de cadrage (l'identité, puis le produit, la stack et l'architecture par leurs skills), écrit le vault `project/`, fait générer le code manquant par `scaffold`, puis configure le workflow : permissions, linter, garde-fou git, fichiers open source et `CLAUDE.md`. Se déclenche quand l'utilisateur veut démarrer un projet avec Moukie, ou installer le workflow Moukie dans un projet existant. S'arrête à la PR d'initialisation.
metadata:
  moukie-badge: "project"
  moukie-icon: "rocket"
  moukie-rank: "1"
  moukie-summary: "Mène l'entretien de départ et configure tout le workflow."
  moukie-produces: "Crée project/ et CLAUDE.md"
---

# Skill Setup

## Règles

Mène les échanges en **français**.
N'écris pas de commentaires dans le code.
Commite en conventional commits, avec des messages en anglais et sans mention de co-auteur.
N'utilise jamais `--no-verify` : les hooks du dépôt sont des garde-fous, pas des obstacles.
Ne merge jamais sur `main`, et ne merge jamais une PR : c'est l'utilisateur qui merge.
Applique le skill `naming-conventions` à tout ce que tu nommes.

---

## Phase 1 — Préparation

Ouvre par une seule ligne de présentation, puis passe au travail :

> Je suis Moukie, ton compagnon de projet : on cadre ensemble, je code en parallèle et je te rapporte la PR. C'est toi qui merges.

Regarde ensuite ce qui existe déjà, pour proposer des valeurs plutôt que de poser des questions à vide : lance `ls -la`, puis lis les manifestes présents (`package.json`, `Package.swift`, `build.gradle`, `pubspec.yaml`…), le `README`, le `CLAUDE.md`, le contenu de `project/` et celui de `.claude/`.

Résume en une ou deux lignes ce que tu as détecté.

---

## Phase 2 — Entretien

Pose les questions par lots, dans l'ordre, avec l'outil `AskUserQuestion`. Propose les valeurs détectées en Phase 1 comme valeurs par défaut, et saute les questions déjà résolues.

Les skills `product` et `stack` écrivent leurs fichiers pendant l'entretien. Pour tout le reste, rien n'est écrit avant la fin : récapitule, puis demande une confirmation.

### 2.1 — Identité

- le **nom** du projet
- son **type** : `application web` / `application mobile` / `site e-commerce` / `bibliothèque de composants` / `autre`
- sa **nature** : `commercial` / `open source` / `personnel`. Elle décide de ce que le skill `product` analyse, des licences acceptables pour les dépendances, et des fichiers open source de la Phase 6

### 2.2 — Produit

Invoque le skill `product` en lui transmettant le nom, le type et la nature du projet. Il écrit `project/product.md`, et `project/market.md` si le projet est commercial ou open source. Le produit passe avant la stack, parce que la stack se décide à partir de lui.

### 2.3 — Stack

Invoque le skill `stack`. Il écrit `project/stack.md` et les premières entrées de `project/decisions.md`. Reprends la main quand il a fini : toute la suite s'appuie sur `stack.md`.

### 2.4 — Outils externes

- **forge** : vérifie que la CLI officielle de la forge retenue par `stack.md` est installée et authentifiée, `gh` pour GitHub, `glab` pour GitLab. Sans elle, le skill `pr` ne pourra pas ouvrir de PR
- **Figma** : demande si le projet a des maquettes. Si oui, vérifie que le MCP Figma est connecté, puis demande deux URLs de **fichier**, pas de nœud : celle des maquettes et celle du design system. Elles iront dans `project/design.md` en Phase 4. Sans maquettes, ne force rien : le projet n'aura pas de `design.md`
- **Docker** : si `stack.md` retient Docker, vérifie que Docker Desktop est installé. Sinon, signale-le avant de continuer

---

## Phase 3 — Architecture

Invoque le skill `architecture`. Il écrit `project/architecture.md` et complète `project/decisions.md`. Reprends la main quand il a fini : le code et la configuration en dépendent.

---

## Phase 4 — Vault `project/`

Le dossier `project/` porte tout ce qui parle **du projet** plutôt que de son code. C'est à la fois le **vault Obsidian** de l'utilisateur et le **contexte** que les agents chargent. Une spec et le code qui l'implémente y changent dans la même PR.

Écris chaque fichier à partir de ce que l'entretien a produit. **N'invente rien** : s'il manque un élément, retourne le demander. Si un fichier existe déjà, **modifie-le au plus près**.

| Fichier | Contenu | Qui l'écrit |
|---|---|---|
| `product.md`, `market.md` | le produit ; la concurrence, le positionnement, la licence | déjà écrits par `product` |
| `stack.md` | **la** source de vérité de la stack | déjà écrit par `stack` |
| `architecture.md` | les apps, le dépôt, le découpage, les modules, le contrat | déjà écrit par `architecture` |
| `decisions.md` | le journal des arbitrages : date, choix, options écartées, raison | amorcé par les skills : complète-le avec le reste de l'entretien |
| `design.md` | les URLs des maquettes et du design system | ce skill, seulement si le projet a des maquettes |
| `rules/` | les règles **propres à ce projet** | ce skill, qui crée le dossier vide |
| `specs/` | les features et leurs stories | ce skill, qui crée le dossier vide ; `spec` le remplit |

Gabarit de `design.md` :

```markdown
# Design

## Maquettes
<URL du fichier Figma des maquettes>

## Design system
<URL du fichier Figma du design system>

## Annotations
Les règles fonctionnelles sont posées en annotations Dev Mode sur les éléments des maquettes. Le skill `figma-annotations` les récolte au moment de la spec ; c'est ensuite la story qui fait foi.
```

N'écris **pas** de `roadmap.md` ni de fichier d'avancement : le `status` d'une feature vit dans le frontmatter de son `README.md`, et l'avancement se lit dans les PR.

`project/` s'ouvre tel quel comme vault dans Obsidian : signale-le à l'utilisateur. Sa configuration dans `project/.obsidian/` se versionne, sauf la disposition des fenêtres : ajoute `project/.obsidian/workspace.json` au `.gitignore`. Ne génère pas d'`architecture.canvas` : c'est une vue que l'utilisateur dessine, jamais une source de vérité.

---

## Phase 5 — Code

Invoque le skill `scaffold`. Il génère ce que `architecture.md` prévoit et qui n'existe pas encore. Sur un projet existant, il ne touche à rien et signale seulement les écarts. Reprends la main quand il a fini.

---

## Phase 6 — Configuration du workflow

### Permissions

Crée `.claude/settings.json` à la racine du projet, ou fusionne-le s'il existe.

Les noms d'outils MCP sont **propres à chaque serveur connecté** : ne les devine pas. **Liste d'abord les outils réellement exposés** par chaque serveur MCP connecté, Figma compris, et classe chacun en **lecture** ou **écriture**. Applique ensuite ces règles aux noms réels :

- Figma : `deny` sur les outils d'écriture, `allow` sur la lecture
- git et la CLI de la forge retenue par `stack.md` : `allow`
- le runtime et le gestionnaire de paquets retenus par `stack.md` : `allow`
- `Edit` et `Write` : `allow`, pour que les agents avancent dans leurs worktrees sans s'interrompre

### Linter

Configure le linter retenu par `stack.md` pour faire respecter le skill `naming-conventions`. Avec Biome, par exemple : `useFilenamingConvention`, `useNamingConvention` et `noDefaultExport`. Si une configuration existe déjà, fusionne-la.

Expose-le par une commande `check` : c'est elle que l'orchestrateur et le `reviewer` lancent, jamais une commande propre à un outil. **Vérifie qu'elle fonctionne avant de continuer.**

### Outillage de l'architecture

Si l'architecture retenue a un outil qui vérifie son découpage, installe-le et expose-le par une commande `check:architecture`. Par exemple, `steiger` pour Feature-Sliced Design.

### Garde-fou

**Lis `references/garde-fou.md`** et installe le hook qui refuse les commits sur `main`.

### Projet open source

Seulement si la nature du projet est **open source** : **lis `references/open-source.md`** et écris les fichiers qu'il prévoit.

---

## Phase 7 — Agents et skills

Vérifie que tu as accès à tout ce que le workflow utilise, et signale ce qui manque :

- les **agents** du plugin : `backend`, `front-web`, `front-mobile`, `reviewer`
- les **skills du workflow** : `product`, `stack`, `architecture`, `scaffold`, `spec`, `contract`, `orchestrator`, `pr`
- les **skills de connaissance** : `naming-conventions`, `feature-sliced-design`, `figma-annotations`
- si le projet a des maquettes, les skills du plugin Figma officiel : `figma-design-to-code`, et `figma-swiftui` pour une app en SwiftUI

---

## Phase 8 — `CLAUDE.md`

Écris le `CLAUDE.md` **en dernier**, à la racine du projet : il doit décrire fidèlement le vault, la stack, les commandes, les hooks, les agents et les skills. **Lis `references/claude-md.md`** et suis son gabarit.

---

## Phase 9 — Commit et PR

Sur un dépôt sans aucun commit, il n'existe pas encore de `main` vers laquelle ouvrir une PR. Commence donc par un commit initial vide sur `main`, la seule exception qu'autorise le garde-fou, et pousse-le.

Crée ensuite une branche `setup`, commite l'initialisation en conventional commits, pousse la branche, puis ouvre une PR vers `main` (ou `master`) avec la CLI de la forge.

---

## Fin

Donne le lien de la PR et invite l'utilisateur à la merger lui-même. La suite se passe avec le skill `spec`, pour cadrer une première feature.

C'est une **frontière de session** : tout le contexte utile est dans `project/` et dans git. Donne la commande à lancer une fois la PR mergée (`/moukie:spec`), puis propose de vider la conversation : dans l'app desktop, avec l'outil qui vide la session, après accord de l'utilisateur ; ailleurs, en l'invitant à taper `/clear`. Le vidage vient en dernier.

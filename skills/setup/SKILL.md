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

Pose les questions par lots, dans l'ordre, avec l'outil `AskUserQuestion`. Propose les valeurs détectées en Phase 1 comme valeurs par défaut, laisse toujours l'utilisateur les remplacer, et saute les questions déjà résolues. Appuie-toi sur `WebSearch` pour proposer des pratiques à jour.

Les skills `product` et `stack` écrivent leurs fichiers pendant l'entretien. Pour tout le reste, rien n'est écrit avant la fin : récapitule, puis demande une confirmation.

### 2.1 — Identité

- le **nom** du projet
- son **type** : `application web` / `application mobile` / `site e-commerce` / `bibliothèque de composants` / `autre`
- sa **nature** : `commercial` / `open source` / `personnel`. Elle décide de ce que le skill `product` analyse, des licences acceptables pour les dépendances, et des fichiers open source de la Phase 6

### 2.2 — Produit

Une fois l'identité confirmée, invoque le skill `product` en lui transmettant le nom, le type et la nature du projet. Il mène l'entretien produit, fait la veille, puis écrit `project/product.md`, et `project/market.md` si le projet est commercial ou open source.

Le produit passe avant la stack, parce que la stack se décide à partir de lui.

### 2.3 — Stack

Invoque le skill `stack`. Il confronte ses préférences par défaut au produit, fait la veille, soumet les arbitrages à l'utilisateur, puis écrit `project/stack.md` et les premières entrées de `project/decisions.md`.

Reprends la main quand il a fini : toute la suite s'appuie sur `stack.md`.

### 2.4 — Outils externes

- **forge** : vérifie que la CLI officielle de la forge retenue par `stack.md` est installée et authentifiée, `gh` pour GitHub, `glab` pour GitLab. Sans elle, le skill `pr` ne pourra pas ouvrir de PR
- **Figma** : demande si le projet a des maquettes. Si oui, vérifie que le MCP Figma est connecté, puis demande deux URLs de **fichier**, pas de nœud : celle des maquettes et celle du design system. Elles iront dans `project/design.md` en Phase 4. Sans maquettes, ne force rien : le projet n'aura pas de `design.md`
- **Docker** : si `stack.md` retient Docker, vérifie que Docker Desktop est installé. Sinon, signale-le à l'utilisateur avant de continuer

---

## Phase 3 — Architecture

Invoque le skill `architecture`. Il confronte ses préférences par défaut au produit et à la stack, soumet les arbitrages à l'utilisateur, puis écrit `project/architecture.md` et complète `project/decisions.md`.

Reprends la main quand il a fini : le code de la Phase 5 et la configuration de la Phase 6 en dépendent.

---

## Phase 4 — Vault `project/`

Le dossier `project/`, à la racine du dépôt, porte tout ce qui parle **du projet** plutôt que de son code. C'est à la fois le **vault Obsidian** de l'utilisateur et le **contexte** que les agents chargent. Comme il vit dans le dépôt, une spec et le code qui l'implémente changent dans le même commit et la même PR.

```text
project/
├── product.md
├── market.md
├── stack.md
├── architecture.md
├── decisions.md
├── design.md
├── rules/
└── specs/
```

Écris chaque fichier à partir de ce que l'entretien a produit. **N'invente rien** : s'il manque un élément, retourne le demander. Si un fichier existe déjà, **modifie-le au plus près** plutôt que de le réécrire.

| Fichier | Contenu | Qui l'écrit |
|---|---|---|
| `product.md` | le problème résolu, pour qui, le périmètre. Aucune technique | déjà écrit par `product` |
| `market.md` | la concurrence ou les alternatives, le positionnement, le modèle économique ou la licence. Lu à la demande, jamais importé | déjà écrit par `product`, si le projet est commercial ou open source |
| `stack.md` | **la** source de vérité de la stack. Le `CLAUDE.md` y renvoie sans la recopier | déjà écrit par `stack` |
| `architecture.md` | les apps, la stratégie de dépôt, le découpage du front et du back, les modules, l'emplacement du contrat. Les agents le suivent, le `reviewer` le confronte au code | déjà écrit par `architecture` |
| `decisions.md` | le journal des arbitrages, une entrée par décision : date, choix, options écartées, raison. Il évite qu'un agent rouvre un débat clos | amorcé par `product`, `stack` et `architecture` : complète-le avec le reste de l'entretien |
| `design.md` | les URLs des maquettes et du design system, obtenues en 2.4 | ce skill, seulement si le projet a des maquettes, avec le gabarit ci-dessous |
| `rules/` | les règles **propres à ce projet**. Les conventions de nommage, elles, restent dans le plugin | ce skill, qui crée le dossier vide |
| `specs/` | les features et leurs stories | ce skill, qui crée le dossier vide ; le skill `spec` le remplit |

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

N'écris **pas** de `roadmap.md` ni de fichier d'état d'avancement. Le `status` d'une feature vit dans le frontmatter de son `README.md`, et l'avancement se lit dans les PR : un second endroit se désynchroniserait.

### Obsidian

`project/` s'ouvre tel quel comme vault dans Obsidian, qui n'indexe ainsi jamais `node_modules`. Tu n'as rien à installer : signale simplement à l'utilisateur qu'il peut l'ouvrir ainsi.

La configuration qu'Obsidian crée dans `project/.obsidian/` se versionne (plugins, thème, exclusions), **sauf** `workspace.json`, qui ne porte que la disposition des fenêtres. Ajoute au `.gitignore` du projet :

```gitignore
project/.obsidian/workspace.json
```

L'utilisateur peut dessiner un `architecture.canvas` à la main. C'est une **vue**, jamais une source de vérité : ne le génère pas.

---

## Phase 5 — Code

Invoque le skill `scaffold`. Il génère ce que `architecture.md` prévoit et qui n'existe pas encore : le manifeste racine et ses workspaces, les apps, l'emplacement du contrat, le générateur de types si le format du contrat en demande un, et les services Docker si la stack les retient. Sur un projet existant, il ne touche à rien et signale seulement les écarts avec l'architecture.

Reprends la main quand il a fini : la configuration qui suit s'appuie sur ce qu'il a créé.

---

## Phase 6 — Configuration du workflow

### Permissions

Crée `.claude/settings.json` à la racine du projet, ou fusionne-le s'il existe.

Les noms d'outils MCP sont **propres à chaque serveur connecté** : ne les devine pas. **Liste d'abord les outils réellement exposés** par chaque serveur MCP connecté, Figma compris, et classe chacun en **lecture** ou **écriture**. Applique ensuite ces règles aux noms réels :

- Figma : `deny` sur les outils d'écriture, `allow` sur la lecture
- git et la CLI de la forge retenue par `stack.md` : `allow`
- le runtime et le gestionnaire de paquets retenus par `stack.md` : `allow`
- l'écriture de fichiers, `Edit` et `Write` : `allow`. C'est ce qui permet aux agents d'avancer dans leurs worktrees sans s'interrompre

### Linter

Configure le linter retenu par `stack.md` pour faire respecter le skill `naming-conventions` : les conventions du langage d'abord, ses compléments là où le langage se tait. Avec Biome, par exemple : `useFilenamingConvention`, `useNamingConvention` et `noDefaultExport`. Si une configuration existe déjà, fusionne-la.

Expose le linter par une commande `check`, notée dans la section « Commandes » du `CLAUDE.md` : c'est elle que l'orchestrateur et le `reviewer` lancent, jamais une commande propre à un outil. **Vérifie qu'elle fonctionne avant de continuer.**

### Outillage de l'architecture

Si l'architecture retenue a un outil qui vérifie son découpage, installe-le et expose-le par une commande `check:architecture`, notée elle aussi dans la section « Commandes ». Par exemple, `steiger` pour Feature-Sliced Design.

### Garde-fou : pas de commit sur `main`

Crée `.githooks/pre-commit` avec exactement ce contenu, et rends-le exécutable (`chmod +x`) :

```sh
#!/bin/sh
git rev-parse --verify HEAD >/dev/null 2>&1 || exit 0
branch=$(git branch --show-current)
case "$branch" in
  main|master)
    echo "Commit interdit sur $branch : crée une branche dédiée." >&2
    exit 1
    ;;
esac
```

Il refuse tout commit sur `main` ou `master`, sauf le tout premier d'un dépôt vide. Comme il s'exécute dans le dépôt où le commit a lieu, il protège aussi les worktrees de l'orchestrateur.

Git n'exécute pas les hooks versionnés tant qu'on ne le lui demande pas : c'est une sécurité, pour qu'un dépôt cloné ne lance pas de code tout seul. Fais donc lancer `git config core.hooksPath .githooks` à chaque installation des dépendances, par le mécanisme du gestionnaire de paquets. Pour un projet JavaScript, c'est un script `prepare` dans le `package.json` racine :

```json
"prepare": "git config core.hooksPath .githooks || true"
```

Le `|| true` garde l'installation possible là où il n'y a pas de dépôt git, comme dans un build Docker. Si le gestionnaire de paquets n'offre pas de mécanisme de ce genre, ajoute cette commande à la commande d'installation notée dans la section « Commandes ».

Lance ensuite l'installation une fois, et vérifie que `git config core.hooksPath` renvoie bien `.githooks`.

### Projet open source

Seulement si la nature du projet est **open source**. Un projet libre s'adresse à des inconnus : il lui faut ce qu'ils s'attendent à trouver.

- **`LICENSE`** : la licence choisie avec le skill `product`, consignée dans `decisions.md` avec son identifiant SPDX (`MIT`, `Apache-2.0`, `GPL-3.0-or-later`…). N'écris **jamais** un texte de licence de mémoire : c'est un texte juridique, et une variante approximative n'est plus la licence qu'on croit appliquer. Récupère le texte officiel dans la liste SPDX : `https://raw.githubusercontent.com/spdx/license-list-data/main/text/<identifiant>.txt`. Pour MIT, remplace `<year>` et `<copyright holders>`. Les autres licences se versionnent **telles quelles** : les espaces réservés de leurs annexes, chez Apache comme chez les GPL, sont des modèles d'en-tête pour les fichiers source, pas des champs à remplir
- **`README.md`** : écrit pour les **utilisateurs**, pas pour l'équipe. Ce que fait le projet et pour qui, d'après `product.md`, l'installation, un premier exemple d'usage, un lien vers `CONTRIBUTING.md` et la licence. S'il existe déjà, modifie-le au plus près
- **`CONTRIBUTING.md`** : comment contribuer. L'installation et les commandes du projet, les conventions de nommage, les conventional commits, une branche et une PR par contribution. Signale le garde-fou : les commits sur `main` sont refusés, et il s'active tout seul à l'installation des dépendances. Explique aussi que le besoin vit dans `project/specs/` : une contribution importante commence par une spec
- **`CODE_OF_CONDUCT.md`** : propose-le. S'il est retenu, récupère le texte officiel du Contributor Covenant plutôt que de l'écrire de mémoire

Vérifie enfin la visibilité du dépôt avec la CLI de la forge (`gh repo view --json visibility` sur GitHub). S'il est privé, signale-le, mais **ne le rends pas public toi-même** : c'est la décision de l'utilisateur, et elle ne se rattrape pas, puisque ce qui a été public a pu être copié.

---

## Phase 7 — Agents et skills

Vérifie que tu as bien accès à tout ce que le workflow utilise, et signale ce qui manque :

- les **agents** du plugin : `backend`, `front-web`, `front-mobile`, `reviewer`
- les **skills du workflow** : `product`, `stack`, `architecture`, `scaffold`, `spec`, `contract`, `orchestrator`, `pr`
- les **skills de connaissance** : `naming-conventions`, `feature-sliced-design`, `figma-annotations`
- si le projet a des maquettes, les skills du plugin Figma officiel dont dépendent `figma-annotations` et les agents front : `figma-design-to-code`, et `figma-swiftui` pour une app en SwiftUI

Il n'y a rien d'autre à configurer. Les agents sont autonomes et avancent sans solliciter l'utilisateur. L'orchestrateur les coordonne autour du contrat défini par le skill `contract`, et les isole chacun dans un worktree, où les permissions de la Phase 6 leur permettent d'écrire sans s'interrompre.

---

## Phase 8 — `CLAUDE.md`

Écris le `CLAUDE.md` **en dernier**, à la racine du projet : il doit décrire fidèlement le vault, la stack, les commandes, les hooks, les agents et les skills.

C'est le **seul** fichier que Claude Code charge automatiquement. C'est donc un **routeur**, pas une documentation : il ne recopie jamais le contenu de `project/`, il y renvoie. Garde-le **sous 100 lignes**. Il contient cinq sections.

### Le cadrage, importé

Ces fichiers doivent être présents à chaque session : importe-les.

```markdown
@project/product.md
@project/stack.md
```

N'importe ainsi que des fichiers **petits et toujours pertinents** : un import se paie en contexte à chaque session. Si l'un d'eux grossit, remplace son import par un simple renvoi.

### Les fichiers à lire à la demande

Pour ceux-là, écris une **instruction de lecture**, pas un import :

- `project/architecture.md` : avant de créer un module ou de décider où ranger du code
- `project/decisions.md` : avant de remettre en cause un choix structurant
- `project/market.md`, s'il existe : avant de challenger le produit ou de cadrer une feature
- `project/design.md`, s'il existe : avant de travailler sur un écran, ou pour retrouver les maquettes et le design system
- `project/specs/<feature>/<story>.md` : la story en cours, avec le `README.md` de sa feature

### Les commandes

Une ligne par commande du projet : celles que les agents, l'orchestrateur et le `reviewer` lancent, quelle que soit la stack.

| Rôle | Commande |
|---|---|
| Installer les dépendances | … |
| Lancer le linter | `check` |
| Lancer les tests | … |
| Lancer les tests end-to-end | … |
| Vérifier l'architecture, s'il y a un outil | `check:architecture` |
| Générer les types du contrat, si son format le demande | … |

Écris la commande **réelle** du projet (un script du `package.json`, une cible de `Makefile`, une tâche Gradle…), jamais une commande supposée, et vérifie qu'elle fonctionne. Les commandes créées par `scaffold`, comme la génération des types, en font partie. Une commande sans objet n'a pas de ligne : avec un contrat Standard Schema, par exemple, il n'y a rien à générer.

### La table des règles

Une ligne par fichier de `project/rules/`, du domaine vers le fichier, pour qu'un agent sache lequel ouvrir **sans les lire tous** :

| Domaine | Règle |
|---|---|
| Authentification et contrôle d'accès | `project/rules/auth.md` |

Sans cette table, un agent charge tout `rules/` et paie le contexte, ou n'en lit aucun et les règles deviennent décoratives. **Tiens-la à jour** à chaque règle ajoutée.

Sur un projet neuf, `rules/` est vide : **n'écris pas la table**. Une table vide coûte du contexte à chaque session sans rien aiguiller. Elle apparaît avec la première règle.

### Le workflow

Les skills et leur enchaînement, les agents et leur rôle, et les interdits : jamais de commit sur `main` ou `master`, jamais de merge sur `main` ni de merge d'une PR, pas de commentaires dans le code, aucune mention de co-auteur. Les fusions des lanes dans la branche d'une story, elles, font partie du travail de l'orchestrateur.

---

## Phase 9 — Commit et PR

Sur un dépôt sans aucun commit, il n'existe pas encore de `main` vers laquelle ouvrir une PR. Commence donc par un commit initial vide sur `main`, la seule exception qu'autorise le garde-fou, et pousse-le.

Crée ensuite une branche `setup`, commite l'initialisation en conventional commits, pousse la branche, puis ouvre une PR vers `main` (ou `master`) avec la CLI de la forge.

---

## Fin

Donne le lien de la PR et invite l'utilisateur à la merger lui-même. La suite se passe avec le skill `spec`, pour cadrer une première feature.

C'est une **frontière de session** : tout le contexte utile est dans `project/` et dans git. Donne la commande à lancer une fois la PR mergée (`/moukie:spec`), puis propose de vider la conversation : dans l'app desktop, avec l'outil qui vide la session, après accord de l'utilisateur ; ailleurs, en l'invitant à taper `/clear`. Le vidage vient en dernier.

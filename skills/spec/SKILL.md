---
name: spec
description: Crée ou met à jour la spec d'une feature par un entretien guidé, puis la commite une fois validée. Se déclenche quand l'utilisateur veut rédiger, affiner ou mettre à jour une spec. Écrit `project/specs/<feature>/` : le cadrage de la feature et un fichier par story, prêtes à être implémentées une par une par le skill `orchestrator`.
metadata:
  moukie-badge: "feature"
  moukie-icon: "file-text"
  moukie-rank: "6"
  moukie-summary: "Cadre une feature et la découpe en stories."
  moukie-produces: "Crée project/specs/"
---

# Skill Spec

## Règles

Mène les échanges en **français**.
Commite en conventional commits, avec des messages en anglais et sans mention de co-auteur.
N'utilise jamais `--no-verify` : les hooks du dépôt sont des garde-fous, pas des obstacles.

Une feature est un dossier de `project/specs/`, chacune de ses stories un fichier.

Ce skill s'arrête à la **spec validée et commitée** : il n'implémente rien lui-même, il passe la main à `orchestrator`.

---

## Phase 1 — Préparation

Avant de poser la moindre question, situe-toi :

- liste `project/specs/` s'il existe, et lis les features déjà présentes : leur `README.md` et leurs stories
- lis `project/product.md`, `project/market.md` s'il existe, `project/stack.md` et `project/architecture.md` : la feature doit tenir dans le produit, et sa réalisation dans la stack et l'architecture. Ils te serviront en 2.5
- lis `project/design.md` s'il existe : il donne l'URL du fichier des maquettes, qui te servira en 2.3
- détermine si l'utilisateur **crée** une feature ou **met à jour** une feature existante. En cas de doute, demande-lui
- en **mise à jour**, récupère l'état du remote (`git fetch`) et repère sa branche par défaut, `origin/main` ou `origin/master` (`git symbolic-ref --short refs/remotes/origin/HEAD`), notée `origin/<défaut>` dans la suite. Regarde ensuite la branche `<feature>/spec` :
  - si elle existe et n'est pas encore contenue dans `origin/<défaut>` (`git merge-base --is-ancestor <feature>/spec origin/<défaut>` échoue), bascule dessus avant d'écrire quoi que ce soit : c'est là que vit la dernière version validée de la feature
  - si elle est déjà contenue dans `origin/<défaut>`, la feature y est arrivée avec une story : supprime la branche (`git branch -D`, qui ne perd rien puisque tout est dans `origin/<défaut>`), et pars de `origin/<défaut>`

Résume en une ou deux lignes ce que tu as détecté.

---

## Phase 2 — Entretien

Le principe : l'utilisateur décrit librement, tu structures, puis tu ne le questionnes que sur les trous. L'entretien suit cinq étapes.

### 2.1 — Jet brut

Demande le **nom de la feature**, puis laisse l'utilisateur décrire ce qu'il veut, librement et dans le désordre. Ne l'interromps pas avec des questions à ce stade : le but est de récupérer tout ce qu'il a en tête, sans lui imposer de format.

### 2.2 — Structuration et découpage

Range ce qu'il a dit dans les sections du gabarit de la Phase 3, sans rien inventer. Ce qui manque reste **vide** : c'est cette liste de vides qui pilote la suite.

Restitue ta compréhension en quelques lignes et laisse-le corriger. Un malentendu attrapé ici ne se propage ni dans les stories, ni dans le contrat, ni dans les tests.

**Propose ensuite le découpage en stories**, et fais-le valider avant d'aller plus loin : toute la suite se fait story par story. Une story est un comportement qu'un utilisateur peut constater, livrable et testable seul, et qui tient dans une PR qu'on relit sans peine. Pour chacune, propose un titre et un **slug**. Le slug est fixé une fois pour toutes : c'est donc ici qu'il se discute.

Ne fais jamais une story par critère d'acceptation.

### 2.3 — Maquettes

Pour **chaque** story, détermine si elle a un écran dans Figma. Ne le déduis pas du jet brut : quand l'utilisateur décrit une feature, il parle du besoin, rarement de ses maquettes.

**Avec `project/design.md`**, propose plutôt que de demander. Lis la structure du fichier des maquettes avec `get_metadata`, repère les frames dont le nom correspond à chaque story, et soumets-les avec `AskUserQuestion` : une option par frame candidat, plus « pas d'écran ». Sur un gros fichier, la réponse est volumineuse : cherche dedans par nom de frame plutôt que de tout lire. N'utilise pas `get_design_context` à ce stade, bien trop lourd pour un fichier entier.

L'URL d'un nœud se construit depuis celle du fichier : ajoute `?node-id=` suivi de l'id du frame, avec un tiret à la place du deux-points (`465:4996` donne `node-id=465-4996`).

**Sans `design.md`**, demande une fois si la feature a des maquettes, puis, pour chaque story concernée, l'URL de son **nœud** (clic droit sur le frame, puis *Copy link to selection*).

Pour chaque story qui a un écran, invoque ensuite le skill `figma-annotations` en lui transmettant l'URL du nœud. Garde cette URL : elle ira dans le frontmatter `figma:` de la story.

Une story sans écran passe directement aux questions ciblées.

### 2.4 — Questions ciblées

Ne pose de questions que sur ce qui manque encore, par lots, avec `AskUserQuestion`.

**Ne pose jamais de question ouverte sur ce qui s'énumère : propose une liste de candidats, que l'utilisateur coche, écarte ou complète.** « Y a-t-il des cas limites ? » obtient toujours « non », et « non » est toujours faux : on réagit plus facilement qu'on ne produit. Pré-remplis tes options à partir de ce que tu as sous la main :

- les **règles récoltées en 2.3** par `figma-annotations` : les champs requis, les valeurs possibles, les visibilités conditionnelles et les règles de bouton y sont souvent déjà écrits. Les redemander, c'est faire ressaisir à l'utilisateur ce qu'il a déjà produit
- le **code existant** : les rôles et entités déjà modélisés, les erreurs déjà en place, le contrat déjà écrit, pour que tes propositions collent au projet plutôt qu'au générique
- les **specs validées précédentes** : elles montrent le niveau de détail et les critères que l'utilisateur attend d'habitude
- `WebSearch` sur le domaine de la feature (panier, authentification, paiement, upload…) : les cas limites courants sont documentés, sers-t'en pour bâtir la liste à filtrer

Les trous qui **doivent** être comblés avant d'écrire :

- **le problème résolu** : tu dois le comprendre. Challenge tant que ce n'est pas clair
- **les rôles utilisateurs** : le gabarit impose « En tant que `<rôle>` », ne l'invente pas
- **le hors-périmètre** : propose les extensions naturelles que tu vois venir, l'utilisateur écarte ce qui n'appartient pas à cette feature. Personne ne le fournit spontanément, et c'est ce qui empêche une story de gonfler
- **les cas limites et les erreurs attendues** : ils alimentent à la fois les critères d'acceptation et la forme des erreurs du contrat
- **les contraintes** : l'existant à ne pas casser, les dépendances, la volumétrie
- **le critère de réussite** : « à quoi verra-t-on que c'est réussi ? » fait sortir des critères qui ne seraient pas venus autrement

Chaque critère d'acceptation doit être **vérifiable** : un comportement observable, pas une intention. « Le panier est performant » n'est pas un critère ; « l'ajout répond en moins de 300 ms » en est un. C'est ce qui permet ensuite d'écrire le test d'abord, et au `reviewer` de bloquer un critère non couvert.

### 2.5 — Cohérence avec le produit, la stack et l'architecture

Avant d'écrire, confronte la feature à ce qui est déjà décidé :

- **le produit** : sort-elle du périmètre de `product.md`, ouvre-t-elle un nouveau public, contredit-elle le positionnement ? Si oui, invoque le skill `product` en mode amendement, en lui transmettant la feature. Ne modifie jamais `product.md` toi-même. Si l'amendement est refusé, la feature est hors périmètre : dis-le, et propose de la réduire ou de l'abandonner
- **la stack** : demande-t-elle une capacité que `stack.md` ne couvre pas, comme un paiement, du temps réel, du stockage de fichiers, des emails ou de la recherche ? Si oui, invoque le skill `stack` en mode challenge, sur ce domaine seulement
- **l'architecture** : demande-t-elle un module, une app ou une communication entre apps que `architecture.md` ne prévoit pas ? Si oui, invoque le skill `architecture` en mode amendement, en lui transmettant le besoin

C'est ici que ces écarts coûtent le moins cher. Une fois la feature validée, le contrat, les critères et le travail des agents reposent sur le produit, la stack et l'architecture : les changer après coup est le chemin le plus coûteux du workflow.

À la fin, récapitule, puis demande une confirmation avant d'écrire.

---

## Phase 3 — Écriture

```text
project/specs/
└── panier/                        ← la feature
    ├── README.md                  ← son cadrage
    ├── ajout-article.md           ← une story
    └── modification-quantite.md   ← une story
```

Écris à partir du jet brut et des réponses de la Phase 2. Ne laisse aucune section vide : s'il manque encore un élément, retourne le demander plutôt que de le combler toi-même.

En **mise à jour**, lis d'abord l'existant et **modifie-le au plus près** plutôt que de le réécrire. Ajouter une story, c'est ajouter un fichier : ne touche pas aux autres.

### Le cadrage de la feature

`project/specs/<feature>/README.md`, où `<feature>` est le nom de la feature en kebab-case. Il ne contient aucune story : il porte ce qui vaut pour toutes.

```markdown
---
feature: <nom>
status: draft
---

# <Feature>

## Contexte
…

## Objectif et périmètre
…

## Notes techniques (optionnel)
…
```

Les **notes techniques** renvoient à `stack.md` et `architecture.md` plutôt que de nommer des bibliothèques : une spec dit quoi, jamais avec quoi. C'est ce qui lui permet de survivre à un changement de stack.

Une nouvelle feature naît toujours en `status: draft`. Le `status` vit **ici et nulle part ailleurs** : on valide un cadrage entier, jamais une story isolée.

N'ajoute pas d'index des stories : le contenu du dossier le donne déjà, et un index se désynchronise.

### Une story

`project/specs/<feature>/<story>.md`, où `<story>` est le slug de la story. C'est ce fichier que l'orchestrateur lit pour l'implémenter.

```markdown
---
figma: <URL du nœud de l'écran, si la story en a un>
---

# <Titre lisible>

En tant que <rôle>, je veux <…> afin de <…>.

**Critères d'acceptation :**
- [ ] …
- [ ] …
```

Le **slug** est en kebab-case (`ajout-article`) et **fixé une fois pour toutes**, même si le titre lisible change. C'est **l'identifiant de la story** dans tout le workflow : il nomme son fichier, ce qui garantit son unicité, et sa branche `<feature>/<story>`, qui reprend exactement son chemin sous `project/specs/`. Le renommer casse le lien avec la branche et la PR.

Le champ `figma:` porte l'URL du **nœud** de l'écran (elle contient un `node-id`), pas celle du fichier. Il rend la récolte des annotations rejouable : sans lui, il faudrait retrouver le bon frame à la main. Laisse-le vide si la story n'a pas d'écran.

Les critères d'acceptation restent une checklist. **Jamais** une story par critère.

---

## Phase 4 — Validation et commit

Présente le cadrage et les stories à l'utilisateur. Quand il valide, passe le frontmatter du `README.md` de la feature à `status: validated`, puis **commite la feature** :

- bascule sur la branche `<feature>/spec`, en la créant depuis la branche par défaut du remote, à jour (`origin/main` ou `origin/master`), si elle n'existe pas. Pas `<feature>` tout court : git refuse qu'une branche `panier` coexiste avec les branches de story `panier/ajout-article`
- ajoute le dossier `project/specs/<feature>/` et les fichiers du vault amendés en 2.5 (`product.md`, `market.md`, `stack.md`, `architecture.md`, `decisions.md`), et rien d'autre
- commite-les (`docs(specs): add panier feature`)
- ne pousse pas et n'ouvre pas de PR : la spec rejoindra `main` avec la PR de la première story implémentée, dans la même PR que le code

C'est ce commit qui rend la spec, et les amendements qui vont avec, visibles dans les worktrees des agents. C'est aussi lui qui permet de lancer plusieurs stories de la feature sans attendre le merge de la première.

---

## Fin

Propose de passer la main au skill `orchestrator` pour implémenter une première story, désignée par son slug.

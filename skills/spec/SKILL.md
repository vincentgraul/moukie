---
name: spec
description: Crée ou met à jour les specs d'un projet via un entretien guidé. Se déclenche quand l'utilisateur veut créer ou mettre à jour une spec. Crée un dossier `project/specs/<feature>/` ainsi qu'à l'intérieur un fichier par story, prêtes à être implémentées une par une par le skill `orchestrator`.
model: opus
---

# Skill Spec

## Règles

Ce skill s'arrête à la **spec validée** : il n'implémente rien lui-même, il passe la main à `orchestrator`.
Une spec contient des features qui elles-mêmes contiennent des stories. Les stories vivent dans `project/specs/<feature>/`.

---

## Phase 1 — Préparation

Avant de poser quoi que ce soit, situe-toi :

- liste le dossier `project/specs/` s'il existe et lis les features déjà présentes avec leur `README.md` et les stories qui les composent
- détermine si l'utilisateur **crée une nouvelle spec** ou **met à jour une spec existante**. En cas de doute, demande-lui

Résume en une ou deux lignes ce que tu as détecté, puis démarre l'entretien.

---

## Phase 2 — Entretien

Mène l'entretien en **français**, en trois temps : l'utilisateur écrit librement, tu structures, tu ne le questionnes que sur les trous.

### 2.1 — Jet brut

Demande le **nom de la feature** puis laisse l'utilisateur décrire ce qu'il veut, librement et dans le désordre. Ne l'interromps pas avec des questions à ce stade : le but est de récupérer tout ce qu'il a déjà en tête, sans le contraindre à un format.

### 2.2 — Structuration

Range ce qu'il a dit dans les sections du template de la Phase 3, sans rien inventer. Ce qui manque reste **vide**, c'est cette liste de vides qui pilote la suite.
Restitue ta compréhension en quelques lignes et laisse-le corriger : un malentendu attrapé ici ne se propage ni dans les tickets, ni dans le contrat, ni dans les tests.

### 2.3 — Questions ciblées

Tu ne poses de questions que sur ce qui manque encore. Utilise `AskUserQuestion` par lots.

**Ne pose jamais de question ouverte sur ce qui s'énumère.** « Y a-t-il des cas limites ? » obtient toujours « non », et « non » est toujours faux. Propose une **liste de candidats** et laisse l'utilisateur cocher, écarter, compléter : réagir fait remonter ce que produire ne fait pas remonter. Pré-remplis systématiquement tes options à partir de ce que tu as sous la main :

- les **annotations de la maquette** : si la feature a des écrans dans Figma, invoque le skill `figma-annotations` avant de questionner. Les champs requis, les valeurs possibles, les visibilités conditionnelles et les règles de bouton y sont souvent déjà écrits — les redemander à l'utilisateur, c'est lui faire ressaisir ce qu'il a déjà produit
- le **code existant** : rôles et entités déjà modélisés, erreurs déjà en place, contrat zod déjà écrit, pour que tes propositions collent au projet plutôt qu'au générique
- les **specs validées précédentes** : elles portent le niveau de granularité et les critères que l'utilisateur réclame d'habitude
- `WebSearch` sur le domaine de la feature (panier, authentification, paiement, upload…) : les cas limites standards sont documentés, sers-t'en pour bâtir l'énumération à filtrer

Les trous qui **doivent** être comblés avant d'écrire :

- **le problème résolu** : tu te dois de le comprendre. Challenge tant que ce n'est pas clair
- **les rôles utilisateurs** : le template impose « En tant que `<rôle>` », ne l'invente pas
- **le hors-périmètre** : propose les extensions naturelles que tu vois arriver, l'utilisateur écarte ce qui n'est pas dans cette feature. Personne ne fournit ça spontanément, et c'est ce qui empêche une story de gonfler
- **les cas limites et les erreurs attendues** : ce sont eux qui alimentent à la fois les critères d'acceptation et la forme des erreurs du contrat zod
- **les contraintes** : existant à ne pas casser, dépendances, volumétrie
- **le critère de réussite** : « à quoi verra-t-on que c'est réussi ? » fait sortir des critères qui ne seraient pas venus autrement

Chaque critère d'acceptation doit être **vérifiable** : un comportement observable, pas une intention. « Le panier est performant » n'est pas un critère ; « l'ajout répond en moins de 300 ms » en est un. C'est ce qui rend possible, en aval, le test écrit d'abord et le contrôle bloquant du reviewer.

À la fin, récapitule et demande une confirmation avant d'écrire.

---

## Phase 3 — Construction

Une feature est **un dossier**, chacune de ses stories **un fichier** :

```
project/specs/
└── panier/                        ← la feature
    ├── README.md                  ← son cadrage
    ├── ajout-article.md           ← une story
    └── modification-quantite.md   ← une story
```

En **mise à jour**, lis d'abord l'existant et **modifie au plus près** plutôt que de réécrire. Ajouter une story, c'est ajouter un fichier : ne touche pas aux autres.
Écris à partir du jet brut et des réponses obtenues en Phase 2. Ne laisse aucune section vide. S'il manque encore un élément, retourne le demander plutôt que de le combler toi-même.

### Le cadrage de la feature

`project/specs/<feature>/README.md`, où `<feature>` est le nom de la feature en **kebab-case**. Ce fichier ne contient aucune story il porte ce qui vaut pour toutes :

```markdown
---
feature: <nom>
status: draft
---

# <Feature>

## Contexte (WHY)
…

## Objectif & périmètre
…

## Notes techniques (optionnel)
…
```

Une nouvelle feature naît toujours en `status: draft`. Le `status` vit **ici et nulle part ailleurs** : on valide un cadrage entier, jamais une story isolée.
N'ajoute pas d'index des stories dans ce fichier : le contenu du dossier le donne déjà, et un index se désynchronise.

### Une story

`project/specs/<feature>/<story>.md`, où `<story>` est le **slug** de la story. C'est ce fichier que l'`orchestrator` lit pour implémenter :

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

Le **slug** est en kebab-case (ex. `ajout-article`) et **fixé une fois pour toutes**, même si le titre lisible change : c'est le nom du fichier qui garantit son unicité, et le renommer casse le lien avec la branche et la PR de la story. C'est **l'identifiant de la story** dans tout le workflow, il la désigne à l'oral, il nomme sa branche `<feature>/<story>`, qui reprend exactement son chemin sous `project/specs/`.

Le champ `figma` porte l'URL du **nœud** de l'écran (elle contient un `node-id`), pas celle du fichier. Il rend la récolte des annotations rejouable : sans lui, un agent devra retrouver le bon frame à la main. Laisse-le vide si la story n'a pas d'écran.

Les **critères d'acceptation** restent une checklist. **Jamais** une story par critère.

---

## Phase 4 — Validation

Présente le cadrage et les stories générés à l'utilisateur. Quand l'utilisateur valide, passe le frontmatter du `README.md` de la feature à `status: validated` puis propose de passer la main au skill `orchestrator` pour implémenter une première story.

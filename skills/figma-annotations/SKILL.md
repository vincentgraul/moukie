---
name: figma-annotations
description: Récolte les annotations Dev Mode laissées sur les maquettes avec les règles fonctionnelles attachées aux éléments d'un écran (requis, valeurs possibles, valeurs par défaut, visibilité conditionnelle, règles de bouton) et les normalise pour alimenter les critères d'acceptation d'une story et le contrat entre apps. Se déclenche quand `spec` cadre une story qui a une maquette. Ne fait pas de design-to-code et ne génère aucun composant.
metadata:
  moukie-badge: "knowledge"
---

# Skill Figma annotations

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).

Ce skill **lit** Figma sans jamais y écrire, et ne récolte que des **règles fonctionnelles** : traduire une maquette en composants reste le travail des agents front.

Figma **alimente**, la story **fait foi** : une annotation devient un critère d'acceptation de la story, et c'est ce fichier versionné que la suite du workflow lit. Si la maquette change après validation, la story repasse par `spec`.

**N'invente rien.** Une règle absente de la maquette n'est pas une règle, et un élément sans annotation n'est pas un oubli à combler.

---

## Phase 1 — Récolte

Il te faut le **nœud de l'écran** : `spec` te le transmet ; sinon, cherche-le dans le frontmatter `figma:` de la story, et en dernier recours demande-le. L'URL doit contenir un `node-id`.

Prends le **plus petit frame qui contient tous les éléments annotés** : la modale plutôt que l'écran qui la porte, le formulaire plutôt que la page. Un nœud trop haut ramène toute l'interface autour pour les mêmes quelques règles.

Charge d'abord le skill `figma-design-to-code`, que le MCP Figma exige, puis appelle `get_design_context` sur ce nœud avec `excludeScreenshot: true` : tu cherches du texte, pas des pixels. `get_metadata` ne renvoie pas les annotations.

Dans la réponse, récupère tout élément qui porte un attribut `data-*-annotations`, avec son `data-node-id` et son `data-name` :

```jsx
<div data-node-id="…;465:4977"
     data-name="Select"
     data-input-annotations="Type de la colonne.
\---
Est requis: oui
\---
Valeur possible:
1. Boolean
2. String">
```

Le segment central du nom d'attribut est la **catégorie** de l'annotation : `data-input-annotations` → `Input`, `data-button-annotations` → `Button`.

### Pièges

- les séparateurs `---` arrivent **échappés** en `\---`
- les puces arrivent en **listes numérotées** : le numéro ne porte aucun sens, ne le reprends pas
- tu reçois le code de tout l'écran pour quelques règles : ne garde que les annotations, ne recopie jamais ce code

---

## Phase 2 — Lecture

Une annotation est faite de **blocs séparés par `---`**. Le premier décrit l'élément ; les suivants portent une clé :

| Clé | Ce qu'elle porte |
|---|---|
| `Est requis:` | `oui` / `non` |
| `Valeur possible:` | l'énumération des valeurs acceptées |
| `Valeur par défaut:` | la valeur initiale, parfois conditionnée à un autre champ |
| `Visible seulement si` | la condition d'affichage de l'élément |
| `Règles:` | les comportements attendus (état désactivé, déclenchement…) |

Les clés suivent la langue des maquettes : reconnais-les à leur sens quand elles sont écrites autrement.

Une clé peut être **conditionnée à un autre champ** : « Valeur par défaut (en lien avec "type de la colonne") ». Garde la condition, elle fait partie de la règle.

Les catégories rencontrées sont `Input` et `Button`, mais la liste n'est pas fermée : traite une catégorie inconnue comme un élément d'interface.

---

## Phase 3 — Routage

Une annotation peut alimenter plusieurs destinations :

- `Est requis`, `Valeur possible`, `Valeur par défaut` → le **contrat** (validation et types partagés) **et** un critère d'acceptation
- `Visible seulement si` → le **comportement front** et un critère d'acceptation
- `Règles:` → un **critère d'acceptation**, toujours

Une valeur par défaut qui décrit une correspondance technique (« si String: varchar ») concerne le **back** : elle doit atterrir dans la story, pas rester dans le contexte de l'agent front.

---

## Phase 4 — Restitution

Rends un bloc par élément annoté, dans l'ordre de la maquette :

```markdown
### Select · Type — `465:4977`
- Requis
- Valeurs possibles : Boolean, String, Number, Date, Media, Relation
→ contrat, critères d'acceptation

### Button · Add — `465:4972`
- Désactivé tant que le formulaire n'est pas valide
→ critère d'acceptation
```

Reformule chaque règle en **comportement observable**, directement utilisable comme critère : « le bouton est désactivé tant que le formulaire n'est pas valide » est vérifiable, « gérer la validation » ne l'est pas.

---

## Fin

Rends la restitution à l'appelant, en signalant ce que tu n'as **pas** pu router : une annotation ambiguë, une condition qui référence un champ absent de l'écran, une règle qui contredit la story. C'est à l'appelant de trancher.

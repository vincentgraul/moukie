---
name: figma-annotations
description: Récolte les annotations Dev Mode laissées sur les maquettes avec les règles fonctionnelles attachées aux éléments d'un écran (requis, valeurs possibles, valeurs par défaut, visibilité conditionnelle, règles de bouton) et les normalise pour alimenter les critères d'acceptation d'une story et le contrat entre apps. Se déclenche quand `spec` cadre une story qui a une maquette. Ne fait pas de design-to-code et ne génère aucun composant.
metadata:
  moukie-badge: "knowledge"
---

# Skill Figma annotations

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).

Ce skill **lit** Figma, il n'écrit jamais dedans.
Il ne fait **pas** de design-to-code : traduire une maquette en composants reste le travail des agents front, via le skill `figma-design-to-code` du plugin Figma officiel. Ici on ne récolte que des **règles fonctionnelles**.

Il est appelé par `spec`, qui range ses résultats dans la story. `contract` s'en sert ensuite **via la story**, sans jamais rappeler ce skill. Il ne produit jamais de code.

### Source de vérité

Figma **alimente**, la story **fait foi**.

Une annotation devient un critère d'acceptation dans `project/specs/<feature>/<story>.md`, et c'est ce fichier qui est ensuite la référence : c'est lui qui est versionné, relu en PR et confronté au code par le `reviewer`. Si la maquette bouge après validation de la feature, on repasse par `spec` pour mettre la story à jour, jamais par un agent qui relit Figma pendant l'implémentation.

**N'invente rien.** Une règle absente de la maquette n'est pas une règle. Un élément sans annotation n'est pas un oubli à combler.

---

## Phase 1 — Récolte

Il te faut le **nœud de l'écran** : `spec` te le transmet, après l'avoir fait choisir à l'utilisateur. Sinon cherche-le dans le frontmatter `figma:` de la story, et en dernier recours demande-le. L'URL doit contenir un `node-id`.

Le bon nœud est le **plus petit frame contenant tous les éléments annotés**, la modale plutôt que l'écran qui la porte, le formulaire plutôt que la page. Un nœud trop haut ramène toute l'interface autour (sidebar, header, tableau) pour les mêmes quelques règles.

Charge d'abord le skill `figma-design-to-code`, que le MCP Figma exige, puis appelle `get_design_context` sur ce nœud.

Deux points qui font gagner du temps :

- `get_metadata` ne renvoie **pas** les annotations. Seul `get_design_context` les porte
- passe `excludeScreenshot: true` : tu cherches du texte, pas des pixels

Dans la réponse, récupère tout élément portant un attribut `data-*-annotations`, avec son `data-node-id` et son `data-name`.

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

Le segment central du nom d'attribut est la **catégorie** de l'annotation dans Figma : `data-input-annotations` → catégorie `Input`, `data-button-annotations` → catégorie `Button`.

### Pièges

- les séparateurs `---` arrivent **échappés** en `\---`
- les puces sont converties en **listes numérotées**. Le numéro ne porte aucun sens, ne le reprends pas
- l'appel est verbeux : tu reçois le code de tout l'écran pour quelques règles. Ne recopie jamais ce code, ne garde que les annotations

---

## Phase 2 — Lecture

Une annotation est faite de **blocs séparés par `---`**. Le premier bloc est toujours la description de l'élément. Les suivants portent une clé.

Les clés en usage :

| Clé | Ce qu'elle porte |
|---|---|
| `Est requis:` | `oui` / `non` |
| `Valeur possible:` | l'énumération des valeurs acceptées |
| `Valeur par défaut:` | la valeur initiale, parfois conditionnée à un autre champ |
| `Visible seulement si` | la condition d'affichage de l'élément |
| `Règles:` | les comportements attendus (état désactivé, déclenchement…) |

Une clé peut être **conditionnée à un autre champ** : « Valeur par défaut (en lien avec "type de la colonne") ». Conserve la condition, elle fait partie de la règle.

Les catégories rencontrées sont `Input` et `Button`. La liste n'est pas fermée : traite toute catégorie inconnue comme un élément d'interface et route ses règles normalement.

---

## Phase 3 — Routage

Chaque règle a une destination, et une seule annotation peut en alimenter plusieurs :

- `Est requis`, `Valeur possible`, `Valeur par défaut` → le **contrat** (validation et types partagés), **et** un critère d'acceptation
- `Visible seulement si` → le **comportement front**, et un critère d'acceptation
- `Règles:` → un **critère d'acceptation**, toujours

Quand une valeur par défaut décrit une correspondance technique (« si String: varchar »), elle concerne le **back**. Elle doit atterrir dans la story, pas rester dans le contexte de l'agent front. C'est tout l'intérêt de récolter ici plutôt qu'au moment de coder.

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

Reformule chaque règle en **comportement observable**, pour qu'elle soit directement utilisable comme critère d'acceptation : « le bouton est désactivé tant que le formulaire n'est pas valide » est vérifiable, « gérer la validation » ne l'est pas.

---

## Fin

Rends la restitution à l'appelant, en signalant ce que tu n'as **pas** pu router : une annotation ambiguë, une condition qui référence un champ absent de l'écran, une règle qui contredit la story. C'est à l'appelant de trancher, pas à toi.

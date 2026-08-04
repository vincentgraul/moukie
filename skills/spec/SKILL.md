---
name: spec
description: Crée ou met à jour les specs fonctionnelles d'un projet via un entretien guidé. Se déclenche quand l'utilisateur veut rédiger, affiner ou mettre à jour une spec. Produit un fichier `specs/<feature>.md` validé, prêt à être découpé en epics/stories/tickets par le skill `jira`.
model: opus
---

# Skill Spec

## Règles

Ce skill s'arrête à la **spec validée** : il ne crée aucun ticket Jira lui-même, il passe la main à `jira`.
Le nom du fichier spec sera le nom de la feature en kebab-case.

---

## Phase 1 — Préparation

Avant de poser quoi que ce soit, situe-toi :

- lis le `CLAUDE.md` du projet pour comprendre la stack, le périmètre et les conventions
- liste le dossier `specs/` s'il existe et lis les specs déjà présentes.
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

Écris `specs/<feature>.md`. En **mise à jour**, lis d'abord la spec existante et **modifie au plus près** plutôt que de la réécrire intégralement.

Écris chaque section à partir du jet brut et des réponses obtenues en Phase 2 : objectif, périmètre et hors-périmètre, découpage en user stories (chacune avec slug et critères d'acceptation). Ne laisse aucune section vide. S'il manque encore un élément, retourne le demander plutôt que de le combler toi-même.
Respecte ce template exactement, c'est lui que `jira` lit pour découper :

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

## User stories

### Story (<slug>) — <titre>
En tant que <rôle>, je veux <…> afin de <…>.
**Critères d'acceptation :**
- [ ] …
- [ ] …

### Story (<slug>) — <titre>
…

## Notes techniques (optionnel)
…
```

Une nouvelle spec naît toujours en `status: draft`.
Le **slug** est un identifiant stable en kebab-case (ex. `auth-login`). Il est **unique dans la spec** et **fixé une fois pour toutes**. C'est lui qui appaire la story à son issue Jira.
Les **critères d'acceptation** restent une checklist dans la story. **Jamais** un ticket par critère.

---

## Phase 4 — Validation

Présente la spec générée à l'utilisateur. Quand l'utilisateur valide, passe le frontmatter à `status: validated` puis propose de passer la main au skill `jira`.

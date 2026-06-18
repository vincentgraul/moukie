---
name: spec
description: Crée ou met à jour les specs fonctionnelles d'un projet via un entretien guidé. Se déclenche quand l'utilisateur veut rédiger, affiner ou mettre à jour une spec. Produit un fichier `specs/<feature>.md` validé, prêt à être découpé en epics/stories/tickets par le skill `jira`.
model: opus
---

# Rédaction des specs

Mène un entretien puis génère ou met à jour un fichier `specs/<feature>.md`.
Déroule les phases dans l'ordre et mène l'entretien en **français**.
Pose un lot de questions à la fois avec l'outil `AskUserQuestion`.
Ne déverse jamais toutes les questions d'un coup, et n'écris la spec qu'une fois l'entretien terminé et confirmé.
Ce skill s'arrête à la **spec validée** : il ne crée aucun ticket Jira lui-même, il passe la main à `jira`.

---

## Phase 0 — Détection du contexte

Avant de poser quoi que ce soit, situe-toi :

- Lis le `CLAUDE.md` du projet pour comprendre la stack, le périmètre et les conventions.
- Liste le dossier `specs/` s'il existe et lis les specs déjà présentes.
- Détermine si l'utilisateur **crée une nouvelle spec** ou **met à jour une spec existante**. En cas de doute, demande-lui.

Résume en une ou deux lignes ce que tu as détecté, puis démarre l'entretien.

---

## Phase 1 — Entretien

Pose les questions par lots. Reformule et **relance tant que la réponse n'est pas assez claire pour écrire une spec exploitable**.
À la fin de l'entretien, récapitule et demande une confirmation avant d'écrire.

### Lot A — Identité
- Nom de la feature (servira au nom de fichier `specs/<feature>.md`, en kebab-case)
- Description de la feature (**tu te dois de poser des questions si la description ne te semble pas suffisamment clair**)

### Lot B — Préparation

Pour bien préparer cette spec, tu te dois de te poser les questions suivantes :

- Quel problème ou besoin la feature résout-elle ?
- Quel est l'objectif et le périmètre ?
- Quelles sont les stories utilisateur ?
- Quelles sont les critères d'acceptation ?
- Quelles sont les contraintes techniques ?

**Si ce n'est pas suffisamment clair pose moi des questions**

---

## Phase 2 — Construction

Écris `specs/<feature>.md` (nom de fichier en kebab-case). En **mise à jour**, lis d'abord la spec existante et **modifie au plus près** plutôt que de la réécrire intégralement.

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

**Règles à avoir en tête pour être en accord avec le skill `jira`** :
- Le fichier `specs/<feature>.md` = **1 Epic** (titre `# <Feature>`)
- Le **slug** est un identifiant stable en kebab-case (ex. `auth-login`). Il est **unique dans la spec** et **fixé une fois pour toutes** : c'est lui qui appaire la story à son issue Jira. Le titre lisible peut changer, **pas le slug**
- Les **critères d'acceptation** restent une checklist dans la story. **Jamais** un ticket par critère
- Une nouvelle spec naît toujours en `status: draft`

---

## Phase 3 — Affinage & validation

Présente la spec générée à l'utilisateur et **boucle** : il commente, tu ajustes le fichier, tu represente.
Quand l'utilisateur valide explicitement, passe le frontmatter à `status: validated`.

---

## Phase 4 — Passage au skill `jira`

Une fois la spec en `status: validated`, signale-le et **propose de lancer `jira`** pour découper la spec en epics/stories/tickets. Ne crée aucun ticket toi-même.

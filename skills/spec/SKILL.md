---
name: spec
description: Crée ou met à jour les specs fonctionnelles d'un projet via un entretien de cadrage guidé. Se déclenche quand l'utilisateur veut rédiger, affiner ou mettre à jour une spec — généralement après le scaffold du projet. Produit un fichier `specs/<feature>.md` validé, prêt à être découpé en epics/stories/tickets par le skill `jira`.
---

# Rédaction des specs

Mène un entretien de cadrage puis génère ou met à jour un fichier `specs/<feature>.md`.
Déroule les phases dans l'ordre et mène l'entretien en **français**.
Pose un lot de questions à la fois avec l'outil `AskUserQuestion`.
Ne déverse jamais toutes les questions d'un coup, et n'écris la spec qu'une fois le cadrage terminé et confirmé.
Ce skill s'arrête à la **spec validée** : il ne crée aucun ticket Jira lui-même, il passe la main à `jira`.

---

## Phase 0 — Détection du contexte

Avant de poser quoi que ce soit, situe-toi :

- Lis le `CLAUDE.md` du projet pour comprendre la stack, le périmètre et les conventions.
- Liste le dossier `specs/` s'il existe et lis les specs déjà présentes.
- Détermine si l'utilisateur **crée une nouvelle spec** ou **met à jour une spec existante**. En cas de doute, demande-lui.

Résume en une ou deux lignes ce que tu as détecté, puis démarre l'entretien.

---

## Phase 1 — Cadrage (entretien)

Pose les questions par lots. Reformule et **relance tant que la réponse n'est pas assez claire pour écrire une spec exploitable** — une spec floue produit un découpage Jira flou.
À la fin du cadrage, récapitule et demande une confirmation avant d'écrire.

### Lot A — Identité de la feature
- Nom de la feature (servira au nom de fichier `specs/<feature>.md`, en kebab-case)
- En une phrase, ce qu'elle apporte

### Lot B — Contexte & objectif (WHY)
- Quel problème ou besoin la feature résout-elle ?
- Quel est l'objectif et le périmètre ?
- Qu'est-ce qui est explicitement **hors périmètre** ?

### Lot C — User stories
- Quelles sont les stories utilisateur ? Pour chacune : le rôle, le besoin, la finalité (« En tant que… je veux… afin de… »).
- Pour chaque story, ses **critères d'acceptation** (ce qui permet de la considérer comme terminée).
- Propose toi-même un découpage en stories si l'utilisateur raisonne en bloc, puis fais-le valider.

### Lot D — Notes techniques (optionnel)
- Contraintes techniques, dépendances, points d'attention connus. Laisse vide si rien de notable.

---

## Phase 2 — Génération de la spec

Écris `specs/<feature>.md` (nom de fichier en kebab-case). En **mise à jour**, lis d'abord la spec existante et **modifie au plus près** plutôt que de la réécrire intégralement.

Respecte ce template exactement — c'est lui que `jira` lit pour découper :

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

## Hors périmètre
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

Règles de mapping (à garder en tête, c'est le contrat avec `jira`) :
- le fichier `specs/<feature>.md` = **1 Epic** (titre `# <Feature>`)
- chaque `### Story (<slug>) —` = **1 Story**. Le **slug** est un identifiant stable en kebab-case (ex. `auth-login`), **unique dans la spec** et **fixé une fois pour toutes** : c'est lui qui appaire la story à son issue Jira. Le titre lisible peut changer, **pas le slug**.
- les **critères d'acceptation** restent une checklist dans la story — **jamais** un ticket par critère
- une nouvelle spec naît toujours en `status: draft`

---

## Phase 3 — Affinage & validation

Présente la spec générée à l'utilisateur et **boucle** : il commente, tu ajustes le fichier, tu represente.
Quand l'utilisateur valide explicitement, passe le front matter à `status: validated`.

---

## Phase 4 — Passage de main

Une fois la spec en `status: validated`, signale-le et **propose de lancer `jira`** pour découper la spec en epics/stories/tickets. Ne crée aucun ticket toi-même.

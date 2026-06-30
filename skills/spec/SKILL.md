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

Mène un entretien en **français** en utilisant l'outil `AskUserQuestion` puis génère ou met à jour un fichier `specs/<feature>.md`.
Reformule et **relance tant que la réponse n'est pas assez claire pour écrire une spec exploitable**.
À la fin de l'entretien, récapitule et demande une confirmation avant d'écrire.

Demande à l'utilisateur :

- nom de la feature
- description de la feature

**Tu te dois de comprendre quel problème ou besoin la feature résout. N'hésite pas à challenger.**

---

## Phase 3 — Construction

Écris `specs/<feature>.md`. En **mise à jour**, lis d'abord la spec existante et **modifie au plus près** plutôt que de la réécrire intégralement.

À partir du nom et de la description, propose toi-même : objectif, périmètre et hors-périmètre, un découpage en user stories (chacune avec slug et critères d'acceptation). Ne laisse aucune section vide.
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

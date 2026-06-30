---
name: jira
description: Découpe une spec validée en hiérarchie Jira. Un Epic, ses Stories, et leurs critères d'acceptation en checklist. Se déclenche quand l'utilisateur veut créer ou synchroniser les tickets Jira d'une feature à partir de son fichier `specs/<feature>.md`. Lit la spec produite par le skill `spec`.
model: sonnet
---

# Skill Jira

## Règles

Mène les échanges en **français**.
N'invente rien qui ne soit pas dans la spec. Si une story est ambiguë, demande avant de créer.
Refuse de continuer si le frontmatter de la spec n'est pas `status: validated`.
Vérifie que le **MCP Jira est connecté**, sinon signale-le et arrête-toi.

---

## Phase 1 — Préparation

Récupère la **clé du projet Jira** (depuis le `CLAUDE.md`) sinon demande l'URL ou la clé du projet puis prend un fichier `specs/<feature>.md` **validé** pour pouvoir créer la hiérarchie Jira correspondante.

Si un **fichier de mapping `specs/<feature>.jira.json`** existe déjà → on est en **mise à jour**, pas en création initiale.

---

## Phase 2 — Construction

Crée l'**Epic**, puis chaque **Story** en la rattachant à l'Epic, critères d'acceptation en checklist dans la description.
En **mise à jour**, retrouve les tickets existants via le fichier de mapping (Stories appariées par **slug**) et modifie-les plutôt que d'en recréer.

Écris ou mets à jour un fichier de mapping `specs/<feature>.jira.json` pour rendre les relances idempotentes et garder la spec propre :

```json
{
  "feature": "<nom>",
  "project": "<KEY>",
  "epic": "PROJ-12",
  "stories": [
    { "slug": "<slug-de-la-story>", "title": "<titre lisible>", "key": "PROJ-34" }
  ]
}
```

Apparie chaque story au mapping par son `slug`. Si un slug de la spec n'existe pas dans le mapping → **création**, s'il existe → **mise à jour** de l'issue `key` correspondante.

Pour finir liste les issues créées et mises à jour avec leurs liens.

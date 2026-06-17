---
name: jira
description: Découpe une spec validée en hiérarchie Jira — un Epic, ses Stories, et leurs critères d'acceptation en checklist. Se déclenche quand l'utilisateur veut créer ou synchroniser les tickets Jira d'une feature à partir de son fichier `specs/<feature>.md`. Lit la spec produite par le skill `spec` ; ne rédige pas de spec lui-même.
---

# Découpage d'une spec en Jira

Prend un fichier `specs/<feature>.md` **validé** et crée la hiérarchie Jira correspondante.
N'invente rien qui ne soit pas dans la spec — si une story est ambiguë, demande avant de créer.
L'écriture Jira est soumise à permission : **confirme toujours le plan complet avant la moindre création**.
Mène les échanges en **français**.

---

## Phase 0 — Pré-requis & détection

- Identifie la spec cible. Si l'utilisateur n'en précise pas et qu'il y en a plusieurs dans `specs/`, demande laquelle.
- **Refuse de continuer si le front matter n'est pas `status: validated`** : renvoie l'utilisateur vers le skill `spec` pour finaliser et valider d'abord.
- Vérifie que le **MCP Jira est connecté**, sinon signale-le et arrête-toi.
- Récupère la **clé du projet Jira** (depuis le `CLAUDE.md` / la config issue du scaffold, sinon demande l'URL ou la clé du projet).
- Repère si un **fichier de mapping `specs/<feature>.jira.json`** existe déjà → on est en **mise à jour** (il porte les clés Jira), pas en création initiale.

---

## Phase 1 — Plan de découpage (aucune écriture)

Construis le plan à partir de la spec, selon le contrat de mapping :

- le fichier `specs/<feature>.md` = **1 Epic** (titre `# <Feature>`, description = Contexte + Objectif & périmètre)
- chaque `### Story (<slug>) —` = **1 Story** rattachée à l'Epic (description = la story + ses critères d'acceptation en checklist). Le **slug** est l'identifiant d'appariement.
- les **critères d'acceptation** restent une checklist dans la Story — **jamais** un ticket par critère

Pour chaque élément, indique s'il sera **créé** ou **mis à jour** (si une clé Jira existe déjà).
Présente ce plan à l'utilisateur et **demande une confirmation explicite**. Aucune écriture Jira tant que ce n'est pas validé.

---

## Phase 2 — Création / synchronisation

À la confirmation seulement :

- Crée l'**Epic**, puis chaque **Story** en la rattachant à l'Epic, critères d'acceptation en checklist dans la description.
- Chaque appel d'écriture Jira déclenche une **demande de permission** (réglée en `ask` par le scaffold) — c'est attendu.
- En **mise à jour**, retrouve les issues existantes via le fichier de mapping (Stories appariées par **slug**, pas par titre — un titre renommé garde donc son issue) et modifie-les plutôt que d'en recréer (pas de doublon).
- **Écris/mets à jour le fichier de mapping `specs/<feature>.jira.json`** pour rendre les relances idempotentes et garder la spec propre. Forme attendue :

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

Apparie chaque story au mapping par son `slug`. Si un slug de la spec n'existe pas dans le mapping → **création** ; s'il existe → **mise à jour** de l'issue `key` correspondante.

---

## Phase 3 — Récapitulatif

Liste les issues créées et mises à jour avec leurs liens.
Ne transitionne, n'assigne et ne ferme aucune issue de toi-même — tiens-t'en au découpage.

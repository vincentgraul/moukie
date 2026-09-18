---
name: pr
description: Ouvre une pull request GitHub pour la branche courante une fois la story terminée. Commit et pousse la branche, puis crée la PR via le CLI `gh` avec un titre en conventional commit et un renvoi vers la story dans la spec. Ne merge jamais la PR.
model: sonnet
---

# Skill PR

## Règles

Mène les échanges en **français**.
La PR doit être sur une branche dédiée. **Refuse de continuer si la branche courante est `main` ou `master`**.
Ton travail s'arrête à l'**ouverture de la PR**. Ne merge jamais et ne la passe pas en auto-merge.
Pas de mention de co-auteur Claude ou autre.

---

## Préparation

Le nom de la branche est le chemin de la story sous `project/specs/` : `<feature>/<story>` (ex. `panier/ajout-article` → `project/specs/panier/ajout-article.md`). Si le nom ne suit pas ce format, **demande** la feature et le slug.
Lis la story. Son titre et ses critères d'acceptation alimentent le corps de la PR.

---

## Commits & push

Commit les changements avec des messages en **anglais** et en **conventional commit** puis pousse la branche sur le remote (crée l'upstream si nécessaire avec `git push -u`).

---

## Création de la PR

Crée la PR via `gh pr create`, ciblant la branche par défaut (`main` ou `master`) :

- **Titre** : en conventional commit, résumant le ticket
- **Corps** :
  - **What** — ce que fait le changement
  - **Why** — le besoin/problème adressé
  - **Story** — son titre et le chemin de son fichier (ex. `project/specs/panier/ajout-article.md`)
  - **Critères d'acceptation** — la checklist de la story, reprise telle quelle
  
Une fois la PR crée, donne le **lien de la PR** ouverte et un résumé d'une ligne de son contenu.

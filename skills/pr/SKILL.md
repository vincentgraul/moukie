---
name: pr
description: Ouvre une pull request GitHub pour la branche courante une fois le ticket terminé. Commit et pousse la branche, puis crée la PR via le CLI `gh` avec un titre en conventional commit et un lien vers le ticket Jira. Ne merge jamais la PR.
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

Extrais la clé Jira du nom de la branche (ex. `PROJ-34-...` → `PROJ-34`). Si rien ne correspond, **demande-la**.

---

## Commits & push

Commit les changements avec des messages en **conventional commit** puis pousse la branche sur le remote (crée l'upstream si nécessaire avec `git push -u`).

---

## Création de la PR

Crée la PR via `gh pr create`, ciblant la branche par défaut (`main` ou `master`) :

- **Titre** : en conventional commit, résumant le ticket
- **Corps** :
  - **What** — ce que fait le changement
  - **Why** — le besoin/problème adressé
  - **Ticket** — lien vers l'issue Jira (`PROJ-34`)
  
Une fois la PR crée, donne le **lien de la PR** ouverte et un résumé d'une ligne de son contenu.

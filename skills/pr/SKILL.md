---
name: pr
description: Ouvre une pull request GitHub pour la branche courante une fois le ticket terminé. Lance tests et linter (et corrige si besoin), commit et pousse la branche, puis crée la PR via le CLI `gh` avec un titre en conventional commit et un lien vers le ticket Jira. Ne merge jamais la PR.
model: sonnet
---

# Ouverture d'une PR GitHub

Prépare puis ouvre une pull request pour la branche courante. Mène les échanges en **français**.
La skill **enchaîne le travail elle-même** (tests, lint, commits, push). elle ne se contente pas de vérifier.
Elle s'arrête à l'**ouverture de la PR** : ne merge jamais.

---

## Phase 0 — Pré-vol

- **Refuse de continuer si la branche courante est `main` ou `master`.** Le travail doit être sur une branche dédiée.
- Récupère la **clé du ticket Jira** : extrais le motif `[A-Z]+-[0-9]+` du **nom de la branche** (ex. `PROJ-34-...` → `PROJ-34`). Si rien ne correspond, **demande-la**.
- Identifie comment le projet lance le **linter/formatter** et les **tests** (via le `CLAUDE.md` et le `package.json` — gestionnaire de paquets, scripts).

---

## Phase 1 — Qualité

- Lance le **linter/formatter** (Biome) puis la **suite de tests** du projet.
- **En cas d'échec, corrige** et relance jusqu'au vert.
- Si un échec n'est pas corrigeable en confiance (test métier ambigu, régression non triviale), **arrête-toi et explique** plutôt que de bricoler un contournement.

---

## Phase 2 — Commits & push

- Commit les changements restants avec des messages en **conventional commit**, y compris les corrections de la Phase 1.
- **Pousse la branche** sur le remote (crée l'upstream si nécessaire avec `git push -u`).

---

## Phase 3 — Création de la PR

Crée la PR via `gh pr create`, ciblant la branche par défaut (`main`/`master`) :

- **Titre** : en conventional commit, résumant le ticket.
- **Corps** :
  - **What** — ce que fait le changement.
  - **Why** — le besoin/problème adressé.
  - **Ticket** — lien vers l'issue Jira (`PROJ-34`).
  - **Test plan** — comment ça a été vérifié (tests lancés, lint au vert).

**Ne merge jamais la PR** et ne la passe pas en auto-merge.

---

## Phase 4 — Récapitulatif

Donne le **lien de la PR** ouverte et un résumé d'une ligne de son contenu.

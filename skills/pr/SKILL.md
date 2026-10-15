---
name: pr
description: Ouvre la PR d'une story terminée (pull request sur GitHub, merge request sur GitLab), sur la forge retenue par la stack. Commite et pousse la branche, puis crée la PR avec la CLI de la forge, un titre en conventional commit et un renvoi vers la story. Se déclenche à la fin de l'orchestrateur, ou quand l'utilisateur veut ouvrir la PR de la branche courante. Ne merge jamais.
metadata:
  moukie-badge: "story"
  moukie-icon: "git-branch"
  moukie-rank: "9"
  moukie-summary: "Commite, pousse et ouvre la PR. Ne merge jamais."
---

# Skill PR

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).
La PR ne mentionne aucun co-auteur, et tu ne la passes jamais en fusion automatique : c'est l'utilisateur qui merge.
**Refuse de continuer** si la branche courante est `main` ou `master` : une PR part toujours d'une branche dédiée.

---

## Phase 1 — Préparation

Le nom de la branche est le chemin de la story sous `project/specs/` : la branche `cart/add-item` correspond à `project/specs/cart/add-item.md`. Si le nom ne suit pas ce format, **demande** la feature et le slug.

Lis la story : son titre et ses critères d'acceptation alimentent la PR.

Lis dans `project/stack.md` la **forge** retenue, et utilise sa CLI officielle : `gh` pour GitHub, `glab` pour GitLab. Si elle manque ou n'est pas authentifiée, arrête-toi et dis-le plutôt que de contourner.

---

## Phase 2 — Commits et push

Commite les changements restants. Pousse ensuite la branche, en créant l'upstream si nécessaire (`git push -u`).

---

## Phase 3 — Création de la PR

Crée la PR avec la CLI de la forge (`gh pr create` sur GitHub, `glab mr create` sur GitLab), vers la branche par défaut (`main` ou `master`) :

- **titre** : en conventional commit, en anglais comme les commits, il résume la story
- **corps**, dans la langue du projet, titres de section compris :
  - **What** : ce que fait le changement
  - **Why** : le besoin auquel il répond
  - **Story** : son titre et le chemin de son fichier (`project/specs/cart/add-item.md`)
  - **Critères d'acceptation** : la checklist de la story, reprise telle quelle
  - **Suggestions non appliquées** : celles que l'orchestrateur t'a transmises. S'il n'y en a pas, omets la section

---

## Fin

Donne le lien de la PR et un résumé de son contenu en une ligne. C'est l'utilisateur qui la merge.

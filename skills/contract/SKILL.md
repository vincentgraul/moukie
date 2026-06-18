---
name: contract
description: Définit, gèle ou fait évoluer le contrat d'interface partagé entre le front et le back. la forme des requêtes, réponses et erreurs de chaque endpoint, en schémas zod. Se déclenche avant de lancer des subagents front et back en parallèle sur une feature qui touche l'API, pour qu'ils codent contre une source unique de vérité sans se marcher dessus.
model: opus
---

# Contrat d'interface front/back

Le contrat est la **source unique de vérité** de l'interface cross-couche. Il s'écrit en **schémas zod** : une seule définition donne à la fois les types TypeScript (compile-time, des deux côtés) et la validation runtime (le back valide l'entrée, le front valide la réponse).
Mène les échanges en **français**.

**Quand l'utiliser** : avant de spawner les subagents front et back sur une story qui touche l'API. Une story front-only ou back-only n'en a **pas besoin**.

**Modèle de gestion** : une fois gelé, le contrat est immuable pendant le travail parallèle. Tout changement passe par la Phase 3 (suspension du parallèle), jamais par une édition locale dans un worktree.

---

## Phase 0 — Pré-requis

Détermine où vit le contrat selon le type de repo (lis le `CLAUDE.md`) :

- **Repo simple** : dans `src/shared/` (ex. `src/shared/contract/`).
- **Monorepo** : un package dédié `packages/contract/`, exposé comme `@<scope>/contract` et importé à l'identique par `apps/web`, `apps/mobile` et `apps/api`.

Détermine ensuite si on **crée** un nouveau contrat, on l'**étend**, ou on le **fait évoluer** (changement d'un endpoint existant).

---

## Phase 1 — Définition

À partir de la/des story(ies) qui touchent l'API :

- Pour chaque endpoint, définis en **zod** : la **requête**, la **réponse**, les **erreurs**, ainsi que la **route** et la **méthode**.
- Exporte les **types inférés** (`z.infer`) pour que front et back consomment les mêmes types.
- Fais valider le contrat par l'utilisateur, puis **gèle-le** : il devient la référence. Les subagents codent contre, sans le modifier.

---

## Phase 2 — Travail parallèle

Pendant que les subagents front et back tournent dans leurs worktrees isolés, le contrat est **immuable** :

- Aucun subagent ne modifie le contrat dans sa copie locale.
- Un subagent qui découvre qu'un changement d'interface est nécessaire **ne bricole pas un contournement** : il **remonte la demande** à l'orchestrateur et **s'arrête sur ce point** précis (il peut continuer le reste de son travail).

---

## Phase 3 — Évolution contrôlée

Pour faire évoluer un contrat gelé :

1. **Suspends** le travail parallèle sur les parties concernées.
2. Amende la **source unique** sur la branche de base (jamais dans un worktree de subagent).
3. Les deux lanes **rebasent** sur la base mise à jour.
4. Relance le travail parallèle.

Documente le changement d'interface pour que les deux lanes sachent ce qui a bougé.

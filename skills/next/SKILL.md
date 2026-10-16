---
name: next
description: Fait le point sur l'avancement d'un projet et propose la prochaine étape. Croise le périmètre de `project/product.md`, les features de `project/specs/`, les PR de la forge et les idées de `project/ideas.md`, puis rend les PR à merger, les stories à implémenter, le périmètre sans feature et les idées en attente, avec une seule étape recommandée et sa commande. Se déclenche quand l'utilisateur demande où en est le projet, ce qu'il reste à faire ou par quoi continuer, notamment en début de session. Ne modifie rien.
metadata:
  moukie-badge: "project"
  moukie-icon: "compass"
  moukie-rank: "10"
  moukie-summary: "Fait le point sur le projet et propose la prochaine étape."
---

# Skill Next

## Règles

Échange dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).

**Lecture seule** : tu ne modifies aucun fichier, aucune branche, et tu ne lances aucune étape. Tu proposes la commande, l'utilisateur la lance.

**Sois économe** : lis les frontmatters, les titres et les sections citées ci-dessous, pas le corps des stories ni le code.

---

## Phase 1 — Collecte

1. Récupère l'état du remote (`git fetch`) et repère sa branche par défaut, `origin/<défaut>` (`git symbolic-ref --short refs/remotes/origin/HEAD`).
2. Lis la section « Périmètre » de `project/product.md`.
3. Pour chaque feature de `project/specs/`, lis le `status` du frontmatter de son `README.md`, sa section « Objectif et périmètre », et la liste de ses stories.
4. Avec la CLI de la forge de `project/stack.md`, liste les PR ouvertes et mergées dont la branche source est une `<feature>/<story>`.
5. Lis `project/ideas.md` s'il existe : le titre, la complexité et le coût de fonctionnement de chaque idée.

---

## Phase 2 — État

Range ce que tu as trouvé :

- **PR à merger** : les PR ouvertes, dans l'ordre de leur pile, celle qui vise `<défaut>` d'abord
- **Feature en cadrage** : une feature en `status: draft`
- **Stories à implémenter** : celles d'une feature validée dont la branche n'a aucune PR, ouverte ou mergée
- **Périmètre sans feature** : les éléments du périmètre de `product.md` que ne couvre l'objectif d'aucune feature. Si tu hésites à rapprocher un élément d'une feature, range-le ici et dis pourquoi
- **Idées** : celles de `ideas.md`

---

## Phase 3 — Recommandation

Recommande **une seule** étape, la première qui s'applique :

1. une feature en cadrage : la reprendre, avec `/moukie:spec <feature>`
2. une story à implémenter : `/moukie:orchestrator <feature>/<story>`. Les PR ouvertes de sa feature ne la bloquent pas : elle s'empile sur elles
3. un élément du périmètre sans feature : `/moukie:spec <élément>`
4. une idée : celle qui apporte le plus pour sa complexité et son coût de fonctionnement, avec `/moukie:spec <titre de l'idée>`
5. rien de tout ça : dis que tout est livré, et propose de noter la suite avec le skill `idea`

---

## Fin

Rends l'état en un écran : une ligne par élément, groupés par catégorie, sans les catégories vides. Donne la complexité et le coût de fonctionnement de chaque idée. Termine par l'étape recommandée, sa raison en une ligne et sa commande.

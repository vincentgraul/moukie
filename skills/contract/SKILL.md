---
name: contract
description: Définit, gèle ou fait évoluer le contrat d'interface entre les apps d'un projet : la forme des requêtes, des réponses et des erreurs de chaque échange, dans le format retenu par la stack (Standard Schema, OpenAPI ou GraphQL). Se déclenche avant de lancer des agents en parallèle sur une story qui touche plusieurs apps, pour qu'ils codent contre une source unique de vérité sans se marcher dessus. Écrit la source du contrat.
metadata:
  moukie-badge: "story"
  moukie-icon: "key-round"
  moukie-rank: "8"
  moukie-summary: "Gèle l'interface entre les apps avant le travail parallèle."
---

# Skill Contract

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).
Applique le skill `naming-conventions` à tout ce que tu nommes : sa section « Contrat entre apps » fixe le nom des schémas et des routes.

Le contrat est la **source unique de vérité** de l'interface entre les apps : chacune en tire ses types, par inférence ou par génération selon le format, sans jamais les redéfinir. Son **format** est fixé par `project/stack.md`, son **emplacement** par `project/architecture.md` : ce skill ne décide ni l'un ni l'autre.

Une fois gelée, sa source est **immuable** pendant le travail parallèle : elle ne change que par l'évolution contrôlée, plus bas, jamais dans un worktree. Régénérer des types à partir d'elle n'est pas la modifier.

---

## Phase 1 — Préparation

Lis le format dans `project/stack.md` et l'emplacement dans `project/architecture.md`. S'il en manque un, arrête-toi et signale-le : c'est à `stack` ou à `architecture` de trancher.

**Lis la référence du format retenu**, et suis-la pour tout ce qui suit :

| Format | Quand | Référence |
|---|---|---|
| **Standard Schema** : Zod, Valibot, ArkType… | toutes les apps concernées sont en TypeScript | `references/standard-schema.md` |
| **OpenAPI** | une API REST dont au moins une app sort de TypeScript : app iOS, Android ou Flutter, back dans un autre langage | `references/openapi.md` |
| **GraphQL** | une API GraphQL, la tienne ou celle d'un service tiers comme Shopify | `references/graphql.md` |

Détermine enfin si tu **crées** un contrat, si tu l'**étends** avec de nouveaux échanges, ou si tu le **fais évoluer** en changeant un échange existant.

---

## Phase 2 — Construction

Construis le contrat à partir de la story :

- **ce que la story fixe déjà** : les énumérations, les champs requis et les valeurs par défaut que `figma-annotations` a rangés dans ses critères. Reprends-les sans les réinventer. S'il manque une valeur, ne la cherche pas dans Figma et ne l'invente pas : signale-le à l'orchestrateur, la story repasse par `spec`
- **chaque échange** : sa requête, sa réponse et ses erreurs, avec ce qui l'adresse, la route et la méthode en REST, l'opération en GraphQL
- **les types de chaque app**, tirés du contrat comme le prévoit la référence. Si le format demande une génération, lance la commande notée dans la section « Commandes » du `CLAUDE.md` et vérifie qu'elle passe. Si elle n'existe pas, parce que le projet a changé de format depuis son initialisation, invoque `scaffold` : il installe le générateur et ajoute la commande. Ne commite pas ce qu'il crée

---

## Phase 3 — Validation et gel

Fais valider le contrat par l'utilisateur, puis **gèle-le**. Le gel porte sur la source (le module de schémas Standard Schema, le fichier OpenAPI, le schéma GraphQL), jamais sur les types générés : c'est ce chemin que l'orchestrateur vérifie avant chaque fusion.

---

## Évolution contrôlée

Quand l'orchestrateur te fait évoluer un contrat gelé, amende sa **source** sur la branche de la story, jamais dans un worktree, et décris le changement d'interface pour que chaque lane sache ce qui a bougé. C'est l'orchestrateur qui suspend les lanes, commite, les fait rebaser et les relance.

---

## Fin

Rends la main à l'orchestrateur avec le chemin de la source du contrat et, si tu as invoqué `scaffold`, la liste de ce qu'il a créé. C'est l'orchestrateur qui commite le tout sur la branche de la story.

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

Mène les échanges en **français**.
N'écris pas de commentaires dans le code.
Commite en conventional commits, avec des messages en anglais et sans mention de co-auteur.
N'utilise jamais `--no-verify` : les hooks du dépôt sont des garde-fous, pas des obstacles.
Applique le skill `naming-conventions` à tout ce que tu nommes : sa section « Contrat entre apps » fixe le nom des schémas et des routes.

Le contrat est la **source unique de vérité** de l'interface entre les apps. Chaque app en tire ses types, par inférence ou par génération selon le format, et ne les redéfinit jamais à la main. Une story qui ne touche qu'une app n'en a pas besoin.

Le **format** est un choix de stack, dans `project/stack.md`. L'**emplacement** est un choix d'architecture, dans `project/architecture.md`. Ce skill ne décide ni l'un ni l'autre.

Une fois gelé, le contrat est **immuable** pendant le travail parallèle :

- aucun agent ne modifie sa source dans sa copie. Régénérer ses types à partir d'elle n'est pas la modifier
- un agent qui découvre qu'un changement d'interface est nécessaire ne bricole pas de contournement : il s'arrête sur ce point précis, continue le reste de son travail, et remonte la demande à l'orchestrateur
- tout changement passe par l'**évolution contrôlée**, plus bas, jamais par une modification dans un worktree

---

## Phase 1 — Préparation

Lis dans `project/stack.md` le format du contrat, et dans `project/architecture.md` son emplacement. S'il en manque un, arrête-toi et signale-le plutôt que de le deviner : c'est à `stack` ou à `architecture` de trancher.

**Charge la référence du format retenu**, et suis-la pour tout ce qui suit :

| Format | Quand | Référence |
|---|---|---|
| **Standard Schema** : Zod, Valibot, ArkType… | toutes les apps concernées sont en TypeScript | `references/standard-schema.md` |
| **OpenAPI** | une API REST dont au moins une app sort de TypeScript : app iOS, Android ou Flutter, back dans un autre langage | `references/openapi.md` |
| **GraphQL** | une API GraphQL, la tienne ou celle d'un service tiers comme Shopify | `references/graphql.md` |

Détermine enfin si tu **crées** un contrat, si tu l'**étends** avec de nouveaux échanges, ou si tu le **fais évoluer** en changeant un échange existant.

---

## Phase 2 — Construction

Construis le contrat à partir de la story :

- **ce que la story fixe déjà** : les énumérations, les champs requis et les valeurs par défaut sont dans ses critères quand la feature a des maquettes annotées, puisque `figma-annotations` les y a rangés au moment de la spec. Reprends-les, ne les réinvente pas. S'il manque à la story une valeur dont le contrat a besoin, ne la cherche pas dans Figma et ne l'invente pas : signale-le à l'orchestrateur, la story doit repasser par `spec`
- **chaque échange** : sa requête, sa réponse et ses erreurs, ainsi que ce qui l'adresse, la route et la méthode en REST, l'opération en GraphQL
- **les types de chaque app** : assure-toi que chacune les tire du contrat, comme le prévoit la référence. Si le format demande une génération, lance la commande notée dans la section « Commandes » du `CLAUDE.md` et vérifie qu'elle passe. Si cette commande n'existe pas, par exemple parce que le projet a changé de format de contrat depuis son initialisation, invoque `scaffold` : il installe le générateur que la stack retient et ajoute la commande. Ne commite pas ce qu'il crée : l'orchestrateur le commite avec la source du contrat

---

## Phase 3 — Validation et gel

Fais valider le contrat par l'utilisateur, puis **gèle-le** : il devient la référence.

Le gel porte sur la source du contrat (le module de schémas Standard Schema, le fichier OpenAPI, le schéma GraphQL), jamais sur les types générés. C'est ce chemin que l'orchestrateur vérifie avant chaque fusion.

---

## Évolution contrôlée

Pour faire évoluer un contrat gelé :

1. **Suspends** le travail parallèle sur les parties concernées.
2. Amende la **source** du contrat sur la branche de la story, jamais dans un worktree, et **commite-la** : les lanes ne voient le changement qu'à travers ce commit.
3. Les lanes **rebasent** sur la branche de la story, et régénèrent leurs types si le format le demande.
4. **Relance** le travail parallèle.

Décris le changement d'interface, pour que chaque lane sache ce qui a bougé.

---

## Fin

Rends la main à l'orchestrateur avec le chemin de la source du contrat et, si tu as invoqué `scaffold`, la liste de ce qu'il a créé. C'est l'orchestrateur qui commite le tout sur la branche de la story.

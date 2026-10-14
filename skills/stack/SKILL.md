---
name: stack
description: Définit, challenge ou met à jour la stack technique d'un projet à partir de son produit, avec une veille web sur les versions, la maintenance et la compatibilité des briques. Se déclenche quand `setup` arrive à la stack, ou quand l'utilisateur veut challenger, faire évoluer ou mettre à jour la stack d'un projet. Écrit `project/stack.md` et consigne chaque arbitrage dans `project/decisions.md`.
metadata:
  moukie-badge: "project"
  moukie-icon: "layers"
  moukie-rank: "3"
  moukie-summary: "Confronte la stack au produit, versions et licences vérifiées."
  moukie-produces: "Crée stack.md"
---

# Skill Stack

## Règles

Mène les échanges en **français**.

La stack se décide **à partir du produit**, jamais dans l'abstrait. `project/product.md` doit exister : s'il manque, arrête-toi et renvoie vers le skill `product`.

Tu proposes, l'utilisateur tranche. Chaque proposition s'appuie sur un besoin du produit et sur la veille, jamais sur l'habitude seule.

`project/stack.md` est **la** source de vérité de la stack : les agents n'en connaissent pas d'autre. Ce skill est le seul à l'écrire.

**N'invente rien.** Une version, une compatibilité ou un état de maintenance que tu n'as pas vérifié n'est pas une information.

### Décisions déjà prises

Lis `project/decisions.md` avant de proposer quoi que ce soit. Un choix consigné ne se rouvre qu'avec un **élément nouveau** : une version majeure sortie, une bibliothèque abandonnée, un besoin produit qui a changé. Sans élément nouveau, il tient : rouvrir un débat clos fait perdre du temps à l'utilisateur.

---

## Préférences par défaut

Ce sont les préférences de Moukie. C'est ton **point de départ** : une hypothèse à confronter au produit et à la veille, pas une liste à recopier.

### Commun
- langage : `TypeScript`
- runtime et gestionnaire de paquets : `Bun`
- linter et formatter : `Biome`
- monorepo : `Turborepo`
- forge : `GitHub`, et sa CLI `gh`
- CI/CD : `GitHub Actions`
- conteneurisation : `Docker`

### Front web
- bibliothèques : `React`, `Empreint`, `TanStack Router`, `TanStack Form`, `TanStack Query`
- outil de build : `Vite`
- tests : `Vitest`, `Playwright`
- documentation : `Storybook`
- icônes : `Lucide React`

### Front mobile
- bibliothèques : `React Native`
- icônes : `Lucide React Native`

### Back
- framework : `Hono`
- validation : `Zod`
- authentification : `Better Auth`
- ORM : `Kysely`
- base de données : `PostgreSQL`
- documentation : `Scalar`
- tests : `Vitest`

### E-commerce
- plateforme : `Shopify`

### Contrat entre apps
- format : `Standard Schema`, avec `Zod`, quand toutes les apps sont en TypeScript

Le **format du contrat** est un arbitrage comme un autre, mais il découle des apps retenues : Standard Schema quand toutes sont en TypeScript, avec la bibliothèque de schémas retenue (Zod par défaut), OpenAPI dès qu'une API REST sert une app hors TypeScript (iOS, Android, Flutter, back dans un autre langage), GraphQL pour une API GraphQL. Le skill `contract` documente les trois. Pour OpenAPI et GraphQL, retiens aussi le générateur de types de chaque app.

---

## Phase 1 — Préparation

Lis `project/product.md`, `project/decisions.md`, `project/stack.md` et `project/design.md` s'ils existent, et les manifestes du code déjà présent (`package.json`, `Package.swift`, `build.gradle`, `pubspec.yaml`…). La nature du projet est dans `product.md` ; s'il est open source, sa licence est dans `decisions.md`.

Détermine le mode :

- **création** : il n'y a pas encore de `stack.md`
- **challenge** : l'utilisateur veut remettre en cause tout ou partie de la stack
- **mise à jour** : vérifier les versions et repérer ce qui est déprécié ou abandonné

En cas de doute, demande. Résume en une ou deux lignes ce que tu as détecté.

---

## Phase 2 — Besoins techniques

Traduis le produit en besoins techniques : ce sont eux, pas les préférences, qui pilotent les choix.

Ne pose jamais de question ouverte sur ce qui s'énumère : propose une liste de candidats, que l'utilisateur coche, écarte ou complète. Déduis les candidats de `product.md`, et soumets-les par lots avec `AskUserQuestion` :

- surfaces : web, mobile, les deux ; un back est-il nécessaire
- rendu : SEO et contenu public, ou application derrière une authentification
- temps réel, hors ligne, notifications
- paiement, e-commerce, upload de médias
- authentification : rôles, fournisseurs externes
- volumétrie et charge attendues
- contraintes : hébergement, budget, existant à ne pas casser

En mode **mise à jour**, saute cette phase sauf si le produit a changé depuis la dernière stack.

---

## Phase 3 — Veille

Pour chaque brique candidate, préférence par défaut comme alternative, vérifie par `WebSearch` :

- la **version** stable actuelle et la date de sa dernière publication
- l'**état de maintenance** : activité du dépôt, mainteneurs, signaux d'abandon
- la **compatibilité** avec les autres briques retenues : l'authentification avec le framework back, l'ORM avec le runtime, les bibliothèques UI avec le framework front
- la **licence** de chaque brique : compatible avec celle du projet s'il est open source (une dépendance copyleft dans un projet sous licence permissive est un problème), et avec une distribution propriétaire s'il est commercial
- les **alternatives sérieuses** apparues ou montées en puissance depuis

Cite tes sources. Une affirmation de veille sans source n'en est pas une.

---

## Phase 4 — Proposition

Domaine par domaine (commun, front web, front mobile, back, contrat entre apps, e-commerce, selon ce que le produit demande), présente :

- la préférence par défaut
- l'alternative crédible, s'il y en a une
- ta recommandation, et pourquoi : le besoin produit qu'elle sert, ce que dit la veille

Quand la préférence par défaut convient, dis-le simplement : challenger ne veut pas dire changer.

Soumets les arbitrages avec `AskUserQuestion`, ta recommandation en premier. Récapitule, puis demande une confirmation avant d'écrire.

---

## Phase 5 — Écriture

### `project/stack.md`

Groupe par domaine, une ligne par brique : son rôle, son nom, sa version majeure.

```markdown
# Stack

## Commun
- langage : TypeScript 5
- runtime et gestionnaire de paquets : Bun 1

## Back
- framework : Hono 4
```

N'y mets que les briques **retenues** : les alternatives écartées et les raisons vont dans `decisions.md`.

En challenge ou en mise à jour, modifie le fichier au plus près plutôt que de le réécrire.

### `project/decisions.md`

Une entrée par arbitrage, ajoutée à la fin du fichier. Crée le fichier s'il n'existe pas.

```markdown
## AAAA-MM-JJ · <sujet>
- **Choix** : …
- **Écartés** : …
- **Raison** : …
```

Consigne aussi les préférences **confirmées** après challenge : ce sont elles qu'un futur passage serait tenté de rouvrir.

---

## Fin

En **création**, rends la main à `setup` : la suite de l'entretien, l'architecture, le code et la configuration s'appuient sur `stack.md`.

En **challenge** ou **mise à jour**, liste ce qui a changé et ce que ça implique pour le code existant : migrations, dépendances à mettre à jour, code à adapter. Ne modifie pas le code toi-même : c'est le travail d'une story.

---
name: architecture
description: Définit, challenge ou amende l'architecture d'un projet à partir de son produit et de sa stack : les apps, la stratégie de dépôt, le découpage du front et du back, les modules, l'emplacement du contrat partagé et la communication entre apps. Se déclenche quand `setup` arrive à l'architecture, quand l'utilisateur veut challenger ou faire évoluer l'architecture, ou quand `spec` ou l'orchestrateur rencontrent un module ou une app que l'architecture ne prévoit pas. Écrit `project/architecture.md`.
---

# Skill Architecture

## Règles

Mène les échanges en **français**.

Ce skill est le seul à écrire `project/architecture.md`. Les agents rangent le code là où il le prévoit, et le `reviewer` le confronte au code.

L'architecture se décide **à partir du produit et de la stack**. `project/product.md` et `project/stack.md` doivent exister : s'il en manque un, arrête-toi et renvoie vers le skill `product` ou `stack`.

**La frontière avec `stack`** : la stack dit **avec quoi** (langages, frameworks, bibliothèques, versions), l'architecture dit **comment c'est organisé** (apps, dépôt, découpage, modules, contrat, communication). « Turborepo » relève de la stack, « monorepo ou dépôt simple » relève de l'architecture. Si une question te semble relever de la stack, renvoie vers `stack` plutôt que de la trancher ici.

Tu proposes, l'utilisateur tranche. Chaque proposition s'appuie sur le produit, la stack et la nature du projet, jamais sur l'habitude seule.

### Décisions déjà prises

Lis `project/decisions.md` avant de proposer quoi que ce soit. Un choix consigné ne se rouvre qu'avec un **élément nouveau** : une app ajoutée, un module devenu trop gros, un changement de stack. Sans élément nouveau, il tient : rouvrir un débat clos fait perdre du temps à l'utilisateur.

---

## Préférences par défaut

Ce sont les préférences de Moukie. C'est ton **point de départ** : une hypothèse à confronter au projet, pas un modèle à recopier.

- **dépôt** : deux apps ou plus, un **monorepo** ; une seule, un **dépôt simple**
- **front web** : **Feature-Sliced Design v2.1**. Le skill `feature-sliced-design` fait foi, et `steiger` le vérifie
- **front mobile** : l'organisation que recommande sa plateforme ; Feature-Sliced Design pour une app React Native
- **back** : **Modular Monolith** et **Vertical Slice**
  - **Vertical Slice** : le code est organisé par feature, chaque slice contenant sa route, sa logique et son accès aux données, pas par couche technique
  - **Modular Monolith** : les slices sont regroupées en modules (bounded contexts) qui communiquent par leur API publique
- **contrat partagé** : en Standard Schema, dans `src/shared/` en dépôt simple, ou dans un package dédié `packages/shared/` en monorepo, exposé comme `@<scope>/shared` et importé à l'identique par chaque app ; en OpenAPI ou en GraphQL, le fichier source dans un dossier `contract/` à la racine
- **communication entre apps** : par HTTP, contre le contrat, dans le format retenu par la stack

Ces préférences supposent une application avec un front, un back, ou les deux. Elles ne conviennent pas à tous les projets : une bibliothèque de composants n'a ni pages ni back, un site e-commerce sur Shopify a l'architecture de Shopify, une app mobile seule n'a pas besoin de monorepo. Dans ces cas, propose l'organisation que le projet demande, et dis pourquoi.

---

## Phase 1 — Préparation

Lis `project/product.md` (nature, périmètre), `project/stack.md` (les briques retenues), `project/decisions.md`, et `project/architecture.md` s'il existe. Si du code existe déjà, regarde son arborescence : l'architecture décrit le projet, elle ne l'ignore pas.

Détermine le mode :

- **création** : il n'y a pas encore d'`architecture.md`
- **challenge** : l'utilisateur veut remettre en cause tout ou partie de l'architecture
- **amendement** : `spec` ou l'orchestrateur t'appellent parce qu'une feature ou un agent a besoin d'un module, d'une app ou d'une communication que l'architecture ne prévoit pas. Ils te transmettent ce besoin

Résume en une ou deux lignes ce que tu as détecté.

---

## Phase 2 — Apps et dépôt

Déduis de `stack.md` et du produit la liste des apps : web, mobile, API, et tout ce que le produit exige d'autre (un worker pour des tâches en arrière-plan, par exemple). Propose la stratégie de dépôt qui en découle.

Ne pose jamais de question ouverte sur ce qui s'énumère : propose une liste de candidats, que l'utilisateur coche, écarte ou complète. Soumets ta liste avec `AskUserQuestion`.

En **amendement**, ne repasse par cette phase que si le besoin transmis est une nouvelle app.

---

## Phase 3 — Découpage

Pour chaque app, propose son organisation :

- **front** : Feature-Sliced Design par défaut pour le web et React Native, l'organisation de sa plateforme pour une app native. Vérifie que le choix s'accorde avec le framework retenu, à l'aide des références du skill `feature-sliced-design` sur l'intégration aux frameworks
- **back** : Modular Monolith et Vertical Slice par défaut. Propose la **liste initiale des modules**, déduite du périmètre de `product.md` (par exemple catalogue, commandes, comptes) : pour chacun, sa responsabilité et ce qu'il expose aux autres. L'utilisateur coche, écarte, renomme. Sans cette liste, chaque agent déciderait seul où ranger le code
- **le contrat partagé** : son emplacement, selon la stratégie de dépôt et le format retenu par la stack
- **la communication entre apps**, si elle sort du simple appel HTTP contre le contrat

Si la stack sort de ce que tu connais (un framework récent, une intégration inhabituelle), vérifie par `WebSearch` et cite tes sources.

En **amendement**, limite-toi au besoin transmis : un module à créer (son nom, sa responsabilité, son API publique), une app à ajouter, une communication à prévoir.

---

## Phase 4 — Proposition

Domaine par domaine, présente :

- la préférence par défaut
- l'alternative crédible, s'il y en a une
- ta recommandation, et pourquoi

Quand la préférence par défaut convient, dis-le simplement : challenger ne veut pas dire changer.

Soumets les arbitrages avec `AskUserQuestion`, ta recommandation en premier.

En **amendement**, propose le changement **minimal**. Si l'utilisateur le refuse, le besoin doit tenir dans l'architecture existante : dis-le à l'appelant.

Récapitule, puis demande une confirmation avant d'écrire.

---

## Phase 5 — Écriture

### `project/architecture.md`

Il est lu à la demande, jamais importé : il peut être détaillé, mais reste structuré.

```markdown
# Architecture

## Apps
- web : …
- api : …

## Dépôt
monorepo | dépôt simple

## Front
Feature-Sliced Design v2.1

## Back
Modular Monolith et Vertical Slice

### Modules
| Module | Responsabilité | API publique |
|---|---|---|

## Contrat partagé
packages/shared/, exposé comme @<scope>/shared, ou contract/openapi.yaml

## Communication entre apps
```

Supprime les sections qui ne concernent pas le projet : une bibliothèque de composants n'a pas de section Back. N'y mets que les choix **retenus** : les alternatives écartées et les raisons vont dans `decisions.md`.

En challenge ou en amendement, modifie le fichier au plus près plutôt que de le réécrire.

### `project/decisions.md`

Une entrée par arbitrage, ajoutée à la fin du fichier. Crée le fichier s'il n'existe pas.

```markdown
## AAAA-MM-JJ · <sujet>
- **Choix** : …
- **Écartés** : …
- **Raison** : …
```

En amendement, la raison cite la feature ou le besoin qui a provoqué l'arbitrage.

---

## Fin

En **création**, rends la main à `setup` : il fait générer le code par `scaffold`, puis installe l'outillage qui correspond à l'architecture retenue, comme `steiger` si elle retient Feature-Sliced Design.

En **challenge**, liste ce que ça implique pour le code existant : fichiers à déplacer, modules à scinder, passage en monorepo. Ne modifie pas le code toi-même : c'est le travail d'une story.

En **amendement**, rends la main à l'appelant avec ta conclusion : architecture amendée, ou besoin refusé. Si l'amendement ajoute une app, signale-le : elle sera générée par `scaffold` au démarrage de la story qui en a besoin.

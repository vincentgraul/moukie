# Création et challenge

Ce fichier sert en **création** et en **challenge**. Un amendement suit le chemin court du `SKILL.md` et n'en a pas besoin.

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

Ces préférences supposent une application avec un front, un back, ou les deux. Une bibliothèque de composants n'a ni pages ni back, un site e-commerce sur Shopify a l'architecture de Shopify, une app mobile seule n'a pas besoin de monorepo. Dans ces cas, propose l'organisation que le projet demande, et dis pourquoi.

---

## Apps et dépôt

Déduis de `stack.md` et du produit la liste des apps : web, mobile, API, et tout ce que le produit exige d'autre (un worker pour des tâches en arrière-plan, par exemple). Propose la stratégie de dépôt qui en découle.

Ne pose jamais de question ouverte sur ce qui s'énumère : propose une liste de candidats, que l'utilisateur coche, écarte ou complète. Soumets ta liste avec `AskUserQuestion`.

---

## Découpage

Pour chaque app, propose son organisation :

- **front** : Feature-Sliced Design par défaut pour le web et React Native, l'organisation de sa plateforme pour une app native. Vérifie que le choix s'accorde avec le framework retenu, à l'aide des références du skill `feature-sliced-design` sur l'intégration aux frameworks
- **back** : Modular Monolith et Vertical Slice par défaut. Propose la **liste initiale des modules**, déduite du périmètre de `product.md` (par exemple catalogue, commandes, comptes) : pour chacun, sa responsabilité et ce qu'il expose aux autres. L'utilisateur coche, écarte, renomme. Sans cette liste, chaque agent déciderait seul où ranger le code
- **le contrat partagé** : son emplacement, selon la stratégie de dépôt et le format retenu par la stack
- **la communication entre apps**, si elle sort du simple appel HTTP contre le contrat

Si la stack sort de ce que tu connais (un framework récent, une intégration inhabituelle), vérifie par `WebSearch` et cite tes sources.

---

## Proposition

Domaine par domaine, présente :

- la préférence par défaut
- l'alternative crédible, s'il y en a une
- ta recommandation, et pourquoi

Quand la préférence par défaut convient, dis-le simplement : challenger ne veut pas dire changer.

Soumets les arbitrages avec `AskUserQuestion`, ta recommandation en premier. Récapitule, puis demande une confirmation avant d'écrire.

---

## Gabarit de `project/architecture.md`

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

Supprime les sections qui ne concernent pas le projet : une bibliothèque de composants n'a pas de section Back. N'y mets que les choix **retenus** : les alternatives écartées et les raisons vont dans `decisions.md`. En challenge, modifie le fichier au plus près plutôt que de le réécrire.

---

## Fin

En **création**, rends la main à `setup` : il fait générer le code par `scaffold`, puis installe l'outillage qui correspond à l'architecture retenue, comme `steiger` si elle retient Feature-Sliced Design.

En **challenge**, liste ce que ça implique pour le code existant : fichiers à déplacer, modules à scinder, passage en monorepo. Ne modifie pas le code toi-même : c'est le travail d'une story.

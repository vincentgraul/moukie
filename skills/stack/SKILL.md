---
name: stack
description: Définit, challenge, amende ou met à jour la stack technique d'un projet à partir de son produit, avec une veille web sur les versions, la maintenance et la compatibilité des briques. Se déclenche quand `setup` arrive à la stack, quand l'utilisateur veut challenger, faire évoluer ou mettre à jour la stack d'un projet, ou quand `spec` ou l'orchestrateur rencontrent un besoin que la stack ne couvre pas. Écrit `project/stack.md` et consigne chaque arbitrage dans `project/decisions.md`.
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

`project/stack.md` est **la** source de vérité de la stack : les agents n'en connaissent pas d'autre. Ce skill est le seul à l'écrire.

Tu proposes, l'utilisateur tranche. **N'invente rien** : une version, une compatibilité ou un état de maintenance que tu n'as pas vérifié n'est pas une information.

Lis `project/decisions.md` avant de proposer quoi que ce soit : un choix consigné ne se rouvre qu'avec un **élément nouveau** (une version majeure sortie, une bibliothèque abandonnée, un besoin produit qui a changé).

---

## Mode

- **amendement** : `spec` ou l'orchestrateur t'appellent avec un besoin que la stack ne couvre pas, sur un seul domaine (un paiement, du temps réel, une bibliothèque). Suis le chemin court ci-dessous
- **création** : il n'y a pas encore de `stack.md`
- **challenge** : l'utilisateur veut remettre en cause tout ou partie de la stack
- **mise à jour** : vérifier les versions et repérer ce qui est déprécié ou abandonné

En **création**, **challenge** et **mise à jour**, lis `project/product.md`, `project/stack.md` et `project/design.md` s'ils existent, et les manifestes du code déjà présent (`package.json`, `Package.swift`, `build.gradle`, `pubspec.yaml`…), puis **lis `references/full-process.md`** et suis-le.

---

## Amendement

1. Lis `project/stack.md` et `project/decisions.md`, et dans `project/product.md` ce qui touche au besoin. La nature du projet y est ; s'il est open source, sa licence est dans `decisions.md`.
2. Si une brique déjà retenue couvre le besoin, dis-le à l'appelant et n'écris rien.
3. Retiens deux ou trois candidats pour ce domaine. Si `references/preferences.md` en propose un, il en fait partie. Fais la veille ci-dessous sur eux seuls.
4. Soumets-les en **une seule** question `AskUserQuestion`, ta recommandation en premier, avec l'option de refuser.
5. Accepté : ajoute la brique à `stack.md` au plus près, sans toucher au reste, et une entrée à `decisions.md` dont la raison cite la feature ou le besoin. Refusé : n'écris rien.
6. Rends la main à l'appelant : brique retenue, ce qu'il faudra installer, ou besoin refusé. Ne modifie pas le code toi-même.

---

## Veille

Pour chaque brique candidate, vérifie par `WebSearch` :

- la **version** stable actuelle et la date de sa dernière publication
- l'**état de maintenance** : activité du dépôt, mainteneurs, signaux d'abandon
- la **compatibilité** avec les briques déjà retenues
- la **licence** : compatible avec celle du projet s'il est open source (une dépendance copyleft dans un projet sous licence permissive est un problème), et avec une distribution propriétaire s'il est commercial

Cite tes sources. Une affirmation de veille sans source n'en est pas une.

---

## Écriture

### `project/stack.md`

Groupe par domaine, une ligne par brique : son rôle, son nom, sa version majeure. N'y mets que les briques **retenues** : les alternatives écartées et les raisons vont dans `decisions.md`.

```markdown
# Stack

## Commun
- langage : TypeScript 5
- runtime et gestionnaire de paquets : Bun 1

## Back
- framework : Hono 4
```

### `project/decisions.md`

Une entrée par arbitrage, ajoutée à la fin du fichier. Crée le fichier s'il n'existe pas.

```markdown
## AAAA-MM-JJ · <sujet>
- **Choix** : …
- **Écartés** : …
- **Raison** : …
```

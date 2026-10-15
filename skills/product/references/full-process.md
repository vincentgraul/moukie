# Création et challenge

Ce fichier sert en **création** et en **challenge**. Un amendement suit le chemin court du `SKILL.md` et n'en a pas besoin.

---

## La nature du projet

Elle décide de ce que tu examines : ce que veut dire **réussir**, et pour qui.

| | Commercial | Open source | Personnel |
|---|---|---|---|
| Réussir, c'est | des clients, du revenu | de l'adoption, une communauté | s'en servir au quotidien |
| Pour qui | des clients | des utilisateurs **et** des contributeurs | l'utilisateur, ou un groupe connu |
| Ce qui existe déjà | des concurrents | des alternatives, libres et payantes | des outils qui font déjà le travail |
| La question qui fâche | « ce marché est saturé » | « pourquoi ne pas contribuer à l'existant plutôt que créer un projet de plus ? » | « est-ce que ça existe déjà ? » |

Un projet commercial ou open source a un `market.md`. Un projet personnel n'en a pas : la vérification de l'existant tient en un paragraphe dans `product.md`.

---

## Entretien

Laisse d'abord l'utilisateur décrire librement, structure ce qu'il a dit sans rien inventer, puis ne le questionne que sur les trous, par lots, avec `AskUserQuestion`. Propose des candidats à cocher plutôt que des questions ouvertes.

Si `setup` te transmet l'**inventaire des maquettes**, pars de lui : ses écrans donnent le périmètre, et souvent la cible. Propose-les comme candidats, et ne pose aucune question sur les pages, la navigation ou le contenu qu'ils montrent.

Les trous à combler :

- **le problème** : qui souffre de quoi aujourd'hui, et comment ces gens s'en sortent sans ce produit. Challenge tant que ce n'est pas clair
- **la cible** : le cœur de cible, précis. « Tout le monde » n'est pas une cible
- **la proposition de valeur** : en une phrase
- **le périmètre** : ce qui est dedans et ce qui est dehors. Propose les extensions naturelles que tu vois venir, l'utilisateur écarte ce qui n'en fait pas partie
- **les critères de succès**, selon la nature : du revenu, de l'adoption, ou un usage personnel régulier
- **commercial** : le modèle économique
- **open source** : la licence, et qui maintient le projet dans la durée. Une licence permissive (MIT, Apache-2.0) favorise l'adoption, une licence copyleft (GPL, AGPL) garde les dérivés libres : c'est un choix de positionnement. Consigne son identifiant SPDX exact, `GPL-3.0-only` n'étant pas `GPL-3.0-or-later`

---

## Veille

Par `WebSearch`, selon la nature :

- **commercial** : les concurrents directs et indirects, leurs prix, leur positionnement, et surtout les **avis de leurs utilisateurs** (stores, comparateurs, forums) : c'est là que se trouvent les vrais points de douleur
- **open source** : les alternatives libres et payantes, l'état de maintenance de chacune (une alternative abandonnée est une opportunité), pourquoi elles ne suffisent pas, et les projets auxquels il vaudrait peut-être mieux contribuer
- **personnel** : quelques recherches pour vérifier qu'aucun outil existant ne fait déjà le travail

Cite et date chaque source.

---

## Challenge

Restitue ce que la veille a montré, sans l'adoucir. Pose la question qui fâche propre à la nature du projet, et donne ton avis franc.

Propose ensuite un positionnement : ce qui différencie ce projet de ce qui existe, pour cette cible. L'utilisateur tranche. Récapitule, puis demande une confirmation avant d'écrire.

---

## Gabarits

### `project/product.md`

```markdown
# <Nom du projet>

**Nature** : commercial | open source | personnel

## Problème
## Cible
## Proposition de valeur
## Périmètre
- Dans le périmètre : …
- Hors périmètre : …
## Critères de succès
```

Projet **personnel** : ajoute une section `## Existe-t-il déjà ?`, un paragraphe qui résume la vérification de l'existant. Aucune technique dans `product.md`.

### `project/market.md`

Projet **commercial** ou **open source** uniquement. Il est lu à la demande, jamais importé : il peut être détaillé.

```markdown
# Market

## Concurrents          (open source : Alternatives)
| Nom | Type | Forces | Faiblesses | Source (date) |

## Points de douleur relevés
## Positionnement
## Modèle économique  (open source : Licence et soutenabilité)
```

En challenge, modifie chaque fichier au plus près plutôt que de le réécrire.

---

## Fin

En **création**, rends la main à `setup`, qui enchaîne sur la stack.

En **challenge**, liste ce qui a changé et ce que ça implique : des features déjà spécifiées qui sortent du périmètre, des besoins nouveaux pour `stack`. Ne modifie pas les specs toi-même.

---
name: product
description: Cadre, challenge ou amende le produit d'un projet : le problème, la cible, la proposition de valeur, le périmètre, et ce qui existe déjà (concurrents, alternatives, positionnement), avec une veille web adaptée à la nature du projet, commercial, open source ou personnel. Se déclenche quand `setup` arrive au cadrage produit, quand l'utilisateur veut challenger son produit ou son positionnement, ou quand `spec` détecte qu'une feature déplace le périmètre ou ouvre un nouveau public. Écrit `project/product.md` et `project/market.md`.
metadata:
  moukie-badge: "project"
  moukie-icon: "target"
  moukie-rank: "2"
  moukie-summary: "Challenge ton produit, avec une veille sur l'existant."
  moukie-produces: "Crée product.md et market.md"
---

# Skill Product

## Règles

Échange et écris dans la **langue du projet**, transmise par `setup` ou notée dans le `CLAUDE.md`. Traduis les titres des gabarits dans cette langue.

Ce skill est le seul à écrire `project/product.md` et `project/market.md`. Tous les autres les lisent.

**Challenger, pas flatter.** Ton rôle n'est pas de valider ce que l'utilisateur apporte. Ose dire qu'un marché est saturé, qu'une cible est trop large, qu'un concurrent fait déjà la même chose, mieux et gratuitement. Un projet qui ne survit pas à ces questions ne survivra pas au réel, et c'est maintenant qu'il est le moins cher de l'apprendre.

**Rester relié à ce qu'on construit.** Chaque section doit servir la suite : la cible devient les rôles des specs, les points de douleur deviennent des features, les contraintes deviennent des besoins pour `stack`. Une analyse qui ne nourrit rien en aval est un business plan, pas un cadrage.

**N'invente rien.** Un concurrent, un prix, un chiffre ou un avis que tu n'as pas trouvé n'est pas une information. Tout ce qui vient de la veille est sourcé et daté.

### Décisions déjà prises

Lis `project/decisions.md` avant de proposer quoi que ce soit. Un choix consigné ne se rouvre qu'avec un **élément nouveau** : un concurrent apparu, un retour utilisateur, une feature qui déplace le périmètre. Sans élément nouveau, il tient : rouvrir un débat clos fait perdre du temps à l'utilisateur.

---

## La nature du projet

Elle décide de ce que tu examines. Ce n'est pas une question d'argent mais de ce que veut dire **réussir**, et pour qui.

| | Commercial | Open source | Personnel |
|---|---|---|---|
| Réussir, c'est | des clients, du revenu | de l'adoption, une communauté | s'en servir au quotidien |
| Pour qui | des clients | des utilisateurs **et** des contributeurs | l'utilisateur, ou un groupe connu |
| Ce qui existe déjà | des concurrents | des alternatives, libres et payantes | des outils qui font déjà le travail |
| La question qui fâche | « ce marché est saturé » | « pourquoi ne pas contribuer à l'existant plutôt que créer un projet de plus ? » | « est-ce que ça existe déjà ? » |

Un projet commercial ou open source a un `market.md`. Un projet personnel n'en a pas : une vérification rapide de l'existant tient en un paragraphe dans `product.md`.

---

## Phase 1 — Préparation

Lis `project/product.md`, `project/market.md` et `project/decisions.md` s'ils existent, ainsi que le README du dépôt.

La **nature** du projet t'est transmise par `setup`, ou se lit dans `product.md`. Si tu ne la connais pas, demande-la avant tout.

Détermine le mode :

- **création** : il n'y a pas encore de `product.md`
- **challenge** : l'utilisateur veut remettre en question son produit ou son positionnement
- **amendement** : `spec` t'appelle parce qu'une feature déplace le périmètre ou ouvre un nouveau public. Il te transmet la feature en cause

Résume en une ou deux lignes ce que tu as détecté.

---

## Phase 2 — Entretien

En **création** et en **challenge**, laisse d'abord l'utilisateur décrire librement, structure ce qu'il a dit sans rien inventer, puis ne le questionne que sur les trous, par lots, avec `AskUserQuestion`. Ne pose jamais de question ouverte sur ce qui s'énumère : propose une liste de candidats, que l'utilisateur coche, écarte ou complète.

Les trous qui **doivent** être comblés :

- **le problème** : qui souffre de quoi aujourd'hui, et comment ces gens s'en sortent sans ce produit. Challenge tant que ce n'est pas clair
- **la cible** : le cœur de cible, précis. « Tout le monde » n'est pas une cible
- **la proposition de valeur** : en une phrase
- **le périmètre** : ce qui est dedans, et ce qui est dehors. Propose les extensions naturelles que tu vois venir, l'utilisateur écarte ce qui n'en fait pas partie
- **les critères de succès**, selon la nature : du revenu, de l'adoption, ou un usage personnel régulier
- **commercial** : le modèle économique
- **open source** : la licence, et qui maintient le projet dans la durée. Une licence permissive (MIT, Apache-2.0) favorise l'adoption ; une licence copyleft (GPL, AGPL) garantit que les dérivés restent libres. C'est un choix de positionnement, pas une formalité. Consigne son identifiant SPDX exact, `GPL-3.0-only` n'étant pas `GPL-3.0-or-later`

Si `setup` te transmet l'**inventaire des maquettes**, pars de lui : ses écrans donnent le périmètre, et souvent la cible. Propose-les comme candidats, et ne pose aucune question sur les pages, la navigation ou le contenu qu'ils montrent. Questionne seulement sur ce que des maquettes ne disent pas : le problème, la proposition de valeur, les critères de succès, le modèle économique ou la licence.

En **amendement**, pas d'entretien complet : pars de la feature transmise par `spec`, et passe directement à la Phase 4.

---

## Phase 3 — Veille

Par `WebSearch`, selon la nature :

- **commercial** : les concurrents directs et indirects, leurs prix, leur positionnement, et surtout les **avis de leurs utilisateurs** (stores, comparateurs, forums). C'est là que se trouvent les vrais points de douleur, ceux qui permettent de se différencier
- **open source** : les alternatives libres et payantes, l'état de maintenance de chacune (une alternative abandonnée est une opportunité), pourquoi elles ne suffisent pas, et les projets auxquels il vaudrait peut-être mieux contribuer
- **personnel** : quelques recherches pour vérifier qu'aucun outil existant ne fait déjà le travail

Cite et date chaque source : une veille vieillit vite.

---

## Phase 4 — Challenge

Restitue ce que la veille a montré, sans l'adoucir. Pose la question qui fâche propre à la nature du projet, et donne ton avis franc.

Propose ensuite un positionnement : ce qui différencie ce projet de ce qui existe, pour cette cible. L'utilisateur tranche.

En **amendement**, évalue la feature transmise : déplace-t-elle le périmètre, ouvre-t-elle un nouveau public, contredit-elle le positionnement ? Propose l'amendement **minimal** de `product.md`, et de `market.md` si le positionnement est touché. Si l'utilisateur refuse l'amendement, c'est la feature qui sort du périmètre : dis-le à `spec`.

Récapitule, puis demande une confirmation avant d'écrire.

---

## Phase 5 — Écriture

### `project/product.md`

Il est **importé à chaque session** par le `CLAUDE.md` : chaque agent le paie en contexte, même celui qui code un endpoint. Il doit tenir en un écran. Ce qui déborde va dans `market.md`.

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

Projet **personnel** : ajoute une section `## Existe-t-il déjà ?`, un paragraphe qui résume la vérification de l'existant.

Aucune technique dans `product.md`.

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

### `project/decisions.md`

Une entrée par arbitrage (positionnement, licence, changement de périmètre), ajoutée à la fin du fichier. Crée le fichier s'il n'existe pas.

```markdown
## AAAA-MM-JJ · <sujet>
- **Choix** : …
- **Écartés** : …
- **Raison** : …
```

En amendement, la raison cite la feature qui a provoqué l'arbitrage.

En challenge ou en amendement, modifie chaque fichier au plus près plutôt que de le réécrire.

---

## Fin

En **création**, rends la main à `setup`, qui enchaîne sur la stack : elle se décide à partir de ce que tu viens d'écrire.

En **challenge**, liste ce qui a changé et ce que ça implique : des features déjà spécifiées qui sortent du périmètre, des besoins nouveaux pour `stack`. Ne modifie pas les specs toi-même.

En **amendement**, rends la main à `spec` avec ta conclusion : périmètre amendé, ou feature hors périmètre.

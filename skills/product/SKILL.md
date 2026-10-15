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

Ce skill est le seul à écrire `project/product.md` et `project/market.md`.

**Challenge, ne flatte pas.** Ose dire qu'un marché est saturé, qu'une cible est trop large, qu'un concurrent fait déjà la même chose, mieux et gratuitement : c'est maintenant que l'apprendre coûte le moins.

**Relie chaque section à la suite** : la cible devient les rôles des specs, les points de douleur des features, les contraintes des besoins pour `stack`.

**N'invente rien.** Un concurrent, un prix ou un chiffre que tu n'as pas trouvé n'est pas une information. Ce qui vient de la veille est sourcé et daté.

`product.md` est **importé à chaque session** par le `CLAUDE.md` : il tient en un écran, et ce qui déborde va dans `market.md`.

Lis `project/decisions.md` avant de proposer quoi que ce soit : un choix consigné ne se rouvre qu'avec un **élément nouveau** (un concurrent apparu, un retour utilisateur, une feature qui déplace le périmètre). Consigne chaque arbitrage (positionnement, licence, changement de périmètre) à la fin de ce fichier, en le créant s'il manque : un titre `## AAAA-MM-JJ · <sujet>`, puis trois puces, **Choix**, **Écartés** et **Raison**.

---

## Mode

- **amendement** : `spec` t'appelle avec une feature qui déplace le périmètre, ouvre un nouveau public ou touche au positionnement. Suis le chemin court ci-dessous
- **création** : il n'y a pas encore de `product.md`
- **challenge** : l'utilisateur veut remettre en question son produit ou son positionnement

En **création** et en **challenge**, lis `project/product.md` et `project/market.md` s'ils existent, ainsi que le README du dépôt. La **nature** du projet t'est transmise par `setup`, ou se lit dans `product.md` ; si tu ne la connais pas, demande-la avant tout. **Lis ensuite `references/full-process.md`** et suis-le.

---

## Amendement

1. Lis `project/product.md`, `project/market.md` s'il existe, et la feature transmise.
2. Si la feature tient dans le périmètre, le public et le positionnement actuels, dis-le à `spec` et n'écris rien.
3. Propose l'amendement **minimal** de `product.md`, et de `market.md` si le positionnement est touché. Ne fais de veille que si la feature ouvre un public nouveau : vérifie alors ce qui existe déjà pour lui, sources datées.
4. Soumets-le en **une seule** question `AskUserQuestion`, ta recommandation en premier, avec l'option de refuser.
5. Accepté : modifie les fichiers au plus près, et ajoute une entrée à `decisions.md` dont la raison cite la feature. Refusé : n'écris rien.
6. Rends la main à `spec` : périmètre amendé, ou feature hors périmètre.

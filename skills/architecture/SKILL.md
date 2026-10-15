---
name: architecture
description: Définit, challenge ou amende l'architecture d'un projet à partir de son produit et de sa stack : les apps, la stratégie de dépôt, le découpage du front et du back, les modules, l'emplacement du contrat partagé et la communication entre apps. Se déclenche quand `setup` arrive à l'architecture, quand l'utilisateur veut challenger ou faire évoluer l'architecture, ou quand `spec` ou l'orchestrateur rencontrent un module ou une app que l'architecture ne prévoit pas. Écrit `project/architecture.md`.
metadata:
  moukie-badge: "project"
  moukie-icon: "building"
  moukie-rank: "4"
  moukie-summary: "Apps, dépôt, découpage du front et du back, modules, contrat."
  moukie-produces: "Crée architecture.md"
---

# Skill Architecture

## Règles

Échange et écris dans la **langue du projet**, transmise par `setup` ou notée dans le `CLAUDE.md`. Traduis les titres des gabarits dans cette langue.

Ce skill est le seul à écrire `project/architecture.md`. Les agents rangent le code là où il le prévoit, et le `reviewer` le confronte au code.

**La frontière avec `stack`** : la stack dit **avec quoi** (langages, frameworks, bibliothèques, versions), l'architecture dit **comment c'est organisé** (apps, dépôt, découpage, modules, contrat, communication). Si une question relève de la stack, renvoie vers `stack`.

Tu proposes, l'utilisateur tranche. Lis `project/decisions.md` avant de proposer quoi que ce soit : un choix consigné ne se rouvre qu'avec un **élément nouveau** (une app ajoutée, un module devenu trop gros, un changement de stack). Consigne chaque arbitrage à la fin de ce fichier, en le créant s'il manque : un titre `## AAAA-MM-JJ · <sujet>`, puis trois puces, **Choix**, **Écartés** et **Raison**.

---

## Mode

- **amendement** : `spec` ou l'orchestrateur t'appellent avec un besoin que l'architecture ne prévoit pas (un module, une app, une communication). Suis le chemin court ci-dessous
- **création** : il n'y a pas encore d'`architecture.md`
- **challenge** : l'utilisateur veut remettre en cause tout ou partie de l'architecture

En **création** et en **challenge**, `project/product.md` et `project/stack.md` doivent exister : s'il en manque un, arrête-toi et renvoie vers le skill `product` ou `stack`. Lis-les, avec `architecture.md` s'il existe et l'arborescence du code déjà présent, puis **lis `references/full-process.md`** et suis-le.

---

## Amendement

1. Lis `project/architecture.md` et `project/decisions.md`. Ne relis `product.md` et `stack.md` que si le besoin les touche.
2. Si l'architecture couvre déjà le besoin (un module existant l'accueille, un emplacement le prévoit), dis-le à l'appelant et n'écris rien.
3. Propose le changement **minimal** : un module (son nom, sa responsabilité, son API publique), une app, ou une communication entre apps. Si le besoin change la stratégie de dépôt, comme une deuxième app dans un dépôt simple, ce n'est plus un amendement : dis-le à l'appelant, et passe en challenge sur ce point.
4. Soumets-le en **une seule** question `AskUserQuestion`, ta recommandation en premier, avec l'option de refuser.
5. Accepté : modifie `architecture.md` au plus près, sans toucher au reste, et ajoute une entrée à `decisions.md` dont la raison cite la feature ou le besoin. Refusé : n'écris rien.
6. Rends la main à l'appelant : architecture amendée, ou besoin refusé, qui doit alors tenir dans l'architecture existante. Si l'amendement ajoute une app, signale-le : elle sera générée par `scaffold` au démarrage de la story qui en a besoin.

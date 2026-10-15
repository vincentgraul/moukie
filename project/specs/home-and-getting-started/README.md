---
feature: home-and-getting-started
status: validated
---

# Accueil et Getting started

## Contexte
Le site affiche les pages Skills et Agents, mais un développeur qui arrive ne sait ni ce qu'est Moukie, ni comment l'installer : `/fr/` le renvoie directement vers Skills, et l'entrée Getting started de la barre latérale est désactivée.

Le marché l'oriente déjà vers Superpowers (voir `project/market.md`) : l'accueil doit dire dès le premier écran pourquoi choisir Moukie, avec le message de `project/product.md`, et non l'accroche générique « Your IA companion » de la maquette.

Les maquettes des deux pages existent (voir `project/design.md`), sans annotation Dev Mode. Hors des écarts listés dans les stories, elles font foi.

## Objectif et périmètre
Donner au site son point d'entrée et son parcours d'installation, en français et en anglais : l'accueil présente Moukie et mène à Getting started, qui liste les prérequis et les commandes d'installation et de mise à jour, à copier en un clic.

- Dans le périmètre :
  - la page Accueil, à `/fr/` et `/en/`, qui remplace la redirection vers Skills
  - la page Getting started, et l'activation de son entrée dans la barre latérale
  - le logo et le nom « Moukie » de la barre latérale et du menu mobile, qui mènent à l'accueil
  - la copie des commandes, avec un retour visuel
  - la version anglaise des deux pages
- Hors périmètre :
  - la page Workflow map, qui reste désactivée
  - la mise en ligne sur GitHub Pages
  - une installation pas à pas par système d'exploitation, ou l'installation de Claude Code, `gh` ou `glab` eux-mêmes
  - la désinstallation et le dépannage
  - une comparaison détaillée avec les alternatives du marché
  - la mise à jour du README pour l'aligner sur les commandes du site

**Critère de réussite** : depuis l'accueil, un développeur atteint Getting started en un clic et installe Moukie en copiant deux commandes, sans rien retaper.

## Notes techniques
- Les URL, le pré-rendu et les redirections statiques suivent `project/architecture.md`, section « URL ». Les pages vivent dans les slices `home` et `getting-started` prévues par sa section « Front ».
- Les commandes utilisent la CLI `claude plugin`, vérifiée sur Claude Code 2.1.300 : `marketplace add`, `install`, `marketplace update` et `update`. La maquette mêle des commandes slash et une commande de terminal ; la spec les remplace toutes par leur forme de terminal.
- Les noms de la marketplace et du plugin dans les commandes viennent de `.claude-plugin/marketplace.json`, lu au build comme les autres fichiers du plugin.

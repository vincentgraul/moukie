---
feature: skills-et-agents
status: validated
---

# Skills et agents

## Contexte
Un développeur qui découvre Moukie n'a aujourd'hui que le README pour comprendre ce que font ses skills et ses agents. Le site doit les présenter sur deux pages, Skills et Agents, en français et en anglais.

Le produit exige que cette référence suive le plugin version après version, sans qu'on la réécrive à la main. Chaque skill et chaque agent décrit donc lui-même sa carte dans son frontmatter, et le site la lit au build.

Les maquettes des deux pages existent (voir `project/design.md`). Elles ne portent aucune annotation Dev Mode. Les textes des cartes Skills y sont définitifs, ceux de la page Agents sont provisoires.

## Objectif et périmètre
Afficher les skills et les agents du plugin comme dans les maquettes, en français et en anglais, avec la mise en page commune du site : barre latérale et en-tête.

- Dans le périmètre :
  - les métadonnées des skills et des agents dans le plugin, et leur contrôle
  - la page Skills et la page Agents
  - la mise en page commune : barre latérale, en-tête avec le lien GitHub et le sélecteur de langue, menu sur mobile
  - la version anglaise et le contrôle des traductions
  - une grille adaptative au mobile et à la tablette
- Hors périmètre :
  - une page de détail par skill ou agent : les cartes ne sont pas cliquables
  - un filtre ou un tri par badge
  - la mise en ligne sur GitHub Pages
  - les pages Accueil, Getting started et Workflow map, présentes mais désactivées dans la barre latérale
  - l'affichage des skills de connaissance

**Critère de réussite** : un skill ajouté au plugin avec ses métadonnées apparaît sur le site, en français et en anglais, sans qu'on modifie le code du site.

## Notes techniques
- Les clés `moukie-*` du `metadata`, leur contrôle et les URL localisées sont fixés dans `project/architecture.md`, sections « Contenu et traductions » et « URL ».
- Le découpage du code suit `project/architecture.md`, section « Front ». Les briques sont dans `project/stack.md`.
- L'effet de survol des cartes et le comportement mobile ne figurent pas dans les maquettes : ils ont été décidés pendant l'entretien de spec et sont décrits dans les stories.

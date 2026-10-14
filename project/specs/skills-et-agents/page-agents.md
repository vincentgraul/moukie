---
figma: https://www.figma.com/design/Lm9h3j5XNo3oaWfYP4ofVd/Moukie?node-id=89-472
---

# Page Agents

En tant que développeur qui découvre Moukie, je veux voir les agents et ce que chacun fait, afin de comprendre qui code quoi pendant une story.

**Critères d'acceptation :**
- [ ] `/moukie/fr/agents` affiche le titre « Agents », puis l'introduction : « Les agents sont ceux qui codent. Tu ne les appelles jamais : l'orchestrateur les lance pour chaque story, un par app concernée, en parallèle, chacun dans sa propre copie du dépôt. Ils suivent ta stack, ton architecture et le contrat entre les apps, écrivent leurs tests d'abord, et ne mergent jamais rien. »
- [ ] La page affiche une carte par agent du plugin, triées par rang croissant : backend, front-web, front-mobile, reviewer.
- [ ] Chaque carte affiche l'icône Lucide de l'agent, son nom, le libellé de son badge (Lane ou Review), son résumé et, seulement si `moukie-produces` est renseigné, une ligne précédée d'une flèche avec ce qu'il produit.
- [ ] Les cartes ont le même aspect, le même survol et la même absence d'interaction que celles de la page Skills.
- [ ] L'entrée Agents de la barre latérale est cliquable depuis toutes les pages, et mise en évidence sur la page Agents.
- [ ] La grille et le menu mobile suivent les mêmes seuils que la page Skills.
- [ ] La page est pré-rendue : son HTML contient les 4 cartes sans exécuter de JavaScript.
- [ ] L'onglet du navigateur s'intitule « Agents · Moukie » et la page déclare `lang="fr"`.
- [ ] Sur desktop, le rendu correspond à la maquette, à l'exception des textes des cartes, qui viennent du plugin.

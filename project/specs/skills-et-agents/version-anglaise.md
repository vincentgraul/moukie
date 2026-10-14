---
figma: https://www.figma.com/design/Lm9h3j5XNo3oaWfYP4ofVd/Moukie?node-id=81-209
---

# Version anglaise

En tant que développeur anglophone, je veux lire les pages Skills et Agents en anglais, afin de comprendre Moukie sans lire le français.

**Critères d'acceptation :**
- [ ] `/moukie/en/skills` et `/moukie/en/agents` affichent en anglais les titres, les introductions, les entrées de la barre latérale, les libellés de badge (Project, Feature, Story, Lane, Review), les résumés et ce que produit chaque élément.
- [ ] Les pages anglaises déclarent `lang="en"`, et leurs onglets s'intitulent « Skills · Moukie » et « Agents · Moukie ».
- [ ] `/moukie/en/` redirige vers `/moukie/en/skills`.
- [ ] Le déclencheur du sélecteur de langue affiche le drapeau de la langue courante. Le sélecteur propose le français et l'anglais.
- [ ] Choisir l'autre langue mène à la même page dans cette langue : de `/moukie/fr/agents` à `/moukie/en/agents`, et inversement.
- [ ] Chaque skill et agent affiché a sa traduction anglaise versionnée dans le dépôt, avec l'empreinte du texte français qu'elle traduit.
- [ ] `bun run check` échoue en nommant l'élément quand un skill ou un agent affiché n'a pas de traduction anglaise.
- [ ] `bun run check` échoue en nommant l'élément quand son `moukie-summary` ou son `moukie-produces` français a changé depuis sa traduction.
- [ ] `bun run check` passe quand toutes les traductions sont à jour.
- [ ] Chaque cas d'échec de ce contrôle est couvert par un test.
- [ ] Un test end-to-end vérifie qu'aucune chaîne d'interface française ne reste sur les pages anglaises.
- [ ] Les pages anglaises sont pré-rendues, comme les pages françaises.

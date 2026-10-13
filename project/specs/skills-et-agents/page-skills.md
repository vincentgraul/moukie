---
figma: https://www.figma.com/design/Lm9h3j5XNo3oaWfYP4ofVd/Moukie?node-id=81-209
---

# Page Skills

En tant que développeur qui découvre Moukie, je veux voir tous les skills du plugin et leur rôle, afin de comprendre le workflow avant de l'installer.

**Critères d'acceptation :**
- [ ] `/moukie/fr/skills` affiche le titre « Skills », puis l'introduction : « Un skill est une compétence de Moukie. Tu n'as pas besoin de les appeler par leur nom : ils se déclenchent sur ce que tu dis. Tu peux aussi les invoquer directement, avec /moukie:<skill>. »
- [ ] La page affiche une carte par skill du plugin dont le badge n'est pas `knowledge`, soit 9 aujourd'hui.
- [ ] Les cartes sont triées par rang croissant. À rang égal, elles sont départagées par nom.
- [ ] Chaque carte affiche l'icône Lucide du skill, son nom, le libellé de son badge (Projet, Feature ou Story), son résumé et, seulement si `moukie-produces` est renseigné, une ligne précédée d'une flèche avec ce qu'il produit.
- [ ] Les skills `knowledge` n'apparaissent pas.
- [ ] Au survol, la bordure pointillée de la carte devient pleine et une ombre pleine, de la couleur de la bordure, la décale vers le bas et la droite. Elle reprend son aspect au départ du pointeur.
- [ ] Une carte n'est ni un lien ni un élément focalisable, et le curseur reste celui par défaut.
- [ ] La barre latérale affiche le logo, « Moukie », puis les entrées Getting started, Skills, Agents et Workflow map, avec leurs icônes.
- [ ] L'entrée de la page courante est mise en évidence comme dans la maquette.
- [ ] Une entrée dont la page n'existe pas encore est affichée désactivée et n'est pas cliquable : dans cette story, Getting started, Agents et Workflow map.
- [ ] L'en-tête affiche l'icône GitHub, qui ouvre https://github.com/vincentgraul/moukie dans un nouvel onglet, puis un séparateur et le sélecteur de langue au drapeau français.
- [ ] À partir de 1200 px de large, la grille a 3 colonnes. Entre 768 et 1199 px, elle en a 2. En dessous de 768 px, elle en a 1.
- [ ] En dessous de 768 px, la barre latérale est remplacée par un bouton qui ouvre et ferme un menu contenant les mêmes entrées.
- [ ] `/moukie/` et `/moukie/fr/` redirigent vers `/moukie/fr/skills`.
- [ ] La page est pré-rendue : son HTML contient les 9 cartes sans exécuter de JavaScript.
- [ ] L'onglet du navigateur s'intitule « Skills · Moukie » et la page déclare `lang="fr"`.
- [ ] Sur desktop, le rendu correspond à la maquette : polices, tailles, couleurs, bordures pointillées, espacements.
- [ ] Modifier le `moukie-summary` d'un skill dans le plugin change sa carte au build suivant, sans modifier le code du site.

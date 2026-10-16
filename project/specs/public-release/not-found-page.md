---
figma: https://www.figma.com/design/Lm9h3j5XNo3oaWfYP4ofVd/Moukie?node-id=125-365
---

# Page 404

En tant que visiteur qui suit un lien mort, je veux comprendre que la page n'existe pas et revenir au site, afin de ne pas rester bloqué.

**Critères d'acceptation :**
- [ ] Le build produit, pré-rendues, la 404 française à `/moukie/404.html` et l'anglaise à `/moukie/en/404/`. Le serveur statique des tests end-to-end sert la française, avec le statut 404, pour toute URL inconnue sous `/moukie/`, comme GitHub Pages.
- [ ] La 404 française affiche l'en-tête commun (icône GitHub, séparateur, sélecteur de langue), sans barre latérale, puis « 404 », « Page introuvable » et le bouton « Retour à l'accueil », qui mène à `/moukie/fr/`.
- [ ] La 404 anglaise affiche le même en-tête, puis « 404 », « Page not found » et le bouton « Go home », qui mène à `/moukie/en/`.
- [ ] Sur une URL inconnue qui commence par `/moukie/en/`, la 404 française bascule aussitôt vers la 404 anglaise. Sans JavaScript, elle reste en français.
- [ ] Sur chaque 404, le sélecteur de langue mène à l'accueil de l'autre langue.
- [ ] Chaque 404 déclare la langue de sa page et `noindex`, et son onglet s'intitule « Page introuvable · Moukie » ou « Page not found · Moukie ».
- [ ] En dessous de 768 px, le contenu tient dans la largeur, sans défilement horizontal.
- [ ] Sur desktop, le rendu correspond à la maquette : polices, tailles, couleurs, espacements. Seuls les textes de la version française en diffèrent.

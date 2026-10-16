---
figma:
---

# Référencement

En tant que développeur qui cherche un workflow spec-driven pour Claude Code, je veux trouver le site par un moteur de recherche et voir un aperçu lisible quand on m'en partage un lien, afin de découvrir Moukie.

**Critères d'acceptation :**
- [ ] Chaque page, dans chaque langue, déclare une meta description : le message du produit pour l'accueil, l'introduction de la page pour Getting started, Skills et Agents.
- [ ] Chaque page déclare `og:title`, `og:description`, `og:url`, `og:type` et `og:locale` (`fr_FR` ou `en_US`). Le titre et la description reprennent ceux de la page.
- [ ] Chaque page déclare son URL canonique absolue, sous `https://vincentgraul.github.io/moukie/`, avec la barre oblique finale.
- [ ] Chaque page déclare en `hreflang` ses versions `fr` et `en`, et `x-default` vers la version française.
- [ ] Le build produit `/moukie/sitemap.xml`, qui liste toutes les pages des deux langues par leur URL canonique, et seulement elles : ni les redirections, ni les 404.
- [ ] Les pages de redirection déclarent `noindex`, et pour URL canonique celle de la page vers laquelle elles redirigent.
- [ ] Toutes ces métadonnées sont dans le HTML pré-rendu, sans JavaScript.

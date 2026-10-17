---
figma:
---

# Site à la racine de moukie.dev

En tant que développeur qui découvre Moukie, je veux trouver la documentation à une adresse courte, `moukie.dev`, afin de la retenir et de la partager facilement.

**Critères d'acceptation :**
- [ ] Le build pré-rend le site à la racine : `/` redirige vers `/fr/`, chaque page existe à `/fr/<page>/` et `/en/<page>/`, et aucun lien, script, feuille de style ni police du HTML ne pointe sous `/moukie/`.
- [ ] Le build produit la 404 française à `/404.html` et l'anglaise à `/en/404/`. Le serveur statique des tests end-to-end sert la française, avec le statut 404, pour toute URL inconnue. La française bascule vers l'anglaise quand l'URL commence par `/en/`.
- [ ] La navigation fonctionne comme avant sous la nouvelle racine : la barre latérale, le logo, le bouton de l'accueil vers Getting started, le bouton de la 404 et le sélecteur de langue mènent à des URL sans préfixe `/moukie/`.
- [ ] Chaque page déclare son URL canonique, son `og:url` et ses `hreflang` sous `https://moukie.dev/`, avec la barre oblique finale.
- [ ] Le build produit `/sitemap.xml`, qui liste les pages des deux langues par leur URL canonique sous `https://moukie.dev/`.
- [ ] Le build produit `/robots.txt`, qui autorise tous les robots sur tout le site et donne l'URL `https://moukie.dev/sitemap.xml`.
- [ ] `.claude-plugin/plugin.json` déclare `homepage` à `https://moukie.dev/`.

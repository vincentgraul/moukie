---
figma:
---

# Déploiement sur GitHub Pages

En tant que mainteneur du plugin, je veux que le site en ligne suive chaque version du plugin, afin de ne jamais réécrire la documentation à la main.

**Critères d'acceptation :**
- [ ] Un workflow GitHub Actions construit le site et le publie sur GitHub Pages à chaque push sur `main` qui touche `docs/`, `skills/`, `agents/` ou `.claude-plugin/`. Un push qui ne touche que d'autres fichiers ne déclenche rien.
- [ ] Le workflow peut aussi être lancé à la main depuis GitHub, sur `main`.
- [ ] Il ne publie que si `bun run check` et `bun run test` passent. Sinon, il échoue avant la publication, et le site en ligne garde sa version précédente.
- [ ] Deux déploiements ne tournent jamais en même temps : un déploiement lancé pendant qu'un autre tourne attend la fin du premier.
- [ ] Une fois publié, `https://vincentgraul.github.io/moukie/` redirige vers `/moukie/fr/`, et l'accueil, Getting started, Skills et Agents s'affichent dans les deux langues, comme en local.
- [ ] Une URL inconnue sous `https://vincentgraul.github.io/moukie/` affiche la page 404.
- [ ] Le déploiement apparaît dans l'environnement `github-pages` du dépôt, et le résumé du workflow donne l'URL du site.
- [ ] Après le merge d'une PR qui modifie le résumé d'un skill, la page Skills en ligne affiche le nouveau résumé, sans aucune action manuelle.

---
figma:
---

# Vérifications sur chaque PR

En tant que mainteneur du plugin, je veux que chaque PR vérifie le site automatiquement, afin de ne jamais merger une traduction périmée ou un test cassé.

**Critères d'acceptation :**
- [ ] Chaque PR vers `main`, à son ouverture et à chaque nouveau push, lance un workflow GitHub Actions qui exécute `bun run check`, `bun run test` et `bun run test:e2e`.
- [ ] Le workflow apparaît comme un check de la PR. Il échoue dès qu'une des trois commandes échoue, et son journal nomme l'étape en échec.
- [ ] Une traduction anglaise qui ne correspond plus à sa source française fait échouer le check, en nommant le fichier en cause.
- [ ] Un nouveau push sur la même PR annule la vérification encore en cours.
- [ ] Le workflow installe les dépendances telles que le lockfile les fige, et échoue si le lockfile n'est pas à jour.
- [ ] Le workflow ne publie rien et n'utilise aucun secret.

---
figma:
---

# Métadonnées du plugin

En tant que mainteneur du plugin, je veux que chaque skill et chaque agent décrive lui-même sa carte, afin que la documentation suive le plugin sans réécriture.

**Critères d'acceptation :**
- [ ] Les 9 skills affichables portent, dans le `metadata` de leur frontmatter, ces valeurs :

  | Skill | `moukie-badge` | `moukie-icon` | `moukie-rank` | `moukie-summary` | `moukie-produces` |
  |---|---|---|---|---|---|
  | setup | `project` | `rocket` | `1` | Mène l'entretien de départ et configure tout le workflow. | Crée project/ et CLAUDE.md |
  | product | `project` | `target` | `2` | Challenge ton produit, avec une veille sur l'existant. | Crée product.md et market.md |
  | stack | `project` | `layers` | `3` | Confronte la stack au produit, versions et licences vérifiées. | Crée stack.md |
  | architecture | `project` | `building` | `4` | Apps, dépôt, découpage du front et du back, modules, contrat. | Crée architecture.md |
  | scaffold | `project` | `hammer` | `5` | Génère les apps qui manquent, sans toucher au code existant. | |
  | spec | `feature` | `file-text` | `6` | Cadre une feature et la découpe en stories. | Crée project/specs/ |
  | orchestrator | `story` | `clef-treble` | `7` | Une lane par app, en parallèle, jusqu'à la PR. | Appelle contract et pr |
  | contract | `story` | `key-round` | `8` | Gèle l'interface entre les apps avant le travail parallèle. | |
  | pr | `story` | `git-branch` | `9` | Commite, pousse et ouvre la PR. Ne merge jamais. | |

- [ ] Les skills `naming-conventions`, `feature-sliced-design` et `figma-annotations` portent `moukie-badge: knowledge`, et aucune autre clé `moukie-*`.
- [ ] Les 4 agents portent `moukie-badge`, `moukie-icon`, `moukie-rank` et `moukie-summary`, plus `moukie-produces` quand l'agent produit quelque chose. Les valeurs fixées par la maquette : `backend` · `lane` · `server` · `1` ; `front-web` · `lane` · `panel-top` · `2` ; `front-mobile` · `lane` · `smartphone` · `3` ; `reviewer` · `review` · `eye` · `4`.
- [ ] Les résumés et « produits » des agents sont rédigés à partir de leur fichier, dans le ton et la longueur des cartes Skills (une phrase de moins de 70 caractères), et relus dans la PR.
- [ ] Les champs `name` et `description` et le corps de chaque skill et agent sont inchangés.
- [ ] Chargé depuis le dépôt, le plugin expose toujours ses 12 skills et ses 4 agents dans Claude Code.
- [ ] `bun run check` échoue en nommant le fichier fautif quand un skill ou un agent n'a pas de `moukie-badge`.
- [ ] `bun run check` échoue en nommant le fichier et la clé quand un élément qui n'est pas `knowledge` n'a pas de `moukie-summary`, de `moukie-icon` ou de `moukie-rank`.
- [ ] `bun run check` échoue en nommant le fichier et la valeur quand `moukie-badge` n'est pas l'un de `project`, `feature`, `story`, `lane`, `review`, `knowledge`.
- [ ] `bun run check` échoue en nommant le fichier et la valeur quand `moukie-icon` n'est pas une icône Lucide.
- [ ] `bun run check` passe sur le dépôt une fois les métadonnées ajoutées.
- [ ] Chaque cas d'échec de `check` est couvert par un test.

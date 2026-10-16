# Moukie

Ce dépôt contient le plugin Claude Code Moukie (`skills/`, `agents/`, `hooks/`, `.claude-plugin/`) et son site de documentation (`docs/`). Le site lit les fichiers du plugin au build : ils sont sa source de contenu.

Langue du projet : français. Elle couvre les échanges et le Markdown généré (le vault, les specs, le corps des PR) ; les fichiers publics du dépôt, ceux qui s'adressent à ses visiteurs et contributeurs (`README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `CHANGELOG.md`, `SECURITY.md`…) sont en anglais.

## Cadrage

@project/product.md
@project/stack.md

## À lire à la demande

- `project/architecture.md` : avant de créer un module ou de décider où ranger du code
- `project/decisions.md` : avant de remettre en cause un choix structurant
- `project/market.md` : avant de challenger le produit ou de cadrer une feature
- `project/design.md` : avant de travailler sur un écran, ou pour retrouver les maquettes et le design system
- `project/ideas.md` : avant de proposer la suite du projet
- `project/specs/<feature>/<story>.md` : la story en cours, avec le `README.md` de sa feature

## Commandes

Toutes se lancent depuis la racine.

| Rôle | Commande |
|---|---|
| Installer les dépendances | `bun install` |
| Lancer le site en local | `bun run dev` |
| Construire le site | `bun run build` |
| Lancer le linter et le typage | `bun run check` |
| Lancer les tests | `bun run test` |
| Lancer les tests end-to-end | `bun run test:e2e` |
| Vérifier l'architecture | `bun run check:architecture` |

## Workflow

Les skills s'enchaînent ainsi :

1. `setup` : initialisation, déjà faite
2. `spec` : cadre une feature dans `project/specs/<feature>/`
3. `orchestrator` : implémente une story, avec `contract` s'il y a plusieurs apps, une lane par app, puis le `reviewer`
4. `pr` : ouvre la PR

`product`, `stack` et `architecture` se rouvrent pour challenger ou amender le cadrage. `scaffold` génère ce que l'architecture prévoit et qui manque. `next` fait le point et propose la prochaine étape ; `idea` note les idées pour plus tard dans `project/ideas.md`.

Les agents :

- `front-web` : la lane de l'app `docs`
- `reviewer` : relit une story avant la PR, en lecture seule
- `backend` et `front-mobile` : sans objet ici, il n'y a ni back ni app mobile

Les skills de connaissance : `naming-conventions`, `feature-sliced-design` et `figma-annotations`.

## Interdits

- Jamais de commit sur `main` ou `master` : le hook `.githooks/pre-commit` les refuse, et `--no-verify` est proscrit.
- Jamais de merge sur `main`, jamais de merge d'une PR : c'est l'utilisateur qui merge. Les fusions des lanes dans la branche d'une story font partie du travail de l'orchestrateur.
- Pas de commentaires dans le code.
- Commits en conventional commits, en anglais, sans mention de co-auteur.
- Noms en anglais : commits, branches, fichiers, dossiers et code.

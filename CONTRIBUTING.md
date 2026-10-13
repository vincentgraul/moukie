# Contribuer à Moukie

Merci de ton intérêt. Ce dépôt contient deux choses : le **plugin** Claude Code (`skills/`, `agents/`, `hooks/`, `.claude-plugin/`) et son **site de documentation** (`docs/`).

## Installation

Il te faut [Bun](https://bun.sh) 1.x.

```bash
bun install
```

L'installation active aussi le garde-fou git (voir plus bas).

## Commandes

Toutes se lancent depuis la racine du dépôt.

| Rôle | Commande |
|---|---|
| Installer les dépendances | `bun install` |
| Lancer le site en local | `bun run dev` |
| Construire le site | `bun run build` |
| Linter, formatage et typage | `bun run check` |
| Vérifier l'architecture du site | `bun run check:architecture` |
| Lancer les tests | `bun run test` |
| Lancer les tests end-to-end | `bun run test:e2e` |

## Le besoin vit dans `project/`

Le dossier `project/` décrit le projet plutôt que son code : le produit, la stack, l'architecture, les décisions et les specs. Une contribution importante commence par une **spec** dans `project/specs/<feature>/`, discutée avant d'écrire du code. Lis `project/decisions.md` avant de remettre en cause un choix structurant.

## Conventions

- **Nommage** : les conventions du skill `naming-conventions` (`skills/naming-conventions/SKILL.md`). Les fichiers et dossiers sont en kebab-case, les exports sont nommés, jamais par défaut. `bun run check` les fait respecter.
- **Pas de commentaires** dans le code.
- **Commits** : [conventional commits](https://www.conventionalcommits.org/), en anglais.
- **Une branche et une PR par contribution**, ouverte vers `main`. Seul le mainteneur merge.

## Garde-fou : pas de commit sur `main`

Un hook `pre-commit` (`.githooks/pre-commit`) refuse tout commit sur `main` ou `master`. Il s'active tout seul à `bun install`, qui exécute `git config core.hooksPath .githooks`. Crée une branche avant de commiter, et n'utilise jamais `--no-verify`.

## Traductions du site

Le site est en français et en anglais. Le français est la langue source : si tu modifies le `metadata` d'un skill ou d'un agent, mets à jour sa traduction anglaise dans `docs/content/en/`. Un contrôle intégré à `bun run check` doit bloquer les traductions en retard ; il arrive avec les premières stories du site.

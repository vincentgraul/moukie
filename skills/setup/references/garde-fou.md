# Garde-fou : pas de commit sur `main`

Crée `.githooks/pre-commit` avec exactement ce contenu, et rends-le exécutable (`chmod +x`) :

```sh
#!/bin/sh
git rev-parse --verify HEAD >/dev/null 2>&1 || exit 0
branch=$(git branch --show-current)
case "$branch" in
  main|master)
    echo "Commit interdit sur $branch : crée une branche dédiée." >&2
    exit 1
    ;;
esac
```

Il refuse tout commit sur `main` ou `master`, sauf le tout premier d'un dépôt vide. Il s'exécute dans le dépôt où le commit a lieu : il protège aussi les worktrees de l'orchestrateur.

Git n'exécute pas les hooks versionnés tant qu'on ne le lui demande pas. Fais donc lancer `git config core.hooksPath .githooks` à chaque installation des dépendances, par le mécanisme du gestionnaire de paquets. Pour un projet JavaScript, c'est un script `prepare` dans le `package.json` racine :

```json
"prepare": "git config core.hooksPath .githooks || true"
```

Le `|| true` garde l'installation possible là où il n'y a pas de dépôt git, comme dans un build Docker. Si le gestionnaire de paquets n'offre pas de mécanisme de ce genre, ajoute cette commande à la commande d'installation notée dans la section « Commandes » du `CLAUDE.md`.

Lance ensuite l'installation une fois, et vérifie que `git config core.hooksPath` renvoie bien `.githooks`.

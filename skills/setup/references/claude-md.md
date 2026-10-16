# `CLAUDE.md`

C'est le **seul** fichier que Claude Code charge automatiquement. C'est donc un **routeur**, pas une documentation : il ne recopie jamais le contenu de `project/`, il y renvoie. Garde-le **sous 100 lignes**. Écris-le dans la langue du projet. Il contient six sections.

---

## La langue

Une ligne en tête du fichier, que tous les skills lisent :

```markdown
Langue du projet : <langue>
```

Suivie de ce qu'elle couvre : les échanges, et tout le Markdown généré (le vault, les specs, le corps des PR). Ajoute que les fichiers publics du dépôt, ceux qui s'adressent à ses visiteurs et contributeurs (`README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `CHANGELOG.md`, `SECURITY.md`…) sont en anglais, que le projet soit open source ou non.

---

## Le cadrage, importé

Ces fichiers doivent être présents à chaque session : importe-les.

```markdown
@project/product.md
@project/stack.md
```

N'importe ainsi que des fichiers **petits et toujours pertinents** : un import se paie en contexte à chaque session. Si l'un d'eux grossit, remplace son import par un simple renvoi.

---

## Les fichiers à lire à la demande

Pour ceux-là, écris une **instruction de lecture**, pas un import :

- `project/architecture.md` : avant de créer un module ou de décider où ranger du code
- `project/decisions.md` : avant de remettre en cause un choix structurant
- `project/market.md`, s'il existe : avant de challenger le produit ou de cadrer une feature
- `project/design.md`, s'il existe : avant de travailler sur un écran, ou pour retrouver les maquettes et le design system
- `project/ideas.md`, s'il existe : avant de proposer la suite du projet
- `project/specs/<feature>/<story>.md` : la story en cours, avec le `README.md` de sa feature

---

## Les commandes

Une ligne par commande du projet : celles que les agents, l'orchestrateur et le `reviewer` lancent, quelle que soit la stack.

| Rôle | Commande |
|---|---|
| Installer les dépendances | … |
| Lancer l'app en local, une ligne par app | … |
| Lancer le linter | `check` |
| Lancer les tests | … |
| Lancer les tests end-to-end | … |
| Vérifier l'architecture, s'il y a un outil | `check:architecture` |
| Générer les types du contrat, si son format le demande | … |

Écris la commande **réelle** du projet (un script du `package.json`, une cible de `Makefile`, une tâche Gradle…), jamais une commande supposée, et vérifie qu'elle fonctionne. Les commandes créées par `scaffold`, comme la génération des types, en font partie. Une commande sans objet n'a pas de ligne : avec un contrat Standard Schema, par exemple, il n'y a rien à générer.

---

## La table des règles

Une ligne par fichier de `project/rules/`, du domaine vers le fichier, pour qu'un agent sache lequel ouvrir **sans les lire tous** :

| Domaine | Règle |
|---|---|
| Authentification et contrôle d'accès | `project/rules/auth.md` |

Sur un projet neuf, `rules/` est vide : **n'écris pas la table**. Elle apparaît avec la première règle, et se tient ensuite à jour à chaque règle ajoutée.

---

## Le workflow

Les skills et leur enchaînement, les agents et leur rôle, et les interdits : jamais de commit sur `main` ou `master` ni de `--no-verify`, jamais de merge sur `main` ni de merge d'une PR, pas de commentaires dans le code, des commits en conventional commits sans mention de co-auteur, et des noms en anglais : commits, branches, fichiers, dossiers et code.

Écris-les tous : les skills ne les répètent pas, ils comptent sur le `CLAUDE.md`. Les fusions des lanes dans la branche d'une story, elles, font partie du travail de l'orchestrateur.

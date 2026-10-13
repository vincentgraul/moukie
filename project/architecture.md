# Architecture

## Apps
- docs : le site de documentation du plugin, un front web statique pré-rendu, en français et en anglais

## Dépôt
Dépôt simple, partagé avec le plugin qu'il documente.

```text
.
├── .claude-plugin/        plugin et marketplace, publiés depuis ./
├── skills/                skills du plugin
├── agents/                agents du plugin
├── hooks/                 hooks du plugin
├── docs/                  le site
├── project/               le vault
└── package.json           racine minimale : workspace Bun docs/, commandes, garde-fou git
```

Le plugin reste à la racine : la marketplace le publie depuis `./`, et le déplacer casserait les installations existantes. Le `package.json` racine déclare `docs/` comme workspace Bun et expose toutes les commandes du projet.

## Front
Feature-Sliced Design v2.1, couches sous `docs/src/`, alias `@/<couche>/*`.

Les routes de TanStack Start vivent dans `docs/src/app/routes/` (`routesDirectory`). Ce sont des points d'entrée minces : chacune rend une page FSD, rien d'autre.

| Couche | Slices | Rôle |
|---|---|---|
| `app` | `routes/`, `layout/`, `providers/`, `styles/` | routage, mise en page commune (barre latérale et en-tête : lien GitHub, sélecteur de langue), fournisseurs, styles globaux |
| `pages` | `home`, `getting-started`, `skills`, `agents`, `workflow-map` | une page par entrée du site |
| `features` | `switch-language` | changer de langue en conservant la page courante |
| `entities` | `skill`, `agent` | lire au build les fichiers du plugin, exposer leur modèle et leur carte, associer chaque texte à sa traduction anglaise |
| `shared` | `ui`, `config`, `i18n`, `lib` | composition au-dessus d'Empreint, configuration du site (chemin de base, URL du dépôt), branchement de Paraglide, utilitaires |

Pas de couche `widgets`.

## Contenu et traductions
- **Source** : les fichiers du plugin, lus au build, sans appel réseau.
  - skills : `skills/*/SKILL.md`, champs `name`, `description` et `metadata` (`summary`, `produces`)
  - agents : `agents/*.md`, mêmes champs
  - version : `.claude-plugin/plugin.json`
- **Langue source** : le français.
- **Traductions anglaises du contenu du plugin** : `docs/content/en/skills/<nom>.json` et `docs/content/en/agents/<nom>.json`. Chacune conserve l'empreinte du texte français qu'elle traduit.
- **Chaînes d'interface** : `docs/messages/fr.json` et `docs/messages/en.json`, compilées par Paraglide.
- **Contrôle** : la commande `check` échoue si un skill ou un agent n'a pas de `metadata.summary` ou de `metadata.produces`, s'il n'a pas de traduction anglaise, ou si l'empreinte d'une traduction ne correspond plus à sa source.

## Déploiement
- un workflow GitHub Actions construit `docs/` et le publie sur GitHub Pages
- il se déclenche à chaque push sur `main` qui touche `docs/`, `skills/`, `agents/` ou `.claude-plugin/`
- le chemin de base est `/moukie/`, celui de `vincentgraul.github.io/moukie/`

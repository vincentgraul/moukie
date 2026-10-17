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
| `app` | `routes/`, `layout/`, `providers/`, `styles/`, `check/`, `seo/` | routage, mise en page commune (barre latérale et en-tête : lien GitHub, sélecteur de langue), fournisseurs, styles globaux, points d'entrée des contrôles lancés par `check`, qui composent les entités, et référencement : les métadonnées de chaque page (description, Open Graph, URL canonique, hreflang) et la génération au build de `sitemap.xml` à partir de la carte du site, et de `robots.txt`, qui pointe vers lui |
| `pages` | `home`, `getting-started`, `skills`, `agents`, `workflow-map`, `not-found` | une page par entrée du site, et la page 404 |
| `features` | `switch-language` | changer de langue en conservant la page courante |
| `entities` | `plugin-item` | les éléments affichables du plugin, avec deux sources : les skills et les agents. Lire au build leurs fichiers, valider leurs métadonnées, exposer leur modèle et leur carte, associer chaque texte à sa traduction anglaise |
| `shared` | `ui`, `config`, `i18n`, `lib`, `api` | composition au-dessus d'Empreint, configuration du site (chemin de base, URL publique, URL du dépôt), branchement de Paraglide, utilitaires, lecture générique des fichiers du plugin (racine, frontmatter), sans aucune règle métier |

Pas de couche `widgets`.

## Contenu et traductions
- **Source** : les fichiers du plugin, lus au build, sans appel réseau.
  - skills : `skills/*/SKILL.md`, champs `name`, `description` et `metadata`
  - agents : `agents/*.md`, mêmes champs
  - version : `.claude-plugin/plugin.json`
- **Langue source** : le français.
- **Traductions anglaises du contenu du plugin** : `docs/content/en/skills/<nom>.json` et `docs/content/en/agents/<nom>.json`. Chacune conserve l'empreinte du texte français qu'elle traduit.
- **Chaînes d'interface** : `docs/messages/fr.json` et `docs/messages/en.json`, compilées par Paraglide.
- **Clés `metadata`** du frontmatter, préfixées `moukie-` :

  | Clé | Valeur | Obligatoire |
  |---|---|---|
  | `moukie-badge` | `project`, `feature`, `story`, `lane`, `review` ou `knowledge` | toujours |
  | `moukie-summary` | le résumé, en français | sauf `knowledge` |
  | `moukie-produces` | ce que l'élément produit, en français | non |
  | `moukie-icon` | un nom d'icône Lucide | sauf `knowledge` |
  | `moukie-rank` | l'ordre d'affichage dans sa page, un entier en texte | sauf `knowledge` |

  Un élément `knowledge` n'est pas affiché. Les valeurs de badge sont des identifiants : leurs libellés sont des chaînes d'interface traduites.
- **Contrôle** : la commande `check` échoue, en nommant le fichier et la clé, si un skill ou un agent n'a pas de `moukie-badge`, s'il lui manque une clé obligatoire, si son badge ou son icône est inconnu, s'il n'a pas de traduction anglaise, ou si l'empreinte d'une traduction ne correspond plus à sa source.

## URL
- le site est servi à la racine de `https://moukie.dev/` : le chemin de base est `/`
- chaque page existe en `/fr/<page>` et `/en/<page>`
- la racine redirige vers `/fr/`
- `/fr/` et `/en/` sont l'accueil de leur langue
- GitHub Pages ne redirige pas côté serveur : les redirections sont des pages statiques pré-rendues
- la 404 existe dans les deux langues : la française, pré-rendue à `/404.html`, est celle que GitHub Pages sert pour toute URL inconnue ; elle bascule vers l'anglaise, `/en/404/`, quand l'URL commence par `/en/`
- les URL internes se terminent par une barre oblique (`/fr/skills/`), comme les sert GitHub Pages
- la navigation entre pages et entre langues se fait par rechargement complet, sans navigation côté client : les pages naviguent par des liens classiques vers des pages pré-rendues, et le sélecteur de langue déclenche le rechargement de la même page dans l'autre langue

## Déploiement
- un workflow GitHub Actions construit `docs/` et le publie sur GitHub Pages
- il se déclenche à chaque push sur `main` qui touche `docs/`, `skills/`, `agents/` ou `.claude-plugin/`, et à la demande
- il ne publie que si `check` et les tests unitaires passent ; sinon, le site garde sa version précédente
- un second workflow lance `check`, les tests unitaires et les tests end-to-end sur chaque PR
- le site est publié sur le domaine personnalisé `moukie.dev`, déclaré dans les réglages Pages du dépôt, sans fichier `CNAME` : un déploiement par GitHub Actions n'en lit pas. GitHub redirige `vincentgraul.github.io/moukie/` et `www.moukie.dev` vers `moukie.dev`
- le DNS de `moukie.dev` est chez OVH, hors du dépôt

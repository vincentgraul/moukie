# Decisions

## 2026-10-13 · Positionnement
- **Choix** : « de la maquette Figma à la PR, multi-app, en solo » : le front et le back codés en parallèle contre un contrat partagé.
- **Écartés** : compagnon francophone, accroche généraliste « Your IA companion ».
- **Raison** : le cœur de cible, le dev solo, est déjà orienté vers Superpowers. Seul cet angle n'est couvert par aucune alternative relevée.

## 2026-10-13 · Licence
- **Choix** : `MIT`, pour tout le dépôt, plugin et site.
- **Écartés** : `Apache-2.0`, `GPL-3.0-or-later`.
- **Raison** : maximiser l'adoption. C'est la licence la plus courante dans l'écosystème des plugins Claude Code.

## 2026-10-13 · Langues
- **Choix** : français et anglais dès le lancement.
- **Écartés** : français seul, français d'abord puis anglais plus tard.
- **Raison** : la plupart des utilisateurs de Claude Code lisent l'anglais. Un site seulement en français plafonnerait les installations.

## 2026-10-13 · Périmètre du site
- **Choix** : Accueil, Getting started, Skills, Agents, Workflow map.
- **Écartés** : la recherche, la doc versionnée, le changelog, un exemple de bout en bout, les pages pour contributeurs, la mesure d'audience.
- **Raison** : peu de skills et d'agents, donc pas besoin de recherche. La doc reflète toujours la version courante, ce qui rend le changelog et les versions superflus.

## 2026-10-13 · Source de la référence
- **Choix** : les pages Skills et Agents sont tirées des fichiers du plugin, pas réécrites à la main.
- **Écartés** : une référence rédigée et maintenue à côté du plugin.
- **Raison** : avec un seul mainteneur, une doc écrite à la main dérive, comme le README l'a déjà fait. Les maquettes en montrent déjà les symptômes : textes copiés d'une carte à l'autre, skills manquants.

## 2026-10-13 · Framework du site
- **Choix** : TanStack Start 1 en pré-rendu statique, avec React 19, TanStack Router et Vite.
- **Écartés** : Astro 7 avec des îlots React.
- **Raison** : le contenu public demande du HTML pré-rendu, et les deux le permettent. TanStack Start garde la stack par défaut de Moukie, se branche nativement sur Empreint, qui est en React, et suit l'architecture FSD des agents. Le site sert aussi de dogfooding du plugin.

## 2026-10-13 · Hébergement
- **Choix** : GitHub Pages, déployé par GitHub Actions.
- **Écartés** : Cloudflare Pages, Vercel.
- **Raison** : gratuit pour un dépôt public, sur la même forge, sans service tiers à maintenir pour un site purement statique.

## 2026-10-13 · Internationalisation
- **Choix** : Paraglide JS 2, avec des URL localisées.
- **Écartés** : react-i18next.
- **Raison** : traductions compilées et typées, et un exemple officiel avec TanStack Start.

## 2026-10-13 · Traduction de la référence
- **Choix** : Claude traduit en anglais dans la PR qui modifie la source française. La traduction est versionnée avec l'empreinte du texte source, et `check` échoue si elle n'est plus à jour.
- **Écartés** : la traduction au build par l'API Claude, un plugin bilingue à la source.
- **Raison** : l'anglais ne peut jamais être en retard, il est relu dans la PR, et ça ne coûte ni clé d'API ni appel payant en CI.

## 2026-10-13 · Préférences par défaut écartées
- **Choix** : pas de Turborepo, de Docker, de back (Hono, Better Auth, Kysely, PostgreSQL, Scalar), de contrat entre apps (Zod), de TanStack Form ni de TanStack Query, ni de Storybook.
- **Écartés** : les préférences par défaut de Moukie pour ces briques.
- **Raison** : une seule app statique, sans serveur, sans formulaire ni API. Les composants viennent d'Empreint, qui a son propre Storybook.

## 2026-10-13 · Préférences par défaut confirmées
- **Choix** : TypeScript, Bun, Biome, GitHub et `gh`, GitHub Actions, React, Empreint, TanStack Router, Vite, Lucide React, Vitest, Playwright.
- **Écartés** : aucun.
- **Raison** : elles couvrent les besoins du site. Les versions et licences ont été vérifiées sur npm le 2026-10-13, et toutes sont compatibles avec MIT (MIT, Apache-2.0, ISC).

## 2026-10-13 · Bibliothèque de la Workflow map
- **Choix** : reportée à la spec de la page Workflow map.
- **Écartés** : aucun pour l'instant.
- **Raison** : la page est encore vide dans les maquettes, et la forme du diagramme décidera de la bibliothèque.

## 2026-10-13 · Stratégie de dépôt
- **Choix** : un dépôt simple partagé avec le plugin. Le plugin reste à la racine, le site va dans `docs/`, et un `package.json` racine minimal déclare le workspace Bun, porte les commandes et active le garde-fou git.
- **Écartés** : `docs/` autonome sans `package.json` racine, le plugin déplacé dans `plugin/` en monorepo.
- **Raison** : la marketplace publie le plugin depuis `./`, et le déplacer casserait les installations existantes. Les commandes se lancent toutes depuis la racine. En contrepartie, les sources de `docs/` sont copiées dans le cache des utilisateurs du plugin, ce qui est négligeable.

## 2026-10-13 · Dossier du site
- **Choix** : `docs/`.
- **Écartés** : `site/`.
- **Raison** : le site est la seule documentation du projet. Le déploiement passe par GitHub Actions, donc le nom du dossier n'a aucun effet sur Pages. La sortie actuelle du skill `workflow-map` (`docs/workflow-map.*`) cohabitera, ou sera revue lors de la spec de la page Workflow map.

## 2026-10-13 · Source des textes des cartes
- **Choix** : chaque skill et chaque agent porte `summary` et `produces` dans le champ `metadata` de son frontmatter.
- **Écartés** : des résumés rédigés dans le site, ou le champ `description` affiché tel quel.
- **Raison** : une seule source, à côté de ce qu'elle décrit, et `metadata` est prévu par la spécification Agent Skills. Le champ `description` est rédigé pour déclencher le skill, pas pour le lecteur. Reste à vérifier dans une story que Claude Code tolère ce champ dans les fichiers d'agents.

## 2026-10-13 · Routes et Feature-Sliced Design
- **Choix** : les routes TanStack Start vont dans `docs/src/app/routes/`, en points d'entrée minces qui rendent les pages FSD. Pas de couche `widgets` : la barre latérale et l'en-tête vont dans `app/layout/`.
- **Écartés** : `src/routes/` à la racine de `src`, hors des couches.
- **Raison** : tout le code reste dans une couche FSD reconnue par `steiger`, et la mise en page commune relève de la couche `app`.

## 2026-10-13 · Données de la Workflow map
- **Choix** : à trancher lors de la spec de la page Workflow map. Piste : `docs/workflow-map.json`, déjà produit par le skill `workflow-map`.
- **Écartés** : aucun pour l'instant.
- **Raison** : la page est encore vide dans les maquettes.

## 2026-10-13 · Maquettes et design system
- **Choix** : les maquettes Figma du fichier « Moukie » font référence pour l'interface. Le design system est la bibliothèque Empreint, sans fichier Figma dédié.
- **Écartés** : un design system Figma.
- **Raison** : les composants existent déjà dans Empreint, qu'utilise le site.

## 2026-10-13 · Clés metadata et URL localisées
- **Choix** : les clés `metadata` sont préfixées `moukie-` : `moukie-badge` (y compris `knowledge` pour les skills non affichés), `moukie-summary`, `moukie-produces`, `moukie-icon` et `moukie-rank`. Les URL sont `/fr/<page>` et `/en/<page>`, la racine redirige vers `/fr/`, et les redirections sont des pages statiques.
- **Écartés** : des clés sans préfixe ; l'exclusion des skills de connaissance par une simple absence de `metadata` ; le français sans préfixe d'URL.
- **Raison** : demandé par la feature `skills-et-agents`. Il faut afficher un badge, une icône et un ordre sur chaque carte, et masquer les skills de connaissance. La spec Agent Skills recommande des clés distinctives. Un badge `knowledge` explicite permet à `check` de distinguer un skill masqué volontairement d'un oubli. Cette entrée amende « Source des textes des cartes ».

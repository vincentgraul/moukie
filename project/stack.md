# Stack

## Commun
- langage : TypeScript 7
- runtime et gestionnaire de paquets : Bun 1
- linter et formatter : Biome 2
- forge : GitHub, et sa CLI `gh`
- CI/CD : GitHub Actions

## Front web
- bibliothèque : React 19
- framework : TanStack Start 1, en pré-rendu statique
- routeur : TanStack Router 1
- outil de build : Vite 8
- composants : Empreint (`@empreint/ui` 1)
- icônes : Lucide React 1
- police : Geist, auto-hébergée par Fontsource (`@fontsource-variable/geist` 5)
- internationalisation : Paraglide JS 2, français et anglais
- tests : Vitest 5, Playwright 1

## Hébergement
- site statique : GitHub Pages, déployé par GitHub Actions

## Traduction
- langue source : le français, celle des fichiers du plugin
- l'anglais est traduit par Claude dans la PR qui modifie la source, puis versionné avec l'empreinte du texte source
- la commande `check` échoue si une traduction anglaise ne correspond plus à sa source française

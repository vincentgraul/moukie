# Préférences par défaut

Ce sont les préférences de Moukie. C'est ton **point de départ** : une hypothèse à confronter au produit et à la veille, pas une liste à recopier.

## Commun
- langage : `TypeScript`
- runtime et gestionnaire de paquets : `Bun`
- linter et formatter : `Biome`
- monorepo : `Turborepo`
- forge : `GitHub`, et sa CLI `gh`
- CI/CD : `GitHub Actions`
- conteneurisation : `Docker`

## Front web
- bibliothèques : `React`, `Empreint`, `TanStack Router`, `TanStack Form`, `TanStack Query`
- outil de build : `Vite`
- tests : `Vitest`, `Playwright`
- documentation : `Storybook`
- icônes : `Lucide React`

## Front mobile
- bibliothèques : `React Native`
- icônes : `Lucide React Native`

## Back
- framework : `Hono`
- validation : `Zod`
- authentification : `Better Auth`
- ORM : `Kysely`
- base de données : `PostgreSQL`
- documentation : `Scalar`
- tests : `Vitest`

## E-commerce
- plateforme : `Shopify`

## Contrat entre apps
- format : `Standard Schema`, avec `Zod`, quand toutes les apps sont en TypeScript

Le **format du contrat** découle des apps retenues : Standard Schema quand toutes sont en TypeScript, avec la bibliothèque de schémas retenue (Zod par défaut), OpenAPI dès qu'une API REST sert une app hors TypeScript (iOS, Android, Flutter, back dans un autre langage), GraphQL pour une API GraphQL. Le skill `contract` documente les trois. Pour OpenAPI et GraphQL, retiens aussi le générateur de types de chaque app.

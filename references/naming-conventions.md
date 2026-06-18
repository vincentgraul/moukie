# Conventions de nommage

Source **canonique** des conventions de nommage de fichiers et de symboles, livrée avec le plugin `claude-workflow`.

**Comment c'est utilisé :**
- Le skill `scaffold` reprend ce fichier, l'**adapte à la stack retenue** pour le projet, et le matérialise côté projet (`docs/naming-conventions.md`, référencé depuis le `CLAUDE.md`) — pour que les agents writers, qui lisent les fichiers du projet, puissent s'y conformer.
- Les agents `front-web`, `front-mobile`, `backend` codent en respectant ces conventions ; l'agent `reviewer` les vérifie.

**Lintable vs guidé :** ce qui est *lintable* (casing des fichiers, des variables, des types) est **imposé par Biome** (`useFilenamingConvention`, `useNamingConvention`) — déterministe, pas négociable. Ce fichier couvre le reste (où ranger un fichier, suffixes sémantiques, nommage des endpoints) que le lint ne sait pas exprimer.

> ⚠️ Valeurs par défaut proposées — **à ajuster** aux conventions réelles avant usage.

---

## Universel (tous projets)

| Élément | Convention | Exemple |
|---|---|---|
| Dossier | kebab-case | `user-profile/` |
| Fichier | kebab-case | `cart-api.ts` |
| Variable / fonction | camelCase | `getUserById` |
| Type / interface | PascalCase | `UserProfile` |
| Constante de module | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Boolean | préfixe `is`/`has`/`should` | `isLoading`, `hasAccess` |
| Export | **named export** préféré (pas de `default`) | `export const ...` |
| Test | colocalisé, `*.test.ts(x)` | `cart-api.test.ts` |

---

## Front — React (web)

| Élément | Convention | Exemple |
|---|---|---|
| Composant | PascalCase, **1 par fichier** | `UserCard` |
| Fichier de composant | kebab-case (nom du composant) | `user-card.tsx` |
| Props | `<Composant>Props` | `UserCardProps` |
| Hook | `use` + camelCase | `useCart` |
| Fichier de hook | kebab-case | `use-cart.ts` |
| Contexte | `<Nom>Context` | `AuthContext` |
| Page / route | kebab-case | `checkout-success.tsx` |
| Composant issu d'Empreint | `Empreint` + PascalCase (nom du composant) | `<EmpreintButton>` |

---

## Front — React Native (mobile)

Mêmes règles que React web, plus :

| Élément | Convention | Exemple |
|---|---|---|
| Écran | suffixe `Screen` | `CartScreen` |
| Fichier d'écran | kebab-case | `cart-screen.tsx` |
| Navigateur | suffixe `Navigator` | `RootNavigator` |

---

## Back — Hono

| Élément | Convention | Exemple |
|---|---|---|
| Fichier de routes | kebab-case, ressource au **pluriel** | `routes/users.ts` |
| Handler | suffixe `*.handler.ts` | `login.handler.ts` |
| Service / logique métier | suffixe `*.service.ts` | `user.service.ts` |
| Repository | suffixe `*.repository.ts` | `user.repository.ts` |
| Middleware | suffixe `*.middleware.ts` | `auth.middleware.ts` |
| Schéma zod | suffixe `*.schema.ts` | `user.schema.ts` |
| Route HTTP | kebab-case, pluriel | `/users/:id/cart-items` |

---

## Contrat partagé (front ↔ back)

| Élément | Convention | Exemple |
|---|---|---|
| Schéma requête | `<Action>Request` | `LoginRequest` |
| Schéma réponse | `<Action>Response` | `LoginResponse` |
| Type inféré | `z.infer` exporté, même nom | `type LoginRequest = z.infer<...>` |

---
name: naming-conventions
description: Fait appliquer les conventions de nommage des fichiers et des symboles. Les conventions officielles du langage et du framework retenus par la stack font foi ; ce skill les complète seulement là où elles se taisent, notamment en JavaScript et TypeScript. Se déclenche dès qu'on crée, nomme ou renomme un fichier ou un symbole, et quand le `reviewer` contrôle les conventions.
---

# Skill Naming conventions

## Règles

Les **conventions officielles du langage et du framework** retenus par `project/stack.md` font foi : les Swift API Design Guidelines, les Kotlin coding conventions, Effective Dart, PEP 8, et ainsi de suite. Ce skill ne les recopie pas : il les fait appliquer.

Il ne fixe que ce que le langage laisse ouvert. Les sections ci-dessous ne s'appliquent que si la stack retient la technologie qu'elles nomment.

Ces compléments vivent dans le plugin et ne sont jamais recopiés dans un projet : une correction ici profite à tous les projets d'un coup.

---

## Tous langages

| Élément | Convention | Exemple |
|---|---|---|
| Booléen | préfixe qui se lit comme une question (`is`, `has`, `should`, ou l'équivalent du langage) | `isLoading`, `hasAccess` |
| Test | colocalisé avec ce qu'il teste, sauf si le langage ou le framework imposent un autre emplacement | `cart-api.test.ts` |

---

## JavaScript et TypeScript

TypeScript ne fixe ni le nommage des fichiers ni la forme des exports. Ce qui fait foi :

| Élément | Convention | Exemple |
|---|---|---|
| Dossier | kebab-case | `user-profile/` |
| Fichier | kebab-case | `cart-api.ts` |
| Variable, fonction | camelCase | `getUserById` |
| Type, interface | PascalCase | `UserProfile` |
| Constante de module | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Export | **named export**, jamais de `default` | `export const …` |
| Test | `*.test.ts(x)` | `cart-api.test.ts` |

### Si le front est en React

| Élément | Convention | Exemple |
|---|---|---|
| Composant | PascalCase, **un par fichier** | `UserCard` |
| Fichier de composant | kebab-case, du nom du composant | `user-card.tsx` |
| Props | `<Composant>Props` | `UserCardProps` |
| Hook | `use` + camelCase | `useCart` |
| Fichier de hook | kebab-case | `use-cart.ts` |
| Contexte | `<Nom>Context` | `AuthContext` |
| Page, route | kebab-case | `checkout-success.tsx` |
| Composant issu du design system | préfixe du design system + PascalCase | `<EmpreintButton>` avec Empreint |

### Si le mobile est en React Native

Les règles de React, plus :

| Élément | Convention | Exemple |
|---|---|---|
| Écran | suffixe `Screen` | `CartScreen` |
| Fichier d'écran | kebab-case | `cart-screen.tsx` |
| Navigateur | suffixe `Navigator` | `RootNavigator` |

### Si le back est en TypeScript

Le suffixe dit le rôle du fichier dans sa slice, quand l'architecture la découpe ainsi :

| Élément | Convention | Exemple |
|---|---|---|
| Fichier de routes | kebab-case, ressource au **pluriel** | `routes/users.ts` |
| Handler | `*.handler.ts` | `login.handler.ts` |
| Service, logique métier | `*.service.ts` | `user.service.ts` |
| Repository | `*.repository.ts` | `user.repository.ts` |
| Middleware | `*.middleware.ts` | `auth.middleware.ts` |
| Schéma | `*.schema.ts` | `user.schema.ts` |

---

## Contrat entre apps

Quel que soit son format :

| Élément | Convention | Exemple |
|---|---|---|
| Route HTTP | kebab-case, ressource au **pluriel** | `/users/:id/cart-items` |
| Schéma de requête | `<Action>Request` | `LoginRequest` |
| Schéma de réponse | `<Action>Response` | `LoginResponse` |
| Type tiré du contrat | même nom que son schéma | `type LoginRequest = z.infer<typeof LoginRequest>` avec zod |

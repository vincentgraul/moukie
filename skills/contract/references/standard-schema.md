# Contrat en Standard Schema

Pour des apps toutes en TypeScript. Le contrat s'écrit avec une bibliothèque de schémas compatible **Standard Schema** : Zod par défaut, ou Valibot, ArkType… La bibliothèque est un choix de stack, dans `stack.md`. Les exemples ci-dessous sont en Zod : avec une autre bibliothèque, applique-les avec ses équivalents.

Une seule définition donne à la fois les types, à la compilation, des deux côtés, et la validation à l'exécution : le back valide ce qu'il reçoit, le front valide ce qu'il reçoit en réponse.

---

## La source

Le contrat vit à l'emplacement que fixe `architecture.md`, dans un module importé à l'identique par chaque app, jamais copié.

Pour chaque échange :

- un schéma de **requête** et un schéma de **réponse**, nommés `<Action>Request` et `<Action>Response`
- les **erreurs** attendues, chacune avec son code et la forme de son corps
- la **route** et la **méthode**, exportées comme constantes pour qu'aucune app ne les réécrive à la main

---

## Les types

Chaque schéma exporte son type, du même nom, par inférence. Avec Zod :

```ts
export const LoginRequest = z.object({ email: z.string().email(), password: z.string().min(8) });
export type LoginRequest = z.infer<typeof LoginRequest>;
```

Aucune génération n'est nécessaire : les apps importent le module.

---

## La validation

- le back valide chaque requête entrante contre son schéma, avant toute logique
- le front valide chaque réponse contre son schéma, plutôt que de lui faire confiance

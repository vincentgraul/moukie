# Contrat en OpenAPI

Le fichier OpenAPI est la source, et **chaque app génère ses types** à partir de lui.

---

## La source

Un fichier OpenAPI 3, en YAML, à l'emplacement que fixe `architecture.md`. Pour chaque opération :

- le **chemin** et la **méthode**, et un `operationId` explicite : c'est lui qui nomme les fonctions générées
- le schéma du **corps de la requête** et celui de chaque **réponse**, erreurs comprises, rangés dans `components/schemas` et nommés `<Action>Request` et `<Action>Response`
- les **codes d'erreur** attendus, chacun avec la forme de son corps

Valide le fichier avec un linter OpenAPI (Spectral ou Redocly, par exemple) avant de le geler : une spec invalide produit des types faux dans toutes les apps à la fois.

---

## Les types

Chaque app génère ses types, et au besoin son client, avec le générateur que `stack.md` retient pour son langage, comme openapi-typescript pour TypeScript ou openapi-generator pour Swift, Kotlin et Dart.

Le code généré n'est **jamais retouché à la main** : il se régénère par la commande notée dans la section « Commandes » du `CLAUDE.md`.

---

## La validation

- le back valide chaque requête contre la spec, avec ce que son framework prévoit pour OpenAPI
- les apps clientes s'appuient sur les types générés : une réponse qui ne correspond plus à la spec doit casser à la compilation, pas en production

# Contrat en GraphQL

Pour une API GraphQL. Deux cas, qui ne se gèlent pas de la même façon.

---

## Ton API

Le **schéma GraphQL** (SDL) est la source, à l'emplacement que fixe `architecture.md`.

- chaque type et chaque opération (query, mutation) que la story ajoute ou modifie, avec ses arguments et sa réponse
- les **erreurs attendues** typées dans le schéma, par une union de résultats, plutôt que laissées aux seules erreurs génériques de GraphQL

Les apps clientes écrivent leurs opérations, et génèrent leurs types depuis le schéma et ces opérations, avec GraphQL Code Generator ou l'équivalent de leur langage, par la commande notée dans la section « Commandes » du `CLAUDE.md`, que le skill `scaffold` a mise en place en installant le générateur. Le gel porte sur le schéma.

---

## L'API d'un service tiers, comme Shopify

Le schéma ne t'appartient pas : tu ne le gèles pas, tu ne le modifies pas. Le contrat porte alors sur :

- la **version d'API** utilisée, fixée dans `stack.md` et jamais laissée à « la dernière »
- les **opérations** que tes apps envoient, écrites dans le dépôt

Les types se génèrent depuis le schéma du service, à la version fixée. Changer de version est une évolution contrôlée du contrat, avec régénération des types dans chaque app.

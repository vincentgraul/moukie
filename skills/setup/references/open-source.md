# Projet open source

Un projet libre s'adresse à des inconnus : il lui faut ce qu'ils s'attendent à trouver.

- **`LICENSE`** : la licence choisie avec le skill `product`, consignée dans `decisions.md` avec son identifiant SPDX (`MIT`, `Apache-2.0`, `GPL-3.0-or-later`…). N'écris **jamais** un texte de licence de mémoire : une variante approximative n'est plus la licence qu'on croit appliquer. Récupère le texte officiel dans la liste SPDX : `https://raw.githubusercontent.com/spdx/license-list-data/main/text/<identifiant>.txt`. Pour MIT, remplace `<year>` et `<copyright holders>`. Les autres licences se versionnent **telles quelles** : les espaces réservés de leurs annexes, chez Apache comme chez les GPL, sont des modèles d'en-tête pour les fichiers source, pas des champs à remplir
- **`README.md`** : écrit pour les **utilisateurs**, pas pour l'équipe. Ce que fait le projet et pour qui, d'après `product.md`, l'installation, un premier exemple d'usage, un lien vers `CONTRIBUTING.md` et la licence. S'il existe déjà, modifie-le au plus près
- **`CONTRIBUTING.md`** : l'installation et les commandes du projet, les conventions de nommage, les conventional commits, une branche et une PR par contribution. Signale le garde-fou : les commits sur `main` sont refusés, et il s'active tout seul à l'installation des dépendances. Explique aussi que le besoin vit dans `project/specs/` : une contribution importante commence par une spec
- **`CODE_OF_CONDUCT.md`** : propose-le. S'il est retenu, récupère le texte officiel du Contributor Covenant plutôt que de l'écrire de mémoire

Vérifie enfin la visibilité du dépôt avec la CLI de la forge (`gh repo view --json visibility` sur GitHub). S'il est privé, signale-le, mais **ne le rends pas public toi-même** : c'est la décision de l'utilisateur, et elle ne se rattrape pas.

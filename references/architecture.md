# Architecture projet

Source **canonique** de l'architecture du projet.
Le skill `scaffold` met en place l'architecture, l'adapte, et la matérialise dans le projet (`docs/architecture.md`) pour que les agents et les skills puissent s'y conformer.

---

## Stratégie de dépôt 

Un projet contenant deux apps ou plus (ex: front et back) sera en **monorepo**. Sinon il sera en repo simple.

---

## Architecture Front (web & mobile)

L'architecture front suit **Feature-Sliced Design v2.1**.
Le skill `feature-sliced-design` (embarqué dans le plugin) **fait foi**.

---

## Architecture Back

L'architecture back suit **Modular Monolith et Vertical Slice** :

- **Vertical Slice** : le code est organisé par feature (chaque slice contient sa route, sa logique et son accès données), pas par couche technique
- **Modular Monolith** : les slices sont regroupées en modules (bounded contexts) qui communiquent via leur API publique
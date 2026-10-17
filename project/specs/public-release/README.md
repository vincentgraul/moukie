---
feature: public-release
status: validated
---

# Mise en ligne publique

## Contexte
Le site se construit et se pré-rend sous `/moukie/`, mais il n'a jamais été déployé : le dépôt n'a aucun workflow GitHub Actions, GitHub Pages n'y est pas activé, et aucune PR n'a de vérification automatique. Le contrôle des traductions de `check` ne joue donc que si quelqu'un le lance.

L'hébergement retenu (voir `project/decisions.md`) suppose un dépôt public : GitHub Pages y est gratuit, et les commandes d'installation de Getting started ne marchent que depuis un dépôt public. Le dépôt l'est désormais.

Le mainteneur a depuis acquis `moukie.dev` : Pages est activé avec GitHub Actions pour source, le domaine est vérifié sur le compte GitHub et déclaré dans les réglages Pages du dépôt, et son DNS chez OVH pointe vers GitHub Pages. Les stories déjà livrées l'ont été sous `/moukie/`.

Seule la 404 a une maquette (voir `project/design.md`) : hors des écarts listés dans sa story, elle fait foi.

## Objectif et périmètre
Mettre le site en ligne à `https://moukie.dev/`, le tenir à jour à chaque version du plugin sans geste manuel, et le rendre trouvable.

- Dans le périmètre :
  - le déploiement sur GitHub Pages, à chaque push concerné sur `main` et à la demande
  - les vérifications automatiques sur chaque PR
  - une page 404 en français et en anglais
  - le référencement : description, Open Graph sans image, URL canonique, hreflang, `sitemap.xml` et `robots.txt`
  - le site à la racine du domaine `moukie.dev`, et ce domaine comme page d'accueil du plugin
- Hors périmètre :
  - la preview en ligne par PR, qui reste dans `project/ideas.md`
  - une image d'aperçu Open Graph, faute de maquette
  - la soumission du sitemap aux moteurs de recherche
  - le passage du dépôt en public, l'activation de Pages, le DNS de `moukie.dev` et l'activation du HTTPS, faits à la main par le mainteneur
  - la mise à jour du README

**Critère de réussite** : après le merge d'une PR qui modifie un skill, le site en ligne affiche le changement en quelques minutes, sans aucune action manuelle.

## Notes techniques
- La 404, le référencement, les URL et les workflows suivent `project/architecture.md`, sections « Front », « URL » et « Déploiement ».
- Ordre des stories : `pull-request-checks`, pour que les PR suivantes soient vérifiées, puis `not-found-page`, `seo-metadata`, `custom-domain`, et `pages-deployment` en dernier.
- **Prérequis de `pages-deployment`** : le dépôt est public, Pages est activé avec GitHub Actions pour source, et `moukie.dev` est déclaré comme domaine personnalisé. C'est fait.
- Après le premier déploiement, une fois le certificat émis, le mainteneur coche *Enforce HTTPS* dans les réglages Pages du dépôt.

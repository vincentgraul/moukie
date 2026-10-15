# Création, challenge et mise à jour

Ce fichier sert en **création**, en **challenge** et en **mise à jour**. Un amendement suit le chemin court du `SKILL.md` et n'en a pas besoin.

Pars des préférences de `references/preferences.md`.

---

## Besoins techniques

Traduis le produit en besoins techniques : ce sont eux, pas les préférences, qui pilotent les choix.

Ne pose jamais de question ouverte sur ce qui s'énumère : propose une liste de candidats, que l'utilisateur coche, écarte ou complète. Déduis les candidats de `product.md`, et soumets-les par lots avec `AskUserQuestion` :

- surfaces : web, mobile, les deux ; un back est-il nécessaire
- rendu : SEO et contenu public, ou application derrière une authentification
- temps réel, hors ligne, notifications
- paiement, e-commerce, upload de médias
- authentification : rôles, fournisseurs externes
- volumétrie et charge attendues
- contraintes : hébergement, budget, existant à ne pas casser

En **mise à jour**, saute cette étape sauf si le produit a changé depuis la dernière stack.

---

## Veille

Pour chaque brique candidate, préférence par défaut comme alternative, vérifie par `WebSearch` les points de la veille du `SKILL.md`, ainsi que les **alternatives sérieuses** apparues ou montées en puissance depuis.

---

## Proposition

Domaine par domaine (commun, front web, front mobile, back, contrat entre apps, e-commerce, selon ce que le produit demande), présente :

- la préférence par défaut
- l'alternative crédible, s'il y en a une
- ta recommandation, et pourquoi : le besoin produit qu'elle sert, ce que dit la veille

Quand la préférence par défaut convient, dis-le simplement : challenger ne veut pas dire changer.

Soumets les arbitrages avec `AskUserQuestion`, ta recommandation en premier. Récapitule, puis demande une confirmation avant d'écrire.

---

## Écriture

Écris `stack.md` avec le gabarit du `SKILL.md`. En challenge ou en mise à jour, modifie-le au plus près plutôt que de le réécrire.

Consigne chaque arbitrage dans `decisions.md`, y compris les préférences **confirmées** après challenge : ce sont elles qu'un futur passage serait tenté de rouvrir.

---

## Fin

En **création**, rends la main à `setup` : la suite de l'entretien, l'architecture, le code et la configuration s'appuient sur `stack.md`.

En **challenge** ou **mise à jour**, liste ce qui a changé et ce que ça implique pour le code existant : migrations, dépendances à mettre à jour, code à adapter. Ne modifie pas le code toi-même : c'est le travail d'une story.

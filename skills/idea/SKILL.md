---
name: idea
description: Note, précise ou abandonne une idée pour la suite d'un projet, dans `project/ideas.md` : le problème, la piste, la complexité, le coût de fonctionnement et les questions ouvertes. Se déclenche quand l'utilisateur évoque une idée hors de la tâche en cours (« un jour il faudrait… », « note ça pour plus tard »), ou quand il veut revoir, préciser ou abandonner une idée. Ne cadre pas de feature : c'est le rôle de `spec`.
metadata:
  moukie-badge: "project"
  moukie-icon: "lightbulb"
  moukie-rank: "11"
  moukie-summary: "Note une idée pour plus tard, avec sa complexité et son coût."
  moukie-produces: "Écrit ideas.md"
---

# Skill Idea

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).

Ce skill écrit `project/ideas.md`. Seul `spec` y touche aussi, pour retirer une idée devenue feature.

**Une idée se note vite** : pas d'entretien. Remplis toi-même chaque champ à partir de ce que l'utilisateur a dit et du vault, puis montre l'entrée : il corrige s'il veut. Si l'idée surgit pendant une autre tâche, reprends-la juste après.

---

## Mode

- **ajout** : une nouvelle idée. Si une entrée proche existe déjà, complète-la plutôt que d'en créer une seconde
- **révision** : préciser une idée, ou réévaluer sa complexité ou son coût
- **abandon** : retirer une idée. Si l'abandon tranche un choix de produit, de stack ou d'architecture, consigne-le dans `project/decisions.md`, au format de ce fichier ; sinon, l'historique git suffit

---

## Format

`project/ideas.md`, créé s'il manque, une section par idée, la plus récente à la fin :

```markdown
# Idées

## <Titre court>
*Notée le AAAA-MM-JJ*

- **Problème** : ce qui gêne aujourd'hui, et qui le subit
- **Piste** : ce qu'on ferait
- **Complexité** : faible, moyenne ou forte, et pourquoi
- **Coût de fonctionnement** : ce que l'idée coûterait chaque mois une fois livrée, ou « aucun »
- **Questions ouvertes** : ce qu'il faudra trancher
```

**La complexité** se lit dans `project/architecture.md` et `project/stack.md` :

- **faible** : une app, une story probable, rien d'inconnu
- **moyenne** : plusieurs stories, ou une inconnue
- **forte** : plusieurs apps et un contrat, ou une brique absente de la stack

**Le coût de fonctionnement** compte l'hébergement, les services payants et les API. Si la piste suppose un service payant, cherche son tarif sur le web et note-le avec sa source et sa date. Sans tarif trouvé, écris « à vérifier » : n'invente aucun prix.

---

## Fin

Commite `project/ideas.md` seul sur la branche courante (`docs(ideas): add <slug>`). Sur la branche par défaut, que le hook git protège, laisse-le non commité et dis-le : `spec` le joindra à son prochain commit.

Montre l'entrée en quelques lignes, puis reprends la tâche en cours s'il y en avait une.

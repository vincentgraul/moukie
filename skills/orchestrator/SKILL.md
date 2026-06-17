---
name: orchestrator
description: Implémente une story Jira de bout en bout via des subagents front et back travaillant en parallèle sur des worktrees isolés, autour d'un contrat d'interface gelé. Se déclenche quand l'utilisateur veut implémenter un ticket. Gère une story à la fois : une branche, le contrat si la story est multi-couche, le travail parallèle, l'intégration, puis le passage à `pr`. Ne merge jamais.
---

# Orchestrateur d'implémentation parallèle

Implémente **une story/ticket à la fois**. Mène les échanges en **français**.
L'orchestrateur ne code pas lui-même : il **cadre, lance et coordonne** les subagents, puis intègre leur travail.
Il s'arrête à l'**ouverture de la PR** (déléguée à `pr`) : ne merge jamais.

**Notifications** — préviens l'utilisateur avec l'outil `PushNotification` (desktop + téléphone si Remote Control est connecté) à **deux moments seulement** :
- **Blocage** : dès que tu es bloqué et qu'il te faut une décision de l'utilisateur (un subagent remonte un changement de contrat, un choix ambigu, un accès manquant). Message : clé du ticket + raison du blocage.
- **Ticket finalisé** : une fois la PR ouverte (fin de Phase 6). Message : clé du ticket + PR ouverte (avec le lien si disponible).

N'envoie **aucune** notification pour le progrès de routine. Garde le message sous 200 caractères, une ligne.

---

## Phase 0 — Cadrage du ticket

- Identifie le **ticket Jira cible** (sa clé). Lis-le via le MCP Jira et lis la **story correspondante** dans `specs/<feature>.md`.
- Détermine les **couches concernées** : **front-only**, **back-only**, ou **front + back**.
- Crée et bascule sur une **branche dédiée** nommée avec la clé Jira (ex. `PROJ-34-...`), depuis la base à jour. Jamais sur `main`/`master`.

---

## Phase 1 — Contrat (uniquement si multi-couche)

- Si la story touche **front ET back** : lance le skill `contract` pour **définir et geler** l'interface **avant** de spawner les subagents. Le contrat est posé sur la branche du ticket pour que les deux lanes en héritent.
- Si la story est **mono-couche** : saute cette phase, il n'y a pas d'interface à figer.

---

## Phase 2 — Lancement des subagents

Respecte les règles de subagents du scaffold : **writers isolés par worktree**, **écriture pré-autorisée** (leurs permissions `Write`/`Edit` sont accordées d'avance pour qu'ils n'aient pas à s'interrompre), **subagents autonomes** (ils n'ont pas besoin de l'utilisateur pour avancer).

- **Mono-couche** : lance **un seul subagent** sur la couche concernée.
- **Multi-couche** : lance **deux subagents en parallèle** (front + back), chacun dans son worktree isolé. Donne à chacun :
  - sa **tranche du ticket**,
  - le **contrat gelé** comme source unique de vérité,
  - la consigne de **coder contre le contrat sans le modifier**.

---

## Phase 3 — Arbitrage des changements de contrat

Si un subagent **remonte un besoin de changement d'interface** (au lieu de bricoler un contournement), applique le protocole de `contract` (gel strict, modèle A) :

1. **Suspends** les lanes concernées.
2. Amende la **source unique** sur la branche du ticket.
3. Fais **rebaser** les deux lanes sur la base mise à jour.
4. **Relance** le travail parallèle.

Si tu ne peux pas trancher seul (changement de contrat structurant, choix produit), **notifie l'utilisateur** (`PushNotification`) avec la clé du ticket et la raison, puis attends sa décision.

---

## Phase 4 — Intégration

- Quand les lanes ont terminé, **intègre** leur travail sur la branche du ticket.
- Résous les éventuels conflits — le contrat partagé limite fortement les collisions, elles devraient rester marginales.

---

## Phase 5 — Revue

Avant d'ouvrir la PR, lance le subagent **`reviewer`** (lecture seule) sur le travail intégré. Il rend des findings priorisés (bloquant / à corriger / suggestion) avec `fichier:ligne`.

- **Findings bloquants ou à corriger** : fais-les appliquer par le writer concerné (`front-web` / `front-mobile` / `backend` / `QA`) sur la branche du ticket, puis relance une revue ciblée si le changement est conséquent.
- **Suggestions** : applique-les si elles sont rapides et sûres, sinon note-les dans le corps de la PR.
- Si un finding bloquant relève d'un choix produit ou structurant que tu ne peux pas trancher seul, **notifie l'utilisateur** (`PushNotification`) et attends sa décision.

N'enchaîne sur la PR qu'une fois les findings bloquants levés.

---

## Phase 6 — Passage de main

Une fois la revue traitée, **enchaîne sur le skill `pr`** : il lance tests + lint (et corrige), commit, pousse la branche et ouvre la PR liée au ticket Jira. Ne merge jamais toi-même.

Une fois la **PR ouverte**, **notifie l'utilisateur** (`PushNotification`) : le ticket est finalisé, avec sa clé et le lien de la PR.

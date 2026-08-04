---
name: orchestrator
description: Implémente une story Jira et ses tickets de bout en bout via des agents front et back travaillant en parallèle sur des worktrees isolés autour d'un contrat d'interface gelé. Se déclenche quand l'utilisateur veut implémenter une story et ses tickets Jira.
model: sonnet
---

# Skill Orchestrator

## Règles

Mène les échanges en **français**.
Gère une story Jira à la fois.
Tu ne code pas toi-même. Tu **cadre, lance et coordonne** les agents, intègre leur travail puis termine par mettre en PR le code une fois validé par l'agent `reviewer`.
Les agents sont **autonomes**. Ils n'ont pas besoin de l'utilisateur pour avancer.

---

## Préparation

Tout d'abord identifie la clé du ticket Jira. Lis-le via le `MCP Jira` et lis la **story correspondante** dans `specs/<feature>.md`.
Détermine les **couches concernées** : **front-only**, **back-only**, ou **front et back** puis crée et bascule sur une **branche dédiée** nommée avec la clé Jira (ex. `PROJ-34-...`).

---

## Contrat

Si la story est **mono-couche** il n'y a pas de contrat à figer.
En revanche si la story est **multi-couche** : lance le skill `contract` pour **définir et geler** le contrat **avant** de spawner les agents. Le contrat est posé sur la branche du ticket pour que les deux lanes en héritent.

Si un agent **remonte un besoin de changement de contrat** applique le protocole de `contract` (gel strict) :

1. **Suspends** les lanes concernées.
2. Amende la **source unique** sur la branche du ticket.
3. Fais **rebaser** les deux lanes sur la base mise à jour.
4. **Relance** le travail parallèle.

Si tu ne peux pas trancher seul (changement de contrat structurant, choix produit), **notifie l'utilisateur** puis attends sa décision.

---

## Notification

En tant qu'orchestrateur tu dois m'informer de l'avancement du travail.
Pour ce faire utilise l'outil `PushNotification` à **trois moments seulement** :

- **Contrat à valider** : quand le contrat est construit et attend une validation de l'utilisateur avant gel. **Message : clé du ticket + contrat à valider**
- **Blocage** : dès que tu es bloqué et qu'il te faut une décision de l'utilisateur. **Message : clé du ticket + raison du blocage**
- **Ticket finalisé** : une fois la PR ouverte. **Message : clé du ticket + PR ouverte**

---

## Coordination des agents

Si la story est **mono-couche** lance **un seul agent** sur la couche concernée.

Si la story est **multi-couche** lance **deux agents en parallèle** (front et back), chacun dans son worktree isolé puis donne à chacun :
- sa **part du ticket**
- le **contrat gelé** comme source unique de vérité
- la consigne de **coder contre le contrat sans le modifier**

Quand les lanes ont terminé, **intègre** leur travail sur la branche du ticket. S'il y a d'éventuels conflits, résous-les.

---

## PR

Une fois le code terminé tu vas pouvoir ouvrir une PR avec le skill `pr`.
Mais avant ça, lance l'agent `reviewer` en lui donnant les critères d'acceptation de la story. Il rend des constats priorisés :

- **Constats bloquants ou à corriger** : fais-les appliquer par l'agent concerné (`front-web` / `front-mobile` / `backend`) sur la branche du ticket, puis relance une revue ciblée si le changement est conséquent.
- **Suggestions** : applique-les si elles sont rapides et sûres, sinon note-les dans le corps de la PR.

**Un critère d'acceptation non couvert est bloquant**.
Si un constat bloquant relève d'un choix produit ou structurant que tu ne peux pas trancher seul, **notifie l'utilisateur** et attends sa décision.
N'enchaîne sur la PR qu'une fois les constats bloquants levés.
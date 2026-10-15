# Story sur plusieurs apps

Quand la story touche plusieurs apps, suis ce fichier à la place du lancement unique de la Phase 2 du `SKILL.md`. Le choix des agents, ce que tu leur donnes, le modèle et les blocages restent ceux de la Phase 2. Reprends ensuite à la Phase 3.

---

## Contrat

Invoque le skill `contract` pour **définir et geler** le contrat **avant** de lancer les agents. Une fois le contrat gelé, **commite sa source** sur la branche de la story, avec ce que `scaffold` a installé pour la génération des types si `contract` l'a invoqué. Un worktree part du dernier commit : un contrat non commité n'existerait pas dans les copies des lanes.

---

## Lancement des lanes

Chaque app a sa lane. Une app mobile fait **une instance de `front-mobile` par app** : une app iOS et une app Android font deux lanes, une app multiplateforme n'en fait qu'une.

Vérifie que la source du contrat est commitée, puis lance **un agent par app, en parallèle**, chacun avec l'option `isolation: "worktree"` de l'outil Agent. Claude Code donne à chacun sa copie du dépôt, créée à partir du dernier commit de la branche de la story : tu n'as aucun `git worktree` à gérer toi-même.

Donne à chaque agent, en plus de ce que liste le `SKILL.md` :

- le **chemin de la source du contrat**, et la consigne de **coder contre lui sans le modifier**
- pour un critère qui traverse plusieurs apps, sa part seulement : chaque lane la couvre par ses propres tests, le test end-to-end viendra après l'intégration

---

## Intégration

Quand toutes les lanes ont rendu leur compte rendu, vérifie pour **chacune** qu'elle n'a pas touché à la source du contrat, dont le chemin est dans `architecture.md` :

```sh
git diff --quiet <branche-de-la-story>...<branche-de-la-lane> -- <chemin-de-la-source-du-contrat>
```

Garde les **trois points** : ils ne montrent que ce que la lane a changé depuis son départ. Avec deux points, un contrat amendé légitimement sur la branche de la story ferait bloquer la lane à tort. Les types régénérés à partir du contrat ne comptent pas : seule la source est gelée.

Une différence signalée est un blocage : ne fusionne pas la lane. Ne compte pas sur un conflit de fusion pour le repérer : quand une seule lane touche au contrat, la modification passe en silence.

Fusionne ensuite les branches des lanes dans la branche de la story, **les apps serveur d'abord, puis chaque app cliente**.

Résous les conflits ordinaires. Un conflit sur le **lockfile** (`bun.lock`, `package-lock.json`, `pnpm-lock.yaml`…) ne se résout pas à la main : garde l'une des deux versions, relance l'installation pour le régénérer, puis termine la fusion. Un conflit qui touche le **contrat** est un blocage : ne le résous pas.

Fais ensuite le ménage : supprime les worktrees des lanes, puis leurs branches avec `git branch -d`, qui refuse de supprimer une branche non fusionnée.

---

## Tests end-to-end

Un critère qui traverse plusieurs apps n'est prouvé que par un test qui les exerce ensemble, et ce test ne peut s'écrire qu'ici. Si la story n'a aucun critère de ce genre, passe à la validation.

Sinon, confie ces critères à l'agent de l'app par laquelle passe l'utilisateur : `front-web` ou `front-mobile`, ou `backend` si le critère ne traverse que des apps serveur. Lance-le **sans isolation**, sur la branche de la story, avec la consigne d'écrire un test end-to-end par critère. Si plusieurs apps clientes sont concernées, lance leurs agents l'un après l'autre.

---

## Validation

En plus de `check` et des tests unitaires, relance **une fois** les tests end-to-end et le build : des lanes ont été fusionnées.

---
name: orchestrator
description: Implémente une story de bout en bout, avec un agent par app concernée, en parallèle dans des worktrees isolés, autour d'un contrat d'interface gelé. Intègre leur travail, le fait valider et relire, puis délègue l'ouverture de la PR au skill `pr`. Se déclenche quand l'utilisateur veut implémenter une story de `project/specs/<feature>/`, désignée par son slug.
metadata:
  moukie-badge: "story"
  moukie-icon: "clef-treble"
  moukie-rank: "7"
  moukie-summary: "Une lane par app, en parallèle, jusqu'à la PR."
  moukie-produces: "Appelle contract et pr"
---

# Skill Orchestrator

## Règles

Mène les échanges en **français**.
Commite en conventional commits, avec des messages en anglais et sans mention de co-auteur.
N'utilise jamais `--no-verify`, et ne laisse aucun agent le faire : les hooks du dépôt sont des garde-fous, pas des obstacles.
Ne merge jamais sur `main`, et ne merge jamais une PR : c'est l'utilisateur qui merge.

Une story à la fois.

Tu ne codes pas toi-même : tu **prépares, lances et coordonnes** les agents, tu intègres leur travail, puis tu le fais relire par l'agent `reviewer` avant d'ouvrir la PR.

Les agents sont **autonomes** : ils avancent sans solliciter l'utilisateur.

**Sois économe.** Chaque vérification, chaque tour de revue et chaque message long se paie en tokens. Tes messages à l'utilisateur sont brefs, et tu ne lui récapitules pas ce que les comptes rendus disent déjà.

Les commandes du projet (installation, linter, tests, tests end-to-end, vérification de l'architecture, génération des types du contrat) sont dans la section « Commandes » du `CLAUDE.md`. N'en suppose jamais une autre.

---

## Phase 1 — Préparation

1. **Identifie la story** par son slug, puis récupère l'état du remote (`git fetch`) : la PR d'une story précédente a pu être mergée depuis. Repère aussi la branche par défaut du remote, `origin/main` ou `origin/master` (`git symbolic-ref --short refs/remotes/origin/HEAD`) : elle est notée `origin/<défaut>` dans la suite.
2. **Choisis la base de la story**, d'après la branche `<feature>/spec`, où le skill `spec` a commité la feature validée :
   - si elle existe et n'est pas encore contenue dans `origin/<défaut>` (`git merge-base --is-ancestor <feature>/spec origin/<défaut>` échoue), la spec n'a pas encore rejoint `main` : la base est `<feature>/spec`
   - sinon, la spec a déjà rejoint `main` avec une story précédente : la base est `origin/<défaut>`, qui porte aussi le code des stories déjà mergées. Si `<feature>/spec` existe encore, supprime-la (`git branch -D`, qui ne perd rien puisque tout est dans `origin/<défaut>`) : la garder ferait repartir les stories suivantes d'une spec dépassée
3. **Lis la story** telle qu'elle est dans la base (`git show <base>:project/specs/<feature>/<story>.md`), ainsi que le `README.md` de sa feature, qui porte le contexte et le périmètre. **Refuse de continuer** si son frontmatter n'est pas `status: validated`.
4. **Détermine les apps concernées**, parmi celles que liste `project/architecture.md` : une seule, ou plusieurs (par exemple l'API, le web et une app iOS).
5. **Crée la branche de la story** depuis la base, et bascule dessus. Elle se nomme `<feature>/<story>`, soit le chemin de la story sous `project/specs/` (`panier/ajout-article`). La story est commitée dans la base : c'est ce qui la rend visible dans les worktrees des agents.

Si une app concernée est prévue par l'architecture mais n'existe pas encore dans le code (ajoutée par un amendement, par exemple), invoque le skill `scaffold` avant d'aller plus loin. Commite ce qu'il génère sur la branche de la story : c'est ce commit qui le rend visible dans les worktrees.

---

## Phase 2 — Contrat

Si la story ne touche **qu'une app**, il n'y a pas de contrat à figer : passe à la Phase 3.

Si elle en touche **plusieurs**, invoque le skill `contract` pour **définir et geler** le contrat **avant** de lancer les agents. Une fois le contrat gelé, **commite sa source** sur la branche de la story, avec ce que `scaffold` a installé pour la génération des types si `contract` l'a invoqué. C'est ce commit qui le transmet aux lanes : un worktree part du dernier commit, et un contrat écrit mais non commité n'existerait pas dans leurs copies.

---

## Phase 3 — Lancement des lanes

Chaque app concernée a **sa lane**, confiée à l'agent qui correspond à son type :

- une app serveur (API, worker) : `backend`
- une app web : `front-web`
- une app mobile : `front-mobile`, **une instance par app**. Une app iOS et une app Android font deux lanes, une app multiplateforme n'en fait qu'une

Donne à chaque agent :

- **l'app dont il a la charge**, telle que la nomme `architecture.md`
- **sa part de la story** : les critères d'acceptation qui relèvent de son app. Pour un critère qui traverse plusieurs apps, chaque lane couvre sa part par ses propres tests ; le test end-to-end viendra après l'intégration
- **le chemin de la story**, `project/specs/<feature>/<story>.md`. Un agent front y trouve, dans le frontmatter `figma:`, le lien de son écran
- s'il y a un contrat, **le chemin de sa source**, et la consigne de **coder contre lui sans le modifier**
- la consigne de **faire passer ses tests et `check`**, puis de **terminer par un compte rendu** : sa branche, ses commits, le résultat des tests, ce qui est fait, ce qui bloque

Les agents tournent sur **Sonnet** par défaut. Passe une lane en **Opus** (option `model: "opus"` de l'outil Agent) seulement si sa part de la story est complexe : logique délicate, refactor transversal, intégration inhabituelle. Dis-le alors à l'utilisateur.

**Une seule app** : lance un seul agent, **sans isolation**. Il travaille directement sur la branche de la story ; il n'y a rien à intégrer, passe à la Phase 5.

**Plusieurs apps** : vérifie d'abord que la source du contrat est commitée sur la branche de la story. Lance ensuite **un agent par app, en parallèle**, chacun avec l'option `isolation: "worktree"` de l'outil Agent. Claude Code donne à chacun sa propre copie du dépôt, créée à partir du dernier commit de la branche de la story : tu n'as aucun `git worktree` à gérer toi-même.

Pendant que les lanes tournent, un agent peut remonter un blocage : voir la section « Blocages ».

---

## Phase 4 — Intégration

Quand toutes les lanes ont rendu leur compte rendu, vérifie pour **chacune** qu'elle n'a pas touché à la source du contrat, dont le chemin est dans `architecture.md` :

```sh
git diff --quiet <branche-de-la-story>...<branche-de-la-lane> -- <chemin-de-la-source-du-contrat>
```

Garde bien les **trois points** : ils comparent la lane à son point de départ, et ne montrent donc que ce que la lane a changé. Avec deux points, un contrat amendé légitimement sur la branche de la story ferait bloquer la lane à tort. Les types qu'une lane a régénérés à partir du contrat ne comptent pas : seule la source est gelée.

Si la commande signale une différence, la lane a modifié le contrat gelé : ne la fusionne pas, c'est un blocage. Ne compte pas sur un conflit de fusion pour le repérer : quand une seule lane touche au contrat, la fusion se fait sans conflit et la modification passe en silence.

Fusionne ensuite les branches des lanes dans la branche de la story, **les apps serveur d'abord, puis chaque app cliente** : les clientes consomment l'API, elles s'intègrent par-dessus.

Résous les conflits ordinaires. Un conflit sur le **lockfile** du gestionnaire de paquets (`bun.lock`, `package-lock.json`, `pnpm-lock.yaml`…) ne se résout pas à la main : garde l'une des deux versions, relance l'installation pour qu'il se régénère avec les dépendances des deux lanes, puis termine la fusion. Un conflit qui touche le **contrat** n'est pas ordinaire : le contrat était gelé, personne n'aurait dû y toucher. Ne le résous pas, traite-le comme un blocage.

Une fois l'intégration réussie, **fais le ménage** : supprime les worktrees des lanes, puis leurs branches avec `git branch -d`. Contrairement à `-D`, il refuse de supprimer une branche non fusionnée, ce qui te protège d'une perte de travail. Il ne reste que la branche de la story.

---

## Phase 5 — Tests end-to-end

Un critère qui traverse plusieurs apps n'est prouvé que par un test qui les exerce ensemble, jamais par la somme des tests de chaque lane. Ce test ne peut s'écrire qu'ici : c'est sur la branche de la story que toutes les apps sont enfin réunies.

Si la story n'a aucun critère de ce genre, passe à la Phase 6.

Sinon, confie ces critères à l'agent de l'app par laquelle passe l'utilisateur : `front-web` ou `front-mobile`, ou `backend` si le critère ne traverse que des apps serveur. Lance-le **sans isolation**, sur la branche de la story, avec la liste des critères et la consigne d'écrire un test end-to-end par critère. Si plusieurs apps clientes sont concernées, lance leurs agents l'un après l'autre : ils travaillent sur la même branche.

---

## Phase 6 — Validation d'intégration

La lane a déjà lancé toute la suite : **ne la relance pas en entier**. Avec les commandes de la section « Commandes » du `CLAUDE.md` :

- relance `check` et les **tests unitaires**, rapides, pour confirmer que la branche est saine
- relance les **tests end-to-end** et le build **une fois** seulement si plusieurs lanes ont été fusionnées en Phase 4, si des tests end-to-end ont été écrits en Phase 5, ou si un compte rendu signale un doute
- ne répète jamais une commande pour « confirmer » : seulement pour diagnostiquer un échec

Rédige un **compte rendu d'intégration** court : les commandes lancées, leur résultat, et pour chaque critère d'acceptation le test qui le couvre. C'est lui que tu remets au `reviewer`.

Si quelque chose échoue, ce n'est pas encore l'heure de la revue : renvoie la correction à l'agent concerné, puis relance la validation.

---

## Phase 7 — Revue

Lance l'agent `reviewer` en lui donnant les critères d'acceptation de la story et le compte rendu d'intégration. Il rend des constats classés :

- **bloquant** ou **à corriger** : fais-les corriger par l'agent de l'app concernée, sur la branche de la story, en un seul envoi. Vérifie ensuite toi-même ses corrections, par son compte rendu, `check` et les tests unitaires
- **suggestion** : ne lance jamais un tour de correction pour elle seule. Joins-la à l'envoi des corrections si elle est rapide et sûre ; sinon, transmets-la au skill `pr`, qui la reporte dans la PR

**Une seule revue par story.** Une revue ciblée, sur le seul diff des corrections, n'a lieu que dans deux cas : il y avait un constat **bloquant**, ou une correction **change du comportement** (logique, configuration, build). Les renommages, les tests, le ménage et les textes n'en demandent pas.

Un critère d'acceptation non couvert est **bloquant**.

Si un constat bloquant relève d'un choix produit ou structurant que tu ne peux pas trancher seul, notifie l'utilisateur et attends sa décision.

---

## Phase 8 — PR

Une fois les constats bloquants levés, invoque le skill `pr`, en lui transmettant les suggestions non appliquées.

---

## Blocages

Pendant les lanes, un agent peut remonter un besoin qu'il ne doit pas trancher seul. Quand la décision revient à l'utilisateur, notifie-le, puis attends sa réponse.

### Changement de contrat

Si un agent remonte un besoin de changement de contrat, applique l'évolution contrôlée du skill `contract` :

1. **Suspends** le travail parallèle sur les parties concernées.
2. Amende la **source** du contrat sur la branche de la story, jamais dans un worktree, et **commite-la** : les lanes ne voient le changement qu'à travers ce commit.
3. Les lanes **rebasent** sur la branche de la story, et régénèrent leurs types si le format le demande.
4. **Relance** le travail parallèle.

Tu peux appliquer seul un changement mineur. Un changement structurant, ou qui touche un choix produit, attend la décision de l'utilisateur.

### Story incomplète

Si `contract` ou un agent signale qu'il manque à la story une information dont il a besoin (une valeur, une règle, un cas d'erreur), ne la fais pas inventer : notifie l'utilisateur. La story repasse par le skill `spec`, en mise à jour, qui la complète et la commite sur `<feature>/spec`. Fais ensuite rebaser la branche de la story sur `<feature>/spec` avant de reprendre.

### Bibliothèque absente de la stack

Si un agent a besoin d'une bibliothèque que `project/stack.md` ne retient pas, ce n'est ni à lui ni à toi de trancher : notifie l'utilisateur. S'il accepte d'étudier l'ajout, invoque le skill `stack` en mode challenge, sur ce domaine seulement. Une fois `stack.md` à jour, commite-le sur la branche de la story et fais rebaser la lane concernée avant de la reprendre.

C'est un filet de sécurité : ce besoin aurait dû être repéré au moment de la spec.

### Module absent de l'architecture

Si un agent a besoin d'un module ou d'une app que `project/architecture.md` ne prévoit pas, c'est aussi à l'utilisateur de trancher : notifie-le. S'il accepte, invoque le skill `architecture` en mode amendement, en lui transmettant le besoin. Une fois `architecture.md` à jour, commite-le sur la branche de la story et fais rebaser la lane concernée avant de la reprendre.

---

## Notifications

Tiens l'utilisateur informé avec l'outil `PushNotification`, à **trois moments seulement** :

| Moment | Message |
|---|---|
| Le contrat est construit et attend sa validation | le slug de la story, et « contrat à valider » |
| Un blocage demande une décision de l'utilisateur | le slug de la story, et la raison du blocage |
| La PR est ouverte | le slug de la story, et « PR ouverte » |

---

## Fin

Une fois la PR ouverte par le skill `pr`, envoie la dernière notification, puis donne à l'utilisateur le lien de la PR. C'est lui qui la merge.

C'est une **frontière de session** : tout le contexte utile est dans `project/` et dans git. Donne la commande de l'étape suivante (par exemple `/moukie:orchestrator <feature>/<story suivante>`, à lancer une fois la PR mergée), puis propose de vider la conversation : dans l'app desktop, avec l'outil qui vide la session, après accord de l'utilisateur ; ailleurs, en l'invitant à taper `/clear`. Le vidage vient en dernier : rien de ce qui précède n'est conservé.

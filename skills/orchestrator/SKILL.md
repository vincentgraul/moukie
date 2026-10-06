---
name: orchestrator
description: Implémente une story de bout en bout, avec un agent par app concernée, en parallèle dans des worktrees isolés, autour d'un contrat d'interface gelé. Intègre leur travail, le fait valider et relire, puis délègue l'ouverture de la PR au skill `pr`. Se déclenche quand l'utilisateur veut implémenter une story de `project/specs/<feature>/`, désignée par son slug.
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

Les commandes du projet (installation, linter, tests, tests end-to-end, vérification de l'architecture, génération des types du contrat) sont dans la section « Commandes » du `CLAUDE.md`. N'en suppose jamais une autre.

---

## Phase 1 — Préparation

1. **Identifie la story** par son slug, puis bascule sur la branche `<feature>/spec`, où le skill `spec` a commité la feature validée. Si cette branche n'existe plus, la spec a déjà rejoint `main` avec une story précédente : pars de `main`.
2. **Lis la story**, `project/specs/<feature>/<story>.md`, et le `README.md` de sa feature, qui porte le contexte et le périmètre. **Refuse de continuer** si son frontmatter n'est pas `status: validated`.
3. **Détermine les apps concernées**, parmi celles que liste `project/architecture.md` : une seule, ou plusieurs (par exemple l'API, le web et une app iOS).
4. **Crée la branche de la story**, `<feature>/<story>`, soit le chemin de la story sous `project/specs/` (`panier/ajout-article`), et bascule dessus. Elle part de la branche où tu te trouves : la story y est commitée, et c'est ce qui la rend visible dans les worktrees des agents.

Si une app concernée est prévue par l'architecture mais n'existe pas encore dans le code (ajoutée par un amendement, par exemple), invoque le skill `scaffold` avant d'aller plus loin. Commite ce qu'il génère sur la branche de la story : c'est ce commit qui le rend visible dans les worktrees.

---

## Phase 2 — Contrat

Si la story ne touche **qu'une app**, il n'y a pas de contrat à figer : passe à la Phase 3.

Si elle en touche **plusieurs**, invoque le skill `contract` pour **définir et geler** le contrat **avant** de lancer les agents. Une fois le contrat gelé, **commite sa source** sur la branche de la story. C'est ce commit qui le transmet aux lanes : un worktree part du dernier commit, et un contrat écrit mais non commité n'existerait pas dans leurs copies.

---

## Phase 3 — Lancement des lanes

Chaque app concernée a **sa lane**, confiée à l'agent qui correspond à son type :

- une app serveur (API, worker) : `backend`
- une app web : `front-web`
- une app mobile : `front-mobile`, **une instance par app**. Une app iOS et une app Android font deux lanes, une app multiplateforme n'en fait qu'une

Donne à chaque agent :

- **l'app dont il a la charge**, telle que la nomme `architecture.md`
- **sa part de la story** : les critères d'acceptation qui relèvent de son app
- **le chemin de la story**, `project/specs/<feature>/<story>.md`. Un agent front y trouve, dans le frontmatter `figma:`, le lien de son écran
- s'il y a un contrat, **le chemin de sa source**, et la consigne de **coder contre lui sans le modifier**
- la consigne de **terminer par un compte rendu** : sa branche, ses commits, ce qui est fait, ce qui bloque

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

Résous les conflits ordinaires. Un conflit qui touche le **contrat** n'est pas ordinaire : le contrat était gelé, personne n'aurait dû y toucher. Ne le résous pas, traite-le comme un blocage.

Une fois l'intégration réussie, **fais le ménage** : supprime les worktrees des lanes, puis leurs branches avec `git branch -d`. Contrairement à `-D`, il refuse de supprimer une branche non fusionnée, ce qui te protège d'une perte de travail. Il ne reste que la branche de la story.

---

## Phase 5 — Validation d'intégration

Le travail réuni sur la branche de la story, vérifie la story **dans son ensemble**, avec les commandes de la section « Commandes » du `CLAUDE.md` :

- la **suite de tests complète** du projet, pas seulement les tests de la story
- les **tests end-to-end** des critères qui traversent plusieurs apps : un tel critère n'est prouvé que par un test qui les exerce ensemble, jamais par la somme de tests isolés de chaque app
- la commande `check`, qui lance le linter

Rédige un **compte rendu d'intégration** : les commandes lancées, leur résultat, et pour chaque critère d'acceptation le test qui le couvre. C'est lui que tu remets au `reviewer`.

Si quelque chose échoue, ce n'est pas encore l'heure de la revue : renvoie la correction à l'agent concerné, puis relance la validation.

---

## Phase 6 — Revue

Lance l'agent `reviewer` en lui donnant les critères d'acceptation de la story et le compte rendu d'intégration. Il rend des constats classés :

- **bloquant** ou **à corriger** : fais-les corriger par l'agent de l'app concernée, sur la branche de la story, puis relance une revue ciblée si le changement est conséquent
- **suggestion** : applique-la si elle est rapide et sûre ; sinon, transmets-la au skill `pr`, qui la reporte dans la PR

Un critère d'acceptation non couvert est **bloquant**.

Si un constat bloquant relève d'un choix produit ou structurant que tu ne peux pas trancher seul, notifie l'utilisateur et attends sa décision.

---

## Phase 7 — PR

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

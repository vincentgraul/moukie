---
name: orchestrator
description: Implémente une story de bout en bout, avec un agent par app concernée, en parallèle dans des worktrees isolés, autour d'un contrat d'interface gelé. Intègre leur travail, le fait valider et relire, puis délègue l'ouverture de la PR au skill `pr` et enchaîne sur la story suivante de la feature, empilée sur la précédente. Se déclenche quand l'utilisateur veut implémenter une story de `project/specs/<feature>/`, désignée par son slug.
metadata:
  moukie-badge: "story"
  moukie-icon: "clef-treble"
  moukie-rank: "7"
  moukie-summary: "Une lane par app, en parallèle, jusqu'à la PR."
  moukie-produces: "Appelle contract et pr"
---

# Skill Orchestrator

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`).

Une story à la fois. Tu ne codes pas toi-même : tu **prépares, lances et coordonnes** les agents, tu intègres leur travail, puis tu le fais relire par l'agent `reviewer`.

**Sois économe** : chaque vérification et chaque tour de revue se paient en tokens. Tes messages à l'utilisateur sont brefs, sans récapituler ce que disent les comptes rendus.

Les commandes du projet sont dans la section « Commandes » du `CLAUDE.md`. N'en suppose jamais une autre.

---

## Phase 1 — Préparation

1. **Identifie la story** par son slug, puis récupère l'état du remote (`git fetch`). Repère la branche par défaut du remote, `origin/main` ou `origin/master` (`git symbolic-ref --short refs/remotes/origin/HEAD`), notée `origin/<défaut>` dans la suite.
2. **Choisis la base de la story**, dans cet ordre :
   - **la dernière story de la feature encore ouverte** : liste, avec la CLI de la forge de `project/stack.md`, les PR ouvertes dont la branche source est une `<feature>/<story>`, hors `<feature>/spec`. S'il y en a, la base est la branche de celle qu'aucune autre ne vise : la story **s'empile** sur elle et part du code de toutes les précédentes, sans attendre leur merge
   - sinon, `<feature>/spec`, où le skill `spec` a commité la feature validée, si elle existe et n'est pas encore contenue dans `origin/<défaut>` (`git merge-base --is-ancestor <feature>/spec origin/<défaut>` échoue)
   - sinon, `origin/<défaut>`, qui porte aussi le code des stories déjà mergées. Si `<feature>/spec` existe encore, supprime-la (`git branch -D`) : la garder ferait repartir les stories suivantes d'une spec dépassée
3. **Lis la story** telle qu'elle est dans la base (`git show <base>:project/specs/<feature>/<story>.md`), ainsi que le `README.md` de sa feature. **Refuse de continuer** si le frontmatter de ce `README.md` n'est pas `status: validated`.
4. **Détermine les apps concernées**, parmi celles que liste `project/architecture.md`.
5. **Crée la branche de la story** depuis la base, et bascule dessus. Elle se nomme `<feature>/<story>` (`cart/add-item`).

Si une app concernée est prévue par l'architecture mais absente du code, invoque le skill `scaffold`, puis commite ce qu'il génère sur la branche de la story.

---

## Phase 2 — Lane

**Si la story touche plusieurs apps, lis `references/multi-apps.md` avant d'aller plus loin** : il remplace le lancement unique ci-dessous par le contrat, les lanes en parallèle, l'intégration et les tests end-to-end entre apps.

Sinon, l'app a **sa lane**, confiée à l'agent qui correspond à son type : `backend` pour une app serveur, `front-web` pour une app web, `front-mobile` pour une app mobile. Lance-le **sans isolation** : il travaille directement sur la branche de la story.

Donne-lui :

- **l'app dont il a la charge**, telle que la nomme `architecture.md`
- **les critères d'acceptation** qui relèvent de son app
- **le chemin de la story**, `project/specs/<feature>/<story>.md`. Un agent front y trouve, dans le frontmatter `figma:`, le lien de son écran

Ses tests, `check` et le format de son compte rendu sont déjà dans le fichier de l'agent : ne les répète pas.

Les agents tournent sur **Sonnet** par défaut. Passe une lane en **Opus** (option `model: "opus"` de l'outil Agent) seulement si sa part de la story est complexe : logique délicate, refactor transversal, intégration inhabituelle. Dis-le alors à l'utilisateur.

Si un agent remonte un besoin qu'il ne doit pas trancher seul (changement de contrat, information manquante dans la story, bibliothèque absente de la stack, module absent de l'architecture), **lis `references/blockers.md`** et suis la procédure du cas.

---

## Phase 3 — Validation d'intégration

La lane a déjà lancé toute la suite : **ne la relance pas en entier**. Relance `check` et les **tests unitaires**, rapides, pour confirmer que la branche est saine. Ne relance les tests end-to-end et le build qu'une fois, et seulement si `references/multi-apps.md` le demande ou si un compte rendu signale un doute. Ne répète jamais une commande pour « confirmer » : seulement pour diagnostiquer un échec.

Rédige un **compte rendu d'intégration** court : les commandes lancées, leur résultat, et pour chaque critère d'acceptation le test qui le couvre. C'est lui que tu remets au `reviewer`.

Si quelque chose échoue, renvoie la correction à l'agent concerné, puis relance la validation.

---

## Phase 4 — Revue

Lance l'agent `reviewer` en lui donnant les critères d'acceptation de la story et le compte rendu d'intégration. Il rend des constats classés :

- **bloquant** ou **à corriger** : fais-les corriger par l'agent de l'app concernée, sur la branche de la story, en un seul envoi. Vérifie ensuite toi-même ses corrections, par son compte rendu, `check` et les tests unitaires
- **suggestion** : ne lance jamais un tour de correction pour elle seule. Joins-la à l'envoi des corrections si elle est rapide et sûre ; sinon, transmets-la au skill `pr`, qui la reporte dans la PR

**Une seule revue par story.** Une revue ciblée, sur le seul diff des corrections, n'a lieu que s'il y avait un constat **bloquant**, ou si une correction **change du comportement** (logique, configuration, build).

Si un constat bloquant relève d'un choix produit ou structurant, notifie l'utilisateur et attends sa décision.

---

## Phase 5 — PR

Une fois les constats bloquants levés, invoque le skill `pr`, en lui transmettant les suggestions non appliquées et, si la story est empilée, sa **branche cible** : celle de la story sur laquelle elle s'empile.

---

## Notifications

Tiens l'utilisateur informé avec l'outil `PushNotification`, à **trois moments seulement**, en commençant toujours par le slug de la story : le contrat attend sa validation, un blocage demande sa décision (avec la raison), la PR est ouverte.

---

## Fin

Une fois la PR ouverte, envoie la dernière notification, puis donne à l'utilisateur le lien de la PR. C'est lui qui la merge, dans l'ordre de la pile.

**Story suivante** : cherche les stories de la feature dont la branche n'a aucune PR, ouverte ou mergée. S'il en reste, choisis celle que les autres supposent livrée en premier, d'après le `README.md` de la feature, puis enchaîne sans attendre de merge, **dans cette conversation** : dis à l'utilisateur quelle story tu lances, puis reprends à la Phase 1 avec elle, sans réinvoquer le skill, déjà chargé. N'ouvre pas de nouvelle session : l'app desktop refuse qu'une session en ouvre une autre sans demande de l'utilisateur, et le travail lourd de chaque story reste de toute façon dans les sous-agents

**Frontière de session**, s'il ne reste aucune story :

1. **Lance la feature en local**, depuis la branche courante, qui porte toutes ses stories : chaque app qu'elle touche, les apps serveur d'abord, en arrière-plan, avec la commande qui la lance en local dans le `CLAUDE.md`. Dans l'app desktop, ouvre l'app cliente dans son navigateur intégré. Donne son URL à l'utilisateur, pour qu'il essaie la feature avant de merger. Si la commande manque au `CLAUDE.md`, dis-le
2. Donne la commande de l'étape suivante, à lancer dans une nouvelle session : `/moukie:spec` pour une nouvelle feature, ou `/moukie:next` pour faire le point. Ne propose pas de vider la conversation : une nouvelle session repart déjà d'un contexte vide

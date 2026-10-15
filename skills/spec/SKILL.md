---
name: spec
description: Crée ou met à jour la spec d'une feature par un entretien guidé, puis la commite une fois validée. Se déclenche quand l'utilisateur veut rédiger, affiner ou mettre à jour une spec, y compris après avoir modifié une maquette Figma. Écrit `project/specs/<feature>/` : le cadrage de la feature et un fichier par story, prêtes à être implémentées une par une par le skill `orchestrator`.
metadata:
  moukie-badge: "feature"
  moukie-icon: "file-text"
  moukie-rank: "6"
  moukie-summary: "Cadre une feature et la découpe en stories."
  moukie-produces: "Crée project/specs/"
---

# Skill Spec

## Règles

Échange et écris dans la **langue du projet**, notée dans le `CLAUDE.md` (à défaut, celle des fichiers de `project/`). Traduis les titres et libellés des gabarits ; les clés et les valeurs du frontmatter (`status: validated`, `figma:`) restent telles quelles.

Une feature est un dossier de `project/specs/`, chacune de ses stories un fichier. Ce skill s'arrête à la **spec validée et commitée** : il n'implémente rien, il passe la main à `orchestrator`.

---

## Phase 1 — Préparation

Avant de poser la moindre question :

- lis les features de `project/specs/` s'il en existe : leur `README.md` et leurs stories
- lis `project/product.md`, `project/market.md` s'il existe, `project/stack.md` et `project/architecture.md`, qui te serviront en 2.5, et `project/design.md` s'il existe, qui décide du départ de l'entretien en 2.1
- détermine si l'utilisateur **crée** une feature ou **met à jour** une feature existante ; en cas de doute, demande-lui
- en **mise à jour**, récupère l'état du remote (`git fetch`) et repère sa branche par défaut, notée `origin/<défaut>` (`git symbolic-ref --short refs/remotes/origin/HEAD`). Puis, pour la branche `<feature>/spec` :
  - si elle existe et n'est pas encore contenue dans `origin/<défaut>` (`git merge-base --is-ancestor <feature>/spec origin/<défaut>` échoue), bascule dessus avant d'écrire : elle porte la dernière version validée de la feature
  - si elle y est déjà contenue, supprime-la (`git branch -D`) et pars de `origin/<défaut>`

Résume en une ou deux lignes ce que tu as détecté.

---

## Phase 2 — Entretien

Tu pars de ce qui est déjà écrit, l'utilisateur corrige et complète, puis tu ne le questionnes que sur les trous.

### Maquette modifiée

Si la mise à jour vient d'un écran modifié dans Figma, suis cette section à la place de 2.1 à 2.3, puis reprends à 2.4.

1. Demande quels écrans ont changé, par leur nom de frame ou leur URL, et ce qui a changé, en une ligne : le MCP Figma ne donne pas l'historique d'un fichier.
2. Retrouve la story de chaque écran : celle dont le `figma:` porte le même `node-id`. Un écran sans story est un nouvel écran : découpe-le par 2.2 et 2.3.
3. Regarde l'écran avec `get_screenshot`, puis invoque `figma-annotations` sur son nœud. Compare-les aux critères de la story et restitue les écarts en quelques lignes.
4. Détermine si la story est **déjà codée** : sa branche `<feature>/<story>` a une PR, ouverte ou mergée (avec la CLI de la forge de `stack.md`), ou existe sur le remote.
   - **pas codée** : amende ses critères sur place. Si l'écart n'est que visuel, la story ne change pas, car l'agent front lit la maquette au moment de l'implémenter : dis-le et arrête-toi
   - **codée** : laisse-la intacte, elle décrit le code livré. Ajoute une story qui ne porte que l'écart, avec le même `figma:` et un slug qui nomme le changement (`redesign-cart-summary`).

### 2.1 — Maquettes ou jet brut

Demande le **nom de la feature**.

**Avec `project/design.md`**, lis les maquettes avant de demander quoi que ce soit : elles montrent déjà les écrans, leurs textes et leur structure, que l'utilisateur n'a pas à paraphraser. Lis la structure de la page des maquettes avec `get_metadata` sur le `node-id` de l'URL de `design.md`, et repère les frames de la feature. Sur une grosse page, cherche dans la réponse par nom de frame plutôt que de tout lire. N'utilise pas `get_design_context`, bien trop lourd ici. Si les noms ne suffisent pas à comprendre un écran, regarde-en au plus trois avec `get_screenshot`. Si cette URL n'a pas de `node-id`, ou si la page ne montre pas les écrans de la feature, demande le lien de la page qui les contient. Restitue en quelques lignes ce que montrent les maquettes, et laisse l'utilisateur corriger et ajouter ce qu'elles ne disent pas.

**Sans `design.md`**, laisse l'utilisateur décrire ce qu'il veut, librement et dans le désordre, sans l'interrompre ni lui suggérer de sujets : les trous se comblent en 2.4.

### 2.2 — Structuration et découpage

Range ce que tu sais dans les sections du gabarit de la Phase 3, sans rien inventer. Ce qui manque reste **vide** : cette liste de vides pilote la suite. Restitue ta compréhension en quelques lignes et laisse-le corriger.

**Propose ensuite le découpage en stories**, et fais-le valider avant d'aller plus loin. Une story est un comportement qu'un utilisateur peut constater, livrable et testable seul, et qui tient dans une PR qu'on relit sans peine ; jamais une story par critère d'acceptation. Pour chacune, propose un titre et un **slug** : c'est ici qu'il se discute, il ne changera plus.

### 2.3 — Écran de chaque story

Pour **chaque** story, détermine si elle a un écran dans Figma, sans le déduire du jet brut.

**Avec `design.md`**, propose plutôt que de demander : soumets les frames repérés en 2.1 avec `AskUserQuestion`, une option par frame candidat plus « pas d'écran ». L'URL d'un nœud se construit depuis celle de la page lue en 2.1 : remplace son `node-id` par l'id du frame, avec un tiret à la place du deux-points (`465:4996` donne `node-id=465-4996`).

**Sans `design.md`**, demande une fois si la feature a des maquettes, puis l'URL du **nœud** de chaque story concernée (clic droit sur le frame, puis *Copy link to selection*).

Pour chaque story qui a un écran, invoque le skill `figma-annotations` avec l'URL du nœud, et garde cette URL pour le frontmatter `figma:` de la story.

### 2.4 — Questions ciblées

Ne pose de questions que sur ce qui manque encore, par lots, avec `AskUserQuestion`.

**Ne pose jamais de question ouverte sur ce qui s'énumère : propose des candidats, que l'utilisateur coche, écarte ou complète.** « Y a-t-il des cas limites ? » obtient toujours un « non » faux. Tire tes candidats :

- des **règles récoltées en 2.3** : les champs requis, les valeurs possibles, les visibilités conditionnelles et les règles de bouton y sont souvent déjà écrits, ne les redemande pas
- du **code existant** : les rôles, les entités, les erreurs et le contrat déjà en place
- des **specs validées précédentes** : le niveau de détail que l'utilisateur attend
- de `WebSearch` sur le domaine de la feature (panier, authentification, paiement…) : les cas limites courants y sont documentés

Les trous à combler avant d'écrire :

- **le problème résolu** : challenge tant que ce n'est pas clair
- **les rôles utilisateurs** : le gabarit impose « En tant que `<rôle>` », ne l'invente pas
- **le hors-périmètre** : propose les extensions naturelles que tu vois venir, l'utilisateur écarte ce qui n'appartient pas à la feature
- **les cas limites et les erreurs attendues** : ils nourrissent les critères et la forme des erreurs du contrat
- **les contraintes** : l'existant à ne pas casser, les dépendances, la volumétrie
- **le critère de réussite** : « à quoi verra-t-on que c'est réussi ? »

**Proportionne la rigueur** : huit critères au plus par story. Regroupe les détails visuels en un seul critère de conformité à la maquette, et réserve les critères qui demandent un test end-to-end aux parcours de l'utilisateur. Au-delà de dix critères, découpe la story.

Chaque critère est **vérifiable** : un comportement observable, pas une intention. « Le panier est performant » n'en est pas un ; « l'ajout répond en moins de 300 ms » en est un.

### 2.5 — Cohérence avec le produit, la stack et l'architecture

Avant d'écrire, confronte la feature à ce qui est déjà décidé :

- **le produit** : sort-elle du périmètre de `product.md`, ouvre-t-elle un nouveau public, contredit-elle le positionnement ? Si oui, invoque le skill `product` en mode amendement, avec la feature. Ne modifie jamais `product.md` toi-même. Si l'amendement est refusé, la feature est hors périmètre : dis-le, et propose de la réduire ou de l'abandonner
- **la stack** : demande-t-elle une capacité que `stack.md` ne couvre pas, comme un paiement, du temps réel, du stockage de fichiers, des emails ou de la recherche ? Si oui, invoque le skill `stack` en mode amendement, avec le besoin
- **l'architecture** : demande-t-elle un module, une app ou une communication entre apps que `architecture.md` ne prévoit pas ? Si oui, invoque le skill `architecture` en mode amendement, avec le besoin

Récapitule, puis demande une confirmation avant d'écrire.

---

## Phase 3 — Écriture

```text
project/specs/
└── cart/                  ← la feature
    ├── README.md          ← son cadrage
    ├── add-item.md        ← une story
    └── update-quantity.md ← une story
```

Écris à partir de la Phase 2. Ne laisse aucune section vide : s'il manque un élément, retourne le demander. En **mise à jour**, modifie l'existant au plus près ; ajouter une story, c'est ajouter un fichier sans toucher aux autres.

### Le cadrage de la feature

`project/specs/<feature>/README.md`, où `<feature>` est le nom de la feature en anglais et en kebab-case. Il porte ce qui vaut pour toutes les stories, et aucune story.

```markdown
---
feature: <nom>
status: draft
---

# <Feature>

## Contexte
…

## Objectif et périmètre
…

## Notes techniques (optionnel)
…
```

Les **notes techniques** renvoient à `stack.md` et `architecture.md` plutôt que de nommer des bibliothèques : une spec dit quoi, jamais avec quoi.

Une nouvelle feature naît en `status: draft`. Le `status` vit **ici seulement** : on valide un cadrage entier, jamais une story isolée. N'ajoute pas d'index des stories : le dossier le donne déjà.

### Une story

`project/specs/<feature>/<story>.md` : c'est ce fichier que l'orchestrateur implémente.

```markdown
---
figma: <URL du nœud de l'écran, si la story en a un>
---

# <Titre lisible>

En tant que <rôle>, je veux <…> afin de <…>.

**Critères d'acceptation :**
- [ ] …
- [ ] …
```

Le **slug**, en anglais et en kebab-case (`add-item`), est l'identifiant de la story : il nomme son fichier et sa branche `<feature>/<story>`. Ne le renomme jamais, même si le titre change : le lien avec la branche et la PR casserait.

Le champ `figma:` porte l'URL du **nœud** de l'écran, qui contient un `node-id`, pas celle du fichier. Laisse-le vide si la story n'a pas d'écran.

---

## Phase 4 — Validation et commit

Présente le cadrage et les stories. Quand l'utilisateur valide, passe le `README.md` de la feature à `status: validated`, puis **commite la feature** :

- bascule sur la branche `<feature>/spec`, en la créant si besoin depuis la branche par défaut du remote, à jour. Pas `<feature>` tout court : git refuse qu'une branche `cart` coexiste avec les branches de story `cart/add-item`
- ajoute le dossier `project/specs/<feature>/` et les fichiers du vault amendés en 2.5, et rien d'autre
- commite-les (`docs(specs): add cart feature`)
- ne pousse pas et n'ouvre pas de PR : la spec rejoindra `main` avec la PR de la première story implémentée

---

## Fin

Propose de passer la main au skill `orchestrator` pour implémenter une première story, désignée par son slug.

**Frontière de session** : donne la commande à lancer (`/moukie:orchestrator <feature>/<story>`), puis, en dernier, propose de vider la conversation (l'outil qui vide la session dans l'app desktop, après accord ; sinon `/clear`).

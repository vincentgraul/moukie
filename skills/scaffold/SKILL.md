---
name: scaffold
description: Génère le code que l'architecture d'un projet prévoit et qui n'existe pas encore : le manifeste racine et ses workspaces, les apps par les générateurs officiels de leurs frameworks, l'emplacement du contrat et, si son format en demande un, le générateur de types de chaque app, les services Docker si la stack les retient. Ne génère que ce qui manque et ne touche jamais au code existant. Se déclenche quand `init` arrive au code, quand l'orchestrateur trouve une app prévue par l'architecture mais absente du code, ou quand l'utilisateur veut générer une app que l'architecture prévoit.
---

# Skill Scaffold

## Règles

Mène les échanges en **français**.
N'écris pas de commentaires dans le code.
Applique le skill `naming-conventions` à tout ce que tu nommes, quand le générateur ne l'impose pas.

Tu **génères**, tu ne décides pas. La structure vient de `project/architecture.md`, les outils de `project/stack.md`. Une app, un dossier ou un outil que ni l'un ni l'autre ne prévoit ne se crée pas : renvoie vers le skill `architecture` ou `stack`.

**Ne génère que ce qui manque.** Ne modifie, ne déplace et ne supprime jamais du code existant. C'est ce qui permet de te relancer sans danger, à chaque fois que l'architecture prévoit quelque chose de nouveau.

**Rien de plus que la structure** : pas de page, pas d'endpoint, pas de logique métier. Le premier code utile arrive avec une story.

Ne commite pas : c'est le rôle de celui qui t'appelle. `init` commite dans sa PR, l'orchestrateur sur la branche de la story, et l'utilisateur lui-même s'il t'a appelé directement.

---

## Phase 1 — Inventaire

Lis `project/architecture.md` (les apps, la stratégie de dépôt, l'emplacement du contrat), `project/stack.md` (les frameworks, l'outil de monorepo, le gestionnaire de paquets), puis l'arborescence du dépôt.

Établis l'écart : ce que l'architecture et la stack prévoient et qui n'existe pas encore. S'il n'y a rien, dis-le et arrête-toi.

Si du code existe mais ne correspond pas à l'architecture (une app à un autre emplacement, un découpage différent), ne le corrige pas : signale l'écart. Le résorber est le travail d'une story.

Résume ce que tu vas créer, puis demande une confirmation avant de générer quoi que ce soit.

---

## Phase 2 — Génération

Dans cet ordre, et seulement ce qui manque :

- le **manifeste racine** du projet (le `package.json` en JavaScript, ou son équivalent), avec ses workspaces si l'architecture retient un monorepo, et la configuration de l'outil de monorepo retenu par la stack
- **chaque app manquante**, à l'emplacement que fixe l'architecture, générée par le **générateur officiel** de son framework quand il en existe un, en mode non interactif, plutôt qu'écrite à la main
- l'**emplacement du contrat**, tel que le fixe l'architecture. Avec Standard Schema, un module vide. Avec OpenAPI ou GraphQL, un fichier source minimal mais valide (une spec OpenAPI sans aucun chemin, un schéma GraphQL réduit à sa racine), pour que la génération puisse être vérifiée dès maintenant. Le skill `contract` le remplira
- si le format du contrat demande une **génération de types** (OpenAPI, GraphQL) : le générateur que la stack retient pour chaque app, installé et configuré pour lire la source du contrat et écrire dans l'app, et une commande qui le lance. Avec Standard Schema, il n'y a rien à générer
- le **`docker-compose.yml`**, si la stack retient Docker : avec les services dont le back a besoin, comme sa base de données. S'il existe déjà, ajoute-y seulement les services qui manquent

---

## Phase 3 — Vérification

Lance l'installation des dépendances, puis vérifie que **chaque app générée démarre** et, s'il y a un générateur de types, que la génération passe sur le contrat minimal.

Si une app ne démarre pas, corrige la génération avant de rendre la main. Si tu n'y arrives pas, dis-le clairement plutôt que de livrer une app cassée.

---

## Fin

Rends la main à l'appelant avec trois listes : ce que tu as créé, les commandes que tu as ajoutées (la génération des types, par exemple), et les écarts que tu as signalés sans y toucher.

Si le `CLAUDE.md` existe déjà, ajoute toi-même ces commandes à sa section « Commandes ». À l'initialisation, c'est `init` qui les y reprend, puisqu'il écrit le `CLAUDE.md` en dernier.

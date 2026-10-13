---
name: workflow-map
description: Régénère la carte du plugin Moukie. Relit tous ses fichiers, reconstruit le fil complet de l'exécution étape par étape (ce qui entre, l'étape, ce qui sort), relève les écarts entre ce que les fichiers promettent et ce qu'ils font, puis rend la page publique du site dans `docs/` et la publie en artifact. Les écarts restent dans les données et dans le résumé, jamais sur la page. Se déclenche quand l'utilisateur veut mettre à jour, régénérer ou revoir la carte du plugin, ou auditer son fonctionnement de bout en bout.
---

# Skill Workflow map

## Règles

Mène les échanges en **français**.

La carte décrit le plugin **tel que ses fichiers le demandent**, pas tel que tu t'en souviens. Relis chaque fichier en entier à chaque régénération : jamais de mémoire, jamais à partir de la carte précédente.

N'y mets que ce qu'un fichier dit. Une étape que tu ne peux pas rattacher à un passage précis d'un fichier n'existe pas.

Ce skill ne modifie **pas** le plugin et ne commite rien. Les écarts que tu relèves vont dans les données de la carte et dans ton résumé final ; c'est à l'utilisateur de décider s'ils doivent être corrigés.

La page est la page publique du site de Moukie : elle ne montre ni les écarts ni d'inventaire, et suit les couleurs du site (rose `#FFCBF0`, noir `#1B1919`), fixées dans `render.py`.

### Les fichiers

| Fichier | Rôle |
|---|---|
| `docs/workflow-map.json` | les données de la carte, versionnées : c'est le seul fichier que tu mets à jour |
| `docs/workflow-map.html` | la page publique, générée : ne l'édite jamais à la main |
| `.claude/skills/workflow-map/render.py` | le rendu, qui refuse des données incohérentes |

---

## Phase 1 — Relecture

Lis **en entier** :

- `skills/*/SKILL.md` et les `references/` qu'ils chargent. Pour `feature-sliced-design`, seul l'en-tête compte : ses références sont la méthodologie FSD recopiée telle quelle, pas le fonctionnement du plugin
- `agents/*.md`
- `hooks/hooks.json` et `.claude-plugin/*.json`
- `README.md`

Lis ensuite `docs/workflow-map.json` : il te sert à mesurer ce qui a changé, jamais de source.

---

## Phase 2 — Reconstruction du fil

Ces conventions ont été fixées avec l'utilisateur. Elles ne se renégocient pas d'une régénération à l'autre :

1. **L'ordre d'exécution réel**, pas l'ordre des fichiers. Une phase par cadence : une fois par projet (`setup`), une fois par feature (`spec`), une fois par story (`orchestrator`), puis ce qui se lance à tout moment. Ce qui s'applique partout sans être une étape va dans `always`.
2. **Chaque entrée apparaît à l'étape exacte qui la consomme**, chaque sortie à l'étape qui la produit. Dans `spec`, Figma n'entre qu'à l'étape des maquettes, jamais au début : c'est l'utilisateur qui est l'entrée de `spec`.
3. **Un skill appelé se déroule sur place** : une étape parente dans le fil principal, puis un bloc `call` dont les sous-étapes sont numérotées `N.1`, `N.2`… à partir du numéro de la parente. Deux appels consécutifs après la même parente continuent la même numérotation.
4. **Tout ce qui dépend d'un cas porte sa condition** (`cond`), formulée comme le fichier la pose : « si front et back », « si écran ». Un appel conditionnel porte la condition sur le bloc.
5. Une **décision** a `kind: "dec"` et un titre qui commence par ◆. Une **boucle de retour** a `kind: "loop"` et le numéro `↻` ; elle se place au moment où elle peut survenir.
6. Chaque étape nomme son origine dans `who` : le skill ou l'agent, et sa phase.

Les types d'étiquettes, pour `in` et `out` :

| Type | Pour |
|---|---|
| `toi` | ce que l'utilisateur apporte ou décide |
| `figma` | ce qui vient du MCP Figma |
| `web` | ce qui vient d'une recherche web |
| `lit` | un fichier lu |
| `skill` | un skill de connaissance chargé |
| `recu` | ce qu'une étape reçoit d'une étape précédente |
| `ecrit` | un fichier écrit |
| `git` | une branche, un commit, une fusion |
| `forge` | un appel à la CLI de la forge (GitHub, GitLab…) |
| `notif` | une notification envoyée |
| `rend` | ce qu'une étape rend à l'utilisateur ou à son appelant |

---

## Phase 3 — Audit

En reconstruisant le fil, relève chaque **écart** :

- une promesse sans mise en œuvre (un fichier annonce un comportement qu'aucun autre ne réalise)
- une information utilisée là où elle n'est pas disponible (un fichier non commité lu dans un worktree, un lien jamais transmis)
- une étape implicite, que le fil suppose sans qu'aucun fichier ne la demande
- une contradiction entre deux fichiers

Chaque écart devient un élément de `findings.items`, sans `fix`, du plus grave au plus mineur. Ces écarts ne s'affichent pas sur la page : le script de rendu les liste, et tu les reprends dans ton résumé. Un écart de la carte précédente qui a disparu des fichiers y reste **une fois**, avec son `fix` décrivant la correction et l'étape qui la montre ; à la régénération suivante, il sort de la liste.

Garde-toi d'inventer des écarts pour remplir la liste : si le fil tient, elle est vide.

---

## Phase 4 — Rendu

Mets d'abord à jour `date` et `version` dans les données : la version est celle de `.claude-plugin/plugin.json`, et les deux s'affichent en pied de page. Puis lance :

```sh
python3 .claude/skills/workflow-map/render.py docs/workflow-map.json docs/workflow-map.html
```

Le script refuse de produire la page si la numérotation saute, si une sous-étape n'est pas rattachée à sa parente, si une étiquette est d'un type inconnu, ou si le HTML est déséquilibré. Corrige les données et relance jusqu'à ce qu'il passe.

---

## Phase 5 — Publication

Publie `docs/workflow-map.html` avec l'outil Artifact, sur la page existante :

```text
https://claude.ai/artifact/UFshw22hGHQNYRWRzUJWWz
```

Lis-la d'abord (`action: "read"`), puis publie en passant cette URL dans `url` : sans elle, une nouvelle page serait créée et l'ancienne resterait périmée. Si l'outil Artifact n'est pas disponible dans la session, arrête-toi à `docs/` et dis-le.

Termine par un résumé de ce qui a changé depuis la carte précédente : étapes ajoutées ou retirées, et les écarts, nouveaux, ouverts ou corrigés, tels que le script les liste. Ne commite pas : c'est l'utilisateur qui le fait.

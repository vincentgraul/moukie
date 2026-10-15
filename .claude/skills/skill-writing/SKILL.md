---
name: skill-writing
description: Écrit, relit ou raccourcit les fichiers du plugin Moukie destinés à Claude, c'est-à-dire les `SKILL.md`, leurs `references/` et les fichiers d'agents, selon le guide d'Anthropic, le style rédactionnel de Moukie et ses règles de nommage. Se déclenche dès qu'on crée, modifie, raccourcit ou relit un skill ou un agent de `skills/` ou `agents/`, même pour ajouter une seule consigne, et quand on veut réduire ce qu'un skill coûte en tokens.
---

# Skill Skill writing

## Règles

Échange dans la langue du projet, notée dans le `CLAUDE.md`. Les fichiers du plugin, eux, s'écrivent en **français**, leur langue source : le site les traduit en anglais.

Les noms sont en **anglais** et en kebab-case : fichiers, dossiers, références, branches et commits.

---

## Ce qui coûte

Un `SKILL.md` invoqué se charge **en entier** et reste dans le contexte jusqu'à la fin de la conversation. Son coût, c'est sa taille multipliée par le nombre de fois où il se charge : l'orchestrateur et les agents se rechargent à chaque story, `setup` une fois par projet. Raccourcis d'abord ce qui se charge souvent.

- **N'écris que ce que Claude ne sait pas déjà.** Il connaît git, les conventional commits et les bonnes pratiques de son métier : décris ce qui est propre à Moukie.
- **Le `SKILL.md` porte le chemin courant.** Un cas rare (un mode peu utilisé, un blocage, une variante multi-apps) va dans `references/`, avec un déclencheur explicite à l'endroit où on y entre : « Si la story touche plusieurs apps, **lis `references/multi-apps.md`** avant d'aller plus loin ». Un simple renvoi en fin de fichier ne serait jamais suivi.
- **Ne répète pas le `CLAUDE.md`.** Il est chargé à chaque session : ses interdits (commits, `main`, `--no-verify`, commentaires, noms en anglais) n'ont pas à revenir dans chaque skill. Seuls `setup`, qui tourne avant qu'il existe, et les agents gardent les leurs.
- **Une raison par consigne, au plus, et courte.** Garde-la quand elle évite une erreur déjà vue ou aide Claude à généraliser ; coupe-la quand elle ne fait que plaider. Une majuscule d'insistance ou un « toujours » en gras signale une raison manquante : écris la raison.
- **Une seule source par information.** Si deux skills disent la même chose, l'un renvoie à l'autre ou au fichier du vault qui la porte.

---

## Structure

Un skill du plugin suit ce squelette, en sautant ce qui ne le concerne pas :

```markdown
---
name: <nom-en-anglais>
description: <ce qu'il fait>. Se déclenche quand <situations>.
metadata:
  moukie-badge: "<badge>"
  moukie-icon: "<icône Lucide>"
  moukie-rank: "<entier>"
  moukie-summary: "<une phrase courte pour la carte du site>"
  moukie-produces: "<ce qu'il produit>"
---

# Skill <Nom>

## Règles

## Mode            (s'il y en a plusieurs)

## Phase 1 — <Titre>

## Fin              (avec la frontière de session, s'il en a une)
```

Les sections de premier niveau sont séparées par `---`. Un agent commence par `# Agent <Nom>`, puis « Tu es l'agent **<nom>** : … », et son frontmatter ajoute `tools`, `model` et `color`.

### La `description`

C'est elle seule qui décide du déclenchement : elle dit ce que fait le skill **et** quand l'utiliser, situations concrètes comprises (« Se déclenche quand… » pour un skill, « À utiliser… » pour un agent). Tout ce qui dit « quand » va là, pas dans le corps.

### Les métadonnées et le site

Le site lit le frontmatter au build, et `bun run check` le valide :

- `moukie-badge` : `project`, `feature`, `story`, `lane`, `review` ou `knowledge`. Un skill `knowledge` n'apparaît pas sur le site et n'a besoin d'aucune autre clé
- `moukie-icon` : un nom d'icône Lucide ; `moukie-rank` : un entier
- `moukie-summary` et `moukie-produces` sont traduits dans `docs/content/en/<skills|agents>/<nom>.json`. Si tu en modifies un, mets à jour sa traduction et son `sourceHash`, le SHA-256 du texte français exact : `printf '%s' "<texte>" | shasum -a 256`

---

## Style

- **Tutoiement et impératif** : « Lis la story », pas « Il faut lire la story »
- **Une idée par phrase**, des phrases courtes. Une liste dès qu'il y a trois éléments parallèles
- **Le gras** pour le mot qui porte la consigne, jamais pour une phrase entière
- **Le code** pour les fichiers, les commandes, les clés, les skills et les agents : `spec`, `reviewer`, `project/stack.md`
- **Typographie française** : une espace avant `:`, `;`, `?` et `!`, les guillemets « », pas de point à la fin d'une puce. Le tiret cadratin ne sert que dans les titres de phase
- **Un mot par notion**, toujours le même : story, lane, vault, spec, contrat, orchestrateur. Un synonyme laisse croire à une autre notion
- **Ce qu'il faut faire** plutôt que ce qu'il faut éviter, sauf pour un garde-fou
- **Ce qui s'énumère se propose** : un skill qui interroge l'utilisateur lui soumet des candidats à cocher, jamais une question ouverte

---

## Exemples

**Une justification qui plaide**

Avant :
> Restitue ta compréhension en quelques lignes et laisse-le corriger. Un malentendu attrapé ici ne se propage ni dans les stories, ni dans le contrat, ni dans les tests.

Après :
> Restitue ta compréhension en quelques lignes et laisse-le corriger.

**Une raison qui évite une erreur, gardée**

> Garde les **trois points** : ils ne montrent que ce que la lane a changé depuis son départ. Avec deux points, un contrat amendé légitimement sur la branche de la story ferait bloquer la lane à tort.

**Un cas rare sorti du chemin courant**

Avant : quatre sections de blocages, une trentaine de lignes, chargées à chaque story.

Après, dans le `SKILL.md` :
> Si un agent remonte un besoin qu'il ne doit pas trancher seul (changement de contrat, information manquante dans la story, bibliothèque absente de la stack, module absent de l'architecture), **lis `references/blockers.md`** et suis la procédure du cas.

---

## Vérification

Après chaque modification :

1. Cherche les appelants (`grep -rn "<nom>" skills agents .claude/skills`) : un autre skill qui cite une phase, un mode ou un fichier que tu as renommé doit suivre.
2. Vérifie que chaque `references/…` cité existe.
3. Lance `bun run check`, qui valide les métadonnées et les traductions, puis `claude plugin validate .`.
4. Pour un raccourcissement, compare les mots avant et après (`git show HEAD:<fichier> | wc -w` et `wc -w <fichier>`), et donne le chiffre.

Une PR qui modifie le plugin monte la version mineure de `.claude-plugin/plugin.json` une fois : Claude Code range les plugins installés par version, sans elle les utilisateurs ne reçoivent rien. Si la version de la branche dépasse déjà celle de `origin/main`, une PR précédente encore ouverte l'a montée : ne la remonte pas. Si le fil d'exécution change (une phase, un mode, un appel entre skills), signale que la carte du site est à régénérer avec `workflow-map`.

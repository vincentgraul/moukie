---
name: scaffold
description: Initialise toute la configuration Claude Code d'un projet via un entretien guidé. Se déclenche quand l'utilisateur souhaite créer un nouveau projet ou configurer Claude Code dans un projet existant, afin de générer un CLAUDE.md de qualité plus les subagents, skills, hooks et settings nécessaires.
---

# Scaffolding du projet

Mène un entretien puis génère une configuration `.claude/` complète pour les besoins du projet.
Déroule les phases dans l'ordre et mène l'entretien en **français**.
Pose un lot de questions à la fois avec l'outil `AskUserQuestion`.
Ne déverse jamais toutes les questions d'un coup, et n'écris aucun fichier tant que l'entretien n'est pas terminé et confirmé.
 **Utilise WebSearch durant l'entretien afin d'être à jour pour proposer les meilleurs pratiques**

---

## Phase 0 — Détection du contexte

Avant de poser quoi que ce soit, regarde le repository pour que les questions soient
pré-remplies plutôt que génériques :

- Lance `ls -la` et lis `package.json`, `tsconfig.json`, `README` et les fichiers dans le `.claude/`.
- Détecte le gestionnaire de paquets, le bundler, le test runner, le framework, s'il s'agit d'une application ou d'une bibliothèque, et si un `CLAUDE.md` existe déjà.

Résume en une ou deux lignes ce que tu as détecté, puis démarre l'entretien en proposant
tes valeurs détectées comme valeurs par défaut, pour que l'utilisateur confirme au lieu
de tout taper.

---

## Phase 1 — Entretien

Pose les questions par lots. Laisse toujours l'utilisateur remplacer les valeurs par défaut.
Saute toute question déjà résolue par la Phase 0. 
À la fin de l'entretien récapitule et demande une confirmation avant d'écrire quoi que ce soit.

### Lot A — Identité
- Nom du projet
- Type : application web / application mobile / e-commerce / librairie de composants / CMS / autre
- Commercial ou non
- Description du projet (**tu te dois de poser des questions si la description du projet ne te semble pas suffisamment clair**)

### Lot B — Stack

Voici la stack que j'utilise généralement sur mes projets **mais sens toi libre de proposer autre chose si plus moderne il y a :**
- Le langage sera du `TypeScript` en front comme en back
- Pour un projet front web il sera en `React`. Pour un projet front mobile il sera en `React native`
- On construira un design system. Pour le construire on utilisera ma bibliothèque `Empreint` (https://github.com/vincentgraul/empreint)
- Le linter et formatter sera `Biome`
- Pour un projet e-commerce on utilisera `Shopify`

Pour le reste de la stack il est probable que je ne sache pas précisément vers quoi m'orienter. Fais moi des propositions jusqu'à ce qu'on définise ensemble la bonne stack pour mon projet. Sois complet (front, back, tests, devops, hébergement, coût...)

### Lot C — Outils externes
- **Github** : Assure toi que le CLI `gh` soit bien installé. J'utilise un compte `Github Free`
- **Figma** : Assure toi que le MCP Figma soit bien connecté. Demande l'url du projet Figma pour y analyser les maquettes. J'utilise un compte `Figma Professionnel License Full`
- **Jira** : Assure toi que le MCP Jira soit bien connecté. Demande l'url du projet Jira. J'utilise un compte `Jira Free`

### Lot D — Workflow
- Utilise le workflow `spec-driven`
- Utilise le `git conventional commit`
- Liste les subagents qui seront requis au projet. J'ai déjà configuré un ensemble d'agents: `front-web`, `front-mobile`, `backend`, `QA`, `devops`, `reviewer`. **Sens toi libre d'en proposer d'autre**

---

## Phase 2 — Génération du settings.json

Écris `.claude/settings.json` à la racine du repository. **Lis-le d'abord s'il existe déjà et fusionne** — n'écrase jamais des tableaux `allow`/`deny`/`ask` ou `hooks` existants, ajoute aux tableaux.

Rappel : un `settings.json` est du **JSON strict, sans commentaires**. Les exemples ci-dessous sont illustratifs ; remplace les noms de serveurs MCP (`mcp__figma__*`, `mcp__jira__*`) par ceux réellement détectés en Phase 0 / Lot C.

### Permissions

Applique ces règles par défaut :

- **Figma : lecture autorisée, écriture interdite** → `deny` sur les outils d'écriture, `allow` sur la lecture.
- **Jira : lecture autorisée, écriture avec permission** → `ask` sur les outils d'écriture.
- **GitHub : ne jamais merger les PR**

```json
{
  "permissions": {
    "allow": [
      "mcp__figma__get_design_context",
      "mcp__figma__get_screenshot",
      "mcp__figma__get_metadata",
      "mcp__figma__get_variable_defs"
    ],
    "deny": [
      "mcp__figma__create_new_file",
      "mcp__figma__use_figma",
      "mcp__figma__upload_assets",
      "mcp__figma__generate_diagram",
      "Bash(gh pr merge:*)"
    ],
    "ask": [
      "mcp__jira__createJiraIssue",
      "mcp__jira__editJiraIssue",
      "mcp__jira__transitionJiraIssue",
      "mcp__jira__addCommentToJiraIssue"
    ]
  }
}
```

### Hook anti-commit sur `main` ou `master`

**Ne génère pas ce hook par projet** : il est fourni de façon universelle par le plugin `claude-workflow` (`hooks/hooks.json`) et s'applique partout où le plugin est activé. Vérifie simplement que le plugin est installé ; sinon, signale-le.

### Hook de formatage Biome

Hook `PostToolUse` sur `Write|Edit` qui lance Biome sur le fichier écrit. `--files-ignore-unknown=true` ignore les fichiers que Biome ne gère pas, et `|| true` empêche le hook de bloquer en cas d'erreur. **Adapte l'invocation** au gestionnaire de paquets détecté :

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; npx @biomejs/biome format --write --files-ignore-unknown=true \"$f\"; } 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

Avant d'écrire, **pipe-teste** chaque hook (synthétise le JSON stdin attendu et vérifie l'effet réel), puis valide le JSON final avec `jq`. Préviens l'utilisateur qu'il peut devoir ouvrir `/hooks` une fois pour que la config soit rechargée.

---

## Phase 3 — Mise en place des subagents

Assure toi que tu as bien accès aux subagents requis, sinon signal le.
Utilise les subagents en prenant en compte ces règles:

- Les subagents writers seront isolés par **worktree**, avec leurs permissions d'**écriture (`Write`/`Edit`) pré-autorisées** pour qu'ils avancent sans s'interrompre
- Le travail des subagents en parallèle est piloté par le skill `orchestrator`, autour d'un contrat d'interface géré par le skill `contract`
- Un subagent est autonome, il n'a pas besoin de moi pour avancer dans son travail

---

## Phase 4 — Utilisation des skills de workflow

Assure toi que tu as bien accès aux skills suivant: `spec`, `jira`, `contract`, `orchestrator`, `pr`

---

## Phase 5 — Génération du CLAUDE.md

Génère le `CLAUDE.md` **en dernier**, une fois la stack, les permissions/hooks, les subagents et les skills de workflow définis, pour qu'il puisse les documenter fidèlement.

Écris le `CLAUDE.md` à la racine du repository. Garde-le **sous ~150 lignes**.
Utilise le cadre WHAT / WHY / HOW.
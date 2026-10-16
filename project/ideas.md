# Idées

## Traductions dans le workflow
*Notée le 2026-10-13*

- **Problème** : un projet Moukie multilingue gère ses traductions à la main, sans garantie qu'elles suivent leur source. Le site de docs a sa propre solution, mais elle ne sert qu'à lui
- **Piste** : faire entrer l'i18n dans le workflow, de `stack` à `spec` et aux agents, éventuellement par un skill dédié qui traduit le contenu dans la PR et garde l'empreinte du texte source, pour qu'un contrôle échoue dès qu'une traduction prend du retard
- **Complexité** : moyenne, plusieurs skills et agents à toucher, et un contrôle à rendre générique quelle que soit la stack
- **Coût de fonctionnement** : aucun
- **Questions ouvertes** : un skill dédié ou une consigne dans les skills existants ? Comment rendre le contrôle d'empreinte indépendant de la stack ?

## Versions et changelog du plugin automatisés
*Notée le 2026-10-13*

- **Problème** : la version de `.claude-plugin/plugin.json` se monte à la main dans chaque PR. Un oubli prive les utilisateurs de la mise à jour, car Claude Code range les plugins installés par version
- **Piste** : release-please, qui lit les conventional commits, monte `plugin.json` par ses `extra-files` et ouvre une PR de release que l'utilisateur merge
- **Complexité** : faible, un workflow GitHub Actions et sa configuration
- **Coût de fonctionnement** : aucun
- **Questions ouvertes** : publier un `CHANGELOG.md` dans le dépôt, alors que le changelog est hors du périmètre du site ? Passer par le skill `stack`, en amendement, et le consigner dans `project/decisions.md`

## Preview en ligne par PR
*Notée le 2026-10-13*

- **Problème** : pour essayer une story, il faut la lancer en local. Le lien local en fin de feature existe, mais rien ne permet d'essayer une PR sans cloner le dépôt
- **Piste** : un déploiement de preview par PR, dont le lien s'ajoute à la PR
- **Complexité** : moyenne, GitHub Pages ne sert qu'une version du site, donc il faut un autre hébergeur pour les previews
- **Coût de fonctionnement** : à vérifier, selon l'hébergeur de previews retenu
- **Questions ouvertes** : quel hébergeur ? À trancher avec la feature de mise en ligne

## Vidéo de démo de la story
*Notée le 2026-10-13*

- **Problème** : pour voir ce qu'une story a changé à l'écran, il faut la lancer soi-même
- **Piste** : un skill qui enregistre une vidéo des critères d'acceptation exercés, par l'enregistrement vidéo des tests end-to-end, et la joint à la PR
- **Complexité** : moyenne, `gh` ne joint pas de fichier à une PR, il faut passer par un artefact GitHub Actions ou une branche dédiée
- **Coût de fonctionnement** : aucun
- **Questions ouvertes** : où stocker la vidéo ? Pour quelles stories, puisque seules les stories visuelles en profitent ?

## Libellé du Select d'Empreint au pré-rendu
*Notée le 2026-10-14*

- **Problème** : le `Select` d'Empreint ne remplit son libellé qu'après l'hydratation : déclencheur vide au pré-rendu, décalage de 30 px, et pas de nom accessible pour le `LanguageSelector`. Le site le contourne dans `docs/src/app/layout/app-language-selector.tsx`
- **Piste** : corriger Empreint (`vincentgraul/empreint`). `SelectTrigger` accepte des `children` qui remplacent le libellé, `LanguageSelector` y passe l'icône de la langue courante et reçoit un `label` pour son `aria-label`. Une fois publié, monter `@empreint/ui` dans `docs/` et retirer le contournement, en gardant le test de stabilité de l'en-tête
- **Complexité** : faible, un composant dans un autre dépôt, puis une montée de version ici
- **Coût de fonctionnement** : aucun
- **Questions ouvertes** : aucune

# Market

Le site documente le plugin Moukie : ses alternatives sont celles du plugin. Ce sont les workflows avec lesquels un développeur le comparera en arrivant.

## Alternatives
| Nom | Type | Forces | Faiblesses | Source (date) |
|---|---|---|---|---|
| Superpowers | Framework de skills pour Claude Code, open source | Très adopté (environ 166k étoiles selon une liste tierce), conseillé aux devs solo sur un seul dépôt, skills appliqués comme des workflows obligatoires | Pas d'implémentation parallèle par app contre un contrat, pas de lien avec les maquettes | [DataCamp](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code), [LibHunt](https://www.libhunt.com/compare-superpowers-vs-spec-kit) (2026-10-13) |
| GitHub Spec Kit | Toolkit spec-driven, MIT | Porté par GitHub, environ 90k étoiles en avril 2026, specs lisibles hors de Claude Code | Agnostique de l'agent, sans orchestration multi-app | [DataCamp](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code) (2026-10-13) |
| BMAD-METHOD | Méthode qui simule une équipe agile d'agents | Rôles complets, adaptée aux gros projets (environ 45k étoiles selon une liste tierce) | Process lourd pour un dev solo | [Medium](https://medium.com/@visrow/a-tale-of-two-frameworks-bmad-method-vs-github-spec-kit-c021ab0ad037), [LibHunt](https://www.libhunt.com/compare-superpowers-vs-BMAD-METHOD) (2026-10-13) |
| claude-corps | Plugin Claude Code d'agents parallèles | Plusieurs agents sur des branches isolées, sous un orchestrateur | Pas centré sur la spec ni sur les maquettes | [Claude Plugin Hub](https://www.claudepluginhub.com/marketplaces/josephneumann-claude-corps) (2026-10-13) |
| The Agentic Startup | Framework spec-driven pour Claude Code | Skills de spec, coordination d'agents parallèles, quality gates | Positionnement « équipe agile », proche de BMAD | [GitHub topics](https://proxy-dev.blitzz.co/proxy/123456/github.com/topics/claude-code-subagents) (2026-10-13) |

Les nombres d'étoiles viennent de listes tierces et vieillissent vite.

## Points de douleur relevés
- Le cœur de cible, le dev solo, est déjà orienté vers Superpowers par les tutoriels : le site doit dire dès l'accueil pourquoi choisir Moukie.
- Aucune alternative relevée ne part des maquettes Figma ni ne code chaque app en parallèle contre un contrat gelé.
- Le README actuel ne montre ni le workflow complet ni l'état réel du plugin.

## Positionnement
**De la maquette à la PR, multi-app, en solo.** Moukie part des maquettes Figma et de leurs annotations, code le front web, le front mobile et le back en parallèle contre un contrat gelé, et rapporte une PR que l'utilisateur merge. Les specs vivent dans un vault Obsidian versionné avec le code.

L'accroche générique « Your IA companion » des maquettes ne porte pas ce positionnement : l'accueil doit le dire.

## Licence et soutenabilité
- **Licence** : MIT, pour tout le dépôt, plugin et site. Permissive, elle maximise l'adoption visée.
- **Maintenance** : un mainteneur unique. Les contributions externes sont bienvenues, sans être attendues.
- Avec un seul mainteneur, une doc qu'il faudrait réécrire à la main dériverait : la référence doit venir des fichiers du plugin.

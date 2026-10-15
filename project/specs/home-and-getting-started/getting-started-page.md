---
figma: https://www.figma.com/design/Lm9h3j5XNo3oaWfYP4ofVd/Moukie?node-id=5-405
---

# Page Getting started

En tant que développeur qui veut essayer Moukie, je veux savoir ce qu'il me faut et copier les commandes d'installation, afin de l'installer sans chercher ailleurs.

**Critères d'acceptation :**
- [ ] `/moukie/fr/getting-started/` affiche, dans la mise en page commune, le titre « Getting started », puis l'introduction : « Moukie est un plugin Claude Code qui t'accompagne de l'idée à la pull request. Tu cadres, il code chaque app en parallèle contre un contrat partagé, puis il te rapporte la PR : c'est toi qui merges. »
- [ ] La section « Prérequis » affiche « Avant de commencer, vérifie que tu as installé : », puis la liste : « Claude Code », « gh (pour GitHub) ou glab (pour GitLab), authentifié », « le MCP Figma, si ton projet a des maquettes ».
- [ ] La section « Installation » affiche `claude plugin marketplace add vincentgraul/moukie` puis `claude plugin install moukie@vincentgraul`, chacune dans un bloc de code, suivies de « Moukie est chargé à ta prochaine session Claude Code. »
- [ ] La section « Mise à jour » affiche `claude plugin marketplace update vincentgraul` puis `claude plugin update moukie@vincentgraul`.
- [ ] Chaque bloc a un bouton de copie, atteignable au clavier, qui place la commande exacte dans le presse-papiers. L'icône devient une coche pendant 2 secondes, et « Copié » est annoncé aux lecteurs d'écran. Le texte de la commande reste sélectionnable à la main.
- [ ] `/moukie/en/getting-started/` affiche la page en anglais : sections « Requirements », « Installation » et « Update », introduction, prérequis et ligne d'après installation traduits, commandes identiques.
- [ ] L'entrée Getting started de la barre latérale et du menu mobile est active et mène à cette page ; seule Workflow map reste désactivée. La page est pré-rendue, déclare la langue de sa page, et son onglet s'intitule « Getting started · Moukie ».
- [ ] Sur desktop, le rendu correspond à la maquette : polices, tailles, couleurs, séparateurs de section, blocs de code. Seuls les titres de section en français, les prérequis et les commandes en diffèrent.

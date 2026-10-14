# Blocages

Quand la décision revient à l'utilisateur, notifie-le, puis attends sa réponse.

---

## Changement de contrat

Si un agent remonte un besoin de changement de contrat, applique l'évolution contrôlée du skill `contract` :

1. **Suspends** le travail parallèle sur les parties concernées.
2. Amende la **source** du contrat sur la branche de la story, jamais dans un worktree, et **commite-la** : les lanes ne voient le changement qu'à travers ce commit.
3. Les lanes **rebasent** sur la branche de la story, et régénèrent leurs types si le format le demande.
4. **Relance** le travail parallèle.

Tu peux appliquer seul un changement mineur. Un changement structurant, ou qui touche un choix produit, attend la décision de l'utilisateur.

---

## Story incomplète

Si `contract` ou un agent signale qu'il manque à la story une information (une valeur, une règle, un cas d'erreur), ne la fais pas inventer : notifie l'utilisateur. La story repasse par le skill `spec`, en mise à jour, qui la complète et la commite sur `<feature>/spec`. Fais ensuite rebaser la branche de la story sur `<feature>/spec` avant de reprendre.

---

## Bibliothèque absente de la stack

Ni l'agent ni toi ne tranchez : notifie l'utilisateur. S'il accepte d'étudier l'ajout, invoque le skill `stack` en mode challenge, sur ce domaine seulement. Une fois `stack.md` à jour, commite-le sur la branche de la story et fais rebaser la lane concernée avant de la reprendre.

---

## Module absent de l'architecture

Notifie l'utilisateur. S'il accepte, invoque le skill `architecture` en mode amendement, en lui transmettant le besoin. Une fois `architecture.md` à jour, commite-le sur la branche de la story et fais rebaser la lane concernée avant de la reprendre.

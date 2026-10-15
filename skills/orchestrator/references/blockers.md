# Blocages

Quand la décision revient à l'utilisateur, notifie-le, puis attends sa réponse.

---

## Changement de contrat

Tu décides seul d'un changement mineur. Un changement structurant, ou qui touche un choix produit, attend la décision de l'utilisateur. Ensuite :

1. **Suspends** le travail parallèle sur les parties concernées.
2. Invoque le skill `contract`, qui amende la **source** du contrat sur la branche de la story, puis **commite-la** : les lanes ne voient le changement qu'à travers ce commit.
3. Fais **rebaser** les lanes sur la branche de la story ; elles régénèrent leurs types si le format le demande.
4. **Relance** le travail parallèle.

---

## Story incomplète

Si `contract` ou un agent signale qu'il manque à la story une information (une valeur, une règle, un cas d'erreur), ne la fais pas inventer : notifie l'utilisateur. La story repasse par le skill `spec`, en mise à jour, qui la complète et la commite sur `<feature>/spec`. Fusionne ensuite `<feature>/spec` dans la branche de la story avant de reprendre : un rebase réécrirait les commits des stories sur lesquelles elle s'empile.

---

## Bibliothèque absente de la stack

Ni l'agent ni toi ne tranchez : notifie l'utilisateur. S'il accepte d'étudier l'ajout, invoque le skill `stack` en mode amendement, en lui transmettant le besoin. Une fois `stack.md` à jour, commite-le sur la branche de la story et fais rebaser la lane concernée avant de la reprendre.

---

## Module absent de l'architecture

Notifie l'utilisateur. S'il accepte, invoque le skill `architecture` en mode amendement, en lui transmettant le besoin. Une fois `architecture.md` à jour, commite-le sur la branche de la story et fais rebaser la lane concernée avant de la reprendre.

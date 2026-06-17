# Affiliation réseau via Groupement, pas PharmacyType.GROUPE

La spec initiale dupliquait l'affiliation réseau : `PharmacyType.GROUPE` et `groupementId` répondaient à la même question (« cette pharmacie est-elle dans un réseau ? »).

Décision : supprimer `GROUPE` de `PharmacyType`. L'affiliation à un réseau (Giphar, Alphega, etc.) se déduit uniquement de la présence d'un `groupementId`. `PharmacyType` ne distingue plus que INDEPENDANTE et CLINIQUE.

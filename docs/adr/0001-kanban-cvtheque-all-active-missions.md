# Kanban CVthèque affiche toutes les missions actives

La spec initiale prévoyait une « mission active courante » par carte candidat dans le kanban CVthèque. Lors du grill domaine, on a rejeté cette notion : un candidat peut être positionné sur plusieurs Missions en parallèle, et masquer les autres missions sur la carte fausse la réalité opérationnelle.

Décision : chaque carte kanban CVthèque affiche le candidat et ses missions actives uniquement — `Mission.status` ∉ {POURVU, ANNULEE} et stage ∉ {Placé, Pas retenu}. Le drag-and-drop utilise un handle par mission sur la carte.

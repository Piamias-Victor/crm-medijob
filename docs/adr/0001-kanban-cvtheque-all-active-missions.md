# Kanban CVthèque affiche toutes les missions actives

La spec initiale prévoyait une « mission active courante » par carte candidat dans le kanban CVthèque. Lors du grill domaine, on a rejeté cette notion : un candidat peut être positionné sur plusieurs Missions en parallèle, et masquer les autres missions sur la carte fausse la réalité opérationnelle.

Décision : chaque carte kanban CVthèque affiche le candidat et la liste de toutes ses missions actives (MissionCandidate), sans hiérarchie ni mission « principale ». Le drag-and-drop de stage doit cibler explicitement une MissionCandidate (sélecteur ou zone par mission sur la carte) pour éviter l'ambiguïté quand plusieurs missions sont actives.

# Pipeline comme contexte autonome

Le suivi d'avancement candidat sur une mission implique deux concepts (`PipelineStage` et `MissionCandidate`) qui relient Candidates et Missions sans appartenir pleinement à l'un ou l'autre.

Décision : Pipeline est un bounded context à part, propriétaire de PipelineStage (configuration des étapes) et MissionCandidate (positionnement candidat + étape). Les contextes Candidates et Missions y référencent par identifiant ; le cycle de vie de la mission (Mission status) reste dans Missions.

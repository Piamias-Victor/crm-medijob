# PipelineStage sans enum sémantique fixe

La spec définissait un `enum PipelineStageType` (NOUVEAU, CONTACTE, etc.) en parallèle d'un modèle `PipelineStage` à nom libre et administrable — l'enum n'était rattaché à aucun champ.

Décision : supprimer `PipelineStageType`. Les étapes de pipeline sont identifiées uniquement par `name` + `position`, configurables en admin. Les seeds initialisent les 5 noms par défaut ; les recruteurs peuvent les renommer ou en ajouter.

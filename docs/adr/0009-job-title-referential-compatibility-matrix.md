# JobTitle référentiel administrable avec matrice de compatibilité

L'enum `JobTitle` figé ne permettait pas d'adapter les métiers au fil du temps, et la Mission n'avait pas de champ métier structuré pour le matching.

Décision : remplacer l'enum par un modèle `JobTitle` administrable (CRUD `/admin/metiers`), référencé par `Candidate.jobTitleId` et `Mission.jobTitleId`. Le pré-filtrage matching s'appuie sur `JobTitleCompatibility` (matrice paramétrable : métier mission → métiers candidats acceptés).

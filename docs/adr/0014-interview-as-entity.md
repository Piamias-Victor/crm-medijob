# Interview as a first-class entity

medijob-eval stored evaluations outside the CRM. Putting answers as JSON on Candidate would mix qualification history with identity data and block multiple closed Interviews.

Decision: **Interview** is its own persisted entity related to Candidate (`candidateId`, optional `referentId`). Status DRAFT | CLOSED, mode INTERIM | CDD_CDI, optional decision, answers/scores JSON. InterviewTemplate holds versioned trames (`profileKey` × mode). JobTitle.profileKey links a métier to a trame (nullable — Autre has none). Admin CRUD for mapping/criteria is a follow-up.

Interview ≠ PipelineStage « Entretien » ≠ Application.

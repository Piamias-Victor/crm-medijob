# Fusion Application → Candidate avec écran de revue

Lorsqu'une candidature site matche un Candidate existant et que le recruteur choisit « fusionner », les données ne doivent pas écraser le profil sans contrôle humain.

Décision : fusionner ouvre un écran de diff (champs Candidate vs Application), calqué sur la revue post-extraction CV. Validation explicite avant mise à jour du Candidate et liaison `Application.candidateId`. Deux Applications EN_ATTENTE ne sont jamais regroupées — chaque soumission Webflow reste une Application distincte ; l'alerte doublon est informative seulement.

# Géolocalisation requise pour le matching distance

Le pré-filtrage distance compare la localisation Candidate ↔ Pharmacy. Sans `city` + `postalCode` des deux côtés, le calcul est impossible.

Décision matching : paire Candidate/Mission exclue du pré-filtrage Phase 1 si géolocalisation incomplète (candidat ou pharmacie de la mission).

Décision UI : la fiche candidat affiche un bandeau « profil incomplet » listant les champs manquants importants (`city`, `postalCode`, `mobilityRadiusKm`, `availableFrom`). Ce bandeau est informatif — il ne bloque pas les autres actions du CRM.

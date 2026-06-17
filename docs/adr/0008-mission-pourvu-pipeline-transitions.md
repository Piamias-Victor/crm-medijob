# Transition pipeline aux passages Mission POURVU et ANNULEE

Quand une mission est pourvue, les candidats non retenus ne doivent pas rester dans leur étape en cours (Entretien, Proposition…) — cela fausse les kanbans et le reporting.

Décision — `POURVU` : le recruteur désigne le candidat placé (→ « Placé »). Tous les autres `MissionCandidate` passent en « Pas retenu ».

Décision — `ANNULEE` : tous les `MissionCandidate` passent en « Pas retenu ». Les enregistrements sont conservés ; la mission sort des kanbans actifs.

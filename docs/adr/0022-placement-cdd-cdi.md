# Placement lines carry CDD vs CDI

Pilotage Go/NoGo splits CDI and CDD (conversion, average billed CA). A Ligne de suivi Mission is optional, so Mission.contractType is often missing.

Decision: a Placement line **must** set CDD or CDI (prefilled from the Mission when linked). Intérim stays the other kind. Rejected: infer type only from Mission; rejected: forcing a Mission on every Placement.

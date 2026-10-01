# Prompt — Issue #567

## Compte rendu

- `missionId` nullable + champs standalone + `jobTitleId` FK
- Migration `20261001120000_job_offer_standalone` (non appliquée : DB env = Neon, pas locale)
- `resolveListingSource` + `buildListingForOffer` standalone
- Publish valide les 4 titres sections (fix post-#566)
- Liste: colonne Source; ingest Application gère offre sans mission

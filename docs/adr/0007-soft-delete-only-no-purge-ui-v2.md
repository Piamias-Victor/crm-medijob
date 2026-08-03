# Soft delete ops + effacement RGPD in-app (V1)

## Context

Le soft delete (`deletedAt`) masque les fiches en ops. Le droit à l’oubli RGPD exige une suppression définitive (DB + Blob) pour les demandes légitimes. La relecture juridique client a tranché Q4–Q7 (#235).

## Decision

- **Soft delete** reste l’action ops courante (Direction / RH-Admin) — masquage listes, pas d’effacement.
- **Effacement RGPD** (`gdpr.erase`) : hard delete cascade candidat + documents + CV blobs + candidatures liées, avec audit sans PII (`GdprEraseAudit`). Rôles : Direction + RH-Admin.
- Soft delete ≠ conformité oubli.
- Rétention : alertes documentées (`docs/gdpr/RETENTION.md`), pas de purge auto silencieuse.

## Consequences

- ADR-0007 V2 « purge hors produit seulement » est **amendé** pour V1 opérationnel.
- Restauration soft-deleted : toujours hors UI (script CLI si besoin).
- Registre des traitements : lien externe admin (`RGPD_REGISTER_URL`), pas d’écran registre in-app.

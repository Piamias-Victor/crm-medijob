# Activité: ops volumes page, not Accueil

## Context

Direction needs period-scoped operational flow counts (new Candidates, Applications, CRM Missions, Badakan missions, App-validated, Qualifié). Accueil already serves daily pressure stock + alerts for all roles. Pilotage serves CA/Marge. Mixing period flow into Accueil or summing CRM Mission with Badakan mission would blur those boundaries.

## Decision

1. New top-level page `/activite` (« Activité »), Accueil unchanged.
2. Visible only to Direction / RH-Admin via `canViewActivity(role)` which delegates to `finance.view` (single gate for page, nav, and service).
3. Nav item immediately before Facturation.
4. Date range `from`/`to` only (default last 30 civil days), inclusive Europe/Paris bounds, UTC conversion including DST; invalid range falls back to default.
5. Soft-deleted rows excluded from all counts.
6. Nine tiles (event dates in range): Candidates CRM, Candidates App, App-validated (`badakanValidatedAt`), Qualifiés (`qualifiedAt`), Applications received, CRM Missions created, CRM Missions filled (`pourvuAt`), Badakan created, Badakan staffed (`staffedAt`).
7. CRM and Badakan counts/series never summed.
8. New nullable stamps `qualifiedAt`, `pourvuAt`, `staffedAt`: set only on observed transition (previous ≠ target → target); never on initial create/import/first sync already at target; never overwrite; kept on status rollback; no backfill.
9. Stamp-based tiles show « suivi depuis » from a deploy-date constant.
10. Two multi-series charts (Entrants / Missions); day buckets if range ≤ 90 days else ISO week (Paris Monday); empty buckets = 0.
11. No vs-previous-period deltas in V1.
12. No CA/Marge on Activité.
13. Out of V1: Referent filter, list deep-links, backfill, cancelled-only tile, CRM+Badakan sum.

## Consequences

- Qualifiés / pourvues / staffées stay at 0 for history before deploy until new transitions occur.
- Permission change is one function (`canViewActivity`).
- Badakan `createdAt` means first CRM sync sighting, not Badakan-side creation time.

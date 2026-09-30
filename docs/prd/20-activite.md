# PRD — Activité V1 (volumes opérationnels)

Parent milestone: [Activité V1](https://github.com/Piamias-Victor/crm-medijob/milestone/20)  
Glossary: `CONTEXT.md` (Accueil, Activité, Pilotage, Candidate, App-validated, Mission, Badakan mission, Application). ADR 0036.

## Problem Statement

Direction cannot see period-scoped operational volumes (new Candidates, App-validated, Qualifiés, Applications, CRM Missions, Badakan missions) in one place. Accueil shows only daily stock pressure. Pilotage shows only CA/Marge.

## Solution

A new **Activité** page (`/activite`) for Direction / RH-Admin: date range filter, nine flow tiles, two multi-series charts. Accueil unchanged. No finance figures.

## User Stories

1. As Direction, I want an Activité nav item before Facturation, so that I open ops volumes next to finance.
2. As RH-Admin, I want the same Activité access as Direction, so that I can steer ops.
3. As Recruteur, I want no Activité nav or page, so that I am not distracted by direction metrics.
4. As Communication, I want no Activité access, so that finance.view gating stays consistent.
5. As Direction, I want Accueil KPIs unchanged, so that daily pressure stays the ops home for everyone.
6. As Direction, I want a from/to date range (default last 30 days, Europe/Paris inclusive), so that I can inspect any civil window.
7. As Direction, I want invalid dates to fall back to the 30-day default, so that the page never breaks.
8. As Direction, I want Candidates CRM created in range counted, so that manual CVthèque intake is visible.
9. As Direction, I want Candidates App created in range counted separately, so that app intake volume is visible.
10. As Direction, I want App-validated counts via `badakanValidatedAt`, so that Badakan validation flow is measured.
11. As Direction, I want Qualifiés counts via `qualifiedAt` on transition only, so that qualification events are honest.
12. As Direction, I want Applications received (all statuses, createdAt) counted, so that job-board inbound volume is visible.
13. As Direction, I want CRM Missions created (including ANNULEE) counted, so that opening volume is visible.
14. As Direction, I want CRM Missions filled via `pourvuAt` on transition only, so that fill events are honest.
15. As Direction, I want Badakan missions first-synced counted (including CANCELLED), so that interim need volume is visible.
16. As Direction, I want Badakan staffed via `staffedAt` on step transition only, so that staffing events are honest.
17. As Direction, I want CRM and Badakan never summed, so that I do not mix staffing worlds.
18. As Direction, I want soft-deleted rows excluded, so that Activité matches list semantics.
19. As Direction, I want an Entrants chart (CRM Candidates, App Candidates, App-validated, Qualifiés, Applications), so that inbound flow is visual.
20. As Direction, I want a Missions chart (CRM created/filled, Badakan created/staffed), so that staffing flow is visual.
21. As Direction, I want day buckets when range ≤ 90 days and ISO-week buckets otherwise (Paris Monday), with zeros for empty buckets, so that charts have no holes.
22. As Direction, I want « suivi depuis » on stamp tiles, so that I know pre-deploy history is empty by design.
23. As Direction, I want no CA/Marge and no N-1 deltas on Activité, so that Pilotage remains the finance home.
24. As a developer, I want `canViewActivity` as the single gate, so that permission changes stay one place.
25. As a developer, I want stamps never set on initial already-target state and never overwritten, so that first sync of an already-staffed Badakan mission stays NULL.

## Implementation Decisions

- Gate: `canViewActivity(role)` → `can(role, 'finance.view')`; layout redirect like Facturation (`HOME_PATH`).
- Schema: nullable `Candidate.qualifiedAt`, `Mission.pourvuAt`, `BadakanMission.staffedAt` + indexes on filtered date columns; migration without backfill.
- Stamping: only on observed transition; inventory all status paths in the stamp issue prompt.
- Period helpers: pure parse/validate/default + Paris inclusive bounds → UTC (reuse `parisDayStart` patterns).
- Service: nine counts + two series; no N+1; soft-delete excluded; CRM/Badakan separate.
- UI: reuse Pilotage/Facturation tile + Recharts patterns; Server Component page; client for range + charts.
- Deploy constant: `ACTIVITE_STAMP_TRACKING_SINCE` for « suivi depuis » copy.
- Out of V1: Referent filter, deep-links, deltas, backfill, cancelled tile, CRM+Badakan sum.

## Testing Decisions

- Deterministic test seed covering each tile, soft-delete, cancelled, Paris midnight bounds, one DST transition day, CRM vs Badakan.
- Each tile and each series point asserted to hand-written expected values.
- Period helpers: pure unit tests (DST included).
- Stamp paths: one test per path + « first observation already staffed = NULL » + « rollback keeps stamp ».
- Permission: no nav, no page data without `finance.view`.
- Accueil existing tests remain green; no functional Accueil diff.
- Prefer repository/service seams over UI for counts; e2e for nav position, period change, denied access.

## Out of Scope

Referent filter, list deep-links, N-1 deltas, backfill, cancelled-only tile, summing CRM+Badakan, CA/Marge, Accueil changes, changing Badakan sync beyond `staffedAt` on transition.

## Further Notes

- Badakan `createdAt` = first CRM sync sighting.
- Ticket order: ADR → schema → stamping ∥ period → service → page → e2e.
- Phase maquette skipped: existing multi-series charts + KPI tiles (Facturation/Pilotage/Accueil).

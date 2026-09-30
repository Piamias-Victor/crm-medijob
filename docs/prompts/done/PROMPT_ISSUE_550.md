# Prompt — Issue #550

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/550  
**Parent** : #545 · ADR 0036  
**Blocked by** : #548, #549

## Skills

```
/caveman
/tdd
/code-review
```

codebase-design if new module.

## Contexte

Activity service: 9 counts + Entrants/Missions series. Soft-delete out. CRM≠Badakan. Day if ≤90d else ISO week. Zeros for empty buckets. Bounded queries. Router gated canViewActivity.

## Critères d'acceptation

- [ ] Deterministic fixtures; each tile + series point asserted
- [ ] Soft-delete / cancelled / Paris bounds / DST day covered as feasible
- [ ] No N+1 (assert query budget or document)
- [ ] Files ≤100 lines

## Fichiers probables

- `apps/web/src/server/db/repositories/activite*.ts`
- `apps/web/src/server/routers/activite.ts`
- `apps/web/src/view-models/activite-*.ts`
- `apps/web/src/server/auth/can-view-activity.ts`

## Compte rendu

- `canViewActivity` → finance.view
- `loadActiviteOverview` : 9 counts + 9 date finds (18 queries bornées, parallel)
- `buildActiviteSeries` jour ≤90j sinon semaine ISO Paris
- Router `activite.overview` FORBIDDEN sans droit
- Soft-delete exclu ; CRM/Badakan séparés

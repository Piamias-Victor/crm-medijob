# Prompt — Issue #549

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/549  
**Parent** : #545 · ADR 0036  
**Blocked by** : #547

## Skills

```
/caveman
/tdd
/code-review
```

## Contexte

Pure from/to helpers. Default last 30 civil days Europe/Paris. Inclusive from 00:00:00 / to 23:59:59.999 Paris → UTC. DST. Invalid → default. Reuse `parisDayStart` patterns from week-report-range.

## Critères d'acceptation

- [ ] Unit tests: valid, from>to, invalid, default 30d
- [ ] DST covered
- [ ] Inclusive end proven

## Fichiers probables

- `apps/web/src/view-models/activite-period.ts` (+ test)
- optionally thin wrap of paris helpers

## Compte rendu

(à remplir)

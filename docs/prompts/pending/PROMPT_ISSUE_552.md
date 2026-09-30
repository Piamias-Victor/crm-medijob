# Prompt — Issue #552

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/552  
**Parent** : #545 · ADR 0036  
**Blocked by** : #551, #548

## Skills

```
/caveman
/tdd
/code-review
```

No Playwright in repo → vitest integration: nav order, canViewActivity, period parse→overview, Accueil KPI builder unchanged.

## Critères d'acceptation

- [ ] Recruteur: Activité absent from visibleNavItems; page gate redirects
- [ ] Direction: Activité index < Facturation index in navItems
- [ ] Period change input yields different overview for fixture dates
- [ ] Accueil home-kpi / overview tests still pass

## Fichiers probables

- `apps/web/src/lib/navigation.test.ts`
- activite period/service/router tests
- home-kpi tests (unchanged)

## Compte rendu

(à remplir)

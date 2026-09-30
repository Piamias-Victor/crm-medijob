# Prompt — Issue #551

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/551  
**Parent** : #545 · ADR 0036  
**Blocked by** : #550

## Skills

```
/caveman
/tdd
/code-review
```

react-best-practices + composition-patterns. web-design-guidelines audit OK (private page; skip SEO/CRO).

## Contexte

Page `/activite`, nav before Facturation, layout gate like Facturation. Reuse tile/chart patterns. Constant `ACTIVITE_STAMP_TRACKING_SINCE` for « suivi depuis ». No Accueil functional change. Phase maquette skipped (existing components).

## Critères d'acceptation

- [ ] Nav Activité before Facturation iff canViewActivity
- [ ] Redirect without right
- [ ] 9 tiles, 2 charts, period selector
- [ ] Stamp tiles show suivi depuis
- [ ] Accueil tests green; Accueil behavior unchanged

## Fichiers probables

- `apps/web/src/app/(dashboard)/activite/`
- `apps/web/src/lib/navigation.ts`
- `apps/web/src/components/organisms/Activite*`
- `apps/web/src/lib/constants/activite.ts`

## Compte rendu

(à remplir)

# Handoff — Issue #158 (Tableau pharmacies + filtres)

## État

**Prêt merge.** Branche `feat/issue-158-pharmacy-table`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/158
- Parent : Epic #19 · Milestone Bloc 2 — Pharmacies & Contacts
- Débloque : #162 (export CSV pharmacies)

## Livré

### Backend
- `pharmacy.list(filters?)` — Zod `pharmacyListFiltersSchema` · `pharmacy-list-where*.ts`
- **5 filtres** : statut · département · missions actives (barre) · groupement · LGO (Plus de filtres)
- Missions actives = `NOT IN (POURVU, ANNULEE)` via `mission-active-where.ts`
- Nb missions colonne = count toutes missions non deleted
- **Suppression `PharmacyType`** DB (migration + cleanup)
- Index Prisma : `status`, `softwareId`, `postalCode`
- Tests : where · repository · router · filter-map · href

### UI pharmacies
- `pharmacy-table/` — EntityTable + `PharmacyFilterBar` (via `EntityListFilterBar`)
- Colonnes : Nom · Ville · Groupement · Statut · Contact principal · Nb missions · LGO · Actions
- RSC + `usePharmacyListQuery` · URL sync · `?back=` fiche
- Suspense page · `TABLE_EMPTY_CELL` constant

### Transverse (audit post-impl)
- `EntityListFilterBar` partagé pharmacies + CVthèque
- `advanced-filter-utils.ts` · `resolveEntityListRows` + `keepPreviousData` (fix flash initialRows)
- `useCvthequeListQuery` aligné même pattern `serverFilters`
- Candidats : mission active exclut missions soft-deleted

### Supprimé
- `PharmacyList` / `PharmacyListCard`
- `cvtheque-filter-field` / `cvtheque-advanced-filters-panel` (remplacés par composant partagé)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Pattern | Miroir CVthèque (#157) |
| Filtres | 5 (pas ville, pas type) |
| Plus de filtres | groupement + LGO |
| PharmacyType | Supprimé DB |
| Missions actives | Non terminale (POURVU/ANNULEE) |
| Export CSV | Report #162 |
| Interactions | Clic ligne + Modifier + `?back=` |

## Tests

```bash
cd apps/web
pnpm vitest run src/server/db/repositories/pharmacy-list-where-filters.test.ts src/server/db/repositories/pharmacy.repository.test.ts src/lib/filters/pharmacy-filter-map.test.ts src/lib/entity-list-query-rows.test.ts src/lib/pharmacy-href.test.ts src/view-models/pharmacy-list.test.ts src/server/routers/pharmacy.test.ts
pnpm prisma migrate dev
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /pharmacies
```

## Suite (Bloc 2)

Ordre milestone : **#159** tableau contacts → #162 export CSV pharmacies → #163 export contacts → #173 doublons pharmacy

## Points d'attention

- Déployer migrations : `remove_pharmacy_type` + `pharmacy_list_filter_indexes`
- Filtre département = `postalCode startsWith` — pharmacies sans CP exclues
- `SPEC_COMPLEMENTAIRE.md` hors scope (non commité)

## Suggested skills

- `/caveman` + `/tdd` pour #159
- `/handoff` en fin de session

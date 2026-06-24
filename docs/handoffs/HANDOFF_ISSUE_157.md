# Handoff — Issue #157 (CVthèque tableau + filtres + kanban)

## État

**Prêt merge.** Branche `feat/issue-157-cvtheque-table-filters`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/157
- Parent : Epic #19 · Milestone Bloc 1 — Candidats
- Débloque : #161 (export CSV — baseline client déjà posée), #169, #170

## Livré

### Backend
- `candidate.list(filters?)` — Zod `candidateListFiltersSchema` · Prisma where composable (`candidate-list-where*.ts`)
- 8 filtres : métier, disponible (oui/non + pas en mission), dépt, référent, LGO, contrat, incomplet, mission active
- Profil incomplet = city + postalCode + mobilityRadiusKm (**sans** availableFrom)
- Tests : where isolés/combo · router · repository

### UI CVthèque
- `CvthequeTable` — EntityTable + FilterBar custom (`CvthequeFilterBar`)
- Filtres visibles : métier, dispo, dépt, référent · **Plus de filtres** : LGO, contrat, incomplet, mission active
- ComboboxMulti avec recherche · toggle Tableau/Kanban (défaut tableau)
- ExportCsvButton lignes filtrées (client)
- Clic ligne + Modifier → fiche · retour via `?back=` preserve filtres
- Hook `useCvthequeListQuery` · compteur header sync

### Transverse
- `useEntityFilters` preserve `tab` · `buildCandidatsTabHref` sync onglet URL
- Combobox hover accent global · pagination custom `TablePageSizeSelect`
- Audit post-impl : fixes sécurité back URL, a11y row, filtres contradictoires

### Supprimé
- `CvthequeList` / `CvthequeListCard` / `candidate-list.ts`

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Filtres | Serveur refetch tRPC |
| Export CSV | Oui (slot FilterBar) |
| Vue défaut | Tableau |
| URL | Merger tab + filtres |
| Disponibilité | Oui = date ok ET pas mission active · affichage null = « Dès que possible » |
| Incomplet | ≥1 champ manquant (sans availableFrom) |
| Layout filtres | flex-wrap + panel « Plus de filtres » |
| Pagination | Client sur rows filtrées |

## Tests

```bash
cd apps/web
pnpm vitest run src/server/db/repositories/candidate-list-where-filters.test.ts src/server/db/repositories/candidate-list-where-profile.test.ts src/server/routers/candidate-list.test.ts src/view-models/candidate-list-vm.test.ts src/lib/cvtheque-candidate-href.test.ts src/lib/filters/cvtheque-filter-map.test.ts src/view-models/candidats-tab.test.ts src/components/molecules/ComboboxMulti.test.tsx
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /candidats
```

## Suite (Bloc 1)

Ordre milestone : **#161** export CSV (vérifier AC vs baseline #157) → #169 import CV → #170 doublons

## Points d'attention

- #161 : export client déjà branché — valider UTF-8 BOM + colonnes ou endpoint serveur si >500 lignes
- Pas de debounce refetch · pas d'index Prisma dédiés (scalabilité future)
- `SPEC_COMPLEMENTAIRE.md` non commité (hors scope)

## Suggested skills

- `/caveman` + `/tdd` pour #161 ou #169
- `/handoff` en fin de session

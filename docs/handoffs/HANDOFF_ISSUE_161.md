# Handoff — Issue #161 (Export CSV CVthèque filtrée)

## État

**Prêt merge.** Branche `feat/issue-161-cvtheque-export-csv`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/161
- Parent : Epic #19 · Milestone Bloc 1 — Candidats
- Débloque : #169 (import CV), #170 (doublons)

## Livré

### Backend
- `candidate.exportCsv` — query tRPC protégée + Zod (`candidate-export.schema.ts`)
- `listForExport` — requête Prisma sans limite (toutes lignes filtrées)
- `buildCandidateExportSelect()` — select dynamique selon colonnes choisies + `firstName`/`lastName` toujours
- `resolveCandidateExportColumnIds()` — fusion `columnIds` + colonne tri + identité
- `candidate-list-query.ts` — helper partagé (kanban garde cap 500 via `take`)

### View-models / lib
- `candidate-export-vm.ts`, `candidate-export-format.ts`, `cvtheque-export-columns.ts`, `cvtheque-core-fields.ts`
- `cvtheque-export-storage.ts` — persistance localStorage `cvtheque-export-columns`
- `sort-rows.ts` — tri client extrait de entity-table
- Multi-valeurs (LGO, contrats) : `"Val1; Val2"` dans une cellule

### UI
- `CvthequeExportButton` → `CvthequeExportModal` → `CvthequeExportColumnPicker`
- Hooks : `use-cvtheque-export-columns`, `use-cvtheque-export-download`
- Tri remonté dans `CvthequeSection` (persiste kanban ↔ tableau)
- `GlassModal` — portal `document.body` + `GlassModalPanel` (fix clip `overflow-hidden`)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Endpoint | Serveur `candidate.exportCsv` |
| Périmètre export | Toutes lignes filtrées (pas page courante) |
| Limite rows | **Aucune** (pas de cap 500) |
| Tri | Respecté dans le CSV |
| Colonnes | Popup picker avant téléchargement |
| Persistance colonnes | localStorage |
| Encodage | UTF-8 BOM (réutilise `build-csv.ts` #149) |

## Tests

```bash
cd apps/web
pnpm vitest run src/view-models/candidate-export-vm.test.ts src/server/routers/candidate-export.test.ts src/server/db/repositories/candidate-export-select.builder.test.ts src/server/db/repositories/candidate-list-query.test.ts src/lib/cvtheque-export-storage.test.ts src/view-models/candidate-list-vm.test.ts
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
pnpm dev  # /candidats → Exporter CSV
```

## Dette / risques résiduels

- Export très volumineux : mémoire serveur + payload CSV non bornés (accepté MVP)
- Cast `as unknown as RawCandidateExport[]` dans repository (select Prisma dynamique)

## Suite (Bloc 1)

Ordre milestone : **#169** import CV → #170 doublons → #171/#172 présentations mailto

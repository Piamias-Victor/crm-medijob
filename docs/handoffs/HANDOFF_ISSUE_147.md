# Handoff — Issue #147 (EntityTable générique)

`/caveman` + `/tdd` actifs.

## État

**Prêt merge.** PR #191 vers `dev`, CI verte.

- Branche : `feat/issue-147-entity-table`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/147
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/191
- Prompt : `docs/prompts/done/PROMPT_ISSUE_147.md`
- Parent : Epic #19 · Débloque issues « vue tableau » (#157–#160, #184, #187, etc.)

## Livré

### `<EntityTable<TRow>>`
- Colonnes `ColumnDef` : `accessor: (row) => CellValue`, `cell?`, `sortable?`
- Tri local par défaut, mode contrôlé via `sort` / `onSortChange` + `page` / `onPageChange`
- Pagination : page size 10/25/50, « Page X / Y », prev/next
- `renderActions?` colonne Actions séparée
- Empty state via props `emptyIcon` / `emptyTitle` / `emptyDescription`

### Fichiers clés
- `apps/web/src/components/organisms/entity-table/` (types, logic, state, header, pagination, main)
- `apps/web/src/components/molecules/table-sort-header/`
- `apps/web/src/components/molecules/table-pagination/`
- `apps/web/src/lib/entity-table-logic.ts` → colocated `entity-table-logic.ts` dans organism folder

### Logique pure (testée)
- `sortEntityRows` : `localeCompare('fr')`, `Date` via `getTime()`, ISO auto-parse, nulls toujours en fin
- `paginateEntityRows` : slice + `totalPages` + page clampée

### Design system
- Section **Tableau** (`#tableau`) — 50 lignes mock
- Header gradient `primary-muted` → `accent-muted`, labels `text-primary`, Actions `text-accent-hover`
- Bouton action showcase : `variant="accent"`

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| État tri/page | Local + contrôlé (C) |
| Accessor | Fonction seule (A) |
| Dates | Coerce `Date` |
| Nulls | Toujours en fin asc/desc |
| Actions | Prop `renderActions` (A) |
| Tests | Unitaires logique seulement |

## Tests

- `pnpm vitest run src/components/organisms/entity-table/entity-table-logic.test.ts` — 5 verts
- `pnpm vitest run src/app/design-system/page.test.tsx` — 13 sections

## Suite (#148)

FilterBar générique — voir `docs/prompts/pending/PROMPT_ISSUE_148.md`

## Points d'attention

- Consommateurs futurs : passer `variant="accent"` (ou autre) dans `renderActions` — EntityTable ne force pas le style bouton
- Fichiers < 100 lignes respectés
- Pas de `<table>` ailleurs dans le repo avant cette issue

## Suggested skills

- `/caveman` + `/tdd` pour #148
- `/handoff` en fin de session
- Lire ce handoff avant toute issue bloquée par #147

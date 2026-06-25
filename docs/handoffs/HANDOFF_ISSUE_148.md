# Handoff — Issue #148 (FilterBar générique)

## État

**Prêt merge.** Branche `feat/issue-148-filter-bar`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/148
- Prompt : `docs/prompts/done/PROMPT_ISSUE_148.md`
- Parent : Epic #19 · Milestone Bloc 0 — Fondations
- Débloque : pages liste (#157–#160, etc.) + combo FilterBar + EntityTable + ExportCsv (#149)

## Livré

### `<FilterBar>` + `useEntityFilters`
- 6 types config : `select`, `multi-select`, `text`, `date-range`, `number-range`, `boolean`
- Filtre **auto** (pas bouton Valider) + sync URL `URLSearchParams`
- Reset global
- Typage strict `FilterConfig[]` → `FilterValues<T>`

### UI (validé user en session)
- Label **au-dessus** de chaque champ
- Bouton affiche **« Tous »** quand vide ; option Tous dans dropdowns
- **Combobox** pour select/booléen ; **ComboboxMulti** pour multi-select (même trigger)
- Multi résumé : `2 métiers` / `2 dpt` / `2 types` via prop `unit` sur `multi-select`
- Barre compacte une ligne, `items-end`

### Fichiers clés
- `apps/web/src/components/organisms/filter-bar/`
- `apps/web/src/components/molecules/ComboboxMulti.tsx`
- `apps/web/src/components/atoms/Select.tsx`
- `apps/web/src/hooks/use-entity-filters.ts`
- `apps/web/src/lib/filters/` (types, serialize, demo)

### Logique pure (testée)
- `serializeFilters` / `deserializeFilters` — round-trip 6 types

### Design system
- Section **Tableau** : FilterBar + EntityTable, filtre client mock (métier, département, contrat, incomplet)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| URL sync | Obligatoire |
| Hook | État seul — parent filtre rows |
| Apply | Auto (pas Valider) |
| Select UI | Combobox (+ Select atom peu utilisé) |
| Multi UI | ComboboxMulti |
| Labels | Au-dessus du champ |
| Placeholder bouton | « Tous » |
| Multi summary | `{n} {unit}` ex. `2 métiers` |
| Showcase filtres | métier, département, contrat, incomplet — pas ville |

## Tests

```bash
cd apps/web
pnpm vitest run src/lib/filters/serialize.test.ts src/app/design-system/page.test.tsx
pnpm typecheck && pnpm lint
pnpm dev  # /design-system#tableau
```

## Suite (#149)

`ExportCsvButton` — `docs/prompts/pending/PROMPT_ISSUE_149.md`

## Points d'attention

- Intégrer FilterBar + ExportCsv dans showcase Tableau en #149 si pertinent
- `ComboboxMulti` : outside-close via `pointerdown` + `stopPropagation` sur panel
- Fichiers < 100 lignes respectés

## Suggested skills

- `/caveman` + `/tdd` pour #149
- `/handoff` en fin de session
- Lire ce handoff avant issues liste consommatrices

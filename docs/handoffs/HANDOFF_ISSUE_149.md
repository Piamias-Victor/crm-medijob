# Handoff — Issue #149 (ExportCsvButton générique)

## État

**Prêt merge.** Branche `feat/issue-149-export-csv`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/149
- Prompt : `docs/prompts/done/PROMPT_ISSUE_149.md`
- Parent : Epic #19 · Milestone Bloc 0 — Fondations
- Débloque : pages liste (#157–#160) — export lignes filtrées

## Livré

### Lib CSV (`apps/web/src/lib/csv/`)
- `build-csv.ts` — BOM UTF-8, `CSV_SEPARATOR = ';'`, échappement guillemets/séparateur
- `download-blob.ts` — téléchargement client
- `format-csv-filename.ts` — `{prefix}-{YYYY-MM-DD}.csv` (date locale navigateur)

### `<ExportCsvButton>`
- Props sync `rows` ou async `getData`
- Variant `accent`, icône `Download` + « Exporter CSV »
- Loading → spinner ; 0 ligne → disabled + `title="Aucune donnée"`
- `getData` throw → toast erreur ; `getData` vide → toast warning

### Intégrations
- `FilterBar` : prop optionnelle `actions` (slot avant « Réinitialiser »)
- Showcase **Tableau** : export lignes filtrées mock (`candidats-demo`)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| 0 ligne | Bouton désactivé (pas export headers seuls) |
| Showcase | Oui — section Tableau design system |
| Placement | À côté de « Réinitialiser » via `FilterBar.actions` |
| Style | `accent`, texte + icône |
| Séparateur | `CSV_SEPARATOR = ';'` constante |
| Erreur async | Toast erreur |
| Tests | Lib `buildCsv` seule (pas test composant) |
| Date fichier | Locale navigateur |

## Tests

```bash
cd apps/web
pnpm vitest run src/lib/csv/build-csv.test.ts src/app/design-system/page.test.tsx
pnpm typecheck && pnpm lint
pnpm dev  # /design-system#tableau
```

## Suite (#150)

`SoftDeleteModal` — `docs/prompts/pending/PROMPT_ISSUE_150.md`

## Points d'attention

- `ConfirmDialog` existant (sync `onConfirm`) — #150 peut s'en inspirer ou le remplacer
- `GlassModal` déjà gère overlay/Escape
- Fichiers < 100 lignes respectés

## Suggested skills

- `/caveman` + `/tdd` pour #150
- `/handoff` en fin de session
- Lire ce handoff + `docs/handoffs/HANDOFF_ISSUE_148.md` avant pages liste

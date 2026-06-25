# Handoff — Issue #152 (DuplicateDetectionPage)

## État

**Prêt merge.** Branche `feat/issue-152-duplicate-detection` · PR https://github.com/Piamias-Victor/crm-medijob/pull/196

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/152
- Parent : Epic #19 · Milestone Bloc 0 — Fondations
- Débloque : #170 (doublons Candidate), #169, flows pharmacies/contacts doublons

## Livré

### `<DuplicateDetectionPage>` (`apps/web/src/components/organisms/duplicate-detection-page/`)
- Tableau comparatif générique Existant / Nouveau, sélection radio par champ
- Pastille warning « Différent » sur champs modifiés
- Actions : Fusionner (accent teal) · Ignorer (primary navy) · Annuler (outline)
- Loading interne merge + ignore (anti double-clic)

### Molecules (`apps/web/src/components/molecules/duplicate-detection/`)
- `duplicate-field-row.tsx` · `duplicate-field-option.tsx`

### Utilitaires `apps/web/src/lib/merge/`
- `resolveMergedFields` — merge shallow records plats (JSDoc)
- `field-values-equal` — Date + `Object.is`, `equals?` optionnel par champ
- `build-default-selections` — défaut `left` sur champs différents
- `duplicate-field-config` — type partagé lib/UI

### Showcase
- `/design-system#duplicate-detection`

### Fix CI collatéral
- `activity-log.test.ts` split → `activity-log-batch.test.ts` (`lint:lines`)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Périmètre | Composant + showcase, wiring routes plus tard |
| Tests auto | Unitaires `lib/merge/` seulement |
| Design | Table 3 colonnes, pastilles diff, pas de surlignage row/cell |
| Boutons | Ignorer navy · Fusionner teal |

## Tests

```bash
cd apps/web
pnpm vitest run src/lib/merge/ src/app/design-system/page.test.tsx
pnpm typecheck && pnpm lint && pnpm lint:lines
pnpm dev  # /design-system#duplicate-detection
```

## Suite (Bloc 1 — Candidats)

Ordre milestone recommandé :
1. **#154** `/candidats/new` — `docs/prompts/pending/PROMPT_ISSUE_154.md`
2. #157 tableau + filtres + kanban
3. #161 export CSV
4. #169 import CV (`?source=cv`)
5. **#170** branchement `DuplicateDetectionPage` sur doublons Candidate
6. #171 / #172 présentations mailto

## Points d'attention

- #154 mentionne redirect duplicate-review — composant prêt, route/repo doublons = #170
- `resolveMergedFields` shallow only — normaliser dates/objets en view-model avant merge
- Prop `merging` externe retirée — loading géré en interne

## Suggested skills

- `/caveman` + `/tdd` pour #154
- `/handoff` en fin de session

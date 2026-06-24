# Handoff — Issue #150 (SoftDeleteModal générique)

## État

**Prêt merge.** Branche `feat/issue-150-soft-delete-modal`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/150
- Prompt : `docs/prompts/done/PROMPT_ISSUE_150.md`
- Parent : Epic #19 · Milestone Bloc 0 — Fondations
- Débloque : soft delete UI entités (#157–#160)

## Livré

### `<SoftDeleteModal>` (`apps/web/src/components/molecules/soft-delete-modal/`)
- Props : `entityName`, `open`, `onOpenChange`, `onConfirm: () => Promise<void>`
- Loading interne → `Suppression…` ; erreur → toast « Impossible de supprimer », modal reste ouverte
- `role="alertdialog"`, focus trap, Escape/overlay = Annuler (bloqués pendant loading)
- Boutons : Annuler `outline` · Supprimer `danger`
- Texte : titre `Supprimer [nom] ?` + description `Cette action est irréversible.`

### `GlassModal` étendu
- `trapFocus`, `preventDismiss`, `role`, `useId()` pour ARIA
- Hook `use-modal-focus-trap.ts` — focus trap actif pendant loading

### Atom `Button`
- Variant `outline` (ghost + border)

### Migrations `ConfirmDialog` → `SoftDeleteModal`
- `UsersAdmin`, `PipelineAdmin`, `ReferentialManager`, `EntityDocumentsTab`, `MissionStatusActions`
- `ConfirmDialog.tsx` supprimé
- `onDelete` référentiels : `Promise<void>` + `mutateAsync` (Software/Groupement/JobTitle)

### Showcase
- Section `#soft-delete` sur `/design-system`

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Périmètre | Molecule + migration tous `ConfirmDialog` |
| Shell | Étendre `GlassModal` |
| Loading | Interne au composant |
| Tests auto | `soft-delete-modal.test.tsx` + design-system page |
| Boutons | `outline` + `danger` |
| Toast erreur | « Impossible de supprimer » |
| Titre | `Supprimer [nom] ?` + phrase irréversible en description |

## Tests

```bash
cd apps/web
pnpm vitest run src/components/molecules/soft-delete-modal/soft-delete-modal.test.tsx src/components/organisms/ReferentialManager.test.tsx src/components/molecules/MissionStatusActions.test.tsx src/app/design-system/page.test.tsx
pnpm typecheck && pnpm lint
pnpm dev  # /design-system#soft-delete
```

## Suite (#151)

`EmailButton` — `docs/prompts/pending/PROMPT_ISSUE_151.md`

## Points d'attention

- `SoftDeleteModal` réutilisé aussi pour hard delete (documents, référentiels) et annulation mission — texte « Supprimer » générique (choix user)
- Pages liste entités (#157+) : brancher `SoftDeleteModal` + mutation `mutateAsync`
- Resend / email → issue #151 (`mailto:` uniquement V2)

## Suggested skills

- `/caveman` + `/tdd` pour #151
- `/handoff` en fin de session
- Lire ce handoff avant `EmailButton`

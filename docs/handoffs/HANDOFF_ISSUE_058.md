# Handoff — Issue #58 (CANDIDATS — ActivityLog timeline filtrable)

`/caveman` + `/tdd` actifs.

## État

**Prêt PR.** Onglet Historique sur `/candidats/[id]` : timeline ActivityLog, filtres, création manuelle.

- Branche : `feat/issue-58-candidat-activity-log`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-58`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/58
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_058.md`
- Dépend de #55 · ADR 0003 déjà en place (hors scope envoi email)

## Livré

### Backend
- `activityLog.listByEntity`, `activityLog.create` (`protectedProcedure`, author = session user)
- `activity-log.repository.ts` — list desc + filtre `ActivityType`, create polymorphe `DocumentEntityType`
- View-models : labels, schema Zod, `toActivityLogRow`
- 5 tests router (`activity-log.test.ts`)

### UI
- Onglet **Historique** (`CandidateDetailTabs` + badge count)
- `CandidateHistoryTab` : form RHF+Zod, timeline, filtre Combobox, empty states
- RSC charge activities via `createServerCaller`
- Bouton **Ajouter** en `variant="accent"` (teal)

### UX partagée (Combobox + DatePicker)
- `FloatingPanel` + `useFloatingPanel` → portal `document.body`, `position: fixed`
- Fix clip `overflow-hidden` des cartes glass
- Date historique : `emptyLabel` / `clearLabel` custom (« Sélectionner une date », pas « Dès que possible »)
- Profil candidat garde « Dès que possible » pour dispo
- Tests : `DatePicker.test.tsx` (portal fixed), `Combobox.test.tsx`, `date-picker-utils.test.ts`

## Décisions / pièges

- Filtre type = client-side sur données RSC (refresh après create)
- Pas de seed ActivityLog — timeline vide par défaut sur Camille Durand
- Conflit potentiel #56 sur fiche candidat — merger `dev` si rebase nécessaire

## Tests manuels

- [ ] Camille Durand → Historique → ajouter NOTE → visible avec auteur
- [ ] Filtre EMAIL → autres types masqués
- [ ] Date vide → « Sélectionner une date » ; clear → « Effacer la date »
- [ ] Combobox filtre + DatePicker : dropdown non coupé dans carte glass
- [ ] `pnpm test && pnpm lint && pnpm typecheck`

## Suggested skills

- `/caveman` + `/tdd` pour issues suivantes (#56 upload CV, #63 ActivityLog contact)
- `/handoff` en fin de session

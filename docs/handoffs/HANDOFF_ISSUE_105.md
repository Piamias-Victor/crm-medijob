# Handoff — Issue #105 (Audit High — ActivityLog, DatePicker, docs contact, limites)

`/caveman` + `/tdd` actifs.

## État

**Prêt pour review.** Branche poussée, PR ouverte vers `dev`.

- Branche : `fix/issue-105-audit-high`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-105`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/105
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_105.md`
- Parent : #19 (remédiation audit) · Débloque : #106
- ADR nouveau : `docs/adr/0011-document-hard-delete-with-blob.md`

## Livré

### H1/H17/H18/H19 — ActivityLog unifié
- `EntityActivityLogTab` remplace `ActivityLogTab` + `CandidateHistoryTab`
- `ActivityLogForm` généralisé (`scope: ActivityLogScope`)
- Conservé : `ActivityTimeline`, `ActivityTimelineItem`
- Supprimé : `ActivityLogTimeline`, `ActivityLogCreateForm`, `ActivityTypeFilter`, `activity-log-list.ts`, `activity-log-options.ts`
- Labels : `activity-log.labels.ts` seule source

### H2 — DatePicker
- `clearLabel` propagé au panel (déjà OK composant)
- Mission form : `SELECT_DATE_LABEL` / `CLEAR_DATE_LABEL` via `date-picker-utils.ts`
- Fix `startDate` clear → `undefined` (plus `new Date()`)
- Tests : `DatePicker.test.tsx`, `MissionFormFields.test.tsx`

### H3 — Documents contact
- `EntityDocumentsTab` + `EntityDocumentsList` (généralisés depuis pharmacie)
- Contact fiche → onglet Documents branché (upload/list/delete)

### H4/H5 — Limites listes
- `DEFAULT_LIST_LIMIT` sur `contact.list`, `activityLog.listByEntity`, `document.listByEntity`, `application.listInbox`, `mission.listByContact`
- Test TDD : `contact.repository.integration.test.ts` (`list(2)`)

### H15 — Prisma hors UI cible
- `@prisma/client` retiré de `ActivityLogForm`, `DocumentUploadForm`
- Types via `activity-log.types.ts`, `activity-log-form.schema`, `document.types.ts`

### H16 — Document delete
- ADR 0011 : hard delete + blob (exception à ADR 0007 pour artefacts fichiers)

### H20 — candidate router
- `list()` proc principale ; `cvtheque` alias conservé

## Tests

- `pnpm test` — 307 tests verts (dont +2 `MissionFormFields`)
- `pnpm typecheck` + `pnpm lint` OK (warnings préexistants hors périmètre)

## Tests manuels (non exécutés par l’agent)

- [ ] Contact → Historique : filtre multi-type + création entrée
- [ ] Contact → Documents : upload PDF → liste → suppression
- [ ] Candidat → Historique : même UX que contact
- [ ] Mission fiche → DatePicker « Sélectionner une date » / « Effacer la date » (pas « Dès que possible »)
- [ ] Pharmacie → historique + documents inchangés

## Suite (#106)

- Issue suivante dans chaîne audit post-#104 — lire `docs/prompts/pending/PROMPT_ISSUE_106.md`

## Points d’attention

- `.env` worktree = symlink `medijob/apps/web/.env`
- Après merge : `git mv docs/prompts/pending/PROMPT_ISSUE_105.md → done/` sur `dev`
- `CandidateProfileFields` garde `ASAP_DATE_LABEL` pour `availableFrom` (intentionnel)

## Suggested skills

- `/caveman` + `/tdd` pour #106
- `/handoff` en fin de session

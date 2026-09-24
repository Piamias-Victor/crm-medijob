# Handoff — Issue #483 (Entrées app — comments + SMS)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/483
- Parent : PRD #480 — `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032 · `docs/ISSUE_DEPENDENCIES_ENTREES_APP.md`
- Branche : `feat/issue-483-entrees-app-comments-sms` — **repo `medijob` only, jamais `git worktree`**
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/490
- Prompt : `docs/prompts/done/PROMPT_ISSUE_483.md` (après merge)
- Next focus : #484 — `docs/prompts/pending/PROMPT_ISSUE_484.md` (blocked by #482, déjà mergé)

## Livré

- Colonnes lecture seule Entrées app : Commentaires Badakan + SMS RDV
- VM : `intakeBookingSmsLabel` (`calendarSmsSentAt`) · `badakanCommentsLabel`
- `listIntakeFollowUp` batch `getComments` via `mapIntakeFollowUpWithComments` — stubs, pas de Badakan live
- **Aucun** changement règles / copy / flags d’envoi Intake booking SMS

## Décisions

| Sujet | Choix |
|-------|--------|
| SMS label | `Envoyé` si `calendarSmsSentAt` · sinon `—` |
| Comments label | contenus joints ` · ` · vide → `—` |
| Batch | `Promise.all` + `readCommentsOrEmpty` à list time (pas N+1 client) |
| Header comments | `BADAKAN_COMMENTS_TITLE` |
| Header SMS | `SMS RDV` (indicateur only) |

## Pièges

- `updateIntake` → `toAppProfileListItem` sans re-fetch comments ; UI refresh via `router.refresh()` OK
- `listPending` ≠ `listIntakeFollowUp` — comments enrich **seulement** follow-up
- Ne pas toucher `invite-due*` / `hireflix-calendar-sms-sender*`
- Fichiers < 100 lignes · **jamais `git worktree`**

## Tests manuels

- [ ] Intérim → Entrées app → colonnes Commentaires Badakan + SMS RDV
- [ ] `calendarSmsSentAt` set → Envoyé ; sinon —
- [ ] Comments affichés ou —
- [ ] Inline Intake inchangé
- [ ] Liste n’envoie pas de SMS
- [x] Auto : VM + caller + columns verts · CI quality OK

## Suite

1. Merge PR #490 → `dev`
2. `git mv docs/prompts/pending/PROMPT_ISSUE_483.md docs/prompts/done/` sur `dev` + push
3. Phase 5 : delete branche locale `feat/issue-483-entrees-app-comments-sms`
4. Next agent : `docs/prompts/pending/PROMPT_ISSUE_484.md`

## Suggested skills

- `/caveman`
- `/tdd`
- Lire `docs/handoffs/HANDOFF_ISSUE_483.md` avant #484

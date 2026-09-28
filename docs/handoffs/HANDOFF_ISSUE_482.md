# Handoff — Issue #482 (Entrées app — intake inline)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/482
- Parent : PRD #480 — `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032 · `docs/ISSUE_DEPENDENCIES_ENTREES_APP.md`
- Branche : `feat/issue-482-entrees-app-intake-inline` — **repo `medijob` only, jamais `git worktree`**
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/489
- Prompt : `docs/prompts/done/PROMPT_ISSUE_482.md` (après merge)
- Next focus : #483 (voir `docs/prompts/pending/PROMPT_ISSUE_483.md`) — blocked by #482

## Livré

- Prisma : `AppIntakeStatus` / `AppCallOutcome` + champs `intakeStatus` (défaut `A_APPELER`), `callOutcome`, `plannedRdvAt`, `notes`
- Migration : `apps/web/prisma/migrations/20260924100000_app_profile_intake_fields/`
- `appProfile.updateIntake` (Zod) — `RDV_PRIS` ⇒ `plannedRdvAt` obligatoire
- Inline cells Entrées app : Intake / Appel / RDV / Notes
- Tests : schema/labels/VM + createCaller + repo + columns

## Décisions

| Sujet | Choix |
|-------|--------|
| Enums Prisma | `AppIntakeStatus` / `AppCallOutcome` (≠ Candidate status) |
| Notes | champ libre `notes` sur AppProfile (pas ActivityLog) |
| Headers colonnes | Intake · Appel · RDV · Notes |
| Mutation | payload complet (pas patch partiel) — refine Zod sur `callOutcome`+`plannedRdvAt` |
| Referent / relance / last-call | hors scope (#483+) |

## Pièges

- `listPending` (EN_ATTENTE) ≠ `listIntakeFollowUp` — ne pas confondre
- Repo split : `app-profile.repository.types.ts` + tests `app-profile-intake.repository.test.ts`
- Router `updateIntake` extrait → `app-profile-intake-update.ts`
- VM list types : `app-profile-list.types.ts` — défaut `intakeStatus` → `A_APPELER` si absent
- `RDV_PRIS` sans date → toast erreur (pas de date auto)
- Fichiers < 100 lignes · Prisma repos only · **jamais `git worktree`**

## Tests manuels

- [ ] Intérim → Entrées app → colonnes Intake / Appel / RDV / Notes
- [ ] Changer Intake status → persist
- [ ] `RDV pris` sans date → erreur
- [ ] `RDV pris` + date → OK
- [ ] Notes blur → persist
- [ ] Profils app encore présent
- [x] Auto : schema + caller + repo + columns verts (session)

## Suite

1. Merge PR #489 → `dev`
2. `git mv docs/prompts/pending/PROMPT_ISSUE_482.md docs/prompts/done/` sur `dev` + push
3. Phase 5 : delete branche locale `feat/issue-482-entrees-app-intake-inline`
4. Next agent : `docs/prompts/pending/PROMPT_ISSUE_483.md`

## Suggested skills

- `/caveman`
- `/tdd`
- Lire `docs/handoffs/HANDOFF_ISSUE_482.md` avant #483

# Handoff — Issue #367 (App-validated → Candidate origine App)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK. CI `quality` + Vercel verts sur #379.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/367
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0026`
- Blocked by : #366 — `docs/handoffs/HANDOFF_ISSUE_366.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/379 → `dev`
- Branche : `feat/issue-367-app-validated-candidate` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (App-validated, Candidate origin, AppProfile, Hireflix invitation)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_367.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #369 (sync champs), #370 (CV/Documents), #371 (comments), #372 (weekly availability), #373 (SUSPENDED) — tous **Blocked by #367**. #368 parallèle (Badakan missions, blocked by #366)

## Livré

App-validated (`searchEmployees` / COMPLETED) crée ou lie un Candidate origine App. Pas le sync champs (#369) ni badge origine sur fiche.

- `syncAppValidated` injecté : create origin APP + status Nouveau ; link email puis tél (`pickAppValidatedMatch` / `phonesMatch`) ; status existant conservé
- AppProfile `EN_ATTENTE` → `APP_VALIDATED` (pas IGNORE) + `candidateId` ; CREATED reste inbox
- Cycle : `searchEmployees` → `syncValidated` → `inviteDue` (Hireflix cancel si plus EN_ATTENTE)
- Schéma : `AppProfileStatus.APP_VALIDATED` — migration `20260831140000_app_profile_status_app_validated`
- Tests deps injectées, 0 call live Badakan. Unitaires 1502 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Sortie inbox | statut `APP_VALIDATED`, pas IGNORE ni ACCEPTE recruteur |
| Fusion | email d’abord, puis tél sans nom (`pickPhoneMatch`) |
| Link | `origin` APP + `badakanId` seulement ; status intouché (Qualifié reste Qualifié) |
| JobTitle create | map `activityLabel`, sinon premier JobTitle `list()` |
| Prisma hors repo | `findJobTitleIdByName` reste dans `app-profile.deps` (déjà là) ; fallback via `jobTitleRepository.list()` |

## Pièges

- **Migrate dans `apps/web`**, pas la racine : `cd apps/web && pnpm exec prisma migrate deploy`. Racine → `Command "prisma" not found`. Sans migrate → `Candidate.origin` manquant **et** enum `APP_VALIDATED` manquant
- Origine App **pas** sur la fiche UI (story PRD 6 hors #367). Preuve = CVthèque Nouveau + Studio `origin = APP` / `AppProfile.status = APP_VALIDATED`
- Cron : `GET /api/cron/app-profiles` + `Authorization: Bearer` (`isCronAuthorized`). Sans `BADAKAN_EMAIL`/`PASSWORD` → `{ skipped: true }`
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Après migrate + sync (ou fixture COMPLETED) : Candidate Nouveau origine App dans CVthèque
- [ ] Même email qu’un Qualifié existant → un seul Candidate, toujours Qualifié
- [ ] Le profil a quitté Profils app ; un CREATED y reste
- [x] Auto : `pnpm test` unitaires 1502 verts ; `typecheck` + `lint:lines` OK

## Suite

1. Merge PR #379 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-367-app-validated-candidate`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#369** (ou #370/#371/#372/#373) depuis `origin/dev` — lire ce handoff. #368 parallèle possible

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

# Handoff — Issue #369 (sync champs Badakan vs CRM)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK. CI `quality` + Vercel verts sur #381.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/369
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0026`
- Blocked by : #367 — `docs/handoffs/HANDOFF_ISSUE_367.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/381 → `dev`
- Branche : `feat/issue-369-badakan-field-sync` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Availability ≠ Weekly availability)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_369.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #370 (CV/Documents), #371 (comments), #372 (weekly availability), #373 (SUSPENDED) — tous **Blocked by #367**, pas par #369

## Livré

Later App-validated sync : Badakan non vide gagne identité / adresse / tél / email / métier. Entretien CRM intouché. Vide n’efface pas.

- `identityPatchFromBadakan` : omit null / blank / `—`
- `syncAppValidated` : `patchIdentityFromRow` sur existing (`badakanId`) **et** après link
- Repo `patchAppIdentity` — Prisma update identity only (`AppIdentityPatch`)
- Métier : `mapJobTitleId` (mapped-only). Create garde `resolveJobTitleId` + fallback premier JobTitle
- Tests injectés : 3 AC + unmapped activity. 0 call live Badakan

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Empty | omit key from patch → CRM row unchanged |
| Entretien | hors type `AppIdentityPatch` (salaire, logiciels, mobilité, `availableFrom`, notes) |
| Job patch | mapped-only — unknown activity ≠ first JobTitle |
| Create | pas de patch (déjà écrit via `createAppCandidate`) |

## Pièges

- **Migrate dans `apps/web`** toujours (origin / `APP_VALIDATED` de #367). #369 = pas de nouvelle migration
- Cron : `GET /api/cron/app-profiles` + Bearer. Sans `BADAKAN_EMAIL`/`PASSWORD` → `{ skipped: true }` → pas de patch
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated. Flake `PharmacyForm` SIRET vu en local, hors #369
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Candidate lié : changer l’adresse côté fixture Badakan → fiche CRM à jour
- [ ] Notes / salaire CRM inchangés après sync
- [ ] Badakan sans tél → tél CRM conservé
- [x] Auto : unitaires #369 verts ; `typecheck` + `lint:lines` + CI `quality` OK

## Suite

1. Merge PR #381 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-369-badakan-field-sync`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#370** / **#371** / **#372** / **#373** depuis `origin/dev` — lire ce handoff + #367

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

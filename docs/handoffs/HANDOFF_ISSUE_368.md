# Handoff — Issue #368 (Badakan missions + SEARCH_APPLIED)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK. CI `quality` en cours / Vercel vert sur #380.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/368
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0027`
- Blocked by : #366 — `docs/handoffs/HANDOFF_ISSUE_366.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/380 → `dev`
- Branche : `feat/issue-368-badakan-missions` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Badakan mission ≠ Mission, SEARCH_APPLIED ≠ Application)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_368.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #376 (vérif Pharmacy SIRET) et #377 (Badakan contracts) — **Blocked by #368**

## Livré

Liste / détail **Badakan missions** dans Intérim. Pas de Mission CRM, pas de MissionCandidate.

- Client : `searchMissions` → `POST /services/v3/missions/search` (`fetchFn` injecté). Toujours lecture seule
- Mapper : officine (`enterprise.enterpriseName`), périodes (`expectedStartDate`/`end` ou `periods[]`), `currentStep`, recipients `SEARCH_APPLIED` + tél
- Persist : `BadakanMission` + `BadakanSearchApplied` — migration `20260831160000_badakan_mission` (déjà `migrate deploy` Neon locale)
- Cycle : même cron Profils app tire `syncMissions` (après inviteDue)
- UI : `/interim` → `/interim/missions` ; détail `/interim/missions/[id]` ; sous-nav « Missions Badakan »
- Router `badakanMission.list` / `getById` via `createServerCaller`

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Vocab | Badakan mission ≠ Mission ; SEARCH_APPLIED ≠ Application |
| Writes Badakan | hors V1 — `searchMissions` only, POST search = lecture paginée |
| Dates | `periods[]` si présent, sinon `expectedStartDate`/`expectedEndDate` |
| Tél | `validatedPhoneNumber` ?? `phone` ?? `mobilePhone` ; `tel:` si présent |
| Liste vide | normal tant que le cron n’a pas tourné (pas de bouton Rafraîchir) |

## Pièges

- **Migrate dans `apps/web`** : `cd apps/web && pnpm exec prisma migrate deploy`. Sans ça → table `BadakanMission` absente
- Liste vide au 1er load → attendre le cron (`GET /api/cron/app-profiles` + Bearer). Sans `BADAKAN_EMAIL`/`PASSWORD` → cycle `{ skipped: true }` → 0 missions
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated. 1 timeout flaky `chat-handler-shortcuts` vu en local, hors #368
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.** **Interdit write Badakan.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Intérim → liste missions Badakan (pas le kanban /missions)
- [ ] Ouvrir une mission : postulés SEARCH_APPLIED + tél si présent
- [ ] Kanban Missions CRM inchangé
- [x] Auto : unitaires #368 verts ; `typecheck` + `lint:lines` OK ; migrate locale appliquée

## Suite

1. Merge PR #380 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-368-badakan-missions`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#376** ou **#377** depuis `origin/dev` — lire ce handoff

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

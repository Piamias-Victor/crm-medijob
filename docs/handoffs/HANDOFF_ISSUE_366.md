# Handoff — Issue #366 (Intérim foundations)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. Facturation OK après migrate locale. CI `quality` vert sur #378.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/366
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0024`–`0030`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/378 → `dev`
- Branche : `feat/issue-366-interim-foundations` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (App-validated, Candidate origin, Badakan mission ≠ Mission, Ligne de suivi ≠ ce module)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_366.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #367 (App-validated → Candidate origine App) et #368 (Badakan missions) en parallèle, tous deux **Blocked by #366**

## Livré

Socle Intérim opérationnel — pas le sync App-validated (#367).

- Client Badakan lecture : `searchEmployees` + GET recipient, `fetchFn` injecté. Aucun POST/PUT/DELETE métier
- Même cron Profils app (`/api/cron/app-profiles`, `isCronAuthorized`) — `runAppProfileCycle` tire aussi `searchEmployees`. Pas de bouton Rafraîchir
- Nav **Intérim** `/interim` (page vide) ≠ Facturation → Intérim `/facturation/interim`
- Schéma : `CandidateOrigin` CRM|APP (défaut CRM) + `badakanId` unique nullable
- Docs : CONTEXT, ADR 0024–0030, `docs/PRD_INTERIM_V1.md`

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Writes Badakan | hors V1 — client n’expose que `searchNewEmployees`, `searchEmployees`, `getRecipient` |
| Cycle | même cron 2 min, deps injectées (`run-cycle.deps.ts`) pour tests sans réseau |
| Origin non-App | `CRM` catch-all (create fiche, Application, Interview) |
| Pagination search | `paged-search.ts` partagé searchNew + searchEmployees |

## Pièges

- **Migrate obligatoire** avant lecture Candidate : `pnpm exec prisma migrate deploy` dans `apps/web`. Sans ça → `The column Candidate.origin does not exist` (Facturation picker). Appliqué sur Neon **locale** de cette session. Preview/prod : déployer la même migration
- `pnpm test` : `*.integration.test.ts` KO si Docker daemon down. Unrelated. Unitaires 1486 verts
- `candidate-origin.integration.test.ts` = unique `badakanId` ; besoin Testcontainers
- Nav `/interim` vs `/facturation/interim` : `isFacturationPath('/interim') === false` — recruteur OK sur opérationnel, FORBIDDEN sur Facturation Intérim
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] Facturation charge après migrate (`origin` en DB) — user
- [ ] Recruteur : nav Intérim s’ouvre, distinct de Facturation → Intérim
- [ ] Facturation → Intérim (Lignes de suivi) inchangé
- [ ] Page `/interim` sans bouton Rafraîchir
- [ ] `pnpm test` vert (Docker up pour integration)

## Suite

1. Merge PR #378 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-366-interim-foundations`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#367** depuis `origin/dev` — lire ce handoff. #368 parallèle possible

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

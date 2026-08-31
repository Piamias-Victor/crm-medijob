# Handoff — Issue #371 (Badakan comments + ActivityLog)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/371
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0024`
- Blocked by : #367 — `docs/handoffs/HANDOFF_ISSUE_367.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/383 → `dev`
- Branche : `feat/issue-371-badakan-comments` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Badakan comment ≠ ActivityLog)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_371.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #372 (weekly availability), #373 (SUSPENDED) — **Blocked by #367**, pas par #371

## Livré

Lecture Badakan comments sur fiche AppProfile CREATED et Candidate origine App. Notes recruteur = ActivityLog. Pas de POST `/comments`.

- `BadakanClient.getComments` : GET `/services/v3/comments/target/{id}` — `fetchFn` injecté, Zod map
- `appProfile.listComments` / `candidate.listComments` (si `badakanId`) — RSC `createCaller`
- UI : `BadakanCommentList` (auteur + date + texte) sur Profils app + onglet Historique Candidate, au-dessus du form ActivityLog
- Read fail / env Badakan manquant → liste vide, fiche tient
- Tests injectés. 0 call live Badakan. Unitaires 1549 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Fetch | on-demand à l’ouverture fiche, pas cron 2 min (évite N GET facturés) |
| Persist | aucun schéma — pas de table comments |
| Notes CRM | `activityLog.create` existant — aucun write Badakan |
| Envelope | array brut **ou** `{ content }` / `{ comments }` Spring |

## Pièges

- Comments **pas** dans GET recipient — endpoint dédié `comments/target/{id}`
- Candidate CRM sans `badakanId` → `[]`, 0 call Badakan
- AppProfile `badakanId` toujours présent (CREATED inbox)
- Cron : `GET /api/cron/app-profiles` + Bearer. Sans `BADAKAN_EMAIL`/`PASSWORD` → `{ skipped: true }` — n’alimente **pas** les comments
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.** **Jamais POST comments Badakan.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Profils app : un CREATED avec comment fixture affiche le texte (auteur + date)
- [ ] Candidate origine App : mêmes comments (onglet Historique)
- [ ] Ajouter une note CRM → ActivityLog ; rien n’est POSTÉ vers Badakan
- [x] Auto : unitaires 1549 verts ; `typecheck` + `lint:lines` + `lint` OK

## Suite

1. Merge PR #383 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-371-badakan-comments`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#372** / **#373** depuis `origin/dev` — lire ce handoff + #367

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

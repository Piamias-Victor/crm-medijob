# Handoff — Issue #486 (Retrait Profils app / ACCEPTE / Hireflix UI)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/486
- Parent : PRD #480 — `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032 · `docs/ISSUE_DEPENDENCIES_ENTREES_APP.md`
- Branche : `feat/issue-486-retire-profils-app` — **repo `medijob` only, jamais `git worktree`**
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/493
- Prompt : `docs/prompts/done/PROMPT_ISSUE_486.md` (après merge)
- Epic #480 : **dernière slice** — Entrées app complète côté agent

## Livré

- Tab Candidats « Profils app » retiré (`CANDIDAT_TAB_ITEMS` = CVthèque + inbox)
- Legacy `?tab=app-profiles` + `/candidats/profils-app/[id]` (+ convert) → redirect `/interim/entrees-app`
- `appProfile.accept` hard-fail `BAD_REQUEST` (ACCEPTE retiré)
- UI Profils app / convert / ACCEPTE / Hireflix invite surface supprimée
- Intake booking SMS **inchangé** (tests calendar SMS verts)

## Décisions

| Sujet | Choix |
|-------|--------|
| Legacy URLs | redirect (pas 404) → `ENTREES_APP_HREF` |
| `accept` | hard-fail mutation (pas suppression procédure — clients anciens) |
| Paths helpers | `appProfileDetailPath` / `convert` → Entrées app |
| Dead UI | delete Section/Table/Detail/Convert/hooks/test buttons |
| SMS | zero touch invite-due / calendar SMS |

## Pièges

- `'accept' in caller` = false positive (tRPC Proxy) → tester call + `markStatus` not called
- Accept Zod sans `data`/`mergeCandidateId` = aussi BAD_REQUEST → tester avec `mergeCandidateId`
- `listPending` / `countPending` restent (cron/sync) — pas la UI Candidats
- Fichiers < 100 lignes · **jamais `git worktree`**

## Tests manuels

- [ ] Candidats tabs = CVthèque + Candidatures only
- [ ] `/candidats?tab=app-profiles` → Entrées app
- [ ] `/candidats/profils-app/<id>` (+ convert) → Entrées app
- [ ] Pas ACCEPTE / Convertir AppProfile
- [ ] Entrées app Ignore / inline OK
- [x] Auto : nav + href + accept hard-fail + SMS booking smoke (session)
- [x] CI quality + Vercel green (PR #493)

## Suite

1. Merge PR #493 → `dev`
2. `git mv docs/prompts/pending/PROMPT_ISSUE_486.md docs/prompts/done/` sur `dev` + push
3. Phase 5 : delete branche locale `feat/issue-486-retire-profils-app`
4. Epic #480 fermée côté slices agent — prochain focus hors ce PRD (humain)

## Suggested skills

- `/caveman`
- Lire `docs/adr/0032-app-intake-follow-up-entrees-app.md` si toucher intake
- Ne pas réintroduire Hireflix invite / ACCEPTE comme porte CVthèque

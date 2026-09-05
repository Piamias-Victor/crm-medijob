# Handoff — Issue #370 (CV / Documents / NIR / IBAN Badakan)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/370
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0029` · `docs/adr/0026`
- Blocked by : #367 — `docs/handoffs/HANDOFF_ISSUE_367.md` · #369 déjà mergé (champs, pas fichiers)
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/382 → `dev`
- Branche : `feat/issue-370-badakan-identity-docs` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Document ≠ `cvUrl`)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_370.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #371 (comments), #372 (weekly availability), #373 (SUSPENDED) — **Blocked by #367**, pas par #370

## Livré

App-validated sync copie le dossier Badakan sur la fiche. CV ≠ Document.

- `fetchBadakanDossier` : GET recipient + download `RESUME` / `NATIONAL_ID_CARD` / `RIB` / `DIPLOMA` — `fetchFn` injecté
- `syncIdentityDossier` : CV → `cvUrl` si vide ; CNI/RIB/DIPLOME → Document si catégorie absente ; NIR/IBAN patch si non vide
- `syncAppValidated.syncDossier` après create / link / existing
- Schéma : `Candidate.nir` / `iban` ; `DocumentCategory` CNI, RIB, DIPLOME — migration `20260831180000_candidate_identity_docs`
- Fiche : `CandidateIdentityNumbers` lecture seule. Matching select + filtres liste sans nir/iban
- Tests injectés. 0 call live Badakan. Unitaires 1539 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| CV | `cvUrl` via blob ; jamais Document |
| Fichiers | skip si `cvUrl` ou catégorie déjà là (cron 2 min ≠ re-download) |
| NIR/IBAN | GET `healthCareNumber` / `bankAccount.iban` ; vide omis |
| UI | lecture seule sous le form profil ; upload manuel CNI/RIB/Diplôme OK |
| Matching | hors `candidateMatchingSelect` / `MatchingCandidateInput` / filtres CVthèque |

## Pièges

- **Migrate dans `apps/web`** : `pnpm exec prisma migrate deploy`. Sans ça → colonnes `nir`/`iban` + enum DocumentCategory manquants
- Dossier = **GET recipient** (listing `searchEmployees` sans docs / NIR / IBAN). 1 GET + downloads par App-validated incomplet
- Cron : `GET /api/cron/app-profiles` + Bearer. Sans `BADAKAN_EMAIL`/`PASSWORD` → `{ skipped: true }`
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Fiche Candidate origine App : CV ouvrable
- [ ] Documents CNI/RIB/diplôme si présents en fixture
- [ ] NIR/IBAN sur la fiche, pas dans un filtre matching
- [x] Auto : unitaires 1539 verts ; `typecheck` + `lint:lines` + `lint` OK

## Suite

1. Merge PR #382 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-370-badakan-identity-docs`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#371** / **#372** / **#373** depuis `origin/dev` — lire ce handoff + #367

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

# Handoff — Issue #481 (Entrées app — nav + liste lecture)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/481
- Parent : PRD #480 — `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032 · `docs/ISSUE_DEPENDENCIES_ENTREES_APP.md`
- Branche : `feat/issue-481-entrees-app-liste` — **repo `medijob` only, jamais `git worktree`**
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/488
- Prompt : `docs/prompts/done/PROMPT_ISSUE_481.md` (après merge)
- Next focus : #482 intake inline (status, outcome, RDV, notes) — blocked by #481

## Livré

- Nav Intérim « Entrées app » → `/interim/entrees-app`
- `appProfile.listIntakeFollowUp` + repo filter `status notIn [APP_VALIDATED, IGNORE]`
- Table lecture seule — colonnes identité (tél, prénom, nom, email, métier, ville, CP, inscrit le = `createdAt`)
- Profils app + `/interim/candidats` inchangés

## Décisions

| Sujet | Choix |
|-------|--------|
| Population défaut | `notIn [APP_VALIDATED, IGNORE]` (pas seulement `EN_ATTENTE`) — inclut `ACCEPTE` rare |
| Inscrit le | `createdAt` (pas `syncedAt`) |
| Detail row | pas de `getRowHref` — table-only (ADR-0032) |
| Profils app | gardé jusqu’à #486 |

## Pièges

- CI `lint:lines` : `app-profile.test.ts` split → `app-profile.test-deps.ts` + `app-profile-intake-list.test.ts`
- `listPending` (EN_ATTENTE) ≠ `listIntakeFollowUp` — ne pas confondre
- Ops intake / archives / Ignore UI / retrait Profils app = issues suivantes
- Fichiers < 100 lignes · Prisma repos only · **jamais `git worktree`**

## Tests manuels

- [ ] Intérim → Entrées app → `/interim/entrees-app`
- [ ] Colonnes identité only
- [ ] APP_VALIDATED / IGNORE absents
- [ ] Profils app encore sous Candidats
- [ ] `/interim/candidats` OK
- [x] Auto : nav + repo + caller + columns verts (session)

## Suite

1. Merge PR #488 → `dev`
2. `git mv docs/prompts/pending/PROMPT_ISSUE_481.md docs/prompts/done/` sur `dev` + push
3. Phase 5 : delete branche locale `feat/issue-481-entrees-app-liste`
4. Next agent : `docs/prompts/pending/PROMPT_ISSUE_482.md`

## Suggested skills

- `/caveman`
- `/tdd`
- Lire `docs/handoffs/HANDOFF_ISSUE_481.md` avant #482

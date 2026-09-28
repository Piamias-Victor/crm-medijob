# Handoff — Issue #485 (Entrées app — sorties + archives + Ignore)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/485
- Parent : PRD #480 — `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032 · `docs/ISSUE_DEPENDENCIES_ENTREES_APP.md`
- Branche : `feat/issue-485-entrees-app-exits-archive` — **repo `medijob` only, jamais `git worktree`**
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/492
- Prompt : `docs/prompts/done/PROMPT_ISSUE_485.md` (après merge)
- Next focus : #486 — `docs/prompts/pending/PROMPT_ISSUE_486.md` (retrait Profils app / ACCEPTE / Hireflix) — blocked by #485

## Livré

- `intakeFollowUpWhere` : population `default` | `archive`
  - default = hors `APP_VALIDATED` / `IGNORE` / `PAS_INTERESSE` / `HORS_CIBLE` / `HORS_ZONE`
  - archive = inverse (OR)
- Schema list : `population` (+ `referentScope` existant)
- UI : toggle **Archives / refusés** + action ligne **Ignorer** (`crm.write`)
- Mutations `ignore` + `updateIntake` → `permissionProcedure('crm.write')`
- Tests : where + list + write permissions + columns

## Décisions

| Sujet | Choix |
|-------|--------|
| Negatives | Call outcome `PAS_INTERESSE`/`HORS_CIBLE` + Intake `HORS_ZONE` |
| Archive | OR status exits ∪ negatives (pas AND) |
| Referent + population | `AND` population puis scope mine |
| Ignore | status `IGNORE` existant ; sync skip déjà couvert |
| Ignore ≠ App-validated | vocabulaire PRD respecté |

## Pièges

- Referent `OR` ne doit **pas** écraser archive `OR` → toujours `AND: [population, referent]`
- `listPending` ≠ `listIntakeFollowUp`
- Repo list tests split : `app-profile-intake-list.repository.test.ts` (lint:lines)
- `crm.write` = tous `USER_ROLES` aujourd’hui → test FORBIDDEN via `vi.spyOn(can)`
- Fichiers < 100 lignes · Prisma repos only · **jamais `git worktree`**

## Tests manuels

- [ ] Call outcome `Pas intéressé` → sort vue défaut
- [ ] Intake `Hors zone` → sort vue défaut
- [ ] **Archives / refusés** → négatifs / Ignore / App-validated
- [ ] **Ignorer** → sort défaut ; sync ne ramène pas
- [ ] Sans write → pas Ignorer / FORBIDDEN
- [x] Auto : where + list + permissions + columns (session)

## Suite

1. Merge PR #492 → `dev`
2. `git mv docs/prompts/pending/PROMPT_ISSUE_485.md docs/prompts/done/` sur `dev` + push
3. Phase 5 : delete branche locale `feat/issue-485-entrees-app-exits-archive`
4. Next agent : `docs/prompts/pending/PROMPT_ISSUE_486.md` — lire ce handoff + #484/#482

## Suggested skills

- `/caveman`
- `/tdd`
- Lire `docs/handoffs/HANDOFF_ISSUE_485.md` avant #486

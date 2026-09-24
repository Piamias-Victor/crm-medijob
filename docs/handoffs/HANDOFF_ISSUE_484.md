# Handoff — Issue #484 (Entrées app — Referent + relance + last-call)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/484
- Parent : PRD #480 — `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032
- Branche : `feat/issue-484-entrees-app-referent-relance` — **repo `medijob` only, jamais `git worktree`**
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/491
- Prompt : `docs/prompts/done/PROMPT_ISSUE_484.md` (après merge)
- Next focus : #485 — `docs/prompts/pending/PROMPT_ISSUE_485.md` (exits + archive + Ignore + `crm.write`)

## Livré

- Prisma : `referentId`, `relanceAt`, `lastCalledAt`, `lastCalledById` + relations User
- Migration : `apps/web/prisma/migrations/20260924110000_app_profile_referent_relance/` (backfill `relanceAt = createdAt`)
- `updateIntake` : Referent + relance ; stamp last-call + bump J+2 si Call outcome **change** ; override relance si outcome inchangé
- Liste : `referentScope` `mine` (défaut) | `all` ; sort `relanceAt` asc
- UI : Referent / Relance (badge overdue) / Dernier appel RO + toggle « Voir tous »
- VMs purs : `app-profile-relance`, `app-profile-intake-stamp`, `app-profile-referent-filter`

## Décisions

| Sujet | Choix |
|-------|--------|
| Stamp last-call | Seulement si `callOutcome` change et non-null |
| Relance après appel | Toujours J+2 depuis stamp (ignore client `relanceAt` sur ce path) |
| Override relance | Outcome inchangé → persist `relanceAt` client |
| Overdue | VM `isRelanceOverdue` / badge — **pas** d’auto-flip Intake status |
| Vocab UI | **Referent** (pas « Attribué à ») |
| Filtre défaut | `mine` = session ∪ `referentId` null |

## Pièges

- Payload `updateIntake` toujours complet → ne pas stamp sur notes-only (comparer previous via `findById`)
- `toAppProfileListItem(row, now?)` — **ne pas** `.map(toAppProfileListItem)` (index → `now`)
- Include repo : `jobTitle` + `referent` + `lastCalledBy`
- `listPending` ≠ `listIntakeFollowUp` — scopes séparés
- Fichiers < 100 lignes · Prisma repos only · **jamais `git worktree`**

## Tests manuels

- [ ] Colonnes Referent / Relance / Dernier appel
- [ ] Assigner Referent ; défaut moi ∪ vide
- [ ] « Voir tous » → file complète
- [ ] Call outcome change → stamp + Relance J+2
- [ ] Override Relance → pas de re-stamp
- [ ] Relance passée → « En retard », Intake inchangé
- [x] Auto : `pnpm test -- app-profile intake referent` (213 verts session)

## Suite

1. Merge PR #491 → `dev`
2. `git mv docs/prompts/pending/PROMPT_ISSUE_484.md docs/prompts/done/` sur `dev` + push
3. Phase 5 : delete branche locale `feat/issue-484-entrees-app-referent-relance`
4. Next agent : `docs/prompts/pending/PROMPT_ISSUE_485.md` — lire ce handoff + #482/#483

## Suggested skills

- `/caveman`
- `/tdd`
- Lire `docs/handoffs/HANDOFF_ISSUE_484.md` avant #485

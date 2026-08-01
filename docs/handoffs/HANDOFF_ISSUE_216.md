# Handoff — Issue #216 (ActivityLog auto create/update)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-216-activitylog-auto`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/216
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/241
- Parent : Epic #210 · CSV V1-008 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_216.md` → `done/` après merge

## Livré

- Helper : `apps/web/src/server/activity-log/log-entity-lifecycle.ts` + `default-lifecycle.ts`
- Constants : `apps/web/src/lib/constants/activity-log-lifecycle.ts`
- Wired create/update : Pharmacy, Contact, Candidate, Mission (routers + deps)
- Adapters : `pharmacy.adapter.ts`, `mission.adapter.ts` (`_app` imports adapters)
- Tests helper + `*-lifecycle.test.ts` routers

## Décisions session

| Sujet | Choix |
|-------|-------|
| Type | `NOTE` (pas de enum SYSTEM V1) |
| Create content | `Fiche créée` |
| Update content | `Fiche modifiée par [name\|email\|Utilisateur]` |
| Author | `ctx.session.user` (pas user Système) |
| Hook | Routers après mutation via `deps.logLifecycle` |
| Scope | create/update fiche only — skip softDelete, status mission, derived, referentials |
| Atomicité | Best-effort (log fail ≠ rollback entité) |

## Hors scope

- Diff champ-par-champ
- Auto-log sur `updateStatus` / `confirmCvExtraction` / soft delete
- Integration tests Docker (testcontainers) — échecs locaux si Docker absent

## Suite

Prochaine slice V1 selon `docs/ISSUE_DEPENDENCIES_V1.md` / epic #210.

## Suggested skills

- `/caveman`
- `/tdd`
- Lire ce handoff + glossaire ActivityLog dans `CONTEXT.md`

# Handoff — Issue #284 (Contact soft-delete UI + Primary guard)

## État

**Prêt merge `dev`.** Branche `feat/issue-284-contact-soft-delete`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/284
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/289
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_284.md` → `done/` après merge
- Glossaire : Primary contact — `CONTEXT.md`
- ADR soft-delete : `docs/adr/0007-soft-delete-only-no-purge-ui-v2.md`

## Livré

Voir diff PR #289. Points d’entrée :

- Garde primaire : `apps/web/src/server/db/repositories/contact-soft-delete.repo.ts`
- Map tRPC : `apps/web/src/server/routers/contact-soft-delete-error.ts`
- UI : `ContactSoftDeleteButton` — liste (`contact-table-actions`) + fiche (`ContactDetailPage`)
- Modal : `soft-delete-modal` propage `error.message`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Seul Primary sur Pharmacy | Blocage + message désigner autre primaire |
| Missions liées (`contactId`) | Soft-delete OK, FK inchangée |
| UI Primary | Même bouton delete ; refus API + toast message |
| Garde | Repo + map router `PRECONDITION_FAILED` |
| ActivityLog | Skip (Pharmacy soft-delete non plus) |

## Suite

- Prompt → `docs/prompts/done/` après merge (règle prompts)
- Issues sœurs éventuelles : #285–#287 (prompts pending)
- Pas de corbeille / restore UI

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `PharmacySoftDeleteButton` si étendre soft-delete autre entité

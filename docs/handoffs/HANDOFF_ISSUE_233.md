# Handoff — Issue #233 (CR hebdo data-driven + meilleurs profils)

## État

**À merger `dev` (CI vert).** Branche `feat/issue-233-assistant-week-report`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/233
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/255
- Parent : Epic #210 · CSV V1-064 / V1-065
- Prompt : `docs/prompts/done/PROMPT_ISSUE_233.md`
- Bloqué par : #232 (mergé)
- Glossaire : Referent, Matching, ActivityLog — `CONTEXT.md`

## Livré

Voir diff PR #255. Points d’entrée :

- Assembly stats : `apps/web/src/server/ai/week-report-assemble.ts` (+ range Paris, format)
- Repo counts : `apps/web/src/server/db/repositories/week-report.repository.ts`
- Shortcuts context : `apps/web/src/server/ai/assistant-shortcut-context.ts`
- Wiring chat : `apps/web/src/server/ai/chat-handler.ts` · `apps/web/src/server/routers/assistant.ts`
- Meilleurs profils format : `apps/web/src/server/ai/best-profiles-format.ts`
- Shortcut def : `apps/web/src/server/ai/shortcuts.ts` (`week-report`, `best-profiles`)

## Décisions session (reco user « go »)

| Sujet | Choix |
|-------|-------|
| Fenêtre | Semaine ISO lun–dim, `Europe/Paris` |
| Referent | User session (`ctx.session.user.id`) |
| CR | Stats CRM injectées → IA narrate (`kind: report`) |
| Candidats contactés | ActivityLog `authorId` + `candidateId` non null |
| Candidatures / offres | Via `jobOffer.mission.referentId` |
| Missions pourvues | `POURVU` + `updatedAt` dans la semaine |
| Meilleurs profils | `runMissionMatching` top 5 ; mission contexte obligatoire |
| Kind meilleurs profils | `summary` |

## Suite

- Validation manuelle post-merge (chiffres vs listes ; matching scorés)
- Dashboard KPI (#210 LOT I) peut réutiliser patterns counts / open statuses
- Pas de timestamp dédié transition POURVU — proxy `updatedAt` jusqu’à éventuel champ

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `HANDOFF_ISSUE_232.md` si retoucher matching / contact

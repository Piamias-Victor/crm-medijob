# Handoff — Issue #232 (Matching prétentions + multi-select contact)

## État

**Prêt merge `dev`.** Branche `feat/issue-232-matching-contact-multiselect`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/232
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/254
- Parent : Epic #210 · CSV V1-053–056 · Q10 hypo A
- Prompt : `docs/prompts/done/PROMPT_ISSUE_232.md`
- Bloqué par : #224 · #227 (mergés)
- Glossaire : Matching, Salary expectations, ActivityLog — `CONTEXT.md`

## Livré

Voir diff PR #254. Points d’entrée :

- Prompt matching + prétentions : `apps/web/src/server/ai/matching-prompt.ts`
- Select candidat matching : `apps/web/src/server/db/repositories/candidate-matching.select.ts`
- Deep links : `apps/web/src/lib/phone/*`, `apps/web/src/view-models/matching-contact-*.ts`
- UI : `MissionMatchingResults` · `MissionMatchingContactPanel` · `MissionMatchingContactBar`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Prétentions score | Soft IA dans prompt + label carte (pas budget mission / pas hard filter) |
| Scope V1-054 | Prétentions only (#232) — softwares/notes hors scope |
| Contact Q10 | A — mailto / sms: / wa.me |
| Batch | Email groupé (to + bcc) ; SMS/WA = N deep links |
| ActivityLog | Prompt après email seulement |
| Pipeline | 1 bouton/carte (pas batch) |
| Tél | Normalize FR → `33…` pour wa.me / sms:+ |

## Suite

- Slices V1 : `docs/ISSUE_DEPENDENCIES_V1.md` (#230/#231/#233…)
- Softwares / notes entretien dans matching = follow-up si demandé
- Q10-B/C = Resend / Twilio seulement si client tranche autrement

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `HANDOFF_ISSUE_224.md` si toucher prétentions candidat

# Handoff — Issue #235 (RGPD Q4–Q7)

## État

**Prêt merge `dev`.** Branche `feat/issue-235-rgpd-compliance`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/235
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/256
- Parent : Epic #210 · CSV V1-010
- Prompt : `docs/prompts/done/PROMPT_ISSUE_235.md`
- Décisions : `docs/grill/QUESTIONS_CLIENT_V1.md` (Q4–Q7 ✅)
- ADR : `docs/adr/0007-soft-delete-only-no-purge-ui-v2.md` (amendé)
- Rétention : `docs/gdpr/RETENTION.md`

## Livré

- Schema : `ConsentSource`, `Candidate`/`Application` consent fields, `GdprEraseAudit` — migration `20260803140000_gdpr_consent_erase_audit`
- Perm `gdpr.erase` (Direction + RH-Admin) ; `candidate.gdprErase` hard cascade DB+Blob + audit sans PII
- Consent optionnel create/import (`MANUAL`/`IMPORT`) ; SITE reserved for future intake
- Admin `/admin/rgpd` + `RGPD_REGISTER_URL` ; CLI alert-only `retention-review-cli.ts`
- UI : case consent create ; bouton Effacement RGPD fiche candidat

## Ops

- Appliquer migration avant/après deploy : `cd apps/web && pnpm exec prisma migrate deploy`
- Set `RGPD_REGISTER_URL` en env prod si lien registre voulu

## Suite

Aucune dette bloquante #235. Hors scope : consent SITE sur intake Application (pas encore d’API site), soft-delete UI manquante autres entités, registre in-app.

## Suggested skills

- `/caveman`
- `/tdd`
- Prisma migrate skills si follow-up schema Application site intake

# Handoff — Issue #375 (SMS unique weekly availability)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/375
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0024`
- Blocked by : #372 — `docs/handoffs/HANDOFF_ISSUE_372.md` · restore #373 — `docs/handoffs/HANDOFF_ISSUE_373.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/387 → `dev`
- Branche : `feat/issue-375-weekly-availability-sms` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Weekly availability, App-validated)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_375.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #376 (vérif Pharmacy SIRET) et #377 (Badakan contracts) — **Blocked by #368**. V1 weekly-availability + SMS **clos**.

## Livré

Un SMS avec le lien secret à App-validated. Pas de cron hebdo. Sans tél : attendre le sync, envoyer une fois. Recruteur renvoie le même URL à la main. Restore ≠ second SMS auto.

- Port `sendAvailabilitySms` injecté (`server/sms`, Brevo transactional SMS, `fetchFn`) — tests sans réseau
- File `smsDue` après `syncValidated` dans `runAppProfileCycle` — pattern `invite-due` (skip sans canal, sent-once)
- Schéma : `WeeklyAvailabilityToken.smsSentAt` — migration `20260831200000_weekly_availability_sms_sent`
- Fiche Candidate origine App : bouton « Renvoyer le lien SMS » (`weeklyAvailability.resendSms`)
- Env : `BREVO_SMS_SENDER` (3–11 alphanum) + `BREVO_API_KEY` existant
- Unitaires 1611 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Port | dossier `server/sms` à côté de `server/brevo` ; fake via deps |
| Sent-once | `smsSentAt` sur le token, pas un flag Candidate |
| Queue | origin APP, pas Inactif, token absent ou `smsSentAt` null |
| Restore | #373 ne crée pas de Candidate → `smsSentAt` intact → pas de 2ᵉ auto |
| Renvoi | même URL ; `markSent` si 1er envoi manuel (évite double auto+manuel) |

## Pièges

- **Migrate dans `apps/web`** : `cd apps/web && pnpm exec prisma migrate deploy`. Sans ça → colonne `smsSentAt` absente. Appliqué sur Neon **locale** de cette session. Preview/prod : même migration
- `BREVO_SMS_SENDER` obligatoire sinon `Envoi SMS indisponible` (fail closed, comme Hireflix email)
- Burst 1er cron : tous les App-origin sans `smsSentAt` + tél reçoivent un SMS (voulu V1)
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Fixture App-validated avec tél : un SMS (ou log adapter) contenant le lien #372
- [ ] Sans tél puis tél au sync suivant : un seul envoi
- [ ] Restore Inactif → COMPLETED : pas de nouvel envoi auto ; bouton renvoyer manuel OK
- [x] Auto : unitaires 1611 verts ; `typecheck` + `lint:lines` OK

## Suite

1. Merge PR #387 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-375-weekly-availability-sms`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#376** ou **#377** depuis `origin/dev` — lire `docs/handoffs/HANDOFF_ISSUE_368.md`. SMS V1 clos.

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)

# Handoff — Issue #213 (4 UserRoles + permission matrix)

## État

**Prêt à merger / en cours de merge sur `dev`.** Branche `feat/issue-213-user-roles-permissions`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/213
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/238
- Parent : Epic #210 · CSV V1-002 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_213.md` → `done/` après merge
- Graphe : `docs/ISSUE_DEPENDENCIES_V1.md` (slice 3)

## Livré

- Enum Prisma `DIRECTION | RECRUTEUR | COMMUNICATION | RH_ADMIN` + migration `20260801140000_user_roles_v1`
- Helper central `can(role, action)` → `apps/web/src/server/auth/permissions.ts`
- tRPC `permissionProcedure(action)` ; `adminProcedure` = `admin`
- Gates câblés : admin users/référentiels, soft delete pharmacy/contact, export CSV candidats
- UI : `useCan('export')`, sidebar/admin layout via `can(..., 'admin')`, labels rôles
- Seeds 4 comptes (`seed-users.ts`) ; fresh DB (mapping legacy ADMIN→RH_ADMIN dans SQL only)
- Tests matrice via `createCaller` : `permissions.test.ts`, `permissions.caller.test.ts`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Enum Prisma | `RH_ADMIN` ; label UI « RH-Admin » |
| CA/Marge | Droit `finance.view` only (pas d’écran finance) |
| Soft delete / export | Direction + RH-Admin only |
| Communication CRM write | **Oui** (override client vs Q2 « lecture seule ») — client a dit bloquer seulement CA/Marge + suppression + export |
| Admin nav | Direction + RH-Admin |
| Last admin | ≥1 user avec `can(..., 'admin')` |
| Seeds | 4 users ; `admin@` = RH-Admin |

## Ops DB note

Neon `.env` OK. P1001 = DNS transient. P1002 advisory lock = pooler / concurrent migrate — schema déjà up to date après premier `migrate deploy` réussi. Prefer Neon **direct** host (sans `-pooler`) pour migrate.

## Suite

Prochaine slice V1 (dépend de #213) : **#219** — Referent optionnel Pharmacy/Contact + filtres.  
Prompt : `docs/prompts/pending/PROMPT_ISSUE_219.md`  
Aussi débloqués plus tard : #234 Finance, #235 RGPD (HITL).

## Suggested skills

- `/caveman`
- `/tdd`
- Prisma migrate skills si schéma `referentId` change (#219)
- Lire `docs/handoffs/HANDOFF_ISSUE_213.md` + `CONTEXT.md` (Referent)

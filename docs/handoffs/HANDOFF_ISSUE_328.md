# Handoff — Issue #328 (Accepter Devis + CA + état commercial)

## État

**Code livré · QA user OK (« super ca marche ») · merge `dev` demandé.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/328
- Parent : PRD #325 · `docs/PRD_FINANCE_DEVIS_V1.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_328.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/334
- Branche : `feat/issue-328-devis-accept-ca-status` — **repo `medijob` only, jamais `git worktree`**
- Règles : `docs/prompt-rules.md`, `docs/github-rules.md`, `CLAUDE.md`

## Livré

`devis.accept({ missionId })` : courant SENT → ACCEPTED + `acceptedAt` + ActivityLog DEVIS. CA dérivé (pas de colonne `Mission.ca`) :

```
CA = ANNULEE ? 0 : (current ACCEPTED ? amountHt : 0)
```

Date bucket CA = `acceptedAt`. `devis.markInvoiced({ missionId, invoicedAt })` : date seule, **ne bouge pas** le mois CA. État commercial dérivé (Sans devis → Envoyé → Accepté → Facturé) — **pas** d’enum `MissionStatus`. Pastille header fiche + onglet Devis (à côté du courant). Marge = `Mission.marge` (#326).

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| CA | **Dérivé** (HT une fois). Pas de colonne stockée |
| Visibilité Mission | **Tout le monde voit tout** (CA, Marge, Facturé, pastille) |
| Facturé | **Tout le monde** peut cocher la date (`crm.write`) |
| `finance.view` | **Page Facturation seulement** (#329) — pas la fiche Mission |
| Pastille | Header **et** onglet Devis à côté du devis courant |
| ANNULEE | CA dérivé 0. **Ne pas vider** `Mission.marge` en DB |

`CONTEXT.md` / issue GitHub disent encore « Recruteur ne voit pas CA ». User a overridé pour la Mission. Corriger le glossaire dans #329 si besoin.

## Pièges

- **Neon / migrate** : `acceptedAt` `20260820120000_devis_accepted_at` + `invoicedAt` `20260820130000_devis_invoiced_at` via `db execute` + `migrate resolve --applied`. DB a encore `#231` absente de certaines branches. **Interdit `prisma migrate reset`.** Local : `pnpm dev`.
- Prisma seulement dans `apps/web/src/server/db/repositories/`. Accept/invoice : `accept-devis.ts` / `invoice-devis.ts` + `devis-lifecycle.ts`.
- Fichiers < 100 lignes. **Jamais** `git worktree`.
- `pnpm test` local : 1286 verts ; 10 fichiers integration KO = Testcontainers / pas de Docker. Pas lié au Devis.

## Tests manuels

- [x] Recruteur accepte → pastille Accepté ; CA = HT ; Marge déjà sur Devis
- [x] Date Facturé ; mois CA inchangé
- [x] User : « super ca marche »

Non retesté ici : ANNULEE → CA 0 ; Communication (même droits Mission).

## Suite

- **#329** Facturation (stats globales). Gate `finance.view` **ici seulement**. Briefing obligatoire.
- Puis #330.
- Phase 5 : checkout `dev`, `git branch -d feat/issue-328-devis-accept-ca-status`. Pas de worktree.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` au briefing #329 (`finance.view` vs fiche Mission déjà ouverte)

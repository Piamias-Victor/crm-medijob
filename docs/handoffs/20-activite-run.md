# Activité V1 — run journal

**Milestone:** [Activité V1](https://github.com/Piamias-Victor/crm-medijob/milestone/20) (#20)  
**Started:** 2026-09-30  
**ADR:** 0036

## Gates

- Rapide: `pnpm test && pnpm typecheck && pnpm lint && pnpm lint:lines`
- Complet: rapide + `pnpm --filter web build`
- Architecture: files ≤ 100 lines, Prisma in repositories only

## Phase maquette

**Skipped.** Existing KPI tiles + Recharts multi-series (Facturation/Pilotage).

## Fait

| Issue | PR | Notes |
|-------|-----|--------|
| #546 ADR+CONTEXT+PRD | #553 | merged |
| #547 schema stamps | #554 | merged; migrate via local `.env` Neon |
| #548 stamping | #555 | merged |
| #549 période | #556 | merged |
| #550 service | #557 | merged |
| #551 page+nav | #558 | merged |
| lifecycle test fix | #559 | merged |
| #552 e2e vitest | (pending) | no Playwright in repo |

## Bloqué

- Captures 390/1440 : besoin navigateur / Direction session — non générées dans ce run
- Integration tests testcontainers : Docker runtime absent ici (échecs préexistants hors Activité)

## À vérifier par Victor

1. Constante `ACTIVITE_STAMP_TRACKING_SINCE` (`apps/web/src/lib/constants/activite.ts`) = date réelle de mise en prod
2. `DATABASE_URL` du `.env` local : migration #547 appliquée sur Neon `ep-summer-waterfall…` — confirmer que ce n’est pas staging/prod
3. Inventaire stamping (PROMPT_ISSUE_548 Compte rendu) vs métier
4. Badakan `createdAt` = 1ʳᵉ synchro CRM
5. Captures manuelles `/activite` 390 + 1440 → `docs/audits/captures/activite/`
6. Lancer migration sur chaque env au déploiement

## Liens

- Milestone: https://github.com/Piamias-Victor/crm-medijob/milestone/20
- PRD: https://github.com/Piamias-Victor/crm-medijob/issues/545
- ADR: `docs/adr/0036-activite-ops-volumes-not-accueil.md`
- PRs: #553–#559

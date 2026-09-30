# Activité V1 — run journal

**Milestone:** [Activité V1](https://github.com/Piamias-Victor/crm-medijob/milestone/20) (#20)  
**Started:** 2026-09-30  
**ADR:** 0036 (libre, créé)

## Gates (from package.json / scripts)

- Rapide: `pnpm test && pnpm typecheck && pnpm lint && pnpm lint:lines`
- Complet: rapide + `pnpm --filter web build`
- Architecture: files ≤ 100 lines (`lint:lines`), Prisma only in repositories, no `any`, RHF+Zod forms, atomic design, view-models bridge

## Phase maquette

**Skipped.** Repo already has KPI tiles (`HomeStatTile` / `PilotageStatTiles`) and multi-series Recharts (`FacturationComposedChart`). Reuse patterns; no `activite-preview.html`.

## Fait

- (en cours)

## Bloqué

- (aucun)

## À vérifier par Victor

- Constante `ACTIVITE_STAMP_TRACKING_SINCE` = date réelle de mise en prod
- Inventaire des chemins de stamping (issue schema/stamp) à valider vs métier
- Badakan `createdAt` = 1ʳᵉ synchro CRM (glossaire)

## Liens

- Milestone: https://github.com/Piamias-Victor/crm-medijob/milestone/20

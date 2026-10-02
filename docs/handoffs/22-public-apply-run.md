# Public apply page V1 — run journal

## Gates (repo)

- Rapide : `pnpm --filter web test` (ciblé) + `pnpm typecheck` + `pnpm lint` + `pnpm lint:lines`
- Complet : `pnpm test` + `pnpm typecheck` + `pnpm lint` + `pnpm lint:lines` (+ lint:prompts si prompts touchés)
- Architecture : fichiers &lt; 100 lignes · zéro `any` · Prisma seulement dans repositories · view-models = pont UI · atoms→molecules→organisms

## Référence design retenue

- **Page** : `/dispo/[token]` → `apps/web/src/app/dispo/[token]/page.tsx` + `MonthlyAvailabilityPage`
- **Pourquoi** : seule page publique candidat sans auth (hors login/reset) ; shell `min-h-dvh bg-surface`, colonne `max-w-2xl`, header sticky blanc/blur, typo Inter + tokens `--color-*`, thank-you plein écran `AvailabilityThankYou`
- **RGPD dispo** : **aucun** — mécanisme privacy créé (env + fail-closed prod)

## Numérotation (lue)

- ADR **0038** · PRD **22** · Milestone **22**

## Fait

- Milestone 22 + PRD #606 + issues #607–#614
- #607–#613 mergés sur `dev` (PRs #615–#621)
- Route live : `/postuler/[boardListingId]`
- Staging PR ouverte **non mergée** : #622

## Bloqué / restant

- **#614** e2e 390 + captures `docs/audits/captures/public-apply/` (pas livré dans ce run)
- Staging PR #622 : conflits possibles staging↔dev (15/14) — review humaine avant merge

## À vérifier par Victor

- `PUBLIC_APPLY_PRIVACY_URL` + `PUBLIC_APPLY_RETENTION_LABEL` sur staging/prod
- Migrations staging : `…postal_source` + `…public_apply_rate_limit`
- URL test Matthieu : `/postuler/{boardListingId}` d’une offre `PUBLIEE`
- Rate limit = table Prisma `PublicApplyRateLimit` (pas Redis)
- Couper ingest board **ops** après switch boutons (code ingest inchangé)

## Liens

- Milestone: https://github.com/Piamias-Victor/crm-medijob/milestone/22
- Staging PR: https://github.com/Piamias-Victor/crm-medijob/pull/622
- ADR: `docs/adr/0038-public-apply-page.md`
- Journal: `docs/handoffs/22-public-apply-run.md`

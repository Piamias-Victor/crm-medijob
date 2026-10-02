# Public apply page V1 — run journal

## Gates (repo)

- Rapide : `pnpm --filter web test` (ciblé) + `pnpm typecheck` + `pnpm lint` + `pnpm lint:lines`
- Complet : `pnpm test` + `pnpm typecheck` + `pnpm lint` + `pnpm lint:lines` (+ lint:prompts si prompts touchés)
- Architecture : fichiers &lt; 100 lignes · zéro `any` · Prisma seulement dans repositories · view-models = pont UI · atoms→molecules→organisms

## Référence design retenue

- **Page** : `/dispo/[token]` → `apps/web/src/app/dispo/[token]/page.tsx` + `MonthlyAvailabilityPage`
- **Pourquoi** : seule page publique candidat sans auth (hors login/reset) ; shell `min-h-dvh bg-surface`, colonne `max-w-2xl`, header sticky blanc/blur, typo Inter + tokens `--color-*`, thank-you plein écran `AvailabilityThankYou`
- **RGPD dispo** : **aucun** — mécanisme privacy à créer (env + fail-closed prod)

## Numérotation (lue)

- Dernier ADR : **0037** → prochain **0038**
- Prochain PRD file : **22-public-apply-page.md**
- Milestone GitHub : à créer « Public apply page V1 »

## Fait

- Milestone 22 + PRD #606 + issues #607–#614
- #607 ADR/CONTEXT/prompts → PR #615 merged
- #608 schema postalCode + source → PR #616 merged
- #609–#611 Zod/CV/rate-limit → PR #617–#619 merged
- #612 submit endpoint → PR #620 (en CI)
- UI #613 en cours local (page `/postuler/[boardListingId]` + form dispo-shell)

## Bloqué

- Captures e2e #614 + PR staging non terminés dans ce run (CI #612 + UI à merger d’abord)

## À vérifier par Victor

- URL politique de confidentialité + durée de conservation (env `PUBLIC_APPLY_PRIVACY_URL`, `PUBLIC_APPLY_RETENTION_LABEL`)
- URL offre test (`boardListingId`) pour Matthieu après deploy staging
- Cutover boutons site + arrêt ops ingest (hors code V1 : ingest inchangé)
- Rate limit : table Prisma `PublicApplyRateLimit` (pas Redis)

## Liens

- Milestone: https://github.com/Piamias-Victor/crm-medijob/milestone/22
- PRD: #606 · ADR: `docs/adr/0038-public-apply-page.md`
- PRs: #615–#620

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

- (en cours) Phase 0 lecture

## Bloqué

- (rien)

## À vérifier par Victor

- URL politique de confidentialité + durée de conservation (env)
- URL offre test (`boardListingId`) pour Matthieu après deploy staging
- Cutover boutons site + arrêt ops ingest (hors code V1 : ingest inchangé dans ce run)

## Liens

- (à remplir)

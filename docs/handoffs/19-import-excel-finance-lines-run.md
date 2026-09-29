# Run — Milestone 19 Import Excel → Lignes de suivi

## Gates (from package.json / CLAUDE.md)

- Quick: `pnpm typecheck && pnpm lint:lines` + unit vitest (exclude `*.integration.test.ts` if Docker unavailable)
- Full: `pnpm test && pnpm typecheck && pnpm lint && pnpm lint:lines` (integration needs Docker)
- Architecture: Prisma only in repositories; files < 100 lines; no `any`; view-models bridge DB↔UI

## Excel locaux

- Présents (gitignored) : `data/import/suivi-25-26.xlsx`, `data/import/chiffre-26-27.xlsx`

## Issues

| Issue | Titre | PR | Gate | Notes |
|-------|-------|----|------|-------|
| #526 | ADR + CONTEXT + gitignore | #533 | OK | merged |
| #527 | Schema nullable FK + importKey | #534 | OK | merged |
| #528 | Parser Excel | #535 | OK | merged |
| #529 | Matching + importKey | #536 | OK | merged |
| #530 | CLI dry-run / apply | #537 | OK | merged |
| #531 | Pilotage unlinked | #538 | OK | merged |
| #532 | UI filtre + lien manuel | #539 | unit+typecheck+lines | merged |

## Fait

- Milestone 19 + issues #526–#532 + prompts done
- ADR 0035 réécrit ; PRD `docs/prd/19-import-excel-finance-lines.md`
- Dry-run local : `docs/audits/import-excel/2026-09-29-dry-run.md` (661 à créer, écarts mois 0 €)
- PR `dev` → `staging` : #540 (ouverte, **non mergée**) — branche `staging` créée depuis `main` (n’existait pas)

## Bloqué

- `--apply` et `prisma migrate deploy` **non exécutés** : `DATABASE_URL` locale pointe Neon (`*.neon.tech`), pas une base locale confirmée (garde-fou).

## À vérifier par Victor

1. Confirmer env local vs Neon ; migrer + `--apply` uniquement sur la cible voulue.
2. 2e `--apply` → 0 création.
3. Pilotage vs Excel mois par mois (dry-run dit gap 0 sur totaux à importer).
4. Lier les 661 lignes non liées (filtre « Non liées ») — matching exact a tout laissé non lié sur le dry-run (catalog CRM probablement vide / noms différents).
5. 50 lignes CA 0 ; 50 Suivi ignorées (chevauchement CHIFFRE) ; référents vides = 661.
6. Merger #540 staging puis prod après validation.

### Commandes (staging puis prod)

```bash
cd apps/web
pnpm exec prisma migrate deploy
pnpm exec tsx --env-file=.env scripts/import-excel-finance-lines.ts \
  --suivi ../../data/import/suivi-25-26.xlsx \
  --chiffre ../../data/import/chiffre-26-27.xlsx
# puis --apply ; puis --apply à nouveau (0 create)
```

## Liens

- Milestone: https://github.com/Piamias-Victor/crm-medijob/milestone/19
- PRD: `docs/prd/19-import-excel-finance-lines.md`
- Dry-run: `docs/audits/import-excel/2026-09-29-dry-run.md`
- PR staging: https://github.com/Piamias-Victor/crm-medijob/pull/540
- PRs issues: #533 #534 #535 #536 #537 #538 #539

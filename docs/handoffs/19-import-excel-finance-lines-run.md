# Run — Milestone 19 Import Excel → Lignes de suivi

## Gates (from package.json / CLAUDE.md)

- Quick: `pnpm test && pnpm typecheck && pnpm lint:lines`
- Full: `pnpm test && pnpm typecheck && pnpm lint && pnpm lint:lines`
- Architecture: Prisma only in repositories; files < 100 lines; no `any`; view-models bridge DB↔UI

## Excel locaux

- Présents (gitignored) : `data/import/suivi-25-26.xlsx`, `data/import/chiffre-26-27.xlsx` (copies Downloads)

## Issues

| Issue | Titre | PR | Gate | Notes |
|-------|-------|----|------|-------|
| #526 | ADR + CONTEXT + gitignore | | | |
| #527 | Schema | | | |
| #528 | Parser | | | |
| #529 | Matching | | | |
| #530 | CLI | | | |
| #531 | Pilotage unlinked | | | |
| #532 | UI link | | | |

## Fait

- Milestone 19 créée
- Issues #526–#532 + prompts pending
- ADR 0035 réécrit ; PRD écrit

## Bloqué

(none yet)

## À vérifier par Victor

(à remplir après apply local)

## Liens

- Milestone: https://github.com/Piamias-Victor/crm-medijob/milestone/19
- PRD: `docs/prd/19-import-excel-finance-lines.md`

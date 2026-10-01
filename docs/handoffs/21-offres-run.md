# Run journal — Milestone 21 Offres standalone + carte + format

## Gates & architecture (note)

- Gate rapide : `pnpm test` + `pnpm lint:lines` (+ tests ciblés)
- Gate complet : `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm lint:lines` · `pnpm lint:prompts`
- Fichiers ≤ 100 lignes · zéro `any` · Prisma only in repositories · view-models · atomic design
- Cartes CRM = Leaflet + OSM (ADR 0013), pas Mapbox
- API Medijob : GET only ; never `--apply` republish

## Format titre retenu (audit GET 95 offres)

Poste seul **61 %** (58/95) ; ville jamais dans le titre ; `entreprise=MEDIJOB` 100 %.

## Fait

| Issue | PR | Gate | Note |
|-------|-----|------|------|
| #564 ADR+CONTEXT | #572 | lint:prompts OK | Merged |
| #565 mapping MEDIJOB | #573 | unit job-board | Merged |
| #566 sections HTML | #574 | ai+renderer | Merged |
| #567 schema+resolver | (pending) | unit+typecheck | migrate NOT run (Neon) |

## Bloqué

- Migration #567 non appliquée : `DATABASE_URL` = Neon (garde-fou base locale uniquement). Victor doit migrer en local puis staging.

## À vérifier par Victor

- [ ] Format titre retenu (poste seul) OK vs attente métier
- [ ] Rendu sections HTML sur 1re offre publiée (site)
- [ ] Sortie `--dry-run` republication avant `--apply`

## Liens

- Milestone : https://github.com/Piamias-Victor/crm-medijob/milestone/21
- ADR : docs/adr/0037-job-offer-without-mission.md
- PRD : docs/prd/21-offres-standalone-carte.md

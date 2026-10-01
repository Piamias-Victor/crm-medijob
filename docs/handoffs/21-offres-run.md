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
| #567 schema+resolver | #575 | unit+typecheck | Merged; migrate NOT run (Neon) |
| #568 create standalone | #576 | unit | Merged; needs migrate |
| #569 Liste\|Carte | #577 | unit | Merged |
| #570 republish dry-run | #578 | unit | Merged; `--apply` never run |
| #571 e2e mocked | #579 | vitest offres-e2e | Merged; mocked only |

## Bloqué

- Migration #567 non appliquée : `DATABASE_URL` = Neon (garde-fou base locale uniquement). Victor doit migrer en local puis staging.
- Captures 390/1440 non produites (pas de session UI browser dans ce run).
- e2e réel publication skippé : env locale a des credentials board → mock only.

## À vérifier par Victor

- [ ] Format titre retenu (poste seul) OK vs attente métier
- [ ] `pnpm --filter web db:migrate` sur DB **locale** puis staging
- [ ] Rendu sections HTML sur 1re offre publiée (site)
- [ ] `pnpm --filter web exec tsx scripts/republish-job-offers.ts` (dry-run) puis `--apply` si OK
- [ ] Captures manuelles `/offres` Liste + Carte + formulaire sans mission

## Liens

- Milestone : https://github.com/Piamias-Victor/crm-medijob/milestone/21
- ADR : docs/adr/0037-job-offer-without-mission.md
- PRD : docs/prd/21-offres-standalone-carte.md
- PRs : #572–#579
- Staging (non mergée) : https://github.com/Piamias-Victor/crm-medijob/pull/580

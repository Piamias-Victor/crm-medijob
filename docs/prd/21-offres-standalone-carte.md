# PRD — Offres standalone + carte + format

Parent milestone: [Offres : standalone + carte + format](https://github.com/Piamias-Victor/crm-medijob/milestone/21)  
Glossary: `CONTEXT.md` (JobOffer, Offre liée, Offre sans mission, Sections d'offre, Mission, Pharmacy). ADR 0037, ADR 0013, ADR 0016.

## Problem Statement

Recruiters publish JobOffers whose public listing shows the pharmacy name as `entreprise`, free-form AI HTML as a wall of text, and only mission-linked offers. They need MEDIJOB branding, structured sections matching the live board majority, standalone offers, and a Liste | Carte view on `/offres`.

## Solution

Correct board mapping (`entreprise = MEDIJOB`, titre = poste seul, ville séparée). Generate description from structured AI JSON via a pure HTML renderer with four fixed sections. Allow JobOffers without a Mission (nullable `missionId` + standalone fields + BAN geocode). Extend `/offres` with Liste | Carte (Leaflet + OSM), source badge and filter. Provide a dry-run republication CLI for Victor; never auto-apply.

## Title / city format (API audit 2026-10-01, n=95)

| Pattern | Count | Share |
|---------|------:|------:|
| Poste seul (ex. `Pharmacien`, `Conseiller en parapharmacie`) | 58 | **61 %** |
| Poste `(H/F)` | 22 | 23 % |
| Poste + contrat sans tiret | 6 | 6 % |
| Poste - contrat | 5 | 5 % |
| Poste H/F | 4 | 4 % |
| Ville présente dans le titre | 0 | 0 % |
| `entreprise = MEDIJOB` | 95 | 100 % |

**Retained format:** `titre` = trimmed job-title label only (no city, no pharmacy, no forced contract suffix). `ville` = separate field. One pure formatter module.

## User Stories

1. As a Recruteur, I want every published listing to show entreprise MEDIJOB, so that pharmacy names never appear as employer.
2. As a Recruteur, I want the titre to be the poste label only, so that listings match the majority of live ads.
3. As a Recruteur, I want ville filled from the pharmacy or standalone city, so that geography stays accurate.
4. As a Recruteur, I want AI generation to return structured sections, so that the HTML is never a free blob.
5. As a Recruteur, I want invalid AI JSON to retry once then fail visibly, so that I never publish malformed HTML.
6. As a Recruteur, I want description HTML with exactly four titled sections, so that the public prose matches the desired layout.
7. As a Recruteur, I want contract, hours and pay in INFORMATIONS COMPLÉMENTAIRES, so that conditions stay in one place.
8. As a Recruteur, I want to create a JobOffer without a Mission, so that I can advertise needs not yet tracked as Mission.
9. As a Recruteur, I want standalone city geocoded via BAN, so that the offer can appear on the map.
10. As a Recruteur, I want a blocked form when the city cannot be geocoded, so that I do not save pin-less standalone offers by mistake.
11. As a Recruteur, I want the mission-linked create/publish path unchanged aside from mapping/format, so that existing workflows keep working.
12. As a Recruteur, I want `/offres` Liste to show all offers with Source badge Mission / Sans mission, so that I can tell them apart.
13. As a Recruteur, I want `/offres` Carte with pins for both sources and a source filter, so that I can explore geography.
14. As Direction, I want a dry-run republish script, so that I see which live listings would change before applying.
15. As Direction, I want `--apply` never run by agents, so that production board writes stay human-gated.
16. As a developer, I want one pure publish resolver, so that linked vs standalone mapping stays single-sourced.
17. As a developer, I want structured API fields left as today, so that we do not invent site UI the board does not render.
18. As Communication, I want the same JobOffer write rights as today, so that permissions do not change.

## Implementation Decisions

- Constant `BOARD_ENTREPRISE = 'MEDIJOB'`; remove pharmacy.name from listing map.
- Pure `formatBoardOfferTitle(jobTitleName)` + ville from resolver.
- Section title constants; Zod offer-sections schema; pure `renderOfferSectionsHtml`; HTML escape; only `p`/`strong`/`ul`/`li`.
- AI `kind: 'offer'` response becomes sections JSON (not `{ title, content }` HTML). Title may still come from formatter, not AI, for publish consistency — generate flow stores formatter title + rendered HTML.
- Prisma: `missionId String? @unique`; add standalone columns needed for publish (`jobTitleName` or FK, `city`, `latitude`, `longitude`, `contractType`, `salaireMin`, `salaireMax`, keep `title`/`content`). Prefer existing JobTitle relation if clean; otherwise string métier label — decide in schema issue with minimal columns.
- Pure `resolveListingSource(offer, mission | null)`.
- Geocode: reuse `geocodeAddressFields` / BAN (ADR 0013).
- UI: EntityViewShell / ViewToggle pattern like Missions; EntityMapWithLayers; pin styling by source.
- Create modal: choose « Depuis une mission » (current) or « Sans mission » (new form).
- CLI republish: `--dry-run` default; mock board in tests; never call live write from agent.
- Maps = Leaflet + OSM (ADR 0013), not Mapbox tokens.

## Testing Decisions

- Unit: listing map always MEDIJOB; title formatter; HTML renderer snapshots; escape; invalid JSON path.
- Unit: resolver linked vs standalone; linked regression (same payload except entreprise/title/description).
- Integration: create standalone blocked without geo; create with geo; mission path still works.
- UI/component: Liste badge; Carte filter; view toggle.
- CLI: dry-run counts with mocked listings port.
- No live board POST/PUT; no `--apply` in CI or agent runs.

## Done criteria

a) Publish payload: `entreprise = MEDIJOB` in 100 % of tests; titre/ville per retained format.  
b) Generated description: exactly four titles, order, `<p><strong>`, no other tags — including invalid AI JSON → error, no HTML.  
c) Standalone offer creates, generates, yields valid mocked publish payload.  
d) Linked offers: same payload as before except entreprise / titre / description.  
e) `/offres` Carte shows both pin types; source filter works.

## Out of Scope

- Any change to medijob-offres Netlify app
- Map on the public offer detail page
- Separate UI blocks outside prose on the public site
- Automatic republication of existing live offers
- Filling `profil_recherche` / salaire_* / avantages for site UI

## Further Notes

Republication of already-live CRM offers is Victor-only via CLI `--apply` after reviewing `--dry-run`.

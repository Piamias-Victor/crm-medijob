# Handoff — Issue #228 (Maps Pharmacies / Candidats / Missions)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-228-crm-maps`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/228
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/252
- Parent : Epic #210 · ADD Maps · Q8 hypo
- Prompt : `docs/prompts/done/PROMPT_ISSUE_228.md` (après ce handoff)
- ADR : `docs/adr/0013-leaflet-osm-maps-ban-geocode.md`
- Bloqué par : #220 · #224 · #227 (mergés)

## Livré

- Geocode BAN sync à la sauvegarde → `latitude`/`longitude` sur Pharmacy + Candidate
- Mission map = coords pharmacie (pas de colonnes Mission)
- Toggle liste/carte (Leaflet + OSM) ×3 ; pin → vue rapide
- Filtres pharmacies map = Client/Prospect/Inactif (statuts existants)
- Missions : filtres contrat/statut déjà côté liste

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Provider carte | Leaflet + OSM |
| Geocode | BAN (`api-adresse.data.gouv.fr`) |
| Timing | Sync à la sauvegarde |
| DB | `latitude` / `longitude` Float? |
| Click pin | Vue rapide ; pas de clustering V1 |

## Suite

Slices liées : `#229` (offres), `#232` (matching) — voir `docs/ISSUE_DEPENDENCIES_V1.md`.  
Note : matching geo runtime peut encore utiliser lookups BAN ; coords persistées disponibles pour raffiner plus tard.

## Suggested skills

- `/caveman`
- `/tdd`
- Relire ADR 0013 + `lib/geo/geocode-address-fields.ts` si toucher maps/geocode

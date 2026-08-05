# Handoff — Issue #286 (Maps zoom + clustering + layers)

## État

**Validé user · merge `dev`.** Branche `feat/issue-286-map-zoom-clustering`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/286
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/291
- Prompt : `docs/prompts/done/PROMPT_ISSUE_286.md`
- ADR : `docs/adr/0013-leaflet-osm-maps-ban-geocode.md`

## Livré

Voir diff PR #291. Points d’entrée :

- Zoom fractionnaire custom : `EntityMapWheelBoost` + `wheel-boost-delta` ; `MAP_WHEEL_PX_PER_ZOOM_LEVEL = 55`
- Clustering : `MAP_CLUSTER_THRESHOLD = 50` + `react-leaflet-cluster`
- Couches multi-entités : `EntityMapWithLayers` + toggles ; primaire = list page filtrée ; extras = `*.mapPins`
- Pins colorés par `entityType` ; QuickView routé via `entity-map-quick-views`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Fetch extras | B — list filtrée page + fetch lean dédié |
| Scope PR | Même PR zoom + couches |
| Sensibilité zoom | 20 trop vite → 45 encore → **55 OK** |

## Suite

- Phase 5 : cleanup branche locale après merge si besoin
- Stash unrelated éventuel : `wip unrelated before issue-286` (hors scope #286)
- Affiner encore `MAP_WHEEL_PX_PER_ZOOM_LEVEL` seulement si nouveau feedback

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `EntityMapWheelBoost` / `constants.ts` si retune zoom

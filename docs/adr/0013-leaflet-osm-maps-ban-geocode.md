# Leaflet + OSM pour les cartes CRM, BAN pour le géocode

Les vues map Pharmacies / Candidats / Missions (#228) localisent des points métier avec filtres existants. Pas besoin de style Mapbox ni de token tiles en V1.

Décision carte : **Leaflet + tuiles OpenStreetMap** (client-only, `react-leaflet`).

Décision géocode : **BAN** (`api-adresse.data.gouv.fr`) via le lookup existant `createGeoQueryLookup` — adresses FR, sans clé API. Coords persistées (`latitude` / `longitude`) sur Pharmacy et Candidate à la sauvegarde ; Mission réutilise les coords pharmacie.

Mapbox reste possible plus tard si branding / style avancé requis.

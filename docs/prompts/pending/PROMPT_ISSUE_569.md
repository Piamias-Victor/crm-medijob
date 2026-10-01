# Prompt — Issue #569

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/569  
**Parent** : Milestone 21 · ADR 0013 / 0037  
**Blocked by** : #567 · #568

## Skills

```
/caveman
/tdd
/code-review
```

Also: vercel-react-best-practices + web-design-guidelines (pas SEO/CRO).

## Critères d'acceptation

- [ ] /offres Liste | Carte toggle
- [ ] Badge Source Mission / Sans mission
- [ ] Pins deux types + filtre source
- [ ] Leaflet+OSM only

## Fichiers probables

- `apps/web/src/components/organisms/OffresPage.tsx`
- JobOffer map view + pins view-model
- job-offer-table columns (source badge)

## Tests manuels

- [ ] /offres Liste : badge source visible
- [ ] Basculer Carte : pins liés + standalone
- [ ] Filtre source Masquer mission / Masquer standalone
- [ ] Viewport 390 et 1440

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install
pnpm dev
```

## Compte rendu


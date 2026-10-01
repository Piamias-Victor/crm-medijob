# Prompt — Issue #565

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/565  
**Parent** : Milestone 21 · ADR 0037  
**Blocked by** : #564

## Skills

```
/caveman
/tdd
/code-review
```

## Critères d'acceptation

- [x] `entreprise === "MEDIJOB"` always in listing map tests
- [x] Pure title/ville formatter (poste seul; ville séparée)
- [x] Never pharmacy.name as entreprise

## Compte rendu

- `format-board-offer.ts` : BOARD_ENTREPRISE, formatBoardOfferTitle, formatBoardOfferCity
- `toBoardListing` : entreprise MEDIJOB ; titre = jobTitleName ; ville séparée
- Tests listing-map / build-listing / format-board-offer verts

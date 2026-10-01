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

- [ ] `entreprise === "MEDIJOB"` always in listing map tests
- [ ] Pure title/ville formatter (poste seul; ville séparée)
- [ ] Never pharmacy.name as entreprise

## Fichiers probables

- `apps/web/src/server/job-board/listing-map.ts`
- `apps/web/src/server/job-board/listing-labels.ts` (or new format module)
- `apps/web/src/server/job-board/listing-map.test.ts`
- `apps/web/src/server/job-board/build-listing.ts`

## Tests manuels

- [ ] Publier une offre liée en local (board mock) : payload entreprise MEDIJOB
- [ ] Titre = métier, ville = ville pharmacie
- [ ] Régression : slug / contrat / salaires toujours mappés

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm --filter web test -- listing-map
pnpm lint:lines
```

## Compte rendu


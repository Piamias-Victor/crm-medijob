# Prompt — Issue #570

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/570  
**Parent** : Milestone 21 · ADR 0037  
**Blocked by** : #565 · #566 · #567

## Skills

```
/caveman
/tdd
/code-review
```

## Critères d'acceptation

- [ ] CLI `--dry-run` default: counts + summary sans données nominatives
- [ ] `--apply` implemented; agent never runs it
- [ ] Tests mock board port only

## Fichiers probables

- `apps/web/scripts/republish-job-offers.ts` (or similar)
- unit tests with mocked port

## Tests manuels

- [ ] `pnpm --filter web exec tsx scripts/republish-job-offers.ts --dry-run` (local DB)
- [ ] Confirmer aucune écriture board
- [ ] Ne PAS lancer `--apply`

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm --filter web test -- republish
pnpm lint:lines
```

## Compte rendu


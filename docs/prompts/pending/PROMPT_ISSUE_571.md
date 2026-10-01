# Prompt — Issue #571

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/571  
**Parent** : Milestone 21  
**Blocked by** : #568 · #569

## Skills

```
/caveman
/tdd
/code-review
```

## Critères d'acceptation

- [ ] Vitest: standalone create → generate → HTML 4 sections (AI+board mocked)
- [ ] Liste/Carte toggle covered
- [ ] No live Medijob write; if env can publish for real, skip and note handoff

## Fichiers probables

- `apps/web/src/**/offres-e2e*.test.ts`
- component tests OffresPage

## Tests manuels

- [ ] Lancer suite e2e vitest
- [ ] Confirmer mocks board (pas d'appel réseau offres)
- [ ] Smoke UI /offres Liste↔Carte

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm --filter web test -- offres-e2e
pnpm typecheck
pnpm lint
pnpm lint:lines
```

## Compte rendu


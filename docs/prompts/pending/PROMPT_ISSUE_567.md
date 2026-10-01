# Prompt — Issue #567

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/567  
**Parent** : Milestone 21 · ADR 0037  
**Blocked by** : #564

## Skills

```
/caveman
/tdd
/code-review
```

## Critères d'acceptation

- [ ] `missionId` nullable `@unique` + standalone fields + local migration
- [ ] Pure publish resolver linked vs standalone
- [ ] Linked non-regression aside from entreprise/titre/description

## Fichiers probables

- `apps/web/prisma/schema.prisma`
- `apps/web/prisma/migrations/*_job_offer_standalone/`
- `apps/web/src/server/job-board/resolve-listing-source.ts`
- build-listing / lifecycle adapters

## Tests manuels

- [ ] `pnpm --filter web db:migrate` local only
- [ ] Offre liée existante toujours chargeable
- [ ] Créer ligne Prisma standalone (script/test) sans missionId

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm --filter web test -- resolve-listing
pnpm --filter web test -- build-listing
pnpm typecheck
pnpm lint:lines
```

## Compte rendu


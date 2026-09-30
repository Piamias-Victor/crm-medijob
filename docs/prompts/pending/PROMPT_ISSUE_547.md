# Prompt — Issue #547

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/547  
**Parent** : #545 · ADR 0036  
**Blocked by** : #546

## Skills

```
/caveman
/tdd
/code-review
```

Local migrate only. No backfill. No staging/prod DB.

## Contexte

Add nullable `qualifiedAt`, `pourvuAt`, `staffedAt` + indexes on filtered date columns.

## Critères d'acceptation

- [ ] Candidate.qualifiedAt, Mission.pourvuAt, BadakanMission.staffedAt nullable
- [ ] Indexes on those + badakanValidatedAt / createdAt as needed
- [ ] Migration no data fill; existing NULL
- [ ] `prisma generate` + local migrate OK

## Fichiers probables

- `apps/web/prisma/schema.prisma`
- `apps/web/prisma/migrations/*_activite_stamps/`

## Compte rendu

(à remplir)

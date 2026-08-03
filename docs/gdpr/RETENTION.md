# Rétention RGPD — politique V1 (Q5)

Alert-only : aucun job ne purge automatiquement. Revue humaine puis soft delete ou effacement RGPD.

## Durées (mois)

| Catégorie | Mois | Constante |
|-----------|------|-----------|
| Candidats inactifs | 24 | `CANDIDATE_INACTIVE` |
| Candidats blacklistés | 36 | `CANDIDATE_BLACKLISTED` |
| Candidatures refusées | 12 | `APPLICATION_REFUSED` |
| RIB post-mission | 12 | `DOCUMENT_RIB_POST_MISSION` |
| Pharmacies inactives | — | pas de purge auto |

Source code : `apps/web/src/server/gdpr/retention-policy.ts`

## Revue manuelle

```bash
cd apps/web
pnpm exec tsx src/server/gdpr/retention-review-cli.ts
```

Affiche les IDs dus pour revue (candidats `INACTIF` / `BLACKLISTE` selon `updatedAt`). Pas de delete.

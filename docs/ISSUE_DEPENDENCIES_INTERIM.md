# Graphe de dépendances — Intérim V1 (Badakan)

> **Epic parente** : [#365 — PRD Intérim V1](https://github.com/Piamias-Victor/crm-medijob/issues/365)  
> **Sources** : `docs/PRD_INTERIM_V1.md` · ADR 0024–0030 · `CONTEXT.md`  
> **Prompts** : `docs/prompts/pending/PROMPT_ISSUE_{NNN}.md` — une issue = un prompt. **Ne pas** implémenter #365 en une PR.

## Mapping

| Slice | GitHub | Type | Titre |
|-------|--------|------|-------|
| 1 | #366 | AFK | [INTERIM] Fondations — client lecture Badakan, schéma, nav Intérim |
| 2 | #367 | AFK | [INTERIM] App-validated crée ou lie un Candidate origine App |
| 3 | #369 | AFK | [INTERIM] Sync champs Badakan vs CRM (identité vs entretien) |
| 4 | #370 | AFK | [INTERIM] CV, Documents et identité Badakan sur la fiche Candidate |
| 5 | #371 | AFK | [INTERIM] Badakan comments en lecture + notes ActivityLog |
| 6 | #372 | AFK | [INTERIM] Weekly availability — page publique et lien secret |
| 7 | #374 | AFK | [INTERIM] Filtre dispos créneau + métier + geo |
| 8 | #368 | AFK | [INTERIM] Liste Badakan missions et postulés SEARCH_APPLIED |
| 9 | #376 | AFK | [INTERIM] Vérif Pharmacy SIRET + Contact principal |
| 10 | #377 | AFK | [INTERIM] Liste Badakan contracts (pas Ligne de suivi) |
| 11 | #373 | AFK | [INTERIM] SUSPENDED/BANNED → Inactif et restore |
| 12 | #375 | AFK | [INTERIM] SMS unique à App-validated (lien weekly availability) |

## Blocked by

```
#366  →  (aucun)
#367  →  #366
#368  →  #366
#369  →  #367
#370  →  #367
#371  →  #367
#372  →  #367
#373  →  #367
#374  →  #372
#375  →  #372
#376  →  #368
#377  →  #368
```

```
#366
├─ #367 → #369, #370, #371, #372, #373
│              #372 → #374
│              #372 → #375
└─ #368 → #376, #377
```

Finance `/facturation/interim` (Lignes de suivi) est **hors** ce graphe.

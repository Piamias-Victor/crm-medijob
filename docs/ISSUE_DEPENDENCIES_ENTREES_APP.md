# Graphe de dépendances — Entrées app (App intake follow-up)

> **Epic parente** : [#480 — PRD Entrées app](https://github.com/Piamias-Victor/crm-medijob/issues/480)  
> **Sources** : `docs/PRD_APP_INTAKE_FOLLOW_UP.md` · ADR-0032 · `CONTEXT.md`  
> **Prompts** : `docs/prompts/pending/PROMPT_ISSUE_{NNN}.md` — une issue = un prompt. **Ne pas** implémenter #480 en une PR.

## Mapping

| Slice | GitHub | Type | Titre |
|-------|--------|------|-------|
| 1 | #481 | AFK | [ENTREES-APP] Nav + liste lecture |
| 2 | #482 | AFK | [ENTREES-APP] Intake inline — status, outcome, RDV, notes |
| 3 | #484 | AFK | [ENTREES-APP] Referent + relance + last-call |
| 4 | #485 | AFK | [ENTREES-APP] Sorties négatives + archives + Ignore ligne |
| 5 | #483 | AFK | [ENTREES-APP] Comments Badakan + indicateur SMS |
| 6 | #486 | AFK | [ENTREES-APP] Retrait Profils app / ACCEPTE / Hireflix UI |

## Blocked by

```
#481  →  (aucun)
#482  →  #481
#483  →  #481
#484  →  #482
#485  →  #482
#486  →  #485
```

```
#481 ──► #482 ──► #484
 │         └──► #485 ──► #486
 └──► #483
```

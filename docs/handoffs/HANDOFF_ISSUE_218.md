# Handoff — Issue #218 (KPI CSV + centre d’alertes)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-218-dashboard-kpi-alerts`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/218
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/243
- Parent : Epic #210 · CSV V1-066 / V1-067 · Q11 hypo 7j
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_218.md` → `done/` après merge

## Livré

- `dashboard.overview` étendu : KPIs + `alerts` (buckets `count` + `items`)
- Constante Q11 : `apps/web/src/lib/constants/dashboard-alerts.ts` (`OVERDUE_FOLLOWUP_DAYS = 7`)
- Repo split : `dashboard.kpis.ts` · `dashboard.alerts.ts` · `dashboard-open-status.ts`
- VM : `home-kpi` · `home-alerts` · `dashboard-fill-rate` · `dashboard-overdue`
- UI `/accueil` : section Indicateurs clés + Centre d’alertes + Création rapide

## Décisions session

| Sujet | Choix |
|-------|-------|
| À pourvoir | `status = A_POURVOIR` seul |
| Urgentes | `startDate ≤ now+48h` + statut ouvert (non terminal) |
| Remplissage | `POURVU / (missions hors ANNULEE)` % arrondi |
| Non couvertes | missions ouvertes **sans** `MissionCandidate` |
| Relance retard | pas d’ActivityLog depuis 7j ; ancre = `max(date)` sinon `createdAt` |
| Liens alertes | mission → `/missions/:id` ; candidatures → inbox ; listes missions génériques (pas de filtres URL) |
| Anciens tuiles candidats/pharmacies | retirées de la grille KPI ; compteurs gardés pour nav pills |

## Hors scope

- Filtres query sur `/missions` (urgence / non couverte / overdue)
- Règle Q11 client finale (hypo 7j documentée)
- Integration tests Docker (testcontainers) — échecs locaux si Docker absent

## Suite (post-merge)

1. `git mv docs/prompts/pending/PROMPT_ISSUE_218.md docs/prompts/done/`
2. Commit + push direct sur `dev` (docs/prompts only)
3. Option follow-up : filtres URL missions pour alertes « cliquables filtrées »

## Suggested skills

- `/caveman`
- `/tdd`
- Lire ce handoff + `apps/web/src/server/db/repositories/dashboard.repository.ts` avant toute suite dashboard

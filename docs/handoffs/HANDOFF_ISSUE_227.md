# Handoff — Issue #227 (Tableau missions CSV + filtres + profilRecherche)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-227-missions-table-csv`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/227
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/251
- Parent : Epic #210 · CSV V1-041–V1-047 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_227.md` (après ce handoff)
- Bloqué par : #219 · #215 (mergés) — handoffs `HANDOFF_ISSUE_219.md` · `HANDOFF_ISSUE_215.md`
- Patterns : EntityTable contacts/pharmacies · quick-view #215 · référent filtres #219

## Livré

- `/missions` : EntityTable colonnes CSV + vue rapide ; kanban toggle optionnel (défaut = table)
- Filtres CSV serveur : contrat, statut, métier, ville, département, pharmacie, référent, période
- Champ `profilRecherche` : migration Prisma + schema/form/detail
- `mission.quickView` + panel (coords pharmacie, statut, contrat, métier, référent, dernière action)
- Vacation conservé dans `ContractType`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Vue défaut | Tableau ; kanban toggle |
| Vue rapide | Coords pharmacie + statut + contrat + métier + référent + last action |
| profilRecherche | `String?` texte libre |
| V1-044–047 | Hors scope (sauf garder Vacation) |
| Filtres | Pattern list pharmacies/contacts (serveur) |
| Colonnes extras | Garder utiles (ex. contrat, startDate côté raw/kanban) |

## Hors scope

- Salaires / planning / candidats rattachés (déjà partiels ailleurs)
- Suppression de `MissionList` / cartes (laissés inutilisés)

## Suite

Slices débloquées après merge : `#228` (maps), `#229` (offres), `#232` (matching) — voir `docs/ISSUE_DEPENDENCIES_V1.md`.

## Suggested skills

- `/caveman`
- `/tdd`
- Relire ce handoff + `HANDOFF_ISSUE_215.md` / contacts EntityTable si autre liste ops

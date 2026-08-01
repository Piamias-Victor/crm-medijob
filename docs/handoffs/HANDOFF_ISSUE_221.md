# Handoff — Issue #221 (Historique mixte + type contrat Besoins)

## État

**PR + handoff prêts — merge sur `dev`.** Branche `feat/issue-221-pharmacy-history-besoins`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/221
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/246
- Parent : Epic #210 · CSV V1-018 / V1-020 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_221.md`
- Blocked by : #216 (mergée)

## Livré

- VM : `terminalMissions` dans `toPharmacyDetail` ; `toPharmacyHistoryItems` (`pharmacy-history.ts`)
- Repo : `updatedAt` missions dans `pharmacy.repository` detail include
- UI Besoins : badge contrat (`CONTRACT_TYPE_LABELS`) sur `PharmacyBesoinsTab`
- UI Historique : `PharmacyHistoryTab` + timeline mixte logs / missions terminales
- Tests VM + RTL Besoins / Historique

## Décisions session

| Sujet | Choix |
|-------|-------|
| Contenu mission historique | Titre + statut + contrat + métier + date |
| Date tri | `updatedAt` (proxy transition terminale) |
| Modèle timeline | Union `{ kind: 'log' \| 'mission' }` via VM |
| Lien mission | Oui → `/missions/[id]` |
| Filtres type ActivityLog | Missions toujours visibles |
| Payload | `activeMissions` + `terminalMissions` même fetch |
| Badge contrat Besoins | Badge seul (pas de groupement par type) |
| Logs `entityType=MISSION` | Hors scope Historique pharmacie |
| Soft-delete | Exclus (comme ailleurs) |

## Hors scope

- Groupement Besoins par type contrat (optionnel CSV)
- Candidat placé sur carte POURVU
- Champ dédié date de transition terminale
- Badge compteur onglet Historique

## Suite

Prochaine slice V1 selon `docs/ISSUE_DEPENDENCIES_V1.md` / epic #210.

## Suggested skills

- `/caveman`
- `/tdd`
- Lire ce handoff + V1-018/V1-020 dans `docs/grill/CSV_V1_DECISIONS.md`

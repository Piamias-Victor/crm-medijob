# Handoff — Issue #220 (Colonnes/filtres CSV pharmacies + statut Client)

## État

**PR ouverte, merge demandé sur `dev`.** Branche `feat/issue-220-pharmacy-table-csv`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/220
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/245
- Parent : Epic #210 · CSV V1-011 / V1-012 / V1-016 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_220.md` (après ce handoff)
- Bloqué par : #215 / #219 (mergés)
- Glossaire : Pharmacy status dans `CONTEXT.md` (Client / Prospect / Inactif)

## Livré

- VM liste : `postalCode`, `createdAtLabel`, `referentName` — `apps/web/src/view-models/pharmacy-list.ts`
- Include list + split fichier : `pharmacy-list-include.ts`
- Colonnes table : CP, date d’ajout, référent (extras gardés)
- Filtres : ville (text contains) + région (mapping 12 régions → depts) — `french-region-departments.ts`
- Label UI `ACTIF` → « Client » via `STATUS_LABELS` (enum Prisma inchangé)
- Vue rapide #215 réutilisée telle quelle

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Colonnes | CP après Ville ; date = `createdAt` fr-FR ; référent null → `—` |
| Filtre ville | contains insensitive |
| Filtre région | Mapping dept→région (pas de champ DB) ; métropole hors Corse/DOM |
| Filtre référent | Déjà #219 — colonne seule ici |
| Statut | Label only ACTIF→Client, pas de migration enum |
| Vue rapide | Aucun rework |
| Tests | VM, labels, where ville/région, filter map |

## Suite

Slices V1 suivantes selon `docs/ISSUE_DEPENDENCIES_V1.md` (souvent contacts #223, candidats #224, missions #227).

## Suggested skills

- `/caveman`
- `/tdd`
- Lire `CONTEXT.md` (Pharmacy status) + ce handoff + `HANDOFF_ISSUE_215.md` / `HANDOFF_ISSUE_219.md` si suite listes

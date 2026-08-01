# Handoff — Issue #222 (Import CSV pharmacies + dédup/fusion)

## État

**PR ouverte, merge demandé sur `dev`.** Branche `feat/issue-222-pharmacy-csv-import`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/222
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/247
- Parent : Epic #210 · CSV V1-021 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_222.md` (après ce handoff)
- Bloqué par : #220 (mergé)
- Pattern fusion : `docs/handoffs/HANDOFF_ISSUE_170.md`

## Livré

- Parse CSV `;` + BOM — `apps/web/src/lib/csv/parse-csv.ts`
- Mapping interactif + Zod row — `pharmacy-csv-import.schema.ts`, wizard `/pharmacies/import`
- Commit : crée lignes sans doublon ; file doublons sessionStorage — `commitPharmacyImport`, `pharmacy-import-queue-storage`
- Dédup SIRET **ou** nom+ville+CP (soft-deleted inclus) — `detectPharmacyDuplicates`, `pharmacy-duplicate.repo`
- Fusion `/pharmacies/duplicate-review` — réutilise `DuplicateDetectionPage` ; `pharmacy.merge` transfert Contact/Mission/ActivityLog/Document
- Entrée UI : bouton « Importer CSV » sur liste pharmacies
- tRPC : `pharmacy.detectDuplicate` / `merge` / `commitImport`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| UX | Wizard upload → mapping → preview → commit |
| Erreurs format | Bloquantes en preview ; pas d’écriture partielle silencieuse |
| Dédup | SIRET prioritaire ; sinon nom+ville+CP normalisés ; soft-deleted = doublon |
| Fusion | Aligné #170 (fusion / ignorer / picker multi-match) |
| Champs CSV V1 | name*, siret, address, city, postalCode, phone, email, status, notes |
| Statut | Client→ACTIF ; défaut PROSPECT ; labels #220 |
| Limites | UTF-8+BOM, max 5 Mo / 2000 lignes |

## Suite

Slices V1 suivantes : `docs/ISSUE_DEPENDENCIES_V1.md` (contacts #223, candidats #224 / import #240-ish V1-040, missions #227).

## Suggested skills

- `/caveman`
- `/tdd`
- Relire ce handoff + `HANDOFF_ISSUE_170.md` si import candidats CSV (même pattern)

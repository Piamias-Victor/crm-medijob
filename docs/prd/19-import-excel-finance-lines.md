# PRD — Import Excel → Lignes de suivi

Parent milestone: [Import Excel → Lignes de suivi](https://github.com/Piamias-Victor/crm-medijob/milestone/19)  
Glossary: `CONTEXT.md` (Ligne de suivi, Placement, Pilotage, Exercice, Encaissé). ADRs 0017, 0019, 0021, 0035.

## Problem Statement

Direction steers CA/Marge from two Excel workbooks (Suivi 25/26, CHIFFRE 26/27). CRM Facturation Pilotage is empty on this aspect. They need a one-shot import into Lignes de suivi so Pilotage replaces Excel, then abandon the sheets.

## Solution

CLI one-shot import (Syncro pattern): parse month sheets, write `FinanceLine` rows with nullable Pharmacy/Candidate + Excel labels + unique `importKey`, dry-run report without PII, `--apply` transactional. Manual link UI for unlinked rows. Primary success: for each imported month, Pilotage CA sum and Marge sum equal the Excel sheet totals (0 € gap).

## User Stories

1. As Direction, I want every Excel month-sheet row as one Ligne de suivi, so that Pilotage matches Excel reality.
2. As Direction, I want CHIFFRE to win whole overlapping months vs Suivi, so that 26/27 figures are current.
3. As Direction, I want SAISIE and Excel Objectifs ignored, so that drafts and Admin Objectifs stay clean.
4. As Direction, I want `occurredAt` = first day of the sheet month, so that monthly totals match Excel TOTAL.
5. As Direction, I want Pharmacy/Candidate optional on imported lines with raw labels kept, so that CA still books before linking.
6. As Direction, I want exact-name auto-link when possible, so that I link fewer rows by hand.
7. As Direction, I want CRM create to still require Pharmacy + Candidate, so that day-to-day entry stays clean.
8. As Direction, I want Referent matched (first name if co-credit), so that the commercial matrix stays usable.
9. As Direction, I want Facturé and Encaissé/Payé imported, so that payment status survives.
10. As Direction, I want empty CA imported as 0, so that NoGo/pipeline rows are not dropped.
11. As Direction, I want Intérim hours imported without a derived rate, so that amounts stay Excel-faithful.
12. As Direction, I want a dry-run report with counts and month reconciliation only (no names), so that I can validate safely.
13. As Direction, I want a second `--apply` to create zero rows, so that re-import is safe.
14. As Direction, I want to filter and manually link unlinked lines (`finance.view`), so that I can attach CRM entities later.
15. As Direction, I want unlinked lines included in Pilotage aggregates, so that totals still match Excel.
16. As RH-Admin, I want the same Facturation rights as Direction for link and view.

## Implementation Decisions

- Files: `data/import/` local only (gitignored). CLI args `--suivi` / `--chiffre` paths.
- Idempotence: **skip** on existing `importKey` (not upsert) — preserves manual links and flags edited after import.
- `importKey` = stable hash of `(exercice, month, sheetRowNumber, pharmacyLabel, candidateLabel)`.
- Schema: nullable `pharmacyId`/`candidateId`; `pharmacyLabel`, `candidateLabel`, `referentLabel`; unique `importKey`; `source` enum `UI | EXCEL_IMPORT`; hours already on model.
- Parser: pure functions + anonymized tiny `.xlsx` fixtures generated in tests (never real names).
- Overlap: if month M exists in CHIFFRE, drop all Suivi rows for M.
- Matching: normalize trim + lowercase; Pharmacy by name; Candidate by `"firstName lastName"` and reverse; Referent by User name fields.
- CLI default dry-run writes `docs/audits/import-excel/<date>-dry-run.md` with counts only (no PII). `--apply` one DB transaction.
- Pilotage: null pharmacy → bucket « Non liée »; CA/Marge still summed.
- Link mutation: set `pharmacyId`/`candidateId` without clearing labels; `finance.view` only.
- No Devis created or touched by import.
- Gates: quick = `pnpm test` + `pnpm typecheck` + `pnpm lint:lines`; full = + `pnpm lint`. Files ≤ 100 lines.

## Testing Decisions

- Good tests assert public behavior (sums, skip on second apply, UI create rejects missing Pharmacy/Candidate, Pilotage includes unlinked).
- Parser/matcher: pure unit tests with generated anonymized workbooks.
- CLI apply twice: second creates 0.
- No real person/pharmacy names in fixtures, reports, or test logs.

## Out of Scope

- Excel Objectifs / monthly ramp targets
- SAISIE import
- UI xlsx upload
- Date début/fin / Fonction / Mission on import
- Staging/prod `--apply` by the agent (Victor only)
- Changing Pilotage Devis union rules beyond including unlinked lines

## Further Notes

Ticket order: docs → schema → parser → matching → CLI → Pilotage display → link UI. Dependencies as in milestone issues.

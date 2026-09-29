# Excel month rows import as Lignes; Pharmacy/Candidate may be unlinked

## Context

Historical CA/Marge live in Excel Exercice month sheets (Suivi 25/26 + CHIFFRE 26/27). Facturation Pilotage must replace that Excel. ADR 0017 required Pharmacy + Candidate on every Ligne de suivi and treated one Placement as one hire — that blocks a faithful import (free-text names, monthly re-bookings of the same deal).

## Decision

1. One-shot CLI import of **month sheets only** into Lignes de suivi (`FinanceLine`); Excel is abandoned afterward.
2. **One month-sheet row = one FinanceLine** (Excel is the CA unit of truth).
3. Sources: Suivi 25/26 + CHIFFRE 26/27. When the same calendar month exists in both, **CHIFFRE wins the whole month**; Suivi rows for that month are ignored and counted in the report.
4. SAISIE sheets and Excel Objectifs are ignored (Admin Objectif singleton unchanged).
5. `occurredAt` = first day of the sheet month.
6. `pharmacyId` / `candidateId` are **nullable in DB**. Always store raw Excel labels (`pharmacyLabel`, `candidateLabel`). Auto-link only on exact normalized name match (trim + case-fold); otherwise unlinked until manual link in UI.
7. CRM UI **create** still **requires** Pharmacy + Candidate (form/service validation, not DB NOT NULL). Proven by test.
8. Referent: exact User name match; co-credit → first name only; else empty (`referentLabel` kept).
9. Import flags: Facturé → `invoiced`; Encaissé/Payé → `paid`. Other flag columns ignored.
10. Empty CA → `amountHt` 0 (NoGo-capable); listed separately in the report.
11. Intérim: import numeric `hours`; never derive `hourlyRate`. Placement ignores the hours column.
12. Date début/fin, Fonction, Mission ignored on import. Import creates **no** Devis.
13. Idempotence: unique `importKey` = stable hash of `(exercice, month, sheetRowNumber, pharmacyLabel, candidateLabel)` — independent of file name. Re-import **skips** existing keys (no upsert) so manual links are preserved.
14. Pilotage union with Mission Devis unchanged (CRM CA empty today). Import never double-counts Devis.
15. CLI like Syncro: dry-run default, explicit `--apply`, transactional. Source `excel-import` vs `ui`.

Rejected: stub « À lier » entities; dedupe Placement to one hire; UI xlsx upload in V1; upsert on re-import.

## Consequences

- Unlinked lines still book CA/Marge in Pilotage; lists show Excel labels when FKs are null.
- Direction links Pharmacy/Candidate by hand (`finance.view`); filter « non liées ».
- `importKey` unique prevents duplicate rows on re-apply.
- Import never generates a Devis.

Amends ADR 0017.

# Pharmacy scrape lives beside Pharmacy, never linked

Recruiters need EDITH « Base Pharmacies » emails in CRM for consultation without polluting the Pharmacy portefeuille (no SIRET, CP is mostly a department, multi-email per label).

**Decision:** persist **Pharmacy scrape** rows in a dedicated table, UI tab **Base emails** on `/pharmacies`. Zero FK/write to Pharmacy. Upsert on normalized email + provenance; rows missing from a newer file are kept; soft-delete hides until the same key reappears in an import (file reactivates). Fixed EDITH columns only. Import/delete = Direction + RH-Admin; all roles consult (copy only).

Rejected: enrich Pharmacy/Contact from EDITH; wipe-on-import; email-only upsert (would erase mail duplicates); Gmail compose / ActivityLog from scrape rows.

# Ligne de suivi books CA without an accepted Devis

Facturation was Mission → Devis only. Placement work is often booked without quoting. op-medijob entered financial lines from Facturation with pharmacy + candidate.

Decision: **Ligne de suivi** (`FinanceLine`) is its own persisted entity. Pharmacy + Candidate required, Mission optional. Kind Placement (one line = one placement) or Intérim (one line = the whole mission). CA and Marge book on `occurredAt`. Direction / RH-Admin only (`finance.view`). A Devis can be generated from the line with or without a Mission (`Devis.missionId` optional); without a Mission the PDF and activity sit on the Pharmacy. The generated Devis is a DRAFT document and must not be counted again as CA. Not a legal invoice entity.

Ligne de suivi ≠ Devis ≠ Facture.

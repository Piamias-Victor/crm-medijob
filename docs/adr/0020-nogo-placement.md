# NoGo is a Placement follow-up flag, not Mission ANNULEE

Pilotage needs the op-medijob conversion gauge: a CDD/CDI hire that was cancelled, or booked with 0 CA and 0 Marge, is lost. Lost CA is projected from the average billed CA of that type.

Decision: **NoGo** applies only to Placement lines. Cancel lives on the Ligne de suivi as a **reversible status** (the line stays visible; it is not a soft delete — ADR 0007 still applies to true deletion). A 0 CA / 0 Marge Placement is also NoGo. Intérim is never NoGo. Mission status ANNULEE still zeros Mission Devis CA and does not by itself cancel a Ligne. Rejected: skip NoGo; rejected: cancel-only without zero-amount lines.

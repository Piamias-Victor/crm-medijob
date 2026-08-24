# Facturé and Encaissé marks on a Ligne de suivi

op-medijob had two independent booleans on a placement (`facture`, `encaisse`). CRM Commercial status already uses Facturé as `invoicedAt` on an accepted Devis. The finance PRD excluded a legal Invoice entity and payments.

Decision: a Ligne de suivi has **Facturé** (invoice sent) and **Encaissé** (paid), independent of Devis Commercial status. Marks do not move CA (still booked on the line date). Not a Facture entity. Vue d'ensemble keeps Devis pipeline counts. Rejected: no marks on the line; rejected: Facturé-only without Encaissé.

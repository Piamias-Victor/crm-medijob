-- Drop unused PharmacyType column (ADR 0002 — affiliation via Groupement only).
ALTER TABLE "Pharmacy" DROP COLUMN IF EXISTS "type";
DROP TYPE IF EXISTS "PharmacyType";

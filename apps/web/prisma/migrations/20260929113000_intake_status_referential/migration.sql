-- CreateTable
CREATE TABLE "IntakeStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeStatus_pkey" PRIMARY KEY ("id")
);

-- Seed legacy enum values as stable ids
INSERT INTO "IntakeStatus" ("id", "name", "color", "position", "createdAt", "updatedAt") VALUES
  ('A_APPELER', 'À appeler', '#FEF3C7', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('DOSSIER_INCOMPLET', 'Dossier incomplet', '#FFEDD5', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('A_RELANCER', 'À relancer', '#DBEAFE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('HORS_ZONE', 'Hors zone', '#E5E7EB', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable: migrate enum column to FK
ALTER TABLE "AppProfile" ADD COLUMN "intakeStatusId" TEXT;

UPDATE "AppProfile" SET "intakeStatusId" = "intakeStatus"::text;

ALTER TABLE "AppProfile" ALTER COLUMN "intakeStatusId" SET NOT NULL;
ALTER TABLE "AppProfile" ALTER COLUMN "intakeStatusId" SET DEFAULT 'A_APPELER';

DROP INDEX IF EXISTS "AppProfile_intakeStatus_idx";
ALTER TABLE "AppProfile" DROP COLUMN "intakeStatus";

DROP TYPE "AppIntakeStatus";

CREATE INDEX "IntakeStatus_position_idx" ON "IntakeStatus"("position");
CREATE INDEX "IntakeStatus_archivedAt_idx" ON "IntakeStatus"("archivedAt");
CREATE INDEX "AppProfile_intakeStatusId_idx" ON "AppProfile"("intakeStatusId");

ALTER TABLE "AppProfile" ADD CONSTRAINT "AppProfile_intakeStatusId_fkey"
  FOREIGN KEY ("intakeStatusId") REFERENCES "IntakeStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

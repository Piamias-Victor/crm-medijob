-- CreateEnum
CREATE TYPE "AppIntakeStatus" AS ENUM ('A_APPELER', 'DOSSIER_INCOMPLET', 'A_RELANCER', 'HORS_ZONE');

-- CreateEnum
CREATE TYPE "AppCallOutcome" AS ENUM ('MESSAGERIE', 'RDV_PRIS', 'A_RAPPELER', 'PAS_INTERESSE', 'HORS_CIBLE', 'PAS_DE_REPONSE');

-- AlterTable
ALTER TABLE "AppProfile" ADD COLUMN "intakeStatus" "AppIntakeStatus" NOT NULL DEFAULT 'A_APPELER';
ALTER TABLE "AppProfile" ADD COLUMN "callOutcome" "AppCallOutcome";
ALTER TABLE "AppProfile" ADD COLUMN "plannedRdvAt" TIMESTAMP(3);
ALTER TABLE "AppProfile" ADD COLUMN "notes" TEXT;

-- CreateIndex
CREATE INDEX "AppProfile_intakeStatus_idx" ON "AppProfile"("intakeStatus");

-- CreateEnum
CREATE TYPE "FinanceLineSource" AS ENUM ('UI', 'EXCEL_IMPORT');

-- AlterTable
ALTER TABLE "FinanceLine" ADD COLUMN "source" "FinanceLineSource" NOT NULL DEFAULT 'UI';
ALTER TABLE "FinanceLine" ADD COLUMN "pharmacyLabel" TEXT;
ALTER TABLE "FinanceLine" ADD COLUMN "candidateLabel" TEXT;
ALTER TABLE "FinanceLine" ADD COLUMN "referentLabel" TEXT;
ALTER TABLE "FinanceLine" ADD COLUMN "importKey" TEXT;

ALTER TABLE "FinanceLine" DROP CONSTRAINT "FinanceLine_pharmacyId_fkey";
ALTER TABLE "FinanceLine" DROP CONSTRAINT "FinanceLine_candidateId_fkey";
ALTER TABLE "FinanceLine" ALTER COLUMN "pharmacyId" DROP NOT NULL;
ALTER TABLE "FinanceLine" ALTER COLUMN "candidateId" DROP NOT NULL;
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "FinanceLine_importKey_key" ON "FinanceLine"("importKey");
CREATE INDEX "FinanceLine_source_idx" ON "FinanceLine"("source");

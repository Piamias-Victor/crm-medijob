-- CreateEnum
CREATE TYPE "FinanceLineKind" AS ENUM ('PLACEMENT', 'INTERIM');

-- CreateTable
CREATE TABLE "FinanceLine" (
    "id" TEXT NOT NULL,
    "kind" "FinanceLineKind" NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "missionId" TEXT,
    "devisId" TEXT,
    "amountHt" DOUBLE PRECISION NOT NULL,
    "marge" DOUBLE PRECISION,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinanceLine_devisId_key" ON "FinanceLine"("devisId");

-- CreateIndex
CREATE INDEX "FinanceLine_pharmacyId_idx" ON "FinanceLine"("pharmacyId");

-- CreateIndex
CREATE INDEX "FinanceLine_candidateId_idx" ON "FinanceLine"("candidateId");

-- CreateIndex
CREATE INDEX "FinanceLine_missionId_idx" ON "FinanceLine"("missionId");

-- CreateIndex
CREATE INDEX "FinanceLine_deletedAt_idx" ON "FinanceLine"("deletedAt");

-- CreateIndex
CREATE INDEX "FinanceLine_occurredAt_idx" ON "FinanceLine"("occurredAt");

-- AddForeignKey
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "Devis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

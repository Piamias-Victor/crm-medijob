-- AlterTable
ALTER TABLE "FinanceLine" ADD COLUMN "referentId" TEXT;
ALTER TABLE "FinanceLine" ADD COLUMN "placementContractType" "ContractType";
ALTER TABLE "FinanceLine" ADD COLUMN "cancelled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "FinanceLine" ADD COLUMN "invoiced" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "FinanceLine" ADD COLUMN "paid" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "FinanceLine_referentId_idx" ON "FinanceLine"("referentId");

-- AddForeignKey
ALTER TABLE "FinanceLine" ADD CONSTRAINT "FinanceLine_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

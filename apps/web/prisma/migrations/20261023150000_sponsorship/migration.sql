-- AlterTable
ALTER TABLE "Pharmacy" ADD COLUMN "sponsorId" TEXT;

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "sponsorId" TEXT;

-- CreateIndex
CREATE INDEX "Pharmacy_sponsorId_idx" ON "Pharmacy"("sponsorId");

-- CreateIndex
CREATE INDEX "Candidate_sponsorId_idx" ON "Candidate"("sponsorId");

-- AddForeignKey
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Pharmacy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

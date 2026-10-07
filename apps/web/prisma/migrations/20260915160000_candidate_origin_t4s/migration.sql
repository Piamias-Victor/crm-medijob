-- AlterEnum
ALTER TYPE "CandidateOrigin" ADD VALUE 'T4S';

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "t4sId" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "photoUrl" TEXT;
CREATE UNIQUE INDEX "Candidate_t4sId_key" ON "Candidate"("t4sId");

ALTER TABLE "Pharmacy" ADD COLUMN "t4sId" TEXT;
CREATE UNIQUE INDEX "Pharmacy_t4sId_key" ON "Pharmacy"("t4sId");

ALTER TABLE "Contact" ADD COLUMN "t4sId" TEXT;
CREATE UNIQUE INDEX "Contact_t4sId_key" ON "Contact"("t4sId");

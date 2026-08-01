-- AlterTable Candidate: referent optional + SetNull on delete
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_referentId_fkey";
ALTER TABLE "Candidate" ALTER COLUMN "referentId" DROP NOT NULL;
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable Mission: referent optional + SetNull on delete
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_referentId_fkey";
ALTER TABLE "Mission" ALTER COLUMN "referentId" DROP NOT NULL;
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable Pharmacy: add optional referent
ALTER TABLE "Pharmacy" ADD COLUMN "referentId" TEXT;
CREATE INDEX "Pharmacy_referentId_idx" ON "Pharmacy"("referentId");
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable Contact: add optional referent
ALTER TABLE "Contact" ADD COLUMN "referentId" TEXT;
CREATE INDEX "Contact_referentId_idx" ON "Contact"("referentId");
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

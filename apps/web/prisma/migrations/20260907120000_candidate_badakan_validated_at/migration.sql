-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "badakanValidatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Candidate_badakanValidatedAt_idx" ON "Candidate"("badakanValidatedAt");

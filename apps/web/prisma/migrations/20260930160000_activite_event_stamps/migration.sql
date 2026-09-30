-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "qualifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN "pourvuAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BadakanMission" ADD COLUMN "staffedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Candidate_qualifiedAt_idx" ON "Candidate"("qualifiedAt");

-- CreateIndex
CREATE INDEX "Candidate_createdAt_idx" ON "Candidate"("createdAt");

-- CreateIndex
CREATE INDEX "Mission_pourvuAt_idx" ON "Mission"("pourvuAt");

-- CreateIndex
CREATE INDEX "Mission_createdAt_idx" ON "Mission"("createdAt");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- CreateIndex
CREATE INDEX "BadakanMission_staffedAt_idx" ON "BadakanMission"("staffedAt");

-- CreateIndex
CREATE INDEX "BadakanMission_createdAt_idx" ON "BadakanMission"("createdAt");

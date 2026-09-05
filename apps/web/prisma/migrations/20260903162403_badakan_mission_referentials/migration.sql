-- AlterTable
ALTER TABLE "BadakanMission" ADD COLUMN     "jobTitleId" TEXT,
ADD COLUMN     "softwareId" TEXT;

-- CreateIndex
CREATE INDEX "BadakanMission_jobTitleId_idx" ON "BadakanMission"("jobTitleId");

-- AddForeignKey
ALTER TABLE "BadakanMission" ADD CONSTRAINT "BadakanMission_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadakanMission" ADD CONSTRAINT "BadakanMission_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;

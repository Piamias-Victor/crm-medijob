-- AlterTable
ALTER TABLE "BadakanMission" ADD COLUMN     "activityId" TEXT,
ADD COLUMN     "activityLabel" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "expectedRecipients" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hourlyRate" DOUBLE PRECISION,
ADD COLUMN     "identifier" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "reasonLabel" TEXT,
ADD COLUMN     "softwareLabel" TEXT,
ADD COLUMN     "staffedRecipients" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "BadakanMission_activityId_idx" ON "BadakanMission"("activityId");

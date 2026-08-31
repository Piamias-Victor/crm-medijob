-- CreateTable
CREATE TABLE "BadakanMission" (
    "id" TEXT NOT NULL,
    "badakanId" TEXT NOT NULL,
    "pharmacyName" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "periods" JSONB NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BadakanMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadakanSearchApplied" (
    "id" TEXT NOT NULL,
    "badakanMissionId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BadakanSearchApplied_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadakanMission_badakanId_key" ON "BadakanMission"("badakanId");
CREATE INDEX "BadakanMission_step_idx" ON "BadakanMission"("step");
CREATE INDEX "BadakanMission_syncedAt_idx" ON "BadakanMission"("syncedAt");
CREATE UNIQUE INDEX "BadakanSearchApplied_badakanMissionId_recipientId_key" ON "BadakanSearchApplied"("badakanMissionId", "recipientId");
CREATE INDEX "BadakanSearchApplied_badakanMissionId_idx" ON "BadakanSearchApplied"("badakanMissionId");

-- AddForeignKey
ALTER TABLE "BadakanSearchApplied" ADD CONSTRAINT "BadakanSearchApplied_badakanMissionId_fkey" FOREIGN KEY ("badakanMissionId") REFERENCES "BadakanMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

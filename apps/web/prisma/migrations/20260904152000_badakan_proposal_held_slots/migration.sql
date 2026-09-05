-- CreateTable
CREATE TABLE "BadakanProposalHeldSlot" (
    "id" TEXT NOT NULL,
    "badakanMissionId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "period" "WeeklyAvailabilityPeriod" NOT NULL,

    CONSTRAINT "BadakanProposalHeldSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BadakanProposalHeldSlot_badakanMissionId_candidateId_idx" ON "BadakanProposalHeldSlot"("badakanMissionId", "candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "BadakanProposalHeldSlot_badakanMissionId_candidateId_date_period_key" ON "BadakanProposalHeldSlot"("badakanMissionId", "candidateId", "date", "period");

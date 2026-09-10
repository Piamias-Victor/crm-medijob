-- CreateTable
CREATE TABLE "BadakanPharmacyApplyEmail" (
    "id" TEXT NOT NULL,
    "missionBadakanId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadakanPharmacyApplyEmail_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BadakanPharmacyApplyEmail_missionBadakanId_recipientId_key" ON "BadakanPharmacyApplyEmail"("missionBadakanId", "recipientId");
CREATE INDEX "BadakanPharmacyApplyEmail_missionBadakanId_idx" ON "BadakanPharmacyApplyEmail"("missionBadakanId");

-- Existing SEARCH_APPLIED applicants already applied; stamp the journal without sending.
INSERT INTO "BadakanPharmacyApplyEmail" ("id", "missionBadakanId", "recipientId", "sentAt", "createdAt")
SELECT
    'seed_' || m."badakanId" || '_' || a."recipientId",
    m."badakanId",
    a."recipientId",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "BadakanSearchApplied" a
JOIN "BadakanMission" m ON m."id" = a."badakanMissionId"
ON CONFLICT ("missionBadakanId", "recipientId") DO NOTHING;

-- AlterTable
ALTER TABLE "BadakanMission" ADD COLUMN "enterpriseId" TEXT;
CREATE INDEX "BadakanMission_enterpriseId_idx" ON "BadakanMission"("enterpriseId");

-- CreateTable
CREATE TABLE "BadakanEnterprise" (
    "id" TEXT NOT NULL,
    "badakanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siret" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "principalFirstName" TEXT,
    "principalLastName" TEXT,
    "principalEmail" TEXT,
    "principalPhone" TEXT,
    "pharmacyId" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BadakanEnterprise_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BadakanEnterprise_badakanId_key" ON "BadakanEnterprise"("badakanId");
CREATE INDEX "BadakanEnterprise_verifiedAt_idx" ON "BadakanEnterprise"("verifiedAt");
CREATE INDEX "BadakanEnterprise_pharmacyId_idx" ON "BadakanEnterprise"("pharmacyId");
CREATE INDEX "BadakanEnterprise_syncedAt_idx" ON "BadakanEnterprise"("syncedAt");

ALTER TABLE "BadakanEnterprise" ADD CONSTRAINT "BadakanEnterprise_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

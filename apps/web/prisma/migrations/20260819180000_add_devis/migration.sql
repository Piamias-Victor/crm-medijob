-- CreateEnum
CREATE TYPE "DevisKind" AS ENUM ('INTERIM', 'CDD', 'CDI');

-- CreateEnum
CREATE TYPE "DevisStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "DevisHtSource" AS ENUM ('ENGINE', 'TYPED');

-- CreateTable
CREATE TABLE "Devis" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "kind" "DevisKind" NOT NULL,
    "status" "DevisStatus" NOT NULL DEFAULT 'DRAFT',
    "hours" DOUBLE PRECISION,
    "hourlyRate" DOUBLE PRECISION,
    "amountHt" DOUBLE PRECISION,
    "amountTtc" DOUBLE PRECISION,
    "htSource" "DevisHtSource" NOT NULL DEFAULT 'TYPED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Devis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Devis_missionId_idx" ON "Devis"("missionId");

-- CreateIndex
CREATE INDEX "Devis_deletedAt_idx" ON "Devis"("deletedAt");

-- CreateIndex
CREATE INDEX "Devis_status_idx" ON "Devis"("status");

-- AddForeignKey
ALTER TABLE "Devis" ADD CONSTRAINT "Devis_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "ConsentSource" AS ENUM ('SITE', 'MANUAL', 'IMPORT');

-- AlterTable Candidate
ALTER TABLE "Candidate" ADD COLUMN "consentGivenAt" TIMESTAMP(3),
ADD COLUMN "consentSource" "ConsentSource";

-- AlterTable Application
ALTER TABLE "Application" ADD COLUMN "consentGivenAt" TIMESTAMP(3),
ADD COLUMN "consentSource" "ConsentSource";

-- CreateTable
CREATE TABLE "GdprEraseAudit" (
    "id" TEXT NOT NULL,
    "entityType" "DocumentEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "erasedByUserId" TEXT NOT NULL,
    "erasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "GdprEraseAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GdprEraseAudit_entityType_entityId_idx" ON "GdprEraseAudit"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "GdprEraseAudit_erasedAt_idx" ON "GdprEraseAudit"("erasedAt");

-- AddForeignKey
ALTER TABLE "GdprEraseAudit" ADD CONSTRAINT "GdprEraseAudit_erasedByUserId_fkey" FOREIGN KEY ("erasedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

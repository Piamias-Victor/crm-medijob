-- AlterTable
ALTER TABLE "AppProfile" ADD COLUMN     "referentId" TEXT,
ADD COLUMN     "relanceAt" TIMESTAMP(3),
ADD COLUMN     "lastCalledAt" TIMESTAMP(3),
ADD COLUMN     "lastCalledById" TEXT;

-- Backfill arrival relance for existing rows
UPDATE "AppProfile" SET "relanceAt" = "createdAt" WHERE "relanceAt" IS NULL;

-- CreateIndex
CREATE INDEX "AppProfile_referentId_idx" ON "AppProfile"("referentId");

-- CreateIndex
CREATE INDEX "AppProfile_relanceAt_idx" ON "AppProfile"("relanceAt");

-- AddForeignKey
ALTER TABLE "AppProfile" ADD CONSTRAINT "AppProfile_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppProfile" ADD CONSTRAINT "AppProfile_lastCalledById_fkey" FOREIGN KEY ("lastCalledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

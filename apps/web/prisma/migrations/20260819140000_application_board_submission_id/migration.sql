-- AlterTable
ALTER TABLE "Application" ADD COLUMN "boardSubmissionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Application_boardSubmissionId_key" ON "Application"("boardSubmissionId");

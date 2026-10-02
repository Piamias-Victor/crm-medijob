-- AlterEnum
CREATE TYPE "ApplicationSource" AS ENUM ('BOARD_INGEST', 'PUBLIC_APPLY');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "postalCode" TEXT,
ADD COLUMN "source" "ApplicationSource" NOT NULL DEFAULT 'BOARD_INGEST';

-- CreateIndex
CREATE INDEX "Application_source_idx" ON "Application"("source");

-- AlterTable
ALTER TABLE "Devis" ADD COLUMN "sentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Devis_sentAt_idx" ON "Devis"("sentAt");

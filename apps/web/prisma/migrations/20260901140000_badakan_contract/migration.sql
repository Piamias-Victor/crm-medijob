-- CreateTable
CREATE TABLE "BadakanContract" (
    "id" TEXT NOT NULL,
    "badakanId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "dpaeUrl" TEXT,
    "recipientName" TEXT NOT NULL,
    "pharmacyName" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BadakanContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadakanContract_badakanId_key" ON "BadakanContract"("badakanId");
CREATE INDEX "BadakanContract_status_idx" ON "BadakanContract"("status");
CREATE INDEX "BadakanContract_syncedAt_idx" ON "BadakanContract"("syncedAt");

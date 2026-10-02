-- CreateTable
CREATE TABLE "PublicApplyRateLimit" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicApplyRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicApplyRateLimit_ipHash_key" ON "PublicApplyRateLimit"("ipHash");

-- CreateIndex
CREATE INDEX "PublicApplyRateLimit_windowStartedAt_idx" ON "PublicApplyRateLimit"("windowStartedAt");

-- CreateTable
CREATE TABLE "PharmacyScrape" (
    "id" TEXT NOT NULL,
    "provenance" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "city" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyScrape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyScrape_email_provenance_key" ON "PharmacyScrape"("email", "provenance");

-- CreateIndex
CREATE INDEX "PharmacyScrape_deletedAt_idx" ON "PharmacyScrape"("deletedAt");

-- CreateIndex
CREATE INDEX "PharmacyScrape_department_idx" ON "PharmacyScrape"("department");

-- CreateIndex
CREATE INDEX "PharmacyScrape_provenance_idx" ON "PharmacyScrape"("provenance");

-- CreateIndex
CREATE INDEX "PharmacyScrape_email_idx" ON "PharmacyScrape"("email");

-- CreateIndex
CREATE INDEX "PharmacyScrape_name_idx" ON "PharmacyScrape"("name");

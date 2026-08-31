-- CreateEnum
CREATE TYPE "WeeklyAvailabilityPeriod" AS ENUM ('AM', 'PM');

-- CreateTable
CREATE TABLE "WeeklyAvailabilityToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyAvailabilityToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyAvailabilityWeek" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyAvailabilityWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyAvailabilitySlot" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "period" "WeeklyAvailabilityPeriod" NOT NULL,

    CONSTRAINT "WeeklyAvailabilitySlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyAvailabilityToken_token_key" ON "WeeklyAvailabilityToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyAvailabilityToken_candidateId_key" ON "WeeklyAvailabilityToken"("candidateId");

-- CreateIndex
CREATE INDEX "WeeklyAvailabilityWeek_candidateId_idx" ON "WeeklyAvailabilityWeek"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyAvailabilityWeek_candidateId_weekStart_key" ON "WeeklyAvailabilityWeek"("candidateId", "weekStart");

-- CreateIndex
CREATE INDEX "WeeklyAvailabilitySlot_weekId_idx" ON "WeeklyAvailabilitySlot"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyAvailabilitySlot_weekId_date_period_key" ON "WeeklyAvailabilitySlot"("weekId", "date", "period");

-- AddForeignKey
ALTER TABLE "WeeklyAvailabilityToken" ADD CONSTRAINT "WeeklyAvailabilityToken_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyAvailabilityWeek" ADD CONSTRAINT "WeeklyAvailabilityWeek_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyAvailabilitySlot" ADD CONSTRAINT "WeeklyAvailabilitySlot_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "WeeklyAvailabilityWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

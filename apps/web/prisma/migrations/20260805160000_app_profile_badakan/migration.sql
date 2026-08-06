-- CreateEnum
CREATE TYPE "AppProfileStatus" AS ENUM ('EN_ATTENTE', 'ACCEPTE', 'IGNORE');

-- CreateTable
CREATE TABLE "AppProfile" (
    "id" TEXT NOT NULL,
    "badakanId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "activityLabel" TEXT,
    "jobTitleId" TEXT,
    "snapshot" JSONB,
    "status" "AppProfileStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "candidateId" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppProfile_badakanId_key" ON "AppProfile"("badakanId");

-- CreateIndex
CREATE INDEX "AppProfile_status_idx" ON "AppProfile"("status");

-- CreateIndex
CREATE INDEX "AppProfile_candidateId_idx" ON "AppProfile"("candidateId");

-- AddForeignKey
ALTER TABLE "AppProfile" ADD CONSTRAINT "AppProfile_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppProfile" ADD CONSTRAINT "AppProfile_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

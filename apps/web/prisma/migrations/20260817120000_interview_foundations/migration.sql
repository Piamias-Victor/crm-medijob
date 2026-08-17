-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('DRAFT', 'CLOSED');
CREATE TYPE "InterviewMode" AS ENUM ('INTERIM', 'CDD_CDI');
CREATE TYPE "InterviewDecision" AS ENUM ('ELIGIBLE', 'NON_ELIGIBLE', 'REVIEW');

-- AlterTable
ALTER TABLE "JobTitle" ADD COLUMN "profileKey" TEXT;
CREATE UNIQUE INDEX "JobTitle_profileKey_key" ON "JobTitle"("profileKey");

-- Align JobTitle labels with Interview profiles
UPDATE "JobTitle" SET name = 'Étudiant en pharmacie' WHERE name = 'Étudiant pharma';
UPDATE "JobTitle" SET name = 'Rayonniste' WHERE name = 'Rayoniste';

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'DRAFT',
    "mode" "InterviewMode" NOT NULL,
    "decision" "InterviewDecision",
    "answers" JSONB NOT NULL DEFAULT '{}',
    "scores" JSONB NOT NULL DEFAULT '{}',
    "candidateId" TEXT NOT NULL,
    "referentId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Interview_candidateId_idx" ON "Interview"("candidateId");
CREATE INDEX "Interview_deletedAt_idx" ON "Interview"("deletedAt");

ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey"
  FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_referentId_fkey"
  FOREIGN KEY ("referentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "InterviewTemplate" (
    "id" TEXT NOT NULL,
    "profileKey" TEXT NOT NULL,
    "mode" "InterviewMode" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "label" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InterviewTemplate_profileKey_mode_version_key"
  ON "InterviewTemplate"("profileKey", "mode", "version");
CREATE INDEX "InterviewTemplate_profileKey_mode_idx"
  ON "InterviewTemplate"("profileKey", "mode");
